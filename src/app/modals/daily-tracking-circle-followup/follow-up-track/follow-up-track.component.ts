import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { HttpClient, HttpResponse,HttpHeaders } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../../../providers/api.service';
import { Router } from  '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup,Validators } from  '@angular/forms';

class ColumnsObj {
  SNo: string;
  Id: string;
  Employee_Code: any;
  Name: any;
  DOB: any;
  Gender: string;
  Designation: string;
  Sum_Assured: any;
  CTC: string;
  Is_Covid_Infected: string;
  Current_Covid_Status: string;
  Vaccination_Status: string;
  Entity_Name: string;
  Location: string;
  Department: string;
  Remarks: string;
}

class DataTablesResponse {
  Status: any;
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  ImageBaseUrl: any;
  SQL_Where: any;
}

@Component({
  selector: 'app-follow-up-track',
  templateUrl: './follow-up-track.component.html',
  styleUrls: ['./follow-up-track.component.css']
})

export class FollowUpTrackComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  datatableElement: DataTableDirective;

 dtOptions: DataTables.Settings = {};
 dataAr: ColumnsObj[];

  SearchForm:FormGroup;
  isSubmitted  = false;

  latitude:any = '';
  longitude:any;
  selectedFiles: File;
  Camera!:File;

  Circle_Type:any = '';
  Agent_Id:any;
  Row_Id:any;
  CircleAr: any = [];
  activeTab: any = '';
  showTab: any = 'No';
  Action_User_Type: any;
  imageUrl: any = '';
  Is_Export: any = 0;
  InteractionTypeArray: { Id: string; Name: string; }[];
  dropdownSettingsingleselect: { singleSelection: boolean; idField: string; textField: string; itemsShowLimit: number; enableCheckAll: boolean; allowSearchFilter: boolean; };

  constructor( public dialogRef: MatDialogRef<FollowUpTrackComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public api : ApiService, private http: HttpClient,  public formBuilder: FormBuilder) {

    this.SearchForm = this.formBuilder.group({
      Interaction_Type: [''],
			DateOrDateRange: [''],
		});

    this.dropdownSettingsingleselect = {
      singleSelection: true,
      idField: 'Id',
      textField: 'Name',
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: false
    };

     this.Row_Id = this.data.Row_Id;
  	 this.Circle_Type = this.data.Circle_Type;
     this.Agent_Id = this.data.Agent_Id;
     this.Action_User_Type = this.Action_User_Type;

     if(this.data.showTab != 'No'){
       this.showTab = 'Yes';
     }

  }

  ngOnInit(){

      if(this.Circle_Type == ''){
        this.GetAgentCircle(this.Agent_Id);
      }

      //Get Latitude Longitude
      this.api.getPosition().then(pos=>
      {
        this.latitude = `${pos.lat}`;
        this.longitude = `${pos.lng}`;
      });

      this.InteractionTypeArray = [{ Id: "Follow Up", Name: "Virtual" }, { Id: "Visit", Name: "Visit" }];
      this.Get();

  }


  //===== CLOSE MODAL =====//
  CloseModel(): void {
     this.dialogRef.close({
       Status: 'Model Close'
     });
  }


  //===== GET DATATABLE DATA =====//
  Get(){

  	const httpOptions = {
  		  headers: new HttpHeaders({
  			'Authorization' : 'Bearer '+this.api.GetToken()
      	})
  	};

  	const that = this;

    this.dtOptions = {
      pagingType: 'full_numbers',
	    lengthMenu: [ 10,25,50,100 ],
      pageLength: 10,
      serverSide: true,
      processing: true,
 dom: 'ilpftripl',
      ajax: (dataTablesParameters: any, callback) => {
        that.http
           .post<DataTablesResponse>(this.api.additionParmsEnc(environment.apiUrlBmsBase+'/daily-tracking-circle/CircleReports/FollowUpTrackDataNew?&User_Id='+this.api.GetUserData('Id')+'&User_Code='+this.api.GetUserData('Code')+'&Row_Id='+this.Row_Id+'&Circle_Type='+this.Circle_Type+'&Agent_Id='+this.Agent_Id+'&Portal=CRM'),dataTablesParameters,
           this.api.getHeader(environment.apiUrlBmsBase)
          ).subscribe((res:any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));

            if(resp.Status == false){

              that.dataAr = [];
              this.imageUrl = '';

            }else{
              that.dataAr = resp.data;
              this.imageUrl = resp.ImageBaseUrl;

            }
          // if(that.dataAr.length>0){
          //   that.Is_Export = 1;
          // }

        callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            data: []
          });
        });
      },

	   columnDefs: [ {
        targets: [0,1,2,3,4,5,6,7], // column index (start from 0)
        orderable: false, // set orderable false for selected columns
       }]
    };
  }


  //===== SEARCH DATATABLE DATA =====//
  SearchBtn(){

	  var fields = this.SearchForm.value;
	  var ToDate,FromDate;
	  var DateOrDateRange = fields['DateOrDateRange'];

	  if(DateOrDateRange){
		 ToDate = DateOrDateRange[0];
		 FromDate = DateOrDateRange[1];
    }

    var query = {
      Interaction_Type : fields['Interaction_Type'],
			To_Date : this.api.StandrdToDDMMYYY(ToDate),
			From_Date : this.api.StandrdToDDMMYYY(FromDate),
    }

  	this.dataAr = [];
    	this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
  		dtInstance.column(0).search(this.api.encryptText(JSON.stringify(query))).draw();
   	});

  }


  //===== CLEAR SEARCH DATA =====//
  ClearSearch(){
	 var fields = this.SearchForm.reset();
   this.SearchForm.get('Interaction_Type').setValue('');
	 this.dataAr = [];
	 this.ResetDT();
  }


  //===== RESET DATATABLE =====//
  ResetDT(){
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search('').column(0).search('').draw();
    });
  }


  //===== RELOAD DATATABLE =====//
  Reload(){
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }


  //===== GET AGENT CIRCLE LIST =====//
  GetAgentCircle(Agent_Id: any){

    const formData = new FormData();
    formData.append('Agent_Id',Agent_Id);
    formData.append('Portal','CRM');

    this.api.IsLoading();
    this.api.HttpPostTypeBms('daily-tracking-circle/CircleReports/GetAgentCircle',formData).then((result:any) => {
    this.api.HideLoading();

    if(result['Status'] == true){
       this.CircleAr = result['Data'];
       this.Circle_Type = this.CircleAr[0];
       this.activeTab = this.CircleAr[0];

       this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.search('').column(0).search('').draw();
       });
    }

    });

  }


  //==== GET DATATABLE DATA ON TAB CHANGE =====//
  GetData(CType:any, type:any){

    if(type == '1'){
      this.Circle_Type = CType;
      this.activeTab = CType;
    }

    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search('').column(0).search('').draw();
    });

  }


  //===== VIEW DOCUMENTS =====//
  ViewDocument(name){
     var url = this.imageUrl+name;
     window.open(url, "", "left=100,top=50,width=800%,height=600");
  }


 }
