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
import { trim } from "jquery";

@Component({
  selector: "app-add-contact",
  templateUrl: "./add-contact.component.html",
  styleUrls: ["./add-contact.component.css"],
})
export class AddContactComponent implements OnInit {
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

  // showForm1: any = 0;
  // showForm2: any = 0;
  // showForm3: any = 0;
  // SingleSrLogData: any;
  // financialYearVal: { Id: string; Name: string; }[];

  constructor(
    private api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddContactComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.AddContact = this.formBuilder.group({
      customertype: ["input", Validators.required],
      inputcustomertype: [""],
      name: [""],
      email: [""],
      mobile: [""],
      remarks: [""],
      file: [""],
      publicprivate: [""],
      organizationname: [],
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
  }

  ngOnInit() {
    this.FileType_Status();
  }

  FileType_Status() {
    const customertype = this.AddContact.get("customertype");
    const inputcustomertype = this.AddContact.get("inputcustomertype");
    const name = this.AddContact.get("name");
    const email = this.AddContact.get("email");
    const mobile = this.AddContact.get("mobile");
    const remarks = this.AddContact.get("remarks");
    const file = this.AddContact.get("file");
    const publicprivate = this.AddContact.get("publicprivate");
    const organizationname = this.AddContact.get("organizationname");

    const type = this.AddContact.get("customertype").value;
    //  alert(type);

    if (type == "input") {
      customertype.setValidators(null);
      inputcustomertype.setValidators(Validators.required);
      name.setValidators(Validators.required);
      email.setValidators(null);
      mobile.setValidators(null);
      remarks.setValidators(Validators.required);
      publicprivate.setValidators(Validators.required);
      file.setValidators(null);
      organizationname.setValidators(null);
    } else if (type == "file") {
      customertype.setValidators(null);
      inputcustomertype.setValidators(null);
      name.setValidators(null);
      email.setValidators(null);
      mobile.setValidators(null);
      remarks.setValidators(null);
      publicprivate.setValidators(null);
      file.setValidators(Validators.required);
      organizationname.setValidators(null);
    }

    customertype.updateValueAndValidity();
    inputcustomertype.updateValueAndValidity();
    name.updateValueAndValidity();
    email.updateValueAndValidity();
    mobile.updateValueAndValidity();
    remarks.updateValueAndValidity();
    publicprivate.updateValueAndValidity();
    file.updateValueAndValidity();
    organizationname.updateValueAndValidity();
  }

  get formControls() {
    return this.AddContact.controls;
  }

  submit() {
    this.isSubmitted = true;
    if (this.AddContact.invalid) {
      return;
    } else {
      var fields = this.AddContact.value;

      // if (trim(fields['mobile']) == '' && trim(fields['email']) == '') {
      //   this.api.Toast('Warning', 'Please enter mobile or email.');
      //   return;
      // }

      const formData = new FormData();

      formData.append("user_id", this.api.GetUserData("Id"));
      formData.append("user_type", this.api.GetUserType());

      formData.append("customertype", fields["customertype"]);
      formData.append("inputcustomertype", fields["inputcustomertype"]);
      formData.append("name", fields["name"]);
      formData.append("email", fields["email"]);
      formData.append("mobile", fields["mobile"]);
      formData.append("remarks", fields["remarks"]);
      formData.append("publicprivate", fields["publicprivate"]);
      formData.append("organizationname", fields["organizationname"]);
      formData.append("image", this.file);

      // console.log(formData);

      // // console.log('formData');
      this.api.IsLoading();
      this.api.HttpPostType("ServiceProvider/addContacts", formData).then(
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

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }
}
