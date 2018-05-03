/**
 * AJAX用于数据传输
 * 
 **/
var app_key = localStorage.getItem('app_key');

var httpctx='http://117.136.45.150:8080/apiticket';       // Janine

var dataResult;   										  // 接口传回来的有效数据
(function(w) {

	//==========================》                      1.0 获取appkey——OK
	w.ajax_get_appkey = function() {
		mui.ajax(httpctx +'/getAppkey.do', {
			dataType: 'json',                              //服务器返回json格式数据
			type: 'get',                                   //HTTP请求类型
			timeout: 5000,                                 //超时时间设置为5秒
			success: function(data) {
				/*	{
				  "code": 1,
				  "appkey": "ff808081550fc5e601551e7ec2ca000e"  // 这个值每次都可能不一样，需要进行本地存储
				}*/
				console.log(JSON.stringify(data));              //以Json的格式，将获得的数据打印在控制台上
				localStorage.setItem('app_key', data.appkey);   // 将app_key缓存到手机上
//				closeStartScreent();                            //关闭启动页面
			},
			error: function(xhr, type, errorThrown) {
				mui.toast("服务器出错!");
			}
		});

	};
	
	//==========================》                      2.1 获取验证码——OK
	w.ajax_getPassCodeNew = function(options) {
		console.log("Janine:ajax_getPassCodeNew-->" 
			+ 'app_key:' + app_key);
		mui.ajax(httpctx +'/getPassCodeNew.do',{
			data:{
				module : "login",
			    rand : "sjrand",
			    appkey : app_key
			},
			dataType:'json',                                    //服务器返回json格式数据
			type:'get',                                         //HTTP请求类型
			timeout:5000,                                       //超时时间设置为5秒
			success:function(data){
				console.log("Janine:ajax_getPassCodeNew.data--->"+JSON.stringify(data)); 
				setTimeout(function(){
					getPassCodeNewSuccess(data);                 // 获取验证码成功
				},500);
			},
		    error:function(data){  
	 	      mui.toast("服务器出错!");
		    }
		});
	}
	
	//==========================》                      2.2 检测验证码,登录时,要检查验证码是否正确——OK
	w.ajax_checkForLogin = function(options){  
		console.log("Janine:ajax_checkForLogin.进入-->");
		console.log("Janine:ajax_checkForLogin.randCode-->" + $("#randCode").val()
			+ ',app_key:' + app_key);
		mui.ajax(httpctx +'/checkForLogin.do',{
			data:{
				    randCode : $("#randCode").val(),    // 点击的验证码坐标
			        rand : "sjrand",
			        appkey : app_key
				},
			dataType:'json',                            //服务器返回json格式数据
			type:'POST',                                //HTTP请求类型
			timeout:5000,                               //超时时间设置为5秒
			success:function(data){
				console.log("Janine:ajax_checkForLogin.data--->" + JSON.stringify(data)); 
                dataResult = data.result;
                // Janine:表示向服务器请求成功
                if(data.flag == true){
                	// Janine:表示向12306请求成功
                	if(dataResult.status == true && dataResult.httpstatus == 200 ){
                		// 则dataItem.data.result == 1是成功返回的信息
                		if(dataResult.data.result == 1) {
				    		checkForLoginSuccess(data);      
                		}else {
	    		    		if(data.msg == "EXPIRED") {
	    			   			mui.alert("验证码过期!"); 
		    				} else {
		    		   			mui.alert("验证码不正确!"); 
		    				}
	    		    		ajax_getPassCodeNew({});        // 验证码过期，重新获取
	    				}
                	}
                }else{
                	// Janine:表示向12306请求失败——{"flag":false,"msg":"失败","result":""}
                	//mui.toast("请求服务器失败!");      //20170104
                	ajax_getPassCodeNew({});        // 验证码过期，重新获取
                }
			},
			error : function(data){  
	 	   	    mui.toast("checkForLogin 出错了!!");  
	 	  	    ajax_getPassCodeNew({});
	 	    }
		});

	}
	
	//==========================》                      2.3 检查用户是否登录——OK
	w.ajax_checkUser = function(options){
		console.log("Janine:ajax_checkUser.进入--->");
  	    mui.ajax(httpctx +'/checkUser.do',{
			data:{
				    appkey : app_key                  // 第一步获取的appkey
				},
			dataType:'json',                          // 服务器返回json格式数据
			type:'post',                              // HTTP请求类型
			timeout:5000,                             // 超时时间设置为5秒
			success:function(data){
				console.log("Janine:ajax_checkUser.data--->" + JSON.stringify(data)); 
				if(data.flag == true){
				   	checkUserSuccess(data);
				}else{
					//mui.toast("请求服务器失败！");      
				}
			},
			error : function(data){  
		 	   	mui.alert("ajax_checkUser 服务器出错！");  
		 	  	ajax_getPassCodeNew({});
	 	   }
		});
	}
	
	//==========================》                      2.4 用户登录，包含检测验证码——OK
	w.ajax_login = function(options){
		console.log("Janine:ajax_login.进入--->");
		console.log("Janine:ajax_login.接收到的数据--->" 
			+ "username:" + options.username
			+ ",pwd:" + options.pwd
			+ ",app_key:" + app_key);
        //检测验证码
  	    mui.ajax(httpctx +'/loginUser.do',{
			data:{
				    userName:options.username,        // 12306账号的用户名
				    password:options.pwd,      		  // 12306账号的密码
				    randCode:$("#randCode").val(),    // 上一步点击的验证码坐标
				    appkey:app_key                    // 第一步获取的appkey
				},
			dataType:'json',        				  // 服务器返回json格式数据
			type:'post',                              // HTTP请求类型
			timeout:5000,                             // 超时时间设置为5秒
			success:function(data){
				console.log("Janine:ajax_login.loginUser.data--->"+JSON.stringify(data)); 
				dataItem = data.result; 
				if(dataItem.status == true){
					if(dataItem.data.status == true){
				  		loginSuccess(data);
					}else if(dataItem.data.status == false){
						// Janine:12306返回的数据——密码输入错误。如果输错次数超过4次，用户将被锁定。
						mui.alert(dataItem.data.loginFail);  //Janine20170106修改
						console.log("ajax_login:" + dataItem.data.loginFail);
						ajax_getPassCodeNew({});
					}
				}else{
					mui.alert("12306返回的信息:" + dataItem.messages);
					ajax_getPassCodeNew({});
				}
				
			},
			error : function(data){  
		 	  // 	mui.alert("ajax_login 请查看网络!");  
		 	  	ajax_getPassCodeNew({});
	 	   }
		});
	}
	
	//==========================》                      2.5 退出登录——OK
	w.ajax_logout = function(options){
		mui.ajax(httpctx +'/loginOut.do',{
			data:{
				appkey : app_key
			},
			dataType:'json',             // 服务器返回json格式数据
			type:'post',                 // HTTP请求类型
			timeout:5000,                // 超时时间设置为5秒
			success:function(data){
				console.log("Janine:ajax_logout.data:"+JSON.stringify(data)); 
				// Janine:data.result.code == 1表示退出成功
				if(data.result.code == 1){
					logoutSuccess(data);  // 调用退出成功的方法	
				}
			},
			error : function(data){  
		 	   //	mui.alert("ajax_logout 请查看网络!");  //20170104
		 	}
		});
	}
	
	//==========================》                      3.1（预订）查询余票/ 6.2查询余票
	w.ajax_get_leftTicket = function(options) {
		console.log("ajax_get_leftTicke.进入--->");
		// 接收到的上一页面的参数
		console.log("purpose_codes:" + options.purpose_codes 
			+ ",train_date:" + options.train_date 
			+ ",from_station:" + options.from_station 
			+ ",to_station:" + options.to_station);
				
		mui.ajax(httpctx +'/leftTicket.do',{
			data:{
			    purpose_codes : options.purpose_codes,
			    train_date : options.train_date,
			    from_station : options.from_station,
			    to_station : options.to_station,
            },
			dataType:'json',                          //服务器返回json格式数据
			type:'get',                               //HTTP请求类型
			timeout:10000,                            //超时时间设置为10秒
			success:function(data){
				console.log("ajax_get_leftTicke.success--->"+JSON.stringify(data)); //以Json的格式，将获得的数据打印在控制台上
				if(data.flag == true){
					if(data.result.status == true){
						getleftTicketSuccess(data);
					}else{
						mui.toast("没有查到相关信息，请重试!"); 
						getleftTicketFailure();
					}
				}else{
					getleftTicketFailure();
				}
				
			},
			error:function(xhr,type,errorThrown){
				//mui.alert("请查看网络!"); //20170104
			}
		});
	}
	
	//==========================》                      3.2  点击“预订”检查车票信息/6.3 点击“预订”检查车票信息
	w.ajax_submitOrderRequest = function(options) {
		console.log("Janine:ajax_submitOrderRequest.进入--->");
		console.log("Janine:ajax_submitOrderRequest.需要请求的数据--->" + "back_train_date:" + options.back_train_date
		            + ",train_date:" + options.train_date
		            + ",purpose_codes:" + options.purpose_codes
		            + ",from_station_name:" + options.from_station_name
		            + ",to_station_name:" + options.to_station_name
		            + ",tour_flag:" + options.tour_flag
		            + ",secretStr:" + options.secretStr);
		mui.ajax(httpctx+'/submitOrderRequest.do',{
			data:{
				back_train_date : options.back_train_date,
				train_date : options.train_date,
			    purpose_codes : options.purpose_codes,
			    query_from_station_name : options.from_station_name,
			    query_to_station_name : options.to_station_name,
			    secretStr : options.secretStr,
			    appkey : app_key,
			    tour_flag : options.tour_flag,           // 此处根据情况传值
            },
			dataType:'json',                    // 服务器返回json格式数据
			type:'post',                        // HTTP请求类型
			timeout:5000,                      	// 超时时间设置为5秒
			success:function(data){
				dataResult = data.result;
				console.log("ajax_submitOrderRequest.success--->" + JSON.stringify(data)); //以Json的格式，将获得的数据打印在控制台上
				if(dataResult.status == true){
					submitOrderRequestSuccess(dataResult);
				}else{
					submitOrderRequestFalse(dataResult);
				}
			},
			error : function(data){
				
			}
		});
	}
	
	//==========================》                      3.3 初始化订单信息
	w.ajax_get_initDc=function(options) {
		console.log("ajax_get_initDc.app_key--->" + app_key);
		mui.ajax(httpctx +'/initDc.do',{
			data:{
				appkey:app_key
			},
			dataType:'json',                                  // 服务器返回json格式数据
			type:'get',                                       // HTTP请求类型
			timeout:10000,                                    // 超时时间设置为10秒
			success:function(data){
				console.log("Janine:ajax_get_initDc.success--->");
				console.log("ajax_get_initDc--->"+JSON.stringify(data)); // 以Json的格式，将获得的数据打印在控制台上
				setTimeout(function(){
					console.log("Janine:ajax_get_initDc.getinitDcSuccess--->");
					getinitDcSuccess(data);
				},500);
			},
			error:function(xhr,type,errorThrown){
				
			}
		});
	}
	
	//==========================》                      3.4  获取乘客信息
	w.ajax_getPassenger=function(options) {
		console.log("Janine:ajax_getPassenger.进入--->");
		console.log("Janine:ajax_getPassenger.进入--->" 
					+ 'globalRepeatSubmitToken:' + options.global
					+ ',app_key:' + app_key);
		mui.ajax(httpctx +'/getPassenger.do',{
			data:{
				  globalRepeatSubmitToken:options.global,   // 第 3.3 步获取的
				  appkey:app_key
			},
			dataType:'json',       // 服务器返回json格式数据
			type:'get',            // HTTP请求类型
			timeout:10000,         // 超时时间设置为10秒；
			success:function(data){
				console.log("ajax_getPassenger.success--->");
				console.log("ajax_getPassenger--->" + JSON.stringify(data)); // 以Json的格式，将获得的数据打印在控制台上
				setTimeout(function(){
					getPassengerSuccess(data);     // 获取乘车人成功
				},500);
			},
			error:function(xhr,type,errorThrown){
				
			}
		});
	}
	
	//==========================》                      3.5 获取验证码/6.5 获取验证码
	w.ajax_getPassCodeNewPassenger = function(options) {
		mui.ajax(httpctx +'/getPassCodeNew.do',{
			data:{
				module : "passenger",
			    rand : "randp",
			    appkey : app_key
			},
			dataType:'json',            // 服务器返回json格式数据
			type:'get',                 // HTTP请求类型
			timeout:10000,              // 超时时间设置为10秒
			success:function(data){
				console.log("ajax_getPassCodeNew.data--->" + JSON.stringify(data)); // 以Json的格式，将获得的数据打印在控制台上
				setTimeout(function(){
					getPassCodeNewSuccess(data);   // 获取验证码成功
				},500);
			},
		    error:function(data){  
	 	      mui.toast("获取验证码出错!");
		    }
		});
	}
	
	//==========================》                      3.6 检测验证码/6.6 检测验证码
	w.ajax_checkForOrder = function(options){  
		console.log("ajax_checkForOrder.传过来的数据：" + "REPEAT_SUBMIT_TOKEN:"+options.globaled
			+",randCode:" + $("#randCode").val()+",app_key:" + app_key);
		 mui.ajax(httpctx + '/checkForOrder.do',{
			data:{
				REPEAT_SUBMIT_TOKEN : options.globaled,    //globalRepeatSubmitToken
				randCode : $("#randCode").val(),           //（验证码的坐标）
				rand : 'randp',                            //（传值：randp）
				appkey : app_key
			},
			dataType:'json',                              //服务器返回json格式数据
			type:'POST',                                  //HTTP请求类型
			timeout:10000,                                //超时时间设置为10秒
			success:function(data){
				console.log("ajax_checkForOrder.data--->" + JSON.stringify(data)); // 以Json的格式，将获得的数据打印在控制台上
                dataResult = data.result;
               	if(dataResult.data.result == 1) {                  
				    mui.toast("验证码正确");
				    checkForOrderSuccess(data);
                }else {
	    		    if(data.msg == "EXPIRED") {
	    			   mui.toast("验证码过期!"); 
		    		} else {
		    		   mui.toast("验证码不正确!"); 
		    		}
	    		    ajax_getPassCodeNewPassenger({});                // 如果验证码不正确，就重新获取验证码
	    		}
			},
			error : function(data){  
	 	   	     mui.toast("checkForOrder 出错了!!");  
	 	  	     ajax_getPassCodeNewPassenger({});
	 	    }
		});
	}

	//==========================》                      3.7 检查确认订单/6.7检查确认订单
	w.ajax_checkOrderInfo = function(options) {
		console.log("ajax_checkOrderInfo.传过来的数据："+"passengerTicketStr:"+options.passengerTicketStr
			+ ";oldPassengerStr:" + options.oldPassengerStr
			+ ";globaled:" + options.globaled
			+ ";tour_flag:" + options.tour_flag);
		mui.ajax(httpctx+'/checkOrderInfo.do',{
			data:{
				cancel_flag : "2",
				bed_level_order_num : "000000000000000000000000000000",
				passengerTicketStr : options.passengerTicketStr,
				oldPassengerStr : options.oldPassengerStr,
				tour_flag : options.tour_flag,
//				randCode : $("#randCode").val(),
                randCode : '',
                _json_att: '',
				REPEAT_SUBMIT_TOKEN : options.globaled,
				appkey : app_key
            },
			dataType:'json',                             // 服务器返回json格式数据
			type:'post',                                 // HTTP请求类型
			timeout:10000,                               // 超时时间设置为10秒
			success:function(data){
				console.log("Janinel:检测确认订单.ajax_checkOrderInfo.data--->" + JSON.stringify(data));   // 以Json的格式，将获得的数据打印在控制台上
				dataResult = data.result;
				if(dataResult.status == true){
					if(dataResult.data.submitStatus == true){
						console.log("dataResult.data.submitStatus==true");
						checkOrderInfoSuccess(data);
					}else{
						mui.alert("Janine.12306弹出的错误信息:" + dataResult.data.errMsg);   
						ajax_getPassCodeNew({});
					}
				}else{
					mui.alert(dataResult.messages); 
					ajax_getPassCodeNew({});
				}
			},
			error:function(data){  
	 	   		mui.alert("checkOrderInfo 出错了!!");  
	 	   		ajax_getPassCodeNew({});
	 	    }
		});
	}
	
	//==========================》                      3.9 提交订单
	w.ajax_confirmSingleForQueue= function(options){  
		console.log("ajax_confirmSingleForQueue.传过来的值:"
				+ "key_check_isChange:"+options.key_check_isChange
				+ ";leftTicketStr:" + options.leftTicketStr 
				+ ";train_location:" + options.train_location
				+ ";REPEAT_SUBMIT_TOKEN:" + options.globaled
				+ ";passengerTicketStr:" + options.passengerTicketStr
				+ ";oldPassengerStr:" + options.oldPassengerStr
				+ ";purpose_codes:"+ options.purpose_codes
				+ ";randCode:" + $("#randCode").val()
				+ ";app_key:"+app_key);
		mui.ajax(httpctx+'/confirmSingleForQueue.do',{
			data:{
                key_check_isChange: options.key_check_isChange,         //（由步骤3.3获取）
                leftTicketStr : options.leftTicketStr ,                 //（由步骤3.3获取）
                train_location : options.train_location ,               //（由步骤3.3获取）
                passengerTicketStr : options.passengerTicketStr ,       //（见步骤3.7）
                oldPassengerStr : options.oldPassengerStr,              //（见步骤3.7）
//              purpose_codes : options.purpose_codes,                  //（人员类型）
				purpose_codes : "00",  
//              randCode : $("#randCode").val() ,                       //（验证码）
                randCode : '' ,      // Janine（验证码）:由于春运期间12306对购票验证码有所改动，暂时以空值传输
//              roomType : "00",                                        //（传值：00）
                REPEAT_SUBMIT_TOKEN : options.globaled,                 //globalRepeatSubmitToken
				appkey : app_key
			},
			dataType:'json',                                            //服务器返回json格式数据
			type:'POST',                                                //HTTP请求类型
			timeout:5000,                                              //超时时间设置为10秒
			success:function(data){
				dataResult = data.result;
				console.log("ajax_confirmSingleForQueue.data--->" + JSON.stringify(data)); // 以Json的格式，将获得的数据打印在控制台上
                if(dataResult.data.submitStatus == true) {
                	mui.toast("提交成功");
				    confirmSingleForQueueSuccess(data);                 // 提交订单成功
                }else{
                	
                	if(dataResult.data=="扣票失败"){
                		mui.toast(dataResult.data);
                	}else{
                		mui.toast(dataResult.data.errMsg);
                	}             // 需要对这里的错误信息进行处理
//              	ajax_getPassCodeNewPassenger({});                   // 重新获取验证码(Janine20170106修改:由于12306购票时，无需获取验证码，故注释)         
                }
			},
			error:function(data){  
	 	   	     mui.toast("confirmSingleForQueue 出错了!!"); 
//	 	   	     ajax_getPassCodeNewPassenger({});                      // 重新获取验证码(Janine20170106修改:由于12306购票时，无需获取验证码，故注释)  
	 	    }
		});
	}
	
	//==========================》                      3.10 查询出票等待时间/6.10 查询出票等待时间
	w.ajax_queryOrderWaitTime = function(options){
		console.log("ajax_queryOrderWaitTime.传过来的值:"
			+ "REPEAT_SUBMIT_TOKEN:" + options.globaled
			+ ",tourFlag:" + options.tourFlag);
		mui.ajax(httpctx+'/queryOrderWaitTime.do',{
			data:{
				tourFlag : options.tourFlag,                               // 单程：dc，往返：wc
                REPEAT_SUBMIT_TOKEN : options.globaled,                    // globalRepeatSubmitToken
				appkey : app_key
			},
			dataType:'json',                                               // 服务器返回json格式数据
			type:'GET',                                                    // HTTP请求类型
			timeout:5000,                                                 // 超时时间设置为10秒
			success:function(data){
				console.log("ajax_queryOrderWaitTime.data--->" + JSON.stringify(data)); // 以Json的格式，将获得的数据打印在控制台上
				dataResult = data.result;
                if(dataResult.data.queryOrderWaitTimeStatus == true) {     // 等待的时间状态等于true
				    queryOrderWaitTimeSuccess(data);                           
                }else{
                	mui.toast(dataResult.data.errMsg);
                }
			},
			error : function(data){  
	 	   	     mui.toast("queryOrderWaitTime 出错了!!"); 
	 	    }
		});
	}
	
	//==========================》                      3.11 获取订单提交结果
	w.ajax_resultOrderForDcQueue = function(options){
		console.log("ajax_resultOrderForDcQueue.传过来的值:"+ "REPEAT_SUBMIT_TOKEN:" + options.globaled
		+ ";orderSequence_no:" + options.orderSequence_no);
		mui.ajax(httpctx+'/resultOrderForDcQueue.do',{
			data:{
				orderSequence_no : options.orderSequence_no,            // 订单号
                REPEAT_SUBMIT_TOKEN : options.globaled,                 // globalRepeatSubmitToken
				appkey : app_key
			},
			dataType:'json',                                            // 服务器返回json格式数据
			type:'POST',                                                // HTTP请求类型
			timeout:5000,                                               // 超时时间设置为10秒
			success:function(data){
				console.log("ajax_resultOrderForDcQueue.data--->" + JSON.stringify(data)); // 以Json的格式，将获得的数据打印在控制台上
				dataResult = data.result;
                if(dataResult.data.submitStatus == true) {     
				    resultOrderForDcQueueSuccess(data);                  // 当获取订单提交的结果正确时，调用该方法         
                }else{
                	mui.toast(dataResult.data.errMsg);
                }
			},
			error : function(data){  
	 	   	     mui.toast("resultOrderForDcQueue 出错了!!"); 
	 	    }
		});
	}
	
	//==========================》                      4.1 网上支付初始化
	w.ajax_payOrderInit = function(options){
		console.log("ajax_payOrderInit.进来--->");
		console.log("ajax_payOrderInit.传过来的值:"+ "token:" + options.globaled);
		mui.ajax(httpctx+'/payOrderInit.do',{
			data:{
                token  : options.globaled,                  // 由步骤3.3获取的globalRepeatSubmitToken 
				appkey : app_key                            //第一步获取的appkey
			},
			dataType:'json',                                            // 服务器返回json格式数据
			type:'GET',                                                 // HTTP请求类型
			timeout:10000,                                              // 超时时间设置为10秒
			success:function(data){
				console.log("Janine.20170110.:ajax_payOrderInit.data--->" + JSON.stringify(data)); // 以Json的格式，将获得的数据打印在控制台上
                if(data.ticketForm != null && data.ticketForm !="") {      
				    payOrderInitSuccess(data);       // 网上支付初始化                     
                }else{
                	mui.toast("请重试!");
                }
			},
			error : function(data){  
	 	   	     mui.toast("payOrderInit 出错了!!"); 
	 	    }
		});
	}
	
	//==========================》                      4.2 获取网上支付相关的参数
	w.ajax_payGateway = function(){
		console.log("ajax_payGateway.进入--->");
		mui.ajax(httpctx+'/payGateway.do',{
			data:{
				appkey : app_key                            //第一步获取的appkey
			},
			dataType:'json',                                // 服务器返回json格式数据
			type:'POST',                                    // HTTP请求类型
			timeout:10000,                                  // 超时时间设置为10秒
			success:function(data){
				console.log("ajax_payGateway.data--->" + JSON.stringify(data)); // 以Json的格式，将获得的数据打印在控制台上
                if(data.tranData != "" && data.tranData != null) {      
				    payGatewaySuccess(data);             // 获取网上支付相关的参数成功后，调用              
                }else{
                	mui.toast("请重试!");
                }
			},
			error : function(data){  
	 	   	     mui.toast("payGateway 出错了!!"); 
	 	    }
		});
	}
	
	//==========================》                      4.3 提交支付方式
	w.ajax_webBusiness = function(options){
		console.log("ajax_webBusiness.进入--->");
		console.log("ajax_webBusiness.进入--->"+"tranData:" + options.tranData
			+ ";merSignMsg:"+ options.merSignMsg
			+ ";appId:" + options.appId
			+ ";transType:" + options.transType
			+ ";channelId:" + options.channelId
			+ ";orderTimeoutDate:" + options.orderTimeoutDate
			+ ";bankId:" + options.bankId );
		mui.ajax(httpctx+'/webBusiness.do',{
			data:{
				tranData : options.tranData,                         //（由步骤4.2获取）
				merSignMsg : options.merSignMsg,                     //（由步骤4.2获取）
				appId : options.appId,                               //（由步骤4.2获取）
				transType : options.transType,                       //（由步骤4.2获取）
				channelId : 5,    					                 //Janine20170110:5
   				merCustomIp : options.merCustomIp,                   //（由步骤4.2获取）
   				orderTimeoutDate : options.orderTimeoutDate,         //（由步骤4.2获取）
   				bankId : options.bankId,                             //（支付方式id）
			},
			dataType:'html',                                // 服务器返回html标签
			type:'POST',                                    // HTTP请求类型
			timeout:10000,                                  // 超时时间设置为10秒
			success:function(data){
				console.log("ajax_webBusiness.data--->" + JSON.stringify(data)); // 以Json的格式，将获得的数据打印在控制台上
                if(data != "" && data != null) {      
				    webBusinessSuccess(data);                           
                }else{
                	mui.toast("请重试!");
                }
			},
			error : function(data){  
	 	   	     mui.toast("payGateway 出错了!!"); 
	 	    }
		});
	}
	
	//==========================》                      4.4 继续支付
	w.ajax_continuePay = function(options){
		console.log("ajax_continuePay.进入--->");
		console.log("ajax_continuePay.进入--->"
			+ "sequence_no:" + options.sequence_no
			+ ",pay_flag:" + options.pay_flag);
		mui.ajax(httpctx+'/continuePay.do',{
			data:{
				pay_flag : options.pay_flag,                  // pay_flag:(传值：pay/resign)
				sequence_no : options.sequence_no,           // 订单号
				appkey : app_key,                            // 第一步获取的appkey
			},
			dataType:'json',                                 // 服务器返回html标签
			type:'POST',                                     // HTTP请求类型
			timeout:10000,                                   // 超时时间设置为10秒
			success:function(data){
				console.log("Janine:ajax_continuePay.data--->" + JSON.stringify(data));   // 以Json的格式，将获得的数据打印在控制台上
                if(data.data.existError == 'N') {      
				    continuePaySuccess(data);                // 当继续支付成功后           
                }else{
                	mui.toast("请重试!");
                }
			},
			error : function(data){  
	 	   	     mui.toast("payGateway 出错了!!"); 
	 	    }
		});
	}
	
	//==========================》                      4.5 继续支付初始化
	w.ajax_continuePayInit = function(options){
		console.log("ajax_continuePayInit.进来--->");
		mui.ajax(httpctx+'/continuePayInit.do',{
			data:{
				appkey : app_key                                        //第一步获取的appkey
			},
			dataType:'json',                                            // 服务器返回json格式数据
			type:'GET',                                                 // HTTP请求类型
			timeout:10000,                                              // 超时时间设置为10秒
			success:function(data){
				console.log("ajax_continuePayInit.data--->" + JSON.stringify(data));     // 以Json的格式，将获得的数据打印在控制台上
                if(data.ticketForm != null && data.ticketForm !="") {      
				    continuePayInitSuccess(data);                       // 网上支付初始化                     
                }else{
                	mui.toast("请重试!");
                }
			},
			error : function(data){  
	 	   	     mui.toast("continuePayInit 出错了!!"); 
	 	    }
		});
	}
	
	//==========================》                      5.1 未完成订单:未成功出票，或者已出票但未付款的订单，可在未完成订单里查看
	w.ajax_unfinishedOrder = function(options){
		console.log("ajax_unfinishedOrder.进入--->");
		mui.ajax(httpctx+'/unfinishedOrder.do',{
			data:{
				appkey : app_key                            
			},
			dataType:'json',                                // 服务器返回html标签
			type:'GET',                                     // HTTP请求类型
			timeout:10000,                                  // 超时时间设置为10秒
			success:function(data){
				dataItem = data.result;
				console.log("ajax_unfinishedOrder.data--->" + JSON.stringify(data)); // 以Json的格式，将获得的数据打印在控制台上
                if(dataItem.data != "" && dataItem.data != null) {      
				    unfinishedOrderSuccess(data);            // 查看未完成订单成功                     
                }else if(dataItem.messages == null || dataItem.messages ==''){
                	unfinishedOrderFailure();
                }else{
                	mui.toast(dataItem.messages);
                }
			},
			error : function(data){  
	 	   	     mui.toast("unfinishedOrder 出错了!!"); 
	 	    }
		});
	}
	
//=================================== Janine20170109修改:暂时不需要该方法   ===================================//
//	//==========================》                      5.2 取消订单（未出票，订单排队中）:没了票还没付钱，未出票，订单排队中的订单，可以取消
//	w.ajax_cancelQueueOrder = function(options){
//		console.log("ajax_cancelQueueOrder.进入--->");
//		mui.ajax(httpctx+'/cancelQueueOrder.do',{
//			data:{
//				tourFlag : 'dc',
//				appkey : app_key                            
//			},
//			dataType:'json',                                 // 服务器返回html标签
//			type:'POST',                                     // HTTP请求类型
//			timeout:5000,                                   // 超时时间设置为5秒
//			success:function(data){
//				// 此处接口返回的数据，没有抓取
//				console.log("ajax_cancelQueueOrder.data--->" + JSON.stringify(data)); // 以Json的格式，将获得的数据打印在控制台上
//              dataResult = data.result;
//              if(dataResult.data.existError = "Y" ) {
//              	cancelQueueOrderFailure(data);
//              }else if(dataResult.data.existError = "N") {
//              	cancelQueueOrderSuccess(data);
//              }else if(dataResult.messages = "该用户已在其他地点登录，本次登录已失效!"){
//              	mui.toast(dataResult.messages);
//              }else {
//              	mui.toast("请重试!");
//              }
//			},
//			error : function(data){  
//	 	   	     mui.toast("cancelQueueOrder 出错了!!"); 
//	 	    }
//		});
//	}
	
	//==========================》                     5.3.1  取消订单（已出票，但未付款）: 未完成订单里，已成功出票，但未付款的订单，可以取消
	//==========================》                     Janine20170109 : 在未完成订单界面使用该接口
	w.ajax_cancelOrder = function(options){
		console.log("ajax_cancelOrder.进入--->");
		console.log("ajax_cancelOrder.将要传输的数据--->" 
						+ 'sequence_no:' + options.sequence_no
						+ ',cancel_flag:' + options.cancel_flag);
		mui.ajax(httpctx + '/cancelOrder.do',{
			data:{
				sequence_no :  options.sequence_no,                 //订单号
				cancel_flag : options.cancel_flag,
				appkey : app_key                            
			},
			dataType:'json',                                       // 服务器返回html标签
			type:'POST',                                           // HTTP请求类型
			timeout:10000,                                         // 超时时间设置为10秒
			success:function(data){
				console.log("ajax_cancelOrder.data--->" + JSON.stringify(data));   // 以Json的格式，将获得的数据打印在控制台上
                dataResult = data.result;
                if(dataResult.data.existError == "Y" ) {
                	cancelOrderFailure(data);
                }else if(dataResult.data.existError == "N") {
                	cancelOrderSuccess(data);
                }else {
                	mui.toast(dataResult.messages);
                }
			},
			error : function(data){  
	 	   	     mui.toast("cancelOrder 出错了!!"); 
	 	    }
		});
	}
	
	//==========================》                     5.3.2 取消订单（已出票，但未付款）:未完成订单里，已成功出票，但未付款的订单，可以取消
	w.ajax_cancel = function(options){
		console.log("ajax_cancel.进入--->");
		console.log("ajax_cancel.将要传输的数据--->" 
						+ 'sequence_no:' + options.sequence_no
						+ ',parOrderDTOJson:' + options.parOrderDTOJson
						+ ',orderRequestDTOJson:' + options.orderRequestDTOJson);
		mui.ajax(httpctx + '/cancel.do',{
			data:{
				sequence_no :  options.sequence_no,                  // 订单号
				parOrderDTOJson : options.parOrderDTOJson,			 // Janine20170109修改 : 从payOrderInit.do接口中获取
				orderRequestDTOJson : options.orderRequestDTOJson,   // Janine20170109修改 : 从payOrderInit.do接口中获取
				appkey : app_key                            
			},
			dataType : 'json',                                       // 服务器返回html标签
			type : 'POST',                                           // HTTP请求类型
			timeout : 10000,                                         // 超时时间设置为10秒
			success : function(data){
				console.log("ajax_cancel.data--->" + JSON.stringify(data));   // 以Json的格式，将获得的数据打印在控制台上
                dataResult = data.result;
               	///Jn
               	if(dataResult.data.cancelStatus == true) {
                	cancelSuccess(data);
                }else if(dataResult.data.cancelStatus == false) {
                	cancelFailure(data);
                }else {
                	mui.toast(dataResult.messages);
                }
			},
			error : function(data){  
	 	   	     mui.toast("cancel 出错了!!"); 
	 	    }
		});
	}
	
	//==========================》                     5.4  历史订单:查看历史订单
	w.ajax_finishedOrder_H = function(options){
		console.log("ajax_finishedOrder_H.进入--->");
		console.log("ajax_finishedOrder_H.将要传输的数据--->" 
				+ "queryStartDate:" + options.start_time                         // 查询日期-开始
				+ ",queryEndDate:" + options.end_time                            // 查询日期-结束
				+ ",sequeue_train_name:" + options.sequeue_train_name);
		mui.ajax(httpctx+'/finishedOrder_H.do',{
			data:{
				
				queryStartDate : options.start_time,                         // 查询日期-开始
				queryEndDate : options.end_time,                             // 查询日期-结束
				sequeue_train_name : options.sequeue_train_name,             // 订单号/车次/乘客姓名  若为空就传空字符串，若不为空，中文utf-8编码
				appkey : app_key                                             // 第一步获取的appkey
                         
			},
			dataType:'json',                                // 服务器返回html标签
			type:'GET',                                     // HTTP请求类型
			timeout:5000,                                   // 超时时间设置为5秒
			success:function(data){
				
				console.log("ajax_finishedOrder_H--->" + JSON.stringify(data)); // 以Json的格式，将获得的数据打印在控制台上
                if(data != "" && data != null) {      
				    finishedOrder_HSuccess(data);                           
                }else{
                	mui.toast("请重试!");
                }
			},
			error : function(data){  
	 	   	     mui.toast("finishedOrder_H 出错了!!"); 
	 	    }
		});
	}
	
	//==========================》                     5.5 未出行订单
	w.ajax_finishedOrder_G = function(options){
		console.log("ajax_finishedOrder_G.进入--->");
		console.log("ajax_finishedOrder_G.接收的数据--->" 
				+ "queryType:" + options.queryType
				+ ",queryStartDate:" + options.start_time
				+ ",queryEndDate:" + options.end_time
		        + ",sequeue_train_name:" + options.sequeue_train_name);
		mui.ajax(httpctx+'/finishedOrder_G.do',{
			data:{
				
				queryType : options.queryType,                       // 1、按订票日期查询 2、按乘车日期查询
			 	queryStartDate : options.start_time,                 // 查询日期-开始
			 	queryEndDate : options.end_time,                     // 查询日期-结束
			 	sequeue_train_name : options.sequeue_train_name,     // 订单号/车次/乘客姓名  若为空就传空字符串，若不为空，中文utf-8编码
			 	appkey : app_key                                     // 第一步获取的appkey
			
			},
			dataType:'json',                                        // 服务器返回html标签
			type:'GET',                                             // HTTP请求类型
			timeout:10000,                                          // 超时时间设置为10秒
			success:function(data){
				dataItem = data.result;
				console.log("ajax_finishedOrder_G--->" + JSON.stringify(data)); // 以Json的格式，将获得的数据打印在控制台上
                if(dataItem.status == true) { 
                	if(dataItem.data != null && dataItem.data !=''){
                		unfinishedOrder_GSuccess(data);     
                	}else{
                		mui.toast(dataItem.messages);
                	}
                }else{
                	mui.toast("请重试!");
                }
			},
			error : function(data){  
	 	   	     mui.toast("finishedOrder_G 出错了!!"); 
	 	    }
		});
		
	}
	
	//==========================》                     5.6 检查订单是否可以退票
	w.ajax_returnTicketAffirm = function(options){
		console.log("ajax_returnTicketAffirm.进入--->");
		console.log("ajax_returnTicketAffirm.接收的数据--->" 
				+ "sequence_no:" + options.sequence_no 
   				+ ",batch_no:" + options.batch_no
   				+ ",coach_no:" + options.coach_no
   				+ ",seat_no:" + options.seat_no
   				+ ",start_train_date_page:" + options.start_train_date_page
   				+ ",train_code:" + options.train_code
   				+ ",coach_name:" + options.coach_name
   				+ ",seat_name:" + options.seat_name
   				+ ",seat_type_name:" + options.seat_type_name
   				+ ",train_date:" + options.train_date
   				+ ",from_station_name:" + options.from_station_name
   				+ ",to_station_name:" + options.to_station_name
   				+ ",start_time:" + options.start_time
   				+ ",passenger_name:" + options.passenger_name
		);
		mui.ajax(httpctx+'/returnTicketAffirm.do',{
			data:{
				
				sequence_no : options.sequence_no,
   				batch_no : options.batch_no,
   				coach_no : options.coach_no,
   				seat_no : options.seat_no,
   				start_train_date_page : options.start_train_date_page,
   				train_code : options.train_code,
   				coach_name : options.coach_name,
   				seat_name : options.seat_name,
   				seat_type_name : options.seat_type_name,
   				train_date : options.train_date,
   				from_station_name : options.from_station_name,
   				to_station_name : options.to_station_name,
   				start_time : options.start_time,
   				passenger_name : options.passenger_name,
   				appkey : app_key                                            // 第一步获取的appkey
			
			},
			dataType:'json',                                                // 服务器返回html标签
			type:'POST',                                                    // HTTP请求类型
			timeout:5000,                                                  // 超时时间设置为10秒
			success:function(data){
				dataItem = data.result;
				console.log("ajax_returnTicketAffirm--->" + JSON.stringify(data)); // 以Json的格式，将获得的数据打印在控制台上
                if(dataItem.status == true) { 
                	// Janine20170109修改:删除returnTicketAffirmFailure()方法，取消else判断
                	if(dataItem.data.stationTrainDTO != null || dataItem.data.stationTrainDTO !=''){
                		returnTicketAffirmSuccess(data);
                	}
                }else{
                	mui.toast("请重试!");
                }
			},
			error : function(data){  
	 	   	     mui.toast("returnTicketAffirm 出错了!!"); 
	 	    }
		});
		
	}
	
	//==========================》                     5.7 退票
	w.ajax_returnTicket = function(options){
		console.log("ajax_returnTicket.进入--->");
		mui.ajax(httpctx+'/returnTicket.do',{
			data:{
				sequence_no : options.sequence_no,                          // 订单号
   				appkey : app_key                                            // 第一步获取的appkey
			},
			dataType:'json',                                                // 服务器返回html标签
			type:'POST',                                                    // HTTP请求类型
			timeout:10000,                                                  // 超时时间设置为10秒
			success:function(data){
				dataItem = data.result;
				// 此处接口返回的数据，没有抓取
				console.log("ajax_returnTicket--->" + JSON.stringify(data)); // 以Json的格式，将获得的数据打印在控制台上
                if(dataItem.status == true) { 
                	returnTicketSuccess(data);
                }else{
                	mui.toast("returnTicket 服务器返回错误!");
                }
			},
			error : function(data){  
	 	   	     mui.toast("returnTicket 出错了!!"); 
	 	    }
		});
		
	}
	
	//==========================》                     6.1 判断能否改签——OK
	w.ajax_resginTicket = function(options){
		console.log("ajax_resginTicket.进入--->");
		console.log("ajax_resginTicket.进入--->"
			+ "ticketkey:" + options.ticketkey
			+ ",changeTSFlag:" + options.changeTSFlag
			+ ",sequence_no:" + options.sequence_no
		);
		mui.ajax(httpctx+'/resginTicket.do',{
			data:{
				
				// ticketkey组成结构:sequence_no,batch_no,coach_no,seat_no,start_train_date_page多张车票信息用#隔开，utf-8编码
				ticketkey : options.ticketkey,
				sequenceNo : options.sequence_no,                          // 订单号
				changeTSFlag : options.changeTSFlag,
   				appkey : app_key                                            // 第一步获取的appkey
			
			},
			dataType:'json',                                                // 服务器返回html标签
			type:'POST',                                                    // HTTP请求类型
			timeout:10000,                                                  // 超时时间设置为10秒
			success:function(data){
				dataItem = data.result;
				
				console.log("ajax_resginTicket--->" + JSON.stringify(data)); // 以Json的格式，将获得的数据打印在控制台上
                
                if(dataItem.status == true) {
                	
                	// existError:Y表示存在错误,N表示不存在错误
                	if(dataItem.data.existError == "Y"){
                		mui.toast(dataItem.data.errorMsg);
                	}else{
                		resginTicketSuccess(data); 
                	}
                	
                }else{
                	mui.toast("请重试!");
                }
			},
			error : function(data){  
	 	   	     mui.toast("resginTicket 出错了!!"); 
	 	    }
		});
		
	}
	
	//==========================》                   6.4 初始化改签页面
	w.ajax_get_initGc = function(options){
		console.log("ajax_get_initGc.app_key--->" + app_key);
		mui.ajax(httpctx +'/initGc.do',{
			data:{
				appkey : app_key
			},
			dataType:'json',                                  // 服务器返回json格式数据
			type:'get',                                       // HTTP请求类型
			timeout:10000,                                    // 超时时间设置为10秒
			success:function(data){
				console.log("ajax_get_initGc.success--->");
				console.log("ajax_get_initGc--->" + JSON.stringify(data)); // 以Json的格式，将获得的数据打印在控制台上
				setTimeout(function(){
					console.log("ajax_get_initGc.getinitGcSuccess--->");
					getinitGcSuccess(data);
				},500);
			},
			error:function(xhr,type,errorThrown){
				
			}
		});
	}
	
	//==========================》                      6.9 提交订单
	w.ajax_confirmResignForQueue = function(options){  
		console.log("ajax_confirmResignForQueue.传过来的值:"
				+ "key_check_isChange:"+options.key_check_isChange
				+ ";leftTicketStr:" + options.leftTicketStr 
				+ ";train_location:" + options.train_location
				+ ";REPEAT_SUBMIT_TOKEN:" + options.globaled
				+ ";passengerTicketStr:" + options.passengerTicketStr
				+ ";oldPassengerStr:" + options.oldPassengerStr
				+ ";purpose_codes:"+ options.purpose_codes
				+ ";randCode:" + $("#randCode").val()
				+ ";app_key:"+app_key);
		mui.ajax(httpctx+'/confirmResignForQueue.do',{
			data:{
                key_check_isChange: options.key_check_isChange,         //（由步骤3.3获取）
                leftTicketStr : options.leftTicketStr,                  //（由步骤3.3获取）
                train_location : options.train_location,                //（由步骤3.3获取）
                passengerTicketStr : options.passengerTicketStr,        //（见步骤3.7）
                oldPassengerStr : options.oldPassengerStr,              //（见步骤3.7）
//              purpose_codes : options.purpose_codes,                  //（人员类型）
				purpose_codes : "00",                                   // 成人-“00”
                randCode : $("#randCode").val() ,                       //（验证码）
//              roomType : "00",                                        //（传值：00）
                REPEAT_SUBMIT_TOKEN : options.globaled,                 // globalRepeatSubmitToken
				appkey : app_key
			},
			dataType:'json',                                            // 服务器返回json格式数据
			type:'POST',                                                // HTTP请求类型
			timeout:10000,                                              // 超时时间设置为10秒
			success:function(data){
				dataResult = data.result;
				console.log("ajax_confirmResignForQueue.data--->" + JSON.stringify(data)); // 以Json的格式，将获得的数据打印在控制台上
                if(dataResult.data.submitStatus == true) {
                	mui.toast("提交成功");
				    confirmResignForQueueSuccess(data);                 // 提交订单成功
                }else{
                	mui.toast(dataResult.data.errMsg);                  // 需要对这里的错误信息进行处理
                	ajax_getPassCodeNewPassenger({});                   // 重新获取验证码         
                }
			},
			error:function(data){  
	 	   	     mui.toast("confirmResignForQueue 出错了!!"); 
	 	   	     ajax_getPassCodeNewPassenger({});                      // 重新获取验证码        
	 	    }
		});
	}
	
	//==========================》                      6.11 获取订单提交结果
	w.ajax_resultOrderForGcQueue = function(options){
		console.log("ajax_resultOrderForGcQueue.传过来的值:"+ "REPEAT_SUBMIT_TOKEN:" + options.globaled
		+ ";orderSequence_no:" + options.orderSequence_no);
		mui.ajax(httpctx+'/resultOrderForGcQueue.do',{
			data:{
				orderSequence_no : options.orderSequence_no,            // 订单号
                REPEAT_SUBMIT_TOKEN : options.globaled,                 // globalRepeatSubmitToken
				appkey : app_key
			},
			dataType:'json',                                            // 服务器返回json格式数据
			type:'POST',                                                // HTTP请求类型
			timeout:10000,                                              // 超时时间设置为10秒
			success:function(data){
				console.log("ajax_resultOrderForGcQueue.data--->" + JSON.stringify(data)); // 以Json的格式，将获得的数据打印在控制台上
				dataResult = data.result;
                if(dataResult.data.submitStatus == true) {     
				    resultOrderForGcQueueSuccess(data);                  // 当获取订单提交的结果正确时，调用该方法         
                }else{
                	mui.toast(dataResult.data.errMsg);
                }
			},
			error : function(data){  
	 	   	     mui.toast("resultOrderForGcQueue 出错了!!"); 
	 	    }
		});
	}
	
	//==========================》                      6.12 网上支付初始化（改签）
	w.ajax_payOrderGcInit = function(options){
		console.log("ajax_payOrderGcInit.进来--->");
		console.log("ajax_payOrderGcInit.传过来的值:"+ "token:" + options.globaled);
		mui.ajax(httpctx+'/payOrderGcInit.do',{
			data:{
                token  : options.globaled,                  // 由步骤3.3获取的globalRepeatSubmitToken 
				appkey : app_key                            //第一步获取的appkey
			},
			dataType:'json',                                            // 服务器返回json格式数据
			type:'GET',                                                 // HTTP请求类型
			timeout:10000,                                              // 超时时间设置为10秒
			success:function(data){
				console.log("ajax_payOrderGcInit.data--->" + JSON.stringify(data)); // 以Json的格式，将获得的数据打印在控制台上
                dataResult = data.result;
                if(dataResult.ticketTitleForm != "" || dataResult.ticketTitleForm != null ) {
				    payOrderGcInitSuccess(data);           // 网上支付初始化                     
                }else{
                	mui.toast("请重试!");
                }
			},
			error : function(data){  
	 	   	     mui.toast("payOrderGcInit 出错了!!"); 
	 	    }
		});
	}
	
	//==========================》                      6.13 判断当前订单能否改签:现价与原件相等
	w.ajax_payConfirmN = function(options){
		console.log("ajax_payConfirmN.进来--->");
		console.log("ajax_payConfirmN.进来--->" 
			+ "batch_no:" + options.batch_no                             
			+ ",oldTicketDTOJson:" + options.oldTicketDTOJson              
			+ ",parOrderDTOJson:" + options.parOrderDTOJson                
			+ ",sequence_no:" + options.sequence_no  );
		mui.ajax(httpctx+'/payConfirmN.do',{
			data:{
				
                batch_no : options.batch_no,                               // 由步骤6.12获取
				oldTicketDTOJson : options.oldTicketDTOJson,               // 由步骤6.12获取
				parOrderDTOJson : options.parOrderDTOJson,                 // 由步骤6.12获取
				sequence_no : options.sequence_no,             			   // 由步骤6.12获取
				appkey : app_key                                           // 第一步获取的appkey
			},
			dataType:'json',                                             // 服务器返回json格式数据
			type:'POST',                                                 // HTTP请求类型
			timeout:10000,                                               // 超时时间设置为10秒
			success:function(data){
				console.log("ajax_payConfirmN.data--->" + JSON.stringify(data)); // 以Json的格式，将获得的数据打印在控制台上
                dataResult = data.result;
                // 对此处的数据需要做些处理
                if(dataResult.data.resignStatus == true) {
				    payConfirmSuccess(data);       // 判断当前订单能否改签                    
                }else{
                	mui.toast(dataResult.data.errorMessage);
                }
			},
			error : function(data){  
	 	   	     mui.toast("payConfirmN 出错了!!"); 
	 	    }
		});
	}
	
	//==========================》                      6.13 判断当前订单能否改签:原价大于现价
	w.ajax_payConfirmT = function(options){
		console.log("ajax_payConfirmT.进来--->");
		console.log("ajax_payConfirmT.进来--->" 
			+ "batch_no:" + options.batch_no                             
			+ ",oldTicketDTOJson:" + options.oldTicketDTOJson              
			+ ",parOrderDTOJson:" + options.parOrderDTOJson                
			+ ",sequence_no:" + options.sequence_no  );
		mui.ajax(httpctx+'/payConfirmT.do',{
			data:{
				
                batch_no : options.batch_no,                               // 由步骤6.12获取
				oldTicketDTOJson : options.oldTicketDTOJson,               // 由步骤6.12获取
				parOrderDTOJson : options.parOrderDTOJson,                 // 由步骤6.12获取
				sequence_no : options.sequence_no,             			   // 由步骤6.12获取
				appkey : app_key                                           // 第一步获取的appkey
			},
			dataType:'json',                                             // 服务器返回json格式数据
			type:'POST',                                                 // HTTP请求类型
			timeout:5000,                                               // 超时时间设置为10秒
			success:function(data){
				console.log("ajax_payConfirmT.data--->" + JSON.stringify(data)); // 以Json的格式，将获得的数据打印在控制台上
                dataResult = data.result;
                // 对此处的数据需要做些处理
                if(dataResult.data.resignStatus == true) {
				    payConfirmSuccess(data);       // 判断当前订单能否改签                    
                }else{
                	mui.toast(dataResult.data.errorMessage);
                }
			},
			error : function(data){  
	 	   	    mui.toast("payConfirmN 出错了!!"); 
	 	    }
		});
	}
	
	//==========================》                     6.14 取消改签
	w.ajax_cancelResign = function(options){
		console.log("ajax_cancelResign.进来--->");
		console.log("ajax_cancelResign.进来--->" 
			+ "oldTicketDTOJson:" + options.oldTicketDTOJson              
			+ ",parOrderDTOJson:" + options.parOrderDTOJson                
			+ ",sequence_no:" + options.sequence_no  );
		mui.ajax(httpctx+'/cancelResign.do',{
			data:{
                orderRequestDTOJson : options.orderRequestDTOJson,       // 由步骤6.12获取
				parOrderDTOJson  : options.parOrderDTOJson,              // 由步骤6.12获取
				sequence_no   : options.sequence_no,                     // 由步骤6.12获取
				appkey : app_key                                         // 第一步获取的appkey
			},
			dataType:'json',                                             // 服务器返回json格式数据
			type:'POST',                                                 // HTTP请求类型
			timeout:10000,                                               // 超时时间设置为10秒
			success:function(data){
				console.log("ajax_cancelResign.data--->" + JSON.stringify(data)); // 以Json的格式，将获得的数据打印在控制台上
               dataResult = data.result;
               if(dataResult.data.cancelStatus == false) {
				    mui.toast(dataResult.data.errorMessage);
                }else{
                	cancelResignSuccess(data);       // 网上支付初始化
                }
			},
			error : function(data){  
	 	   	     mui.toast("cancelResign 出错了!!"); 
	 	    }
		});
	}
	
	//==========================》                     6.16 立即改签（当改签的票款额小于或等于原票款额时）
	w.ajax_payfinish = function(options){
		console.log("ajax_payfinish.进来--->");
		mui.ajax(httpctx+'/payfinish.do',{
			data:{
				get_ticket_pass : "pay_success",	                    // 传值：pay_success 
				appkey : app_key                                        // 第一步获取的appkey
			},
			dataType:'json',                                            // 服务器返回json格式数据
			type:'POST',                                                // HTTP请求类型
			timeout:10000,                                              // 超时时间设置为10秒
			success:function(data){
				console.log("ajax_payfinish.data--->" + JSON.stringify(data)); // 以Json的格式，将获得的数据打印在控制台上
                // 需要做相应的处理
               	if(data.result != null && data.result !="") {
				    payfinishSuccess(data);       // 网上支付初始化                     
                }else{
                	mui.toast("请重试!");
                }
			},
			error : function(data){  
	 	   	     mui.toast("payfinish 出错了!!"); 
	 	    }
		});
	}
	
})(window);