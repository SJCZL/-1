
var httpctx='http://117.136.45.150:8080/apiticket';       // Janine

var app_key = localStorage.getItem('app_key');

(function(w) {
	
	//************************************* 购买往程车票
	
	//==========================》                   8.14  余票查询
	w.ajax_queryTicket=function(options) {
		console.log("ajax_queryTicket--->进入" );
		console.log(options.purpose_codes);
		console.log(options.queryDate);
		console.log(options.from_station);
		console.log(options.to_station);		
		
		mui.ajax(httpctx +'/queryTicket.do',{
			data:{
				purpose_codes : options.purpose_codes,   //人员类型（普通：ADULT，学生：0X00）
                queryDate : options.queryDate,    //出发日期（格式：2016-01-22）
                from_station : options.from_station, //出发地名称
                to_station : options.to_station      //目的地名称
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
	 
	 
	//==========================》                   8.15  初始化订单信息
	w.ajax_initWc = function(options) {
		console.log("ajax_initWc.进入--->");			
		mui.ajax(httpctx +'/initWc.do',{
			data:{
				appkey : app_key,
            },
			dataType:'json',//服务器返回json格式数据
			type:'get',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(data){
				console.log("ajax_initWc.success--->"+JSON.stringify(data)); //以Json的格式，将获得的数据打印在控制台上
				setTimeout(function(){
					initWcSuccess(data);
				},500);
			},
			error:function(xhr,type,errorThrown){	
			}
		});
	}
	
	
	//==========================》                      8.16提交订单
	w.ajax_confirmGoForQueue = function(options) {
		console.log("ajax_confirmGoForQueue.进入--->");
		mui.ajax(httpctx +'/confirmGoForQueue.do',{
			data:{
                key_check_isChange : options.key_check_isChange,  //由步骤图8.15获取）
                leftTicketStr : options.leftTicketStr, //（由步骤8.15获取）
                train_location : options.train_location, //（由步骤8.15获取）
                passengerTicketStr : options.passengerTicketStr, //（见步骤3.7）
                oldPassengerStr : options.oldPassengerStr, //（见步骤3.7）
                purpose_codes : "00",   //（人员类型）
                randCode : $("#randCode").val(),  //（验证码）
                REPEAT_SUBMIT_TOKEN : options.globaled, //由步骤3.3获取的globalRepeatSubmitToken
                appkey : app_key, //第一步获取的appkey
            },
			dataType:'json',//服务器返回json格式数据
			type:'POST',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(data){
				console.log("ajax_confirmGoForQueue.success--->"+JSON.stringify(data)); //以Json的格式，将获得的数据打印在控制台上
				setTimeout(function(){
					if(data.result.data.errMsg!=null){
						mui.toast(data.result.data.errMsg);
					}else if(data.result.data.errMsg==null&&data.result.data.submitStatus == true ){
						console.log("confirmGoForQueueSuccess----->")
						confirmGoForQueueSuccess(data);
					}
					
				},500);
			},
			error:function(xhr,type,errorThrown){	
			}
		});
	}
	
	//==========================》                      8.17获取提交订单结果
	w.ajax_resultOrderForWcQueue= function(options) {
		
		console.log("Janine20170111.ajax_resultOrderForWcQueue接收到的数据:" + 'orderSequence_no:' + options.orderSequence_no
                + ',REPEAT_SUBMIT_TOKEN:' + options.globaled
                + 'appkey:' + app_key);
                
		mui.ajax(httpctx +'/resultOrderForWcQueue.do',{
			data:{
				orderSequence_no : options.orderSequence_no,   //（订单号）
                REPEAT_SUBMIT_TOKEN : options.globaled,  //由步骤3.3获取的globalRepeatSubmitToken 
                appkey : app_key, //第一步获取的appkey
            },
			dataType:'json',//服务器返回json格式数据
			type:'POST',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(data){
				console.log("ajax_resultOrderForWcQueue.success--->"+JSON.stringify(data)); //以Json的格式，将获得的数据打印在控制台上
				setTimeout(function(){
					if(data.result.data.submitStatus==true){
						resultOrderForWcQueueSuccess(data);
					}else if(data.result.data.submitStatus== false){
						alert(data.result.data.errMsg);
					}
					
				},500);
			},
			error:function(xhr,type,errorThrown){	
			}
		});
	}
	
	//==========================》     8.18 付款初始化             
	w.ajax_payOrderWcInit = function(options){
        //获取验证码
        console.log("payOrderWcInit.进入--->");
  	    mui.ajax(httpctx +'/payOrderWcInit.do',{
			data:{
				token : options.globaled ,//由步骤8.15获取的globalRepeatSubmitToken 
                appkey : app_key, //第一步获取的appkey
			},
			dataType:'json',        //服务器返回json格式数据
			type:'get',            //HTTP请求类型
			timeout:10000,          //超时时间设置为10秒；
			success:function(data){
				console.log("ajax_payOrderWcInit.data--->"+JSON.stringify(data)); //以Json的格式，将获得的数据打印在控制台上
				payOrderWcInitSuccess(data);
			},
			error : function(data){  
		 	   	
	 	   }
		});
	}
	
	
	//************************************* 购买返程车票
	
	
	//==========================》                    8.19  查询余票
	/**
	 * Janine20170112修改:
	 * @param {Object} options
	 */
	w.ajax_leftTicketFcInit = function(options) {
		console.log("Janine20170112.ajax_leftTicketFcInit.进入--->");
		
		mui.ajax(httpctx +'/leftTicketInit.do',{
			data:{
				pre_step_flag : 'fcInit',
				appkey : app_key,                         //第一步获取的appkey
            },
			dataType:'json',                              //服务器返回json格式数据
			type:'POST',                                  //HTTP请求类型
			timeout:5000,                                 //超时时间设置为5秒
			success:function(data){
				console.log("Janine20170112.ajax_leftTicketFcInit.data--->" + JSON.stringify(data)); //以Json的格式，将获得的数据打印在控制台上
				 if(data.flag == true && data.result.from_station != null && data.result.from_station != '') {      
				    leftTicketFcInitSuccess(data);                // 当继续支付成功后           
                }else{
                	mui.toast("服务器请求失败!");
                }
			},
			error:function(xhr,type,errorThrown){	
			}
		});
	}
	
	
	//==========================》                   8.20  初始化订单信息
	w.ajax_initFc = function(options) {
		console.log("ajax_initFc.进入--->");			
		mui.ajax(httpctx +'/initFc.do',{
			data:{
				appkey : app_key,
            },
			dataType:'json',//服务器返回json格式数据
			type:'GET',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒
			success:function(data){
				console.log("ajax_initFc.success--->"+JSON.stringify(data)); //以Json的格式，将获得的数据打印在控制台上
				setTimeout(function(){
					initFcSuccess(data);
				},500);
			},
			error:function(xhr,type,errorThrown){	
			}
		});
	}
	
	//==========================》                      8.21提交订单
	w.ajax_confirmBackForQueue = function(options) {
		console.log("ajax_confirmBackForQueue.进入--->");
		console.log(options.province);
		console.log(options.city_name);
		mui.ajax(httpctx +'/confirmBackForQueue.do',{
			data:{
				dwAll:"N",
                key_check_isChange : options.key_check_isChange,  //由步骤图8.15获取）
                leftTicketStr : options.leftTicketStr, //（由步骤3.3获取）
                train_location : options.train_location, //（由步骤3.3获取）
                passengerTicketStr : options.passengerTicketStr, //（见步骤3.7）
                oldPassengerStr : options.oldPassengerStr, //（见步骤3.7）
                purpose_codes : options.purpose_codes,   //（人员类型）
                randCode : options.randCode,  //（验证码）
                roomType : "00" ,//（传值：00）
                REPEAT_SUBMIT_TOKEN : options.globalRepeatSubmitToken, //由步骤3.3获取的globalRepeatSubmitToken
                appkey : app_key, //第一步获取的appkey
            },
			dataType:'json',//服务器返回json格式数据
			type:'POST',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(data){
				console.log("ajax_confirmBackForQueue.success--->"+JSON.stringify(data)); //以Json的格式，将获得的数据打印在控制台上
				setTimeout(function(){
					confirmBackForQueueSuccess(data);
				},500);
			},
			error:function(xhr,type,errorThrown){	
			}
		});
	}
	
	//==========================》                      8.22获取提交订单结果
	w.ajax_resultOrderForFcQueue = function(options) {
		console.log("ajax_resultOrderForFcQueue.进入--->");
		mui.ajax(httpctx +'/resultOrderForFcQueue.do',{
			data:{
				orderSequence_no : options.orderSequence_no,   //（订单号）
                REPEAT_SUBMIT_TOKEN : options.globalRepeatSubmitToken,  //由步骤3.3获取的globalRepeatSubmitToken 
                appkey : app_key, //第一步获取的appkey
            },
			dataType:'json',//服务器返回json格式数据
			type:'POST',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(data){
				console.log("ajax_resultOrderForFcQueue.success--->"+JSON.stringify(data)); //以Json的格式，将获得的数据打印在控制台上
				setTimeout(function(){
					resultOrderForFcQueueSuccess(data);
				},500);
			},
			error:function(xhr,type,errorThrown){	
			}
		});
	}
	
	
	//==========================》     8.23 付款初始化             
	w.ajax_payOrderFcInit = function(options){
        //获取验证码
        console.log("payOrderFcInit.进入--->");
  	    mui.ajax(httpctx +'/payOrderFcInit.do',{
			data:{
				token : options.token , //由步骤8.15获取的globalRepeatSubmitToken 
                appkey : app_key,  //第一步获取的appkey
			},
			dataType:'json',        //服务器返回json格式数据
			type:'get',            //HTTP请求类型
			timeout:10000,          //超时时间设置为10秒；
			success:function(data){
				console.log("ajax_payOrderFcInit.data--->"+JSON.stringify(data)); //以Json的格式，将获得的数据打印在控制台上
				payOrderFcInitSuccess(data);
			},
			error : function(data){  
		 	   	
	 	   }
		});
	}
	
})(window);