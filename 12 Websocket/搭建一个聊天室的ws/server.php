<?php  
include 'websocket.class.php'; 

   
$config=array(  
  'address'=>'172.16.4.1',  
  'port'=>'8000',  
  'event'=>'WSevent',//回调函数的函数名  
  'log'=>true,  
);  
$websocket = new websocket($config);  
$websocket->run();  
function WSevent($type,$event){  
  global $websocket;  
    if('in'==$type){  
      $websocket->log('客户进入id:'.$event['k']);  
      // $websocket->writeAll('系统提示:'.$event['k'].'已经进入聊天室.');
    }elseif('out'==$type){  
      $websocket->log('客户退出id:'.$event['k']);  
    }elseif('msg'==$type){  
      $websocket->log($event['k'].'消息:'.$event['msg']);  
      roboot($event['sign'],$event['msg']);  
    }  
}  
   
function roboot($sign,$t){  
  global $websocket;  
  switch ($t)  
  {  
  case 'hello':  
    $content='hello WEBer';  
    break;    
  case 'name':  
    $content='Robot';  
    break;  
  case 'time':  
    $content='当前时间:'.date('Y-m-d H:i:s');  
    break;  
  case '再见':  
    $show='( ^_^ )/~~拜拜';  
    $websocket->write($sign,'Robot:'.$show);  
    $websocket->close($sign);  
    return;  
    break;  
  case '天王盖地虎':  
    $array = array('小鸡炖蘑菇','宝塔震河妖','粒粒皆辛苦');  
    $content = $array[rand(0,2)];  
    break;  
  default:  
     require_once('./tuling.php');
     $ac_info=new TuLing_Robot($t);
     $content1 = $ac_info->curl_request();//输出机器人的话
     $content=str_replace("图灵机器人","WEB前端开发工程师",$content1);
     $content=str_replace("Turingrobot","Timor-m",$content);
		 $show =  '数据施工中...';
  }  
  // $websocket->write($sign,'WEB工程师:'.$content);
  $websocket->write($sign,$content);  
}  
?>  