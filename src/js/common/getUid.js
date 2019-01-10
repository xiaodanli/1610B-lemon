define(function(){
	var getUid = function(fn){
		var uid = localStorage.getItem('uid') || '';
		
		if(!uid){
			mui.ajax('/users/api/addUser',{
				dataType:'json',
				type:'post',
				success:function(res){
					console.log(res);
					if(res.code === 1){
						localStorage.setItem('uid',res.data);
						fn(res.data);
					}
				}
			})
		}else{
			fn(uid);
		}
	}
	
	return getUid
})