function get_date_time(){
	var now;
	var today;
	now = new Date();     // 当前日期
	if((now.getMonth() + 1) < 10){
		if(now.getDate()<10){
			today = now.getFullYear() + '-' +'0' + (now.getMonth() + 1) + '-' +'0' + now.getDate();// 当前日期
		}else{
			today = now.getFullYear() + '-' +'0' + (now.getMonth() + 1) + '-' + now.getDate();// 当前日期
		}
						
	}else{
		if(now.getDate()<10){
			today = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' +'0' + now.getDate();// 当前日期
		}else{
			today = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();// 当前日期
		}
						
	}
	
	return today;
}
