import {
  FormGroup,
  FormArray,
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
import { CKEditorComponent } from "ckeditor4-angular";

@Component({
  selector: "app-main-blog",
  templateUrl: "./main-blog.component.html",
  styleUrls: ["./main-blog.component.css"],
})
export class MainBlogComponent implements OnInit {
  // @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;

  // dtOptions: DataTables.Settings = {};

  // dataAr: any;

  editor = CKEditorComponent;

  mainBlogForm!: FormGroup;
  AuthorForm: FormGroup;

  isSubmitted = false;
  isSubmittedAuthor = false;
  loadAPI: Promise<any>;
  // dataAr2: any;

  selectedFiles: File;
  image: File;

  ActionType: any = "";

  showTable: any = 1;
  type: any;
  id: any;
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

  SubProducts: { Id: number; Name: string }[];
  Category: any;
  dataArr: any;
  actiontype: any;
  url: string;
  category_name: any[];
  categoryname: any;
  category: any;
  AuthorArr: any;
  category_Name: any[];

  faqsAllVal: string = "";
  faqsVal: any[] = [];

  // showForm1: any = 0;
  // showForm2: any = 0;
  // showForm3: any = 0;
  // SingleSrLogData: any;
  // financialYearVal: { Id: string; Name: string; }[];

  constructor(
    private api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<MainBlogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.type = this.data.type;
    this.actiontype = this.data.actiontype;

    this.id = this.data.id;
    if (this.type == "Main") {
      this.mainBlogForm = this.formBuilder.group({
        title: ["", Validators.required],
        Author: [""],
        image: ["", Validators.required],
        categoryname: ["", Validators.required],
        discription: [""],
        Quotes_Url: ["", Validators.required],
        Url: ["", Validators.required],
        SelectBlog: ["", Validators.required],
        ckeditorContent: ["", Validators.required],
      });
    } else if (this.type == "Sub") {
      this.mainBlogForm = this.formBuilder.group({
        title: ["", Validators.required],
        Author: ["", Validators.required],

        image: ["", Validators.required],
        SelectBlog: ["", Validators.required],
        categoryname: ["", Validators.required],
        ckeditorContent: ["", Validators.required],
        discription: ["", Validators.required],
        Url: ["", Validators.required],
        faqs: this.formBuilder.array([this.createFaqGroup()]),
      });
    } else if (this.type == "Author") {
      // AuthorForm
      this.AuthorForm = this.formBuilder.group({
        authorName: ["", Validators.required],
        authoreImage: ["", Validators.required],
        aboutAuthore: ["", Validators.required],
        link: ["", Validators.required],
        Certificates: ["", Validators.required],
        Education: ["", Validators.required],
        Experience: ["", Validators.required],
      });
    }

    if (this.actiontype == "Edit" && this.type != "Author") {
      const image = this.mainBlogForm.get("image");
      image.setValidators(null);
    }
    if (this.actiontype == "Edit" && this.type == "Author") {
      const image = this.AuthorForm.get("authoreImage");
      image.setValidators(null);
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
  }

  ngOnInit() {
    if (this.type != "Author") {
      this.FilterCategory();
    }
    if (this.actiontype == "Edit" && this.type != "Author") {
      this.getValueEdit();
    }
    if (this.actiontype == "Edit" && this.type == "Author") {
      this.getValueAuthore();
    }
  }

  // Create FAQ Form Group
  createFaqGroup(faq?: any): FormGroup {
    return this.formBuilder.group({
      faqTitle: [faq ? faq.faqTitle : ""],
      ckeditorFaqDescription: [faq ? faq.ckeditorFaqDescription : ""],
    });
  }

  // Getter for FAQs FormArray
  get faqs(): FormArray {
    return this.mainBlogForm.get("faqs") as FormArray;
  }

  // Add New FAQ
  addFAQ(): void {
    this.faqs.push(this.createFaqGroup());
  }

  // Remove FAQ
  removeFAQ(index: number): void {
    this.faqs.removeAt(index);
  }

  FilterCategory() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "WebsiteSection/FilterCategory?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType()
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == 1) {
            this.Category = result["Data"];
            this.AuthorArr = result["AuthorArr"];
            // console.log(this.Category);
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

  getValueEdit() {
    const formData = new FormData();

    formData.append("login_type", this.api.GetUserType());

    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("id", this.id);
    formData.append("type", this.type);

    this.api.IsLoading();
    this.api.HttpPostType("WebsiteSection/EditBlogs", formData).then(
      (result) => {
        this.api.HideLoading();
        // console.log(result);

        if (result["status"] == true) {
          this.dataArr = result["data"];
          this.faqsAllVal = result["faqs"];

          if (this.faqsAllVal && typeof this.faqsAllVal === "string") {
            try {
              this.faqsVal = JSON.parse(this.faqsAllVal.replace(/\n/g, ""));
              this.mainBlogForm.setControl("faqs", this.formBuilder.array([]));

              if (Array.isArray(this.faqsVal)) {
                this.faqsVal.forEach((faq) => {
                  this.faqs.push(this.createFaqGroup(faq));
                });
              }
            } catch (e) {
              console.error("Error parsing FAQs:", e);
              this.faqsVal = []; // Corrected: Reset `faqsVal` instead of `faqsAllVal`
            }
          }

          this.mainBlogForm.patchValue(this.dataArr);
          this.category_Name = [result["category"]];
          // console.log(this.category_Name);
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

  getValueAuthore() {
    const formData = new FormData();
    formData.append("login_type", this.api.GetUserType());
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("id", this.id);
    formData.append("type", this.type);

    this.api.IsLoading();
    this.api.HttpPostType("WebsiteSection/EditAuthor", formData).then(
      (result) => {
        this.api.HideLoading();
        if (result["status"] == true) {
          this.dataArr = result["data"];
          this.AuthorForm.patchValue(this.dataArr);
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

  get formControls() {
    return this.mainBlogForm.controls;
  }

  submit() {
    this.isSubmitted = true;

    if (this.mainBlogForm.invalid) {
      return;
    } else {
      var fields = this.mainBlogForm.value;

      const formData = new FormData();

      formData.append("user_id", this.api.GetUserData("Id"));
      formData.append("user_type", this.api.GetUserType());

      if (this.actiontype == "Edit") {
        formData.append("Id", this.id);
      }

      formData.append("type", this.type);
      formData.append("Action", this.actiontype);

      if (this.type == "Main") {
        formData.append("categoryname", fields["categoryname"]);
        formData.append("Quotes_Url", fields["Quotes_Url"]);
      }
      if (this.type == "Sub") {
        formData.append("categoryname", fields["categoryname"][0]["Name"]);
        formData.append("Author", fields["Author"][0]["Id"]);
      }
      formData.append("title", fields["title"]);
      formData.append("Url", fields["Url"]);
      formData.append("discription", fields["discription"]);
      formData.append("ckeditorContent", fields["ckeditorContent"]);
      formData.append("image", this.image);

      // Add FAQs data

      if(this.type!='Main'){
        const faqsArray = this.faqs.controls.map((faq) => ({
          faqTitle: faq.value.faqTitle,
          ckeditorFaqDescription: faq.value.ckeditorFaqDescription,
        }));
        formData.append("faqs", JSON.stringify(faqsArray));
      }
     

      // console.log(formData);

      if (this.actiontype == "Add") {
        this.url = "WebsiteSection/MainBlogdata";
      } else if (this.actiontype == "Edit") {
        this.url = "WebsiteSection/updateBlogData";
      }

      // // console.log('formData');
      this.api.IsLoading();
      this.api.HttpPostType(this.url, formData).then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);
          if (result["status"] == 1) {
            this.api.Toast("Success", result["msg"]);
            this.CloseModel();
            // this.router.navigate(["Mypos/View-Docs"]);
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

  submitAuthor() {
    this.isSubmittedAuthor = true;
    if (this.AuthorForm.invalid) {
      return;
    } else {
      var fields = this.AuthorForm.value;
      const formData = new FormData();
      formData.append("user_id", this.api.GetUserData("Id"));
      formData.append("user_type", this.api.GetUserType());
      formData.append("authorName", fields["authorName"]);
      formData.append("aboutAuthore", fields["aboutAuthore"]);
      formData.append("link", fields["link"]);
      formData.append("Certificates", fields["Certificates"]);
      formData.append("Education", fields["Education"]);
      formData.append("Experience", fields["Experience"]);
      formData.append("image", this.image);
      if (this.actiontype == "Edit") {
        formData.append("Id", this.id);
      }
      if (this.actiontype == "Add") {
        this.url = "WebsiteSection/AddAuthor";
      } else if (this.actiontype == "Edit") {
        this.url = "WebsiteSection/updateAuthor";
      }
      this.api.IsLoading();
      this.api.HttpPostType(this.url, formData).then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == 1) {
            this.api.Toast("Success", result["msg"]);
            this.CloseModel();
          } else {
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
            this.mainBlogForm.get("image").setValue("");
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
          this.mainBlogForm.get("image").setValue("");
        }
      }
    }
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }
}
