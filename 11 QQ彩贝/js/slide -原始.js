var index  = -1 ;
var len = $(".slide3-img li").length;
var width  = 666;

function autoplay(){
    index++;
    if(index>=len)index=0;
    moveImg();
    setTimeout(autoplay,1000);
}

function moveImg(){
    $(".slide3-img").animate({
        left:-(index * width)
    },600)
    $(".slide3-text li").eq(index).addClass("active").siblings().removeClass("active");
}

autoplay();