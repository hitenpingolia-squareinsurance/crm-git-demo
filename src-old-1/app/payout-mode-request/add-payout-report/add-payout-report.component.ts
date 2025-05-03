import {
  Component,
  OnInit,
  ViewChild,
  QueryList,
  ViewChildren,
  Inject,
} from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from "@angular/material/dialog";
import { DataTableDirective } from "angular-datatables";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { ApiService } from "src/app/providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";

import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";
import { PayoutReportComponent } from "../payout-report/payout-report.component";

@Component({
  selector: "app-add-payout-report",
  templateUrl: "./add-payout-report.component.html",
  styleUrls: ["./add-payout-report.component.css"],
})
export class AddPayoutReportComponent implements OnInit {
  AddFieldForm: FormGroup;
  LOBdata: any[];
  product: any[];
  company: any[];
  RMAr: any[];
  PartnerAr: any[];
  payout: any[];
  Source: any = 0;

  policyType: any[];
  planType: any[];
  minDate: Date = new Date();
  minDate1: Date = new Date();
  maxDate: Date = new Date();
  isSubmitted = false;
  User_Id: string;
  SR_Id: string;
  SubProduct: any = [];
  SubClass: any = [];
  Class: any = [];

  dropdownSettingsmultiselect: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };

  dropdownSettings: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  type: any;
  User_Code: any;
  partners: [];
  defaultDate: Date;

  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private route: ActivatedRoute,

    private dialogRef: MatDialogRef<PayoutReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);
    this.defaultDate = currentDate;

    //currentDate.setDate(currentDate.getDate() + 1);
    // this.minDate = new Date(`${currentDate.getMonth() + 1}-${currentDate.getDate()+1}-${currentDate.getFullYear()}`);

    // console.log(currentDate.setDate(currentDate.getDate() + 1));

    this.dropdownSettingsmultiselect = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: true,
      allowSearchFilter: true,
    };
    this.dropdownSettings = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.payout = [
      { Id: "Weekly", Name: "Weekly" },
      { Id: "Monthly", Name: "Monthly" },
      { Id: "Fortnight", Name: "Fortnight" },
      { Id: "Early", Name: "Early" },
    ];

    this.AddFieldForm = this.formBuilder.group({
      LOB: ["", [Validators.required]],
      RM: [""],
      partner: [""],
      product: ["", [Validators.required]],
      // policyType: ['', [Validators.required]],
      // planType: ['', [Validators.required]],
      subProduct: ["", [Validators.required]],
      // class: ['', [Validators.required]],
      // subclass: ['', [Validators.required]],
      todate: [""],
      fromdate: [this.defaultDate, [Validators.required]],
      // fromdate: ['',[Validators.required]],
      // remark: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      payout: ["", [Validators.required]],
    });
  }

  ngOnInit() {
    this.GetData();
    this.getFormAr();
    // this.dateEven(new Date());
    this.type = this.api.GetUserData("Type");
    this.User_Code = this.api.GetUserData("Code");

    const partner = this.AddFieldForm.get("partner");
    const RM = this.AddFieldForm.get("RM");

    if (this.type == "agent") {
      partner.setValidators(null);
      RM.setValidators(null);
    } else if (this.User_Code == "SIB282") {
      partner.setValidators(Validators.required);
      RM.setValidators(Validators.required);
    }
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

  GetData() {
    const formData = new FormData();
    formData.append("id", "0");

    this.api.HttpPostTypeBms("../v2/PayoutModeRequest/getLOB", formData).then(
      (resp) => {
        this.LOBdata = resp["LOB"].map((item) => ({
          Id: item.Id,
          Name: item.Id,
        }));
        this.AddFieldForm.patchValue({
          LOB: this.LOBdata,
        });
        this.GetProducts();
      },
      (err) => {
        console.error("HTTP error:", err);
      }
    );
  }

  formReset() {
    this.AddFieldForm.reset();
  }

  GetProducts() {
    const field = this.AddFieldForm;
    field.get("product").reset();
    // field.get('policyType').reset();
    // field.get('planType').reset();
    field.get("subProduct").reset();
    // field.get('class').reset();
    // field.get('subclass').reset();

    const formData = new FormData();
    formData.append("lob", JSON.stringify(this.AddFieldForm.value["LOB"]));
    this.api
      .HttpPostTypeBms("../v2/PayoutModeRequest/GetProducts", formData)
      .then(
        (resp) => {
          if (resp) {
            if (resp["Status"] == true) {
              this.product = resp["product"];
              this.AddFieldForm.patchValue({
                product: this.product,
              });
              this.GetSubProduct();
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
    formData.append(
      "policyType",
      JSON.stringify(this.AddFieldForm.value["policyType"])
    );
    formData.append(
      "planType",
      JSON.stringify(this.AddFieldForm.value["planType"])
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
              this.AddFieldForm.patchValue({
                subProduct: this.SubProduct,
              });
            }
          }
        },
        (err) => {
          console.error("HTTP error:", err);
        }
      );
  }

  onClose() {
    document.getElementById("click-close").click();
  }

  SubBtn() {
    //   const currentDate = new Date();
    //  const newdate =  currentDate + 1  ;

    //  //   //   console.log(newdate);
    //   //   //   console.log(this.AddFieldForm.value);

    this.isSubmitted = true;
    if (this.AddFieldForm.valid) {
      const httpOptions = {
        headers: new HttpHeaders({
          Authorization: "Bearer " + this.api.GetToken(),
        }),
      };

      //let data = (JSON.stringify(this.AddFieldForm.value));
      const formData = new FormData();

      //formData.append("data", data);
      formData.append("RM", JSON.stringify(this.AddFieldForm.value["RM"]));
      formData.append(
        "partner",
        JSON.stringify(this.AddFieldForm.value["partner"])
      );
      formData.append(
        "payout",
        JSON.stringify(this.AddFieldForm.value["payout"])
      );
      formData.append("LOB", JSON.stringify(this.AddFieldForm.value["LOB"]));
      formData.append(
        "product",
        JSON.stringify(this.AddFieldForm.value["product"])
      );
      formData.append(
        "subProduct",
        JSON.stringify(this.AddFieldForm.value["subProduct"])
      );
      formData.append("fromdate", this.AddFieldForm.value["fromdate"]);
      formData.append("Login_User_Id", this.api.GetUserData("Code"));
      formData.append("Login_User_Type", this.api.GetUserData("Type"));
      this.api.IsLoading();
      this.api
        .HttpPostTypeBms("../v2/PayoutModeRequest/addPayout", formData)
        .then(
          (resp) => {
            this.api.HideLoading();
            this.CloseModel();
            if (resp['Status'] == true) {
             
              this.api.Toast('Success', resp['Message']);
            }else{
              this.api.Toast('Warning',resp['Message']);
            }
          },
          (err) => {
            this.api.HideLoading();
          }
        );
    }
  }

  CloseModel(): void {
    this.formReset();
    this.dialogRef.close({
      Status: "Model Close",
    });
  }
}
