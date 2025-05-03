import { ApiService } from "../../providers/api.service";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { el } from "date-fns/locale";

@Component({
  selector: "app-fire-forms",
  templateUrl: "./fire-forms.component.html",
  styleUrls: ["./fire-forms.component.css"],
})
export class FireFormsComponent implements OnInit {
  [x: string]: any;

  CurrentUrl: string;
  FireForms: FormGroup;
  ViewForm: FormGroup;
  isSubmitted = false;
  loadAPI: Promise<any>;
  apiUrl: any;
  ThDocumets: any;
  id: any;
  myFiles: any = [];
  validFileExtensions = ["png", "jpeg", "jpg", "pdf"];
  maxFileSize = 4000; // 6 MB in KB
  Url_Id: any;
  MappingType: any;
  MappingType1: any;
  splitted2: string;
  Divshow: any;
  results2: any;
  is_discounts: any;
  DiscountV: any;
  Form_Type: any;
  OnChangeOccupancyValue: any;
  post: any[] = [];
  QuoteSourceData: { Id: string; Name: string }[];
  dropdownSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };

  dropdownSettingsMultiselect: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
    closeDropDownOnSelection: boolean;
    showSelectedItemsAtTop: boolean;
    defaultOpen: boolean;
    limitSelection: number;
  };

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private httpClient: HttpClient,
    public api: ApiService
  ) {
    this.FireForms = this.fb.group({
      insured_name: ["", [Validators.required]],
      insured_email: ["", [Validators.required, Validators.email]],
      insured_mobile: [
        "",
        [Validators.required, Validators.pattern("^[0-9]*$")],
      ],
      pincode: ["", [Validators.required]],
      occupancy: ["", [Validators.required]],
      period: ["12"],
      remark: [""],
      fileuplode: [""],
      suminsured: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
      discount: [""],
      floater: [""],
      QuoteSource: [""],
      login_role_type: [""],
      EmployeeMappingPerson: [""],
      login_role_id: [""],
    });

    this.dropdownSettingsingleselect = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.dropdownSettingsingleselect1 = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: false,
    };

    this.QuoteSourceData = [
      { Id: "Whatsapp", Name: "Whatsapp" },
      { Id: "Call", Name: "Call" },
      { Id: "Mail", Name: "Mail" },
    ];

    this.MappingType = [
      { Id: "Employee", Name: "Employee" },
      { Id: "Agent", Name: "Pos" },
      { Id: "Sp", Name: "Sp" },
    ];
    this.MappingType1 = [
      { Id: "Agent", Name: "Pos" },
      { Id: "Sp", Name: "Sp" },
    ];
  }

  ngOnInit() {
    this.CurrentUrl = this.router.url;
    this.Divshow = "0";
    //   //   //   console.log('CurrentUrl:', this.CurrentUrl);
    var splitted = this.CurrentUrl.split("/");

    if (typeof splitted[2] != "undefined" && splitted[3] != "") {
      this.UrlShare = splitted[1];
      this.Url_Tpe = splitted[2];
      this.Url_Id = splitted[3];
      //   //   //   console.log('UrlShare id:', this.UrlShare);
    }

    this.Get();
    this.CheckCreaterRights();
  }

  onRiskLocationBlur() {
    this.FireForms.get("pincode").markAsTouched();
  }

  shouldShowValidationError() {
    const control = this.FireForms.get("pincode");
    return control.invalid && (control.touched || control.dirty);
  }

  // getWhatsAppShareLink(): string {
  //   const message = 'https://crm.squareinsurance.in' + this.getShareUrl();
  //   const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;

  //   return whatsappUrl;
  // }

  // getShareUrl(): string {

  //   return `/backuplivelife/api/Rfq/Rfq_Share_View/${this.ids}/${this.api.GetUserData('Id')}/${this.api.GetUserType()}`;

  // }

  encodeData(data) {
    return btoa(data); // Base64 encoding
  }

  getWhatsAppShareLink(): string {
    const message = "https://crm.squareinsurance.in" + this.getShareUrl();
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      message
    )}`;

    return whatsappUrl;
  }

  getShareUrl(): string {
    const userId = this.encodeData(this.api.GetUserData("Id"));
    const userType = this.encodeData(this.api.GetUserType());
    const quoteId = encodeURIComponent(this.ids);

    return `/backuplivelife/api/Profile/Rfq_Share_View?QuoteId=${quoteId}&UserId=${userId}&UserType=${userType}`;
  }

  Getpincode(e: any, Type: any) {
    this.is_discounts = e.Name;
    // alert(Type);

    const formData = new FormData();
    if (Type == 1) {
      formData.append("search_pincode", e.target.value);
      // alert(34);
    } else if (Type == 2) {
      formData.append("search_occupancy", e.target.value);
    }
    formData.append("DiscountV", this.is_discounts);

    this.api
      .HttpPostType(
        "Rfq/Rfq_pincond_data?Url=" +
          this.CurrentUrl +
          "&User_Id=" +
          this.api.GetUserType(),
        formData
      )
      .then(
        (result: any) => {
          if (result["status"] == true) {
            this.dataArr = result["Data"];
            this.is_discounts = result["Discount"];
            this.dataPincode = result["pincode"];
            // Check if this.is_discounts is defined and not null
          } else {
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          // this.api.HideLoading();
          // this.api.Toast('Warning', 'Network Error : ' + err.name + '(' + err.statusText + ')');
        }
      );
  }

  OnChangeOccupancy(e) {
    this.OnChangeOccupancyValue = e.Name;
    //   //   //   console.log(this.is_discounts);
  }

  Get() {
    // alert();
    const formData = new FormData();
    this.api
      .HttpPostType(
        "Rfq/Rfq_pincond_data?Url=" +
          this.CurrentUrl +
          "&User_Id=" +
          this.api.GetUserType(),
        formData
      )
      .then(
        (result: any) => {
          if (result["status"] == true) {
            this.dataArr = result["Data"];
            this.dataPincode = result["pincode"];
            //   //   //   console.log(this.dataArr);
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

  // onFileChange(event) {
  //   for (var i = 0; i < event.target.files.length; i++) {

  //     // var str = event.target.files[i].name;
  //     var ar = event.target.files[i].name.split(".");

  //  //   //   //   console.log(ar[1]);

  //  //   //   //   console.log(event.target.files[i]);

  //     this.myFiles.push(event.target.files[i]);

  //   }
  // }

  onFileChange(event) {
    this.myFiles = [];

    for (let i = 0; i < event.target.files.length; i++) {
      const file = event.target.files[i];
      if (this.validateFile(file)) {
        this.myFiles.push(file);
      }
    }
    //   //   //   console.log(this.myFiles);
  }

  validateFile(file: File): boolean {
    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (!this.validFileExtensions.includes(fileExtension)) {
      //   //   //   console.log('Extension is not valid!');
      this.api.Toast(
        "Error",
        "Please choose a valid file! Example: PNG, JPEG, JPG, PDF"
      );
      return false;
    }

    const fileSize = Math.round(file.size / 5120);
    //   //   //   console.log(`${fileSize} KB`);
    if (fileSize > this.maxFileSize) {
      //   //   //   console.log('File size is greater than 4 MB');
      this.api.Toast("Error", "File size is greater than 6 MB");
      return false;
    }

    //   //   //   console.log('Extension is valid!');
    return true;
  }

  get formControls() {
    return this.FireForms.controls;
  }

  submit() {
    // const uploadFile = fields['upload'];

    this.isSubmitted = true;
    this.quot_id = Math.floor(Math.random() * 90000000000000) + 10000000000000;
    //   //   //   console.log(this.FireForms.value);
    //   //   //   console.log(this.myFiles);
    if (this.FireForms.invalid) {
      return;
    } else {
      if (this.Url_Tpe == "otc-Fire-Form" && this.Url_Id == "Fire") {
        this.Form_Types = "Fire";
      }

      if (this.Url_Tpe == "otc-Fire-Form" && this.Url_Id == "Marine") {
        this.Form_Types = "Marine";
      }

      if (this.Url_Tpe == "otc-Fire-Form" && this.Url_Id == "CAR") {
        this.Form_Types = "CAR";
      }

      if (this.Url_Tpe == "otc-Fire-Form" && this.Url_Id == "EAR") {
        this.Form_Types = "EAR";
      }

      var fields = this.FireForms.value;
      //   //   //   console.log(fields);
      const formData = new FormData();

      formData.append(
        "EmployeeMappingPerson",
        JSON.stringify(fields["EmployeeMappingPerson"])
      );
      formData.append("QuoteSource", JSON.stringify(fields["QuoteSource"]));
      formData.append(
        "login_role_type",
        JSON.stringify(fields["login_role_type"])
      );
      formData.append("login_role_id", JSON.stringify(fields["login_role_id"]));

      // formData.append('EmployeeMappingPerson', fields['EmployeeMappingPerson'][0]['Id']);
      formData.append("insured_name", fields["insured_name"]);
      formData.append("insured_email", fields["insured_email"]);
      formData.append("insured_mobile", fields["insured_mobile"]);

      formData.append("pincode", fields["pincode"][0]["Id"]);
      formData.append("occupancy", fields["occupancy"][0]["Name"]);

      formData.append("period", fields["period"]);
      formData.append("remark", fields["remark"]);

      for (var i = 0; i < this.myFiles.length; i++) {
        //   //   //   console.log(this.myFiles[i]);
        formData.append("fileuplode[]", this.myFiles[i]);
      }

      formData.append("suminsured", fields["suminsured"]);
      formData.append("floater", fields["floater"]);
      formData.append("discount", fields["discount"]);

      formData.append("login_id", this.api.GetUserData("Id"));
      formData.append("login_type", this.api.GetUserData("Type"));
      // formData.append("customeremail", this.api.GetUserData("Email"));
      // formData.append("customermobileno", this.api.GetUserData("Mobile"));
      // formData.append("customername", this.api.GetUserData("Name"));
      formData.append("Divshow", this.Divshow);
      formData.append("Form_Type", this.Form_Types);

      this.api.IsLoading();
      this.api
        .HttpPostType("Rfq/FireCalculeterSubmit", formData)
        .then((result: any) => {
          if (result["status"] == true) {
            this.api.HideLoading();
            this.results = result["data"];
            this.results2 = result["sub"];
            this.login_id = this.results2["login_id"];
            this.login_role_id = this.results2["login_role_id"];
            this.login_role_type = this.results2["login_role_type"];

            this.ids = result["Quotation_Id"];
            (this.pincode = this.results["pincode"]),
              (this.occupancy = this.results["occupancy"]),
              (this.period = this.results["period"]),
              (this.suminsured = this.results["suminsured"]),
              (this.floater = this.results["floater"]),
              (this.discount = this.results["discount"]),
              (this.zone = this.results["zone"]),
              (this.district = this.results["district"]),
              (this.state = this.results["state"]),
              (this.primium_without_tax = this.results["primium_without_tax"]),
              (this.total_primium = this.results["total_primium"]),
              (this.total_gst = this.results["total_gst"]),
              (this.remark = this.results["remark"]),
              this.api.Toast("Success", result["msg"]);
            this.FireForms.reset();
            //   //   //   console.log(this.ids);
            this.isSubmitted = false;
            $("#modelOpen").click();
          } else {
            const msg = "msg";
            this.ThDocumets = result["msg"];
            this.api.Toast("Warning", result["msg"]);
          }
        });

      // (err) => {
      //   // Error log
      //   // console.log(err);
      //   this.api.HideLoading();
      //   const newLocal = 'Warning';
      //   // this.api.Toast(newLocal, 'Network Error : ' + err.name + '(' + err.statusText + ')');
      //   //this.api.ErrorMsg('Network Error :- ' + err.message);
      // });
    }
  }

  CheckCreaterRights() {
    const formData = new FormData();
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());

    formData.append("Url", this.currentUrl);

    // console.log(formData);
    this.api.IsLoading();
    this.api.HttpPostType("Rfq/CheckRights", formData).then(
      (result) => {
        this.api.HideLoading();

        //   //   //   console.log(result);

        if (result["status"] == 1) {
          // this.api.Toast("Success", result["msg"]);

          this.empType = result["Data"];
          this.Divshow = "1";
        } else {
          const msg = "msg";
          // this.api.Toast("Warning", result["msg"]);
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

  FilterData(item: any) {
    if (item != 1 && item != "OneByOneDeSelect") {
      this.EmployeeMappingPersonval = item;
    }

    const formData = new FormData();
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());
    formData.append("empType", this.empType);

    var fields = this.FireForms.value;

    formData.append("login_role_type", fields["login_role_type"][0]["Id"]);
    formData.append("Url_Id", this.Url_Id);

    formData.append(
      "SelectedEmployee",
      JSON.stringify(fields["EmployeeMappingPerson"])
    );

    this.MappingPerson = [];
    if (item != "OneByOneDeSelect") {
      // formData.append("login_type",);

      // console.log(formData);

      this.api.IsLoading();
      this.api.HttpPostType("Rfq/MappingViaSearviceLocation1", formData).then(
        (result) => {
          this.api.HideLoading();

          //   //   //   console.log(result);

          if (result["status"] == 1) {
            // this.api.Toast("Success", result["msg"]);

            this.EmployeeMappingPersonData =
              result["EmployeeMappingPersonData"];

            this.MappingPerson = result["Data"];
          } else {
            const msg = "msg";
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

  //===== ON OPTION SELECT =====//
  onItemSelect(item: any, Type: any) {
    //Lob
    var item = item.Id;
    // console.log(item.Id);
    // alert(item);
    if (Type == "login_role_type") {
      // this.ItemLOBSelection.push(this.item.Id);
      this.FilterData(item);

      if (item == "Agent" || item == "Sp") {
        this.FireForms.get("login_role_id").setValidators([
          Validators.required,
        ]);
        this.FireForms.get("login_role_id").setValue("");
      } else {
        this.FireForms.get("login_role_id").setValue("");
        this.FireForms.get("login_role_id").setValidators(null);
      }
      this.FireForms.get("login_role_id").updateValueAndValidity();
    }
    if (Type == "EmployeeMappingPerson") {
      // this.ItemLOBSelection.push(this.item.Id);
      this.FireForms.get("login_role_id").setValue("");
      this.FireForms.get("login_role_id").updateValueAndValidity();
      this.FilterData(1);
    }
  }

  //===== ON OPTION DESELECT =====//
  onItemDeSelect(item: any, Type: any) {
    //Vertical
    if (Type == "login_role_type") {
      // this.ItemLOBSelection.push(this.item.Id);
      this.EmployeeMappingPersonval = "";

      this.FilterData("OneByOneDeSelect");
      this.FireForms.get("login_role_id").setValidators(null);
      this.FireForms.get("login_role_id").updateValueAndValidity();
    }
    if (Type == "EmployeeMappingPerson") {
      // this.ItemLOBSelection.push(this.item.Id);
      this.FireForms.get("login_role_id").setValue("");
      this.FireForms.get("login_role_id").updateValueAndValidity();

      this.FilterData("OneByOneDeSelect");
    }
  }
}
