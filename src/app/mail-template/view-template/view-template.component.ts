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
// import { AddDocsWalletComponent } from "../add-docs-wallet/add-docs-wallet.component";

import jQuery from "jquery";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

import DOMPurify from "dompurify";

class ColumnsObj {
  SrNo: string;
  Id: string;
  type: string;
  policyno: string;
  vehicleno: string;
  engineno: string;
  clientname: string;
  clientcontact: string;
  expirydate: string;
  delete_status: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  TotalFiles: number;
}

@Component({
  selector: "app-view-template",
  templateUrl: "./view-template.component.html",
  styleUrls: ["./view-template.component.css"],
})
export class ViewTemplateComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];

  loadAPI: Promise<any>;

  ActionType: any = "";

  // searchform: FormGroup;
  // isSubmitted = false;

  dtElements: any;
  SearchForm: FormGroup;
  ShowLoader12: any;
  isSubmitted = false;
  Is_Export: number;
  htmlvalue: any;

  hasAccess: boolean = true;
  errorMessage: string = '';

  constructor(
    private api: ApiService,
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    public sanitizer: DomSanitizer
  ) {
    this.SearchForm = this.formBuilder.group({
      source: [""],
      templateName: [""],
      subject: [""],
    });
  }

  ngOnInit() {
    this.Get();
  }

  ClearSearch() {
    var fields = this.SearchForm.reset();
    this.Is_Export = 0;
    this.SearchData();
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
  // SearchData(event: any) {
  //   this.Is_Export = 0;
  //   this.dataAr = [];

  //   this.datatableElement.dtInstance.then((dtInstance: any) => {
  //     var TablesNumber = `${dtInstance.table().node().id}`;

  //     if (TablesNumber == "Table1") {

  //       dtInstance.column(0).search(this.api.encryptText(JSON.stringify(event))).draw();
  //     }
  //   });
  // }

  SearchData() {
    this.datatableElement.dtInstance.then((dtInstance: any) => {
      var TablesNumber = `${dtInstance.table().node().id}`;
      if (TablesNumber == "Table1") {
        var fields = this.SearchForm.value;
        // console.log(fields);

        var query = {
          source: fields["source"],
          templatename: fields["templateName"],
          subject: fields["subject"],
        };

        dtInstance
          .column(0)
          .search(this.api.encryptText(JSON.stringify(query)))
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
                "/MailTemplates/ViewTemplate?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType()
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
            that.dataAr = resp.data;
          // .subscribe((res: any) => {
          //   var resp = JSON.parse(this.api.decryptText(res.response));
          //   that.dataAr = resp.data;

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

  // AddProductDetailsComponent(type:any , id:any) {
  //   const dialogRef = this.dialog.open(AddDocsWalletComponent, {
  //     width: "50%",
  //     height: "80%",
  //     disableClose: true,
  //     data: { type: type, id: id},
  //   });

  //   dialogRef.afterClosed().subscribe((result:any) => {
  //     this.Get();
  //     this.ResetDT();
  //   });
  // }

  //Delete REQUEST
  // DeleteRequest(DeleteId: any, status: any) {

  //   var confirms = confirm("Are You Sure..!");
  //   if (confirms == true) {
  //     this.api.IsLoading();

  //     const formData = new FormData();

  //     formData.append('Id', DeleteId);
  //     formData.append('status', status);

  //     formData.append('UserId', this.api.GetUserData("Id"));
  //     formData.append('UserType', this.api.GetUserType());

  //     this.api.IsLoading();
  //     this.api.HttpPostType('DocsWallet/DeleteStatus', formData).then((result:any) => {
  //       this.api.HideLoading();
  //       // console.log(result);

  //       if (result['status'] == true) {
  //         this.api.Toast("Warning", result["msg"]);
  //         this.ResetDT();
  //       } else {
  //         const msg = 'msg';
  //         //alert(result['message']);
  //         this.api.Toast('Warning', result['msg']);
  //       }

  //     }, (err) => {
  //       // Error log
  //       // // console.log(err);
  //       this.api.HideLoading();
  //       const newLocal = 'Warning';
  //       this.api.Toast(newLocal, 'Network Error : ' + err.name + '(' + err.statusText + ')');
  //       //this.api.ErrorMsg('Network Error :- ' + err.message);
  //     });
  //   }
  // }

  // Active Inactive REQUEST

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

  ViewMailBody(name: any) {
    let url;
    url = name;
    // console.log(url);
    var myWindow = window.open(
      url,
      "",
      "left=100,top=50,width=100%,height=600"
    );
    myWindow.document.write(url);
  }

  // ViewDocument(name: any) {
  //   let url;
  //   url = name;
  //   // console.log(url);
  //  var myWindow =  window.open(url, "", "left=100,top=50,width=800%,height=600");
  //   myWindow.document.write(url);
  // }

  HtmlFormat(v: any) {
    // this.htmlvalue = this.sanitizer.bypassSecurityTrustHtml(v);

    const sanitizedContent = DOMPurify.sanitize(v);
    this.htmlvalue = this.sanitizer.bypassSecurityTrustHtml(sanitizedContent);
    // console.log(this.htmlvalue);
  }

  PremiumBreckup(i) {
    // // console.log(i);
    //  document.getElementById("premium_break"+i).click();
    $("#premium_break" + i).toggleClass("is_visible");
  }
  PremiumBreckupClose(i) {
    $("#premium_break" + i).removeClass("is_visible");
  }
}
