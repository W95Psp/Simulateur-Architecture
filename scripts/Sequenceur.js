function Sequenceur(archi){
	this.architecture = archi;
	this.reset(true);
}
Sequenceur.prototype.reset = function(memAlso){
	this.phase = this.Aig1 = this.Aig2 = this.Aig3 = this.COP_MA = this.condition = 0;
	this.addrDebutFetch = 498;
	this.addr = 0;
	if(!this.instruct)
		this.instruct = {};
	for(var i in this.instruct)
		delete this.instruct[i];
	if(memAlso){
		if(!this.mem)
			this.mem = new Array();
		var i=501;
		while(i--)this.resetInstruct(i);
	}
	if(!this.useWires)
		this.useWires = new Array();
	this.DudePleaseDoNotUseWires();
};
Sequenceur.prototype.readInstruct = function(line){
	if(this.mem[line])
		return this.mem[line];
	return {};
};
Sequenceur.prototype.writeInstruct = function(things, line){
	for(var i in things)
		this.mem[line][things[i]] = true;
};
Sequenceur.prototype.resetInstruct = function(line){
	if(this.mem[line])
		for(var i in this.mem[line])
			delete this.mem[line][i];
	else
		this.mem[line] = {};
	this.mem[line].Adresse = line;
};
Sequenceur.prototype.DudePleaseDoNotUseWires = function(){
	for(var i=1; i<15; i++)
		this.useWires[i] = false;
};
Sequenceur.prototype.UseWires = function(list){
	for(var i in list)
		this.useWires[list[i]] = true;
};
Sequenceur.prototype.isW = function(i){
	return this.useWires[i]==true;
};
Sequenceur.prototype.update = function(){
	this.DudePleaseDoNotUseWires();
	var addr;
	this.COP_MA = parseInt(parseInt(this.architecture.registres.RI.currentValue)/10000);
	if(this.instruct.FIN)
		this.phase = 0;
	this.phase++;
	if(!this.instruct.SelMS || this.instruct.SelMS<=0)
		this.instruct.SelMS=1;
	this.Aig1 = this.phase!=1;
	this.Aig2 = (parseInt(this.instruct.SelMS)-1)%4+1;
	this.Aig3 = this.condition;
	if(this.Aig1==0){
		this.UseWires([8, 9, 11, 12]);
		addr = this.addrDebutFetch;
	}else{
		this.UseWires([10, 11, 12]);
		if(this.Aig2==1){
			this.UseWires([2, 3]);
			addr = this.addr+1;
		}else if(this.Aig2==2){
			this.UseWires([4]);
			if(this.Aig1==0){
				this.UseWires([1]);
				addr = this.addr+1;
			}else{
				this.UseWires([5, 6]);
				addr = this.instruct.AdrSuiv;
			}
		}else if(this.Aig2==3){
			this.UseWires([13]);
			addr = this.COP_MA;
		}else if(this.Aig2==4){
			this.UseWires([6]);
			addr = this.instruct.AdrSuiv;
		}
	}
	this.addr = addr;
	for(var i in this.instruct)
		delete this.instruct[i];
	var instruct = this.readInstruct(this.addr);
	for(var i in instruct)
		this.instruct[i] = instruct[i];
	// if(this.architecture){
	for(var key in this.instruct)
		if(this.instruct[key])
			this.architecture.signal(key);
	this.architecture.FaireCycle();
	// }
	// Pas portable du tout :
	this.COP_MA = parseInt(parseInt(this.architecture.registres.RI.currentValue)/10000);
	global.archiSC.$apply();
};
