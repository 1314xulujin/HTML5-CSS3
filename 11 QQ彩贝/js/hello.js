//封装一个jQ对象扩展方法 
// jQuery.fn.bg = function (color) {
//    this.css("background",color);
//    return this;//返回 this 方便后面的链式操作
// }

//jQuery 内置的一个扩展方法 fn.extend() 提供多个方法的扩展
jQuery.fn.extend({
    bg:function (color) {
        this.css("background",color);
        return this;//返回 this 方便后面的链式操作
    }
})
