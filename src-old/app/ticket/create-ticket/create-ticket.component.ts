import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ApiService } from "../../providers/api.service";

@Component({
  selector: "app-create-ticket",
  templateUrl: "./create-ticket.component.html",
  styleUrls: ["./create-ticket.component.css"],
})
export class CreateTicketComponent implements OnInit {
  AddForm: FormGroup;
  isSubmitted = false;
  selectedFiles: File;
  Surveyor_Report: File;

  dropdownSettings: any = {};
  dropdownSettingsMultiselect: any = {};
  Quote_Ar: any = [];
  OfflineQuoteAr: any = [];
  formWise1: boolean = false;
  formWise2: boolean = false;
  formWise3: boolean = false;
  formWise4: boolean = false;
  formWise5: boolean = false;
  formWise6: boolean = false;

  GloabalRow: boolean = false;
  RcCase: any;
  GvwCase: boolean = false;
  QuoteTypeForm: any;
  Rc_fronts: File;
  Rc_backs: File;
  Payment_Screens: File;
  Page_Error_Screens: File;
  Attachements: File;
  ActivePage: string = "Default";
  Invoices: File;
  LoginType: string;
  Select_PayoutAr: { Id: string; Name: string; }[];

  file_missing = false;
  payout_diff = false;
  payout_not_received = false;
  remarksArray : any = [];

  constructor(
    public api: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.AddForm = this.formBuilder.group({
      PolicyType: ["", Validators.required],
      QuoteId: ["", Validators.required],
      RcYesNo: ["", Validators.required],
      Rc_front: ["", Validators.required],
      Rc_back: ["", Validators.required],
      Invoice: ["", Validators.required],
      VehicleType: ["", Validators.required],
      PageUrl: ["", Validators.required],
      Page_Error_Screen: ["", Validators.required],

      PageType: ["", Validators.required],

      Make: ["", [Validators.required, Validators.pattern("^[a-zA-Z0-9_ ]*$")]],
      Model: [
        "",
        [Validators.required, Validators.pattern("^[a-zA-Z0-9_ ]*$")],
      ],
      Variant: [
        "",
        [Validators.required, Validators.pattern("^[a-zA-Z0-9_ ]*$")],
      ],
      FuelType: ["", [Validators.required]],
      Cc: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
      Sc: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
      Gvw: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],

      InsurerName: [
        "",
        [Validators.required, Validators.pattern("^[a-zA-Z0-9_ ]*$")],
      ],
      CityName: ["", [Validators.required, Validators.pattern("^[A-Za-z ]*$")]],

      Remark: ["", [Validators.pattern("^[a-zA-Z0-9_]*$")]],
      // Remark: [''],
      Payment_Screen: [""],
      Attachement: [""],

      // Policy_No: [""],
      Select_Payout : ["" , [Validators.required]],
      Remark_1 : [""],
      Remark_2 : [""],
      Remark_3 : [""],
      OfflineQuote: [""],
      Request_Id: [""],
    });

    this.dropdownSettings = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: true,
      //disabled: false
    };

    this.dropdownSettingsMultiselect = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };


    this.Select_PayoutAr = [
      { Id: "0", Name: "File Missing" },
      { Id: "1", Name: "Payout Difference" },
      { Id: "2", Name: "Payout not received" },
    ];

    // this.SearchQuoteIds('',0);
  }

  ngOnInit() {
    // this.SearchOfflineQuoteIds("", 0);
  }

  get FC() {
    return this.AddForm.controls;
  }

  CreateTicket() {
    this.isSubmitted = true;
    this.remarksArray = [];
    if (this.AddForm.invalid) {
      console.log(this.AddForm.controls);
      return;
    } else {

    
      var fields = this.AddForm.value; 
      const formData = new FormData();

      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("User_Type", this.api.GetUserType());

      formData.append("PolicyType", fields["PolicyType"]);

      if (
        fields["PolicyType"] == 1 ||
        fields["PolicyType"] == 4 ||
        fields["PolicyType"] == 5
      ) {
        formData.append("QuoteId", fields["QuoteId"][0]["Id"]);
      }

      formData.append("RcYesNo", fields["RcYesNo"]);
      formData.append("VehicleType", fields["VehicleType"]);
      formData.append("Make", fields["Make"]);
      formData.append("Model", fields["Model"]);
      formData.append("Variant", fields["Variant"]);
      formData.append("FuelType", fields["FuelType"]);
      formData.append("Cc", fields["Cc"]);
      formData.append("Sc", fields["Sc"]);
      formData.append("Gvw", fields["Gvw"]);
      formData.append("Remark", fields["Remark"]);
      formData.append("InsurerName", fields["InsurerName"]);
      formData.append("CityName", fields["CityName"]);
      formData.append("Invoice", this.Invoices);

      if (fields.Remark_1) {
        this.remarksArray.push({fileMissing : fields["Remark_1"]});
      }
    if (fields.Remark_2) {
      this.remarksArray.push({payoutDifference : fields["Remark_2"]});
    }
    if (fields.Remark_3) {
        this.remarksArray.push({payoutNotReceived : fields["Remark_3"]});
    }
      formData.append("PageType", fields["PageType"]);
      formData.append("PageUrl", fields["PageUrl"]);
      formData.append("Policy_No", fields["Policy_No"]);
      formData.append("Payment_Screen", this.Payment_Screens);
      formData.append("Rc_Front", this.Rc_fronts);
      formData.append("Rc_Back", this.Rc_backs);
      formData.append("Page_Error_Screen", this.Page_Error_Screens);
      formData.append("Attachement", this.Attachements);
      formData.append("payoutCommision", JSON.stringify(this.remarksArray));
  

      if (
        fields["PolicyType"] == "Offline-Quote" ||
        fields["PolicyType"] == "Cancellation" ||
        fields["PolicyType"] == "Endorsement" ||
        fields["PolicyType"] == "Claim" ||
        fields["PolicyType"] == "Survey"
      ) {
        formData.append("OfflineQuote", fields["OfflineQuote"][0]["Id"]);
      }

      formData.append("Request_Id", fields["Request_Id"]);
      formData.append("Source", "Web");

      this.api.IsLoading();
      this.api.HttpPostType("Ticket/Add", formData).then(
        (result) => {
          this.api.HideLoading();

          // console.log(result);

          if (result["Status"] == true) {
            this.api.Toast("Success", result["Message"]);
            this.router.navigate(["ticket/all-tickets-user"]);
          } else {
            //alert(result['message']);
            
            if (result["Errors"] > 0) {
              for (var i = 0; i < result["Errors"]; i++) {
                this.api.Toast("Error", result["Message"][i]);
              }
            } else {
              this.api.Toast("Error", result["Message"]);
            }
          }
        },
        (err) => {
          // Error log
          //// console.log(err);
          this.api.HideLoading();
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
          //this.api.ErrorMsg('Network Error :- ' + err.message);
        }
      );
    }
  }

  UploadDocs(event, Type) {
    this.selectedFiles = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      // console.log(this.selectedFiles);
      // console.log(this.selectedFiles.name);
      var str = this.selectedFiles.name;
      var ar = str.split(".");
      // console.log(ar);
      var ext;
      for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();
      // console.log(ext);

      if (ext == "png" || ext == "jpeg" || ext == "jpg" || ext == "pdf") {
        // console.log("Extenstion is vaild !");
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);

        // console.log(Total_Size + " kb");

        if (Total_Size >= 1024 * 2) {
          // allow only 2 mb
          this.api.Toast("Warning", "File size is greater than 2 mb");

          if (Type == "OtherPayment_Screen_Doc") {
            this.AddForm.get("Payment_Screen").setValue("");
          }
          if (Type == "Rc_front") {
            this.AddForm.get("Rc_front").setValue("");
          }
          if (Type == "Rc_back") {
            this.AddForm.get("Rc_back").setValue("");
          }
          if (Type == "Page_Error_Screen") {
            this.AddForm.get("Page_Error_Screen").setValue("");
          }
          if (Type == "Attachement") {
            this.AddForm.get("Attachement").setValue("");
          }
          if (Type == "Invoice") {
            this.AddForm.get("Invoice").setValue("");
          }
        } else {
          if (Type == "Payment_Screen") {
            this.Payment_Screens = this.selectedFiles;
          }
          if (Type == "Rc_front") {
            this.Rc_fronts = this.selectedFiles;
          }
          if (Type == "Rc_back") {
            this.Rc_backs = this.selectedFiles;
          }
          if (Type == "Page_Error_Screen") {
            this.Page_Error_Screens = this.selectedFiles;
          }
          if (Type == "Attachement") {
            this.Attachements = this.selectedFiles;
          }
          if (Type == "Invoice") {
            this.Invoices = this.selectedFiles;
          }
        }
      } else {
        // console.log("Extenstion is not vaild !");

        this.api.Toast(
          "Warning",
          "Please choose vaild file ! Example :- PNG,JPEG,JPG,PDF"
        );

        if (Type == "Payment_Screen") {
          this.AddForm.get("Payment_Screen").setValue("");
        }
        if (Type == "Rc_front") {
          this.AddForm.get("Rc_front").setValue("");
        }
        if (Type == "Rc_back") {
          this.AddForm.get("Rc_back").setValue("");
        }
        if (Type == "Page_Error_Screen") {
          this.AddForm.get("Page_Error_Screen").setValue("");
        }
        if (Type == "Attachement") {
          this.AddForm.get("Attachement").setValue("");
        }
      }
    }
  }

  onChangeFormWise(e) {
    const Values = e.target.value;
    const QuoteId = this.AddForm.get("QuoteId");
    const Payment_Screen = this.AddForm.get("Payment_Screen");
    const Page_Error_Screen = this.AddForm.get("Page_Error_Screen");
    const RcYesNo = this.AddForm.get("RcYesNo");
    const Rc_front = this.AddForm.get("Rc_front");
    const Rc_back = this.AddForm.get("Rc_back");
    const VehicleType = this.AddForm.get("VehicleType");
    const Make = this.AddForm.get("Make");
    const Model = this.AddForm.get("Model");
    const Variant = this.AddForm.get("Variant");
    const FuelType = this.AddForm.get("FuelType");
    const Cc = this.AddForm.get("Cc");
    const Sc = this.AddForm.get("Sc");
    const Gvw = this.AddForm.get("Gvw");

    const PageType = this.AddForm.get("PageType");
    const PageUrl = this.AddForm.get("PageUrl");

    const InsurerName = this.AddForm.get("InsurerName");
    const CityName = this.AddForm.get("CityName");
    const Attachement = this.AddForm.get("Attachement");
    if (
      Values == "Offline-Quote" ||
      Values == "Cancellation" ||
      Values == "Claim" ||
      Values == "Endorsement" ||
      Values == "Survey"
    ) {
      this.SearchOfflineQuoteIds("", 0, Values);
      this.AddForm.get("OfflineQuote").setValidators([Validators.required]);
    } else {
      this.AddForm.get("OfflineQuote").setValidators(null);
    }
    this.AddForm.get("OfflineQuote").updateValueAndValidity();

    if (
      Values == 1 ||
      Values == 2 ||
      Values == 3 ||
      Values == 4 ||
      Values == 5 ||
      Values == 6
    ) {
      this.AddForm.get("PolicyType").setValidators([Validators.required]);
      this.AddForm.get("QuoteId").setValidators([Validators.required]);
      this.AddForm.get("RcYesNo").setValidators([Validators.required]);
      this.AddForm.get("Rc_front").setValidators([Validators.required]);
      this.AddForm.get("Rc_back").setValidators([Validators.required]);
      this.AddForm.get("VehicleType").setValidators([Validators.required]);
      this.AddForm.get("PageUrl").setValidators([Validators.required]);
      this.AddForm.get("Make").setValidators([
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9_ ]*$"),
      ]);
      this.AddForm.get("Model").setValidators([
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9_ ]*$"),
      ]);
      this.AddForm.get("Variant").setValidators([
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9_ ]*$"),
      ]);
      this.AddForm.get("FuelType").setValidators([Validators.required]);
      this.AddForm.get("Cc").setValidators([
        Validators.required,
        Validators.pattern("^[0-9]*$"),
      ]);
      this.AddForm.get("Sc").setValidators([
        Validators.required,
        Validators.pattern("^[0-9]*$"),
      ]);
      this.AddForm.get("Gvw").setValidators([
        Validators.required,
        Validators.pattern("^[0-9]*$"),
      ]);
      this.AddForm.get("Page_Error_Screen").setValidators([
        Validators.required,
      ]);
      this.AddForm.get("PageType").setValidators([Validators.required]);
      this.AddForm.get("InsurerName").setValidators([
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9_ ]*$"),
      ]);
      this.AddForm.get("CityName").setValidators([
        Validators.required,
        Validators.pattern("^[a-zA-Z ]*$"),
      ]);

      this.AddForm.get("PolicyType").updateValueAndValidity();
      this.AddForm.get("QuoteId").updateValueAndValidity();
      this.AddForm.get("RcYesNo").updateValueAndValidity();
      this.AddForm.get("Rc_front").updateValueAndValidity();
      this.AddForm.get("Rc_back").updateValueAndValidity();
      this.AddForm.get("VehicleType").updateValueAndValidity();
      this.AddForm.get("PageUrl").updateValueAndValidity();
      this.AddForm.get("Make").updateValueAndValidity();
      this.AddForm.get("Model").updateValueAndValidity();
      this.AddForm.get("Variant").updateValueAndValidity();
      this.AddForm.get("FuelType").updateValueAndValidity();
      this.AddForm.get("Cc").updateValueAndValidity();
      this.AddForm.get("Sc").updateValueAndValidity();
      this.AddForm.get("Gvw").updateValueAndValidity();
      this.AddForm.get("Page_Error_Screen").updateValueAndValidity();
      this.AddForm.get("PageType").updateValueAndValidity();
      this.AddForm.get("InsurerName").updateValueAndValidity();
      this.AddForm.get("CityName").updateValueAndValidity();

      if (Values == "") {
        this.GloabalRow = false;
        this.formWise1 = false;
        this.formWise2 = false;
        this.formWise3 = false;
        this.formWise4 = false;
        this.formWise5 = false;
        this.formWise6 = false;
        return;
      }

      if (Values == 1) {
        this.GloabalRow = true;

        this.formWise1 = true;
        this.formWise2 = false;
        this.formWise3 = false;
        this.formWise4 = false;
        this.formWise5 = false;
        this.formWise6 = false;

        this.QuoteTypeForm = "1";
        this.SearchQuoteIds("", 0);

        RcYesNo.disable();
        Rc_front.disable();
        Rc_back.disable();
        VehicleType.disable();
        Make.disable();
        Variant.disable();
        Model.disable();
        FuelType.disable();
        Cc.disable();
        Sc.disable();
        Gvw.disable();

        InsurerName.disable();
        CityName.disable();

        PageType.disable();
        PageUrl.disable();
        Page_Error_Screen.disable();
        Attachement.disable();

        QuoteId.enable();
        Payment_Screen.enable();
      } else if (Values == 2) {
        this.GloabalRow = true;
        this.formWise1 = false;
        this.formWise2 = true;
        this.formWise3 = false;
        this.formWise4 = false;
        this.formWise5 = false;
        this.formWise6 = false;

        RcYesNo.enable();
        Rc_front.enable();
        Rc_back.enable();
        VehicleType.enable();
        Make.enable();
        Variant.enable();
        Model.enable();
        FuelType.enable();
        Cc.enable();
        Sc.enable();
        Gvw.enable();

        QuoteId.disable();
        Payment_Screen.disable();
        PageType.disable();
        PageUrl.disable();
        Page_Error_Screen.disable();

        InsurerName.disable();
        CityName.disable();
        Attachement.disable();
      } else if (Values == 3) {
        this.GloabalRow = true;
        this.formWise1 = false;
        this.formWise2 = false;
        this.formWise3 = true;
        this.formWise4 = false;
        this.formWise5 = false;
        this.formWise6 = false;

        InsurerName.enable();
        CityName.enable();

        RcYesNo.enable();
        Rc_front.enable();
        Rc_back.enable();

        VehicleType.disable();
        Make.disable();
        Variant.disable();
        Model.disable();
        FuelType.disable();
        Cc.disable();
        Sc.disable();
        Gvw.disable();
        PageType.disable();
        PageUrl.disable();
        Page_Error_Screen.disable();
        Attachement.disable();

        QuoteId.disable();
        Payment_Screen.disable();
      } else if (Values == 4) {
        this.GloabalRow = true;
        this.formWise1 = false;
        this.formWise2 = false;
        this.formWise3 = false;
        this.formWise4 = true;
        this.formWise5 = false;
        this.formWise6 = false;

        this.QuoteTypeForm = "4";
        this.SearchQuoteIds("", 0);

        RcYesNo.disable();
        Rc_front.disable();
        Rc_back.disable();
        VehicleType.disable();
        Make.disable();
        Variant.disable();
        Model.disable();
        FuelType.disable();
        Cc.disable();
        Sc.disable();
        Gvw.disable();

        PageType.disable();
        PageUrl.disable();
        Page_Error_Screen.disable();

        QuoteId.enable();
        Payment_Screen.disable();
        Attachement.disable();

        InsurerName.disable();
        CityName.disable();
      } else if (Values == 5) {
        this.GloabalRow = true;
        this.formWise1 = false;
        this.formWise2 = false;
        this.formWise3 = false;
        this.formWise4 = false;
        this.formWise5 = true;
        this.formWise6 = false;

        this.QuoteTypeForm = "4";
        // this.SearchQuoteIds('',0);

        RcYesNo.disable();
        Rc_front.disable();
        Rc_back.disable();
        VehicleType.disable();
        Make.disable();
        Variant.disable();
        Model.disable();
        FuelType.disable();
        Cc.disable();
        Sc.disable();
        Gvw.disable();

        QuoteId.enable();

        PageType.enable();
        PageUrl.enable();
        Page_Error_Screen.enable();
        Attachement.disable();

        Payment_Screen.disable();

        InsurerName.disable();
        CityName.disable();
      } else if (Values == 6) {
        this.GloabalRow = true;
        this.formWise1 = false;
        this.formWise2 = false;
        this.formWise3 = false;
        this.formWise4 = false;
        this.formWise5 = false;
        this.formWise6 = true;

        RcYesNo.disable();
        Rc_front.disable();
        Rc_back.disable();
        VehicleType.disable();
        Make.disable();
        Variant.disable();
        Model.disable();
        FuelType.disable();
        Cc.disable();
        Sc.disable();
        Gvw.disable();

        QuoteId.disable();

        PageType.disable();
        PageUrl.disable();
        Page_Error_Screen.disable();

        Attachement.enable();

        Payment_Screen.disable();

        InsurerName.disable();
        CityName.disable();
      }

      if (Values == 6) {
        this.AddForm.controls["Remark"].setValidators([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_ ]*$"),
        ]);
      } else {
        this.AddForm.controls["Remark"].clearValidators();
      }
      this.AddForm.controls["Remark"].updateValueAndValidity();
    } else {
      this.AddForm.get("PolicyType").setValidators(null);
      this.AddForm.get("QuoteId").setValidators(null);
      this.AddForm.get("RcYesNo").setValidators(null);
      this.AddForm.get("Rc_front").setValidators(null);
      this.AddForm.get("Rc_back").setValidators(null);
      this.AddForm.get("VehicleType").setValidators(null);
      this.AddForm.get("PageUrl").setValidators(null);
      this.AddForm.get("Make").setValidators(null);
      this.AddForm.get("Model").setValidators(null);
      this.AddForm.get("Variant").setValidators(null);
      this.AddForm.get("FuelType").setValidators(null);
      this.AddForm.get("Cc").setValidators(null);
      this.AddForm.get("Sc").setValidators(null);
      this.AddForm.get("Gvw").setValidators(null);
      this.AddForm.get("Page_Error_Screen").setValidators(null);
      this.AddForm.get("PageType").setValidators(null);
      this.AddForm.get("InsurerName").setValidators(null);
      this.AddForm.get("CityName").setValidators(null);
      this.AddForm.get("Invoice").setValidators(null);

      this.AddForm.get("PolicyType").updateValueAndValidity();
      this.AddForm.get("QuoteId").updateValueAndValidity();
      this.AddForm.get("RcYesNo").updateValueAndValidity();
      this.AddForm.get("Rc_front").updateValueAndValidity();
      this.AddForm.get("Rc_back").updateValueAndValidity();
      this.AddForm.get("VehicleType").updateValueAndValidity();
      this.AddForm.get("PageUrl").updateValueAndValidity();
      this.AddForm.get("Make").updateValueAndValidity();
      this.AddForm.get("Model").updateValueAndValidity();
      this.AddForm.get("Variant").updateValueAndValidity();
      this.AddForm.get("FuelType").updateValueAndValidity();
      this.AddForm.get("Cc").updateValueAndValidity();
      this.AddForm.get("Sc").updateValueAndValidity();
      this.AddForm.get("Invoice").updateValueAndValidity();

      this.AddForm.get("Gvw").updateValueAndValidity();
      this.AddForm.get("Page_Error_Screen").updateValueAndValidity();
      this.AddForm.get("PageType").updateValueAndValidity();
      this.AddForm.get("InsurerName").updateValueAndValidity();
      this.AddForm.get("CityName").updateValueAndValidity();
    }
  }

  onChangeRCWise(e) {
    const Values = e.target.value;
    const RcYesNo = this.AddForm.get("RcYesNo");
    const Rc_front = this.AddForm.get("Rc_front");
    const Rc_back = this.AddForm.get("Rc_back");
    const VehicleType = this.AddForm.get("VehicleType");
    const Make = this.AddForm.get("Make");
    const Model = this.AddForm.get("Model");
    const Variant = this.AddForm.get("Variant");
    const FuelType = this.AddForm.get("FuelType");
    const Cc = this.AddForm.get("Cc");
    const Sc = this.AddForm.get("Sc");
    const Gvw = this.AddForm.get("Gvw");
    const Invoice = this.AddForm.get("Invoice");

    if (Values == "") {
      this.RcCase = false;
      return;
    }
    if (Values == "Yes") {
      this.RcCase = true;

      Rc_front.enable();
      Rc_back.enable();

      VehicleType.disable();
      Make.disable();
      Variant.disable();
      Model.disable();
      FuelType.disable();
      Cc.disable();
      Sc.disable();
      Gvw.disable();
      Invoice.disable();
    } else if (Values == "No" || Values == "Invoice") {
      this.RcCase = false;

      if (Values == "Invoice") {
        VehicleType.disable();
        Make.disable();
        Variant.disable();
        Model.disable();
        FuelType.disable();
        Cc.disable();
        Sc.disable();
        Gvw.disable();

        Rc_front.disable();
        Rc_back.disable();
        Invoice.enable();
      } else {
        VehicleType.enable();
        Make.enable();
        Variant.enable();
        Model.enable();
        FuelType.enable();
        Cc.enable();
        Sc.enable();
        Gvw.enable();

        Rc_front.disable();
        Rc_back.disable();
        Invoice.disable();
      }
    }
  }
  onChangeVehicleType(e) {
    const Values = e.target.value;

    const Gvw = this.AddForm.get("Gvw");
    if (Values == "") {
      this.GvwCase = false;
      return;
    }
    if (Values == "Gcv") {
      this.GvwCase = true;
      Gvw.enable();
    } else {
      this.GvwCase = false;
      Gvw.disable();
    }
  }

  SearchQuoteIds(e, Type) {
    var Quote = "";
    if (Type == 1) {
      Quote = e.target.value;
    }
    // console.log(Quote);
    //  this.api.IsLoading();

    var Ids = this.api.GetUserData("Id");
    var Roles = this.api.GetUserType();
    var QuoteTypeForm = this.AddForm.get("PolicyType").value;

    this.api
      .HttpGetType(
        "Globel/GetQuoteDate?Quote=" +
          Quote +
          "&Ids=" +
          Ids +
          "&Roles=" +
          Roles +
          "&QuoteTypeForm=" +
          QuoteTypeForm
      )
      .then(
        (result) => {
          //  this.api.HideLoading();

          if (result["status"] == true) {
            this.Quote_Ar = result["data"];
          } else {
            // this.api.Toast('Warning',result['msg']);
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

  SearchOfflineQuoteIds(e, Type, Value) {
    this.OfflineQuoteAr = "";

    var Quote = "";
    if (Type == 1) {
      Quote = e.target.value;
    }
    // console.log(Quote);

    var Ids = this.api.GetUserData("Id");
    this.api
      .HttpGetType(
        "Globel/GetOfflineQuoteDate?Quote=" +
          Quote +
          "&Type=" +
          Value +
          "&User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType()
      )
      .then(
        (result) => {
          //  this.api.HideLoading();

          if (result["status"] == true) {
            this.OfflineQuoteAr = result["data"];
          } else {
            // this.api.Toast('Warning',result['msg']);
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


    PayoutAr(e) {
    
      if (e.Id == 0) {
        this.file_missing = true;

        this.AddForm.get("Remark_1").setValidators( [Validators.required , Validators.pattern("^[a-zA-Z0-9_]*$")]);
        this.AddForm.get("Remark_1").updateValueAndValidity();
      }
      if (e.Id == 1) {
        this.payout_diff = true;
        this.AddForm.get("Remark_2").setValidators( [Validators.required , Validators.pattern("^[a-zA-Z0-9_]*$")]);
        this.AddForm.get("Remark_2").updateValueAndValidity();
      }
      if (e.Id == 2) {
        this.payout_not_received = true;
        this.AddForm.get("Remark_3").setValidators( [Validators.required , Validators.pattern("^[a-zA-Z0-9_]*$")]);
        this.AddForm.get("Remark_3").updateValueAndValidity();
      }
    }

    PayoutAr_de_select(e) {
    
      if (e.Id == 0) {
        this.file_missing = false;
        this.AddForm.get("Remark_1").setValidators(null);
        this.AddForm.get("Remark_1").updateValueAndValidity();

      }
      if (e.Id == 1) {
        this.payout_diff = false;
        this.AddForm.get("Remark_2").setValidators(null);
        this.AddForm.get("Remark_2").updateValueAndValidity();
      }
      if (e.Id == 2) {
        this.payout_not_received = false;
        this.AddForm.get("Remark_3").setValidators(null);
        this.AddForm.get("Remark_3").updateValueAndValidity();
      }
    }
}
