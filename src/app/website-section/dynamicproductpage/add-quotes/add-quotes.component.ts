import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "../../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from "../../../../environments/environment";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { DataTableDirective } from "angular-datatables";

@Component({
  selector: "app-add-quotes",
  templateUrl: "./add-quotes.component.html",
  styleUrls: ["./add-quotes.component.css"],
})
export class AddQuotesComponent implements OnInit {
  Addquotes: FormGroup;

  isSubmitted = false;

  loadAPI: Promise<any>;
  SelectedFiles: File;
  PosterImage: File;

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

  Page: { Id: string; Name: string }[];
  type: any;
  id: any;
  dataArr: any;
  minDisableDate: any;
  categoryName: any;
  url: string;
  logoimage: File;
  pagename: any;
  currentUrl: string;
  urlSegment: string;
  urlSegment2: string;
  urlSegment3: string;

  constructor(
    private api: ApiService,
    private router: Router,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.currentUrl = this.router.url;
    // console.log(this.currentUrl);
    var splitted = this.currentUrl.split("/");
    // console.log(splitted);

    if (typeof splitted[2] != "undefined") {
      this.urlSegment = splitted[2];
    }
    if (typeof splitted[3] != "undefined") {
      this.urlSegment2 = splitted[3];
    }
    if (typeof splitted[4] != "undefined") {
      this.urlSegment3 = splitted[4];
    }

    if (this.urlSegment2 == "add-quotes") {
      this.id = "";
    } else {
      this.id = this.urlSegment3;
    }

    if (this.id == "") {
      this.Addquotes = this.formBuilder.group({
        pagename: ["", Validators.required],
        logoimage: ["", Validators.required],
        companyname: ["", Validators.required],
        Comprehensiveprice: ["", Validators.required],
        thirdpartyprice: ["", Validators.required],
        owndamageprice: ["", Validators.required],
      });
    } else {
      this.Addquotes = this.formBuilder.group({
        pagename: ["", Validators.required],
        logoimage: [""],
        companyname: ["", Validators.required],
        Comprehensiveprice: ["", Validators.required],
        thirdpartyprice: ["", Validators.required],
        owndamageprice: ["", Validators.required],
      });
    }

    this.dropdownSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.dropdownSettingsMultiselect = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
      limitSelection: 5,
    };

    this.Page = [
      { Id: "bike-insurance-policy", Name: "Bike Insurance" },
      { Id: "car-insurance-policy", Name: "Car Insurance" },
      { Id: "health-insurance", Name: "Health Insurance" },
      { Id: "life-insurance", Name: "Life Insurance" },
      { Id: "travel-insurance", Name: "Travel Insurance" },
      { Id: "property-insurance", Name: "Property Insurance" },
      { Id: "marine-insurance", Name: "Marine Insurance" },
      { Id: "commercial-insurance", Name: "Commercial Insurance" },
      { Id: "pet-insurance", Name: "Pet Insurance" },
      { Id: "term-insurance", Name: "Term Insurance" },
    ];
  }

  ngOnInit() {
    if (this.id != "") {
      this.getQuoteValueEdit();
    }
  }

  // CloseModel(): void {
  //   this.dialogRef.close({
  //     Status: 'Model Close'
  //   });
  // }

  getQuoteValueEdit() {
    // console.log(this.id);
    // console.log(this.type);

    //  var fields = this.loginform.value;
    const formData = new FormData();

    formData.append("login_type", this.api.GetUserType());

    formData.append("login_id", this.api.GetUserData("Id"));

    formData.append("id", this.id);
    formData.append("type", this.type);

    this.api.IsLoading();
    this.api.HttpPostType("WebsiteSection/GetQuoteValueEdit", formData).then(
      (result) => {
        this.api.HideLoading();
        // console.log(result);

        if (result["status"] == true) {
          this.dataArr = result["data"];

          this.pagename = result["pagename"];

          this.Addquotes.patchValue(this.dataArr);
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

  get formControls() {
    return this.Addquotes.controls;
  }

  submit() {
    // console.log(this.id);

    this.isSubmitted = true;
    if (this.Addquotes.invalid) {
      return;
    } else {
      var fields = this.Addquotes.value;
      const formData = new FormData();

      formData.append("companyname", fields["companyname"]);
      formData.append("pagename", fields["pagename"][0]["Id"]);
      formData.append("Comprehensiveprice", fields["Comprehensiveprice"]);
      formData.append("thirdpartyprice", fields["thirdpartyprice"]);
      formData.append("owndamageprice", fields["owndamageprice"]);
      formData.append("image", this.logoimage);
      formData.append("login_type", this.api.GetUserType());
      formData.append("login_id", this.api.GetUserData("Id"));

      // console.log(fields);

      this.api.IsLoading();

      if (this.id != "") {
        formData.append("Id", this.id);

        this.url = "WebsiteSection/EditQuoteValue";
      } else {
        this.url = "WebsiteSection/AddProductQuotes";
      }

      this.api.HttpPostType(this.url, formData).then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);

          if (result["status"] == true) {
            this.api.Toast("Success", result["msg"]);
            this.router.navigate(["WebsiteSection/products/view-quotes"]);
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

  UploadDocs(event, Type) {
    this.SelectedFiles = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      var str = this.SelectedFiles.name;
      var ar = str.split(".");
      // console.log(ar);
      var ext;
      for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();
      // console.log(ext);

      if (
        ext == "png" ||
        ext == "jpeg" ||
        ext == "jpg" ||
        ext == "pdf" ||
        ext == "avif" || ext == "webp"
      ) {
        // console.log("Extenstion is vaild !");
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);
        // alert(Total_Size);
        // console.log(Total_Size + " kb");

        if (Total_Size >= 10240) {
          // allow only 2 mb

          this.api.Toast("Error", "File size is greater than 10 mb");

          if (Type == "logoimage") {
            this.Addquotes.get("logoimage").setValue("");
          }
        } else {
          if (Type == "logoimage") {
            this.logoimage = this.SelectedFiles;
          }
        }
      } else {
        // console.log("Extenstion is not vaild !");

        this.api.Toast(
          "Error",
          "Please choose vaild file ! Example :- PNG,JPEG,JPG,PDF"
        );
      }
    }
  }
}
