

import { FormGroup } from "@angular/forms";
import { Component, OnInit, ViewChild, Inject, Optional } from "@angular/core";
import { ApiService } from "../../providers/api.service";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { ChildCreationPopupComponent } from "../child-creation-popup/child-creation-popup.component";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

class DataTablesResponse {
  data: any[];
  typedata: any[];
  draw: any;
  recordsFiltered: any;
  recordsTotal: any;
  TotalFiles: any;

}
@Component({
  selector: 'app-child-creation',
  templateUrl: './child-creation.component.html',
  styleUrls: ['./child-creation.component.css']
})
export class ChildCreationComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dataAr: any;
  SearchForm: FormGroup;
  Is_Export: any;
  Masking: any = "Temp";
  LoginId: any;
  selectedCheckboxValues: any = '';
  CheckHide: any = '';
  opsFormCheck: any = '';

  constructor(
    private api: ApiService,
    private http: HttpClient,
    public dialog: MatDialog,
    @Optional() private dialogRef: MatDialogRef<ChildCreationComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

  }
  ngOnInit() {
    this.LoginId = this.api.GetUserData("Id");
    this.Get();
  }
  ShowMaskingField(i) {
    this.Masking = i;
  }
  ClearSearch() {
    this.SearchForm.reset();
    this.Is_Export = 0;
  }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  SearchData(event: any) {
    this.Is_Export = 0;
    this.dataAr = [];
    this.datatableElement.dtInstance.then((dtInstance: any) => {
      var TablesNumber = `${dtInstance.table().node().id}`;
      if (TablesNumber == "Table1") {
        dtInstance.column(0).search(this.api.encryptText(JSON.stringify(event))).draw();
      }
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
        const baseUrl = environment.apiUrl + "/Childcreation/ChildPospData?User_Id=" + this.api.GetUserData("Id") + "&User_Type=" + this.api.GetUserType();
        const params = dataTablesParameters;
        
        that.http.post<DataTablesResponse>(this.api.additionParmsEnc(baseUrl), params, this.api.getHeader(environment.apiUrl)).subscribe((res: any) => {
          var resp = JSON.parse(this.api.decryptText(res.response));

          that.dataAr = resp.data;
          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,

          });
        });

      },
    };
  }

  CopyText(inputElement) {
    this.api.CopyText(inputElement);
  }

  AddChild(id: any, Type: any, row: any) {

    // : string[] = []; 
    
    const dialogRef = this.dialog.open(ChildCreationPopupComponent, {
      width: "80%",
      height: "70%",
      disableClose: true,
      data: {
        id: id,
        type: Type,
        rows: row,
        selectedCheckboxValues: this.selectedCheckboxValues,
        opsFormCheck: this.opsFormCheck,
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.selectedCheckboxValues='';
      this.CheckHide='';
      this.Reload()
    });
  }
  ActiveInactive(Id: any, Status: any) {
    var confirms = confirm("Are You Sure..!");
    if (confirms == true) {
      this.api.IsLoading();

      const formData = new FormData();
      formData.append("Id", Id);
      formData.append("Status", Status);
      formData.append("UserId", this.api.GetUserData("Id"));
      formData.append("UserType", this.api.GetUserType());

      this.api.IsLoading();
      this.api.HttpPostType("Childcreation/UpdateActiveInactive", formData).then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == true) {
            this.api.Toast("Success", result["msg"]);
            this.Reload()
          } else {
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          this.api.HideLoading();
          const newLocal = "Warning";
          this.api.Toast(
            newLocal,
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );
    }
  }
  LeadCheckChange(leadId: any, status: any) {
    if (!Array.isArray(this.selectedCheckboxValues)) {
      this.selectedCheckboxValues = [];
    }
    const index = this.selectedCheckboxValues.findIndex(item => item.leadId == leadId);
    if (index !== -1) {
      this.selectedCheckboxValues.splice(index, 1);
    } else {
      this.selectedCheckboxValues.push({
        leadId: leadId,
        status: status
      });
    }
    if (this.selectedCheckboxValues.length == 0) {
      this.CheckHide = '';
    } else if (this.CheckHide == '') {
      this.CheckHide = status;
      this.opsFormCheck = status;
    }
  }


}


