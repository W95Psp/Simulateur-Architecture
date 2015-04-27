function Registre(index, cut){
	this.cut = cut;
	this.currentValue = 0, this.newValue = [false, 0], this.index = index, this.isUsed = [false,false, false];
}Registre.prototype.getValue = function(){
	if(!this.cut)
		return this.currentValue;
	else{
		return parseInt(this.currentValue)%10000;
	}
};Registre.prototype.setValue = function(newValue){
	this.newValue[0] = true;
	this.newValue[1] = newValue;
};Registre.prototype.doFlipFlop = function(){
	if(this.newValue[0]==true)
		this.currentValue = this.newValue[1];
	this.newValue[0] = false;
};
Registre.prototype.reset = function(){
	this.currentValue = 0;
	this.newValue[0] = false;
	this.newValue[1] = 0;
	this.isUsed[0]=this.isUsed[1]=this.isUsed[2]=false;
}

function Architecture(){
	this.registres = {RAM: new Registre(0), RE: new Registre(1), CO: new Registre(2),
		X: new Registre(3), A: new Registre(4), B: new Registre(5), Stack: new Registre(8),
		C: new Registre(6), D: new Registre(7), RI: new Registre(9, true)};
	this.bufferSignaux = {calcs: new Array(), inputs: new Array(), outputs: new Array()};
	this.memory = new Array();
	for(var i=0; i<500; i++)
		this.memory.push([false]);
		
	this.calcs = {
		XS: {
				fun: function(a){return a;},
				index: 0, desc: 'S = X',
				isUsed: false
			},
		ADDX: {
				fun: function(a,b){return a+b;},
				index: 1, desc: 'S = X + Y',
				isUsed: false
			},
		YS: {
				fun: function(a,b){return b;},
				index: 2, desc: 'S = Y',
				isUsed: false
			},
		XP1: {
				fun: function(a){return a+1;},
				index: 3, desc: 'S = X + 1',
				isUsed: false
			}
	}
}
Architecture.prototype.reset = function(){
	for(var i in this.registres)
			this.registres[i].reset();
};
Architecture.prototype.setMemAt = function(addr, value){
	if(global.seqSC)//Si un séquenceur est détecté... Bon oui, c'est moche comme ça.
		global.seqSC.$apply();
		
	if(!this.memory[addr])
		this.memory[addr] = [true, value];
	this.memory[addr][1] = value;
};Architecture.prototype.getMemAt = function(addr, value){
	if(!this.memory[addr] || !this.memory[addr][1])
		return 0;
	return this.memory[addr][1];
};Architecture.prototype.signaux = function(/* ... */){
	console.log(this);
	for(var i in arguments)
		this.signal(arguments[i]);
};Architecture.prototype.signal = function(s){
	if(s.substr(0,1)=='e'){//Entrée mémoire
		this.bufferSignaux.inputs.push({registre: this.registres[s.substr(1)], operation: 'write'});
	}else if(s.substr(-2,1)=='B' && parseInt(s.substr(-1))+''==s.substr(-1)){//Sortie registre
		this.bufferSignaux.outputs.push({registre: this.registres[s.substr(0, s.length-2)], operation: 'out', canal: parseInt(s.substr(-1))-1});
	}else if(s=='sM'){//Sortie mémoire
		this.bufferSignaux.inputs.push('sM');
	}else if(s=='eM'){//Ecriture mémoire
		this.bufferSignaux.outputs.push('eM');
	}else if(s=='sSTACK'){//Sortie mémoire
		this.bufferSignaux.inputs.push('sSTACK');
	}else if(s=='eSTACK'){//Ecriture mémoire
		this.bufferSignaux.outputs.push('eSTACK');
	}else{//Calc
		if(this.calcs[s])
			this.bufferSignaux.calcs.push(this.calcs[s]);
		//else
			//console.error("[Architecture.prototype.signal] Erreur, la propriété "+s+" n'existe pas dans le dictionnaire calcs lié à l'objet courant.");
	}
};
Architecture.prototype.FaireCycle = function(){
	for(var i in this.registres)
		this.registres[i].isUsed[0]=this.registres[i].isUsed[1]=this.registres[i].isUsed[2]=false;
	for(var i in this.calcs)
		this.calcs[i].isUsed = false;

	var busSortie = ['none', 'none'], busEntree = 0;
	for(var i in this.bufferSignaux.outputs)
		if(this.bufferSignaux.outputs[i]=='eM')
			this.setMemAt(this.registres.RAM.getValue(), this.registres.RE.getValue());
		else if(this.bufferSignaux.outputs[i]=='eSTACK')
			this.setMemAt(this.registres.Stack.getValue(), this.registres.RAM.getValue());
		else{
			busSortie[this.bufferSignaux.outputs[i].canal] = this.bufferSignaux.outputs[i].registre.getValue();
			this.bufferSignaux.outputs[i].registre.isUsed[this.bufferSignaux.outputs[i].canal+1] = true;
		}
	for(var i in this.bufferSignaux.calcs){
		busEntree = this.bufferSignaux.calcs[i].fun(busSortie[0], busSortie[1]);
		this.bufferSignaux.calcs[i].isUsed = true;
	}
		
	for(var i in this.bufferSignaux.inputs)
		if(this.bufferSignaux.inputs[i]=='sM')
			this.registres.RE.setValue(this.getMemAt(this.registres.RAM.getValue()));
		else if(this.bufferSignaux.inputs[i]=='sSTACK')
			this.registres.RE.setValue(this.getMemAt(this.registres.Stack.getValue()));
		else{
			this.bufferSignaux.inputs[i].registre.setValue(busEntree);
			this.bufferSignaux.inputs[i].registre.isUsed[0] = true;
		}
	
	for(var i in this.bufferSignaux)
		while(this.bufferSignaux[i].length)
			this.bufferSignaux[i].pop();
	
	for(var i in this.registres)
		this.registres[i].doFlipFlop();
};

Architecture.prototype.getAllPossibleSignals = function(includeBad){
	var r;
	if(includeBad)
		r = new Array('Adresse','AdrSuiv','SelMS','Cond','FIN', 'eM', 'sM' , 'eSTACK', 'sSTACK', 'Stop');
	else
		r = new Array('FIN', 'eM', 'sM');
	for(var i in this.calcs)
		r.push(i);
	for(var i in this.registres){
		r.push(i+"B1");
		r.push(i+"B2");
		r.push('e'+i);
	}
	return r;
}