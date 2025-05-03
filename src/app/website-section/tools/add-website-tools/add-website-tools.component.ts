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
  selector: "app-add-website-tools",
  templateUrl: "./add-website-tools.component.html",
  styleUrls: ["./add-website-tools.component.css"],
})
export class AddWebsiteToolsComponent implements OnInit {
  // @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;

  // dtOptions: DataTables.Settings = {};

  // dataAr: any;

  addtoolForm: FormGroup;

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

  // showForm1: any = 0;
  // showForm2: any = 0;
  // showForm3: any = 0;
  // SingleSrLogData: any;
  // financialYearVal: { Id: string; Name: string; }[];

  constructor(
    private api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddWebsiteToolsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.type = this.data.type;
    this.id = this.data.id;

    this.addtoolForm = this.formBuilder.group({
      company: ["", Validators.required],
      lob: ["", Validators.required],
      product: [""],
      subproduct: [""],
      types: [""],
      url: [""],
      policywording: [""],
      proposal: [""],
      claim: [""],
      brochure: [""],
      hospitallist: [""],
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

    this.Product = [
      { Id: 1, Name: "Two Wheeler" },
      { Id: 2, Name: "Private" },
    ];

    this.Lob = [
      { Id: "motor", Name: "Motor" },
      { Id: "nonmotor", Name: "Non Motor" },
      { Id: "health", Name: "Health" },
    ];

    this.Type = [
      { Id: "Package", Name: "Package" },
      { Id: "Third Party", Name: "Third Party" },
      { Id: "StandAlone OD", Name: "StandAlone OD" },
    ];

    // this.SubProducts = [
    //   { Id: 1, Name: '1 Year' },
    //   { Id: 2, Name: '1 + 5 Year' },
    //   { Id: 3, Name: '5 + 5 Year' },
    //   { Id: 4, Name: '1 Year' },
    //   { Id: 5, Name: '1 + 3 Year' },
    //   { Id: 6, Name: '3 + 3 Year' },
    // ];

    // this.SubProduct = [
    //   { Id: 1, Name: '1 Year' },
    //   { Id: 2, Name: '1 + 5 Year' },
    //   { Id: 3, Name: '5 + 5 Year' },
    //   { Id: 4, Name: '1 Year' },
    //   { Id: 5, Name: '1 + 3 Year' },
    //   { Id: 6, Name: '3 + 3 Year' },
    // ];
  }

  ngOnInit() {
    this.FilterCompany();

    if (this.type == "Edit") {
      this.getValueEdit();
    }
  }

  BusinessType_Status() {
    this.productvalue = this.addtoolForm.get("product");
    if (this.productvalue != "") {
      var ReqTypes = this.productvalue.value[0].Id;

      // // console.log(ReqTypes);

      // this.addtoolForm.get('product').valueChanges
      //   .subscribe(type => {
      //     // console.log(type);

      if (ReqTypes == "1") {
        this.addtoolForm.get("subproduct").setValue("");

        this.SubProducts = [
          { Id: 1, Name: "1 Year" },
          { Id: 2, Name: "1 + 5 Year" },
          { Id: 3, Name: "5 + 5 Year" },
        ];
      } else if (ReqTypes == "2") {
        this.addtoolForm.get("subproduct").setValue("");

        this.SubProducts = [
          { Id: 4, Name: "1 Year" },
          { Id: 5, Name: "1 + 3 Year" },
          { Id: 6, Name: "3 + 3 Year" },
        ];
      }

      // });
    }
  }

  FilterCompany() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "WebsiteSection/FilterCompany?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType()
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == 1) {
            this.Company = result["Data"];
            // console.log(this.Company);
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

  FileType_Status(e) {
    const company = this.addtoolForm.get("company");
    const lob = this.addtoolForm.get("lob");
    const product = this.addtoolForm.get("product");
    const subproduct = this.addtoolForm.get("subproduct");
    const types = this.addtoolForm.get("types");
    const url = this.addtoolForm.get("url");
    const policywording = this.addtoolForm.get("policywording");
    const proposal = this.addtoolForm.get("proposal");
    const claim = this.addtoolForm.get("claim");
    const brochure = this.addtoolForm.get("brochure");
    const hospitallist = this.addtoolForm.get("hospitallist");

    this.addtoolForm.get("lob").valueChanges.subscribe((type) => {
      if (type == "motor") {
        company.setValidators(null);
        lob.setValidators(null);
        product.setValidators([Validators.required]);
        subproduct.setValidators([Validators.required]);
        types.setValidators([Validators.required]);
        url.setValidators([Validators.required]);
        policywording.setValidators([Validators.required]);
        proposal.setValidators([Validators.required]);
        claim.setValidators([Validators.required]);
        brochure.setValidators([Validators.required]);
        hospitallist.setValidators(null);

        //disable previous policy status new
      } else if (type == "nonmotor") {
        company.setValidators(null);
        lob.setValidators(null);
        product.setValidators(null);
        subproduct.setValidators(null);
        types.setValidators(null);
        url.setValidators([Validators.required]);
        policywording.setValidators([Validators.required]);
        proposal.setValidators([Validators.required]);
        claim.setValidators([Validators.required]);
        brochure.setValidators([Validators.required]);
        hospitallist.setValidators(null);
      } else if (type == "health") {
        company.setValidators(null);
        lob.setValidators(null);
        product.setValidators([Validators.required]);
        subproduct.setValidators(null);
        types.setValidators(null);
        url.setValidators([Validators.required]);
        policywording.setValidators([Validators.required]);
        proposal.setValidators([Validators.required]);
        claim.setValidators([Validators.required]);
        brochure.setValidators([Validators.required]);
        hospitallist.setValidators([Validators.required]);
      }

      company.updateValueAndValidity();
      lob.updateValueAndValidity();
      product.updateValueAndValidity();
      subproduct.updateValueAndValidity();
      types.updateValueAndValidity();
      url.updateValueAndValidity();
      policywording.updateValueAndValidity();
      proposal.updateValueAndValidity();
      claim.updateValueAndValidity();
      brochure.updateValueAndValidity();
      hospitallist.updateValueAndValidity();
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
    this.api.HttpPostType("WebsiteSection/EditTools", formData).then(
      (result) => {
        this.api.HideLoading();
        // console.log(result);

        if (result["status"] == true) {
          this.dataArr = result["data"];
          this.company = result["company"];
          this.product = result["product"];
          this.sub_product = result["sub_product"];
          this.types = result["types"];

          // // console.log(this.company);

          this.addtoolForm.patchValue(this.dataArr);
          // this.addtoolForm.patchValue(this.dataArr);

          // this.api.Toast("Success", result["msg"]);
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
    return this.addtoolForm.controls;
  }

  submit() {
    // console.log(this.type);
    // console.log(this.id);

    this.isSubmitted = true;
    if (this.addtoolForm.invalid) {
      return;
    } else {
      var fields = this.addtoolForm.value;

      const formData = new FormData();

      formData.append("user_id", this.api.GetUserData("Id"));
      formData.append("user_type", this.api.GetUserType());

      if (this.type == "Edit") {
        formData.append("Id", this.id);
      }

      formData.append("company", fields["company"][0]["Id"]);
      formData.append("lob", fields["lob"]);

      if (fields["lob"] == "motor") {
        formData.append("product", fields["product"][0]["Name"]);
        formData.append("subproduct", fields["subproduct"][0]["Name"]);
        formData.append("types", fields["types"][0]["Name"]);
      } else {
        formData.append("product", fields["product"]);
      }
      formData.append("Source", "Docs-tools");

      formData.append("url", fields["url"]);
      formData.append("policywording", this.policywording);
      formData.append("proposal", this.proposal);
      formData.append("claim", this.claim);
      formData.append("brochure", this.brochure);
      formData.append("hospitallist", this.hospitallist);

      // console.log(formData);

      if (this.type == "Add") {
        this.url = "WebsiteSection/addToolData";
      } else if (this.type == "Edit") {
        this.url = "WebsiteSection/updateToolData";
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
            this.router.navigate(["Mypos/View-Docs"]);
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
        ext == "webp" ||
        ext == "svg"
      ) {
        // console.log('Extenstion is vaild !');
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);

        // console.log(Total_Size + ' kb');

        if (Total_Size >= 1024 * 10) {
          // allow only 2 mb
          this.api.Toast("Warning", "File size is greater than 10 mb");

          if (Type == "policywording") {
            this.addtoolForm.get("policywording").setValue("");
          }
          if (Type == "proposal") {
            this.addtoolForm.get("proposal").setValue("");
          }
          if (Type == "claim") {
            this.addtoolForm.get("claim").setValue("");
          }
          if (Type == "brochure") {
            this.addtoolForm.get("brochure").setValue("");
          }
          if (Type == "hospitallist") {
            this.addtoolForm.get("hospitallist").setValue("");
          }
        } else {
          if (Type == "policywording") {
            this.policywording = this.selectedFiles;
          }
          if (Type == "proposal") {
            this.proposal = this.selectedFiles;
          }
          if (Type == "claim") {
            this.claim = this.selectedFiles;
          }
          if (Type == "brochure") {
            this.brochure = this.selectedFiles;
          }
          if (Type == "hospitallist") {
            this.hospitallist = this.selectedFiles;
          }
        }
      } else {
        // console.log('Extenstion is not vaild !');

        this.api.Toast(
          "Warning",
          "Please choose vaild file ! Example :- PNG,JPEG,JPG,PDF"
        );

        if (Type == "policywording") {
          this.addtoolForm.get("Mandate").setValue("");
        }
        if (Type == "proposal") {
          this.addtoolForm.get("proposal").setValue("");
        }
        if (Type == "claim") {
          this.addtoolForm.get("claim").setValue("");
        }
        if (Type == "brochure") {
          this.addtoolForm.get("brochure").setValue("");
        }
        if (Type == "hospitallist") {
          this.addtoolForm.get("hospitallist").setValue("");
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
