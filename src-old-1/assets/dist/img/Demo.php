<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Demo extends CI_Controller {
    
    
    function index(){
        
        header("Access-Control-Allow-Origin:*");
        header("Access-Control-Allow-Headers:*");
        echo  123;
    }
    
}
?>
