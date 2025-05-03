import {
  Component,
  OnInit,
  ViewChild,
  QueryList,
  ViewChildren,
} from "@angular/core";

import { DataTableDirective } from "angular-datatables";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { EmployeeDetailsComponent } from "../../modals/employee-details/employee-details.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

const now = new Date();

import {
  FormGroup,
  FormBuilder,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";
import { RequestApprovalComponent } from "../request-approval/request-approval.component";

class ColumnsObj {
  SrNo: string;
  Id: string;
  LOB: string;
  Quotation_Id: string;
  Company: string;
  QuoteDetails: string;
  CreateDate: string;
  Vehicle_No: string;
  ProductName: string;
  Action: string;
  // Policy_No: string;
  // CustomerName: string;
  // CustomerMobile: string;
  // Download_Url: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: "app-view-visiting-card",
  templateUrl: "./view-visiting-card.component.html",
  styleUrls: ["./view-visiting-card.component.css"],
  styles: ["../../styles1.css"],
})
export class ViewVisitingCardComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  ActivePage: string = "Default";

  searchForm: FormGroup;
  buttonDisable = false;
  isSubmitted = false;

  ProductType: any = [];
  PolicyFileType: any = [];
  Company: any = [];

  Is_Export: any = 0;

  UserTypesView: string;
  ActionType: any = "";
  ItemLOBSelection: any = [];
  Status: any = 0;
  QidSr: any;
  $Text = "";
  minDate = new Date();
  maxDate = new Date();
  totalCount: number;
  currentUrl: string;
  AddCatForm: any;
  dropdownSingleSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  dropdownMultiSelectSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  FileTypeData: { Id: string; Name: string }[];
  TypeData: { Id: string; Name: string }[];
  UserType: { Id: string; Name: string }[];
  isSubmitted1: boolean;
  QuantityData: { Id: string; Name: string }[];
  updateQuantity: FormGroup;
  RequestViewLogData: any;
  ResponseData: any;

  hasAccess: boolean = true;
  errorMessage: string = "";

  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.searchForm = this.fb.group({
      SearchValue: [""],
    });

    this.minDate.setDate(this.minDate.getDate() - 30);

    this.dropdownSingleSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.dropdownMultiSelectSettingsType = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.QuantityData = [
      {
        Id: "100",
        Name: "100",
      },
      {
        Id: "200",
        Name: "200",
      },
      {
        Id: "300",
        Name: "300",
      },
      {
        Id: "400",
        Name: "400",
      },
      {
        Id: "500",
        Name: "500",
      },
    ];

    this.AddCatForm = this.fb.group({
      Quantity: ["", Validators.required],
      Addtion: [""],
      Remark: ["", Validators.required],
    });
  }
  get formControls2() {
    return this.AddCatForm.controls;
  }

  ngOnInit(): void {
    this.Get();
    this.currentUrl = this.router.url;
    // console.log(this.currentUrl);
  }

  // QuoteToWeb(Url) {
  //   var UserDatas = this.api.GetUserData("Id");
  //   var GetUserType = this.api.GetUserType();

  //   let a = document.createElement("a");
  //   a.target = "_blank";
  //   if (GetUserType == "employee") {
  //     a.href =
  //       this.api.ReturnWebUrl() +
  //       "/Prequotes/SetSessionEmployee/login/" +
  //       btoa(UserDatas) +
  //       "?ReturnUrl=" +
  //       Url;
  //   } else {
  //     a.href =
  //       this.api.ReturnWebUrl() +
  //       "/agents/check/" +
  //       btoa(UserDatas) +
  //       "/" +
  //       btoa(GetUserType) +
  //       "/login?ReturnUrl=" +
  //       Url;
  //   }
  //   a.click();
  // }
  QuoteToWeb(Url) {
    var UserDatas = this.api.GetUserData("Id");
    var GetUserType = this.api.GetUserType();

    let a = document.createElement("a");
    a.target = "_blank";
    if (GetUserType == "employee") {
      a.href = Url;
    } else {
      a.href = Url;
    }
    a.click();
  }

  ClearSearch() {
    var fields = this.searchForm.reset();
    this.Get();
    this.ResetDT();
  }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      dtInstance.page(pageinfo).draw(false);
    });
  }

  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  // //===== SEARCH DATATABLE DATA =====//
  // SearchData() {
  //   const fields = this.searchForm.value;
  //   // console.log(fields);
  //   this.dataAr = [];
  //   this.datatableElement.dtInstance.then((dtInstance: any) => {
  //     dtInstance
  //       .column(0)
  //       .search(this.api.encryptText(JSON.stringify(fields)))
  //       .draw();
  //   });
  // }
  //===== SEARCH DATATABLE DATA =====//

  // SearchData(event: any) {
  //   alert(121);
  //   this.Is_Export = 0;
  //   this.dataAr = [];

  //   this.datatableElement.dtInstance.then((dtInstance: any) => {
  //     var TablesNumber = `${dtInstance.table().node().id}`;

  //     if (TablesNumber == "Table1") {
  //       dtInstance
  //         .column(0)
  //         .search(this.api.encryptText(JSON.stringify(event)))
  //         .draw();
  //     }
  //   });
  // }
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

  SearchData(event: any) {
    // alert(121);
    this.Is_Export = 0;
    this.dataAr = [];

    this.datatableElement.dtInstance.then((dtInstance: any) => {
      var TablesNumber = `${dtInstance.table().node().id}`;

      if (TablesNumber == "Table1") {
        dtInstance
          .column(0)
          .search(this.api.encryptText(JSON.stringify(event)))
          .draw();
      }
    });
  }

  //===== GET DATATABLE DATA =====//
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
      // dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrl +
                "/VisitingCard/FetchdataAction?User_Id=" +
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
          .subscribe((resp: any) => {
            var resp = JSON.parse(this.api.decryptText(resp.response));
            if (resp.status === "urlWrong") {
              that.hasAccess = false;
              that.errorMessage = resp.msg;
              return;
            }
            that.hasAccess = true;
            this.buttonDisable = false;
            that.dataAr = resp.data;
            that.totalCount = resp.recordsFiltered;

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

  SubmitCat() {
    // alert();
    this.isSubmitted1 = true;
    if (this.AddCatForm.invalid) {
      return;
    } else {
      // alert();

      var fields = this.AddCatForm.value;
      const formData = new FormData();

      formData.append("Quantity", JSON.stringify(fields["Quantity"][0]["Id"]));
      formData.append("Addtion", fields["Addtion"]);
      formData.append("Remark", fields["Remark"]);
      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("User_Type", this.api.GetUserType());

      // console.log(formData);
      this.api.IsLoading();
      this.api.HttpPostType("VisitingCard/AddRequest", formData).then(
        (result) => {
          this.api.HideLoading();

          // console.log(result);

          if (result["status"] == 1) {
            this.api.Toast("Success", result["msg"]);
            this.AddCatForm.reset();
            $("#ClosePOUPUP").trigger("click");
            this.ResetDT();

            // this.CategoryData = result["Data"];
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

  FetchRequestLog(VisitingId: any, requestType: any) {
    const dialogRef = this.dialog.open(RequestApprovalComponent, {
      width: "70%",
      height: "70%",
      //disableClose : true,
      data: { Id: VisitingId, RequestType: requestType },
    });
    this.Is_Export = 0;
    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(result);
      this.ResetDT();
    });
  }

  AcceptAssignQuote(Type: any) {
    var Quotation_Id = Type;

    if (confirm("Are you sure !") == true) {
      this.api.IsLoading();
      this.api
        .HttpGetType(
          "VisitingCard/AcceptAssignQuote?User_Id=" +
            this.api.GetUserData("Id") +
            "&User_Type=" +
            this.api.GetUserType() +
            "&Quotation=" +
            Quotation_Id +
            "&url=" +
            this.currentUrl
        )
        .then(
          (result) => {
            this.api.HideLoading();
            if (result["status"] == true) {
              // this.Get();
              this.ResetDT();
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
}
