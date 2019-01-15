require(['./js/config.js'],function(){
	require(['mui','dom','getUid','moment','picker','poppicker','dtpicker'],function(mui,dom,getUid,moment){
		
		// alert(1)
		function init(){
			mui.init();
			
			dom('.mui-inner-wrap').addEventListener('drag', function(event) {
				event.stopPropagation();
			});
			
			//初始化时间
			initDate();
			
			//添加点击事件
			addEvent();
			
			//获取分类
			loadClassify();
			
			//初始化滚动
			initScroll();
		}
		
		function initScroll(){
			mui('.mui-scroll-wrapper').scroll({
				deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
			});
		}
		
		//获取账单
		
		/*
			[{1-11},{1-11},{1-14},{1-14}]
			
			格式化成下面格式
			
			//第一步：
			{
				 '1-11':{
						timer:'1-11',
						list:[],
						totalPay:0
					},
					'1-14':{
						timer:'1-14',
						list:[],
						totalPay:0
					}
			}
			
			第二步：
			for in 
			
			[{
				timer:'1-11',
				list:[],
				totalPay:0
			},{}]
			
			
			
		*/
		function loadBill(cids){
				var timer = _selectDate.innerHTML;
				
				getUid(function(uid){
					mui.ajax('/bill/api/getBill',{
						dataType:'json',
						data:{
							timer:timer,
							cid:cids,
							uid:uid
						},
						success:function(res){
							if(res.code === 1){
								billData = res.data;
								//渲染账单
								if(status === 'month'){
									renderMonthBill(res.data);
								}else{
									renderYearBill(res.data);
								}
							}
						},
						error:function(error){
							console.warn(error);
						}
					})	
				})
		}
		
		//渲染账单
		
		var monthTotalPay = 0,  //每月支出的总钱数
			  monthTotalCom = 0,  //每月收入的总钱数
				yearTotalPay = 0,   //每年支出的总钱数
				yearTotalCom = 0,   //每年收入的总钱数
				_totalPay = dom('.total-pay'),
				_totalCom = dom('.total-com'),
				billData = [];      
		
		//渲染月的账单
		function renderMonthBill(data){
			  var mBill = {};
				monthTotalPay = 0;
				monthTotalCom = 0;
				data.forEach(function(item){
					 var timer = moment(item.timer).format('MM-DD');  //01-14
					 if(!mBill[timer]){
							mBill[timer] = {
								timer:timer,
								list:[],
								totalPay:0
							};
						}
						mBill[timer].list.push(item);
						
						if(item.type === '支出'){
							mBill[timer].totalPay += item.money*1;
							monthTotalPay += item.money*1;
						}else{
							monthTotalCom += item.money*1;
						}
				})
				
				console.log(mBill);
				
				_totalPay.innerHTML = `本月花费<i>${monthTotalPay}</i>`;
				_totalCom.innerHTML = `本月收入<i>${monthTotalCom}</i>`;
				
				var monthArr = [];
				
				for(var i in mBill){
					monthArr.push(mBill[i]);
				}
				
				console.log(monthArr);
				
				var mStr = '';
				
				monthArr.forEach(function(item,index){
					mStr += `
							<div class="day-item">
								<div class="day-title">
									<div>
										<span class="mui-icon mui-icon-image"></span>
										${item.timer}
									</div>
									<div>
										花费<span class="day-pay">${item.totalPay}</span>
									</div>
								</div>
								<div class="day-list">
									<ul class="mui-table-view">`;
					mStr += renderLi(item.list,index);
					mStr +=					`</ul>
									</div>
								</div>
						`;
				});
				
				dom('.month-wrap').innerHTML = mStr;
		}
		
		//渲染Li
		
		function renderLi(data,index){
			return data.map(function(item){
				return `
					<li class="mui-table-view-cell">
						<div class="mui-slider-right mui-disabled">
							<a class="mui-btn mui-btn-red" data-id="${index}" data-lid="${item._id}" data-money="${item.money}" data-type="${item.type}">删除</a>
						</div>
						<div class="mui-slider-handle bill-item">
							<dl>
								<dt>
									<span class="${item.icon}"></span>
								</dt>
								<dd>${item.intro}</dd>
							</dl>
							<span class="${item.type === '支出' ? 'red' : 'green'}">${item.money}</span>
						</div>
					</li>
				`;
			}).join('');	
		}
				
		//渲染年的账单
		
		function renderYearBill(data){
			var yBill = {};
			
			yearTotalPay = 0;
			
			yearTotalCom = 0;
			
			data.forEach(function(item){
				var timer = moment(item.timer).format('MM');
				if(!yBill[timer]){
					yBill[timer] = {
						timer:timer,
						list:[],
						totalPay:0,
						totalCom:0
					}
				}
				yBill[timer].list.push(item);
				if(item.type === '支出'){
					yBill[timer].totalPay += item.money*1;
					yearTotalPay += item.money*1;
				}else{
					yBill[timer].totalCom += item.money*1;
					yearTotalCom += item.money*1;;
				}
			})
			
			_totalPay.innerHTML = `每年花费<i>${yearTotalPay}</i>`;
			
			_totalCom.innerHTML = `每年收入<i>${yearTotalCom}</i>`
			
			var yearArr = [];
			
			for(var i in yBill){
				yearArr.push(yBill[i])
			}
			
			var yStr = '';
			
			yearArr.forEach(function(item){
				yStr += `
						<div class="month-item">
							<ul class="mui-table-view"> 
								<li class="mui-table-view-cell mui-collapse">
									<a class="mui-navigate-right" href="#">
										<ol>
											<li>
												<span class="mui-icon mui-icon-upload"></span>
												<span>${item.timer}</span>
											</li>
											<li class="red">
												<span>花费</span>
												<span>${item.totalPay}</span>
											</li>
											<li class="green">
												<span>收入</span>
												<span>${item.totalCom}</span>
											</li>
											<li class="gray">
												<span>结余</span>
												<span>${item.totalCom - item.totalPay}</span>
											</li>
										</ol>
									</a>
									<div class="mui-collapse-content">
										<ul class="mui-table-view">`;
					yStr += renderLi(item.list);						
					yStr+=	`</ul>
									</div>
								</li>
							</ul>
						</div>
				`;
				
				dom('.year-wrap').innerHTML = yStr;
			})
			
		}
		
		var cids = [];
		//获取分类
		
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
							
							res.data.forEach(function(item){
								cids.push(item._id);
							})
							//获取账单
							loadBill(cids);
						}
					},
					error:function(error){
						console.warn(error);
					}
				})
			})
		}
		
		function renderClassify(data){
			var payC = [],
					comC = [];
			data.forEach(function(item){
				if(item.type === '支出'){
					payC.push(item);
				}else{
					comC.push(item);
				}
			})
			
			dom('.pay-c').innerHTML = renderC(payC);
			dom('.com-c').innerHTML = renderC(comC);
		}
		
		function renderC(data){
			return data.map(function(item){
				return `<li data-cid="${item._id}">${item.intro}</li>`
			}).join('')
		}
		
		var picker = null,
			dtPicker = null,
			curYear = new Date().getFullYear(),
			curMonth = new Date().getMonth() + 1;
			_selectStatus = dom('.select-status'),
			_selectDate = dom('.select-date'),
			status = 'month';
		
		//初始化时间
		function initDate(){
			//选择年月
			 picker = new mui.PopPicker();
			 picker.setData([{value:'month',text:'月'},{value:'year',text:'年'}]);
			 
			 
			 curMonth = curMonth < 10 ? '0'+curMonth : curMonth;
			 
			 _selectDate.innerHTML = curYear + '-' + curMonth;
			 
			 //选择日期
			dtPicker = new mui.DtPicker({type:'month'}); 
			
		}
		
		//添加点击事件
		
		function addEvent(){
			
			var _monthWrap = dom('.month-wrap'),
				_yearWrap = dom('.year-wrap');
				
			//点击年月
			_selectStatus.addEventListener('tap',function(){
				picker.show(function (selectItems) {
					_selectStatus.innerHTML = selectItems[0].text;
					
					status = selectItems[0].value;
					
					var _monthH5 = document.querySelector("[data-id=title-m]"),
						_yearH5 = document.querySelector("[data-id=title-y]"),
						_mPicker = document.querySelector("[data-id=picker-m]"),
						_yPicker = document.querySelector("[data-id=picker-y]");
					
					if(status === 'month'){  //月
						_selectDate.innerHTML = curYear + '-' + curMonth;
						
						_monthH5.style.display = 'inline-block';
						
						_mPicker.style.display = 'block';
						
						_yearH5.style.width = '50%';
						
						_yPicker.style.width = '50%';
						
						_monthWrap.style.display = 'block';
						_yearWrap.style.display = 'none';
						
					}else{  //年
						_selectDate.innerHTML = curYear;
						
						_monthH5.style.display = 'none';
						
						_mPicker.style.display = 'none';
						
						_yearH5.style.width = '100%';
						
						_yPicker.style.width = '100%';
						
						_monthWrap.style.display = 'none';
						_yearWrap.style.display = 'block';
						
						// renderYearBill(billData);
					}
					loadBill(cids);
				})
			})
			
			//点击日期
			_selectDate.addEventListener('tap',function(){
				dtPicker.show(function (selectItems) { 
					
					curYear = selectItems.y.text;
					
					curMonth = selectItems.m.text;
					if(status === 'month'){
						_selectDate.innerHTML = selectItems.text;
					}else{
						_selectDate.innerHTML = curYear;
					}
					loadBill(cids);
				})
			})
			
			//打开侧边栏
			dom('.open-aslide').addEventListener('tap',function(){
				mui('.mui-off-canvas-wrap').offCanvas('show');
			})
		
			var _billWrap = dom('.bill-wrap'),
				_tableWrap = dom('.table-wrap');
			//点击tab-list
			mui('.tab-list').on('tap','.tab-item',function(){
				
				
				var text = this.innerHTML;
				
				var _tabItems = document.querySelectorAll('.tab-item');
				
				for(var i = 0;i<_tabItems.length;i++){
					_tabItems[i].classList.remove('active');
				}
				
				this.classList.add('active');
				
				if(text === '账单'){
					_billWrap.style.display = 'block';
					_tableWrap.style.display = 'none';
				}else{
					_billWrap.style.display = 'none';
					_tableWrap.style.display = 'block';
				}
			})
		
			//去添加账单界面
			dom('.go-add').addEventListener('tap',function(){
				location.href="../../page/add-bill.html";
			})
		
			//点击收支类型
			mui('.type').on('tap','li',function(){
				
				var id = this.getAttribute('data-id');
				
				var classifyEles = document.querySelectorAll('.classify');
				
				var lis = classifyEles[id].querySelectorAll('li');
				
				if(this.className.indexOf('active') != -1){
					this.classList.remove('active');
					for(var i = 0;i<lis.length;i++){
						lis[i].classList.remove('active');
					}
				}else{
					this.classList.add('active');
					for(var i = 0;i<lis.length;i++){
						lis[i].classList.add('active');
					}
				}
				
				classIfybill();
			})
			
			function classIfybill(){
				var acitveLis = dom('.c-all').querySelectorAll('.active'),
						lis = dom('.c-all').querySelectorAll('li');
				
				var classifyArr = [];
				
				if(acitveLis.length){
					for(var c = 0;c<acitveLis.length;c++){
						classifyArr.push(acitveLis[c].getAttribute('data-cid'));
					}
				}else{
					for(var c = 0;c<lis.length;c++){
						classifyArr.push(lis[c].getAttribute('data-cid'));
					}
				}
				loadBill(classifyArr);
			}
			
			//点击收支分类
			mui('.c-all').on('tap','li',function(){
				
				//tlis[id]  全部支出/收入
				if(this.className.indexOf('active') != -1){
					this.classList.remove('active');
				}else{
					this.classList.add('active');
				}
				
				var id = this.parentNode.getAttribute('data-id');
				
				var tlis = dom('.type').querySelectorAll('li');
				
				var lis = Array.from(this.parentNode.children);
				
				// some  只要有一个符合条件  返回值是boolean  true/false
				// every 全部符合条件  返回值是boolean  true/false
				
				var isChecked = lis.every(function(item){
					return item.className.indexOf('active') != -1
				})
				
				if(isChecked){
					tlis[id].classList.add('active');
				}else{
					tlis[id].classList.remove('active');
				}
				
				classIfybill();
			})
		
		 //点击删除  1.去库里删除此账单 2.减钱   3.节点删除
		 mui('.bill-wrap').on('tap','.mui-btn',function(event){
				//
				var elem = this;
				var li = elem.parentNode.parentNode;
				var btnArray = ['确认', '取消'];
				mui.confirm('确认删除该条记录？', 'Hello MUI', btnArray, function(e) {
					var lid = elem.getAttribute('data-lid'),
							money = elem.getAttribute('data-money'),
							type = elem.getAttribute('data-type'),
							id = elem.getAttribute('data-id');
					if (e.index == 0) {
						console.log("确定");
						mui.ajax('/bill/api/delBill',{
							data:{
								lid:lid
							},
							dataType:'json',
							success:function(res){
								console.log(res);
								if(res.code === 1){
									if(status === 'month'){
										
										//月删除账单
										if(type === '支出'){
											var dayPay = document.querySelectorAll('.day-item')[id].querySelector('.day-pay');
											dayPay.innerHTML -= money*1;
											monthTotalPay -= money*1;
											_totalPay.innerHTML = `本月花费:<i>${monthTotalPay}</i>`;
										}else{
												monthTotalCom -= money*1;
												_totalCom.innerHTML = `本月收入:<i>${monthTotalCom}</i>`;
										}
										if(li.parentNode.children.length > 1){
											li.parentNode.removeChild(li);
										}else{
											dom('.month-wrap').removeChild(document.querySelectorAll('.day-item')[id]);
										}
									}else{
										//年删除账单
									}
								}
								alert(res.msg)
							},
							error:function(error){
								console.warn(error)
							}
						})
						// li.parentNode.removeChild(li);
					} else {
						setTimeout(function() {
							mui.swipeoutClose(li);
						}, 0);
					}
				});
			})
		}
		
		init()
	})
})