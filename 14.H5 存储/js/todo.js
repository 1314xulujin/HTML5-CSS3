/*
    数据存储规划:
        存储方式: localStorage
        数据格式:   json 对象  (字段名: todoList )
        {
            uid:注册时获取,
            store:[], //存储的数据
         }

         详细的(每一条)数据格式:
            {
                id : 编号,
                title:标题,
                crate_time:创建时间,
                status:状态
            }

       完整的数据:
       {
            uid:{
                username:"张三",
                store:[
                    {
                id : 编号,
                title:标题,
                crate_time:创建时间,
                status:状态
            }
                ]
            }
       }
 */
//初始化获取存储的数据
var ToDoList = null;
var uid = null; //当前用户UID
var username = null;//当前用户名字
var isLogin = false; //是否登录成功标识
var hash = window.location.href.split("#").slice(-1)[0];//获取当前的hash

function checkLogin(){
    var loginStorage = window.sessionStorage.getItem("todoLogin");
    if(loginStorage){
        loginStorage = JSON.parse(loginStorage);
        isLogin = true; // 先暂时使用这个标识, 靠谱的做法会在登录成功的时候使用md5()随机生成一个 token 标识 ,每次加载页面时候开始对比
        uid = loginStorage.uid;
        username = loginStorage.username;
        ToDoList = getStorage();
        //首次渲染
        render();
    }
    return false;
}

checkLogin();//验证是否登录成功

/*
*  判断是否登录业务:
*      可以在登录成功之后存储一些登录标识 ,如果已经登录 ,则显示主体视图, 如果没有登录直接显示登录视图
*
*       三个视图 = >
*           #main
*           #register
*           #login
*
*        路由的核心原理 :   如何知道去了哪?  通过获取url的hash值 判断 ,根据hash值切换对应的视图
*
*       登录存储字段名: todoLogin
*           数据结构:
*           {
*              uid:,
*              username:
*              auth:true
*           }
* */

/**
 *   注册逻辑:
 *      把注册信息 记录到本地存储 - > 永久存储
 *          数据字段名 : todoUser
 *          数据结构:
 *          {
 *             888:{
 *                  uid:888,
 *                  username:张三,
 *                  usepwd:1223132
 *             }
 *          }
 *
 *
 *
 */
    //打开页面自动切换到login 视图 (需要判断是否登录) = > 登录拦截
    if(isLogin){
        window.location="#main";
    }else{
        if(hash!="register"){
            window.location="#login";
        }
    }

    //获取对应视图容器
    var main = document.getElementById("main");
    var register = document.getElementById("register");
    var login = document.getElementById("login");
    var mask = document.getElementById("mask");


//监听hash值, 用于切换显示视图
window.addEventListener("hashchange",function (e) {
    console.log("hash切换了",e.newURL.split("#").slice(-1)[0]);
    // hash = e.newURL.split("#").slice(-1)[0];
    //打开页面自动切换到login 视图 (需要判断是否登录) = > 登录拦截
    if(isLogin){
        view()
    }
})

//定义一个方法用于显示视图
function view(){
    var hash = window.location.href.split("#").slice(-1)[0];
    // console.log(hash);
    login.style.display="none";
    main.style.display="none";
    register.style.display="none";
    if(hash == "login"){
        login.style.display="block";
        mask.style.display="block";
    }else if(hash=="register"){
        register.style.display="block";
        mask.style.display="block";
    }else{
        main.style.display="block";
        mask.style.display="none";
    }
}

view();//展示首次的视图

//获取仓库数据
function getStorage(){
    var storage = window.localStorage.getItem("todoList");
    //获取的数据有可能是一个json字符串,还需要处理..
    return storage?JSON.parse(storage):{
        [uid]:{
            username:username,
            store:[]
        }
    };
}

//写入存储
function setStorage() {//data只是写入的备忘录记录列表数据
    //期间可能会有一些其他业务.....
    //写入到存储
    var storage = JSON.stringify(ToDoList);
    window.localStorage.setItem("todoList",storage);
}

//渲染数据的方法
function render(){
    var htmlStr= "";
    if(uid in ToDoList){
        var data = ToDoList[uid].store;//需要渲染的列表数据
        if(data.length == 0){
            htmlStr = "<tr><td colspan='5'class='text-center'>暂无代办事项...</td></tr>"
        }else{
            $.each(data,function (index,item) {
                htmlStr+='<tr class="'+(item.status==0?'warning':'success')+'" data-id="'+item.id+'">\n' +
                    '                    <td>'+(index + 1)+'</td>\n' +
                    '                    <td>'+item.title+'</td>\n' +
                    '                    <td>'+(moment(item.create_time).format("YYYY-MM-DD HH:mm:ss"))+'</td>\n' +
                    '                    <td>'+(item.status==0?'<span class="text-info glyphicon glyphicon-warning-sign"></span>':'<span class="text-success glyphicon glyphicon-ok"></span>')+'</td>\n' +
                    '                    <td>' +(item.status==0?'<button class="btn btn-success btn-xs complete">标记已完成</button>':'<button class="btn btn-info btn-xs complete">标记未完成</button>')+
                    '<button class="btn btn-danger btn-xs delete">删除</button></td>\n' +
                    '                </tr>';
            })
        }

    }else{
        htmlStr = "<tr><td colspan='5'class='text-center'>暂无代办事项...</td></tr>"
    }
    //插入
    $("tbody").html(htmlStr);
}
//添加事件
$("#addToDo").click(function(){
    if(!(uid in ToDoList)){ //判断当前数据是否存在
        ToDoList[uid] = {
            username:username,
            store:[]
        }
    }
    var txt = $("#txt").val();
    var id = ToDoList[uid].store.slice(-1);//截取最后一个
        id = id.length>0?(id[0].id)*1+1:1;
        console.log(id);
    //追加数据
    ToDoList[uid].store.push({
        id:id,
        title:txt,
        create_time:new Date().getTime(),
        status:0 //0 未完成 1 已完成
    });
    //存储到本地
    setStorage();
    //渲染更新
    render();
})

//完成
$("body").on("click",".complete",function () {
    var id = $(this).parents("tr").data("id");
    ToDoList[uid].store.forEach(function(item){
        if(item.id == id){
            item.status = item.status==0?1:0;
        }
    });
    //从新存储到本地
    setStorage();
    //渲染页面
    render();
})

//删除
$('body').on("click",".delete",function () {
    var id = $(this).parents("tr").data("id");
    ToDoList[uid].store.forEach(function (item,index) {
        if(item.id == id){
            ToDoList[uid].store.splice(index,1);
        }
    })
    //从新存储到本地
    setStorage();
    //渲染页面
    render();
})

/*_____________________________注册业务____________________________________*/
$(".reg-btn").click(function () {
    var username = $("#register .username").val();
    var userpwd = $("#register .userpwd").val();
        userpwd = md5(md5(userpwd)+"WT18");//执行md5算法加密
    var uid = uuid();//生成uuid

    //先取出原有的数据
    var userData = window.localStorage.getItem("todoUser");
        userData = userData?JSON.parse(userData):{};

        //添加到用户数据
        userData[uid] = {
            uid:uid,
            username:username,
            userpwd:userpwd
        }
        //写入到本地存储
        localStorage.setItem("todoUser",JSON.stringify(userData));
})

/*_____________________________登录业务___________________________________*/
$(".login-btn").click(function () {
    var username = $("#login .username").val();
    var userpwd = $("#login .userpwd").val();
    userpwd = md5(md5(userpwd)+"WT18");//执行md5算法加密

    //先取出原有的数据
    var userData = window.localStorage.getItem("todoUser");

    if(!userData){
        alert("请先注册账号!");
        return false;
    }
    userData = JSON.parse(userData);
    //判断用户名密码是否一样
    // console.log(userData);
    for(key in userData){
       var item = userData[key];
       if(item.username == username && item.userpwd == userpwd){
            isLogin = true;
            uid = item.uid;
            username = item.username;
           window.location="#main";
           var token = md5(md5(uid)+username+"WT18");
           //写入登录成功标识
           window.sessionStorage.setItem("todoLogin",JSON.stringify({
               uid:item.uid,
               username:item.username,
               auth:token
           }));
           getStorage();
           //渲染当前用户的数据
           render();
           return false;
       }
    }
       if(!isLogin){
           alert("登录失败!!!!");
       }
})

/*____________________________退出登录____________________________________*/
$(".logout").click(function () {
    window.sessionStorage.removeItem("todoLogin");
    isLogin = false;
    window.location.href="#login";
})


















