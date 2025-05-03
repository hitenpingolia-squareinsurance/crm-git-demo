import { Component, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "../../providers/api.service";
import { DataTableDirective } from "angular-datatables";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { environment } from "../../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { ItemDetailsComponent } from "../../inventory/item-details/item-details.component";
import { MatDialog } from "@angular/material/dialog";

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalFiles: number;
}
@Component({
  selector: "app-assest-action-status-view",
  templateUrl: "./assest-action-status-view.component.html",
  styleUrls: ["./assest-action-status-view.component.css"],
})
export class AssestActionStatusViewComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: any[];
  url: any;
  employee_resign: FormGroup;
  Id: any;
  LeadStatus: any;

  isSubmitted = false;
  ActionStatus: any;
  currentDate: string;
  dataArra: unknown;
  SearchForm: FormGroup;
  QuoteTypes: { Id: string; Name: string }[];
  QuoteTypeVal: { Id: string; Name: string }[];

  ItemDetails: any;
  ItemSpecifications: any;
  ItemStatus: any;
  ResponseData: any = '';
  itemModalShow = false;
  UniqueId: any = '';
  ItemName: any = '';
  ModelName: any = ''

  dropdownSettingsingleselect1: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  loginId: any;
  LeadType: any;
  constructor(
    private api: ApiService,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {
    this.dropdownSettingsingleselect1 = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.loginId = this.api.GetUserData("Id");
    const today = new Date();
    this.currentDate = today.toISOString().split("T")[0]; // Get the date in 'YYYY-MM-DD' format

    this.employee_resign = this.fb.group({
      Remark: ["", Validators.required],
      IssueType: [""],
      affectedWork: [""],
    });

    this.SearchForm = this.fb.group({
      Request_Type: [""],
      SearchValue: [""],
    });

    this.QuoteTypes = [
      { Id: "Raise Request", Name: "Raise Request" },
      { Id: "My Request", Name: "My Request" },
    ];
    
    this.QuoteTypeVal = [{ Id: "Raise Request", Name: "Raise Request" }];

    this.url = this.router.url.split("/")[2];
  }

  ngOnInit() {
    this.Get();
  }
  get FC() {
    return this.employee_resign.controls;
  }

  AcceptRequest(Id, leadStatus) {
    this.api.IsLoading();

    const formdata = new FormData();
    formdata.append("id", Id);
    formdata.append("request_status", leadStatus);

    this.api.HttpPostType("Inventory/AcceptAssestActionRequest", formdata).then(
      (result: any) => {
        this.api.HideLoading();
        if (result["status"] == 1) {
          this.api.Toast("Success", result["msg"]);
        } else {
          this.api.Toast("Warning", result["msg"]);
        }
      },
      (err) => {
        this.api.HideLoading();
        this.api.Toast(
          "Warning",
          "Network Error : " + err.name + "(" + err.statusText + ")"
        );
      }
    );
  }

  SearchData() {
    this.datatableElement.dtInstance.then((dtInstance: any) => {
      var TablesNumber = `${dtInstance.table().node().id}`;
      if (TablesNumber == "Table1") {
        var fields = this.SearchForm.value;
        var query = {
          SearchValue: fields["SearchValue"],
          Request_Type: fields["Request_Type"],
        };

        dtInstance
          .column(0)
          .search(this.api.encryptText(JSON.stringify(query)))
          .draw();
      }
    });
  }

  //===== CLEAR FILTER =====//
  ClearSearch() {
    var fields = this.SearchForm.reset();

    this.ResetDT();
  }

  ViewResignationDetails(id) {
    this.api.IsLoading();
    this.api.HttpGetType("Inventory/ViewAssestActionDetails?id=" + id).then(
      (result) => {
        this.api.HideLoading();
        // alert();
        this.dataArra = result;
      },
      (err) => {
        this.api.HideLoading();
        this.dataArra = err["error"]["text"];
        // console.log( this.dataArr);
      }
    );
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

  // GetItemDetails(ItemId) {
  //   const dialogRef = this.dialog.open(ItemDetailsComponent, {
  //     width: "70%",
  //     height: "70%",
  //     disableClose: true,
  //     data: { Id: ItemId },
  //   });

  //   dialogRef.afterClosed().subscribe((result: any) => {});
  // }


  GetItemDetails(ItemId){
    this.itemModalShow = true;
      const formData = new FormData();
      formData.append("ItemId", ItemId);
  
      this.api.IsLoading();
      this.api.HttpPostType("Inventory/ItemDetails", formData).then(
        (result : any) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.ItemDetails = result["ItemDetails"];
           if(this.ItemDetails != null && this.ItemDetails != ''){
  
              this.UniqueId = result["ItemDetails"].UniqueId;
            this.ItemName = result["ItemDetails"].ItemName;
            this.ModelName = result["ItemDetails"].ModelName;
           }
          
            
            this.ItemSpecifications = result["ItemSpecifications"];
            this.ItemStatus = result["ItemStatus"];
            this.ResponseData = result;
            
           
          } else {
            this.api.Toast("Warning", result["Message"]);
          }
        },
        (err) => {
          this.api.HideLoading();
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );
  
    }

    CloseModel() {
      this.itemModalShow = false;
     var close = document.getElementById('close_item_model');
     close.click();
    }

  Get() {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.api.GetToken(),
      }),
    };

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
              environment.apiUrl +
                "/Inventory/getAssestActionData?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType() +
                "&SectionUrl=" +
                this.url
            ),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;

            if (that.dataAr.length > 0) {
            }
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
    };
  }

  LeadData(Id: any, ActionStatus: any, LeadStatus: any, type) {
    this.Id = Id;
    this.ActionStatus = ActionStatus;
    this.LeadStatus = LeadStatus;
    this.LeadType = type;

    this.employee_resign.get("resignationDate").setValidators(null);
    this.employee_resign.get("noc_status").setValidators(null);

    if (
      this.LeadStatus == 1 &&
      this.LeadType == 2 &&
      this.ActionStatus == "Approve"
    ) {
      this.employee_resign
        .get("Action_type")
        .setValidators([Validators.required]);
      this.employee_resign
        .get("noc_status")
        .setValidators([Validators.required]);
    }

    this.employee_resign.get("resignationDate").updateValueAndValidity();
    this.employee_resign.get("noc_status").updateValueAndValidity();
  }

  EmployeeResign() {
    this.isSubmitted = true;
    this.api.IsLoading();
    if (this.employee_resign.invalid) {
      this.api.HideLoading();
      return;
    }
    const formdata = new FormData();
    const fields = this.employee_resign.value;
    formdata.append("remark", fields["Remark"]);
    formdata.append("resignationDate", fields["resignationDate"]);
    formdata.append("noc_status", fields["noc_status"]);
    formdata.append("id", this.Id);
    formdata.append("type", this.LeadType);

    if (this.ActionStatus == "Reject") {
      formdata.append("status", "0");
    }
    if (this.ActionStatus == "Approve") {
      formdata.append("status", "1");
    }

    this.api
      .HttpPostType("Inventory/ApprovalupdateAssestAction", formdata)
      .then(
        (result: any) => {
          this.api.HideLoading();
          if (result["status"] == 1) {
            this.isSubmitted = false;
        
            this.api.Toast("Success", result["msg"]);
            document.getElementById("close_pop").click();
            this.Get();
            this.ResetDT();
            this.employee_resign.reset();
          } else {
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          this.api.HideLoading();
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );
  }
}
