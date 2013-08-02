// JavaScript Document
/*
 * 生成业务逻辑使用的key
 */
function getMyId(){
	var randomLength = 4;
	var randomNum = "";
	for(var i = 0;i<randomLength;i++){
		randomNum+= (Math.floor(Math.random()*9)).toString();	
	}
	var today = new Date();
	var s1 =today.getTime();//当前的
	var result = "";
	//时区数差值
	var s2 =new Date(2011,0,1,00,00,00,000).getTime();
	
	//s1和s2采用相同的函数取值，计算差值时，时区因素可以忽略
	if(s1-s2>0) result = (s1-s2).toString()+randomNum;
	else result = 0; 
	result = Number(result);
	return result; 
}

/*
 * 返回当前的毫秒数
 */
function getUT(){
	//调用振兴哥方法
	var result = MoneyHubJSFuc("GetUT")+"";
	return result; 
}

/*********测试使用*********/
/*
function getUT(){
    //2011-01-01 00:00:00 000 的毫秒数
	//调用振兴哥方法
	var result = "";
	var s2 =new Date(2011,0,1,00,00,00,000).getTime();
	var today = new Date();
	var s1 =today.getTime();
	//UT时间处理
	if(s1-s2>0) result = (s1-s2).toString();
	else result = 0;
	//s1和s2采用相同的函数取值，计算差值时，时区因素可以忽略
	return result; 
}
*/
