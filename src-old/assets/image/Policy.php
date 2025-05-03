<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Policy extends CI_Controller {

	

    function __construct(){
        parent::__construct();
        $this->bms = $this->load->database('bms', TRUE);
$this->Selectbms = $this->load->database('Selectbms', TRUE);

		// $this->load->model(['CommonModel','MyaccoountModel','PolicyModel','GlobelModel','KModel','S3Model']);
		$this->load->helper('array_filters_helper');

		$this->load->model(['CommonModel','MyaccoountModel','PolicyModel','GlobelModel','KModel','S3Model']);
		$this->load->model('b-crm/universal_model', 'universal_model');
		$this->load->model('b-crm/filterModel', 'filterModel');
		$this->load->model('b-crm/reportsModel', 'reportsModel');
		// $this->load->helper('array_filters_helper');
		//error_reporting(0);
	}
	public function PolicyDataFetch()

	{

		$login_id = $this->input->get('User_Id');

	 	$logintype = $this->input->get('User_Type');

	 	 

		$type='Self';

		if($logintype == 'employee' || $logintype == 'agent' || $logintype == 'sp' || $logintype == 'user' || $logintype == 'admin'){

			$login_type=$logintype;

		}

		else{
			echo json_encode([
                'status' =>false,
                'msg' => 'Invalid UserType'
            ]);

            die;
		}

		$WhereAr[] = "(a.RM_Id IN ('65'))";
		$where= ' AND ' .implode(' AND ', $WhereAr);

        $sql="SELECT a.Id,a.SR_No,a.Status,a.Source,
        a.Policy_Type,a.Quotation_Id,a.LOB_Id, a.Registration_No, 
        a.File_Type,a.Segment_Id,a.Product_Id,a.SubProduct_Id,
        a.Class_Id,a.Insurance_Company_Id, a.Policy_No, a.Customer_Name,
        a.Customer_Mobile,a.Make_Id,a.Model_Id,a.Net_Premium,a.Web_Agent_Total_Amount,
        a.Basic_OD, a.Basic_TP,a.Estimated_Gross_Premium, DATE_FORMAT(a.Booking_Date,'%d-%m-%Y')
        as BookingDate,DATE_FORMAT(a.Add_Stamp,'%d-%m-%Y %h:%i:%s %p') as IssuedDate , a.Posting_Status_Web
		,(SELECT b.Document_File_Name FROM sr_documents as b WHERE b.SR_Id = a.Id AND b.Document_Type ='Policy_PDF' order by b.Id desc limit 0,1) as Document_File_Name
        ,(SELECT C.Name as CompanyName FROM `d_ins_companies` as C WHERE C.Id = a.Insurance_Company_Id order by C.Id desc limit 0,1) as CompanyName 
        FROM `sr_master` as a  
        WHERE a.Status=1  and a.Broker_Id = '1' AND a.LOB_Id IN ('Motor','Health','Non Motor') AND ( a.SR_Status='Complete' ) AND 
        a.SR_Type !='Extra-Payout'   $where ";

		// print_r($sql); die;



        $posts = $this->bms->query($sql)->result();



		if(!empty($posts)){

					$TotalEarning=[];

					$counter=1;

					foreach($posts as $row){

						$DownloadUrl ='';

						$policy_pdf = $row->Document_File_Name;
						$Company = 'N/A';

						if(!empty($row->Insurance_Company_Id)){
							$Company = $row->CompanyName;

						}


						if(!empty($policy_pdf)){

							$DownloadUrl=$policy_pdf;

						}

						$TypeName='Online';

						if($row->Source != 'Web'){

							$TypeName='Offline';

							if(!empty($policy_pdf)){

								$DownloadUrl='https://squarebweb-documents.s3.ap-south-1.amazonaws.com/BMS/sr/'.$row->Id.'/'.$policy_pdf.''; }

							if($row->Source == 'Excel'){ $TypeName='Excel';

								$DownloadUrl ='';

							}

						}

			
						$data[] = [

				
							'SrNo' => $counter++,

							'LOB' => $row->LOB_Id,

							'TypeName' => $TypeName,

							'PolicyNo' =>  $row->Policy_No,

							'CustomerName' =>  $row->Customer_Name,

							'CustomerMobile' =>  $row->Customer_Mobile,

							'DownloadUrl' =>  $DownloadUrl,

							'Company' =>  $Company,

							'Vehicle_No' =>  $row->Registration_No,

							'Policy_Type' =>  $row->Policy_Type,

							'Posting_Status_Web' =>  $row->Posting_Status_Web,

							'SR_No' =>  $row->SR_No,

							'MakeModel' =>  strtoupper($row->Make_Id ).' '.strtoupper($row->Model_Id),

							'SrID' => $row->Id,

							'CompanyId' => $row->Insurance_Company_Id,

							'BookingDate' => $row->BookingDate,

							'IssuedDate' => $row->IssuedDate,

							'NetPremium' => $row->Net_Premium,

							'GrossPremium' => $row->Estimated_Gross_Premium,

							//'Payout' => $row->Web_Agent_Total_Amount,

							//'Web_Agent_Payout_OD_Amount' => $row->Basic_OD,

							//'Web_Agent_Payout_TP_Amount' => $row->Basic_TP,

				
						];

					}

			 

	
				$json_data = [

					'Status' => true,

					"ClaimList" => $data,

					'Message' => ''

				];

	
		}else{

			$json_data = [

					'Status' => false,

					"ClaimList" => [],

					'Message' => 'No data Policy found !'

				];

		}

		echo json_encode($json_data);

	}



	public function ViewPolicyDataFetcH()

	{


						$columns = array(
							0 =>'a.Id',
						1 =>'a.LOB',
						2 =>'a.Policy_No',
						3 =>'a.Vehicle_No',
					);

				$post = $this->CommonModel->Req();

				$login_id = $this->input->get('User_Id');
				$logintype = $this->input->get('User_Type');
				$Earning = $this->input->get('Type');
				$Pos_Type = $this->input->get('Pos_Type')?$this->input->get('Pos_Type'):"";
				$urlSegment = $this->input->get('url');
				$mainOption = $this->universal_model->getUrlRouteId($urlSegment);
				$subOption = 'Is_View';
				$PageType = '';

				//Get Rights
				$rightType=$this->universal_model->getLoginUserRightsData($login_id, $logintype, $mainOption, $subOption);

				if($logintype == 'employee' || $logintype == 'agent' || $logintype == 'sp' || $logintype == 'user' || $logintype == 'admin'){
				$login_type=$logintype;
				}
				else{

				echo json_encode([
				'status' =>False,
				'msg' => 'Invalid UserType'
				]);
				die;
				}

				$Columns = $post['columns'][0]['search']['value'];
				$Ar = json_decode($Columns,true);
				$Portal = 'Bms';
				$VerticalId = @$Ar['Vertical_Id'];
				$ZoneId = @$Ar['Zone_Id'];
				$AgentType = @$Ar['Agent_Type'];
				$RegionId = @$Ar['Region_Id'];
				$SubRegionId = @$Ar['Sub_Region_Id'];
				$EmployeeStatus = @$Ar['EmployeeStatus'];
				$EmpId = @$Ar['Emp_Id'];
				$ReportType = @$Ar['Report_Type'];
				$AgentId = @$Ar['Agent_Id'];
				$FinancialYear = @$Ar['FinancialYear'];

				$SourceValue ='';
				$Source = @$Ar['Source'];
				$Company = @$Ar['Company'];
				$LOB = @$Ar['Lob'];

				$BusniessType = @$Ar['PolicyFileType'];
				$ProductType = @$Ar['ProductType'];
				$PolicyType = @$Ar['PolicyType'];
				$To_Date =@$Ar['To_Date'];
				$From_Date = @$Ar['From_Date'];
				$To_Date = $this->KModel->YMD($To_Date);
				$From_Date = $this->KModel->YMD($From_Date);
				$Search = @$Ar['SearchValue'];
				$WhereAr =[];
				if(isset($Ar['Posting_Status_Web'])){
				$Posting_Status_Web = @$Ar['Posting_Status_Web'];
				}else{
				$Posting_Status_Web =[];
				}

				if($Portal == 'Bms'){
				if($logintype != 'admin'){
				$getuserid=$this->GlobelModel->getuserdata_user($login_id,$logintype);
				$login_id=$this->GlobelModel->getuserdatabms($getuserid);
				}
				}
				// print_r($Ar);

				//Common Filter Data
				$filterArrayy = array (
				'loginId' => $login_id,
				'loginType' => $logintype,
				'rightType' => $rightType,
				'VerticalId' => $VerticalId,
				'ZoneId' => $ZoneId,
				'RegionId' => $RegionId,
				'SubRegionId' => $SubRegionId,
				'EmployeeStatus' => $EmployeeStatus,
				'EmpId' => $EmpId,
				'ReportType' => $ReportType,
				'AgentType' => $AgentType,
				'Portal' => $Portal,
				'PageType' => $PageType
				);

				if($type == 'Self' && $Pos_Type == '3' ){
				$WhereAr[] = " (a.SubPos_Id IN ($login_id) )";
				}else{

				$commonCondition = " AND 1 != 1 ";
				if($logintype == 'employee' && ($rightType == 'All' || $PageType == 'ManageRequests') && ($VerticalId == '' || empty($VerticalId)) && ($ZoneId == '' || empty($ZoneId))  && ($RegionId == ''|| empty($RegionId) ) && ($SubRegionId == ''|| empty($SubRegionId)) && ($ReportType == '' || empty($ReportType)) && ($EmpId == ''|| empty($EmpId) )  && ($EmployeeStatus[0]['Name'] == 'All' || empty($EmployeeStatus)) && ($AgentId == '' || empty($AgentId))   && ($AgentType == '' || empty($AgentType))){
				$commonCondition = '';

				}elseif($AgentId != '' && !empty($AgentId)){

				//IF REPORT Type Is Not Policy Issuance And For Agent not under Hierarchy Right Now
				if(!empty($EmpId) && $EmpId != ''){
					$AgentAr[] = $this->filterModel->MakeWhereInString($EmpId,'a.RM_Id','INT');
				}else{
					$AgentAr[] = " (a.RM_Id IN ($login_id)) ";
				}
				$AgentAr[] = $this->filterModel->MakeWhereInString($AgentId,'a.Agent_Id','INT');

				if(!empty($AgentAr)){
				$commonCondition =" AND (". implode(' and  ', $AgentAr). ") ";
				}
				else{
				$commonCondition = " AND 1 != 1";
				}

				}else{
				$commonConArray = array();
				$filterData = $this->filterModel->getCommonFilterData($filterArrayy);

				$agentData = '';
				if($filterData['employeeData'] != ''){
				$commonConArray[] = " (a.RM_Id IN (".$filterData['employeeData'].")) ";
				}

				if($filterData['spData'] != '' && $filterData['employeeData'] == ''){
				$commonConArray[] = " (a.Agent_Id IN (".$filterData['spData'].")) ";
				}

				if($filterData['posData'] != '' && $filterData['employeeData'] == ''){
				$commonConArray[] = " (a.Agent_Id IN (".$filterData['posData'].")) ";
				}

				if(!empty($commonConArray)){
				$commonCondition =" AND (". implode(' and  ', $commonConArray). ") ";
				}
				else{
				$commonCondition = " AND 1 != 1";
				}

				}
				// echo $commonCondition ;
				// exit;
				// 		// print_R($filterData);
				}

				// if(!empty($LOB)){ $WhereAr[] = $this->MakeWhereInString($LOB,'a.LOB_Id','STR');}
				// if(!empty($Company)){ $WhereAr[] = $this->MakeWhereInString($Company,'a.Insurance_Company_Id','INT'); }
				// if(!empty($BusniessType)){ $WhereAr[] = $this->MakeWhereInString($BusniessType,'a.File_Type','STR');}
				// if(!empty($ProductType)){ $WhereAr[] = $this->MakeWhereInString($ProductType,'a.Product_Id','INT'); }
				// if(!empty($Posting_Status_Web)){ $WhereAr[] = $this->MakeWhereInString($Posting_Status_Web,'a.Posting_Status_Web','INT');}
				// if(!empty($PolicyType)){ $WhereAr[] = $this->MakeWhereInString($PolicyType,'a.Segment_Id','STR');  }
				// if(!empty($Source)){ $WhereAr[] = $this->MakeWhereInString($Source,'a.Source','STR'); }
				// if(!empty($To_Date)){ $WhereAr[] = "(DATE_FORMAT(a.Booking_Date,'%Y-%m-%d') BETWEEN '$To_Date' AND '$From_Date') "; }

				// if(empty($FinancialYear)){
				// $WhereAr[] = "(DATE_FORMAT(a.Booking_Date,'%Y-%m-%d') BETWEEN '".date("Y-m-01")."' AND '".date("Y-m-d")."') ";
				// }
				// else if(!empty($FinancialYear)){
				// $FinancialYear=$FinancialYear[0]['Id'];
				// $WhereAr[]= "  a.SR_Session_Year='".$FinancialYear."' ";
				// }

				// $WhereAr[]=  "a.Status=1 and lower(a.SR_Type)='normal'";

				// print_r($WhereAr);
				//  die;
				// exit;			// echo $date = date("Y-m-01").' To '.date("Y-m-d"); // date range upto today


				// $limit = ($post['length'])?$post['length']:0;
				// $start = ($post['start'])?$post['start']:0;

				$column =  ' a.Id '; //$columns[$columnIndex];
				$orderBy = ' DESC '; // @$post['order'][0]['dir'];

				$EArningCondions ='';
				if($Earning=='Earning')
				$WhereAr[] = " a.Policy_Type=1 ";

				$FilterArray='';
				$where=implode(' AND ', $WhereAr);

				$FilterArray= $commonCondition;
				if($where != ''){
				$FilterArray =$commonCondition.' AND ' .$where;
				}
				//   echo $FilterArray; exit;


				$totalData = $this->MyaccoountModel->allRowCountPolicys($FilterArray);

				$totalFiltered = $totalData;

				if(empty($Search))
				{
				$posts = $this->MyaccoountModel->allRowResultPolicys($limit,$start,$column,$orderBy,$FilterArray);
				}
				else {
				$search ="and (a.Policy_No LIKE '%" . $Search . "%' OR a.Customer_Mobile LIKE '%" . $Search . "%' OR a.Customer_Name LIKE '%" . $Search . "%' OR a.Registration_No LIKE '%" . $Search . "%' )";
				$posts =  $this->MyaccoountModel->SearchDataPolicys($limit,$start,$search,$FilterArray);
				$totalFiltered = $this->MyaccoountModel->SearchDataCountPolicys($search,$FilterArray);
				}
				$customer_name ='';
				$customer_mobile ='';
				$data=[];
				if(!empty($posts))
				{
				$counter=$start+1;
				$TotalEarning=[];
				foreach($posts as $row){
				$DownloadUrl ='';
				$policy_pdf =$row->Document_File_Name;

				$Company='';
				if(!empty($row->CompanyName)){
				$Company = $row->CompanyName;
				}

				if(!empty($policy_pdf)){
				$DownloadUrl=$policy_pdf;
				}

				$TypeName='Online';
				if($row->Source != 'Web'){
				$TypeName='Offline';
				if(!empty($policy_pdf)){
				$DownloadUrl='https://squarebweb-documents.s3.ap-south-1.amazonaws.com/BMS/sr/'.$row->Id.'/'.$policy_pdf.''; }
				if($row->Source == 'Excel'){ $TypeName='Excel';
				$DownloadUrl ='';
				}
				}


				//$Agent_Name = 'N/A';
				//if($row->Agent_Type == 'POS'){
				$Agent_Name = $row->Agent_Name.' - '.$row->Agent_Code;
				//}
					$RM_Name = 'N/A';
				$RM_Name = $row->RM_Name.' - '.$row->RM_Code;

				if($row->Login_Scope == 'Direct Login'){
					$RM_Name = 'N/A';

					}
				//Web_Agent_Total_Amount

					$data[] = [

						'SrNo' => $counter++,
						'LOB' => $row->LOB_Id,
						'TypeName' => $TypeName,
						'PolicyNo' =>  $row->Policy_No,
						'CustomerName' =>  $row->Customer_Name,
						'CustomerMobile' =>  $row->Customer_Mobile,
						'DownloadUrl' =>  $DownloadUrl,
						'Company' =>  $Company,
						'Vehicle_No' =>  $row->Registration_No,
						'Policy_Type' =>  $row->Policy_Type,
						'Posting_Status_Web' =>  $row->Posting_Status_Web,
						'SR_No' =>  $row->SR_No,
						'MakeModel' =>  strtoupper($row->Make_Id ).' '.strtoupper($row->Model_Id),
						'SrID' => $row->Id,
						'CompanyId' => $row->Insurance_Company_Id,
						'BookingDate' => $row->BookingDate,
						'IssuedDate' => $row->IssuedDate,
						'NetPremium' => $row->Net_Premium,
						'GrossPremium' => $row->Estimated_Gross_Premium,
						'Payout' => $row->Web_Agent_Total_Amount,
						'Web_Agent_Payout_OD_Amount' => $row->Basic_OD,
						'Web_Agent_Payout_TP_Amount' => $row->Basic_TP,
						'Agent_Name' => $Agent_Name,
						'RM_Name' => $RM_Name,
						'Login_Scope'=> $row->Login_Scope,



					];
				}
				//print_r($data);
				}

				$TotalEarningAr =$this->Selectbms->query("select count(Id) as TotalFiles,sum(a.Web_Agent_Total_Amount) as Total ,sum(a.Net_Premium) as TotalNetPremium from sr_master as a where  a.Status=1  and a.Broker_Id = '1' AND a.LOB_Id IN ('Motor','Health','Non Motor','Li') AND ( a.SR_Status='Complete' ) AND
				a.SR_Type !='Extra-Payout' ".$FilterArray." ")->row();

				//print_r($TotalEarningAr); die;
				$TotalCounts=$this->Selectbms->query("select a.LOB_Id as LOB ,count(a.Id) as TotalFiles,sum(a.Net_Premium) as TotalPremium  from sr_master as a  where a.Status=1  and a.Broker_Id = '1' AND a.LOB_Id IN ('Motor','Health','Non Motor','Li') AND ( a.SR_Status='Complete' ) AND
				a.SR_Type !='Extra-Payout' ".$FilterArray." group by a.LOB_Id ")->result();


				$FilterToTalPolicyAndPremium=$this->Selectbms->query("select count(a.Id) as TotalFiles,sum(a.Net_Premium) as TotalPremium  from sr_master as a  where a.LOB_Id IN ('Motor','Health','Non Motor','Li')  and a.Broker_Id = '1'" .$FilterArray." ")->result();

				$TotalEarning = $TotalEarningAr->Total;
				$TotalFiles = $TotalEarningAr->TotalFiles;
				$TotalPremium = $TotalEarningAr->TotalNetPremium;


				$json_data = array(
						"draw"            => intval($this->input->post('draw')),
						"recordsTotal"    => intval($totalData),
						"recordsFiltered" => intval($totalFiltered),
						"data"            => $data,
						"TotalEarning"    =>$TotalEarning,
						"TotalFiles"    => $TotalFiles,
						"TotalPremium"    => $TotalPremium,
						"FilterPolicyData" => $TotalCounts,
						"FilterToTalPolicyAndPremium" => $FilterToTalPolicyAndPremium,
						);

				echo json_encode($json_data);

	}


	


}