define(function(){
	var url = location.search;
	
	if(url.indexOf('?') != -1){
		url = url.substr(1);
	}
	
	var params = {};  //{id:,age:}
	
	var bigArr = url.split('&');
	
	bigArr.forEach(function(item){
		var sArr = item.split('='); // [id,'sdadfasd']  [age,12]
		
		params[sArr[0]] = sArr[1];
	})
	
	console.log(params);
	return params
})