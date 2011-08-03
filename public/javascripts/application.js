
Array.prototype.sum = function(){
	for(var i=0,sum=0;i<this.length;sum+=this[i++]);
	return sum;
}

// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults
