
var archiApp = angular.module('archiApp', []);

var SC;
var global = {};
global.ArchiObj = new Architecture();
global.SeqObj = new Sequenceur(global.ArchiObj);

//Fetch
global.SeqObj.writeInstruct(['COB1', 'XS', 'eRAM'],498);
global.SeqObj.writeInstruct(['sM'],499);
global.SeqObj.writeInstruct(['REB1', 'XS', 'eRI'],500);
global.SeqObj.mem[500].SelMS = 3;

//Instruction de test
global.SeqObj.writeInstruct(['RIB1', 'XS', 'eA'], 5);
global.SeqObj.writeInstruct(['ADDX', 'eX', 'XB1', 'AB2'], 6);
global.SeqObj.mem[6].FIN = true;

global.ArchiObj.registres.Stack.currentValue = 149;
global.stack = new Array();
for(var i=0; i<150; i++)
	global.stack.push(0);
global.stackPointer = 149;
global.otherWin = new Array();

archiApp.controller('Ctrl', function($scope){
	SC = $scope;
	
	var eventWin = function(button){
		button.open = !button.open;
		if(button.open){
			button.winData = button.win();
			button.winData.onbeforeunload = function(button, SCh){
				return function(){button.open = !button.open; SCh.$apply();};
			}(button, SC);
		}else{
			button.winData.onbeforeunload = function(){};
			button.winData.close();
		}
	};
	
	var archiW = function(){return window.open('pages/archi.html', 'archi', "statusbar=0, status=1, location=1, width=270, height=520");};
	var seqW = function(){return window.open('pages/seq.html', 'Seq', "menubar=no, status=no, scrollbars=no, menubar=no, width=860, height=300");}; 
	
	$scope.homeCategories = [
		{name: ' ', buttons: [
				{name: 'Architecture', img: 'archi.png', open: false, event: eventWin,
					win: archiW},
				{name: 'Séquenceur', img: 'seq.png',  open: false, event: eventWin,
					win: seqW},
				{name: 'Mémoire', img: 'mem.png',  open: false, event: eventWin,
					win: function(){return window.open('pages/mem.html', 'Mem', "menubar=no, status=no, scrollbars=no, location=1, menubar=no, width=700, height=300")}},
				{name: 'Pile', img: 'stack.png',  open: false, event: eventWin,
					win: function(){return window.open('pages/stack.html', 'Stack', "menubar=no, status=no, location=1, scrollbars=no, menubar=no, width=400, height=700")}},
				{name: 'Aide', img: 'help.png',  open: false, event: eventWin,
					win: function(){return window.open('pages/help.html', 'Help',"menubar=no, resizable=no, status=no, location=1, scrollbars=no, menubar=no, width=600, height=360")}}
			]}//,
		// {name: ' ', buttons: []},
		// {name: ' ', buttons: []}
	];
	// for(var i in $scope.homeCategories[0].buttons)
		// $scope.homeCategories[0].buttons[i].winData('close', function(button, scope){
			// return function(){
				// this.hide();
				// button.open = !button.open;
				// scope.$apply();
			// };
		// }($scope.homeCategories[0].buttons[i], $scope));
	$scope.clickButton = function(button){
		if(button.event)
			button.event(button);
	}
});


 

// var MainWin = gui.Window.get();
	// MainWin.setResizable(false);

// MainWin.on('close', function(){
	// if(confirm("Voulez vous vraiment fermer l'application ?")){
		// this.hide();
		// for(var i in SC.homeCategories[0].buttons)
			// SC.homeCategories[0].buttons[i].win.hide();
		// for(var i in global.otherWin)
			// global.otherWin[i].hide();
		// for(var i in SC.homeCategories[0].buttons)
			// SC.homeCategories[0].buttons[i].win.close(true);
		// for(var i in global.otherWin)
			// global.otherWin[i].close(true);
		// this.close(true);
	// }
// });

document.onkeydown = function(e){
	// if(e.keyCode==123)
		// MainWin.showDevTools();
	if(e.keyCode==65)
		document.getElementById('header').setAttribute('state', 'next');
	else if(e.keyCode==90)
		document.getElementById('header').setAttribute('state', 'next_');
	else
		console.log('Touche : '+e.keyCode);
}
