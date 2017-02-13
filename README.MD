1.jq写的楼梯  

2.onePageNav插件写模版  

*******
###总结 

创建一个变量来判断是点击滚动还是鼠标滚动  


        var isClick = false;//是否是点击滚动
        $(window).scroll(function(){
   		// 如果为点击滚动，退出当前事件
   		if(isClick){
   			return;
		}
       	$('#LoutiNav li').on('click',function(){
		isClick = true;
   		// 给当前楼层导航添加高亮，删除其他所有li的class属性（除了最后一个）
		...
        $('html,body').animate({scrollTop:0},function(){
		//动画执行完后，重置点击滚动变量
		isClick = false;
	});
	return;
	}
