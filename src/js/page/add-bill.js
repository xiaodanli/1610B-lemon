require(['../js/config.js'],function(){
	require(['mui','dom','getUid','format','picker','dtpicker'],function(mui,dom,getUid,format){
		
		
		function init(){
			mui.init();
			
			//初始化时间
			initDate();
			
			//添加点击事件
			addEvent();
			
			//加载分类的数据
			loadClassify();
		}
		
		//加载分类的数据
		function loadClassify(){
			getUid(function(uid){
				mui.ajax('/classify/api/getClassify',{
					data:{
						uid:uid
					},
					dataType:'json',
					success:function(res){
						if(res.code === 1){
							//渲染分类
							renderClassify(res.data);
						}
						console.log(res)
					},
					error:function(error){
						console.warn(error);
					}
				})
			})
		}
		
		var payC = [],   	//支出分类
			comC = [],   	//收入分类
			type = '支出';	//默认支出分类 
		
		//渲染分类
		function renderClassify(data){
			data.forEach(function(item){
				if(item.type === '支出'){
					payC.push(item);
				}else{
					comC.push(item);
				}
			})
			
			var target = format(payC.slice(0),8);   //[[{},{},{}]]
			
			renderC(target);
			
			console.log(target);
		}
		
		//渲染分类html
		
		function renderC(data){
			var cStr = '';
			
			data.forEach(function(item){
				cStr += `
					<div class="mui-slider-item">
						<div>`;
				cStr += renderDl(item);			
				cStr +=		`</div>
					</div>
				`
			});
			
			dom('.mui-slider-group').innerHTML = cStr;

			var items = Array.from(dom('.mui-slider-group').querySelectorAll('.mui-slider-item'));
			
			var firstItem = items[0],
				lastDiv= items[items.length - 1].querySelector('div');
			
			console.log(firstItem);
			
			var firstDl = Array.from(firstItem.querySelectorAll('dl'))[0];
			
			firstDl.classList.add('active');

			//自定义
			var custom = `
				<dl class="custom">
					<dt>
						<span class="mui-icon mui-icon-plus"></span>
					</dt>
					<dd>自定义</dd>
				</dl>
			`;

			if(lastDiv.querySelectorAll('dl').length == 8){

				var newItem = `<div class="mui-slider-item"><div>`;
					newItem += custom;
					newItem +=`</div></div>`;
				dom('.mui-slider-group').innerHTML += newItem;

			}else{
				lastDiv.innerHTML += custom;
			}

			console.log(firstDl);
			
			mui('.mui-slider').slider();
		}
		
		//渲染dl
		
		function renderDl(data){
			return data.map(function(v){
				return `
					<dl data-cid = "${v._id}">
						<dt>
							<span class="${v.icon}"></span>
						</dt>
						<dd>${v.intro}</dd>
					</dl>
				`
			}).join('')
		}
		
		var dtpicker = null,
			curYear = new Date().getFullYear(),
			curMonth = new Date().getMonth() + 1,
			curDay = new Date().getDate(),
			_chooseTime = dom('.choose-time');
		
		function initDate(){
			dtpicker = new mui.DtPicker({type:'date'});
			curMonth = curMonth < 10 ? '0'+curMonth : curMonth;
			curDay = curDay < 10 ? '0'+curDay : curDay;
			_chooseTime.innerHTML = curYear + '-' + curMonth +'-'+curDay;
		}
		
		function addEvent(){
			
			//点击tab
			
			mui('.tab-list').on('tap','span',function(){
				type = this.innerHTML;
				
				var spanEles = dom('.tab-list').querySelectorAll('span');
				
				for(var i = 0;i<spanEles.length;i++){
					spanEles[i].classList.remove('active');
				}
				
				this.classList.add('active');
				
				if(type === '支出'){
					renderC(format(payC.slice(0),8))
				}else{
					renderC(format(comC.slice(0),8))	
				}
			})
			
			
			//选择分类
			mui('.mui-slider-group').on('tap','dl',function(){
				var dls = dom('.mui-slider-group').querySelectorAll('dl');
				
				for(var i = 0;i<dls.length;i++){
					dls[i].classList.remove('active');
				}
				
				this.classList.add('active');

				if(this.className === 'custom active'){
					location.href="../../page/add-classify.html?type="+type;
				}
			})
			
			//选择时间
			dom('.timer').addEventListener('tap',function(){
				dtpicker.show(function(selectItems){
					_chooseTime.innerHTML = selectItems.text;
				})
			})
			
			//点击键盘
			
			_money = dom('.money');
			
			mui('.keyword').on('tap','span',function(){
				var mVal = _money.innerHTML;
				
				var val = this.innerHTML;  //7
				
				if(val === 'x'){  //删除 9
					_money.innerHTML = mVal.substr(0,mVal.length-1);
					if(_money.innerHTML.length == 0){
						_money.innerHTML = '0';
					}
					return 
				}else if(val === '完成'){
					console.log("添加账单");
					addBill();
					return 
				}
				
				if(mVal === '0.00'){
					_money.innerHTML = val;
				}else if(mVal === '0' && val != '.'){
					_money.innerHTML = val;
				}else if((mVal.indexOf('.') != -1 && val === '.') || (mVal.indexOf('.') != -1 && mVal.split('.')[1].length == 2)){
					_money.innerHTML = mVal;
				}else{
					_money.innerHTML += val;
				}
			})
		}
		
		function addBill(){
			/*
				uid = params.uid, ---
				timer = params.timer,
				icon = params.icon,
				intro = params.intro,
				type = params.type,
				
				money = params.money,
				cid = params.cid;
			*/
		   
		   getUid(function(uid){
			   var activeDl = dom('.mui-slider-group').querySelector('.active');
			   var timer = dom('.choose-time').innerHTML;
					icon = activeDl.querySelector('span').className,
					intro = activeDl.querySelector('dd').innerHTML,
					money = _money.innerHTML,
					cid = activeDl.getAttribute('data-cid');
					
				if(money === '0.00'){
					alert('钱为0');
				}else{
					mui.ajax('/bill/api/addBill',{
						data:{
							uid:uid,
							timer:timer,
							icon:icon,
							intro:intro,
							type:type,
							money:money,
							cid:cid
						},
						type:'post',
						dataType:'json',
						success:function(res){
							console.log(res);
							if(res.code === 1){
								location.href="../../index.html";
							}
						},
						error:function(error){
							console.warn(error)
						}
					})
				}
		   })
		}
		
		
		init();
	})
})