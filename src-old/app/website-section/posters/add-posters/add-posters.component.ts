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
  selector: "app-add-posters",
  templateUrl: "./add-posters.component.html",
  styleUrls: ["./add-posters.component.css"],
})
export class AddPostersComponent implements OnInit {
  Addposter: FormGroup;

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

  dropdownSettingsMultiselect: any = {};

  Category: { Id: string; Name: string }[];
  Type: { Id: string; Name: string }[];
  type: any;
  id: any;
  dataArr: any;
  minDisableDate: any;
  categoryName: any;
  typeName: any;
  url: string;

  constructor(
    private api: ApiService,
    private router: Router,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<AddPostersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.type = this.data.type;
    this.id = this.data.id;

    if (this.type == "Add") {
      this.Addposter = this.formBuilder.group({
        Title: ["", Validators.required],
        type: [[], Validators.required],
        category: ["", Validators.required],
        enabledate: ["", Validators.required],
        disabledate: ["", Validators.required],
        PosterImage: ["", Validators.required],
      });
    } else {
      this.Addposter = this.formBuilder.group({
        Title: ["", Validators.required],
        type: [[], Validators.required],
        category: ["", Validators.required],
        enabledate: ["", Validators.required],
        disabledate: ["", Validators.required],
        PosterImage: [""],
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

    // this.dropdownSettingsMultiselect = {
    //   singleSelection: false,
    //   idField: "Id",
    //   textField: "Name",
    //   itemsShowLimit: 4,
    //   enableCheckAll: true,
    //   selectAllText: "Select All",
    //   unSelectAllText: "UnSelect All",
    //   allowSearchFilter: true,
    //   limitSelection: 5
    // };
    

    this.dropdownSettingsMultiselect = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: true,
      allowSearchFilter: true,
    };
    

    // Category (Bike, Car, PCV, GCV, MISCD, Health, PA, Travel, Life, Marine, POS, Holi, Diwali, Republic day, independence day, other event, market update, event) can choose
    this.Category = [
      { Id: "Bike", Name: "Bike" },
      { Id: "Car", Name: "Car" },
      { Id: "PCV", Name: "PCV" },
      { Id: "GCV", Name: "GCV" },
      { Id: "MISCD", Name: "MISCD" },
      { Id: "Health", Name: "Health" },
      { Id: "PA", Name: "PA" },
      { Id: "Travel", Name: "Travel" },
      { Id: "Life", Name: "Life" },
      { Id: "Marine", Name: "Marine" },
      { Id: "POS", Name: "POS" },
      { Id: "Holi", Name: "Holi" },
      { Id: "Diwali", Name: "Diwali" },
      { Id: "Republic Day", Name: "Republic Day" },
      { Id: "Independence Day", Name: "Independence Day" },
      { Id: "Other Event", Name: "Other Event" },
      { Id: "Market Update", Name: "Market Update" },
      { Id: "Event", Name: "Event" },
    ];

    this.Type = [
      { Id: "Employee", Name: "Employee" },
      { Id: "POSP", Name: "POSP" },
      { Id: "SP", Name: "SP" },
      { Id: "User", Name: "User" },
    ];
  }


  validateDisableDate(control) {
    const enableDate = this.Addposter.get("enabledate").value;
    const disableDate = control.value;

    if (
      enableDate &&
      disableDate &&
      new Date(disableDate) <= new Date(enableDate)
    ) {
      return { invalidDate: true };
    }

    return null;
  }

  updateMinDisableDate() {
    // Set the minDisableDate to the selected Enable Date
    const enableDate = this.Addposter.get("enabledate").value;
    this.minDisableDate = enableDate;
  }

  ngOnInit() {
    if (this.type == "Edit") {
      this.getValueEdit();
    }
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  getValueEdit() {
    // console.log(this.id);
    // console.log(this.type);

    //  var fields = this.loginform.value;
    const formData = new FormData();

    formData.append("login_type", this.api.GetUserType());

    formData.append("login_id", this.api.GetUserData("Id"));

    formData.append("id", this.id);
    formData.append("type", this.type);

    this.api.IsLoading();
    this.api.HttpPostType("WebsiteSection/GetPosterEditValue", formData).then(
      (result) => {
        this.api.HideLoading();
        // console.log(result);

        if (result["status"] == true) {
          this.dataArr = result["data"];

          this.categoryName = result["category"];
          this.typeName = result["type"];

          this.Addposter.patchValue(this.dataArr);
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
    return this.Addposter.controls;
  }

  submit() {
    // console.log(this.id);

    this.isSubmitted = true;
    if (this.Addposter.invalid) {
      return;
    } else {
      var fields = this.Addposter.value;
      const formData = new FormData();

      formData.append("title", fields["Title"]);
      formData.append("type", JSON.stringify(fields["type"]));
      formData.append("category", fields["category"][0]["Id"]);
      formData.append("enabledate", fields["enabledate"]);
      formData.append("disabledate", fields["disabledate"]);

      formData.append("image", this.PosterImage);

      // console.log(fields);

      this.api.IsLoading();

      if (this.type == "Edit") {
        formData.append("Id", this.id);
        this.url = "WebsiteSection/EditPoster";
      } else {
        this.url = "WebsiteSection/AddPoster";
      }

      this.api.HttpPostType(this.url, formData).then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);

          if (result["status"] == true) {
            this.api.Toast("Success", result["msg"]);
            this.CloseModel();
            // this.router.navigate(["/Assets/Products"]);
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
        ext == "webp" ||
        ext == "svg"
      ) {
        // console.log("Extenstion is vaild !");
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);
        // alert(Total_Size);
        // console.log(Total_Size + " kb");

        if (Total_Size >= 10240) {
          // allow only 2 mb

          this.api.Toast("Error", "File size is greater than 10 mb");

          if (Type == "PosterImage") {
            this.Addposter.get("PosterImage").setValue("");
          }
        } else {
          if (Type == "PosterImage") {
            this.PosterImage = this.SelectedFiles;
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
