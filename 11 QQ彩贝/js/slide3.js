/**
 *
 * @param element 轮播图容器的选择器
 * @param interval 切换的时间间隔
 * @constructor 轮播图构造函数
 */
var RMB = jQuery.noConflict();

;(function (win,$) { // 传递window对象的目的就是降低获取window对象的性能损耗
    function Slide(element ,interval) {
        this.container = $(element);//获取轮播图父级元素
        this.slideImg = this.container.find(".slide3-img");//获取轮播图图片容器
        this.slideText= this.container.find(".slide3-text");//获取轮播图图片容器
        this.index = 0;//开始播放位置
        this.width = 666;//单张图片的宽度
        this.timer = null;//自动切换的定时器
        this.imgLi = this.slideImg.children(); //获取所有的图片li , 此处4个
        this.textLi = this.slideText.children(); //获取所有的按钮li
        this.len = 0;//获取当前图片的长度
        this.interval = interval;
        this.next = this.container.find(".next");
        this.prev = this.container.find(".prev");
        //初始化
        this.init();
    }

//将方法添加到原型上
// Slide.prototype.autoplay = function () {
// //
// // }

    Slide.prototype = {
        autoplay:function() {
            var _this = this;
            this.timer = setTimeout(function () {
                _this.index++;
                _this.moveImg();//切换图片
                _this.autoplay();
            },this.interval);
        },
        moveImg:function() {
            // console.log(this.index);
            //判断是否为最后一张(克隆的那一张) , 如果是,要切换到第二张(索引值为1)
            if(this.index>=this.len){
                this.index = 1; //因为最后一张其实是原来的第一张 ,所以它后面应该按照原来的图片位置的第二张
                //并且 瞬间把容器的移动距离设置为0
                this.slideImg.css("left",0);
            }

            //判断是否为 -1
            if(this.index<=-1){
                this.index = this.len - 2;
                //为了保障切换不会一下子0  - > - 3 * 666 , 需要先设置图片容器的开始位置
                this.slideImg.css({
                    left:-(this.index + 1) *this.width
                })
            }
            //切换图片
            this.slideImg.stop().animate({
                left:-(this.width * this.index)
            },600);

            //切换文字的样式
            if(this.index>=this.len -1 ){//如果切换到最后一张图片 ,实则应该第一个按钮样式
                this.textLi.eq(0).addClass("active").siblings().removeClass("active");
            }else{
                this.textLi.eq(this.index).addClass("active").siblings().removeClass("active");
            }
        },
        hoverEvent:function () { //绑定鼠标悬停事件方法
            var _this = this;
            this.container.hover(function () {
                clearTimeout(_this.timer);
            },function () {
                _this.autoplay();
            })
        },
        nextEvent:function () {
            var _this = this;
            this.next.click(function(){
                _this.index++;
                _this.moveImg();
            })
        },
        prevEvent:function () {
            this.prev.click(function(){
                this.index--;
                this.moveImg();
            }.bind(this))
        },
        pageHoverEvent:function () {
            var _this = this;
            this.textLi.hover(function(){
                _this.index = $(this).index();
                _this.moveImg();
            })
        },
        init:function () {
            //在轮播图前后补充切换时的交替图片
            this.imgLi.first().clone().appendTo(this.slideImg);
            this.len = this.slideImg.children().length; // 获取新的长度
// 更新图片容器的宽度
            this.slideImg.width(this.len * this.width);
            //调用自动播放
            this.autoplay();
            //初始所有的事件
            this.hoverEvent();
            this.nextEvent();
            this.prevEvent();
            this.pageHoverEvent();
        }
    }
    //对外暴露一个全局的构造函数即可
    win.Slide = Slide;
})(window,jQuery)


//实例化对象
var slide3 = new Slide("#slide1",1000);