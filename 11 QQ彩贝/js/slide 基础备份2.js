/**
 * 实现无缝轮播 :
 *      1.为了避免一轮切换时出现间隔性的帧空白 ,在原有轮播图上头尾各补充与之交替的对应的图片
 *          在原有位置的最后位置补上第一张图片 , 开头位置不上最后一张
 *
 * */

var index = -1;//开始播放位置
var width = 666;//单张图片的宽度
var timer = null;//自动切换的定时器

//在轮播图前后补充切换时的交替图片
$(".slide3-img li:first").clone().appendTo(".slide3-img");

var len = $(".slide3-img li").length; //获取当前图片的长度
// 更新图片容器的宽度
$(".slide3-img").width(len * width);

//定义一个autoplay 自动切换方法
function autoplay() {
    timer = setTimeout(function () {
        index++;
        moveImg();//切换图片
        console.log(index);
        autoplay();
    },1000);

}

//定义一个切换图片的方法 (负责两种极端情况 : 负第一张 和最后一张)
function moveImg() {
    //判断是否为最后一张(克隆的那一张) , 如果是,要切换到第二张(索引值为1)
    if(index>=len){
        index = 1; //因为最后一张其实是原来的第一张 ,所以它后面应该按照原来的图片位置的第二张
        //并且 瞬间把容器的移动距离设置为0
        $(".slide3-img").css("left",0);
    }

    //判断是否为 -1
    if(index<=-1){
        index = len - 2;
        //为了保障切换不会一下子0  - > - 3 * 666 , 需要先设置图片容器的开始位置
        $(".slide3-img").css({
            left:-(index + 1) *666
        })
    }
    //切换图片
    $(".slide3-img").stop().animate({
        left:-(width * index)
    },600);

    //切换文字的样式
    if(index>=len -1 ){//如果切换到最后一张图片 ,实则应该第一个按钮样式
        $(".slide3-text li").eq(0).addClass("active").siblings().removeClass("active");
    }else{
        $(".slide3-text li").eq(index).addClass("active").siblings().removeClass("active");
    }
}

//鼠标悬停暂停
$(".slide3").hover(function(){
    clearTimeout(timer);
},function(){
    autoplay();
})

$(".next").click(function(){
    index++;
    moveImg();
})

$(".prev").click(function(){
    index--;
    console.log(index);
    moveImg();
})

$(".slide3-text li").hover(function(){
    index = $(this).index();
    moveImg();
})
//首次调用
autoplay();