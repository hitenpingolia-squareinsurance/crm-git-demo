import { Component, OnInit, ViewChild } from "@angular/core";

import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";

import { DataTableDirective } from "angular-datatables";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ManageRightsComponent } from "../../modals/manage-rights/manage-rights.component";
import { EmployeeDetailsComponent } from "../../modals/employee-details/employee-details.component";
import { SalaryEditComponent } from "../salary-edit/salary-edit.component";
import { ManageOldRightsComponent } from "../../modals/manage-old-rights/manage-old-rights.component";
import { HerirarchyUpdateComponent } from "../herirarchy-update/herirarchy-update.component";
import { AddAdvisorComponent } from "../../modals/add-advisor/add-advisor.component";
import { RightsFormPopupComponent } from "../rights-form-popup/rights-form-popup.component";
import { RmEmployeesComponent } from "../rm-employees/rm-employees.component";

class ColumnsObj {
  Sno: string;
  Id: string;
  EmployeeName: string;
  Designation: string;
  PersonalEmail: string;
  OfficialEmail: string;
  PersonalMobile: string;
  OfficialMobile: string;
  Branch: string;
  OpsBranch: string;
  Status: string;
  Action: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
class BQCDataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: "app-view-employee",
  templateUrl: "./view-employee.component.html",
  styleUrls: ["./view-employee.component.css"],
})
export class ViewEmployeeComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;
  @ViewChild("scroller1", { static: false })
  scroller1: CdkVirtualScrollViewport;

  dtOptions: DataTables.Settings = {};
  dtOptionsBQC: DataTables.Settings = {};
  dataAr: ColumnsObj[];
  bqcdata: any[];
  ActivePage: string = "Default";

  NewRights: FormGroup;
  searchForm: FormGroup;
  BQCForm: FormGroup;
  ActionType: any = "";
  ModalActionType: string = 'add';

  isSubmitted = false;
  isEditMode = false;

  dropdownSettingsSingle: any = {};
  dropdownSettingsMultiple: any = {};

  currentUrl: string;
  filterFormData: any[];
  urlSegment: string;
  urlSegmentRoot: string;
  urlSegmentSub: string;

  dataArNested: any;
  NestedPagesList: any;
  loading = false;

  post: Array<any> = [];
  responseData: any;
  pageNo: any = 1;
  loginId: any 
  
  postNested: Array<any> = [];
  responseDataNested: any;
  pageNoNested: any;
  scrollvas: number;
  AllServiceLocation: any;
  SelectedServiceLocation: any;
  Action: string;
  NewRightsEmployeeForm: FormGroup;
  isSubmitted2 = false;
  Member_id: any;
  ModelAction: any;
  dropdownSettingsType: any = {};
  bqcTypeData: { Id: string; Name: string }[];
  selectedFiles: any;
  bqcImage: any;
  bqcEmployeeId: any;
  FileName: any;
  isSubmittedbqc = false;
  minDate = false;

  hasAccess: boolean = true;
  errorMessage: string = "";
  BqcTrainingType: string = "";
  bqcTrainingTypeData: { Id: string; Name: string }[];
  WhereQuery: string | Blob;
  
  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
    private uri: ActivatedRoute,
    public dialog: MatDialog
  ) {


    this.loginId= this.api.GetUserData("Id");
    this.searchForm = this.formBuilder.group({
      SearchValue: [""],
    });

    this.NewRightsEmployeeForm = this.formBuilder.group({
      EmployeeId: ["", [Validators.required]],
      EffiectiveDate: ["", [Validators.required]],
    });

    this.NewRights = this.formBuilder.group({
      ServiceLocation: [""],
      fields: [""],
    });

    this.dropdownSettingsMultiple = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: true,
      allowSearchFilter: true,
    };

    this.dropdownSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };
    this.BQCForm = this.formBuilder.group({
      id: [""],
      bqctraining: ["", [Validators.required]],
      bqcNo: ["", [Validators.required]],
      bqcImage: ["", [Validators.required]],
      bqcValidityFrom: ["", [Validators.required]],
      bqcValidityTo: ["", [Validators.required]],
      bqcType: ["", [Validators.required]],
    });

    this.bqcTypeData = [
      { Id: "Direct Broker (General)", Name: "Direct Broker (General)" },
      { Id: "Direct Broker (Life)", Name: "Direct Broker (Life)" },
      {
        Id: "Direct Broker (General & Life)",
        Name: "Direct Broker (General & Life)",
      },
      { Id: "Composite Broker", Name: "Composite Broker" },
      { Id: "Reinsurance Broker", Name: "Reinsurance Broker" },
    ];

    this.bqcTrainingTypeData = [
      { Id: "Training", Name: "Training" },
      { Id: "BQC", Name: "BQC" },
    ];
  }

  officialEmailCopy(textElement) {
    alert("Text copied to clipboard");

    this.api.CopyText(textElement);
  }

  ngOnInit() {
    this.fetchAllEmployeeData();
    this.currentUrl = this.router.url;

    var splitted = this.currentUrl.split("/");
    if (typeof splitted[2] != "undefined") {
      this.urlSegment = splitted[2];
    }

    if (typeof splitted[1] != "undefined") {
      this.urlSegmentRoot = splitted[1];
    }

    if (typeof splitted[3] != "undefined") {
      this.urlSegmentSub = splitted[3];
    }
  }

  get formControls() {
    return this.BQCForm.controls;
  }
  //===== FETCH ALL SURVEY REQUEST DATA =====//
  fetchAllEmployeeData() {
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
      // dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrl +
                "/b-crm/Employee/fetchAllEmployeeData?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType() +
                "&url=" +
                this.currentUrl +
                "&Action=" +
                this.ActionType
            ),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));

            if (resp.status === "urlWrong") {
              that.hasAccess = false;
              that.errorMessage = resp.msg;
              return;
            }
            that.hasAccess = true;
            that.dataAr = resp.data;
            that.WhereQuery = resp.WhereQuery;
            // if (that.dataAr.length > 0) {
            // }

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
    };
  }

  //===== RESET DATATABLE =====//
  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  //===== FILTER DATA =====//
  SearchData() {
    this.datatableElement.dtInstance.then((dtInstance: any) => {
      var TablesNumber = `${dtInstance.table().node().id}`;
      if (TablesNumber == "Table1") {
        var fields = this.searchForm.value;
        var query = {
          SearchValue: fields["SearchValue"],
        };

        dtInstance
          .column(0)
          .search(this.api.encryptText(JSON.stringify(query)))
          .draw();

        // var fields = this.searchForm.value;

        // var query = {
        //   SearchValue : fields['SearchValue'],
        // }
        // dtInstance.column(0).search(JSON.stringify(query)).draw();
      }
    });
  }

  //===== CLEAR FILTER =====//
  ClearSearch() {
    var fields = this.searchForm.reset();
    this.SearchData();
  }

  // Reload() {
  //   this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //     dtInstance.draw();
  //   });
  // }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      //dtInstance.draw();
      dtInstance.page(pageinfo).draw(false);
    });
  }

  //UPDATE EMPLOYEE STATUS
  promptfn(m) {
    var msg = prompt(m, "");
    if (msg == null) {
      return "";
    }
    if (msg == "") {
      return this.promptfn(m);
    } else {
      return msg;
    }
  }

  UpdateStatusEmployee(id: any, status: any, columnName: any, primaryId: any) {
    // if(columnName == 'status'){
    var remark = "";
    if (columnName == "status") {
      remark = this.promptfn("Please Enter  Remark");

      if (remark != "") {
        if (
          remark == "ok" ||
          remark == "OK" ||
          remark == "okay" ||
          remark == "OKAY"
        ) {
          alert("Please enter vaild Reason/Remark.");
          return;
        }
      }
    }
    const formData = new FormData();
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());

    formData.append("EmployeeId", id);
    formData.append("Id", primaryId);
    formData.append("status", status);
    formData.append("colName", columnName);

    formData.append("Remark", remark);

    if (
      columnName == "status" ? remark != "" : confirm("Are you sure !") == true
    ) {
      this.api.IsLoading();
      this.api
        .HttpPostType("b-crm/Employee/UpdateStatusEmployee", formData)
        .then(
          (result: any) => {
            this.api.HideLoading();

            if (result["Status"] == true) {
              this.api.Toast("Success", result["msg"]);
              this.Reload();
            } else {
              const msg = "msg";
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

  ManageOldRights(RM_Code): void {
    const dialogRef = this.dialog.open(ManageOldRightsComponent, {
      width: "70%",
      height: "80%",

      data: { Id: RM_Code },
      //disableClose : true,
      panelClass: "rv_two",
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(result);
      //this.Reload();
    });
  }

  ManageRights(RM_Code): void {
    const dialogRef = this.dialog.open(ManageRightsComponent, {
      width: "70%",
      height: "80%",

      data: { Id: RM_Code },
      //disableClose : true,
      panelClass: "rv_two",
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(result);
      //this.Reload();
    });
  }

  EmployeeDetails(RM_Code): void {
    const dialogRef = this.dialog.open(EmployeeDetailsComponent, {
      width: "70%",
      height: "80%",

      data: { Id: RM_Code },
      //disableClose : true,
      panelClass: "rv_two",
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(result);
      //this.Reload();
    });
  }

  HerirarchyUpdateComponent(EmployeeCode: any): void {
    const dialogRef = this.dialog.open(HerirarchyUpdateComponent, {
      width: "70%",
      height: "80%",
      disableClose: true,
      data: {
        EmployeeId: EmployeeCode,
      },
      panelClass: "rv_two",
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(result);
      this.Reload();
    });
  }

  SalaryEditPoupup(
    EmployeeId: any,
    EmployeeCode: any,
    Current_CTC: any,
    Fixed_Cost: any,
    Variable_Pay: any
  ): void {
    const dialogRef = this.dialog.open(SalaryEditComponent, {
      width: "85%",
      height: "80%",
      disableClose: true,
      data: {
        EmployeeId: EmployeeId,
        EmployeeCode: EmployeeCode,
        CurrentSalary: Current_CTC,
        FixedCost: Fixed_Cost,
        VariablePay: Variable_Pay,
      },
      //disableClose : true,
      panelClass: "rv_two",
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(result);
      this.Reload();
    });
  }

  UpdateEmployeeResignation(
    id: any,
    status: any,
    columnName: any,
    primaryId: any,
    Profile: any
  ) {
    const formData = new FormData();
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());

    formData.append("EmployeeId", id);
    formData.append("Id", primaryId);
    formData.append("Status", status);
    formData.append("ColName", columnName);

    if (confirm("Are you sure !") == true) {
      this.api.IsLoading();
      this.api
        .HttpPostType("b-crm/Employee/UpdateEmployeeResignation", formData)
        .then(
          (result) => {
            this.api.HideLoading();
            if (result["status"] == true) {
              this.api.Toast("Success", result["msg"]);
              this.Reload();
            } else {
              const msg = "msg";
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

  OperationManageRightsComponent(RM_Code: string, Action: any) {
    this.postNested = [];
    this.Action = "";
    this.Action = Action;

    this.NewRights.reset();

    const formData = new FormData();
    formData.append("EmpId", RM_Code);
    formData.append("Action", this.Action);

    this.api
      .HttpPostType(
        "b-crm/Rights/ViewOperationRight?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType() +
          "&PageType=Reports" +
          "&url=" +
          this.currentUrl +
          "&Page=" +
          1,
        formData
      )
      .then(
        (result) => {
          // this.api.HideLoading();

          if (result["status"] == true) {
            this.dataArNested = result["data"];
            this.responseDataNested = result["data"];
            this.postNested = this.postNested.concat(this.responseDataNested);

            this.pageNoNested++;

            var keysNested = 1;
            this.postNested = this.postNested.map((item) => {
              item.SrNo = keysNested;
              keysNested++;
              return item;
            });

            this.GetServiceLocationData(RM_Code);

            this.scrollvas = 1;
            $(".spinner-item").css("display", "none");
          } else {
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          // this.api.HideLoading();
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );
  }

  GetServiceLocationData(RM_Code: string) {
    const formData = new FormData();

    formData.append("EmployeeId", RM_Code);
    formData.append("Action", this.Action);

    this.api.IsLoading();
    this.api.HttpPostType("b-crm/Rights/GetServiceLocationData", formData).then(
      (result) => {
        this.api.HideLoading();

        if (result["status"] == true) {
          this.AllServiceLocation = result["AllServiceLocation"];
          this.SelectedServiceLocation = result["SelectedServiceLocation"];
        } else {
          const msg = "msg";
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

  NewRightsUpdate(rows: any) {
    var fields = this.NewRights.value;
    const formData = new FormData();

    formData.append("Fields", JSON.stringify(fields));
    formData.append("RowValue", JSON.stringify(rows));
    formData.append("Action", this.Action);

    this.api.IsLoading();
    this.api.HttpPostType("b-crm/Rights/AddRight", formData).then(
      (result) => {
        this.api.HideLoading();

        if (result["status"] == true) {
          this.api.Toast("success", result["msg"]);
        } else {
          const msg = "msg";
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

  ChangeManegerRequest(
    StatusVal: any,
    ColVal: any,
    Menu_Id: any,
    EmpPrimaryId: any,
    EmpId: any
  ) {
    const formData = new FormData();

    formData.append("StatusVal", StatusVal);
    formData.append("ColVal", ColVal);
    formData.append("Menu_Id", Menu_Id);
    formData.append("EmpPrimaryId", EmpPrimaryId);

    this.api.IsLoading();
    this.api.HttpPostType("b-crm/Rights/ChangeRights", formData).then(
      (result) => {
        this.api.HideLoading();

        if (result["status"] == true) {
          this.api.Toast("success", result["msg"]);
          // this.OperationManageRightsComponent(EmpId, "");
        } else {
          const msg = "msg";
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

  get formControls2() {
    return this.NewRightsEmployeeForm.controls;
  }

  updateResignEmployee() {
    this.isSubmitted2 = true;

    if (this.NewRightsEmployeeForm.invalid) {
      return;
    } else {
      var fields = this.NewRightsEmployeeForm.value;
      const formData = new FormData();

      formData.append("EmployeeId", fields["EmployeeId"]);
      formData.append("EffectiveDate", fields["EffectiveDate"]);

      this.api.IsLoading();
      this.api.HttpPostType("b-crm/Rights/ChangeRights", formData).then(
        (result: any) => {
          this.api.HideLoading();

          if (result["status"] == true) {
            this.api.Toast("success", result["msg"]);
            // this.OperationManageRightsComponent(EmpId, "");
          } else {
            const msg = "msg";
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

  AddAdvisor(Id: any, AgentId: any, Type: any, UserType: any) {
    const dialogRef = this.dialog.open(AddAdvisorComponent, {
      width: "80%",
      height: "80%",
      disableClose: true,
      data: { Id: Id, AgentId: AgentId, Type: Type, UserType: UserType },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      this.Reload();
      this.ResetDT();
    });
  }

  ///////////yuvraj code
  businessFilterId(id: any) {
    this.Member_id = id;
  }

  //===== SEARCH DATATABLE DATA =====//
  SearchDataFilter(event: any) {
    var business_filter = "";
    this.datatableElement.dtInstance.then((dtInstance: any) => {
      var TablesNumber = `${dtInstance.table().node().id}`;
      business_filter = JSON.stringify(event);
      const formData = new FormData();
      formData.append("login_id", this.api.GetUserData("Id"));
      formData.append("login_type", this.api.GetUserType());
      formData.append("Member_id", this.Member_id);
      formData.append("business_filter", business_filter);

      // UpdateStatusEmployee
      this.api.IsLoading();
      this.api
        .HttpPostType("b-crm/Employee/businessfiltersubmit", formData)
        .then(
          (result) => {
            this.api.HideLoading();
            if (result["Status"] == true) {
              this.api.Toast("Success", result["msg"]);
              const closebutton = document.getElementById("closemodal");
              closebutton.click();
              this.Member_id = 0;
            } else {
              const msg = "msg";
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
    });
  }

  AddContacts(type: any, Id: any) {
    const dialogRef = this.dialog.open(RightsFormPopupComponent, {
      width: "80%",
      disableClose: true,
      data: { page_type: type, Id: Id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      // this.ResetDT();
    });
  }

  EmpDetails(id: any) {
    const dialogRef = this.dialog.open(RmEmployeesComponent, {
      width: "80%",
      height: "80%",
      disableClose: true,
      data: { id: id },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.ResetDT();
    });
  }

  AddBQC(EmployeeId) {
    this.isSubmittedbqc = false;
    this.BQCForm.reset();
    this.resetForm();
    this.bqcEmployeeId = EmployeeId;
    // this.bqcdata = [];

    const formData = new FormData();
    const feilds = this.BQCForm.value;
    formData.append("loginId", this.api.GetUserData("Id"));
    formData.append("loginType", this.api.GetUserType());
    formData.append("bqcEmployeeId", this.bqcEmployeeId);

    this.api.HttpPostType("b-crm/Employee/fetchBQCData", formData).then(
      (result: any) => {
        this.api.HideLoading();

        if (result.status == true) {
          if (result.data.length != 0) {
            this.bqcdata = result.data;
          } else {
            this.bqcdata = [];
          }
        } else {
          this.bqcdata = [];
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

  bqcFile(event: any) {
    this.selectedFiles = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      var str = this.selectedFiles.name;
      this.FileName = this.selectedFiles.name;
      console.log(str);
      var ar = str.split(".");
      var ext;
      for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();

      if (ext == "png" || ext == "jpeg" || ext == "jpg" || ext == "pdf") {
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);
        this.bqcImage = this.selectedFiles;
      } else {
        this.api.Toast(
          "Error",
          "Please choose vaild file ! Example :- PNG,JPEG,JPG,PDF"
        );
      }
    }
  }


  onItemSelect(item: any, Type: any) {
    //Financial Year
    if (Type == "CertificateType") {

      console.log(item);
     this.BqcTrainingType =  item.Id;
     console.log(this.BqcTrainingType);

    }
  }

  BQCFormSubmit() {
    this.isSubmittedbqc = true;
   
    if (this.BQCForm.valid) {
      const formData = new FormData();
      const feilds = this.BQCForm.value;
      formData.append("bqcId", feilds["id"]);
      formData.append("modalActionType", this.ModalActionType);
      formData.append("loginId", this.api.GetUserData("Id"));
      formData.append("loginType", this.api.GetUserType());
      formData.append("bqcNo", feilds["bqcNo"]);
      formData.append("bqcImage", this.bqcImage);
      formData.append("bqcValidityFrom", feilds["bqcValidityFrom"]);
      formData.append("bqcValidityTo", feilds["bqcValidityTo"]);
      formData.append("bqcType", JSON.stringify(feilds["bqcType"]));
      formData.append(
        "bqcCertificateType",
        JSON.stringify(feilds["bqctraining"])
      );
      formData.append("bqcEmployeeId", this.bqcEmployeeId);
      if (feilds["bqcValidityTo"] < feilds["bqcValidityFrom"]) {
        this.minDate = true;
        return;
      } else {
        this.minDate = false;
      }
      // console.log("Form Data Entries:");
      // for (let pair of (formData as any).entries()) {
      //     console.log(pair[0] + ':', pair[1]);
      // }
      // return;
      this.api.IsLoading();
      this.api.HttpPostType("b-crm/Employee/bqcData", formData).then(
        (result: any) => {
          this.api.HideLoading();
          if (result["status"] == true) {
            this.api.Toast("Success", result["msg"]);

            this.FileName = "";
            const close = document.getElementById("closeFormModelRequest");
            close.click();
            this.Reload();
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
    } else {
      console.log(this.BQCForm.controls);
      return;
    }
  }

  viewDocs(url) {
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }



  editBQC(id: number) {
    // Find the selected row data based on the passed ID
    const selectedBQC = this.bqcdata.find(item => item.id === id);
    this.FileName = "";
    
    if (selectedBQC) {
      const bqctrainingArray = [{
        Id: selectedBQC.bqcCertificateType,
        Name: selectedBQC.bqcCertificateType
      }];

     
      const bqcTypeArray = [{
        Id: selectedBQC.bqc_type, 
        Name: selectedBQC.bqc_type  
      }];
      
      this.BQCForm.patchValue({
        id: selectedBQC.id,
        bqctraining: bqctrainingArray, 
        bqcType: bqcTypeArray,
        bqcNo: selectedBQC.bqc_no,
        bqcValidityFrom: this.formatDate(selectedBQC.valid_from),
        bqcValidityTo: this.formatDate(selectedBQC.valid_to)
      });

      this.ModalActionType = 'edit';
      this.isEditMode = true;
  
      // Open the modal
      $('#AddBQC').modal('show');
      $('#AddBQC .box.box-default').css('display', 'none');


     
    }
  }
  
  // Helper function to format date correctly
  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Format to 'YYYY-MM-DD' for input[type=date]
  }

  resetForm() {
    this.BQCForm.reset();
    this.isEditMode = false;
    this.ModalActionType = 'add';
    this.FileName = "";
    $('#AddBQC .box.box-default').css('display', 'block');
  }


  ExportEmployee(){
    const formData = new FormData();
    const feilds = this.BQCForm.value;
    formData.append("loginId", this.api.GetUserData("Id"));
    formData.append("loginType", this.api.GetUserType());
    formData.append("WhereQuery", this.WhereQuery);

    this.api.HttpPostType("b-crm/Employee/ExportEmployeeGenerateExcel", formData).then(
      (result: any) => {
        this.api.HideLoading();
        if (result.status == 1) {
          
          window.open(
             result.url,
            "_blank"
          );
        } else {
          this.bqcdata = [];
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


  viewBqcDocument(filePath: string) {
    if (!filePath) {
      console.error('No file path provided');
      this.api.Toast('error', 'Document not available');
      return;
    }
  
    // Since you're already getting full S3 pre-signed URLs, use them directly
    window.open(filePath, '_blank', 'noopener,noreferrer');
  }
 
  
}
