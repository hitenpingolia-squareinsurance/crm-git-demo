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
  selector: 'app-employee-resign-details',
  templateUrl: './employee-resign-details.component.html',
  styleUrls: ['./employee-resign-details.component.css']
})
export class EmployeeResignDetailsComponent implements OnInit {
  AddEmployeeDetails: FormGroup;

  isSubmitted = false;

  loadAPI: Promise<any>;
  SelectedFiles: File;
  Noclettar: File;

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

  NocStatus: { Id: string; Name: string }[];
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
    public dialogRef: MatDialogRef<EmployeeResignDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.type = this.data.type;
    this.id = this.data.id;
    this.AddEmployeeDetails = this.formBuilder.group({
      NocStatus: ["", Validators.required],
      ResignDate: ["", Validators.required],
      Noclettar: ["", Validators.required],
      remark: ["", Validators.required],
    });
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

    this.NocStatus = [
      { Id: "Yes", Name: "Yes" },
      { Id: "No", Name: "No" },
    ];
  }
  ngOnInit() {

  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }



  get formControls() {
    return this.AddEmployeeDetails.controls;
  }

  submit() {
    this.isSubmitted = true;
    if (this.AddEmployeeDetails.invalid) {
      return;
    } else {
      var fields = this.AddEmployeeDetails.value;
      const formData = new FormData();
      formData.append("NocStatus", JSON.stringify(fields["NocStatus"]));
      formData.append("ResignDate", fields["ResignDate"]);
      formData.append("remark", fields["remark"]);
      formData.append("image", this.Noclettar);
      formData.append("id", this.id);
      this.api.IsLoading();
      if (this.type == "Edit") {
        formData.append("Id", this.id);
        this.url = "b-crm/EmployeeResign/AddEmployeeDetails";
      } else {
        this.url = "b-crm/EmployeeResign/AddEmployeeDetails";
      }

      this.api.HttpPostType(this.url, formData).then(
        (result: any) => {
          this.api.HideLoading();
          // console.log(result);

          if (result["status"] == true) {
            this.api.Toast("Success", result["msg"]);
            this.CloseModel();
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

  UploadDocs(event, Type) {
    this.SelectedFiles = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      var str = this.SelectedFiles.name;
      var ar = str.split(".");
      var ext;
      for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();
      if (ext == "pdf" || ext == "jpg" || ext == "jpeg" || ext == "png") {
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);

        if (Total_Size >= 10240) {
          this.api.Toast("Error", "File size is greater than 10 mb");

          if (Type == "Noclettar") {
            this.AddEmployeeDetails.get("Noclettar").setValue("");
          }
        } else {
          if (Type == "Noclettar") {
            this.Noclettar = this.SelectedFiles;
          }
        }
      } else {
        this.api.Toast(
          "Error",
          "Please choose vaild file ! Example :- PNG,JPEG,JPG,PDF"
        );
      }
    }
  }
}
