<?php

session_start();
class TuLing_Robot{
    /**
     * @param String $get_unique_uid 通过此网址 可获取与用户 一对一的临时对话 UID
     * @param String $to_api     图灵机器人的实现接口，它会返回XML
     * @param String $form_data  格式化用户消息后的 传给图灵服务器的信息
     */
    private $get_unique_uid="http://www.tuling123.com/experience/exp_virtual_robot.jhtml?nav=exp";
    private $to_api="http://www.tuling123.com/api/product_exper/chat.jhtml";
    private $form_data;
    /**
     *析构函数
     * @param  String $say 用户输入数据
     * @return void
     */
    public function __construct($say="天上掉下个猪八戒！"){
        $this->get_char_id();
        $this->post_data($say);
    }
    /*
    *获取机器人与用户的对话的userid，通过正则表达式即可获取
    * @param $_SESSION['chat_id'] 机器人与用户对话所用的唯一的临时ID
    * @return void
    */
    public function get_char_id(){
        //如果用户还没有临时对话变量，则注册一个 $_SESSION['char_id']
        if( !isset($_SESSION['chat_id']) ){
            $ch = curl_init();    //开启curl连接
            curl_setopt($ch, CURLOPT_URL, $this->get_unique_uid);    //写入url
            curl_setopt($ch, CURLOPT_HEADER, 0);    //是否有写入头信息需要写入=>false
            curl_setopt($ch, CURLOPT_RETURNTRANSFER,true);//返回字符串，而不直接输出
            $content = curl_exec($ch);    //执行curl,并把结果返回给一个字符串
            curl_close($ch);    //关闭curl连接
            //通过正则表达式提取出与机器人对话的userid
            $reg="/setItem\(\"\_userid\", \'([^\']+)/i";
            preg_match($reg,$content,$match);
            $content=null;//用完了抓取页面的临时变量，就立马释放掉。
            $_SESSION['chat_id']=$match[1];
            $match=null;
        }

    }
    /**
     *POST方式获取数据过程，并将XML解析为对象后，获取机器人发给用户的消息
     * @param boolean $https https协议相关, 默认false
     * @param method $method curl链接方式，默认POST
     * @param String @data 格式化后的传入服务器的数据；
     * @return String 机器人发给用户的消息
     */
    public function curl_request($https = false, $method = 'POST', $data = null){
        $data=$this->form_data;
        //请求 URL，返回该 URL 的内容
        $ch = curl_init(); // 初始化curl
        curl_setopt($ch, CURLOPT_URL, $this->to_api); //设置访问的 URL
        curl_setopt($ch, CURLOPT_HEADER, false); //放弃 URL 的头信息
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); //返回字符串，而不直接输出
        if($https){ //判断是否是使用 https 协议
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); //不做服务器的验证
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, true);  //做服务器的证书验证
        }
        if($method == 'POST'){ //是否是 POST 请求
            curl_setopt($ch, CURLOPT_POST, true); //设置为 POST 请求
            curl_setopt($ch, CURLOPT_POSTFIELDS, $data); //设置POST的请求数据
        }
        $content = curl_exec($ch); //开始访问指定URL
        curl_close($ch);//关闭 cURL 释放资源
        $XML_Obj=simplexml_load_string($content, 'SimpleXMLElement', LIBXML_NOCDATA);
        return $XML_Obj->Content;
    }
    /**
     *格式化用户输入的数据参数
     * @param String $say 用户输入的聊天消息
     */
    public function post_data($say){
        $say=urlencode($say);//因为要通过post传值，所以转码中文内容为,url传值格式
        $this->form_data="info=".$say."&userid=".$_SESSION['chat_id'];
    }
}

?>