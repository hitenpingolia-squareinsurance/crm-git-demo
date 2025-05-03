import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-add-dynamic-value",
  templateUrl: "./add-dynamic-value.component.html",
  styleUrls: ["./add-dynamic-value.component.css"],
})
export class AddDynamicValueComponent implements OnInit {
  selectedFiles: File;

  DynamicImageAdd: FormGroup;
  isSubmitted = false;
  SelectedFiles: File;
  image: File;

  dropdownSettingsType: any = "";
  dropdownSettingsMultiselect: any = "";
  dropdownSingleSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };

  Page: { Id: string; Name: string }[];
  currentUrl: string;
  urlSegment: string;
  urlSegment2: string;
  urlSegment3: string;
  id: string;
  dataArr: any;
  pagename: any;
  url: any;

  constructor(
    public api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder
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

    if (this.urlSegment2 == "add_dynamic_images") {
      this.id = "";
    } else {
      this.id = this.urlSegment3;
    }

    this.dropdownSingleSettingsType = {
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

    this.dropdownSettingsType = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
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

    if (this.id == "") {
      this.DynamicImageAdd = this.formBuilder.group({
        pagename: ["", Validators.required],
        position: ["", Validators.required],
        price: [""],
        image: ["", Validators.required],
        content: [""],
      });
    } else {
      this.DynamicImageAdd = this.formBuilder.group({
        pagename: ["", Validators.required],
        position: ["", Validators.required],
        price: [""],
        image: [""],
        content: [""],
      });
    }
  }

  ngOnInit() {
    if (this.id != "" && this.id != "undefined") {
      this.getimageValue();
    } else {
    }
  }

  getimageValue() {
    // console.log(this.id);

    //  var fields = this.loginform.value;
    const formData = new FormData();

    formData.append("login_type", this.api.GetUserType());

    formData.append("login_id", this.api.GetUserData("Id"));

    formData.append("id", this.id);

    this.api.IsLoading();
    this.api.HttpPostType("WebsiteSection/GetImageValue", formData).then(
      (result) => {
        this.api.HideLoading();
        // console.log(result);

        if (result["status"] == true) {
          this.dataArr = result["data"];

          this.pagename = result["pagename"];

          this.DynamicImageAdd.patchValue(this.dataArr);
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
        ext == "avif" ||
        ext == "svg" || ext == "webp"
      ) {
        // console.log("Extenstion is vaild !");
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);
        // alert(Total_Size);
        // console.log(Total_Size + " kb");

        if (Total_Size > 500) {
          // allow only 2 mb

          alert("File size is greater than 500 kb");

          this.DynamicImageAdd.get("image").setValue("");
        } else {
          this.image = this.SelectedFiles;
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

  get formControls() {
    return this.DynamicImageAdd.controls;
  }

  Submit() {
    // alert(this.Divshow);

    this.isSubmitted = true;

    if (this.DynamicImageAdd.invalid) {
      return;
    } else {
      var fields = this.DynamicImageAdd.value;
      const formData = new FormData();

      formData.append("login_id", this.api.GetUserData("Id"));
      formData.append("login_type", this.api.GetUserType());
      formData.append("pagename", fields["pagename"][0]["Id"]);
      formData.append("position", fields["position"]);
      formData.append("price", fields["price"]);
      formData.append("content", fields["content"]);

      formData.append("image", this.image);

      if (this.id != "") {
        formData.append("Id", this.id);
        this.url = "WebsiteSection/EditDynamicContent";
      } else {
        this.url = "WebsiteSection/AddDynamicContent";
      }

      // // console.log(formData);

      this.api.IsLoading();
      this.api.HttpPostType(this.url, formData).then(
        (result) => {
          this.api.HideLoading();

          // console.log(result);

          if (result["status"] == 1) {
            this.api.Toast("Success", result["msg"]);

            this.router.navigate([
              "WebsiteSection/products/view_image_product",
            ]);
          } else {
            const msg = "msg";
            this.api.Toast("Warning", result["msg"]);
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
}
