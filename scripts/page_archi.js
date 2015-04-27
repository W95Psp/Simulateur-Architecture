angular.module('archiFilter', []).filter('set8num', function() {
	return function(input) {
		input = input+"";
		while(input.length<8)
			input = "0"+input;
		return input;
	};
});
angular.module('archiFilter2', []).filter('busColor', function() {
	return function(i, n) {
		for(var j in SC.archi.registres)
			if(SC.archi.registres[j].index<=i && SC.archi.registres[j].isUsed[parseInt(n)-1])
				return true;
		return false;
	};
});
var archiApp = angular.module('archiApp', ['archiFilter', 'archiFilter2']);

var SC;
archiApp.controller('Ctrl', function($scope){
	SC = $scope;
	$scope.config = {
		firstPartLength: 20,
		initPosition: [40, 50],
		moduleLength: 130,
		moduleHeight: 28,
		outSep: 10,
		interModule: 41
		//SUM : config.firstPartLength+config.moduleLength+config.outSep+90
	};
	$scope.countThat = function(that){
		var count = 0;
		for(var i in that)
			count++;
		return count;
	}

	$scope.isCalcUsed = function(){
		for(var i in SC.archi.calcs)
			if(SC.archi.calcs[i].isUsed)
				return true;
		return false;
	}
	$scope.archi = window.opener.global.ArchiObj;
	window.opener.global.archiSC = $scope;
});
document.onkeydown = function(e){
	if(e.keyCode==65){
		var s = prompt("Signaux à envoyer ?").split(' ');
		for(var i in s)
			SC.archi.signal(s[i]);
		SC.archi.FaireCycle();
		SC.$apply();
	}
}