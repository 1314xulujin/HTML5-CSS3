/**
 *  见缝插针:
 *      1.转动小球
 *          1) 大圆及关卡
 *              初始转动小球绘制时需要一定的角度 , 如果从等待小球区域上的球插进需要绘制数字 = > 对象
 *              每个小球 = { angle : 0 , numStr:1 }
 *
 *          2) 大圆上的小球
 *
 *      2.等待小球
 *
 *      因为是游戏: 一切的数据要灵活 , 各个小功能都需要重复的被调用 = > 需要一定封装(提高复用性)
 * */
//截取地址上的参数
// var url = document.URL;
// var index = url.split("#").slice(-1)*1 - 1;

var index = window.location.hash.substring(1);
index = index<1?1:index;
console.log(index);

/***********************游戏的初始模拟数据(废弃)***********************************/
var GameData = [
    {
        level:1,
        ballNum:3,
        waitNum:5,
        speed:1
    },
    {
        level:2,
        ballNum:4,
        waitNum:6,
        speed:1.5
    },{
        level:3,
        ballNum:5,
        waitNum:7,
        speed:1.5
    },{
        level:4,
        ballNum:5,
        waitNum:8,
        speed:1.5
    },{
        level:5,
        ballNum:5,
        waitNum:8,
        speed:2
    },{
        level:6,
        ballNum:6,
        waitNum:8,
        speed:2
    }
];

/***********************游戏的界面基本配置***********************************/
var centerX = 350;  // 大圆的中心x
var centerY = 200; //大圆的中心y
var bigRadius = 50;//大圆的半径

var radius = 10; //小球的半径
var line = 80;//大圆至小球之间的间距

// var index = 0;//游戏数据中的关卡索引值
var isOver = false;//游戏是否结束

//游戏数据
var level = null;//关卡
var ballNum = null;//转动小球数量
var waitNum = null;//等待小球数量
var speed = null;// 转动的速度 = > 角度

var balls = null;//用于存储转动小球数组
var waitBalls = null;//用于存储等待小球数组

var timer = null;//动画ID
/***********************游戏的实现业务流程***********************************/
var canvas = document.getElementById("canvas");
var cxt = canvas.getContext("2d");

//配置全局位移 , 字体居中
 cxt.translate(centerX,centerY);
 cxt.textAlign="center";
 cxt.textBaseline = "middle";

    //定义一个绘制大圆的函数
    function drawBig(){
        cxt.save();
        cxt.beginPath();
        cxt.arc(0,0,bigRadius,0,Math.PI*2);
        cxt.closePath();
        cxt.fillStyle = "#000";
        cxt.fill();
        //绘制关卡数字
        cxt.fillStyle="#fff";
        cxt.font="50px 微软雅黑";
        cxt.fillText(level,0,0);
        cxt.restore();
    }

    //定义一个方法 绘制转动小球
    function drawBall(){
        balls.forEach(function (item) {
            cxt.save();
            cxt.rotate(Math.PI / 180 * item.angle);
            //为下一次绘制 ,重新计算角度
            item.angle += speed;
            //优化: 角度控制在360度以内 ,因为再多视觉没有区别, 但是程序绘制计算还是会根据角度的计算绘制 -> 造成资源浪费
            item.angle%=360;

            cxt.beginPath();
            cxt.moveTo(0,-bigRadius);
            cxt.lineTo(0,-(bigRadius + line));
            cxt.closePath();
            cxt.stroke();
            cxt.beginPath();
            cxt.arc(0,-(bigRadius + line + radius),radius , 0 , Math.PI * 2);
            cxt.closePath();
            cxt.fill();
            //绘制小球上的数字
            if(item.numStr!=""){
                cxt.fillStyle="#fff";
                cxt.font="bold 12px 微软雅黑";
                cxt.fillText(item.numStr,0,-(bigRadius + line + radius));
            }
            cxt.restore();
        })
    }

    //定义一个方法 绘制等待小球
    function drawWait(){
        //清除之前的小球 ,然后才重新绘制
        var h = canvas.height;
        var distance = h - centerY - (bigRadius + line + (2 * radius) + (2 * radius));
        var y = bigRadius + line + (2 * radius) + (2 * radius); //开始清除区域y坐标
        cxt.clearRect(-radius,y,2 * radius,distance);

        waitBalls.forEach(function (item , index) {
            cxt.save();
            cxt.beginPath();
            cxt.arc(0,bigRadius + line + (2 * radius) + (2 * radius) + radius + (index * 3 * radius) , radius , 0 , Math.PI*2);
            cxt.fill();
            cxt.fillStyle = "#fff";
            cxt.font="bold 12px 微软雅黑";
            cxt.fillText(item.numStr,0,bigRadius + line + (2 * radius) + (2 * radius) + radius  + (index * 3 * radius));
            cxt.closePath();
            cxt.restore();
        })
    }

    //定义一个动画方法
    function animte(){
        cancelAnimationFrame(timer);//清空之前的动画函数
        var w = bigRadius + line + 2 * radius; //需要清除的矩形的宽度
        //清除之前的绘制区域
        cxt.clearRect(-w,-w,2 * w,2 * w);
        drawBig();
        drawBall();
        //使用递归实现动画
        timer = requestAnimationFrame(animte);
    }

    //定义一个根据当前关卡位置 ,生成游戏数据函数
    function createData(){
        level =index;//关卡
        var base = parseInt(index / 4);//基数
        var obj = {
            ballNum:3,
            waitNum:5,
            speed:1
        }
        for (var i=1;i<index;i++){
            if(i%4==0){
                obj.speed +=0.5;
                obj.speed = obj.speed>=30?30:obj.speed;
            }else if(i%3==0){
                obj.ballNum+=1;
            }else if(i%2==0){
                obj.waitNum+=1;
            }else{
                obj.waitNum+=1;
            }
        }

        console.log(obj,base);
        ballNum = obj.ballNum;//转动小球数量
        waitNum = obj.waitNum;//等待小球数量
        speed = obj.speed;// 转动的速度 = > 角度
    }
    //定义一个游戏初始化方法
    function initGame(){
        createData();//生成游戏数据
        balls = [];//用于存储转动小球数组
        waitBalls = [];//用于存储等待小球数组

        //准备转动小球数据  (初始数据):
        for (var i=0;i<ballNum;i++){
            var angle = 360 / ballNum * i; //计算初始状态下每个转动小球的角度位置
            balls.push({
                angle:angle,
                numStr:""
            })
        }
        //准备等待小球的数据(初始数据)
        for (var i=waitNum;i>0;i--){
            waitBalls.push({
                angle:"",
                numStr:i
            })
        }

        //绘制各种小球
        drawBig();
        drawBall();
        drawWait();
        animte();

        canvas.onclick = null;
        //绑定单击事件 : 把等待区域的小球 插入到 转到小球区域
        canvas.onclick = function () {
            if(waitBalls.length==0)return;
            if(!isOver){
                //计算会碰球的夹角
                var a = Math.asin(2 * radius / (bigRadius + line + radius)) / Math.PI * 180;
                // console.log(a);
                //循环判断是否有撞球: 判断每个转动小球是否有在碰球角度范围: 180 - a <= x  <= 180 + a
                for (var i=0;i<balls.length;i++){
                    if(balls[i].angle>= (180 - a) && balls[i].angle<= (180 + a)){
                        // console.log("碰球了",balls[i].angle);
                        alert("游戏失败,请重新开始!");
                        isOver = true;
                    }
                }

                //判断游戏是否成功
                if(!isOver){
                    var tmp = waitBalls.shift();//删除等待数组的第一个
                    // console.log(tmp);
                    tmp.angle = 180;
                    //追加到转动小球数组中
                    balls.push(tmp);
                    drawWait();
                    if(waitBalls.length==0){
                        alert("本关已经通过,马上进入下一关");
                        index++;
                        initGame();
                    }
                }

            }
        }
    }
/***********************游戏接口调用********************************/

    initGame();//游戏初始化

    // //首先绘制 , 使用定时器
    // var timer = setInterval(function(){
    //
    // },1000 / 60);

    window.onhashchange = function () {
        console.log("hash发生变化!");
        index = window.location.hash.substring(1);
        initGame();
    }