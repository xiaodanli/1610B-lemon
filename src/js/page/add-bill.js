require(['../js/config.js'],function(){
	require(['mui','dom','picker','dtpicker'],function(mui,dom){
		
		
		function init(){
			mui.init();
			
			//初始化时间
			initDate();
			
			//添加点击事件
			addEvent();
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
			
			//选择时间
			dom('.timer').addEventListener('tap',function(){
				dtpicker.show(function(selectItems){
					console.log(selectItems);
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
						_money.innerHTML = '0.00';
					}
					return 
				}else if(val === '完成'){
					console.log("添加账单");
					return 
				}
				
				if(mVal === '0.00' || (mVal.indexOf('.') != -1 && val === '.') || (mVal.indexOf('.') != -1 && mVal.split('.')[1].length == 2)){
					_money.innerHTML = val;
				}else{
					_money.innerHTML += val;
				}
			})
		}
		
		
		init();
	})
})