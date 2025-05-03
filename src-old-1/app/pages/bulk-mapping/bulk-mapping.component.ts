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
  selector: "app-bulk-mapping",
  templateUrl: "./bulk-mapping.component.html",
  styleUrls: ["./bulk-mapping.component.css"],
})
export class BulkMappingComponent implements OnInit {
  // @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;

  // dtOptions: DataTables.Settings = {};

  // dataAr: any;

  AddContact: FormGroup;

  isSubmitted = false;
  loadAPI: Promise<any>;
  // dataAr2: any;

  selectedFiles: File;
  policywording: File;
  proposal: File;
  claim: File;
  brochure: File;
  hospitallist: File;

  ActionType: any = "";

  showTable: any = 1;

  Company: any;
  Product: any;
  SubProduct: any;
  Type: any;
  Lob: any;

  SubProducts: { Id: number; Name: string }[];
  productvalue: any;
  id: any;
  type: any;
  dataArr: any;
  url: string;
  company: any[];
  product: any;
  sub_product: any;
  types: any;

  file: File;
  AddMapping: FormGroup;
  file_image: any = 0;

  constructor(
    private api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.AddMapping = this.formBuilder.group({
      customertype: ["", Validators.required],
      remarks: ["", Validators.required],
      file: ["", Validators.required],
    });
  }

  ngOnInit() {}

  get formControls() {
    return this.AddMapping.controls;
  }

  Submit() {
    this.isSubmitted = true;
    if (this.AddMapping.invalid) {
      return;
    } else {
      var fields = this.AddMapping.value;

      const formData = new FormData();

      formData.append("user_id", this.api.GetUserData("Id"));
      formData.append("user_type", this.api.GetUserType());
      formData.append("customertype", fields["customertype"]);
      formData.append("remarks", fields["remarks"]);
      formData.append("image", this.file);

      // console.log(formData);

      this.api.IsLoading();
      this.api.HttpPostType("MyPos/AddBulkMapping", formData).then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);
          if (result["status"] == 1) {
            this.api.Toast("Success", result["msg"]);
            this.AddMapping.reset();
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
  image(arg0: string, image: any) {
    throw new Error("Method not implemented.");
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

      if (ext == "csv") {
        // console.log('Extenstion is vaild !');
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);

        // console.log(Total_Size + ' kb');

        if (Total_Size >= 1024 * 2) {
          // allow only 2 mb
          this.api.Toast("Warning", "File size is greater than 2 mb");

          if (Type == "file") {
            this.AddContact.get("file").setValue("");
          }
        } else {
          if (Type == "file") {
            this.file = this.selectedFiles;

            this.file_image = 1;
          }
        }
      } else {
        // console.log('Extenstion is not vaild !');

        this.api.Toast("Warning", "Please choose vaild file ! Example :- csv");

        if (Type == "file") {
          this.AddContact.get("file").setValue("");
        }
      }
    }
  }
}
