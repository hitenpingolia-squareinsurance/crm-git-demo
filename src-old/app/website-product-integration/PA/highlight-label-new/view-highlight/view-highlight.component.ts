import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";

import { DataTableDirective } from "angular-datatables";

import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
// import { ApiService } from "/../providers/api.service";
import { environment } from "src/environments/environment";
import { ApiService } from "../../../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { AddHighlightComponent } from "../add-highlight/add-highlight.component";
import { EditHighlightComponent } from "../edit-highlight/edit-highlight.component";

class ColumnsObj {
  Id: string;
  Claim_Id: string;
  Claim_Creator: string;
  Claim_Manager: string;
  PolicyType: string;
  LossType: string;
  Intimated_To_Insurer: string;
  Survey_Status: string;
  Add_Stamp: string;
  SrNo: string;
  Status: string;
  Ticket_Id: string;
  Completed_Timestamp: string;
  TicketType: string;
  Ticket_Creator: string;
  Ticket_Manager: string;
  Status_Data: string;
  Quotation_Id: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: "app-view-highlight",
  templateUrl: "./view-highlight.component.html",
  styleUrls: ["./view-highlight.component.css"],
})
export class ViewHighlightComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  dataUpdateAr: any[] = [];

  ActivePage: string = "Default";

  SearchForm: FormGroup;
  isSubmitted: boolean = false;
  lobs: any[];
  search_insurer: { Id: string; Name: string }[];
  search_plan: { Id: string; Name: string }[];
  search_subplan: { Id: string; Name: string }[];

  labelType: { Id: string; Name: string }[] = [
    { Id: "label", Name: "label" },
    { Id: "highlighted", Name: "highlighted" },
    { Id: "other benifits", Name: "other benifits" },
  ];
  Is_Export: any = 0;

  UserTypesView: string;
  ActionType: any = "";

  currentUrl: string;
  RequestTypesFilter: boolean;
  PageType: string = "";
  dropdownSettingsmultiselect = {};
  insurer_code: any;

  dropdownSingleSettingsType = {};

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private http: HttpClient
  ) {
    this.dropdownSingleSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.dropdownSettingsmultiselect = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: true,
      allowSearchFilter: false,
    };

    this.SearchForm = this.fb.group({
      LOB: [""],
      Search_Insurer: [""],
      Search_Plan: [""],
      Search_Subplan: [""],
      labelType: [""],
      SearchValue: [""],
    });
  }

  ngOnInit() {
    this.Get();
    this.FetchHealthLOB();
  }

  SearchData() {
    this.datatableElement.dtInstance.then((dtInstance: any) => {
      var TablesNumber = `${dtInstance.table().node().id}`;

      var fields = this.SearchForm.value;

      var query = {
        LOB: fields["LOB"],
        Search_Insurer: fields["Search_Insurer"],
        Search_Plan: fields["Search_Plan"],
        Search_Subplan: fields["Search_Subplan"],
        labelType: fields["labelType"],
        searchValue: fields["SearchValue"],
      };

      dtInstance
        .column(0)
        .search(this.api.encryptText(JSON.stringify(query)))
        .draw();
    });
  }

  ClearSearch() {
    // console.log(this.currentUrl);
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = "reload";
    this.router.navigate([currentUrl]);
  }

  //RELAOD
  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      //dtInstance.draw();
      dtInstance.page(pageinfo).draw(false);
    });
  }

  //RESET DT
  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  Get() {
    // this.token = localStorage.getItem('authToken') || '';
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.api.GetToken(),
        "Content-Type": "application/json",
      }),
    };

    const that = this;
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      // searching: false,
      // dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrl +
                "/WebsiteHealthSection/viewAllLabel?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType() +
                "&Url=" +
                this.currentUrl
            ),
            dataTablesParameters,
            this.api.getHeader(environment.apiUrl)
          )

          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            //   //   //   console.log(resp);

            that.dataAr = resp.data;

            // console.log(that.dataAr);
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

  AddLabelList() {
    const dialogRef = this.dialog.open(AddHighlightComponent, {
      width: "60%",
      height: "62%",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.Get();
      this.ResetDT();
    });
  }

  //Delete Request
  DeleteRequest(DeleteId: any, helperColumn: any) {
    var confirms = confirm("Are You Sure..!");
    if (confirms == true) {
      this.api.IsLoading();

      const formData = new FormData();

      if (helperColumn == 1) {
        formData.append("TableName", "product_labels");
      } else {
        formData.append("TableName", "int_insurance_features");
      }

      formData.append("Id", DeleteId);
      formData.append("UserId", this.api.GetUserData("Id"));
      formData.append("UserType", this.api.GetUserType());
      this.api.IsLoading();
      this.api.HttpPostType("WebsiteHealthSection/DeleteData", formData).then(
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
  //Active  inActive Code
  ActiveInactive(Id: any, Status: any, helperColumn: any) {
    var confirms = confirm("Are You Sure..!");
    if (confirms == true) {
      this.api.IsLoading();

      const formData = new FormData();

      if (helperColumn == 1) {
        formData.append("TableName", "product_labels");
      } else {
        formData.append("TableName", "int_insurance_features");
      }

      formData.append("Id", Id);

      formData.append("Status", Status);
      formData.append("UserId", this.api.GetUserData("Id"));
      formData.append("UserType", this.api.GetUserType());

      this.api.IsLoading();
      this.api
        .HttpPostType("WebsiteHealthSection/UpdateActiveInactive", formData)
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

  EditComponent(Id: any, helperColumn: any) {
    const dialogRef = this.dialog.open(EditHighlightComponent, {
      width: "60%",
      height: "62%",
      disableClose: true,
      data: { Id: Id, helperColumn: helperColumn },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.Get();
      this.ResetDT();
    });
  }

  FetchHealthLOB() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "WebsiteHealthSection/FetchHealthLOB?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType() +
          "&Url=" +
          this.currentUrl
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == true) {
            //   //   //   console.log(result["lob"], "Result");
            this.lobs = result["lob"];
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
  FetchHealthInsurer(e) {
    this.SearchForm.get("Search_Plan").setValue("");
    this.SearchForm.get("Search_Subplan").setValue("");

    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());
    formData.append("LOB", e.Name);
    formData.append("Url", this.currentUrl);

    this.api.IsLoading();
    this.api
      .HttpPostType("WebsiteHealthSection/FetchHealthInsurer", formData)
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == true) {
            // this.search_insurer = result["company"];
            this.search_insurer = result["company"].map((item, index) => ({
              Id: item.Id,
              Name: item.Code,
            }));
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
  FetchHealthPlan(e) {
    //   //   //   console.log(e.Id);

    // this.Addposter.get("Plan").setValue("");
    // this.Addposter.get("SubPlan").setValue("");

    // let companyvalue = this.Addposter.get("Company").value;
    // let companyVal = '';

    // if (companyvalue != '') {
    //   companyVal = this.Addposter.get("Company").value[0]['Id'];
    ////   //   //   console.log(companyVal);
    // }

    const selected = this.search_insurer.find((item) => item.Id === e.Id);

    this.insurer_code = selected["Code"];

    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());
    formData.append("Search_Plan", e.Id);
    // formData.append("Url", this.currentUrl);

    this.api.IsLoading();
    this.api
      .HttpPostType("WebsiteHealthSection/FetchHealthPlan", formData)
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == true) {
            this.search_plan = result["search_plan"];
            // this.SubPlans = result["SubPlans"];
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
  FetchHealthSubplan(e) {
    //   //   //   console.log(e.Id);

    // this.Addposter.get("Plan").setValue("");
    // this.Addposter.get("SubPlan").setValue("");

    // let companyvalue = this.Addposter.get("Company").value;
    // let companyVal = '';

    // if (companyvalue != '') {
    //   companyVal = this.Addposter.get("Company").value[0]['Id'];
    ////   //   //   console.log(companyVal);
    // }

    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());
    formData.append("Search_Plan", e.Id);
    // formData.append("Url", this.currentUrl);

    this.api.IsLoading();
    this.api
      .HttpPostType("WebsiteHealthSection/FetchHealthSubplan", formData)
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == true) {
            this.search_subplan = result["search_subplan"];
            // this.SubPlans = result["SubPlans"];
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
