import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-renewalonlinequote-creation",
  templateUrl: "./renewalonlinequote-creation.component.html",
  styleUrls: ["./renewalonlinequote-creation.component.css"],
})
export class RenewalonlinequoteCreationComponent implements OnInit {
  UpdateFollowForm: any;
  isSubmitted = false;
  today = new Date();
  Nextes: Date;
  SrTableId: any;
  Status: any;
  DateTimesShow: boolean = false;
  TableId: any;
  Discription: any;
  errorss: boolean;
  SrId: any;
  FileType: any;
  RegNo: any;
  data: any;
  SelectMake: any;
  type: any;
  SelectModel: any;
  SelectFuel: any;
  SelectVariant: any;
  dropdownSettingsingleselect: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  ProductType: any;
  Type: any;

  constructor(
    public api: ApiService,
    private http: HttpClient,
    public dialogRef: MatDialogRef<RenewalonlinequoteCreationComponent>,
    @Inject(MAT_DIALOG_DATA) public Data: any,
    private fb: FormBuilder
  ) {
    this.SrId = this.Data.SrId;
    this.FileType = this.Data.FileType;
    this.RegNo = this.Data.RegNo;
    this.ProductType = this.Data.ProductType;

    if (this.ProductType == "TW") {
      this.Type = 1;
    } else if (this.ProductType == "PC") {
      this.Type = 2;
    } else if (this.ProductType == "PCV") {
      this.Type = 3;
    } else if (this.ProductType == "GCV") {
      this.Type = 4;
    } else if (this.ProductType == "Misc D") {
      this.Type = 5;
    }

    this.UpdateFollowForm = this.fb.group({
      RegNo: [
        "",
        [
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9]*$"),
          Validators.minLength(9),
        ],
      ],
      QuoteMake: ["", [Validators.required]],
      QuoteModel: ["", [Validators.required]],
      QuoteFuel: ["", [Validators.required]],
      QuoteVariantValue: ["", [Validators.required]],
    });

    this.dropdownSettingsingleselect = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 2,
      enableCheckAll: false,
      allowSearchFilter: true,
    };
  }

  ngOnInit() {
    if (this.FileType != "NEW") {
      this.UpdateFollowForm.get("RegNo").setValue(this.Data.RegNo);
    } else {
      this.UpdateFollowForm.get("RegNo").setValue("");
    }

    this.GetMake("");
    this.GetModel("");
    this.GetVariant("");
    this.GetFuel("");
  }

  GetMake(SearchTerm: any) {
    const formData = new FormData();
    SearchTerm1 = "";

    if (SearchTerm != "") {
      const Searchvalue = SearchTerm.target.value;
      if (Searchvalue != "") {
        var SearchTerm1 = Searchvalue;
      }
    }

    formData.append("type", this.Type);

    formData.append("SearchMake", SearchTerm1);

    // this.api.IsLoading();
    this.api.HttpPostType("Prequotes/get_make", formData).then(
      (result) => {
        // this.api.HideLoading();

        // // console.log(result);
        if (result["Status"] == true) {
          if (result["Data"] != "") {
            this.SelectMake = result["Data"];
            this.type = result["type"];
          }
        } else {
          const Message = "Message";
          this.api.Toast("Warning", result["Message"]);
        }
      },
      (err) => {
        // this.api.HideLoading();
        const newLocal = "Warning";
        this.api.Toast(
          newLocal,
          "Network Error : " + err.name + "(" + err.statusText + ")"
        );
      }
    );
  }

  GetModel(SearchTerm: any) {
    const formData = new FormData();
    const SearchMa = this.UpdateFollowForm.get("QuoteMake").value;
    SearchTerm1 = "";
    if (SearchTerm != "") {
      const Searchvalue = SearchTerm.target.value;
      if (Searchvalue != "") {
        var SearchTerm1 = Searchvalue;
      }
    }
    formData.append("type", this.Type);
    formData.append("SearchMake", JSON.stringify(SearchMa[0]["Id"]));
    formData.append("SearchModel", SearchTerm1);

    // this.api.IsLoading();
    this.api.HttpPostType("Prequotes/get_model", formData).then(
      (result) => {
        // this.api.HideLoading();

        // console.log(result);
        if (result["Status"] == true) {
          if (result["Data"] != "") {
            this.SelectModel = result["Data"];
          }
        } else {
          const Message = "Message";
          this.api.Toast("Warning", result["Message"]);
        }
      },
      (err) => {
        // this.api.HideLoading();
        const newLocal = "Warning";
        this.api.Toast(
          newLocal,
          "Network Error : " + err.name + "(" + err.statusText + ")"
        );
      }
    );
  }

  GetFuel(SearchTerm: any) {
    const formData = new FormData();
    SearchTerm1 = "";
    const SearchMa = this.UpdateFollowForm.get("QuoteMake").value;
    const SearchMo = this.UpdateFollowForm.get("QuoteModel").value;

    if (SearchTerm != "") {
      const Searchvalue = SearchTerm.target.value;
      if (Searchvalue != "") {
        var SearchTerm1 = Searchvalue;
      }
    }

    formData.append("type", this.Type);
    formData.append("SearchMake", JSON.stringify(SearchMa[0]["Id"]));
    formData.append("SearchModel", JSON.stringify(SearchMo[0]["Id"]));
    formData.append("SearchFuel", SearchTerm1);

    // this.api.IsLoading();
    this.api.HttpPostType("Prequotes/get_fuel", formData).then(
      (result) => {
        // this.api.HideLoading();

        // // console.log(result);
        if (result["Status"] == true) {
          if (result["Data"] != "") {
            this.SelectFuel = result["Data"];
          }
        } else {
          const Message = "Message";
          this.api.Toast("Warning", result["Message"]);
        }
      },
      (err) => {
        // this.api.HideLoading();
        const newLocal = "Warning";
        this.api.Toast(
          newLocal,
          "Network Error : " + err.name + "(" + err.statusText + ")"
        );
      }
    );
  }

  GetVariant(SearchTerm: any) {
    const formData = new FormData();
    const SearchMa = this.UpdateFollowForm.get("QuoteMake").value;
    const SearchMo = this.UpdateFollowForm.get("QuoteModel").value;
    const SearchFu = this.UpdateFollowForm.get("QuoteFuel").value;
    var SearchTerm1 = "";

    if (SearchTerm != "") {
      const Searchvalue = SearchTerm.target.value;
      if (Searchvalue != "") {
        SearchTerm1 = Searchvalue;
      }
    }

    formData.append("type", this.Type);
    formData.append("SearchMake", JSON.stringify(SearchMa[0]["Id"]));
    formData.append("SearchModel", JSON.stringify(SearchMo[0]["Id"]));
    formData.append("SearchFuel", JSON.stringify(SearchFu[0]["Id"]));
    formData.append("SearchVariant", SearchTerm1);

    // this.api.IsLoading();
    this.api.HttpPostType("Prequotes/get_variant", formData).then(
      (result) => {
        // this.api.HideLoading();

        // console.log(result);
        if (result["Status"] == true) {
          if (result["Data"] != "") {
            this.SelectVariant = result["Data"];
          }
        } else {
          const Message = "Message";
          this.api.Toast("Warning", result["Message"]);
        }
      },
      (err) => {
        // this.api.HideLoading();
        const newLocal = "Warning";
        this.api.Toast(
          newLocal,
          "Network Error : " + err.name + "(" + err.statusText + ")"
        );
      }
    );
  }

  get FC() {
    return this.UpdateFollowForm.controls;
  }

  CloseModel(types, RegNos): void {
    this.dialogRef.close({
      RegNo: RegNos,
      HitTypes: types,
    });
  }

  UpdateFollowFormS() {
    this.isSubmitted = true;
    if (this.UpdateFollowForm.invalid) {
      return;
    } else {
      const formData = new FormData();
      var Fields = this.UpdateFollowForm.value;

      formData.append("Make", JSON.stringify(Fields["QuoteMake"][0]["Id"]));
      formData.append("Modal", JSON.stringify(Fields["QuoteModel"][0]["Id"]));
      formData.append("Fuel", JSON.stringify(Fields["QuoteFuel"][0]["Id"]));
      formData.append(
        "Variant",
        JSON.stringify(Fields["QuoteVariantValue"][0]["Id"])
      );
      formData.append("RegNo", Fields["RegNo"]);
      formData.append("SrId", this.SrId);
      formData.append("login_id", this.api.GetUserData("Id"));
      formData.append("login_type", this.api.GetUserType());

      this.api.IsLoading();
      this.api
        .HttpPostType(
          "Prequotes/CreateOnlineMotorQuoteAsOfflinePolicy",
          formData
        )
        .then(
          (result) => {
            this.api.HideLoading();

            // console.log(result);

            if (result["Status"] == true) {
              this.QuoteToWeb(result["Url"]);
            } else {
              const msg = "msg";
              this.api.Toast("Warning", result["Message"]);
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

    var fields = this.UpdateFollowForm.value;
    this.CloseModel(1, fields["RegNo"]);
  }

  //===== ON OPTION SELECT =====//
  onItemSelect(item: any, Type: any) {
    //Lob
    var item = item.Id;
    // // console.log(item.Id);
    if (Type == "Make") {
      this.GetModel("");

      this.SelectModel = "";
      this.SelectFuel = "";
      this.SelectVariant = "";
    }
    if (Type == "Model") {
      this.GetFuel("");
      this.SelectFuel = "";
      this.SelectVariant = "";
    }
    if (Type == "Fuel") {
      this.GetVariant("");
      this.SelectVariant = "";
    }
  }

  //===== ON OPTION DESELECT =====//
  onItemDeSelect(item: any, Type: any) {
    //Vertical

    if (Type == "Make") {
      this.GetModel("");

      this.SelectModel = "";
      this.SelectFuel = "";
      this.SelectVariant = "";
    }
    if (Type == "Model") {
      this.GetFuel("");
      this.SelectFuel = "";
      this.SelectVariant = "";
    }
    if (Type == "Fuel") {
      this.GetVariant("");
      this.SelectVariant = "";
    }
  }

  QuoteToWeb(Url) {
    var UserDatas = this.api.GetUserData("Id");
    var GetUserType = this.api.GetUserType();

    let a = document.createElement("a");
    a.target = "_blank";
    if (GetUserType == "employee") {
      a.href =
        this.api.ReturnWebUrl() +
        "/redirecting-session-users/" +
        GetUserType +
        "/" +
        btoa(UserDatas) +
        "?ReturnUrl=" +
        Url;
      // a.href =
      //   this.api.ReturnWebUrl() +
      //   "/Prequotes/SetSessionEmployee/login/" +
      //   btoa(UserDatas) +
      //   "?ReturnUrl=" +
      //   Url;
    } else {
      if (GetUserType == "user") {
        GetUserType = "agent";
      }

      a.href =
        this.api.ReturnWebUrl() +
        "/redirecting-session-users/" +
        GetUserType +
        "/" +
        btoa(UserDatas) +
        "?ReturnUrl=" +
        Url;

      // a.href =
      //   this.api.ReturnWebUrl() +
      //   "/agents/check/" +
      //   btoa(UserDatas) +
      //   "/" +
      //   btoa(GetUserType) +
      //   "/login?ReturnUrl=" +
      //   Url;
    }
    a.click();
  }

  // QuoteToWeb(Url) {
  //   var UserDatas = this.api.GetUserData("Id");
  //   var GetUserType = this.api.GetUserType();

  //   let a = document.createElement("a");
  //   a.target = "_blank";
  //   if (GetUserType == "employee") {
  //     a.href = Url;
  //   } else {
  //     a.href = Url;
  //   }
  //   a.click();
  // }
}
