import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { environment } from "../../../environments/environment";
import { BmsapiService } from "../../providers/bmsapi.service";
import { Router } from "@angular/router";
import swal from "sweetalert";
import { MatDialog, MatDialogRef,MatDialogConfig } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AbstractControl, ValidationErrors } from '@angular/forms';

function noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
  const isWhitespace = (control.value || '').trim().length === 0;
  const isValid = !isWhitespace;
  return isValid ? null : { whitespace: true };
}

class ColumnsObj {
  Id: string;
  SR_No: string;
  Full_SR_No: string;
  LOB_Name: string;
  File_Type: string;
  Customer_Name: string;
  Registration_No: string;
  Policy_No: string;
  Engine_No: string;
  Chasis_No: string;
  RM_Name: string;
  Estimated_Gross_Premium: string;
  Add_Stamp: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-sr-hold-report',
  templateUrl: './sr-hold-report.component.html',
  styleUrls: ['./sr-hold-report.component.css']
})

export class SrHoldReportComponent implements OnInit {

  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;
  @ViewChild('changeHoldStatus', { static: false }) changeHoldStatus!: TemplateRef<any>;
  dialogRef!: MatDialogRef<any>;
  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];
  SearchString: string = "";
  FetchSrRow:any;
  Payout_Details:any;
  PayoutMaster:any;
  Documents:any;
  Base_Url:any;
  SRHoldStatusForm: FormGroup;
  isSubmitted:boolean=false;
  constructor(
    public api: BmsapiService,
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.SRHoldStatusForm = this.formBuilder.group({
      Remark: ["", [Validators.required, noWhitespaceValidator]],
    });
    this.Get();
  }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  Get() {
    const that = this;

    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrlBmsBase +
                "/sr/HoldSr/GridData?User_Id=" +
                this.api.GetUserId() +
                "&source=crm"
            ),
            dataTablesParameters,
            this.api.getHeader(environment.apiUrlBmsBase)
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;
            console.log("that.dataAr",that.dataAr);
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
      columns: [
        { data: "Id" },
        { data: "SR_No" },
        { data: "LOB_Name" },
        { data: "File_Type" },
        { data: "Customer_Name" },
        { data: "RM_Name" },
        { data: "Estimated_Gross_Premium" },
        { data: "Add_Stamp" },
      ],
    };
  }


  openHoldSRModal(): void {
    this.dialogRef = this.dialog.open(this.changeHoldStatus, {
      width: '75%',
      // height: '70%',
      disableClose: true, 
    });
    this.dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed with result:', result);
    });
  }

  
  closeStatusModel(): void {
    if (this.dialogRef) {
      this.isSubmitted = false;
      this.SearchString = "";
      this.FetchSrRow = '';
      this.Payout_Details = '';
      this.PayoutMaster = '';
      this.Documents = '';
      this.Base_Url = '';
      this.SRHoldStatusForm.reset();
      this.dialogRef.close();
      this.Reload();
    }
  }


  SearchSrRecord() {
    if (this.SearchString == "") {
      this.api.ErrorMsg("Please Enter SR NO/Reg No !");
    } else {
      this.api.IsLoading();
      this.api.Call("sr/EditSR/ViewById?Type=HoldSR&Id=" +
          this.SearchString +
          "&User_Id=" +
          this.api.GetUserId()
      ).then(
          (result) => {
            this.api.HideLoading();
            if (result["Status"] == true) {
              this.FetchSrRow = result["Data"];
              this.Payout_Details = result["Payout_Details"];
              this.PayoutMaster = result["PayoutMaster"];
              this.Documents = result["Documents"];
              this.Base_Url = result["Base_Url"] + this.FetchSrRow['Id'] + "/";
            } else {
              this.api.ErrorMsg(result["Message"]);
              this.FetchSrRow ='';
              this.Payout_Details = '';
              this.PayoutMaster = '';
              this.Documents = '';
              this.Base_Url = '';
              this.SRHoldStatusForm.reset();
            }
          },
          (err) => {
            this.api.HideLoading();
            this.api.ErrorMsg(err.message);
          }
        );
    }
  }

  ViewDocument(name) {
    let url;
    if (this.FetchSrRow.Source == "Web") {
      url = name;
    } else {
      url = this.Base_Url + name;
    }
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }

  SubmitSrHold() {
    this.isSubmitted = true;
    if (this.SRHoldStatusForm.invalid) {
      return;
    } else {
      var fields = this.SRHoldStatusForm.value;
      const formData = new FormData();
      formData.append("User_Id", this.api.GetUserId());
      formData.append("SR_Id", this.FetchSrRow.Id);
      formData.append("Remark", fields["Remark"]);
      formData.append("Type",'hold');
      this.api.IsLoading();
      this.api.HttpPostType("sr/HoldSr/HoldSR_Status_Update", formData).then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.api.ToastMessage(result["Message"]);
            this.closeStatusModel();
          } else {
            this.api.ErrorMsg(result["Message"]);
          }
        },
        (err) => {
          this.api.HideLoading();
          this.api.ErrorMsg(err.message);
        }
      );
    }
  }


  async unHoldSR(SrId,fullSRNo) {

    console.log("fullSRNo",fullSRNo)
    let remark = '';
    while (!remark.trim()) {
        remark = prompt('Please enter a remark (this field is required):');
        if (!remark.trim()) {
            alert('Remark cannot be empty. Please provide a valid remark.');
        }
    }

    // Using template literal to insert the SR number dynamically
    const isConfirmed = await swal({
        title: "Confirmation Required",
        text: `Are you sure you want to unhold this SR No: ${fullSRNo} ?`,
        icon: "warning",
        buttons: ["Cancel", "Confirm"],
    });

    if (!isConfirmed) {
        return; // Exit if the user cancels
    }

    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserId());
    formData.append("SR_Id", SrId);
    formData.append("Remark",remark);
    formData.append("Type",'un-hold');
    this.api.IsLoading();
    this.api.HttpPostType("sr/HoldSr/HoldSR_Status_Update", formData).then(
      (result) => {
        this.api.HideLoading();
        if (result["Status"] == true) {
          this.api.ToastMessage(result["Message"]);
          this.Reload();
        } else {
          this.api.ErrorMsg(result["Message"]);
        }
      },
      (err) => {
        this.api.HideLoading();
        this.api.ErrorMsg(err.message);
      }
    );


}


  
  
  
}
