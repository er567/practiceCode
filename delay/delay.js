var delay = (function () {
    var timer = 0;
    return function (callback, time) {
        clearTimeout(timer);
        timer = setTimeout(callback, time);
    };
})();

//demo
delay(function(){
    //ajax请求
}, 500);