import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
// import { environment } from "../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { ApiService } from "../../../providers/api.service";
import { trim } from "jquery";
import { environment } from "../../../../environments/environment";

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
}

@Component({
  selector: "app-view-invoice",
  templateUrl: "./view-invoice.component.html",
  styleUrls: ["./view-invoice.component.css"],
})
export class ViewInvoiceComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;
  dropdownSettingsType: any = {};
  dtOptions: DataTables.Settings = {};
  dataAr: ColumnsObj[];
  DataArr: any[];
  SearchForm: FormGroup;
  RequestData: FormGroup;
  SettleForm: FormGroup;
  ApproveForm: FormGroup;
  invoicedata: any[];

  selectedFiles: File;
  image: File;

  urlsegment: string;
  Request_type: any[];
  Default_Request: any[];
  ID: any;
  Amount: any;
  isSubmitted = false;

  pendingAmount: any;
  //  BalanceAmount : any;
  Status: any;
  StatusCheck: any;
  ApprovalStatus: any;
  Refrence_Id: any;
  Balance: any;
  userType: string | null;
  invoiceForm: FormGroup;
  utrForm: FormGroup;
  invoiceUpdateId: any;
  InvoiceDetailId: any;
  ActionId: any;
  PrimaryId: any;
  actiontype: any;
  SR_Session_Year: any;
  financialYearVal: { Id: string; Name: string }[];
  dropdownSettingsingleselect: any = {};
  maxDate = new Date();
  minDate = new Date();
  Is_Export: number = 0;
  allIds: any[];
  IDs: any;

  constructor(
    private api: ApiService,
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.dropdownSettingsingleselect = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.financialYearVal = [{ Id: "2025-26", Name: "2025-26" }];

    var Values1 = this.financialYearVal[0].Id.split("-");
    var Year1 = parseInt(Values1[0]);
    var Year2 = Year1 + 1;

    this.minDate = new Date("04-01-" + Year1);
    this.maxDate = new Date("03-31-" + Year2);

    this.invoiceForm = fb.group({
      invoiceImage: ["", Validators.required],
      hsnNo: ["", Validators.required],
      invoiceDate: ["", Validators.required],
    });

    this.utrForm = fb.group({
      utrno: ["", Validators.required],
      utrDate: ["", Validators.required],
    });

    this.urlsegment = this.router.url.split("/")["3"];

    this.dropdownSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.Request_type = [
      { Id: "Raise Request", Name: "Raise Request" },
      { Id: "My Request", Name: "My Request" },
    ];
    this.Default_Request = [{ Id: "Raise Request", Name: "Raise Request" }];

    this.RequestData = this.fb.group({
      FinancialYearr: [""],
      DateOrDateRange: [""],
      Request_type: [this.Default_Request],
      SearchVal: [""],
    });

    this.SettleForm = this.fb.group({
      Settlement_type: ["", [Validators.required]],
      Settlement_amount: ["", [Validators.required]],
    });
    this.ApproveForm = this.fb.group({
      Remark: ["", [Validators.required]],
    });
  }

  ngOnInit() {
    this.commonfilterFieldsData();
    this.Get();
    this.userType = this.api.GetUserType();
  }
  get InvoiceForm() {
    return this.invoiceForm.controls;
  }

  get UTRForm() {
    return this.utrForm.controls;
  }

  get FormC() {
    return this.SettleForm.controls;
  }

  get FormControl() {
    return this.ApproveForm.controls;
  }

  onClose() {
    document.getElementById("Close_Approve_Model").click();
    document.getElementById("Close_LogsModel").click();
  }

  ClearSearch() {
    this.dataAr = [];
    this.RequestData.reset();
    this.ResetDT();
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

  formatDate(dateString: string) {
    if (!dateString) return "";
    const date = new Date(dateString); // Parse the date
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    return `${year}-${month}-${day}`; // Return in dd/MM/yyyy format
  }

  SearchData() {
    this.dataAr = [];

    this.datatableElement.dtInstance.then((dtInstance: any) => {
      var fields = this.RequestData.value;
      var Quote_Type = fields["Request_type"];
      var Search = fields["SearchVal"];
      var FinancialYearr = fields["FinancialYearr"];
      var DateOrDateRange = fields["DateOrDateRange"];

      var ToDate, FromDate;

      if (DateOrDateRange) {
        ToDate = this.formatDate(DateOrDateRange[0]);
        FromDate = this.formatDate(DateOrDateRange[1]);
      }

      if (Quote_Type != "" && Quote_Type != null) {
        Quote_Type = fields["Request_type"][0]["Id"];
      }

      if (FinancialYearr != "" && FinancialYearr != null) {
        FinancialYearr = fields["FinancialYearr"][0]["Id"];
      }

      var query = {
        SearchValue: trim(Quote_Type),
        Search: trim(Search),
        FinancialYearr: trim(FinancialYearr),
        ToDate: trim(ToDate),
        FromDate: trim(FromDate),
      };

      var TablesNumber = `${dtInstance.table().node().id}`;

      if (TablesNumber == "kt_datatable") {
        dtInstance
          .column(0)
          .search(this.api.encryptText(JSON.stringify(query)))
          .draw();
        this.Get();
      }
    });
  }

  Get() {
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     Authorization:  this.api.GetToken(),
    //   }),
    // };

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
                "/reports/Invoice_Settlement/ViewInvoice?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType() +
                "&url_segment=" +
                this.urlsegment
            ),
            dataTablesParameters,
            this.api.getHeader(environment.apiUrl)
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));

            that.dataAr = resp.data;

            this.allIds = that.dataAr.map((item: any) => item.Id);
            //   //   //   console.log("Extracted IDs:", this.allIds);

            if (that.dataAr.length > 0) {
              that.Is_Export = 1;
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

  ViewDocument(url) {
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }

  Accept(Id: any, RequestType: string) {
    this.isSubmitted = true;

    const formdata = new FormData();

    formdata.append("Accept", RequestType);
    formdata.append("Url_segment", this.urlsegment);
    formdata.append("Id", Id);

    this.api
      .HttpPostType("reports/Invoice_Settlement/Submit_settlement", formdata)
      .then(
        (result) => {
          if (result["status"] == true) {
            this.api.Toast("Success", result["msg"]);
            this.Get();
            this.ResetDT();
          } else {
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );
  }

  Settlement(Id: any, Amount: any) {
    this.ID = Id;
    this.Balance = Amount;

    this.api
      .HttpGetType("reports/Invoice_Settlement/View_logs?RefrenceId=" + this.ID)
      .then(
        (result: any) => {
          if (result["status"] == true) {
            this.DataArr = result.data;
            //   //   //   console.log(this.DataArr);
          } else {
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );
  }

  settlement_Form() {
    this.isSubmitted = true;
    if (this.SettleForm.invalid) {
      return;
    } else {
      const Feilds = this.SettleForm.value;

      const formData = new FormData();

      // this.pendingAmount = (this.BalanceAmount - Feilds['Settlement_amount']).toFixed(2);

      // formData.append("PendingAmount", this.pendingAmount);
      formData.append("Id", this.ID);
      // formData.append('Login_type' , this.api.GetUserType());
      formData.append("Settlement_type", Feilds["Settlement_type"]);
      formData.append("Settlement_amount", Feilds["Settlement_amount"]);
      formData.append("Url_segment", this.urlsegment);

      this.api
        .HttpPostType("reports/Invoice_Settlement/Submit_settlement", formData)
        .then(
          (result: any) => {
            if (result["status"] == true) {
              this.api.Toast("Success", result["msg"]);
              document.getElementById("closemodel").click();
              this.Reload();
              this.Get();
            } else {
              this.api.Toast("Warning", result["msg"]);
            }
          },
          (err) => {
            this.api.Toast(
              "Warning",
              "Network Error : " + err.name + "(" + err.statusText + ")"
            );
          }
        );
    }
  }

  // View_logs(RefrenceId:any){

  //   this.api.HttpGetType(
  //     "reports/Invoice_Settlement/View_logs?RefrenceId="+RefrenceId
  //   )
  //   .then(
  //     (result:any) => {
  //       if(result['status'] == true){
  //         this.DataArr = result.data;
  //      //   //   //   console.log(this.DataArr);
  //       }else{
  //         this.api.Toast("Warning" , result('msg'))
  //       }
  //     },
  //     (err)  => {
  //       this.api.Toast("Warning", "Network Error : " + err.name + "(" + err.statusText + ")"
  //       );
  //     });

  // }

  GetStatus(Type: any, Refrence_Id: any) {
    this.ApprovalStatus = Type;
    this.Refrence_Id = Refrence_Id;
  }

  Approve_Form() {
    this.isSubmitted = true;

    if (this.ApproveForm.invalid) {
      return;
    } else {
      const Feilds = this.ApproveForm.value;

      const formData = new FormData();

      formData.append("Id", this.Refrence_Id);
      formData.append("Settlement_type", Feilds["Remark"]);
      formData.append("Url_segment", this.urlsegment);
      formData.append("ApprovalStatus", this.ApprovalStatus);

      this.api
        .HttpPostType("reports/Invoice_Settlement/Submit_settlement", formData)
        .then(
          (result: any) => {
            if (result["status"] == true) {
              this.api.Toast("Success", result["msg"]);
              this.onClose();
            } else {
              this.api.Toast("Warning", result["msg"]);
            }
          },
          (err) => {
            this.api.Toast(
              "Warning",
              "Network Error : " + err.name + "(" + err.statusText + ")"
            );
          }
        );
    }
  }

  UploadDocs(event, Type) {
    this.selectedFiles = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      var str = this.selectedFiles.name;
      var ar = str.split(".");
      var ext;
      for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();
      if (
        ext == "png" ||
        ext == "jpeg" ||
        ext == "jpg" ||
        ext == "pdf" ||
        ext == "webp" ||
        ext == "svg"
      ) {
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);
        if (Total_Size >= 1024 * 2) {
          this.api.Toast("Warning", "File size is greater than 2 mb");
          if (Type == "image") {
            this.invoiceForm.get("image").setValue("");
          }
        } else {
          if (Type == "image") {
            this.image = this.selectedFiles;
          }
        }
      } else {
        this.api.Toast(
          "Warning",
          "Please choose vaild file ! Example :- PNG,JPEG,JPG,PDF,WEBP,SVG,"
        );
        if (Type == "image") {
          this.invoiceForm.get("image").setValue("");
        }
      }
    }
  }

  InvoiceId(Id: any) {
    this.invoiceUpdateId = Id;
  }

  invoiceSubmit() {
    this.isSubmitted = true;

    //   //   //   console.log(this.invoiceForm.controls);
    if (this.invoiceForm.invalid) {
      return;
    } else {
      const Feilds = this.invoiceForm.value;

      const formData = new FormData();

      formData.append("login_type", this.api.GetUserType());
      formData.append("login_id", this.api.GetUserData("Id"));
      formData.append("Id", this.invoiceUpdateId);
      formData.append("invoiceimage", this.image);
      formData.append("hsnno", Feilds["hsnNo"]);
      formData.append("invoicedate", Feilds["invoiceDate"]);

      this.api
        .HttpPostType("reports/Invoice_Settlement/UploadInvoice", formData)
        .then(
          (result: any) => {
            if (result["status"] == true) {
              this.api.Toast("Success", result["msg"]);
              document.getElementById("closeDialoginvoice").click();
              this.ResetDT();
              this.invoiceForm.reset();
            } else {
              this.api.Toast("Warning", result["msg"]);
            }
          },
          (err) => {
            this.api.Toast(
              "Warning",
              "Network Error : " + err.name + "(" + err.statusText + ")"
            );
          }
        );
    }
  }

  utrSubmit() {
    this.isSubmitted = true;

    //   //   //   console.log(this.utrForm.controls);
    if (this.utrForm.invalid) {
      return;
    } else {
      const Feilds = this.utrForm.value;

      const formData = new FormData();

      formData.append("login_type", this.api.GetUserType());
      formData.append("login_id", this.api.GetUserData("Id"));
      formData.append("Id", this.invoiceUpdateId);
      formData.append("utrno", Feilds["utrno"]);
      formData.append("utrdate", Feilds["utrDate"]);

      this.api
        .HttpPostType("reports/Invoice_Settlement/UploadUTR", formData)
        .then(
          (result: any) => {
            if (result["status"] == true) {
              this.api.Toast("Success", result["msg"]);
              document.getElementById("closeDialogutr").click();
              this.ResetDT();
              this.utrForm.reset();
            } else {
              this.api.Toast("Warning", result["msg"]);
            }
          },
          (err) => {
            this.api.Toast(
              "Warning",
              "Network Error : " + err.name + "(" + err.statusText + ")"
            );
          }
        );
    }
  }

  InvoiceDetails(Id: any) {
    this.InvoiceDetailId = Id;

    this.api
      .HttpGetType(
        "reports/Invoice_Settlement/InvoiceDetail?ID=" + this.InvoiceDetailId
      )
      .then(
        (result: any) => {
          if (result["status"] == 1) {
            this.invoicedata = result.Data;
          } else {
            this.invoicedata = [];
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );
  }

  AccountAction(Id: any, Type: any) {
    if (Type == "approve") {
      var confirms = confirm("Are You Sure You want to Approve..!");
    } else {
      var confirms = confirm("Are You Sure You want to Deny..!");
    }
    if (confirms == true) {
      this.ActionId = Id;
      // this.PrimaryId = PrimaryId;
      this.actiontype = Type;

      const formData = new FormData();

      formData.append("login_type", this.api.GetUserType());
      formData.append("login_id", this.api.GetUserData("Id"));
      formData.append("Id", this.ActionId);
      // formData.append('primaryid' , this.PrimaryId);
      formData.append("actiontype", this.actiontype);

      this.api
        .HttpPostType("reports/Invoice_Settlement/ApprovalStatus", formData)
        .then(
          (result: any) => {
            if (result["status"] == true) {
              this.api.Toast("Success", result["msg"]);
              this.ResetDT();
              this.SearchData();
            } else {
              this.api.Toast("Warning", result["msg"]);
            }
          },
          (err) => {
            this.api.Toast(
              "Warning",
              "Network Error : " + err.name + "(" + err.statusText + ")"
            );
          }
        );
    }
  }

  commonfilterFieldsData() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "b-crm/Filter/commonfilterFieldsData?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType() +
          "&portal=Square&empType=" +
          "&EmpId=" +
          this.api.GetUserData("Code")
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            // console.log(result);
            this.SR_Session_Year = result["Data"]["SR_Session_Year"];
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

  onItemSelect(item: any, Type: any) {
    //Financial Year
    if (Type == "FinancialYear") {
      var Years = item.Id;
      var Explods = Years.split("-");
      var Year1 = parseInt(Explods[0]);
      var Year2 = Year1 + 1;

      this.minDate = new Date("04-01-" + Year1);

      this.maxDate = new Date("03-31-" + Year2);

      this.RequestData.get("DateOrDateRange").setValue("");
    }
  }

  ExportSettlementExcel() {
    this.IDs = this.allIds;

    const formData = new FormData();

    formData.append("User_Id", this.api.GetUserId());

    formData.append("Ids", this.IDs);

    this.api.IsLoading();
    this.api
      .HttpPostType(
        "reports/Invoice_Settlement/GenerateSettlementReportExcel",
        formData
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == true) {
            this.api.Toast("Success", result["msg"]);

            window.open(result["DownloadUrl"]);
          } else {
            //alert(result['Message']);
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          this.api.HideLoading();
          // console.log(err.message);
          this.api.Toast("Warning", err.message);
        }
      );
  }
}
