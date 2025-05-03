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
  selector: "app-add-docs-wallet",
  templateUrl: "./add-docs-wallet.component.html",
  styleUrls: ["./add-docs-wallet.component.css"],
})
export class AddDocsWalletComponent implements OnInit {
  // @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;

  // dtOptions: DataTables.Settings = {};

  // dataAr: any;

  DocswalletForm: FormGroup;

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

  rcfront: File;
  mandate: File;
  proposalform: File;
  kyc: File;
  rcback: File;
  gst: File;
  insurance: File;
  others: File;
  document: any;
  doc2: File;
  doc1: File;
  doc3: File;

  // showForm1: any = 0;
  // showForm2: any = 0;
  // showForm3: any = 0;
  // SingleSrLogData: any;
  // financialYearVal: { Id: string; Name: string; }[];

  constructor(
    private api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddDocsWalletComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.type = this.data.type;
    this.id = this.data.id;

    // console.log(this.type);
    // console.log(this.id);

    this.DocswalletForm = this.formBuilder.group({
      docstype: ["", Validators.required],
      policyno: [""],
      vehicleno: [""],
      enginechassisno: [""],
      rcfront: [""],
      rcback: [""],
      gst: [""],
      insurance: [""],
      others: [""],
      clientname: [""],
      clientcontact: [""],
      mandate: [""],
      proposalform: [""],
      kyc: [""],
      doc1: [""],
      doc2: [""],
      doc3: [""],
      pexpirydate: [""],
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

    // this.Product = [
    //   { Id: 1, Name: 'Two Wheeler' },
    //   { Id: 2, Name: 'Private' },
    // ];

    // this.Lob = [
    //   { Id: 'motor', Name: 'Motor' },
    //   { Id: 'nonmotor', Name: 'Non Motor' },
    //   { Id: 'health', Name: 'Health' },
    // ];

    // this.Type = [
    //   { Id: 'Package', Name: 'Package' },
    //   { Id: 'Third Party', Name: 'Third Party' },
    //   { Id: 'StandAlone OD', Name: 'StandAlone OD' },
    // ];

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
    this.FileType_Status();

    if (this.type == "Edit") {
      this.getValueEdit();
    }

    if (this.type == "Document") {
      this.getDocument();
    }
  }

  // BusinessType_Status() {

  //   this.productvalue = this.DocswalletForm.get('product');
  //   if (this.productvalue != '') {
  //     var ReqTypes = this.productvalue.value[0].Id;

  //     // // console.log(ReqTypes);

  //     // this.DocswalletForm.get('product').valueChanges
  //     //   .subscribe(type => {
  //     //     // console.log(type);

  //     if (ReqTypes == '1') {
  //       this.DocswalletForm.get('subproduct').setValue("");

  //       this.SubProducts = [
  //         { Id: 1, Name: '1 Year' },
  //         { Id: 2, Name: '1 + 5 Year' },
  //         { Id: 3, Name: '5 + 5 Year' },
  //       ];

  //     }

  //     else if (ReqTypes == '2') {
  //       this.DocswalletForm.get('subproduct').setValue("");

  //       this.SubProducts = [
  //         { Id: 4, Name: '1 Year' },
  //         { Id: 5, Name: '1 + 3 Year' },
  //         { Id: 6, Name: '3 + 3 Year' },
  //       ];
  //     }

  //     // });
  //   }

  // }

  // FilterCompany() {
  //   this.api.IsLoading();
  //   this.api
  //     .HttpGetType(
  //       "WebsiteSection/FilterCompany?User_Id=" +
  //       this.api.GetUserData("Id") +
  //       "&User_Type=" +
  //       this.api.GetUserType()
  //     )
  //     .then(
  //       (result) => {
  //         this.api.HideLoading();
  //         if (result["status"] == 1) {
  //           this.Company = result["Data"];
  //           // console.log(this.Company);
  //         } else {
  //           this.api.Toast("Warning", result["Message"]);
  //         }
  //       },
  //       (err) => {
  //         this.api.HideLoading();
  //         this.api.Toast(
  //           "Warning",
  //           "Network Error : " + err.name + "(" + err.statusText + ")"
  //         );
  //       }
  //     );
  // }

  FileType_Status() {
    const docstype = this.DocswalletForm.get("docstype");
    const policyno = this.DocswalletForm.get("policyno");
    const vehicleno = this.DocswalletForm.get("vehicleno");
    const enginechassisno = this.DocswalletForm.get("enginechassisno");
    const rcfront = this.DocswalletForm.get("rcfront");
    const rcback = this.DocswalletForm.get("rcback");
    const gst = this.DocswalletForm.get("gst");
    const insurance = this.DocswalletForm.get("insurance");
    const others = this.DocswalletForm.get("others");
    const clientname = this.DocswalletForm.get("clientname");
    const clientcontact = this.DocswalletForm.get("clientcontact");
    const mandate = this.DocswalletForm.get("mandate");
    const proposalform = this.DocswalletForm.get("proposalform");
    const kyc = this.DocswalletForm.get("kyc");
    const pexpirydate = this.DocswalletForm.get("pexpirydate");
    const doc1 = this.DocswalletForm.get("doc1");
    const doc2 = this.DocswalletForm.get("doc2");
    const doc3 = this.DocswalletForm.get("doc3");

    this.DocswalletForm.get("docstype").valueChanges.subscribe((type) => {
      if (type == "motor") {
        docstype.setValidators(Validators.required);
        policyno.setValidators(null);
        vehicleno.setValidators(null);
        enginechassisno.setValidators(null);
        rcfront.setValidators(null);
        rcback.setValidators(null);
        gst.setValidators(null);
        insurance.setValidators(null);
        others.setValidators(null);
        clientname.setValidators([
          Validators.required,
          Validators.pattern("^[a-zA-Z_ ]*$"),
        ]);
        clientcontact.setValidators([
          Validators.required,
          Validators.pattern("^((\\+91-?)|0)?[5-9]{1}[0-9]{9}$"),
        ]);
        mandate.setValidators(null);
        doc1.setValidators(null);
        doc2.setValidators(null);
        doc3.setValidators(null);
        proposalform.setValidators(null);
        kyc.setValidators(null);
        pexpirydate.setValidators(null);

        //disable previous policy status new
      } else if (type == "nonmotor") {
        docstype.setValidators(Validators.required);
        policyno.setValidators(null);
        vehicleno.setValidators(null);
        enginechassisno.setValidators(null);
        rcfront.setValidators(null);
        rcback.setValidators(null);
        gst.setValidators(null);
        insurance.setValidators(null);
        others.setValidators(null);
        clientname.setValidators(Validators.pattern("^[a-zA-Z_ ]*$"));
        clientcontact.setValidators(
          Validators.pattern("^((\\+91-?)|0)?[5-9]{1}[0-9]{9}$")
        );
        mandate.setValidators(null);
        doc1.setValidators(null);
        doc2.setValidators(null);
        doc3.setValidators(null);
        proposalform.setValidators(null);
        kyc.setValidators(null);
        pexpirydate.setValidators(null);
      } else if (type == "health") {
        docstype.setValidators(Validators.required);
        policyno.setValidators(null);
        vehicleno.setValidators(null);
        enginechassisno.setValidators(null);
        rcfront.setValidators(null);
        rcback.setValidators(null);
        gst.setValidators(null);
        insurance.setValidators(null);
        others.setValidators(null);
        clientname.setValidators(Validators.pattern("^[a-zA-Z_ ]*$"));
        clientcontact.setValidators(
          Validators.pattern("^((\\+91-?)|0)?[5-9]{1}[0-9]{9}$")
        );
        mandate.setValidators(null);
        doc1.setValidators(null);
        doc2.setValidators(null);
        doc3.setValidators(null);
        proposalform.setValidators(null);
        kyc.setValidators(null);
        pexpirydate.setValidators(null);
      } else if (type == "life") {
        docstype.setValidators(Validators.required);
        policyno.setValidators(null);
        vehicleno.setValidators(null);
        enginechassisno.setValidators(null);
        rcfront.setValidators(null);
        rcback.setValidators(null);
        gst.setValidators(null);
        insurance.setValidators(null);
        others.setValidators(null);
        clientname.setValidators(Validators.pattern("^[a-zA-Z_ ]*$"));
        clientcontact.setValidators(
          Validators.pattern("^((\\+91-?)|0)?[5-9]{1}[0-9]{9}$")
        );
        mandate.setValidators(null);
        doc1.setValidators(null);
        doc2.setValidators(null);
        doc3.setValidators(null);
        proposalform.setValidators(null);
        kyc.setValidators(null);
        pexpirydate.setValidators(null);
      } else if (type == "other") {
        docstype.setValidators(Validators.required);
        policyno.setValidators(null);
        vehicleno.setValidators(null);
        enginechassisno.setValidators(null);
        rcfront.setValidators(null);
        rcback.setValidators(null);
        gst.setValidators(null);
        insurance.setValidators(null);
        others.setValidators(null);
        mandate.setValidators(null);

        if (this.type == "Edit") {
          doc1.setValidators(null);
          clientname.setValidators([Validators.pattern("^[a-zA-Z_ ]*$")]);
          clientcontact.setValidators(
            Validators.pattern("^((\\+91-?)|0)?[5-9]{1}[0-9]{9}$")
          );
        } else {
          doc1.setValidators(Validators.required);
          clientname.setValidators([
            Validators.required,
            Validators.pattern("^[a-zA-Z_ ]*$"),
          ]);
          clientcontact.setValidators(
            Validators.pattern("^((\\+91-?)|0)?[5-9]{1}[0-9]{9}$")
          );
        }

        doc2.setValidators(null);
        doc3.setValidators(null);
        proposalform.setValidators(null);
        kyc.setValidators(null);
        pexpirydate.setValidators(null);
      }

      docstype.updateValueAndValidity();
      policyno.updateValueAndValidity();
      vehicleno.updateValueAndValidity();
      enginechassisno.updateValueAndValidity();
      rcfront.updateValueAndValidity();
      rcback.updateValueAndValidity();
      gst.updateValueAndValidity();
      insurance.updateValueAndValidity();
      others.updateValueAndValidity();
      clientname.updateValueAndValidity();
      clientcontact.updateValueAndValidity();
      mandate.updateValueAndValidity();
      doc1.updateValueAndValidity();
      doc2.updateValueAndValidity();
      doc3.updateValueAndValidity();
      proposalform.updateValueAndValidity();
      kyc.updateValueAndValidity();
      pexpirydate.updateValueAndValidity();
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
    this.api.HttpPostType("DocsWallet/EditDocsWallet", formData).then(
      (result) => {
        this.api.HideLoading();
        // console.log(result);

        if (result["status"] == true) {
          this.dataArr = result["data"];

          // console.log(this.dataArr);

          this.DocswalletForm.patchValue(this.dataArr);
          // this.DocswalletForm.patchValue(this.dataArr);

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

  getDocument() {
    // console.log(this.id);
    // console.log(this.type);

    //  var fields = this.loginform.value;
    const formData = new FormData();

    formData.append("login_type", this.api.GetUserType());

    formData.append("login_id", this.api.GetUserData("Id"));

    formData.append("id", this.id);
    formData.append("type", this.type);

    this.api.IsLoading();
    this.api.HttpPostType("DocsWallet/DocumentDocsWallet", formData).then(
      (result) => {
        this.api.HideLoading();
        // console.log(result);

        if (result["status"] == true) {
          this.document = result["data"];

          // console.log(this.document);

          // this.DocswalletForm.patchValue(this.dataArr);
          // this.DocswalletForm.patchValue(this.dataArr);

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
    return this.DocswalletForm.controls;
  }

  submit() {
    // console.log(this.type);
    // console.log(this.id);

    this.isSubmitted = true;
    if (this.DocswalletForm.invalid) {
      return;
    } else {
      var fields = this.DocswalletForm.value;

      const formData = new FormData();

      formData.append("user_id", this.api.GetUserData("Id"));
      formData.append("user_type", this.api.GetUserType());

      if (this.type == "Edit") {
        formData.append("id", this.id);
      }

      formData.append("docstype", fields["docstype"]);
      formData.append("policyno", fields["policyno"]);
      formData.append("vehicleno", fields["vehicleno"]);
      formData.append("enginechassisno", fields["enginechassisno"]);
      formData.append("clientname", fields["clientname"]);
      formData.append("clientcontact", fields["clientcontact"]);
      formData.append("pexpirydate", fields["pexpirydate"]);

      formData.append("rcfront", this.rcfront);
      formData.append("rcback", this.rcback);
      formData.append("gst", this.gst);
      formData.append("insurance", this.insurance);
      formData.append("others", this.others);
      formData.append("mandate", this.mandate);
      formData.append("proposalform", this.proposalform);
      formData.append("doc1", this.doc1);
      formData.append("doc2", this.doc2);
      formData.append("doc3", this.doc3);

      formData.append("kyc", this.kyc);

      // console.log(formData);

      if (this.type == "Add") {
        this.url = "DocsWallet/addDocsWallet";
      } else if (this.type == "Edit") {
        this.url = "DocsWallet/updateDocsWallet";
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

      if (ext == "png" || ext == "jpeg" || ext == "jpg" || ext == "pdf") {
        // console.log('Extenstion is vaild !');
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);

        // console.log(Total_Size + ' kb');

        if (Total_Size >= 1024 * 10) {
          // allow only 2 mb
          this.api.Toast("Warning", "File size is greater than 10 mb");

          if (Type == "rcfront") {
            this.DocswalletForm.get("rcfront").setValue("");
          }
          if (Type == "mandate") {
            this.DocswalletForm.get("mandate").setValue("");
          }
          if (Type == "proposalform") {
            this.DocswalletForm.get("proposalform").setValue("");
          }
          if (Type == "kyc") {
            this.DocswalletForm.get("kyc").setValue("");
          }
          if (Type == "rcback") {
            this.DocswalletForm.get("rcback").setValue("");
          }
          if (Type == "gst") {
            this.DocswalletForm.get("gst").setValue("");
          }
          if (Type == "insurance") {
            this.DocswalletForm.get("insurance").setValue("");
          }
          if (Type == "others") {
            this.DocswalletForm.get("others").setValue("");
          }
          if (Type == "doc1") {
            this.DocswalletForm.get("doc1").setValue("");
          }
          if (Type == "doc2") {
            this.DocswalletForm.get("doc2").setValue("");
          }
          if (Type == "doc3") {
            this.DocswalletForm.get("doc3").setValue("");
          }
        } else {
          if (Type == "rcfront") {
            this.rcfront = this.selectedFiles;
          }
          if (Type == "mandate") {
            this.mandate = this.selectedFiles;
          }
          if (Type == "proposalform") {
            this.proposalform = this.selectedFiles;
          }
          if (Type == "kyc") {
            this.kyc = this.selectedFiles;
          }
          if (Type == "rcback") {
            this.rcback = this.selectedFiles;
          }
          if (Type == "gst") {
            this.gst = this.selectedFiles;
          }
          if (Type == "insurance") {
            this.insurance = this.selectedFiles;
          }
          if (Type == "others") {
            this.others = this.selectedFiles;
          }
          if (Type == "doc1") {
            this.doc1 = this.selectedFiles;
          }
          if (Type == "doc2") {
            this.doc2 = this.selectedFiles;
          }
          if (Type == "doc3") {
            this.doc3 = this.selectedFiles;
          }
        }
      } else {
        // console.log('Extenstion is not vaild !');

        this.api.Toast(
          "Warning",
          "Please choose vaild file ! Example :- PNG,JPEG,JPG,PDF"
        );

        if (Type == "rcfront") {
          this.DocswalletForm.get("rcfront").setValue("");
        }
        if (Type == "mandate") {
          this.DocswalletForm.get("mandate").setValue("");
        }
        if (Type == "proposalform") {
          this.DocswalletForm.get("proposalform").setValue("");
        }
        if (Type == "kyc") {
          this.DocswalletForm.get("kyc").setValue("");
        }
        if (Type == "rcback") {
          this.DocswalletForm.get("rcback").setValue("");
        }
        if (Type == "gst") {
          this.DocswalletForm.get("gst").setValue("");
        }
        if (Type == "insurance") {
          this.DocswalletForm.get("insurance").setValue("");
        }
        if (Type == "others") {
          this.DocswalletForm.get("others").setValue("");
        }
        if (Type == "doc1") {
          this.DocswalletForm.get("doc1").setValue("");
        }
        if (Type == "doc2") {
          this.DocswalletForm.get("doc2").setValue("");
        }
        if (Type == "doc3") {
          this.DocswalletForm.get("doc3").setValue("");
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
