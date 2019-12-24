/**
 * H5表单中 ,有一个invalid 事件  = > 表单验证失败事件
 *
 *  特性: invalid 事件不会冒泡
 *
 *
 *  input 表单元素 ,可以设置报错提示内容自定义
 * */

var regForm = document.querySelector(".reg-form"); //获取表单对象

//对应表单错误提示消息
var errors = {
    nick:{
        valueMissing:"大哥,昵称不能为空!",
        patternMismatch:"昵称必须是6-10的长度"
    },
    psw:{
        valueMissing:"大哥,密码不能为空!",
        patternMismatch:"密码必须是6-16的长度"
    },
    psw1:{
        valueMissing:"大哥,确认密码不能为空!",
        patternMismatch:"确认密码必须是6-10的长度",
        same:"两次输入密码不一致!"
    },
    tel:{
        valueMissing:"大哥,手机不能为空!",
        patternMismatch:"手机必须是11的数字"
    },
    mail:{
        valueMissing:"大哥,邮箱不能为空!",
        patternMismatch:"邮箱的格式不对!"
    },
    old:{
        valueMissing:"大哥,年龄不能为空!",
        patternMismatch:"年龄必须是12-120之间的数字!"
    }
}

regForm.addEventListener("invalid",function(e){
    var ele = e.target;
    var eleName = ele.name;
    // console.log(eleName);
    var validityState = ele.validity;//获取当前表单对象的validity属性
    console.log(validityState);

    if(validityState.valueMissing){
        // validityState.customError = true;
        ele.setCustomValidity(" ");// 设置不提示
        // ele.setCustomValidity(errors[eleName].valueMissing);//修改浏览器错误提示的内容
        // console.log(errors[eleName].valueMissing);
        Tips(true,errors[eleName].valueMissing,ele);
    }else if(validityState.patternMismatch){
        ele.setCustomValidity(" ");// 设置不提示
        // ele.setCustomValidity(errors[eleName].patternMismatch);//修改浏览器错误提示的内容
        // console.log(errors[eleName].patternMismatch);
        Tips(true,errors[eleName].patternMismatch,ele);
    }else{
        ele.setCustomValidity(" ");// 设置不提示
        if(eleName == "psw1"){//确认密码
              var psw1 = ele.value;
              var psw = document.querySelector("#psw").value;
              if(psw1!=psw){
                  ele.setCustomValidity(errors[eleName].same);// 设置不提示
              }
        }
    }
},true);

//定义一个提示组件
function Tips(status,msg,element){//status 验证状态  , msg 提示内容 , element 当前验证的表单元素
    var tips = document.createElement("div");
        tips.className = "tips";
        tips.innerHTML = msg;
        element.parentNode.appendChild(tips);
}

var inputs = document.querySelectorAll("input");
    for(var i=0;i<inputs.length;i++){
        inputs[i].oninvalid = function(e){
            e.preventDefault();
        }
    }