/*
    瀑布流布局实现思路 :
        1.通过计算 列高来实现 定位布局
            从第二行开始的图片 ,会按照第一行图片最矮的一列开始插入, 其后每张图片的位置需要重新计算,设置位置在每一列最矮的列下显示

       2.会计算每一列的高度 , 然后找出最矮的一列 ,然后给对应的元素设置定位位置

       3.滚动加载更多
            => 知道什么时候可以去加载 ...
            滚动距离 + 窗口 的高度  > 最后一张图片距离文档顶部的距离 + 最后一张图片的高度(可以适当取值)
 */
    var data = [
        {
            title:"瀑布流效果1",
            imgUrl:"images/1.jpg"
        },
        {
            title:"瀑布流效果2",
            imgUrl:"images/2.jpg"
        },{
            title:"瀑布流效果3",
            imgUrl:"images/3.jpg"
        },{
            title:"瀑布流效果4",
            imgUrl:"images/4.jpg"
        },{
            title:"瀑布流效果5",
            imgUrl:"images/5.jpg"
        },{
            title:"瀑布流效果6",
            imgUrl:"images/6.jpg"
        },{
            title:"瀑布流效果7",
            imgUrl:"images/7.jpg"
        },{
            title:"瀑布流效果8",
            imgUrl:"images/8.jpg"
        },{
            title:"瀑布流效果9",
            imgUrl:"images/9.jpg"
        },{
            title:"瀑布流效果10",
            imgUrl:"images/10.jpg"
        }
    ];

    var isCanLoad = true;
    //瀑布流 主函数 : 实现图片图片位置的排版
    function PBL (){
        var clientWdith = document.documentElement.offsetWidth;
        // console.log(clientWdith);
        var num = Math.floor(clientWdith / 300);//每一行的数量 => 总的列数
        var box = $(".box"); //获取所有的box
        //更新盒子的宽度
        $("#wrap").width(num * 300);

        var everyH = [];//存储每一列的高度
        for (var i=0;i<box.length;i++){
            if(i<num){ //第一行 , 只负责获取第一行中每一列元素的高度,存储到数组
                everyH.push(box.eq(i).innerHeight());
                //考虑到第一行在缩小后恢复的问题 ,需要去除定位样式
                box.eq(i).css({
                    position:"static"
                })
            }else{//第二行开始: 需要计算出(存储列高数组中)最矮的一列 , 用于设置样式 (apply 与 call ?)
                var minH = Math.min.apply(null,everyH);
                var minIndex =getIndex(everyH,minH);
                // console.log(minH,minIndex);
                setStyle(box[i],minH,box[minIndex].offsetLeft,i);
                //更新当前列的高度
                everyH[minIndex]+=box.eq(i).innerHeight();
            }
        }
        // console.log(everyH);
    }

    //定义一个计算最小值的索引值
    function getIndex(everyH,minH){
        for (var index in everyH){
            if(everyH[index] == minH){
                return index;
            }
        }
    }

    var flag = 0;//用于标记当前已经设置过样式的元素的索引值
    //定义一个方法 用于设置样式
    function setStyle(box,top,left,index){ // box 需要设置样式的元素 , top 需要设置的top距离 ,left 一样 , index 当前需要设置样式元素的索引值
       if(index>flag){
           flag = index;
           $(box).css({
               position:"absolute",
               top:top,
               left:left,
               display:'none'
           }).stop().fadeIn(600);
       }
    }

    //为了保证图片成功的加载完之后 处理
    window.onload = function () {
        PBL();
    }

    var resizeTimer = null;//窗口缩放时定时器
    //监听窗口的变化, 计算位置
    window.addEventListener("resize",function () {
        //先清除之前的定时器
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            console.log('窗口改变大小');
            flag = 0;//重置 设置样式元素的标记, 窗口缩放全部需要重新设置 样式
            PBL();
        },200);
    });

    //监听窗口的滚动事件
    $(window).scroll(function () {
            var scrollTop = $(this).scrollTop();
            // console.log('滚动',scrollTop);
            if(isLoad(scrollTop)){
                if(isCanLoad){
                    isCanLoad = false;
                // console.log('可以加载数据了!');
                var htmlStr = '';
                $.each(data,function (index,item) {
                    htmlStr+=' <div class="box">\n' +
                        '        <div class="info">\n' +
                        '            <div class="pic"><img src="'+item.imgUrl+'"></div>\n' +
                        '            <div class="title"><a href="www.baidu" target="_blank"> '+item.title+'</a></div>\n' +
                        '        </div>\n' +
                        '    </div>';
                })
                //追加
                $("#wrap").append(htmlStr);
                PBL();//计算位置
                setTimeout(function () {
                    isCanLoad = true;
                },300)
            }
        }
    })

    //定义一个方法 , 用于判断是否可以继续加载
    function isLoad(scrollTop){
        var clientH = $(window).height(); //获取窗口高度
        var lastTop= $(".box:last").offset().top;//获取最后一张图片距离文档顶部的距离
        var lastH = $(".box:last").height();//获取最后一张图片的高度
        // console.log(lastH);
        if((scrollTop+clientH) > (lastTop + lastH /2)){
            return true;
        }
        return false;
    }