import {
  Component,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { DataTableDirective } from "angular-datatables";
import { HttpHeaders, HttpClient, HttpResponse } from "@angular/common/http";
import { ApiService } from "../../providers/api.service";
import { environment } from "../../../environments/environment";
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AddPayoutReportComponent } from "../add-payout-report/add-payout-report.component";
import { PayoutDetailComponent } from "../payout-detail/payout-detail.component";

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  userRights: any;
}

@Component({
  selector: "app-payout-report",
  templateUrl: "./payout-report.component.html",
  styleUrls: ["./payout-report.component.css"],
})
export class PayoutReportComponent implements OnInit {
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;

  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;
  isSubmitted = false;
  dtOptions: DataTables.Settings = {};
  dataAr: any[] = [];
  currentUrl: string;
  ActionType: any = "";
  AddFieldForm: FormGroup;
  StatusForm: FormGroup;
  LOBdata: any[];
  product: any[];
  company: any[];
  irdia: any[];
  pro: any;
  plan: any = [];
  addLOB: number = 1;
  policyType: any[];
  planType: any[];
  subPro: any[];
  ClassN: any[];
  SubC: any[];
  RMAr: any[];
  PartnerAr: any[];
  checkBox: any[];
  SubProduct: any = [];
  SubClass: any = [];
  Class: any = [];
  payout: any[];
  comp: any;
  policy: any;
  plann: any;
  subProduct: any;
  classNa: any;
  User_Code: any;
  type: any;

  dropdownSettingsmultiselect: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };

  dropdownLOB: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  LOBAr: any = [];
  productAr: any = [];
  rights: any;

  constructor(
    public dialog: MatDialog,
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.dropdownSettingsmultiselect = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: true,
      allowSearchFilter: true,
    };

    this.dropdownLOB = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: true,
      allowSearchFilter: true,
    };

    this.AddFieldForm = this.formBuilder.group({
      LOB: [""],
      RM: [""],
      partner: [""],
      product: [""],
      subProduct: [""],
      todate: [""],
      fromdate: [""],
      payout: [""],
    });

    this.payout = [
      { Id: "Weekly", Name: "Weekly" },
      { Id: "Monthly", Name: "Monthly" },
      { Id: "Fortnight", Name: "Fortnight" },
      { Id: "Early", Name: "Early" },
    ];

    this.StatusForm = this.formBuilder.group({
      status: ["0", Validators.required],
    });
  }

  ngOnInit() {
    this.Get();
    this.GetData();
    this.getFormAr();
    // this.getCompany();
    this.currentUrl = this.router.url;
    this.type = this.api.GetUserData("Type");
    this.User_Code = this.api.GetUserData("Code");
  }

  getFormAr() {
    const formData = new FormData();
    formData.append("user_id", this.api.GetUserData("Id"));
    formData.append("User_Code", this.api.GetUserData("Code"));
    formData.append("User_Type", this.api.GetUserData("Type"));
    this.api
      .HttpPostTypeBms("../v2/PayoutModeRequest/FormComponents", formData)
      .then(
        (resp) => {
          if (resp["Data"]["RM"] != "") {
            this.RMAr = resp["Data"]["RM"].map((item) => ({
              Id: item.Id,
              Name: item.Name,
            }));
            this.getPartner(this.RMAr[0]);
          }
          this.PartnerAr = resp["Data"].Partners;
          //   //   //   console.log(this.PartnerAr);
        },
        (err) => {
          console.error("HTTP error:", err);
        }
      );
  }

  getPartner(RM: any) {
    const formData = new FormData();
    formData.append("RM", JSON.stringify(RM));
    this.api
      .HttpPostTypeBms("../v2/PayoutModeRequest/Get_Agents", formData)
      .then(
        (resp) => {
          if (resp["Status"]) {
            this.PartnerAr = resp["Data"].map((item) => ({
              Id: item.Id,
              Name: item.Name,
            }));
          }
        },
        (err) => {
          console.error("HTTP error:", err);
        }
      );
  }

  Get() {
    this.api.IsLoading();

    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.api.GetToken(),
      }),
    };

    const that = this;
    this.dtOptions = {
      pagingType: "simple_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      searching: true,
      ordering: false,
      // dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(
              environment.apiUrlBmsBase +
                "/../v2/PayoutModeRequest/GridData?User_Id=" +
                this.api.GetUserData("Id") +
                "&User_Type=" +
                this.api.GetUserType() +
                "&User_Code=" +
                this.api.GetUserData("Code")
            ),
            dataTablesParameters,
            this.api.getHeader(environment.apiUrlBmsBase)
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;
            this.rights = resp.userRights;
            this.api.HideLoading();
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
    };
  }

  Change(num: any) {
    this.addLOB = num;
    const lob = this.AddFieldForm.get("LOB");
  }

  GetData() {
    const formData = new FormData();
    formData.append("id", this.api.GetUserData("Id"));

    this.api.HttpPostTypeBms("../v2/PayoutModeRequest/getLOB", formData).then(
      (resp) => {
        if (resp["Status"] == true) {
          this.LOBdata = resp["LOB"].map((item) => ({
            Id: item.Id,
            Name: item.Id,
          }));
        }
      },
      (err) => {
        console.error("HTTP error:", err);
      }
    );
  }

  GetProducts() {
    const field = this.AddFieldForm;
    field.get("product").reset();

    const formData = new FormData();
    formData.append("lob", JSON.stringify(this.AddFieldForm.value["LOB"]));
    this.api
      .HttpPostTypeBms("../v2/PayoutModeRequest/GetProducts", formData)
      .then(
        (resp) => {
          if (resp) {
            if (resp["Status"] == true) {
              this.product = resp["product"].map((item) => ({
                Id: item.Id,
                Name: item.Name,
              }));
            }
          }
        },
        (err) => {
          console.error("HTTP error:", err);
        }
      );
  }

  GetSubProduct() {
    const formData = new FormData();
    formData.append("lob", JSON.stringify(this.AddFieldForm.value["LOB"]));
    formData.append(
      "product",
      JSON.stringify(this.AddFieldForm.value["product"])
    );
    this.api
      .HttpPostTypeBms("../v2/PayoutModeRequest/GetSubProduct", formData)
      .then(
        (resp) => {
          if (resp) {
            if (resp["Status"] == true) {
              this.SubProduct = resp["Data"].map((item) => ({
                Id: item.Id,
                Name: item.Name,
              }));
            }
          }
        },
        (err) => {
          console.error("HTTP error:", err);
        }
      );
  }

  SearchData() {
    this.isSubmitted = true;
    var field = this.AddFieldForm.value;
    if (this.AddFieldForm.valid) {
      this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.column(0).search(JSON.stringify(field)).draw();
        //this.Is_Export = 1;
      });
    }
  }

  ClearSearch() {
    this.isSubmitted = false;
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.columns().search("").draw();
    });

    this.AddFieldForm.reset();
  }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      //dtInstance.draw();
      dtInstance.page(pageinfo).draw(false);
    });
  }

  dailog() {
    const dialogRef = this.dialog.open(AddPayoutReportComponent, {
      width: "60%",
      height: "auto%",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.Reload();
    });
  }

  onSelect(Id: any) {
    const formData = new FormData();
    formData.append("formdata", JSON.stringify(this.StatusForm.value));
    formData.append("id", Id);

    this.api.HttpPostTypeBms("../v2/PayoutModeRequest/status", formData).then(
      (resp) => {
        this.api.Toast(resp["status"], resp["msg"]);
        if (resp["status"] == "Success") {
          this.Reload();
          this.StatusForm.patchValue({
            status: 0,
          });
        }
      },
      (err) => {
        console.error("HTTP error:", err);
      }
    );
  }

  view(id: any) {
    const dialogRef = this.dialog.open(PayoutDetailComponent, {
      width: "80%",
      height: "80%",
      disableClose: true,
      data: {
        id: id,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.Reload();
    });
  }
}
