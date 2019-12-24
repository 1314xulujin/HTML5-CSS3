function DragFn(selector){
    var Drag = {
        progress:null,
        progressBar:null,
        progressBtn:null,
        sx:null,
        ex:null,//鼠标下的开始坐标与结束坐标
        sWidth:null,//鼠标按下时进度条的宽度
        maxWidth: null,//进度条的最大宽度
        clickEvent:function(){//负责点击事件
            var _this = this;
            //监听进度条上的点击事件
            this.progress.addEventListener("click",function(e){
                //过滤掉span的单击事件
                if(e.target.className != "progress-btn"){
                    var x = e.offsetX;//获取触发事件时,鼠标相对于触发事件元素的X坐标位置
                    _this.progressBar.style.width = x + 'px';
                }
            })
        },
        moveHandler:function(e){
            this.ex = e.clientX;//获取鼠标结束的X坐标

            var distance = this.ex - this.sx;//距离
            var progressBarWidth = this.sWidth + distance;
            //判断进度条的最大宽度
            if(progressBarWidth>= this.maxWidth){
                progressBarWidth = this.maxWidth;
            }else if(progressBarWidth <=0){
                progressBarWidth = 0;
            }
            this.progressBar.style.width = progressBarWidth + 'px';
        },
        mouseDownEvent:function(){
            var _this = this;
            //小圆点拖拽事件 : 鼠标按下 + 鼠标移动  = > 拖动事件
            this.progressBtn.addEventListener("mousedown",function(e){
                // console.log(_this);
                var moveHandler = _this.moveHandler.bind(_this);
                _this.sx = e.clientX;//获取当前鼠标在窗口可视区域的X坐标
                _this.sWidth = _this.progressBar.offsetWidth;//获取进度条的宽度
                //移动事件 = > document / window绑定
                window.addEventListener("mousemove",moveHandler);
                //鼠标起来 , 移除鼠标的移动事件
                window.addEventListener("mouseup",function(){
                    console.log("鼠标起来,结束移动事件操作!");
                    window.removeEventListener("mousemove",moveHandler);
                    console.log("鼠标起来事件!");
                },{
                    passive:false, //冒泡
                    capture:false, //捕获
                    once:true //绑定一次事件
                })
            })
        },
        init:function(selector){ //初始化  , selector 进度条父容器的选择器
            this.progress = document.querySelector(selector);
            this.progressBar = this.progress.querySelector(".progress-bar");
            this.progressBtn = this.progress.querySelector(".progress-btn");

            this.maxWidth = this.progress.offsetWidth;
            //初始化绑定事件
            this.clickEvent();

            //绑定一个鼠标按下事件
            this.mouseDownEvent();
        }
    }
    Drag.init(selector); //初始化第一个进度条
}

DragFn("#progress");
DragFn("#progress-volume");
