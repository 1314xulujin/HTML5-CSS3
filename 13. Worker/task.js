//taks.js  是需要在后台程序执行的一个脚本文件
this.onmessage = function (e) {
    sum+=e.data;
    console.log(e);
}

var sum = 1;
for(var i=1;i<1000000000;i++){
    sum+=i;
}

function abc(){
    console.log("执行了一个Abc方法 ");
}

abc();


//向前台发送执行结果
postMessage(sum);