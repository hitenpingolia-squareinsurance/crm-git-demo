import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { HttpClient, HttpResponse,HttpHeaders } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../../../providers/api.service';
import { Router } from  '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog,MatDialogConfig } from '@angular/material/dialog';

import { FormBuilder, FormGroup,Validators } from  '@angular/forms';
import { AddNewMemberHealthComponent } from '../../../modals/health-sr/add-new-member-health/add-new-member-health.component';
import { DeleteMemberHealthComponent } from '../../../modals/health-sr/delete-member-health/delete-member-health.component';
import { BulkUploadExcelHealthComponent } from '../../../modals/health-sr/bulk-upload-excel-health/bulk-upload-excel-health.component';
import { EditMemberHealthComponent } from '../../../modals/health-sr/edit-member-health/edit-member-health.component';

class ColumnsObj {
  SNo: string;
  isSelected: any;
  Id: string;
  REID: string;
  Employee_Code: any;
  Name: any;
  DOJ: any;
  DOB: any;
  Gender: string;
  Age: string;
  Designation: string;
  CTC: string;
  Sum_Assured: any;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  PostingCountAr: any;
  SQL_Where: any;
  NetPremium: any;
}

@Component({
  selector: 'app-group-sr-members-health',
  templateUrl: './group-sr-members-health.component.html',
  styleUrls: ['./group-sr-members-health.component.css']
})
export class GroupSrMembersHealthComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  datatableElement: DataTableDirective;

 dtOptions: DataTables.Settings = {};
 dataAr: ColumnsObj[];

  UserId :number= this.api.GetUserData('Id');

  SearchForm:FormGroup;
  isSubmitted  = false;
  masterSelected:boolean;
  checkedList:any=[];

  SR_Id: any = 0;
  NetPremium: any = 0;
  Is_Export:any = 0;
  DownloadUrl:any = "https://api.policyonweb.com/API/uploads/health-group-sr/sample/MemberDetailsFormat.xlsx";
  DownloadUrl1:any;
  Is_Download: any = 0;
  ShowDeleteButton: any = 'No';

  constructor(public dialogRef: MatDialogRef<GroupSrMembersHealthComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public api : ApiService, private http: HttpClient, public dialog: MatDialog, private router: Router,private fb: FormBuilder) {

    this.SearchForm = this.fb.group({
      GlobalSearch: [''],
    });

  }

  ngOnInit(): void {
    this.SR_Id = this.data.Id;
	  this.Get();
  }


	//===== FORM CONTROLS VALIDATION =====//
  get FC() {
		var fields = this.SearchForm.value;
		return this.SearchForm.controls;
	}


  //===== CLOSE MODEL =====//
  CloseModel(): void {
    this.dialogRef.close({
      Status: 'Model Close'
    });
  }


  //===== SEARCH DATATABLE DATA =====//
  SearchBtn(){

	 this.isSubmitted = true;
    if(this.SearchForm.invalid){
      return;
    }else{
	  var fields = this.SearchForm.value;

	 var query = {
		  User_Id : this.api.GetUserData('Id'),
		  User_Type : this.api.GetUserType(),

		  Vertical_Id : fields['Vertical_Id'],
		  GlobalSearch : fields['GlobalSearch'],

	  }

  	this.Is_Export = 0;
  	this.dataAr = [];
  	this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
  		dtInstance.column(0).search(this.api.encryptText(JSON.stringify(query))).draw();
  		this.Is_Export = 0;
  	});
  	}

  }


  //===== CLEAR SEARCH FORM =====//
  ClearSearch(){

	 var fields = this.SearchForm.reset();
   this.dataAr = [];
   this.ResetDT();

   this.Is_Export = 0;

  }


  //===== RELOAD PAGE =====//
  Reload(){

		this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
			var pageinfo = dtInstance.page.info().page;
			dtInstance.page(pageinfo).draw(false);
		});
  }


  //===== RESET DATATABLE =====//
  ResetDT(){
		this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
			dtInstance.search('').column(0).search('').draw();
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
           .post<DataTablesResponse>(environment.apiUrlBms+'/HealthGroup/GridData?&User_Id='+this.api.GetUserData('Id')+'&User_Code='+this.api.GetUserData('Code')+'&User_Type='+this.api.GetUserType()+'&SR_Id='+this.SR_Id,dataTablesParameters, httpOptions
          ).subscribe(resp => {
            that.dataAr = resp.data;
            that.NetPremium = resp.NetPremium;

        if(that.dataAr.length>0){
          that.Is_Export = 1;
        }

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


  //===== ADD NEW EMPLOYEE DATA =====//
  ExportData(){

		const formData = new FormData();

		formData.append('SR_Id',this.SR_Id);
		formData.append('User_Code',this.api.GetUserData('Code'));

		this.api.IsLoading();
		this.api.HttpForSR('post','ExportData/Prepare_Excel_Health',formData).then((result:any) => {
		this.api.HideLoading();

			if(result['Status'] == true){
        this.Is_Download=1;
				this.DownloadUrl1 = result['DownloadUrl'];
        this.ClickToDownload();
			}else{
				this.api.Toast('Error',result['Message']);
			}

		}, (err) => {
		  this.api.HideLoading();
		  this.api.Toast('Warning','Network Error, Please try again ! ');
		});

  }


  ClickToDownload(){
	  window.open(this.DownloadUrl1);
  }


  //===== ADD NEW MEMBER =====//
  AddNewMember(): void {

		const dialogRef = this.dialog.open(AddNewMemberHealthComponent, {
		  width: '55%',
		  height:'65%',
		  data: {SR_Id : this.SR_Id, NetPremium : this.NetPremium}
		});

		dialogRef.afterClosed().subscribe(result => {
      this.Reload();
		});

  }


  //===== BULK UPLOAD MEMBER =====//
  UploadBulkExcelComponent(): void {

		const dialogRef = this.dialog.open(BulkUploadExcelHealthComponent, {
		  width: '33%',
		  height:'60%',
		  data: {SR_Id : this.SR_Id, NetPremium : this.NetPremium}
		});

		dialogRef.afterClosed().subscribe(result => {
      this.Reload();
		});

  }


  //===== DELETE MEMBER =====//
  DeleteMember(): void {

		const dialogRef = this.dialog.open(DeleteMemberHealthComponent, {
		  width: '30%',
		  height:'40%',
		  data: {SR_Id : this.SR_Id, Row_Ids : JSON.stringify(this.checkedList), NetPremium : this.NetPremium}
		});

		dialogRef.afterClosed().subscribe(result => {
      this.checkedList = [];
      this.Reload();
		});

  }


  //===== EDIT MEMBER DETAILS =====//
  EditMemberDetails(Row_Id:any): void {

		const dialogRef = this.dialog.open(EditMemberHealthComponent, {
      width: '55%',
		  height:'65%',
		  data: {Row_Id : Row_Id, SR_Id : this.SR_Id, NetPremium : this.NetPremium}
		});

		dialogRef.afterClosed().subscribe(result => {
      this.Reload();
		});

  }


  //===== DOWNLOAD SAMPLE EXCEL =====//
	DownloadSampleExcel(){
		window.open(this.DownloadUrl);
	}


  //===== CHECK UNCHECK ALL =====//
  checkUncheckAll() {
    for (var i = 0; i < this.dataAr.length; i++) {
      this.dataAr[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemList();
  }


  //===== CHECK SELECTED =====//
  isAllSelected() {
    this.masterSelected = this.dataAr.every(function(item:any) {
        return item.isSelected == true;
      })
    this.getCheckedItemList();
  }


  //===== GET CHECKED ITEM =====//
  getCheckedItemList(){
    this.checkedList = [];
    for (var i = 0; i < this.dataAr.length; i++) {
      if(this.dataAr[i].isSelected){
	  	this.checkedList.push({Id:this.dataAr[i].Id});
	   }
    }
    //this.checkedList = JSON.stringify(this.checkedList);
    if(this.checkedList.length > 0){
      this.ShowDeleteButton = 'Yes';
    }else{
      this.ShowDeleteButton = 'No';
    }

    this.checkedList = this.checkedList;
  }

}
