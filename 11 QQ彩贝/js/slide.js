/**
 *
 * @param element  被用于创建实例的轮播图父级容器
 * @param options  轮播中用户参数
 * @constructor
 */
;(function($){
function Slide(element,options){
    this.container = $(element);//获取轮播图父级元素
    this.slideImg = this.container.find(".slide-img");//获取轮播图图片容器
    this.slideText= this.container.find(".slide-text");//获取轮播图图片容器
    this.index = 0;//开始播放位置
    this.width = 666;//单张图片的宽度
    this.timer = null;//自动切换的定时器
    this.imgLi = this.slideImg.children(); //获取所有的图片li , 此处4个
    this.textLi = this.slideText.children(); //获取所有的按钮li
    this.len = 0;//获取当前图片的长度
    this.next = this.container.find(".next");
    this.prev = this.container.find(".prev");
    this.opts = $.extend({},this.defaults,options); //将默认参数和用户参数何必 = > 最终使用的参数
    // console.log(this.opts);
    //初始化
    this.init();
}

Slide.prototype = {
    defaults:{//默认参数
        interval:100 , //轮播图自动播放切换的时间间隔
        duration:60,//轮播图切换的动画过渡时间
        controls:true,//不需要前后翻页
        autoplay:true,//不需要自动播放
        activeClassName:"active",//当前页的按钮样式类
        mode:"slide" ,//切换的模式 : slide 滑动  , fade 淡入淡出
        direction:"vertical" //切换的方向 , horizontal 水平 , vertical 垂直方向
    },
    autoplay:function() {
        var _this = this;
        this.timer = setTimeout(function () {
            _this.index++;
            _this.moveImg();//切换图片
            _this.autoplay();
        },this.opts.interval);
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
        },this.opts.duration);

        //切换文字的样式
        if(this.index>=this.len -1 ){//如果切换到最后一张图片 ,实则应该第一个按钮样式
            this.textLi.eq(0).addClass(this.opts.activeClassName).siblings().removeClass(this.opts.activeClassName);
        }else{
            this.textLi.eq(this.index).addClass(this.opts.activeClassName).siblings().removeClass(this.opts.activeClassName);
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
        console.log("实例化完成,轮播图初始化中...")
        //在轮播图前后补充切换时的交替图片
        this.imgLi.first().clone().appendTo(this.slideImg);
        this.len = this.slideImg.children().length; // 获取新的长度
// 更新图片容器的宽度
        this.slideImg.width(this.len * this.width);
        //判断是否需要前后翻页按钮
        if(this.opts.controls){
            this.nextEvent();
            this.prevEvent();
        }else{
            this.container.find(".controls").remove();//不需要前后翻页按钮
        }
        if(this.opts.autoplay){
            //调用自动播放
            this.autoplay();
            //初始所有的事件
            this.hoverEvent();
        }

        this.pageHoverEvent();
    }
}

//扩展一个jQ对象的方法 , 用于调用插件
$.fn.Slide = function (options) {
    // console.log(this,options);
    $.each(this,function () {
        console.log(new Slide(this,options));
        // console.log(this);
    })
}

})(jQuery);