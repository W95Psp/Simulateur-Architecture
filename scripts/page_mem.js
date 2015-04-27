angular.module('archiFilter', []).filter('set7num', function() {
	return function(input) {
		input = input+"";
		while(input.length<7)
			input = "0"+input;
		return input;
	};
});angular.module('archiFilter2', []).filter('genCOPMARA', function() {
	return function(copma, ra) {
		if(!copma)copma=0;
		if(!ra)ra=0;
		copma = copma+"";
		ra = ra+"";
		while(copma.length<3)
			copma = "0"+copma;
		while(ra.length<4)
			ra = "0"+ra;
		return copma+ra;
	};
});angular.module('archiFilter3', []).filter('genCOPMA', function() {
	return function(op, cat, cop, ma, ra, sa, deleteSpace) {
		if(!(cop))
			cop = 0;
		if(!(cat))
			cat = 0;
		if(!(op[cat].content.length>1))
			cop = 0;
		if(!(op[cat].content[cop][1].length>1))
			ma = 0;
		console.log([op, cat, cop, cop||0, ma, parseInt(ma)]);
		var r = ""+(parseInt(op[cat].content[cop || 0][2])+parseInt(ma) || 0);
		while(r.length<3)
			r = '0'+r;
		if(sa){
			if(!ra)ra=0;
			var ras = ra+'';
			if(op[cat].content[cop][1].length>1)
				while(ras.length<4)
					ras = '0'+ras;
			else
				ras = '0000';
			if(deleteSpace)
				return r+ras;
			else
				return r+' '+ras;
		}else
			return r;
	};
});
var memApp = angular.module('memApp', ['archiFilter', 'archiFilter2', 'archiFilter3']);

var SC;

memApp.controller('Ctrl', function($scope){
	SC = $scope;
	$scope.ma = $scope.cop = $scope.cat = 0;
	$scope.MEM = window.opener.global.ArchiObj.memory;
	$scope.MEM[0][0]=true;
	$scope.MEM[0][1]=50087;
	$scope.MEM[0][2]='Essai simple';
	$scope.waddrRed = '';
	$scope.operations = new Array();
	$scope.operations.push({name: 'ADD', content: [['A+B=>B', [], 20],
		['A-B=>B', [], 30],
		['A ET B => B', [], 240],
		['A OU B => B',[], 250],
		['A x B => B', [], 230],
		['A XOR B => B', [], 260],
		['M+A=>A', [1,2,3,4,5,6,7,8,9,10], 0],
		['M+B=>B', [1,2,3,4,5,6,7,8,9,10], 10]]});
	
	$scope.operations.push({name: 'CALL', content: [['CALL', [2,3,4,5,7,8,9,10], 70]]});
	
	$scope.operations.push({name: 'INC', content: [['A', [], 40],
		['B', [], 50],
		['X', [], 60]]});
	
	$scope.operations.push({name: 'JUMP', 
		content: [['Inconditionnel', [2,3,4,5,7,8,9,10], 160],
		['A:Null', [2,3,4,5,7,8,9,10], 170],
		['B:Null', [2,3,4,5,7,8,9,10], 180],
		['A>0', [2,3,4,5,7,8,9,10], 190],
		['B>0', [2,3,4,5,7,8,9,10], 200],
		['A pair', [2,3,4,5,7,8,9,10], 210],
		['B pair', [2,3,4,5,7,8,9,10], 220]]});
		
	$scope.operations.push({name: 'LOAD', content:[
		['A', [1,2,3,4,5,6,7,8,9,10], 80],
		['B', [1,2,3,4,5,6,7,8,9,10], 90],
		['X', [1,2,3,4,5,6,7,8,9,10], 100]]});
	
	
	$scope.operations.push({name: 'NOP', content: [['NOP', [], 110]]});
	
	$scope.operations.push({name: 'RETURN', content: [['RETURN', [2,3,4,5,7,8,9,10], 120]]});
	
	
	$scope.operations.push({name: 'STORE', content: [
		['A', [2,3,4,5,7,8,9,10], 130],
		['B', [2,3,4,5,7,8,9,10], 140],
		['X', [2,3,4,5,7,8,9,10], 150]
		]});
	$scope.modeAdressage = new Array('Immédiat', 'Direct', 'Indirect', 'Indexé', 'Relatif');
	for(var i =0; i<5; i++)
		$scope.modeAdressage.push($scope.modeAdressage[i]+' Etendu');
});