import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { environment } from "../../../../environments/environment";
import { ApiService } from "../../../providers/api.service";
import { Injectable } from "@angular/core";
// import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";

import { Router, ActivatedRoute } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

import { AddPlanBenifitComponent } from "../add-plan-benifit/add-plan-benifit.component";

import { EditPlanBenefitComponent } from "../edit-plan-benefit/edit-plan-benefit.component";
import { get } from "http";

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
  selector: "app-view-plan-benifit",
  templateUrl: "./view-plan-benifit.component.html",
  styleUrls: ["./view-plan-benifit.component.css"],
})
@Injectable({
  providedIn: "root",
})
export class ViewPlanBenifitComponent implements OnInit {
  private apiUrl = "http://15.207.183.43:8000/health_company_plan/";

  // dtOptions: DataTables.Settings = {};
  // dataAr: any[] = [];
  // apiUrl = 'http://15.207.183.43:8000/health_company_plan/';  // API URL
  // token: string;

  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  dataUpdateAr: any[] = [];

  ActivePage: string = "Default";

  SearchForm: FormGroup;
  isSubmitted: boolean = false;
  lobs: any;
  search_insurer: { Id: string; Name: string }[];
  search_plan: { Id: string; Name: string }[];
  search_subplan: { Id: string; Name: string }[];
  Is_Export: any = 0;

  UserTypesView: string;
  ActionType: any = "";

  currentUrl: string;
  RequestTypesFilter: boolean;
  PageType: string = "";
  dropdownSettingsmultiselect = {};
  insurer_code: any;

  dropdownSingleSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  nodataimageurl: string;

  constructor(
    public api: ApiService,
    public dialog: MatDialog,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {
    this.router.events.subscribe((value) => {
      this.UserTypesView = activatedRoute.snapshot.url[0].path;

      if (this.UserTypesView == "all-tickets-assign") {
        this.ActionType = "ManageRequests";
        this.PageType = "ManageRequests";
        this.RequestTypesFilter = true;
      } else if (this.UserTypesView == "ticket") {
        this.PageType = "Reports";
      }
    });

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
      SearchValue: [""],
    });
  }

  ngOnInit(): void {
    this.currentUrl = this.router.url;
    // console.log('current url is :- ', this.currentUrl);
    this.Get();
    this.api.TargetComponent.subscribe(
      (page) => {
        if (page == "Ticket") {
          this.Reload();
        }
      },
      (err) => {}
    );
    this.FetchHealthLOB();
    // this.FetchHealthInsurer(event);
    // this.FetchHealthPlan(event);
    // this.FetchHealthSubplan(event);
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

  SearchData() {
    this.datatableElement.dtInstance.then((dtInstance: any) => {
      var TablesNumber = `${dtInstance.table().node().id}`;
      if (TablesNumber == "example2") {
        var fields = this.SearchForm.value;

        var query = {
          LOB: fields["LOB"],
          Search_Insurer: fields["Search_Insurer"],
          Search_Plan: fields["Search_Plan"],
          Search_Subplan: fields["Search_Subplan"],
          searchValue: fields["SearchValue"],
        };

        dtInstance
          .column(0)
          .search(this.api.encryptText(JSON.stringify(query)))
          .draw();
      }
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
      // dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrl +
                "/WebsiteHealthSection/ViewPlanBenifit?User_Id=" +
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

  // Get() {
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json'
  //     }),
  //   };

  //   this.dtOptions = {
  //     pagingType: 'full_numbers',
  //     pageLength: 10,
  //     serverSide: true,
  //     processing: true,
  //     ajax: (dataTablesParameters: any, callback) => {
  //    //   //   //   console.log("DataTables parameters:", dataTablesParameters);

  //       const requestPayload = dataTablesParameters;

  //       this.http.post<any>(
  //         'http://15.207.183.43:8000/health_company_plan/',
  //         requestPayload,
  //         httpOptions
  //       ).subscribe(
  //         (resp: any) => {
  //        //   //   //   console.log('Raw response:', resp);
  //           this.dataAr = resp.data;

  //           callback({
  //             recordsTotal: resp.recordsTotal,
  //             recordsFiltered: resp.recordsFiltered,
  //             data: this.dataAr
  //           });
  //         },
  //         (error) => {
  //           console.error('Error occurred:', error);
  //           callback({
  //             recordsTotal: 0,
  //             recordsFiltered: 0,
  //             data: []
  //           });
  //         }
  //       );
  //     }
  //   };
  // }

  //VIEW DOCUMENTS
  ViewDocument(url) {
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }

  //CHANGE TICKET STATUS
  ChangeStatusTicket(Current_Status, Ticket_Id, Change_Status) {
    alert(Current_Status + " " + Ticket_Id + " " + Change_Status);
  }

  //ACCEPT REQUEST
  DeleteRequest(DeleteId: any, TableName: any) {
    var confirms = confirm("Are You Sure..!");
    if (confirms == true) {
      this.api.IsLoading();

      const formData = new FormData();

      formData.append("Id", DeleteId);
      formData.append("TableName", TableName);
      formData.append("UserId", this.api.GetUserData("Id"));
      formData.append("UserType", this.api.GetUserType());

      this.api.IsLoading();
      this.api.HttpPostType("WebsiteHealthSection/DeleteData", formData).then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);

          if (result["status"] == true) {
            this.api.Toast("Success", result["msg"]);
            this.Reload();
          } else {
            const msg = "msg";
            //alert(result['message']);
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          // Error log
          // // console.log(err);
          this.api.HideLoading();
          const newLocal = "Warning";
          this.api.Toast(
            newLocal,
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
          //this.api.ErrorMsg('Network Error :- ' + err.message);
        }
      );
    }
  }
  //ACCEPT REQUEST
  ActiveInactive(Id: any, Status: any, TableName: any) {
    var confirms = confirm("Are You Sure..!");
    if (confirms == true) {
      this.api.IsLoading();

      const formData = new FormData();

      formData.append("Id", Id);
      formData.append("TableName", TableName);
      formData.append("Status", Status);
      formData.append("UserId", this.api.GetUserData("Id"));
      formData.append("UserType", this.api.GetUserType());

      this.api.IsLoading();
      this.api
        .HttpPostType("WebsiteHealthSection/UpdateActiveInactive", formData)
        .then(
          (result) => {
            this.api.HideLoading();
            // console.log(result);

            if (result["status"] == true) {
              this.api.Toast("Success", result["msg"]);
              this.Reload();
            } else {
              const msg = "msg";
              //alert(result['message']);
              this.api.Toast("Warning", result["msg"]);
            }
          },
          (err) => {
            // Error log
            // // console.log(err);
            this.api.HideLoading();
            const newLocal = "Warning";
            this.api.Toast(
              newLocal,
              "Network Error : " + err.name + "(" + err.statusText + ")"
            );
            //this.api.ErrorMsg('Network Error :- ' + err.message);
          }
        );
    }
  }

  AddPlanBenifitList() {
    const dialogRef = this.dialog.open(AddPlanBenifitComponent, {
      width: "50%",
      height: "60%",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.Get();
      this.ResetDT();
    });
  }

  ViewGetInWindowPoupup(url) {
    const url2 = url;
    window.open(
      url2,
      "",
      "right=150,left=500,top=200,bottom=200 width=700%,height=450"
    );
  }

  updateData(updatedData: any): void {
    // Update the local data array with the new values
    const index = this.dataUpdateAr.findIndex(
      (item) => item.Id === updatedData.Id
    );
    if (index > -1) {
      this.dataUpdateAr[index] = updatedData;
      // Optionally, you might want to sort or refresh your data
      // this.dataUpdateAr = [...this.dataUpdateAr]; // For example, to trigger change detection
    }

    // Optionally, send the updated data to the server
    this.api.IsLoading(); // Show loading indicator if needed

    const formData = new FormData();

    formData.append("id", updatedData.Id);
    formData.append("company", updatedData.company);
    formData.append("plan", updatedData.plan);
    formData.append("subPlan", updatedData.subPlan);

    formData.append("features", updatedData.features);
    formData.append("planBenefit", updatedData.planBenefit);
    formData.append("planBenefitDesc", updatedData.planBenefitDesc);

    this.api
      .HttpPostType("WebsiteHealthSection/UpdateHealthPlanData", formData)
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] === true) {
            this.api.Toast("Success", result["msg"]);
            this.Reload();
          } else {
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          this.api.HideLoading(); // Hide loading indicator
          this.api.Toast(
            "Warning",
            "Network Error: " + err.name + " (" + err.statusText + ")"
          );
        }
      );
  }

  EditComponent(Id: any, TableName: any) {
    const dialogRef = this.dialog.open(EditPlanBenefitComponent, {
      width: "60%",
      height: "62%",
      disableClose: true,
      data: { Id: Id, TableName: TableName },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.Get();
      this.ResetDT();
    });
  }
}
