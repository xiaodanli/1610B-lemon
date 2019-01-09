require(['./js/config.js'],function(){
	require(['mui','dom','picker','poppicker','dtpicker'],function(mui,dom){
		
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
						
					}
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
		}
		
		init()
	})
})