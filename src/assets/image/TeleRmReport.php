<?php
defined('BASEPATH') or exit('No direct script access allowed');

class TeleRmReport extends CI_Controller{

  function __construct(){
    parent::__construct();

    $this->bms = $this->load->database('bms', TRUE);
    $this->Selectbms = $this->load->database('Selectbms', TRUE);

      $this->load->model('V2/filterModel', 'filterModel');
    $this->load->model('b-crm/universal_model', 'universal_model');
    $this->load->model('b-crm/reportsModel', 'reportsModel');
    $this->load->model(['ReportModel','CommonModel','PolicyModel','GlobelModel','KModel','S3Model']);
    $this->load->model('b-crm/endosmentModel', 'endosmentModel');
    $this->load->model('V2/RightsModel', 'RightsModel');

    // ini_set('display_errors', 1);
    // ini_set('display_startup_errors', 1);
    // error_reporting(E_ALL);
  }

 
 
 
//===== POLICY RELATED DATATABLE FUNCTION =====//
    public function PosAssignTeleRm(){
        
        $PosReport = $this->db->query("Select id from user_agent where delete_status ='0' and (TeleRm ='' or TeleRm is null) and type ='2' and status ='1' and pos_status in (2,3,4)");

        $counter=0;   
       $PosReportNumRows= $PosReport->num_rows();
       
      if($PosReportNumRows > 0){
        $PosReportResult=  $PosReport->result();
        foreach($PosReportResult as $pos){

            $employee = $this->db->query("select id from employee where TeleRm='1' and resign_status ='0' and status ='1' and delete_status ='0' order by rand() limit 1");
            if($employee->num_rows() > 0){
                $employeeRow= $employee->row()->id;
                 
                $Update = $this->db->query( "update user_agent set TeleRm='$employeeRow' where delete_status ='0' and (TeleRm ='' or TeleRm is null) and type ='2' and status ='1' and pos_status in (2,3,4) and id='$pos->id'");

            }
            $counter++;

        }
      }
      echo $counter;

    } //END
}