console.log(MusicList);
//初始化歌曲列表
var htmlStr = "";
MusicList.forEach(function(item,index){
    htmlStr+='<li>'+(index+1)+". "+item.title+'</li>';
})
//插入到歌曲列表中
$("#container_ul").html(htmlStr);

/*******************************************************/
var index = 0;//当前歌曲播放的索引值
var audio = document.getElementById("audio");//获取媒体对象
var postor = document.getElementById("imag");//获取专辑
var play = document.getElementById("play");//播放按钮
var time = 0;//歌词开始的时间
var timeBox = document.querySelector(".time");

//定义一个初始化方法
function init() {
    //1.设置歌曲的路径
    audio.src = MusicList[index].music;
    //2.更换专辑图片
    postor.src = MusicList[index].postor;
    //3.更换标题和歌手信息
    $("#name").html(MusicList[index].singer + " - " +MusicList[index].title)

    //4.发起ajax请求,请求lrc歌词文件
    $.get(MusicList[index].lrc,function(lrc){
        // console.log(lrc);
        //调用歌词封装号的插件
        $.lrc.start(lrc,function(){
            return time;
        })
    })
}

//首次执行
init();

//canplay 事件  = > 音频对象可以播放时会触发
audio.addEventListener("canplay",function(){
        // console.log("音乐可以播放了!");
        console.log(toMs(audio.duration));
        timeBox.innerHTML = "<span>"+(toMs(audio.currentTime))+'/'+(toMs(audio.duration))+"</span>";
        // audio.muted=true;
        // audio.play();//播放
        play.onclick =function () {
           //判断当前是否正在播放
            if(audio.paused){
                audio.play();//播放
            }else{
                audio.pause();//暂停
            }
        }
})


//timeupdate() 事件 = > 事件更新事件
audio.addEventListener("timeupdate",function(){
    //获取当前歌曲的播放时间
   // console.log(audio.currentTime);
   time = audio.currentTime;
   timeBox.innerHTML = "<span>"+(toMs(audio.currentTime))+'/'+(toMs(audio.duration))+"</span>";
   var p = (audio.currentTime / audio.duration);
   //更新进度条
    Player.updateProgress(p);
    document.getElementById("currentLrc").innerHTML = $.lrc.getCurrentLrc();
})


$("#lrc_list").on("click","li",function(){
    var time = $(this).data("time");
    audio.currentTime = time;
})

//定义一个日期转换格式函数
function toMs(time){
    var h = parseInt(time / (60 * 60));//小时
    var m = parseInt((time - (h * 60 * 60)) / 60); //分
    var s = parseInt(time % 60); //秒
    var dateStr = "";
    if(h>0){
        h = h < 10?'0'+h:h;
        dateStr = h + ' : ';
    }
        m = m <10?'0'+m:m;
        s = s <10?'0'+s:s;
        dateStr +=m + ':'+s;
        return dateStr;
}