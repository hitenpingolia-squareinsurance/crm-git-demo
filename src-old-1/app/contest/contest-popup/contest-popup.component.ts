import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { DataTableDirective } from "angular-datatables";

@Component({
  selector: "app-contest-popup",
  templateUrl: "./contest-popup.component.html",
  styleUrls: ["./contest-popup.component.css"],
})
export class ContestPopupComponent implements OnInit {
  AddContest: FormGroup;

  isSubmitted = false;

  loadAPI: Promise<any>;
  SelectedFiles: File;
  ContestImage: File;

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

  Category: { Id: string; Name: string }[];
  type: any;
  id: any;
  dataArr: any;
  minDisableDate: any;
  categoryName: any;
  url: string;

  constructor(
    private api: ApiService,
    private router: Router,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<ContestPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.type = this.data.type;
    this.id = this.data.id;

    if (this.type == "Add") {
      this.AddContest = this.formBuilder.group({
        Contest_Name: ["", Validators.required],
        category: ["", Validators.required],
        enabledate: ["", Validators.required],
        disabledate: ["", Validators.required],
        ContestImage: ["", Validators.required],
        remark: ["", Validators.required],
      });
    } else {
      this.AddContest = this.formBuilder.group({
        Contest_Name: ["", Validators.required],
        category: ["", Validators.required],
        enabledate: ["", Validators.required],
        disabledate: ["", Validators.required],
        ContestImage: [""],
        remark: ["", Validators.required],
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

    this.Category = [
      { Id: "POSP", Name: "POSP" },
      { Id: "Employee", Name: "Employee" },
    ];
  }

  validateDisableDate(control) {
    const enableDate = this.AddContest.get("enabledate").value;
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
    const enableDate = this.AddContest.get("enabledate").value;
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
    const formData = new FormData();

    formData.append("login_type", this.api.GetUserType());

    formData.append("login_id", this.api.GetUserData("Id"));

    formData.append("id", this.id);
    formData.append("type", this.type);

    this.api.IsLoading();
    this.api.HttpPostType("contest/GetContestEditValue", formData).then(
      (result) => {
        this.api.HideLoading();
        // console.log(result);

        if (result["status"] == true) {
          this.dataArr = result["data"];

          this.categoryName = result["category"];

          this.AddContest.patchValue(this.dataArr);
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
    return this.AddContest.controls;
  }

  submit() {
    // console.log(this.id);

    this.isSubmitted = true;
    if (this.AddContest.invalid) {
      return;
    } else {
      var fields = this.AddContest.value;
      const formData = new FormData();

      formData.append("Contest_Name", fields["Contest_Name"]);
      // formData.append("category", fields["category"][0]["Id"]);
      formData.append("category", JSON.stringify(fields["category"]));
      formData.append("enabledate", fields["enabledate"]);
      formData.append("disabledate", fields["disabledate"]);
      formData.append("remark", fields["remark"]);
      formData.append("image", this.ContestImage);

      // console.log(fields);

      this.api.IsLoading();
      if (this.type == "Edit") {
        formData.append("Id", this.id);
        this.url = "contest/EditContest";
      } else {
        this.url = "contest/AddContest";
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
      // pdf, jpg, jpeg, png
      if (ext == "pdf" || ext == "jpg" || ext == "jpeg" || ext == "png") {
        // console.log("Extenstion is vaild !");
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);
        // alert(Total_Size);
        // console.log(Total_Size + " kb");

        if (Total_Size >= 10240) {
          this.api.Toast("Error", "File size is greater than 10 mb");

          if (Type == "ContestImage") {
            this.AddContest.get("ContestImage").setValue("");
          }
        } else {
          if (Type == "ContestImage") {
            this.ContestImage = this.SelectedFiles;
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
