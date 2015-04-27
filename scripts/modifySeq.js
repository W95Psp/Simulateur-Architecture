angular.module('f1', []).filter('set4num', function() {
	return function(input) {
		if(!input)
			input = 0;
		input = input+"";
		while(input.length<4)
			input = "0"+input;
		return input;
	};
});
angular.module('f2', []).filter('parser', function() {
	return function(input) {
		return parser(input);
	};
});
angular.module('f3', []).filter('correct', function() {
	return function(correct) {
		SC.text ='';
		var count=0;
		for(var i in SC.p)
			if(i!=SC.p.length-1 || SC.writing=="")
				SC.text += ((count++)?', ':'')+SC.p[i].content;
		SC.text += ((count++)?', ':'')+correct;
		SC.p = parser(SC.text);
		document.getElementById('sig').focus();
	};
});
angular.module('f4', []).filter('delete', function() {
	return function(toDelete) {
		SC.text = '';
		var count=0;
		for(var i in SC.p)
			if(i!=toDelete)
				SC.text += ((count++)?', ':'')+SC.p[i].content;
		SC.p = parser(SC.text);
		document.getElementById('sig').focus();
	};
});
var archiApp = angular.module('archiApp', ['f1', 'f2', 'f3', 'f4']);

var SC;

archiApp.controller('Ctrl', function($scope){
	SC = $scope;
	$scope.signals = window.opener.opener.global.ArchiObj.getAllPossibleSignals(false);
	$scope.item = {};
	for(var i in item)
		$scope.item[i] = item[i];
	$scope.text = '';
	var count=0;
	for(var i in $scope.item)
		if(i!='SelMS' && i!='Adresse' && i!='AdrSuiv' && $scope.item[i] && i.substr(0, 1)!='$')
			$scope.text += ((count++)?', ':'')+i;
	$scope.p = parser($scope.text);
	console.log($scope.p);
	$scope.writing = '';
});
function cleanArray(array) {
  var i, j, len = array.length, out = [], obj = {};
  for (i = 0; i < len; i++) {
	if(obj[array[i].content])
		delete obj[array[i].content];
	obj[array[i].content] = array[i].valid;
  }
  for (j in obj) {
	out.push({content: j, valid: obj[j]});
  }
  return out;
}
function parser(txt){
	var all = new Array();
	var current = '';
	for(var i in txt){
		if((txt.charCodeAt(i)>64 && txt.charCodeAt(i)<91) // [A-Z]
			|| (txt.charCodeAt(i)>96 && txt.charCodeAt(i)<123) // [a-z]
			|| (txt.charCodeAt(i)>47 && txt.charCodeAt(i)<58)) // [0-9]
			current+=txt[i];
		else if(current){
			all.push({content: current, valid: false});
			current='';
		}
	}
	var ww = false;
	if(current){
		all.push({content: current, valid: false});
		ww = true;
	}
	for(var i in all){
		var found = -1;
		for(var j in SC.signals)
			if(SC.signals[j].toUpperCase()==all[i].content.toUpperCase()){
				all[i].valid = true;
				all[i].content = SC.signals[j];
				break;
			}
	}
	if(all[all.length-1] && !(all[all.length-1].valid) && ww)
		SC.writing = all[all.length-1].content;
	else
		SC.writing = '';
	return all;
}
function SAVE(){
	for(var i in item)
		item[i] = 0;
	
	item['SelMS'] = SC.item['SelMS'];
	item['Adresse'] = SC.item['Adresse'];
	item['AdrSuiv'] = SC.item['AdrSuiv'];
	
	SC.p = parser(SC.text);
	for(var i in SC.p)
		item[SC.p[i].content] = 1;
	
	window.opener.SC.$apply();
	window.close();
}