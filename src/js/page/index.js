require(['./js/config.js'],function(){
	require(['mui','dom','picker','poppicker','dtpicker'],function(mui,dom){
		
		// alert(1)
		function init(){
			mui.init();
			
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
			//点击年月
			_selectStatus.addEventListener('tap',function(){
				picker.show(function (selectItems) {
					console.log(selectItems[0].text);//智子
					console.log(selectItems[0].value);//zz 
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
						
					}else{  //年
						_selectDate.innerHTML = curYear;
						
						_monthH5.style.display = 'none';
						
						_mPicker.style.display = 'none';
						
						_yearH5.style.width = '100%';
						
						_yPicker.style.width = '100%';
						
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
			
		}
		
		init()
	})
})