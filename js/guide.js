
var httpctx='http://117.136.45.150:8080/apiticket';      // Janine

var app_key = localStorage.getItem('app_key');

(function(w) {
	
	//************************************* 代售点查询
	
	//==========================》                      获取省的信息
	w.ajax_queryProvince = function(options) {
		
		console.log("ajax_queryProvince.进入--->");
					
		mui.ajax(httpctx +'/queryProvince.do',{
			data:{
            },
			dataType:'json',//服务器返回json格式数据
			type:'POST',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(data){
				console.log("ajax_queryProvince.success--->"+JSON.stringify(data)); //以Json的格式，将获得的数据打印在控制台上
				setTimeout(function(){
					queryProvinceSuccess(data);
				},500);
			},
			error:function(xhr,type,errorThrown){	
			}
		});
	}
	//==========================》                      获取市的信息
	w.ajax_queryCity = function(options) {
		console.log("ajax_queryCity.进入--->");
//		console.log(options.province)			
		mui.ajax(httpctx +'/queryCity.do',{
			data:{
				province:options.province,
            },
			dataType:'json',//服务器返回json格式数据
			type:'POST',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(data){
				console.log("ajax_queryCity.success--->"+JSON.stringify(data)); //以Json的格式，将获得的数据打印在控制台上
				setTimeout(function(){
					queryCitySuccess(data);
				},500);
			},
			error:function(xhr,type,errorThrown){	
			}
		});
	}
	
	//==========================》                      获取区的信息
	w.ajax_queryCounty = function(options) {
		console.log("ajax_queryCounty.进入--->");
		console.log(options.province);
		console.log(options.city_name);
		mui.ajax(httpctx +'/queryCounty.do',{
			data:{
				city : options.city_name,
				province : options.province,
				
//              city:"安庆"
            },
			dataType:'json',//服务器返回json格式数据
			type:'POST',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(data){
				console.log("ajax_queryCounty.success--->"+JSON.stringify(data)); //以Json的格式，将获得的数据打印在控制台上
				setTimeout(function(){
					queryCountySuccess(data);
				},500);
			},
			error:function(xhr,type,errorThrown){	
			}
		});
	}
	
	//==========================》                      代售点查询
	w.ajax_queryAgency = function(options) {
		console.log("ajax_queryAgency.进入--->");
		console.log(options.province);
		console.log(options.city_name);
		console.log(options.county);
		mui.ajax(httpctx +'/queryAgency.do',{
			data:{
				city : options.city_name,
				province : options.province,
				county : options.county
            },
			dataType:'json',//服务器返回json格式数据
			type:'POST',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(data){
				console.log("ajax_queryAgency.success--->"+JSON.stringify(data)); //以Json的格式，将获得的数据打印在控制台上
				setTimeout(function(){
					queryAgencySuccess(data);
				},500);
			},
			error:function(xhr,type,errorThrown){	
			}
		});
	}
	
	
	//*************************************   正晚点查询
	
	
	//==========================》                   获取验证码
	w.ajax_getPassCodeNew = function(options){
        //获取验证码
        console.log("getPassCodeNew.进入--->");
  	    mui.ajax(httpctx +'/getPassCodeNew.do',{
			data:{
				module : "other",
			    rand : "sjrand",
			    appkey : app_key   // 第一步获取的appkey
			},
			dataType:'json',        //服务器返回json格式数据
			type:'get',            //HTTP请求类型
			timeout:10000,          //超时时间设置为10秒；
			success:function(data){
				console.log("ajax_getPassCodeNew.data--->"+JSON.stringify(data)); //以Json的格式，将获得的数据打印在控制台上
				if(data.flag == true){
				   getPassCodeNewSuccess(data);
				}
				else{
					mui.alert(data.msg); 
	    		    ajax_getPassCodeNew({});
				}
			},
			error : function(data){  
		 	   	alert("获取验证码出错！");
	 	   }
		});
	}
	
	//==========================》                      验证验证码
	w.ajax_checkForGuide = function(options){
		mui.ajax(httpctx +'/checkForGuide.do',{
			data:{
				randCode  : options.randCode, // 点击的验证码坐标
				rand      : "sjrand",
				appkey    : app_key
			},
			dataType:'json',             // 服务器返回json格式数据
			type:'post',                 // HTTP请求类型
			timeout:10000,               // 超时时间设置为10秒；
			success:function(data){
				console.log("ajax_checkForGuide.data--->"+JSON.stringify(data)); //以Json的格式，将获得的数据打印在控制台上
				if(data.data.result==1){
					checkForGuideSuccess(data);  // 调用退出成功的方法
				}else{
					mui.alert("验证码不正确!!");
					ajax_getPassCodeNew({});
				}
				
				
			},
			error : function(data){  
		 	   	mui.alert("验证码不正确!!");  
		 	  	ajax_getPassCodeNew({});
		 	}
		});
	}
	
	
	//==========================》                      正晚点查询
	w.ajax_zwdcx = function(options) {
		console.log("zwdcx.进入--->"); 
		
		mui.ajax(httpctx+'/zwdcx.do',{
			data:{
				cc   :options.cc,
                cxlx :options.cxlx,
                cz   :options.cz,
                randCode :options.randCode,
                appkey   : app_key
            },
			dataType:'json',//服务器返回json格式数据
			type:'post',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(data){
				console.log("ajax_zwdcx.success--->" + JSON.stringify(data)); //以Json的格式，将获得的数据打印在控制台上
				setTimeout(function(){
					console.log("ajax_zwdcx.success.setTimeout--->"); 
					zwdcxSuccess(data);
				},500);
			},
			error:function(xhr,type,errorThrown){
				
			}
		});
	}	
	
	//==========================》                      中转站查询
	w.ajax_transferQuery=function(options) {
		console.log("ajax_transferQuery--->");
		console.log(options.queryDate);
		console.log(options.from_station_name);
		console.log(options.to_station_name);
		console.log(options.changeStationText);
		console.log(options.randCode);
		console.log();
		mui.ajax(httpctx +'/transferQuery.do',{
			data:{
				queryDate : options.queryDate,
                from_station_name : options.from_station_name , 
                to_station_name : options.to_station_name,
                changeStationText : options.changeStationText,
                randCode :options.randCode,
                appkey   : app_key
			},
			dataType:'json',       //服务器返回json格式数据
			type:'post',            //HTTP请求类型
			timeout:10000,         //超时时间设置为10秒；
			success:function(data){
				console.log("ajax_transferQuery.success--->");
				console.log("ajax_transferQuery--->" + JSON.stringify(data)); // 以Json的格式，将获得的数据打印在控制台上
				setTimeout(function(){
					transferQuerySuccess(data);     // 获取乘车人成功
				},500);
			},
			error:function(xhr,type,errorThrown){
//				if(data.data.flag==false){
//					alert(data.data.message);
//				}
				alert("申请数据错误");
			}
		});
	}
	
	
	//==========================》                      车站车次查询
	w.ajax_trainQuery = function(options) {
		console.log("trainQuery.进入--->");
		console.log(options.train_start_date);
		console.log(options.train_station_name);
		console.log( options.randCode);
		mui.ajax(httpctx +'/trainQuery.do',{
			data:{
				train_start_date : options.train_start_date ,//日期
                train_station_name : options.train_station_name, //车站
                randCode : options.randCode,   //验证码
				appkey:app_key,
            },
			dataType:'json',//服务器返回json格式数据
			type:'POST',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(data){
				console.log(JSON.stringify(data)); //以Json的格式，将获得的数据打印在控制台上
				setTimeout(function(){
					trainQuerySuccess(data);
				},500);
			},
			error:function(xhr,type,errorThrown){
				
			}
		});
	}
	
	//==========================》                      票价查询
	  
	 w.ajax_ticketPriceQuery=function(options) {
		console.log("ajax_ticketPriceQuery--->进入" );
		console.log(options.train_date);
		console.log(options.from_station);
		console.log( options.to_station);
		console.log( options.purpose_codes);
		console.log(options.randCode);
		mui.ajax(httpctx +'/ticketPriceQuery.do',{
			data:{
                train_date : "2016-8-9",
                from_station : options.from_station,
                to_station :  options.to_station,
                purpose_codes : options.purpose_codes,
                randCode : options.randCode,
				appkey:app_key
			},
			dataType:'json',     //服务器返回json格式数据
			type:'get',          //HTTP请求类型
			timeout:10000,       //超时时间设置为10秒；
			success:function(data){
				console.log("ajax_ticketPriceQuerySuccess--->");
				console.log("ajax_ticketPriceQuery--->"+JSON.stringify(data)); //以Json的格式，将获得的数据打印在控制台上
				setTimeout(function(){
					console.log("ticketPriceQuerySuccess--->");
					ticketPriceQuerySuccess(data);
				},500);
			},
			error:function(xhr,type,errorThrown){
				
			}
		});
	}
	 
	 
	//==========================》                      车次查询
	
	w.ajax_queryTrainInfo=function(options) {
		console.log("ajax_queryTrainInfo--->进入" );
		console.log(options.train_no);
		console.log(options.train_data);
		console.log(options.randcode);
		mui.ajax(httpctx +'/queryTrainInfo.do',{
			
			data:{
				train_no : options.train_no,
                train_date : options.train_date,
                randCode :options.randcode,
				appkey:app_key
			},
			dataType:'json',     //服务器返回json格式数据
			type:'get',          //HTTP请求类型
			timeout:10000,       //超时时间设置为10秒；
			success:function(data){
				console.log("queryTrainInfo.success--->");
				console.log("ajax_queryTrainInfo--->"+JSON.stringify(data)); //以Json的格式，将获得的数据打印在控制台上
				setTimeout(function(){
					console.log("ajax_queryTrainInfo.Success--->");
					queryTrainInfo(data);
				},500);
			},
			error:function(xhr,type,errorThrown){
				
			}
		});
	}
	
	
	//==========================》                     余票查询
	
	w.ajax_queryTicket=function(options) {
		console.log("ajax_queryTicket--->进入" );
		console.log(options.purpose_codes);
		console.log(options.queryDate);
		console.log(options.from_station);
		mui.ajax(httpctx +'/queryTicket.do',{
			data:{
				purpose_codes : options.purpose_codes,
                queryDate : options.queryDate,
                from_station : options.from_station,
                to_station : options.to_station
			},
			dataType:'json',     //服务器返回json格式数据
			type:'get',          //HTTP请求类型
			timeout:10000,       //超时时间设置为10秒；
			success:function(data){
				console.log("queryTicket.success--->");
				console.log("ajax_queryTicket--->"+JSON.stringify(data)); //以Json的格式，将获得的数据打印在控制台上
				setTimeout(function(){
					console.log("ajax_queryTicket.queryTicketSuccess--->");
					queryTicketSuccess(data);
				},500);
			},
			error:function(xhr,type,errorThrown){
				
			}
		});
	}
	
	
	//==========================》                      3.4获取乘客信息
//	w.ajax_confirmSingleForQueue=function(options) {
//		console.log("ajax_confirmSingleForQueue--->");
//		mui.ajax('http://202.38.79.38:8080/ticket/getPassenger.do',{
//			data:{
//				  dwAll:N,
//                key_check_isChange:（由步骤3.3获取）
//                leftTicketStr:（由步骤3.3获取）
//                train_location:（由步骤3.3获取）
//                passengerTicketStr:（见步骤3.7）
//                oldPassengerStr:（见步骤3.7）
//                purpose_codes:（人员类型）
//                randCode:$("#randCode").val()
//                roomType:00
//                REPEAT_SUBMIT_TOKEN:options.global
//                appkey:app_key
//			},
//			dataType:'json',       //服务器返回json格式数据
//			type:'get',            //HTTP请求类型
//			timeout:10000,         //超时时间设置为10秒；
//			success:function(data){
//				console.log("ajax_confirmSingleForQueue.success--->");
//				console.log(JSON.stringify(data)); // 以Json的格式，将获得的数据打印在控制台上
//				setTimeout(function(){
//					getPassengerSuccess(data);     // 获取乘车人成功
//				},500);
//			},
//			error:function(xhr,type,errorThrown){
//				
//			}
//		});
//	}
	
	
})(window);