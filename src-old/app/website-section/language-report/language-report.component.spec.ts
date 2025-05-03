import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageReportComponent } from './language-report.component';

describe('LanguageReportComponent', () => {
  let component: LanguageReportComponent;
  let fixture: ComponentFixture<LanguageReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LanguageReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});










// <?php
// defined('BASEPATH') OR exit('No direct script access allowed');

// class language extends CI_Controller {

   
//     function __construct()
//     {
//         parent::__construct();
//          //$this->KModel->HttpHeaders();
//             $this->load->model('CommonModel');
        
//     }
 
//     public function gridata()

//     {

//          $post = $this->CommonModel->Req();
      


//           $limit = (@$post['length']) ? $post['length'] : 0;
//          $start = (@$post['start']) ? $post['start'] : 0;


//         $userid=$this->input->post('User_Id');
//         $usertyp=$this->input->post('User_Type');

//        //  $sql = $this->db->query('SELECT * FROM  lang order by id DESC');




//     //    $sql = 'SELECT * FROM  lang';
//     $sql = "SELECT * FROM lang LIMIT $start, $limit";
//         $data = $this->db->query($sql)->result();

//        //print_r(COUNT($data));

//        //  $sqlnew = $sql->result();

//            //$totalRecords = $sql->num_rows();

//      $totalData = $this->db->query($sql)->num_rows();
//         $datas = [];

//         foreach ($data as $row) {
    
//             $datas[] = [
//                 'Id' => $row->id,
//                 'key_name' => $row->key_name,
//                 'english' => $row->english,
//                 'hindi' => $row->hindi,
//                 'bengali' => $row->bengali,
//                 'marathi' => $row->marathi,
//                 'telugu' => $row->telugu,
//                 'tamil' => $row->tamil, 
//                 'add_stamp'=>$row->add_stamp,
//                 'update_stamp'=>$row->update_stamp,

//             ];
        
//         }
       

//         $json_data = [
//             //'recordsTotal' => $totalRecords,
//             //'recordsFiltered' => $totalRecords, 
//             'draw'  => intval($this->input->post('draw')),
//              'recordsTotal'    => intval($totalData),
//              'recordsFiltered' => intval($totalData),

//             'data' => $datas
//         ];

//         echo json_encode($json_data);

//     }



//     public function addLang() {
//         $data = json_decode(file_get_contents('php://input'), true);


//         $key_name = $this->input->post('key_name');
//         $english = $this->input->post('english');
//         $hindi = $this->input->post('hindi');
//         $bengali = $this->input->post('bengali');
//         $marathi = $this->input->post('marathi');
//         $telugu = $this->input->post('telugu');
//         $tamil = $this->input->post('tamil');



//         $this->db->where('key_name', $key_name);
//         $query = $this->db->get('lang');
        
//         if ($query->num_rows() > 0) {
//             $response = ['status' => false, 'msg' => 'Key Name already exists.'];
//             echo json_encode($response);
//             return;
//         }

//         $insert_data = [
//             'key_name' => $key_name,
//             'english' => $english,
//             'hindi' =>   $hindi,
//             'bengali' =>   $bengali,
//             'marathi' =>  $marathi,
//             'telugu' =>  $telugu,
//             'tamil' =>   $tamil
//         ];


//         $inserted = $this->db->insert('lang', $insert_data);

//         if ($inserted) {
//             $response = ['status' => true, 'msg' => 'Language data added successfully.'];
//         } else {
//             $response = ['status' => false, 'msg' => 'Failed to add language data.'];
//         }

//         echo json_encode($response);
//     }



//     public function updateLang()
//      {
//         $key_name = $this->input->post('key_name');
//         $english = $this->input->post('english');
//         $hindi = $this->input->post('hindi');
//         $bengali = $this->input->post('bengali');
//         $marathi = $this->input->post('marathi');
//         $telugu = $this->input->post('telugu');
//         $tamil = $this->input->post('tamil');
//         $currentDateTime = date('Y-m-d H:i:s');

//         $id = $this->input->post('id');  

//         $update_data = [
//             'key_name' => $key_name,
//             'english' => $english,
//             'hindi' => $hindi,
//             'bengali' => $bengali,
//             'marathi' => $marathi,
//             'telugu' => $telugu,
//             'tamil' => $tamil,
//         ];

//         $this->db->where('id', $id);
//         $existingRecord = $this->db->get('lang')->row();

//         if ($existingRecord) {
//             $this->db->where('id', $id);
//             $updated = $this->db->update('lang', $update_data);

//             if ($updated) {
//                 $response = ['status' => 'Success', 'msg' => 'Language data updated successfully.'];
//             } else {
//                 $response = ['status' => 'Error', 'msg' => 'Failed to update language data.'];
//             }
//         } else {
//             $response = ['status' => 'Error', 'msg' => 'Language data not found.'];
//         }

//         echo json_encode($response);
//     }



//     public function delete()
//     {
//         $id = $this->input->post('id');


      
//         if (empty($id) || !is_numeric($id)) {
//             $response = ['status' => 'Error', 'msg' => 'Invalid ID.'];
//             echo json_encode($response);
//             return;
//         }
    
//         $this->db->where('id', $id);
//         $deleted = $this->db->delete('lang');

      
    
//         if ($deleted) {
//             $response = ['status' => 'Success', 'msg' => 'Language record deleted successfully.'];
//         } else {
//             $response = ['status' => 'Error', 'msg' => 'Failed to delete language record.'];
//         }
    
//         echo json_encode($response);
//     }

//     public function delete1(){
//         echo 445455;
//         die;
//     }


// }





// ?> 