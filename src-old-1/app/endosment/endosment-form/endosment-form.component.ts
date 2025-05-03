import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormArray, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

import { EndosmentService } from "../endosment.service";
import { FormRelatedComponent } from "../form-related/form-related.component";

@Component({
  selector: "app-endosment-form",
  templateUrl: "./endosment-form.component.html",
  styleUrls: ["./endosment-form.component.css"],
})
export class EndosmentFormComponent implements OnInit {
  EndosmentForm: FormGroup;
  isSubmitted = false;
  srNo: any;
  buttonDisable = false;
  Id: string;
  row: any = [];
  reqData: any;

  IsDisabled: boolean;
  Base_Url: string;
  pincodeData: any = [];
  makeData: any = [];
  modelData: any = [];
  variantData: any = [];
  fuelData: any = [];
  manufactureYearData: any = [];
  previousInsurerData: any = [];
  yesNoData: any = [];
  nameUpdateReason: any;
  ncbUpdateReason: any;
  selectedFiles: File;
  rcFront: File;
  rcBack: File;
  requestLetter: File;
  supportingDoc: File;

  pincodeDisable: boolean = true;
  makeDisable: boolean = true;
  modelDisable: boolean = true;
  variantDisable: boolean = true;
  fuelTypeDisable: boolean = true;
  manufactureYearDisable: boolean = true;
  preInsurerDisable: boolean = true;
  paOwnerDriverDisable: boolean = true;
  unnamedPaDisable: boolean = true;
  legalLiabilityDisable: boolean = true;
  legalLiabilityEmpDisable: boolean = true;

  dropdownSettingsSingle: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };

  dropdownSettingsSingle1: {
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
  };

  Documents: any;
  source: any;
  SrId: any;
  prePolNoReadOnly: boolean = false;

  RC_Motor_Front_image: any = 0;
  RC_Motor_Back_image: any = 0;
  Request_Letter_image: any = 0;
  Supporting_Doc_image: any = 0;

  constructor(
    public api: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private sharedService: EndosmentService,
    public dialog: MatDialog
  ) {
    //debugger;
  }

  //===== ngOnInit Management =====//
  ngOnInit() {
    //===== FORM BUIDER =====//
    this.EndosmentForm = this.formBuilder.group({
      salutation: [""],
      firstName: [""],
      mobileNo: ["", [Validators.pattern("^((\\+91-?)|0)?[6-9]{1}[0-9]{9}$")]],
      emailId: [
        "",
        [Validators.pattern("^[A-Za-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$")],
      ],
      gender: [""],
      dob: [""],
      streetNo: [""],
      location: [""],
      pincode: [""],
      city: [""],
      state: [""],
      pancardNo: [""],
      aadharcardNo: [""],
      GstIN: [""],
      riskInception_Date: [""],

      registrationNo: [""],
      registrationYear: [""],
      seatingCapacity: [""],
      make: [""],
      model: [""],
      variant: [""],
      fuelType: [""],
      engineNo: [""],
      chassisNo: [""],
      cubicCapacity: [""],
      Cng_idv: [""],
      manufacturingYear: [""],
      paOwnerDriver: [""],
      unnamedPa: [""],
      legalLiability: [""],
      legalLiabilityForEmp: [""],

      ncb: [""],
      previousPolicyNo: [""],
      previousPolicyExpiry: [""],
      previousPolicyNCB: [""],
      previousInsurer: [""],

      financierName: [""],
      nomineeName: [""],
      nomineeDob: [""],
      nomineeRelation: [""],

      RcFront: [""],
      RcBack: [""],
      RequestLetter: ["", [Validators.required]],
      SupportingDoc: [""],
      mandateremark: ["", [Validators.required]],
    });

    this.dropdownSettingsSingle = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.dropdownSettingsSingle1 = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    (this.yesNoData = [
      { Id: 1, Name: "Yes" },
      { Id: 0, Name: "No" },
    ]),
      (this.srNo = this.activatedRoute.snapshot.params.srNo);

    this.fetchSrCompleteDetails(this.srNo);
    this.EndosmentForm.disable();

    //Document Fields
    this.EndosmentForm.controls["RcFront"].enable();
    this.EndosmentForm.controls["RcBack"].enable();
    this.EndosmentForm.controls["RequestLetter"].enable();
    this.EndosmentForm.controls["SupportingDoc"].enable();
    this.EndosmentForm.controls["mandateremark"].enable();
    this.getManufactureYearData();
  }

  //===== GET FORM CONTROLS
  get formControls() {
    return this.EndosmentForm.controls;
  }

  //===== SET FIELD VALUES =====//
  enableInputFieldsValue(fieldName: any) {
    if (fieldName == "pincode") {
      this.pincodeDisable = false;
      this.searchPincodes("", 0);
    } else if (fieldName == "make") {
      this.makeDisable = false;
      // this.fuelTypeDisable = true;
      this.searchMakes();
    } else if (fieldName == "model") {
      this.modelDisable = false;
      this.searchModels();
    } else if (fieldName == "fuelType") {
      this.fuelTypeDisable = false;
      this.searchFuelType();
    } else if (fieldName == "variant") {
      this.variantDisable = false;
      this.searchVariants();
    } else if (fieldName == "registrationYear") {
      this.manufactureYearDisable = false;
    } else if (fieldName == "previousInsurer") {
      this.preInsurerDisable = false;
      this.getInsurerData();
    } else if (fieldName == "unnamedPa") {
      this.unnamedPaDisable = false;
    } else if (fieldName == "legalLiability") {
      this.legalLiabilityDisable = false;
    } else if (fieldName == "legalLiabilityForEmp") {
      this.legalLiabilityEmpDisable = false;
    } else if (fieldName == "paOwnerDriver") {
      this.paOwnerDriverDisable = false;
    } else {
      this.EndosmentForm.controls[fieldName].enable();
    }
  }

  //===== CLER FIELD VALUES =====//

  disableInputFieldValue(fieldName: any) {
    this.EndosmentForm.controls[fieldName].setValue("");

    if (fieldName == "firstName") {
      this.nameUpdateReason = "";

      let fieldsList: string[] = [
        "salutation",
        "firstName",
        "mobileNo",
        "emailId",
        "gender",
        "dob",
        "streetNo",
        "location",
        "pincode",
        "pancardNo",
        "aadharcardNo",
      ];

      for (let i = 0; i < fieldsList.length; i++) {
        this.EndosmentForm.controls[fieldsList[i]].setValue("");
        this.EndosmentForm.controls[fieldsList[i]].disable();
        this.pincodeDisable = true;

        this.EndosmentForm.get(fieldsList[i]).setValidators(null);
        this.EndosmentForm.get(fieldsList[i]).updateValueAndValidity();

        this.EndosmentForm.controls["GstIN"].disable();
      }
    } else if (fieldName == "ncb") {
      this.ncbUpdateReason = "";
    } else if (fieldName == "pincode") {
      this.pincodeDisable = true;
    } else if (fieldName == "make") {
      this.makeDisable = true;
    } else if (fieldName == "model") {
      this.modelDisable = true;
    } else if (fieldName == "variant") {
      this.variantDisable = true;
    } else if (fieldName == "fuelType") {
      this.fuelTypeDisable = true;
    } else if (fieldName == "registrationYear") {
      this.manufactureYearDisable = true;
    } else if (fieldName == "previousInsurer") {
      this.preInsurerDisable = true;
    } else if (fieldName == "paOwnerDriver") {
      this.paOwnerDriverDisable = true;
    } else if (fieldName == "unnamedPa") {
      this.unnamedPaDisable = true;
    } else if (fieldName == "legalLiability") {
      this.legalLiabilityDisable = true;
    } else if (fieldName == "legalLiabilityForEmp") {
      this.legalLiabilityEmpDisable = true;
    } else {
      this.EndosmentForm.controls[fieldName].disable();
    }
  }

  //===== SUBMIT UPDATES ASKED =====//
  submitNewDetails() {
    this.isSubmitted = true;
    if (this.EndosmentForm.invalid) {
      return;
    } else {
      this.buttonDisable = true;

      var fields = this.EndosmentForm.value;
      // console.log(fields);
      var dataString = JSON.stringify(fields);
      var oldDataString = JSON.stringify(this.row);

      const formData = new FormData();
      formData.append("SrId", this.SrId);
      formData.append("srNo", this.srNo);
      formData.append("loginId", this.api.GetUserData("Id"));
      formData.append("loginType", this.api.GetUserType());
      formData.append("nameUpdateReason", this.nameUpdateReason);
      formData.append("ncbUpdateReason", this.ncbUpdateReason);
      formData.append("rcFront", this.rcFront);
      formData.append("rcBack", this.rcBack);
      formData.append("requestLetter", this.requestLetter);
      formData.append("supportingDoc", this.supportingDoc);
      formData.append("formValues", dataString);
      formData.append("oldDataString", oldDataString);
      formData.append("mandateremark", fields["mandateremark"]);

      this.api.IsLoading();
      this.api
        .HttpPostType("b-crm/Endosment/submitEndosmentForm", formData)
        .then(
          (result) => {
            this.api.HideLoading();

            if (result["status"] == 1) {
              this.buttonDisable = false;
              this.api.Toast("Success", result["msg"]);
              this.router.navigate(["endosment/view-requests"]);
            } else {
              this.buttonDisable = false;
              this.api.Toast("Warning", result["msg"]);
            }
          },
          (err) => {
            this.buttonDisable = false;

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

  //===== CHECK IMAGE TYPE =====//
  checkFileType(event: any, Type: any) {
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
        ext == "Pdf"
      ) {
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);

        if (Total_Size >= 1024 * 3) {
          // allow only 1 mb
          this.api.Toast("Error", "File size is greater than 3 mb");

          if (Type == "RC_Motor_Front") {
            this.EndosmentForm.get("RcFront").setValue("");
            this.RC_Motor_Front_image = 0;
          }
          if (Type == "RC_Motor_Back") {
            this.EndosmentForm.get("RcBack").setValue("");
            this.RC_Motor_Back_image = 0;
          }
          if (Type == "Request_Letter") {
            this.EndosmentForm.get("RequestLetter").setValue("");
            this.Request_Letter_image = 0;
          }
          if (Type == "Supporting_Doc") {
            this.EndosmentForm.get("SupportingDoc").setValue("");
            this.Supporting_Doc_image = 0;
          }
        } else {
          if (Type == "RC_Motor_Front") {
            this.RC_Motor_Front_image = 1;

            this.rcFront = this.selectedFiles;
          }
          if (Type == "RC_Motor_Back") {
            this.RC_Motor_Back_image = 1;
            this.rcBack = this.selectedFiles;
          }
          if (Type == "Request_Letter") {
            this.Request_Letter_image = 1;
            this.requestLetter = this.selectedFiles;
          }
          if (Type == "Supporting_Doc") {
            this.Supporting_Doc_image = 1;
            this.supportingDoc = this.selectedFiles;
          }
        }
      } else {
        this.api.Toast(
          "Error",
          "Please choose vaild file ! Example :- PNG,JPEG,JPG,PDF"
        );

        if (Type == "RC_Motor_Front") {
          this.EndosmentForm.get("RcFront").setValue("");
          this.RC_Motor_Front_image = 0;
        }
        if (Type == "RC_Motor_Back") {
          this.EndosmentForm.get("RcBack").setValue("");
          this.RC_Motor_Back_image = 0;
        }
        if (Type == "Request_Letter") {
          this.EndosmentForm.get("RequestLetter").setValue("");
          this.Request_Letter_image = 0;
        }
        if (Type == "Supporting_Doc") {
          this.EndosmentForm.get("SupportingDoc").setValue("");
          this.Supporting_Doc_image = 0;
        }
      }
    }
  }

  //===== GET SR COMPLETE DETAILS =====//
  fetchSrCompleteDetails(srNo: any) {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "b-crm/Endosment/getSinglePolicyDetails?Type=Normal&Id=" +
          this.srNo +
          "&User_Id=" +
          this.api.GetUserData("Id")
      )
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.row = result["Data"];
            this.SrId = result["Data"]["SrId"];
            this.source = result["Data"]["Source"];

            if (
              result["Data"]["PreviousPolicyNo"] == "NA" ||
              result["Data"]["PreviousPolicyNo"] == "Na" ||
              result["Data"]["PreviousPolicyNo"] == "N/A" ||
              result["Data"]["PreviousPolicyNo"] == ""
            ) {
              this.prePolNoReadOnly = true;
            }
          } else {
            this.api.Toast("Warning", result["Message"]);
            this.router.navigate(["endosment/create-requests"]);
          }
        },
        (err) => {
          this.api.HideLoading();
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
          this.router.navigate(["endosment/create-requests"]);
        }
      );
  }

  //=====SEARCH PINCODES=====//
  searchPincodes(e: any, Type: any) {
    var pincode = "";
    if (Type == 1) {
      pincode = e.target.value;
    }

    this.api
      .HttpGetType("b-crm/Universal/searchPincodes?pincode=" + pincode)
      .then(
        (result) => {
          if (result["status"] == true) {
            this.pincodeData = result["data"];
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

  //GET STATE CITY DETAILS
  getStateCityDetails(item: any) {
    this.api.IsLoading();
    this.api
      .HttpGetType("b-crm/Universal/selectStateCityData?Id=" + item.Id)
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["status"] == true) {
            let row = result["data"];
            this.EndosmentForm.get("state").setValue(row.State_Name);
            this.EndosmentForm.get("city").setValue(row.City_or_Village_Name);
          } else {
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

  //=====SEARCH MAKE=====//
  searchMakes() {
    const formData = new FormData();
    formData.append("make", this.row.Make);
    formData.append("source", this.row.Source);
    formData.append("gadiType", this.row.GadiType);
    this.api.IsLoading();
    this.api.HttpPostType("b-crm/Endosment/searchMakes", formData).then(
      (result) => {
        this.api.HideLoading();
        if (result["status"] == true) {
          this.makeData = result["data"];
          //this.selectedMake = result['makeValue'];
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

  //=====SEARCH MODEL=====//
  searchModels() {
    this.EndosmentForm.get("model").setValue("");
    this.EndosmentForm.get("variant").setValue("");
    this.EndosmentForm.get("fuelType").setValue("");

    var makeName = this.row.Make;

    if (
      this.makeDisable == false &&
      this.EndosmentForm.get("make").value.length != 0 &&
      typeof this.EndosmentForm.get("make").value != "undefined"
    ) {
      makeName = this.EndosmentForm.get("make").value[0].Name;
    }

    const formData = new FormData();
    formData.append("make", makeName);
    formData.append("source", this.row.Source);
    formData.append("gadiType", this.row.GadiType);

    this.api.IsLoading();
    this.api.HttpPostType("b-crm/Endosment/searchModels", formData).then(
      (result) => {
        this.api.HideLoading();

        if (result["status"] == true) {
          this.modelData = result["data"];
          //this.selectedModel = result['modelValue'];
          this.variantData = [];
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

  searchFuelType() {
    var modelName = this.row.Model;
    if (
      this.modelDisable == false &&
      this.EndosmentForm.get("model").value.length != 0 &&
      typeof this.EndosmentForm.get("model").value != "undefined"
    ) {
      modelName = this.EndosmentForm.get("model").value[0].Name;
    }
    const formData = new FormData();
    formData.append("model", modelName);
    formData.append("source", this.row.Source);
    formData.append("gadiType", this.row.GadiType);
    this.api
      .HttpPostType("b-crm/Endosment/searchFuelType?source", formData)
      .then(
        (result) => {
          if (result["status"] == true) {
            this.fuelData = result["data"];
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

  //=====SEARCH MODEL=====//
  searchVariants() {
    var modelName = this.row.Model;
    var fuelname = this.row.fuelType;

    if (
      this.modelDisable == false &&
      this.EndosmentForm.get("model").value.length != 0 &&
      typeof this.EndosmentForm.get("model").value != "undefined"
    ) {
      modelName = this.EndosmentForm.get("model").value[0].Name;
    }
    if (
      this.fuelTypeDisable == false &&
      this.EndosmentForm.get("fuelType").value.length != 0 &&
      typeof this.EndosmentForm.get("fuelType").value != "undefined"
    ) {
      fuelname = this.EndosmentForm.get("fuelType").value[0].Name;
    }

    const formData = new FormData();
    formData.append("model", modelName);
    formData.append("fuelName", fuelname);

    formData.append("source", this.row.Source);
    formData.append("gadiType", this.row.GadiType);

    this.api.IsLoading();
    this.api.HttpPostType("b-crm/Endosment/searchVariants", formData).then(
      (result) => {
        this.api.HideLoading();

        if (result["status"] == true) {
          this.variantData = result["data"];
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

  //=====SEARCH FUEL TYPE=====//

  //=====SEARCH INSURER NAME=====//
  getInsurerData() {
    this.api
      .HttpGetType(
        "b-crm/Endosment/searchInsurerData?source=" + this.row.Source
      )
      .then(
        (result) => {
          if (result["status"] == true) {
            this.previousInsurerData = result["data"];
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

  //===== MANUFACTUREYEAR DATA=====//
  // getManufactureYearData() {
  //   var a = 1;
  //   var currentYear = new Date().getFullYear();
  //   this.manufactureYearData = [];
  //   for (let i = 1990; i <= currentYear; i++) {
  //     var b = a++;
  //     this.manufactureYearData.push({ Id: b, Name: i });
  //   }
  //   this.manufactureYearData.reverse();
  // }

  getManufactureYearData() {
    var a = 1;
    var currentYear = new Date().getFullYear() - 20;
    this.manufactureYearData = [];
    for (let i = currentYear; i <= new Date().getFullYear(); i++) {
      var b = a++;
      this.manufactureYearData.push({ Id: b, Name: i });
    }
    this.manufactureYearData.reverse();
  }

  //===== OPEN FORM MODAL =====//
  chooseReason(fieldName: any) {
    const dialogConfig = this.dialog.open(FormRelatedComponent, {
      width: "40%",
      height: "35%",
      data: {
        fieldName: fieldName,
        nameUpdateRe: this.nameUpdateReason,
        ncbUpdateRe: this.ncbUpdateReason,
      },
    });

    dialogConfig.afterClosed().subscribe((result: any) => {
      if (result != undefined) {
        this.enableInputFieldsValue(fieldName);

        if (fieldName == "firstName") {
          this.nameUpdateReason = result["nameUpdateReason"];
          this.enableAndUpdateValidation(this.nameUpdateReason);
        } else {
          this.ncbUpdateReason = result["ncbUpdateReason"];
        }
      }
    });
  }

  //===== ENABLE FIELDS AND UPDATE VALIDATION IN CASE OF NAME CHANGE =====//
  enableAndUpdateValidation(reason: any) {
    let fieldsList: string[] = [
      "salutation",
      "firstName",
      "mobileNo",
      "emailId",
      "gender",
      "dob",
      "streetNo",
      "location",
      "pincode",
      "pancardNo",
      "aadharcardNo",
    ];

    if (
      reason == "Transfer of Ownership from Individual to Individual." ||
      reason == "Transfer of Ownership from Individual to Company."
    ) {
      for (let i = 0; i < fieldsList.length; i++) {
        this.EndosmentForm.controls[fieldsList[i]].enable();
        this.EndosmentForm.controls["GstIN"].enable();
        this.pincodeDisable = false;
        this.searchPincodes("", 0);

        this.EndosmentForm.get(fieldsList[i]).setValidators([
          Validators.required,
        ]);

        //Pancard
        if (fieldsList[i] == "pancardNo" && this.row["PancardNo"] != "") {
          this.EndosmentForm.get(fieldsList[i]).setValidators([
            Validators.required,
          ]);
        } else if (
          fieldsList[i] == "pancardNo" &&
          this.row["PancardNo"] == ""
        ) {
          this.EndosmentForm.get(fieldsList[i]).setValidators(null);
        }

        //Aadharcard
        if (fieldsList[i] == "aadharcardNo" && this.row["AadharcardNo"] != "") {
          this.EndosmentForm.get(fieldsList[i]).setValidators([
            Validators.required,
          ]);
        } else if (
          fieldsList[i] == "aadharcardNo" &&
          this.row["AadharcardNo"] == ""
        ) {
          this.EndosmentForm.get(fieldsList[i]).setValidators(null);
        }

        this.EndosmentForm.get(fieldsList[i]).updateValueAndValidity();
      }
    } else {
      for (let i = 0; i < fieldsList.length; i++) {
        this.EndosmentForm.controls[fieldsList[i]].setValue("");
        this.EndosmentForm.controls[fieldsList[i]].disable();
        this.pincodeDisable = true;

        this.EndosmentForm.get(fieldsList[i]).setValidators(null);
        this.EndosmentForm.get(fieldsList[i]).updateValueAndValidity();

        this.EndosmentForm.controls["GstIN"].disable();
      }
      this.EndosmentForm.controls["firstName"].enable();
    }
  }

  onItemSelect(Type: any) {
    //Lob
    // var city = item.Id;
    // // console.log(item.Id);

    if (Type == "Make") {
      // this.ItemLOBSelection.push(this.item.Id);
      this.searchModels();
      this.searchVariants();
      this.searchFuelType();
    }
    // this.FilterModal(item);
  }

  //===== ON OPTION DESELECT =====//
  onItemDeSelect(Type: any) {
    //Vertical
    if (Type == "Make") {
      this.searchModels();
      this.searchVariants();
      this.searchFuelType();
    }
    //  this.FilterModal(item);
  }
} //END
