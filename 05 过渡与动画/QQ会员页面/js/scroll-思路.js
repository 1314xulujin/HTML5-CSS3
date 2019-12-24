/*
    需求:
        通过鼠标滚轮, 滚动切换 (页面没有滚动条, 无法使用onscroll 事件)

        鼠标事件: 鼠标滚轮事件  ( 存在兼容性问题 )
                1. onmousewheel  = > 针对于非火狐系浏览器
                2. DOMMouseScroll => 针对于火狐浏览器


        判断滚轮滚动的方向:
              向下滚动:
                    1.非火狐系 => wheelDelta : -120
                    2.火狐 = > detail  :  3

              向上滚动:
                    1.非火狐系 => wheelDelta  : 120
                    2.火狐 = > detail  : -3

        切换每一屏时 位移的距离:
            1.百分比方案  -100%  * n
            2.具体的像素值  => 获取每一屏的距离

 */
    var slide = document.getElementById("slide");
    var sec = slide.getElementsByTagName("section");

    var topH = []; //[0, 631, 1262, 1894, 2525, 3156, 3787]

    for (var i=0;i<sec.length;i++){
        topH.push(sec[i].offsetTop);
    }

    console.log(topH);

    //检测浏览器的兼容情况:
    if("onmousewheel" in window){
    // alert("支持onmousewheel事件");
    window.onmousewheel = function(e){
        // console.log("鼠标滚轮事件!");
        // console.log(e);
        if(e.wheelDelta <0){
            console.log("向下滚动!");
        }else{
            console.log("向上滚动!");
        }
        }
    }else{
    // alert("不支持onmousewheel事件!");
    window.addEventListener("DOMMouseScroll",function (e) {
        // console.log("鼠标滚轮事件!");
        // console.log(e);
        if(e.detail >0){
            console.log("向下滚动!");
        }else{
            console.log("向上滚动!");
        }
    })
}