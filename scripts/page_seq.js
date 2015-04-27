function readCurrentInstruct(){
	var out = '';
	out += set4num(SC.seq.instruct.AdrSuiv);
	for(var i in SC.things)
		if(i!='AdrSuiv')
			out += '-'+((SC.seq.instruct[SC.things])?1:0);
	return out;
}
function set4num(input) {
	if(!input)
		input = 0;
	input = input+"";
	while(input.length<4)
		input = "0"+input;
	return input;
}
angular.module('archiFilter', []).filter('set4num', function() {
	return set4num;
});
var archiApp = angular.module('archiApp', ['archiFilter']);



var SC;
archiApp.controller('Ctrl', function($scope){
	SC = $scope;
	$scope.mod = function(i, v){
		if(!i[v])
			i[v]=0;
		if(v=='SelMS')
			i[v] = i[v]%4+1;
		else
			i[v] = !i[v];
	}
	$scope.dispFromAddr = 1;
	$scope.seq = window.opener.global.SeqObj;
	window.opener.global.seqSC = $scope;
	
	$scope.readCurrentInstruct = readCurrentInstruct;
	
	$scope.just5Addr = function(o){
		return $scope.dispFromAddr && o.Adresse>=$scope.dispFromAddr && o.Adresse<$scope.dispFromAddr+8;
	}
	$scope.promptN = function(){
		window.prompt(12);
		return 23;
	};
	$scope.archiObj = window.opener.global.ArchiObj;
	$scope.seq.architecture = $scope.archiObj;
	$scope.seqModeState=false;
	$scope.seqMode=2;
	$scope.things = $scope.archiObj.getAllPossibleSignals(true);
	$scope.modify = function(item){
		//window.opener.global.item_Tr = item;
		var win = window.open('modifySeq.html', 'ModifySeq', 'location=1, status=0, statusbar=0, resizable=0, width=700, height=400');
		win.window.item = item;
		window.opener.global.otherWin.push(win);
	}
});
function autoInstruct(){
	SC.seq.update();
	SC.$apply();
	if(!SC.seq.instruct.FIN)
		setTimeout('autoInstruct()', TIME_CONST);
	else{
		SC.seqModeState = false;
		SC.$apply();
	}
}
var TIME_CONST = 600;
function autoAll(){
	SC.seq.update();
	SC.$apply();
	if(SC.seqModeState && !SC.seq.instruct.Stop)
		setTimeout('autoAll()', TIME_CONST);
}
function doThings(){
	
	if(parseInt(SC.seqMode)==2){
		SC.seq.update();
		SC.$apply();
	}else if(parseInt(SC.seqMode)==3){
		SC.seqModeState = true;
		autoInstruct();
	}else if(parseInt(SC.seqMode)==4){
		if(SC.seqModeState = !SC.seqModeState)
			autoAll();
	}
}
function resetSeq(){
	SC.seq.reset();
	SC.$apply();
};
