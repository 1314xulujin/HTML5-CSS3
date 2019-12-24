/*
    把每一个轮播图需要的数据 和方法 封装成一个对象 ,因为对象间的数据是互相独立的 ,不干扰

    采用工厂模式, 批量创建对象
 */
    //定义一个创建轮播图对象的方法 - > 工厂函数
    function createSlide(box,interval){ // box 轮播图的父级容器的选择器
        var obj = new Object();
        obj.index = 0;//开始播放位置
        obj.width = 666;//单张图片的宽度
        obj.timer = null;//自动切换的定时器
        obj.slideBox = $(box);//获取轮播图的父级容器
        obj.imgBox = obj.slideBox.find(".slide3-img");//图片容器
        obj.textBox = obj.slideBox.find(".slide3-text");//图片容器
        obj.imgLi = obj.imgBox.children(); //获取所有的图片li , 此处4个
        obj.textLi = obj.textBox.children(); //获取所有的图片li
        obj.len = 0;//获取当前图片的长度
        obj.interval = interval;
        obj.next = obj.slideBox.find(".next");
        obj.prev = obj.slideBox.find(".prev");

        //定义一个autoplay 自动切换方法
        obj.autoplay = function() {
            obj.timer = setTimeout(function () {
                obj.index++;
                obj.moveImg();//切换图片
                obj.autoplay();
            },obj.interval);
        }

        //定义一个切换图片的方法 (负责两种极端情况 : 负第一张 和最后一张)
        obj.moveImg = function() {
            console.log(obj.index);
            //判断是否为最后一张(克隆的那一张) , 如果是,要切换到第二张(索引值为1)
            if(obj.index>=obj.len){
                obj.index = 1; //因为最后一张其实是原来的第一张 ,所以它后面应该按照原来的图片位置的第二张
                //并且 瞬间把容器的移动距离设置为0
                obj.imgBox.css("left",0);
            }

            //判断是否为 -1
            if(obj.index<=-1){
                obj.index = obj.len - 2;
                //为了保障切换不会一下子0  - > - 3 * 666 , 需要先设置图片容器的开始位置
                obj.imgBox.css({
                    left:-(obj.index + 1) *obj.width
                })
            }
            //切换图片
            obj.imgBox.stop().animate({
                left:-(obj.width * obj.index)
            },600);

            //切换文字的样式
            if(obj.index>=obj.len -1 ){//如果切换到最后一张图片 ,实则应该第一个按钮样式
                obj.textLi.eq(0).addClass("active").siblings().removeClass("active");
            }else{
                obj.textLi.eq(obj.index).addClass("active").siblings().removeClass("active");
            }
        }

        //鼠标悬停暂停
        obj.slideBox.hover(function(){
            clearTimeout(obj.timer);
        },function(){
            obj.autoplay();
        })

        obj.next.click(function(){
            obj.index++;
            obj.moveImg();
        })

        obj.prev.click(function(){
            obj.index--;
            obj.moveImg();
        })

        obj.textLi.hover(function(){
            obj.index = $(this).index();
            // console.log(obj.index);
            obj.moveImg();
        })

        //定义一个对外提供操作的一个初始化方法
        obj.init = function () {
            //在轮播图前后补充切换时的交替图片
             obj.imgLi.first().clone().appendTo(obj.imgBox);
             obj.len = obj.imgBox.children().length; // 获取新的长度
// 更新图片容器的宽度
            obj.imgBox.width(obj.len * obj.width);

            //调用自动播放
            obj.autoplay();
        }

        //初始化
        obj.init();
        return obj;
    }

    //创建对象
    var slide1 = createSlide("#slide1",1000);
    var slide2 = createSlide("#slide2",2000);
    var slide3 = createSlide("#slide3",3000);
    var slide4 = createSlide("#slide4",1000);