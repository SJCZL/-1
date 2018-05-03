/**
 * 实现历史记录的保存
 */
window.onload = function() {

	var fromStation = document.getElementById('fromStation');           // 获取出发地的id
	var toStation = document.getElementById('toStation');               // 获取目的地的id
	var queryButton = document.getElementById('queryButton');           // 点击查询的id
	var fromtag = document.getElementById('fromtag');                   // 点击出发站
	var totag = document.getElementById('totag');                       // 点击目的站
	var from_Station = document.getElementById('from_Station');         // 显示出发站
	var to_Station =document.getElementById('to_Station');              // 显示目的站
	var stationTime = document.getElementById('stationTime');           // 点击出发时的时间
	var showDate = document.getElementById('showDate');
	var transform =document.getElementById('transform');                // Janine:转换出发站和目的站的图片
	var H_main = document.getElementById('main');
	var switchBtn = document.getElementById('switchBtn');// 获取开关的组件
	
	var dataItem;
	var status = "ADULT";// 开始状态为成人票
	
	//  点击时间栏
	stationTime.addEventListener('tap',function(){
		flag=true;
        var address="main_tab/tickets.html";
		console.log(address);
		mui.openWindow({
			url: '../html/calendar.html',
			id: '../html/calendar.html',
			extras:{
				data : address,
		    }
		});
	});	
	//  点击时间栏
	
	// 点击进入出发站
	fromtag.addEventListener('tap', function() {
		var address="main_tab/tickets.html";  // 返回数据时的地址
		mui.openWindow({
			url: '../html/station.html',
			id: 'station',
			extras: {
				station: from_Station.innerHTML, //将出发站的title传过去
				address: address      
			}
		});
	});
	
	// 点击进入目的站
	totag.addEventListener('tap', function() {
		var address="main_tab/tickets.html";  // 返回数据时的地址
		mui.openWindow({
			url: '../html/station.html',
			id: 'station',
			extras: {
				station: to_Station.innerHTML,//将出发站的title传过去
				address: address 
			}
		});
	});
	
	// Janine:点击历史记录，将历史记录中的出发站和目的站添加到上方的出发站和目的站中
	mui('#main').on('tap','font',function(){
		console.log("Janine:main.历史记录.点击事件--->");
		fromStation.innerHTML = dataItem.rows.item(parseInt(this.getAttribute('data-id')))["fromStation"];
		toStation.innerHTML = dataItem.rows.item(parseInt(this.getAttribute('data-id')))["toStation"];
	});
	
	// Janine:转换——将出发站和目的站的地址互换一下
	transform.addEventListener('tap', function() { 
		console.log("Janine:点击进入.将出发站和目的站转换一下--->");
		var temp;
		temp = fromStation.innerHTML;
		fromStation.innerHTML = toStation.innerHTML;
		toStation.innerHTML = temp;
	});
	
	// Janine:点击选择乘车人类型:成人或学生
	switchBtn.addEventListener('tap', function() { 
		status = switchBtn.classList.contains('mui-active') == true ? status = "0X00" : status = "ADULT";//对学生票和成人票进行判断
		console.log(status);
	});
	
    
	if (window.openDatabase) {
		//5M
		//创建数据库，record库
		var dataBase = openDatabase("record", "1.0", "station", 1024 * 1024, function() {});
		dataBase.transaction(function(fx) {
				//创建一个表，车站表
				fx.executeSql(
					"create table if not exists station (id INTEGER PRIMARY KEY AUTOINCREMENT, fromStation TEXT,toStation TEXT)", [],
					function() {
						//alert("表创建成功");
					},
					function() {
						//alert("创建表失败");
					}
				);
			})
		//点击查询按钮，保存历史记录数据
		queryButton.onclick = function() {
			
			// 选择购买单程或往返票
			var type_button = document.getElementsByName('type_button');// 获取购买车票的类型（dc或wf）
			var tour_flag;
			console.log("表单的名字" + type_button);
			for(var i = 0; i < type_button.length;i++)
			{
			    if(type_button[i].checked)
			        tour_flag = type_button[i].value; //这里得到单选按钮值
			    console.log("单程（dc）往返（wf）票您选择的是" + tour_flag);  
			}
			
			localStorage.removeItem('Detail_train_date');
			console.log("showDate" + from_Station.innerHTML+to_Station.innerHTML);
			// 先做判断出发站的名称和目的站的名称是否相同
			if(fromStation.innerHTML == toStation.innerHTML){
				mui.alert('出发站和到达站不能相同！！！', '提示', function() {});
			}else{
				mui.openWindow({
				url: '../html/trainResultShow_main.html',
				id: 'trainResultShow_main',
				extras:{
					//需要传到下一个界面，乘车人的类型，乘车时间，出发站的车站码和目的站的车站码
					purpose_codes : status,    		       //成人票或者学生票
					train_date : showDate.innerHTML,        //出发时间
					from_station : fromStation.innerHTML,    //车站名称
					to_station : toStation.innerHTML,        //同上
					tour_flag : tour_flag
				}
			});
			
			//首先查询是否存在将要查询的数据
			dataBase.transaction(function(fx) {
				//查询相关数据fromStation.innerHTML和toStation.innerHTML
				fx.executeSql("select * from station where fromStation=? and toStation=?", [fromStation.innerHTML, toStation.innerHTML],
					function(fx, result) {
						//alert("result是什么"+result);
						if (result.rows.length > 0) {
						//alert("已存在该数据");
						} else {
							//alert("没有查询结果");
							dataBase.transaction(function(fx) {
								//插入数据
								fx.executeSql("insert into station (fromStation,toStation) values(?,?)", [fromStation.innerHTML, toStation.innerHTML],
									function() {
										//alert("数据插入成功");
									},
									function() {
										//alert("数据插入失败");
									}
								);
							})
						}
					},
					function() {
						//alert("数据查询失败");
					}
				);
			})
			}
			
		}
		
		/**
		 * Janine:显示历史记录
		 * 1.显示界面时，查询所有数据
		 * 2.点击其中的每一项可以获取他们的内容，并且将内容显示在出发站和目的站上
		 */
		dataBase.transaction(function(fx) {
			// 查询数据
			fx.executeSql("select * from station ", [],
				function(fx, result) {
					dataItem = result;
					var main = document.getElementById('main');
					var str = "";      // 字符串拼接
					for (var i = 0; i < result.rows.length; i++) {
						str += '<div class="box"><div class="record"><font data-id ="'+ i + '" >' 
								+ result.rows.item(i)["fromStation"] 
								+ "-"
								+ result.rows.item(i)["toStation"]
								+ '</font></div></div> ';
						main.innerHTML = str; // 将拼接的字符串加到id=recordStation的div中
					}
					
					//alert("数据查询成功");
				},
				function() {
					//alert("数据查询失败");
				}
			);
		})
	}

}