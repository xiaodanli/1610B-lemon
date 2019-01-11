define(function(){
	var format = function(data,num){
		var target = [];
		
		var total = Math.ceil(data.length/num);
		
		for(var i = 0;i<total;i++){
			target.push(data.splice(0,num));
		}
		return target
	}
	
	return format
})