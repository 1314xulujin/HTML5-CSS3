/**
 *  将整个操作的流程 封装成一个对象 (Slide)
 *      Slide 对象 包含整个js操作的业务逻辑
 *          需要的数据
 *          执行的功能 (绑定事件 , 绑定事件要做的事情 , 切换)
 *          绑定的事件...
 *
 *   封装思想: 将一些复杂的业务逻辑,拆分成若干个小块,隐藏在封装的对象内部, 对外提供一个简便 的操作接口(类似于电视剧开机按钮) .
 * */
//避免全局变量污染 提高程序数据安全
(function(){
    var Slide = {
        index:0,//当前屏的索引值
        topH:[],//页面翻屏(每屏)所需要切换的高度值,
        container:null,//需要执行切换的容器
        sections:null,//需要操作七屏内容
        isScroll:true,
        animates:['bounce','shake','rotateIn','zoomIn','slideInUp','zoomInLeft','flipInY'],
        changeClass(){//设置类,添加或者删除on
            for (var i = 0; i < this.sections.length;i++){
                // if(this.sections[i].classList.contains("animated")){
                //     this.sections[i].classList.remove("animated");
                // }
                this.sections[i].className = "";
            }
            //再指定一个section 设置on类
            // this.sections[this.index].classList.add("animated");
            this.sections[this.index].className="animated "+this.animates[this.index];
        },
        move:function(){//负责切换
            this.container.style.cssText="transform:translateY("+(-this.topH[this.index])+"px)";
            //还要给当前屏添加一个on 类 (所有的动画,都是在on类下进行的)
            var _this = this;
            setTimeout(function(){
                _this.isScroll = true;
            },600);
            this.changeClass();
        },
        slideUp:function(){ //负责向上切换
            this.index--;
            if(this.index<=0)this.index=0;
            // console.log("向上滚动!");
            // console.log(this);
            this.move();
        },
        slideDown:function(){//负责向下切换
            this.index++;
            if(this.index>=this.sections.length-1)this.index=this.sections.length-1;
            // console.log("向下滚动!");
            // console.log(this);
            this.move();
        },
        eventHandler:function(e){//事件处理函数(用于处理绑定的滚动事件)
            if(this.isScroll){
                this.isScroll = false;
                var e = e || window.event;
                if(e.wheelDelta >0 || e.detail <0){ //统一向上处理
                    // console.log(this);
                    this.slideUp();
                }else{ //向下处理
                    // console.log(this);
                    this.slideDown();
                }
            }

        },
        bindEvent:function(){//用于绑定事件 (兼容性)
            if("onmousewheel" in window){
                // console.log(this); // this = > Slide
                window.onmousewheel = this.eventHandler.bind(this); //将eventHanlder运行环境中的this强行绑定为当前环境下的this指向
            }else{
                // console.log(this); // this = > Slide
                window.addEventListener("DOMMouseScroll",this.eventHandler.bind(this));
            }
        },
        init:function(){ //初始化方法  - 提供对外使用
            //获取需要操作的大容器
            this.container = document.getElementById("slide");

            //获取所有的section
            this.sections = this.container.getElementsByTagName("section");

            //获取所有屏需要位移的高度
            for (var i=0;i<this.sections.length;i++){
                this.topH.push(this.sections[i].offsetTop);
            }
            //初始化绑定鼠标滚轮事件
            this.bindEvent();
        }
    }
    Slide.init(); //对外提供的初始化方法
})()
