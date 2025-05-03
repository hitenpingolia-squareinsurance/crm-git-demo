
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Component, OnInit, ViewChild, Inject, Optional } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { BmsapiService } from "../../providers/bmsapi.service";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DataTableDirective } from "angular-datatables";


@Component({
  selector: 'app-hold-po-report',
  templateUrl: './hold-po-report.component.html',
  styleUrls: ['./hold-po-report.component.css']
})
export class HoldPoReportComponent implements OnInit {
  Dataresult: any;
  urlSegment: string;
  remarkForm:FormGroup;

  constructor(
    public dialogRef: MatDialogRef<HoldPoReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private api: BmsapiService,
    private router: Router,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
  ) {}
  ErrorMsg: string = "Copied to clipboard.";
  dataAr: any[] = [];
  SearchString: string = "";

  RecoveryType: string = "";
  RecoveryDate: any;
  Remark: any;
  SR_No: FormGroup;

  Id: any;
  row: any = [];

  Payout_Details: any = [];
  PayoutMaster: any = [];

  User_Rights: any = [];
  Remarks: string;
  buttonHidden: { [key: string]: boolean } = {};

  OperationsEmp_Ar: any;
  AccountsEmp_Ar: any;

  Operations_User_Id: any = 0;
  Accounts_User_Id: any = 0;

  ngOnInit() {
this.urlSegment = this.router.url;

    this.SR_No = this.formBuilder.group({
      Sr_name: ["",[Validators.required]],
  });

  this.remarkForm = this.formBuilder.group({
    remark: ["",[Validators.required]],
});


  }


  

  Search() {
    const that = this;

    const fields = this.SR_No.value;
  
    var formData = new FormData();
    formData.append("User_Id", this.api.GetUserId());
    formData.append("Sr_name", fields['Sr_name']);
    var querySegment = this.urlSegment.includes('partner-wise') ? 'partner-wise' : 'sr-wise';
    this.api.IsLoading();
    this.api.HttpPostType(`/../../v3/hold-po/Partner/searchSrData?urlSegment=${querySegment}`, formData).then(
        (result) => {

          if (result["success"] == true) {
     
            that.dataAr =result["data"];
           

          } else {
            
            this.api.ErrorMsg(result["message"]);

          }
       
            this.api.HideLoading();
        },
        (err) => {
            this.api.HideLoading();
            this.api.ErrorMsg(err.message);
        }
    );
}



  updateInfo(Id: any,agent_id:any,sr_id:any) {


    const that = this;

    var fields = this.remarkForm.value;
    var formData=new FormData();
    formData.append('Id',Id);
    formData.append('agent_id',agent_id);
    formData.append('sr_id',sr_id);
    formData.append('User_Id',this.api.GetUserId());
    formData.append('remark',fields.remark);
    formData.append('Emp_Id',that.dataAr[0]['Emp_Id']);
    formData.append('SR_No',that.dataAr[0]['SR_No']);



  var querySegment = this.urlSegment.includes('partner-wise') ? 'partner-wise' : 'sr-wise';


    this.api.HttpPostType(`/../../v3/hold-po/Partner/holdData?urlSegment=${querySegment}`+"&User_Id=" +this.api.GetUserId(), formData)
      .then(
        (response) => {
          if(response['success']==true)
            this.buttonHidden[Id] = true;
          this.api.ToastMessage(response["message"]);

        },
        (error) => {
          console.error('Error', error);
        }
      );
  }


  Totast() {
    var x = document.getElementById("snackbar2");
    x.className = "show";
    setTimeout(() => {
      x.className = x.className.replace("show", "");
    }, 3000);
  }


  
  closeModel() {
    this.dialogRef.close();
    }



  
}
