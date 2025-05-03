

import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { environment } from "../../../../../environments/environment";
import { ApiService } from "../../../../providers/api.service";

import { Router, ActivatedRoute } from "@angular/router";

import {
  FormBuilder,
  FormGroup,
  // FormControl,
  // FormArray,
  // Validators,
} from "@angular/forms";

import { EditAddonComponent } from "../edit-addon/edit-addon.component";
import { AddAddonComponent } from "../add-addon/add-addon.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";


class ColumnsObj {}
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-view-addon',
  templateUrl: './view-addon.component.html',
  styleUrls: ['./view-addon.component.css']
})
export class ViewAddonComponent implements OnInit {

  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  
  SearchForm: FormGroup;

  Is_Export: any = 0;

  UserTypesView: string;
  ActionType: any = "";

  currentUrl: string;
  RequestTypesFilter: boolean;
  PageType: string = "";

  lobs: any[];
  search_insurer: { Id: string; Name: string }[];
  search_plan: { Id: string; Name: string }[];
  search_subplan: { Id: string; Name: string }[];
  search_addon: { Id: string; Name: string }[];
  insurer_code:any;


  dropdownSettingsType = {
    singleSelection: true,
    idField: "Id",
    textField: "Name",
    itemsShowLimit: 1,
    enableCheckAll: false,
    allowSearchFilter: true,
  };

  dropdownSingleSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };

  dropdownSettingsmultiselect: {};

  constructor(public api: ApiService,
      public dialog: MatDialog,
      private http: HttpClient,
      private router: Router,
      private fb: FormBuilder,
      private activatedRoute: ActivatedRoute) {
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
          
          search_addon:[""],
          SearchValue: [""],
        });

       }

  ngOnInit() {
    this.Get();
    this.FetchHealthLOB();
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
   

    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());
    formData.append("Search_Plan", e.Id);
   

    this.api.IsLoading();
    this.api
      .HttpPostType("WebsiteHealthSection/FetchHealthSubplan", formData)
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == true) {
            this.search_subplan = result["search_subplan"];
            
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

  FetchAddon(e){
    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());
    formData.append("subPlanId", e.Id);
    formData.append("tableName","ins_company_addon_master");


    this.api.IsLoading();
    this.api.HttpPostType("WebsiteHealthSection/FetchAddons", formData).then(
      (result) => {
        console.log(result);
        this.api.HideLoading();
        if (result["status"] == true) {
          this.search_addon = result["addons"];
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

      var fields = this.SearchForm.value;

      var query = {
        LOB: fields["LOB"],
        Search_Insurer: fields["Search_Insurer"],
        Search_Plan: fields["Search_Plan"],
        Search_Subplan: fields["Search_Subplan"],
        Search_addon: fields["search_addon"],
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
                  "/WebsiteHealthSection/viewAddon?User_Id=" +
                  this.api.GetUserData("Id") +
                  "&User_Type=" +
                  this.api.GetUserType() +
                  "&Url=" +
                  this.currentUrl
              ),
  
              dataTablesParameters,
              httpOptions
            )
            .subscribe((res: any) => {
              var resp = JSON.parse(this.api.decryptText(res.response));
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

  AddAddons() {
      const dialogRef = this.dialog.open(AddAddonComponent, {
        width: "50%",
        height: "50%",
        disableClose: true,
      });
  
      dialogRef.afterClosed().subscribe((result: any) => {
        this.Get();
        this.ResetDT();
      });
   }

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
        .HttpPostType("WebsiteHealthSection/UpdateActiveInactiveAddon", formData)
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


  EditRequest(Id: any, TableName: any) {
      const dialogRef = this.dialog.open(EditAddonComponent, {
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
