<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Prequotes extends CI_Controller
{

	public function __construct()
	{
		parent::__construct();
		$this->bms = $this->load->database('bms', TRUE);
		$this->Selectbms = $this->load->database('Selectbms', TRUE);
		error_reporting(0);
	}



	public function get_make($type = '')
	{

		$type = $this->input->post('type');

		$SearchTerm = $this->input->post('SearchMake');
		if (!empty($SearchTerm)) {
			$search = " and make like '%$SearchTerm%'";
		}

		$datas = $this->db->query("select make as Id,make as Name from  squareMaster where type='" . $type . "' $search group by make order by make asc limit 0,5")->result();
		$response = ['Status' => true, 'Message' => 'Success', 'type' => $type, 'Data' => $datas];
		echo json_encode($response);
	}


	public function get_model($type = '')
	{

		$type = $this->input->post('type');

		$make = $this->input->post('SearchMake');
		$SearchTerm = $this->input->post('SearchModel');
		if (!empty($SearchTerm)) {

			$search = " and modal like '%$SearchTerm%'";
		}
		// $type = 1;

		$datas = $this->db->query("select modal as Id,modal as Name from  squareMaster where type='" . $type . "' and make like $make  $search group by modal order by modal asc limit 0,5")->result();

		$response = ['Status' => true, 'Message' => 'Success', 'Data' => $datas];
		echo json_encode($response);
	}




	public function get_fuel($type = '')
	{

		$type = $this->input->post('type');

		$SearchMake = $this->input->post('SearchMake');
		$SearchModel = $this->input->post('SearchModel');

		$SearchFuel = $this->input->post('SearchFuel');
		if (!empty($SearchFuel)) {
			$search = " and fule_type like '%$SearchFuel%'";
		}

		$datas = $this->db->query("select fule_type as Id,fule_type as Name from  squareMaster where type='" . $type . "' and make like $SearchMake and modal like $SearchModel $search group by fule_type order by fule_type asc limit 0,5")->result();

		$response = ['Status' => true, 'Message' => 'Success', 'Data' => $datas];
		echo json_encode($response);
	}



	public function get_variant($type = '')
	{

		$type = $this->input->post('type');

		$SearchMake = $this->input->post('SearchMake');
		$SearchModel = $this->input->post('SearchModel');

		$SearchFuel = $this->input->post('SearchFuel');
		$SearchVariant = $this->input->post('SearchVariant');
		if (!empty($SearchVariant)) {
			$search = " and variant like '%$SearchVariant%'";
		}
		// $data[] = '';
		$datas = $this->db->query("select variant as Id ,variant as Name,variant,cubic_capacity from  squareMaster where type='" . $type . "' and make like $SearchMake and modal like $SearchModel  and fule_type like $SearchFuel  $search order by variant asc limit 0,5")->result();


		foreach ($datas as $year) {

			$data[] = [
				'Id' => $year->variant.'('.$year->cubic_capacity.')',
				'Name' => $year->variant.'('.$year->cubic_capacity.')'
			];
		}

		$response = ['Status' => true, 'Message' => 'Success', 'Data' => $data];

		// $response = ['Status' => true, 'Message' => 'Success', 'Data'=> $datas];
		echo json_encode($response);
	}


	// public function CreateOnlineMotorQuoteAsOfflinePolicy(){

	// 	$Post = $_POST;
	// 	print_r($Post );
	// 	exit;

	// }

	public function CreateOnlineMotorQuoteAsOfflinePolicy()
	{


		$contollid = '';
		$agent_id = '';
		$user_id = '';
		$employee_id = '';
		$sp_id = '';
		$SrId = $this->input->post('SrId');
		$RegNo = $this->input->post('RegNo');
		$Make = $this->input->post('Make');
		$Modal = $this->input->post('Modal');
		$Variant = $this->input->post('Variant');
		$Fuel = $this->input->post('Fuel');
		$TypeValue = '0';
		$BmsData = $this->bms->query("select  sr.Id,sr.Customer_Name,sr.Customer_Email,sr.Customer_Mobile,sr.File_Type,sr.Product_Id,sr.Policy_End_Date_OD,sr.Manufacture_Year,dic.Name as CompanyName  from sr_master as sr inner join d_ins_companies as dic on sr.Insurance_Company_Id = dic.Id  where sr.Product_Id in ('GCV','Misc D','PC','PCV','TW') and sr.Id='$SrId'")->row();

		if ($BmsData->Product_Id == 'GCV') {
			$TypeValue = 4;
		}
		if ($BmsData->Product_Id == 'Misc D') {
			$TypeValue = 5;
		}
		if ($BmsData->Product_Id == 'PC') {
			$TypeValue = 2;
		}
		if ($BmsData->Product_Id == 'PCV') {
			$TypeValue = 3;
		}
		if ($BmsData->Product_Id == 'TW') {
			$TypeValue = 1;
		}

		$Make = str_replace('"',"",$Make);
		$Modal = str_replace('"',"",$Modal);
		$Variant = str_replace('"',"",$Variant);
		$Fuel = str_replace('"',"",$Fuel);

		if ($this->input->post('login_type') == 'user') {
			$user_id = $this->input->post('login_id');
		} elseif ($this->input->post('login_type') == 'agent') {
			$agent_id = $this->input->post('login_id');
			$contollid = 'AGN';
		} elseif ($this->input->post('login_type') == 'employee') {
			$employee_id = $this->input->post('login_id');
			$contollid = 'EMP';
		} elseif ($this->input->post('login_type') == 'sp') {
			$sp_id = $this->input->post('login_id');
		}


$previous_insurer = $this->db->query("SELECT shot_name  FROM company WHERE bmsIns like '%$BmsData->CompanyName%' ")->row()->shot_name;


		$legal_liability_paid_driver_value = $legal_liability_paid_driver = 1;
		$randsNumbers = mt_rand(11111, 99999);
		$ctrl_id = '';
		if ($TypeValue == 1) {

			$legal_liability_paid_driver_value = $legal_liability_paid_driver = 0;

			$quotation_id = "SQTW" . date('YmdHis') . $randsNumbers;
			$ctrl_id = "CI" . $contollid . "TW" . date('YmdHis') . $randsNumbers;
		}
		if ($TypeValue == 2) {

			$quotation_id = "SQPC" . date('YmdHis') . $randsNumbers;
			$ctrl_id = "CI" . $contollid . "PC" . date('YmdHis') . $randsNumbers;
		}
		if ($TypeValue == 3) {


			$quotation_id = "SQPCV" . date('YmdHis') . $randsNumbers;
			$ctrl_id = "CI" . $contollid . "PCV" . date('YmdHis') . $randsNumbers;
		}
		if ($TypeValue == 4) {


			$quotation_id = "SQGCV" . date('YmdHis') . $randsNumbers;
			$ctrl_id = "CI" . $contollid . "GCV" . date('YmdHis') . $randsNumbers;
		}
		if ($TypeValue == 5) {


			$quotation_id = "SQMISCD" . date('YmdHis') . $randsNumbers;
			$ctrl_id = "CI" . $contollid . "MISCD" . date('YmdHis') . $randsNumbers;
		}
		$current_date = date('Y-m-d H:i:s');


		$controllids = '';
		if ($contollid != '') {
			$controllids = $ctrl_id;
		}




		$tp_only = 0;

		$addValue = array();
		$addValueTp = array();


		$reg_no = strtoupper(trim($RegNo));

		$now = time(); // or your date as well
		$policy_end_date = date("Y-m-d", strtotime($BmsData->Policy_End_Date_OD));
		$your_date = strtotime($policy_end_date);
		$datediff = $your_date - $now;

		$countDay =  round($datediff / (60 * 60 * 24));
		if ($countDay >= 0) {
			$policy_expiery = "Not expired";
		} else if ($countDay < 0) {
			$abs = abs($countDay);
			if ($abs > 90) {
				$policy_expiery = "Expire more than 90 Days";
			} else {
				$policy_expiery = "Expire within 90 Days";
			}
		}

		$Manufacture_Year = date($BmsData->Manufacture_Year."-01-01");
		$addValue = array(
			'manufacture_date' => $Manufacture_Year,
			'purchase_date' => $Manufacture_Year,
			'registration_date' => $Manufacture_Year,
			'policy_expiery_date' => $BmsData->Policy_End_Date_OD,
		);



		$datas = array(
			'current_datetime' => $current_date,
			'quotation_id' => $quotation_id,
			'controll_id' => $controllids,
			'sp_id' => $sp_id,
			'agent_id' => $agent_id,
			'user_id' => $user_id,
			'employee_id' => $employee_id,
			'legal_liability_paid_driver' => $legal_liability_paid_driver,
			'legal_liability_paid_driver_value' => $legal_liability_paid_driver_value,
			'gadi_type' => $TypeValue,
			'registration_no' => strtoupper($RegNo),
			'make' => $Make,
			'model' => $Modal,
			'fuel_type' => $Fuel,
			'variant' => $Variant,
			'reg_year' => $Manufacture_Year,
			'previous_insurer' => $previous_insurer,
			'policy_type' => 'comprehensive',
			'policy_expiery' => $policy_expiery,
			'name' => $BmsData->Customer_Name,
			'email' => $BmsData->Customer_Email,
			'tp_only' => $tp_only,
			'mobile' => $BmsData->Customer_Mobile,
		);

		$data = array_merge($datas, $addValue);
 
		 $result = $this->insert_quotation_details($data);

		if ($result != "error") {
			$id = $result;
			$this->db->select('*');
			$this->db->where(array('id' => $id));
			$queryaaaa = $this->db->get('policy_details');
			$result1 =  $queryaaaa->result_array();
			$QuoteId = base64_encode($result1[0]['quotation_id']);
			$url = 'https://www.squareinsurance.in/quotes/index/'.$QuoteId;

			$response = ['Status' => true, 'Message' => 'Success', 'QuoteId' => $QuoteId, 'Url' => $url ];
			echo json_encode($response); die;



		} else {
			$result;
			$response = ['Status' => false, 'Message' => $result, 'QuoteId' => '','Url' => ''];
			echo json_encode($response); die;
		}
	}


	function insert_quotation_details($data)
  {
 
    $qid = $data['quotation_id'];
    $query = $this->db
      ->select('*')
      ->where('quotation_id', $qid)

      ->get('policy_details');
    $data_fetch =  $query->num_rows();
    if ($data_fetch > 0) {
      $fetch = $query->row_array();
      $insert = $this->db->where(array('quotation_id' => $qid));
      $insert = $this->db->update('policy_details', $data);
      $insert_id = $fetch['id'];
    } else {
      $insert = $this->db->insert('policy_details', $data);
      $insert_id = $this->db->insert_id();
    }

    if ($insert) {

                $data1 = array(
                'quotation_id'=>$qid,
                'response'=>json_encode($data),
                'date'=>date('Y-m-d H:i:s'),
                'version'=>'v3',
                'ip'=>$_SERVER["REMOTE_ADDR"],
              );
                $insertsss = $this->db->insert('create_quotation_log', $data1);


      return  $insert_id;
    } else {
        echo $this->db->last_query();
      return "error";
    }
  }
}
