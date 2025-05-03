import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

import { Router, ActivatedRoute } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";

import { PrimerejectdetailspopupComponent } from "../../modals/primerejectdetailspopup/primerejectdetailspopup.component";
import { AddprimerequestpopupComponent } from "../../modals/addprimerequestpopup/addprimerequestpopup.component";

class ColumnsObj {
  SrNo: string;
  Id: string;
  Mobile: string;
  Creator: string;
  Manager: string;
  Add_Stamp: string;
  Intimated_To_Insurer: string;
  Assigner_Id: any;
  Status: any;
}
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: "app-managerequests",
  templateUrl: "./managerequests.component.html",
  styleUrls: ["./managerequests.component.css"],
})
export class ManagerequestsComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  ActivePage: string = "Default";

  SearchForm: FormGroup;
  isSubmitted = false;

  dropdownSettings: any = {};

  Company_Ar: any = [];
  PolicyType_Ar: any = [];
  TicketType_Ar: any = [];
  TicketStatus_Ar: any = [];

  Is_Export: any = 0;

  UserTypesView: string;
  ActionType: any = "";
  QuoteTypes: { Id: string; Name: string }[];
  dropdownSettings1: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    //selectAllText: 'Select All',
    //unSelectAllText: 'UnSelect All',
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };

  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.router.events.subscribe((value) => {
      this.UserTypesView = activatedRoute.snapshot.url[0].path;

      if (this.UserTypesView == "view-manage-request-manager") {
        this.ActionType = "ManageRequests";
      }
    });

    this.QuoteTypes = [
      { Id: "Raise Request", Name: "Raise Request" },
      { Id: "My Request", Name: "My Request" },
    ];

    this.SearchForm = this.fb.group({
      Ticket_Status: [""],
      RequestType: ["", [Validators.required]],

      DateOrDateRange: [""],
      SearchValue: [""],
    });
    this.SearchForm.get("RequestType").setValue([
      { Id: "Raise Request", Name: "Raise Request" },
    ]);

    this.dropdownSettings = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };
    this.dropdownSettings1 = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };
  }

  ngOnInit(): void {
    this.Get();
    this.FilterData();

    this.api.TargetComponent.subscribe(
      (page) => {
        // console.log(page)
        if (page == "subpos-view" || page == "subpos-view-user") {
          this.Reload();
        }
      },
      (err) => {}
    );
  }

  FilterData() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "Subpos/FilterData?Page=Claim&User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType()
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.TicketStatus_Ar = result["TicketStatus_Ar"];
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

  onItemSelect(item: any, type) {}
  onItemDeSelect(item: any, type) {}

  get formControls() {
    return this.SearchForm.controls;
  }

  SearchBtn() {
    this.isSubmitted = true;
    if (this.SearchForm.invalid) {
      return;
    } else {
      var fields = this.SearchForm.value;

      var DateOrDateRange = fields["DateOrDateRange"];
      var ToDate, FromDate;
      if (DateOrDateRange) {
        ToDate = DateOrDateRange[0];
        FromDate = DateOrDateRange[1];
      }

      var query = {
        User_Id: this.api.GetUserData("Id"),
        User_Type: this.api.GetUserType(),
        RequestType: fields["RequestType"],
        Status: fields["Ticket_Status"],
        To_Date: ToDate,
        From_Date: FromDate,
        SearchValue: fields["SearchValue"],
      };

      this.Is_Export = 0;
      this.dataAr = [];
      this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance
          .column(0)
          .search(this.api.encryptText(JSON.stringify(query)))
          .draw();
        //this.Is_Export = 1;
      });
    }
  }

  ClearSearch() {
    var fields = this.SearchForm.reset();

    this.dataAr = [];
    this.ResetDT();

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
      dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrl +
                "/PrimeAgent/ViewDatas?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType() +
                "&Action=" +
                this.ActionType
            ),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;

            if (that.dataAr.length > 0) {
              //that.Is_Export = 1;
            }

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
      //columns: [
      //		{ data: 'Id' },
      //		{ data: 'Type' }

      //]
    };
  }

  ViewDocument(url) {
    //alert(url);
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }
  AcceptRequest(Id: number) {
    var confirms = confirm("Are You Sure..!");
    if (confirms == true) {
      this.api.IsLoading();
      this.api
        .HttpGetType(
          "PrimeAgent/UpdateAcceptManger?Ids=" +
            Id +
            "&User_Id=" +
            this.api.GetUserData("Id") +
            "&User_Type=" +
            this.api.GetUserType()
        )
        .then(
          (result) => {
            this.api.HideLoading();
            if (result["Status"] == true) {
              this.api.Toast("Success", result["Message"]);
              this.ResetDT();
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
  }

  ChangeRequest(e: any, Id: number) {
    var Status = e.target.value;

    if (Status == 3) {
      var confirms = confirm("Are You Sure..!");
      if (confirms == true) {
        this.api.IsLoading();
        this.api
          .HttpGetType(
            "PrimeAgent/UpdateActionProcessManger?Ids=" +
              Id +
              "&User_Id=" +
              this.api.GetUserData("Id") +
              "&User_Type=" +
              this.api.GetUserType() +
              "&Status=" +
              Status
          )
          .then(
            (result) => {
              this.api.HideLoading();
              if (result["Status"] == true) {
                this.api.Toast("Success", result["Message"]);
                this.ResetDT();
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
    } else if (Status == 2) {
      const dialogRef = this.dialog.open(PrimerejectdetailspopupComponent, {
        width: "60%",
        height: "60%",
        data: { Status: Status, Id: Id },
      });

      dialogRef.afterClosed().subscribe((result: any) => {
        this.Reload();
      });
    }
  }

  AddPrimeRequest(Id: number) {
    const dialogRef = this.dialog.open(AddprimerequestpopupComponent, {
      width: "60%",
      height: "60%",
      data: { Id: Id },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.Reload();
    });
  }

  ShowRejectDetails(Id: number) {
    const dialogRef = this.dialog.open(PrimerejectdetailspopupComponent, {
      width: "30%",
      height: "30%",
      data: { Status: "fixed", Id: Id },
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }
}
