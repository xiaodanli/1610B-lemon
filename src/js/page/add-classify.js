require(['../js/config.js'],function(){
	require(['mui','dom','getUid'],function(mui,dom,getUid){
		
		function init(){
			mui.init();
			
			loadData();
			
			//添加事件
			addEvent();
		}
		
		function loadData(){
			mui.ajax('/classify/api/iconlist',{
				dataType:'json',
				success:function(res){
					console.log(res);
					if(res.code === 1){
						//渲染图标
						renderIcon(res.data);
					}
				}
			})
		}
		
		// [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]   20/15  2  一维数组
		
		// [[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],[16,17,18,19,20]]   二维数组
		
		// slice 不会改变原数组   splice  会改变原数组
		
		//渲染图标
		function renderIcon(data){
			
			var target = [];
			
			var num = Math.ceil(data.length/15);
			
			for(var i = 0;i<num;i++){
				target.push(data.splice(0,15));
			}
			
			console.log(target);
			
			var str = '';
			
			target.forEach(function(item){
				str += `
					<div class="mui-slider-item">
						<ul>`
				str += renderLi(item);			
				str +=	`</ul></div>`;
			})
			
			dom('.mui-slider-group').innerHTML = str;
			
		}
		
		function renderLi(data){
			return data.map(function(v){ //[]
				return `<li><span class="${v.icon_classify}"></span></li>`
			}).join('')
		}
		
		//添加事件
		
		function addEvent(){
			var _chooseIcon = dom('#choose-icon');
			mui('.mui-slider-group').on('tap','span',function(){
				_chooseIcon.className = this.className;
			})
			
			//添加分类  uid
			dom('.save-btn').addEventListener('tap',function(){
				
				var icon = _chooseIcon.className,
					intro = dom('.c-name').value,
					type = '收入';
					
				if(!icon || !intro || !type){
					alert("图标或者说明或收支类型不存在");
					return 
				}
					
				getUid(function(uid){
					mui.ajax('/classify/api/addClassify',{
						type:'post',
						dataType:'json',
						data:{
							uid:uid,
							icon:icon,
							intro:intro,
							type:type
						},
						success:function(res){
							console.log(res);
							if(res.code == 1){
								alert(res.msg);
								location.href="../../page/add-bill.html";
							}else{
								alert(res.msg);
							}
						},
						error:function(error){
							console.warn(error);
						}
					})
				});
			})
		}
		
		init();
	})	
})