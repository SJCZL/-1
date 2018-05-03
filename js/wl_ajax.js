//function getPassengerTicketStr() {
//	var passengerTicketStr = "";
//	var passengerJson = ${passengerJson};
//	$("[name=\"tr\"]").each(function() {
//		var id = this.id;
//		var index = id.substring(id.indexOf("_") + 1);
//		var item = passengerJson[index];
//		var name = item.passenger_name;
//		var id_type = item.passenger_id_type_code;
//		var id_no = item.passenger_id_no;
//		var mobile_no = item.mobile_no;
//		var seat_type = $("#seat_type_" + index).val();
//		var ticket_type = $("#ticket_type_" + index).val();
//		var pStr = seat_type + ",0," + ticket_type + "," + name + "," + id_type + "," + id_no + "," + mobile_no + ",N_";
//		passengerTicketStr += pStr;
//	});
//	if(passengerTicketStr != "") {
//		passengerTicketStr = passengerTicketStr.substring(0, passengerTicketStr.length - 1);
//	}
//	return passengerTicketStr;
//}
//
//
//function getOldPassengerStr() {
//	var oldPassengerStr = "";
//	var passengerJson = ${passengerJson};
//	$("[name=\"tr\"]").each(function() {
//		var id = this.id;
//		var index = id.substring(id.indexOf("_") + 1);
//		var item = passengerJson[index];
//		var name = item.passenger_name;
//		var id_type = item.passenger_id_type_code;
//		var id_no = item.passenger_id_no;
//		var passenger_type = item.passenger_type;
//		var pStr = name + "," + id_type + "," + id_no + "," + passenger_type + "_";
//		oldPassengerStr += pStr;
//	});
//	if(oldPassengerStr != "") {
//		oldPassengerStr = oldPassengerStr.substring(0, oldPassengerStr.length - 1);
//	}
//	return oldPassengerStr;
//}

    function CTime(){ 
	    	var show_day=new Array('周一','周二','周三','周四','周五','周六','周日'); 
	        var now = new Date();
	        var month = now.getMonth() + 1;     //月
	        var date = now.getDate();            //日
	        var day=now.getDay();
	        var clock="";
	        if(month < 10) clock += "0";
	         clock += month+"月";
	        if(date < 10) clock += "0";
	        if (day==0){
	            clock += date+"日"+" "+show_day[6] ;}
	        else{
	        	clock += date+"日"+" "+show_day[day-1] ;
	        }
	        return(clock); 	
	      
	        
    }
    
     function CurentTime(AddDayCount){ 
	    	var show_day=new Array('周一','周二','周三','周四','周五','周六','周日'); 
	        var now = new Date();
	        var year = now.getFullYear();       //年
	        var month = now.getMonth() + 1;     //月
	        var date = now.getDate();            //日
	        now.setDate(date+AddDayCount);
	        var day=now.getDay();
	        var clock= year + "-";
	        if(month < 10) clock += "0";
	        clock += month + "-";
	        if(date < 10) clock += "0";
	        if (day==0){
	            clock += date+" "+show_day[6] ;}
	        else{
	        	clock += date+" "+show_day[day-1] ;
	        }

	        return(clock); 	
	     
	        
    }
     
    function getmonths(dateday){
		/*获取当前日期的月份*/
		var curDate = new Date(dateday);
		return curDate.getMonth()+1;
	};
	
    function getYears(dateday){
		/*获取当前日期的年份*/
		var curDate = new Date(dateday);
		return curDate.getFullYear();
	};
	
	
    function getCountDays(dateday) {
		/*转化时间*/
		var curDate = new Date(dateday);
		/* 获取当前月份 */
		var curMonth = curDate.getMonth();
		/* 生成实际的月份: 由于curMonth会比实际月份小1, 故需加1 */
		curDate.setMonth(curMonth + 1);
		/* 将日期设置为0 */
		curDate.setDate(0);
		/* 返回当月的天数 */
		return curDate.getDate();
	};
		/*
		得到开始时间的昨天，默认是1天，默认是不返回短时间
		day : 开始时间
		amount : 相隔的天数
		isShortTime ： 是否显示短时间
		*/
	function getBeforeDay(day,amount,isShortTime){
		
		if(Date.parse(day) != Date.parse(day)){
		    return false;
		}
		var days = new Date(new Date(day)-1000*60*60*24);
		if(amount){
			var number = parseInt(amount);
			if(number && number > 0 && !isNaN(number)){
			    days = new Date(new Date(day)-1000*60*60*24*number);
			}
		}
		return dateFormat(days,isShortTime);
	}
	
		/*
		得到开始时间的明天，默认是1天，默认是不返回短时间
		day : 开始时间
		amount : 相隔的天数
		isShortTime ： 是否显示短时间
		*/
	function getAfterDay(day,amount,isShortTime){
		if(Date.parse(day) != Date.parse(day)){
		    return false;
		}
		day =new Date(day);
		var v = day.valueOf();
		var days = new Date((v+86400000));
		if(amount){
			var number = parseInt(amount);
			if(number && number > 0 && !isNaN(number)){
			    days = new Date((v+86400000*number));
			}
		}
		return dateFormat(days,isShortTime);
	}
		/*
		格式化时间，默认是不返回短时间
		day : 日期
		isShortTime ： 是否显示短时间
		*/
	function dateFormat(day,isShortTime){
		if(Date.parse(day) != Date.parse(day)){
		    return false;
		}
		var show_day=new Array('周一','周二','周三','周四','周五','周六','周日'); 
		var days = new Date(day);
		var year =days.getFullYear();
		var month =days.getMonth()+1;
        var date =days.getDate();
        var day=days.getDay();
	    var clock= year + "-";
	    if(month < 10) clock += "0";
	        clock += month + "-";
	    if(date < 10) clock += "0";
	    if (day==0){
	        clock += date+" "+show_day[6] ;}
	    else{
	        clock += date+" "+show_day[day-1] ;
	    }

	      
		if(isShortTime && isShortTime==true){
			var hours = days.getHours()<10?"0"+days.getHours():days.getHours();
			var minutes = days.getMinutes()<10?"0"+days.getMinutes():days.getMinutes();
			var seconds = days.getSeconds()<10?"0"+days.getSeconds():days.getSeconds();
		
		    return days.getFullYear()+"-"+(days.getMonth()+1)+"-"+days.getDate()+" "+hours+":"+minutes+":"+seconds;
		}else{
             return(clock);		
		}
	}
     
     
   
