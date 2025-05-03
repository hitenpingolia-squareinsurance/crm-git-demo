import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { DataTableDirective } from "angular-datatables";
import * as $ from "jquery";


declare global {
  interface JQuery {
      modal(action?: string): JQuery;
  }
}

class ColumnsObj {
  SrNo: string;
  ProductName: string;
  Quotation_Id: string;
  HealthPincode: string;
  HealthSuminsured: string;
  HealthPlan: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalFiles: number;
}

@Component({
  selector: "app-maneger-team",
  templateUrl: "./maneger-team.component.html",
  styleUrls: ["./maneger-team.component.css"],
})
export class ManegerTeamComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  loadAPI: Promise<any>;

  dtElements: any;
  SearchForm: FormGroup;
  gemsRemark: FormGroup;

  isSubmitted = false;
  Is_Export: number;
  loginid: any;
  currentUrl: string;
  selectedId: any;
  selectedStatus: any;
  selectedActionType: any;
  selectedPId: any;
  gemsRemarkForm: any;

  

  constructor(
    private api: ApiService,
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.loginid = this.api.GetUserData("Id");

    this.gemsRemarkForm = this.formBuilder.group({
      remark: ['', Validators.required]
  });

    
  }



  ngOnInit() {
    this.currentUrl = this.router.url;

    this.Get();

    
  }

  ClearSearch() {
    var fields = this.SearchForm.reset();
    this.Is_Export = 0;
  }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      //dtInstance.draw();
      dtInstance.page(pageinfo).draw(false);
    });
  }

  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  //===== SEARCH DATATABLE DATA =====//
  SearchData(event: any) {
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

  Get() {
    // alert(this.api.GetUserData("type"));
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
                "/GemsWallet/ViewWallet?User_Id=" +
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

  AcceptAssignQuote(id) {
    var Id = id;

    if (confirm("Are you sure !") == true) {
      this.api.IsLoading();
      this.api
        .HttpGetType(
          "GemsWallet/GemsAccountAccept?User_Id=" +
            this.api.GetUserData("Id") +
            "&User_Type=" +
            this.api.GetUserType() +
            "&Id=" +
            Id +
            "&Url=" +
            this.currentUrl
        )
        .then(
          (result) => {
            this.api.HideLoading();
            if (result["status"] == 1) {
              this.Reload();
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

  // ChangeStatusWallet(e: any, Id: number) {
  //   var Values = e.target.value;
  //   var Values2 = 1;
  //   if (Values == "") {
  //   } else {
  //     const dialogRef = this.dialog.open(RenewalfollowformComponent, {
  //       width: "60%",
  //       height: "60%",
  //       data: { Id: Id, Status: Values , Status2: Values2 },
  //     });

  //     dialogRef.afterClosed().subscribe((result:any) => {
  //       setTimeout(() => {
  //         this.Reload();
  //         // console.log("works");
  //       }, 500);
  //     });
  //   }
  // }


  GemsRemark(event: any, id: any, pid: any, actionType: any) {
    var Values = event.target.value;

    

    if (Values == "") {
        return;
    } else {
        // Store values in component variables (for passing data to modal)
        this.selectedId = id;
        this.selectedPId = pid;
        this.selectedStatus = Values;
        this.selectedActionType = actionType;

        // Open the modal using jQuery
        $("#remarkModal").show();
    }
  }

  get gemsRemarkFormControls() {
    return this.gemsRemarkForm.controls;
  }

  submit() {
  
    this.isSubmitted = true;
    if (this.gemsRemarkForm.invalid) {
      return;
    } else {
      var fields = this.gemsRemarkForm.value;

      const formData = new FormData();

      formData.append("user_id", this.api.GetUserData("Id"));
      formData.append("user_type", this.api.GetUserType());

      formData.append("id", this.selectedId);
      formData.append("pid", this.selectedPId);
      formData.append("status", this.selectedStatus);
      formData.append("remark", fields["remark"]);
      formData.append("ActionType", this.selectedActionType);

      // console.log(formData);

      this.api.IsLoading();
      this.api.HttpPostType("GemsWallet/GemsRemark", formData).then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);
          if (result["status"] == 1) {
            this.api.Toast("Success", result["msg"]);
            this.CloseModel();
          } else {
            const msg = "msg";
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
  CloseModel(){
    // alert(121);
    $("#remarkModal").hide();

    // ($("#remarkModal") as any).modal("hide");
  }
  
}
