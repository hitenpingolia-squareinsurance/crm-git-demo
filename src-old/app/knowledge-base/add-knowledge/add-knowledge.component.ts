import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";

import * as $ from "jquery";

@Component({
  selector: "app-add-knowledge",
  templateUrl: "./add-knowledge.component.html",
  styleUrls: ["./add-knowledge.component.css"],
})
export class AddKnowledgeComponent implements OnInit {
  isSubmitted = false;
  isSubmitted1 = false;

  KnowledgeBaseForm: FormGroup;
  selectedFiles: any;
  ImageValueSingleimage: any;
  file: any;
  filetypesbcategory: any;
  agentvalue: any;
  dataAr: any;
  catdata: any;
  categoryval: any;
  subcat: any;
  subcategoryval: any;
  dropdownSingleSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  dropdownMultiSelectSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  UserType: { Id: string; Name: string }[];
  subcategory: { Id: string; Name: string }[];
  CategoryData: any;
  SubCategoryData: any;
  FileTypeData: { Id: string; Name: string }[];
  FileTypeVal: any = "";
  FileValueImage: any;
  AddCatForm: FormGroup;
  TypeData: { Id: string; Name: string }[];
  TypeVal: any;
  currentUrl: string;
  Id: string;
  EditDescription: any;
  EditSubCat: any;
  EditCat: any;
  EditFileTypeData: any;
  EditUserType: any;
  // subcategory: { id: string; text: string; }[];
  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.dropdownSingleSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.dropdownMultiSelectSettingsType = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.FileTypeData = [
      {
        Id: "URL",
        Name: "URL",
      },
      {
        Id: "Document",
        Name: "Document",
      },
    ];
    this.TypeData = [
      {
        Id: "Category",
        Name: "Category",
      },

      {
        Id: "SubCategory",
        Name: "SubCategory",
      },
    ];
    this.UserType = [
      {
        Id: "agent",
        Name: "Agent",
      },
      {
        Id: "sp",
        Name: "SP",
      },
      {
        Id: "employee",
        Name: "Employee",
      },
    ];
    this.KnowledgeBaseForm = this.fb.group({
      UserType: ["", Validators.required],
      Category: ["", Validators.required],
      SubCategory: [""],
      Description: ["", Validators.required],
      Title: ["", Validators.required],
      FileType: ["", Validators.required],
      FileValue: ["", Validators.required],
    });

    this.AddCatForm = this.fb.group({
      Type: ["", Validators.required],
      Category: [""],
      Title: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    this.GetCategory();

    this.currentUrl = this.router.url;

    var splitted = this.currentUrl.split("/");
    // alert(splitted[2]);

    if (typeof splitted[3] != "undefined" && splitted[3] != "") {
      this.Id = splitted[3];
      this.getSingleknowledgebase();
    }
  }

  onItemSelect(item: any, Type: any) {
    if (Type == "FileType") {
      this.FileTypeVal = item.Id;
      this.KnowledgeBaseForm.get("FileValue").setValue("");
    }

    if (Type == "Category") {
      this.GetSubCategory();
    }

    if (Type == "Type") {
      this.TypeVal = item.Id;
      this.AddCatForm.get("title").setValue("");
      this.AddCatForm.get("Category").setValue("");
      this.GetCategory();
    }
  }

  //===== ON OPTION DESELECT =====//
  onItemDeSelect(item: any, Type: any) {
    if (Type == "FileType") {
      this.FileTypeVal = "";
      this.KnowledgeBaseForm.get("FileValue").setValue("");
    }
    if (Type == "Category") {
      this.GetSubCategory();
    }
    if (Type == "Type") {
      this.TypeVal = "";
      this.AddCatForm.get("title").setValue("");
      this.AddCatForm.get("Category").setValue("");
    }
  }

  get formControls() {
    return this.KnowledgeBaseForm.controls;
  }
  get formControls2() {
    return this.AddCatForm.controls;
  }

  getSingleknowledgebase() {
    const formData = new FormData();
    formData.append("Id", this.Id);

    this.api
      .HttpPostType("KnowledgeBase/getSingleknowledgebase", formData)
      .then(
        (result) => {
          if (result["Status"] == true) {
            this.KnowledgeBaseForm.get("Title").setValue(result["Data"].Title);
            this.KnowledgeBaseForm.get("FileValue").setValue(
              result["Data"].FileValue
            );

            this.EditDescription = result["Data"].Description;
            this.EditCat = result["Category"];
            this.EditSubCat = result["SubCategory"];
            this.EditFileTypeData = result["FileTypeData"];
            this.EditUserType = result["EditUserType"];

            this.FileTypeVal = this.EditFileTypeData[0].Id;
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

      if (
        ext == "png" ||
        ext == "jpeg" ||
        ext == "jpg" ||
        ext == "pdf" ||
        ext == "pdf"
      ) {
        // console.log("Extenstion is vaild !");
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);
        // alert(Total_Size);
        // console.log(Total_Size + " kb");

        if (Total_Size >= 10240) {
          // allow only 2 mb

          this.api.Toast("Error", "File size is greater than 10 mb");

          if (Type == "Document") {
            this.KnowledgeBaseForm.get("FileValue").setValue("");
            this.FileValueImage = "";
          }
        } else {
          if (Type == "Document") {
            this.FileValueImage = this.selectedFiles;
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

  Submit() {
    // alert();
    this.isSubmitted = true;
    if (this.KnowledgeBaseForm.invalid) {
      return;
    } else {
      // alert();
      var fields = this.KnowledgeBaseForm.value;
      // console.log(fields);
      const formData = new FormData();
      if (this.FileTypeVal == "URL") {
        this.FileValueImage = fields["FileValue"];
      }

      formData.append("UserType", JSON.stringify(fields["UserType"]));
      formData.append("Category", JSON.stringify(fields["Category"]));
      formData.append("SubCategory", JSON.stringify(fields["SubCategory"]));
      formData.append("Description", fields["Description"]);
      formData.append("Title", fields["Title"]);
      formData.append("FileType", JSON.stringify(fields["FileType"]));
      formData.append("FileValue", this.FileValueImage);

      // console.log(formData);
      this.api.IsLoading();

      var urls = "";
      var splitted = this.currentUrl.split("/");

      if (typeof splitted[3] != "undefined" && splitted[3] != "") {
        formData.append("Id", this.Id);
        urls = "KnowledgeBase/EditKnowledgeBase";
      } else {
        urls = "KnowledgeBase/Submit";
      }

      this.api.HttpPostType(urls, formData).then(
        (result) => {
          this.api.HideLoading();

          // console.log(result);

          if (result["Status"] == true) {
            this.api.Toast("Success", result["msg"]);
            this.router.navigate(["knowledge/view-knowledge"]);
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

  GetCategory() {
    const formData = new FormData();

    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());

    this.api.IsLoading();
    this.api.HttpPostType("KnowledgeBase/GetCategory", formData).then(
      (result) => {
        this.api.HideLoading();

        // console.log(result);

        if (result["Status"] == true) {
          // this.api.Toast("Success", result["msg"]);
          this.CategoryData = result["Data"];
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

  GetSubCategory() {
    const formData = new FormData();
    var fields = this.KnowledgeBaseForm.value;

    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());

    formData.append("Category", JSON.stringify(fields["Category"]));

    this.api.IsLoading();
    this.api.HttpPostType("KnowledgeBase/GetSubCategory", formData).then(
      (result) => {
        this.api.HideLoading();

        // console.log(result);

        if (result["Status"] == true) {
          // this.api.Toast("Success", result["msg"]);
          this.SubCategoryData = result["Data"];
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

  SubmitCat() {
    // alert();
    this.isSubmitted1 = true;
    if (this.AddCatForm.invalid) {
      return;
    } else {
      // alert();
      var fields = this.AddCatForm.value;
      const formData = new FormData();

      formData.append("Type", JSON.stringify(fields["Type"]));
      formData.append("Category", JSON.stringify(fields["Category"]));
      formData.append("Title", fields["Title"]);

      // console.log(formData);
      this.api.IsLoading();
      this.api.HttpPostType("KnowledgeBase/AddCategory", formData).then(
        (result) => {
          this.api.HideLoading();

          // console.log(result);

          if (result["Status"] == true) {
            this.api.Toast("Success", result["msg"]);
            this.AddCatForm.reset();
            $("#ClosePOUPUP").trigger("click");
            this.CategoryData();

            // this.CategoryData = result["Data"];
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
