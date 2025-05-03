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
import domtoimage from "dom-to-image";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
declare var require: any;
const htmlToPdfmake = require("html-to-pdfmake");
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

import { jsPDF } from "jspdf";

@Component({
  selector: "app-geotag",
  templateUrl: "./geotag.component.html",
  styleUrls: ["./geotag.component.css"],
})
export class GeotagComponent implements OnInit {
  // @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;

  // dtOptions: DataTables.Settings = {};

  // dataAr: any;

  AddGeoTag: FormGroup;
  geoTagForm: FormGroup;
  active_tab: string = "Mobile"; // Default active tab

  isSubmitted = false;
  loadAPI: Promise<any>;
  // dataAr2: any;
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
  AgentId: any;
  tabval: string = "";
  Mobile: any;
  Email: any;
  Dataresult: any;
  GeoTagDetails: any;
  geoTag: any;
  showForm: boolean = false;
  checkclick: boolean = false;
  PrimaryId: any;
  GeoApprovalDenyDetails: any;
  getRowdat: boolean = false;
  pdfTable: HTMLElement;

  // showForm1: any = 0;
  // showForm2: any = 0;
  // showForm3: any = 0;
  // SingleSrLogData: any;
  // financialYearVal: { Id: string; Name: string; }[];

  constructor(
    private api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<GeotagComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.AgentId = this.data.Id;
    this.Mobile = this.data.Mobile;
    this.Email = this.data.Email;
    this.geoTag = this.data.geoTag;

    //   //   //   console.log(this.Mobile);
    //   //   //   console.log(this.Email);
    this.AddGeoTag = this.formBuilder.group({
      tabval: [""],
    });

    this.geoTagForm = this.formBuilder.group({
      remark: ["", Validators.required],
      checkvalue: ["", Validators.required],
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
    this.getgeoTaglogs();

    this.tabval = this.Mobile;
  }

  SetActiveTab(tabName: string) {
    this.active_tab = tabName;
    //   //   //   console.log(this.active_tab);
    // Update input value based on active tab
    if (tabName === "Mobile") {
      this.tabval = this.Mobile; // Placeholder for mobile number
    } else if (tabName === "Whatsapp") {
      this.tabval = this.Mobile; // Placeholder for WhatsApp number
    } else if (tabName === "Email") {
      this.tabval = this.Email; // Placeholder for email
    }
  }

  get formControls() {
    return this.AddGeoTag.controls;
  }

  submit() {
    this.isSubmitted = true;
    if (this.AddGeoTag.invalid) {
      return;
    } else {
      var fields = this.AddGeoTag.value;

      // if (trim(fields['mobile']) == '' && trim(fields['email']) == '') {
      //   this.api.Toast('Warning', 'Please enter mobile or email.');
      //   return;
      // }

      const formData = new FormData();

      formData.append("user_id", this.api.GetUserData("Id"));
      formData.append("user_type", this.api.GetUserType());

      formData.append("tabval", fields["tabval"]);
      formData.append("Id", this.AgentId);
      formData.append("tabName", this.active_tab);

      this.api.IsLoading();
      this.api.HttpPostType("PospManegment/SendGeoTagsMsg", formData).then(
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

  getgeoTaglogs() {
    // console.log(this.id);
    const formData = new FormData();

    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());

    // formData.append("Id", this.AgentId);

    this.api.IsLoading();

    this.api
      .HttpGetType("PospManegment/GetGeoTagAllLogs?Id=" + this.AgentId)
      .then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);
          if (result["status"] == true) {
            this.Dataresult = result["Data"];

            // console.log(this.Dataresult.status);
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

  GetGeoTagDetails(Id: any, type: any) {
    // console.log(this.id);

    this.checkclick = true;
    const formData = new FormData();

    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());

    // formData.append("Id", this.AgentId);

    this.api.IsLoading();

    this.api.HttpGetType("PospManegment/GetGeoTagDetails?Id=" + Id).then(
      (result) => {
        this.api.HideLoading();
        // console.log(result);
        if (result["status"] == 1) {
          this.checkclick = true;

          this.GeoTagDetails = result["Data"];
          //   //   //   console.log(this.GeoTagDetails);
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

  openImageInIframe(imageUrl: string) {
    const iframeWindow = window.open();
    if (iframeWindow) {
      iframeWindow.document.write(`
        <iframe src="${imageUrl}" style="border:none;width:100%;height:100%;"></iframe>
      `);
    }
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  setRowId(id: any) {
    this.PrimaryId = id;
  }

  get formControls2() {
    return this.geoTagForm.controls;
  }
  // AddSaturday() {

  //   const selectedSaturdays = this.saturdayOptions
  //     .map((option) => {
  //       const status = this.saturdayForm.value[`${option.Name}_status`];
  //       return {
  //         Name: option.Name,
  //         Working: status === 'working',
  //         NotWorking: status === 'notWorking',
  //       };
  //     })
  //     .filter((option) => option.Working || option.NotWorking);

  //   const formData = new FormData();
  //   selectedSaturdays.forEach((saturday) => {
  //     formData.append('User_Id', this.api.GetUserData('Id'));
  //     formData.append('User_Code', this.api.GetUserData('Code'));
  //     formData.append('Holiday_Date', '');
  //     formData.append('Holiday_Remark', saturday.Name);
  //     formData.append('Service_Location', '');
  //     formData.append('Portal', 'CRM');
  //     formData.append('Working_status', saturday.Working ? 'Working' : 'Not Working');

  //     this.api.IsLoading();
  //     this.api.HttpPostTypeBms('projection-target/HolidaysRelated/AddSaturday', formData).then((result: any) => {
  //       this.api.HideLoading();
  //       if (result['Status'] === true) {
  //         this.api.Toast('Success', result['Message']);
  //         this.saturdayForm.reset();
  //         this.Reload();
  //       } else {
  //         this.api.Toast('Error', result['Message']);
  //       }
  //     });
  //   });
  // }

  AddGeoTagApproval() {
    this.isSubmitted = true;
    if (this.geoTagForm.invalid) {
      return;
    } else {
      var fields = this.geoTagForm.value;

      const formData = new FormData();

      formData.append("user_id", this.api.GetUserData("Id"));
      formData.append("user_type", this.api.GetUserType());
      formData.append("checkvalue", fields["checkvalue"]);
      formData.append("remark", fields["remark"]);

      formData.append("id", this.PrimaryId);

      this.api.IsLoading();
      this.api.HttpPostType("PospManegment/ApprovalDeny", formData).then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);
          if (result["status"] == 1) {
            this.api.Toast("Success", result["msg"]);
            document.getElementById("closeModelSet").click();
            this.CloseModel();
          } else {
            const msg = "msg";
            this.api.Toast("Warning", result["msg"]);

            //alert(result['message']);
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

  GetRowData(Id: any, status: any) {
    // console.log(this.id);

    this.getRowdat = true;

    const formData = new FormData();

    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("login_type", this.api.GetUserType());
    formData.append("Id", this.api.GetUserType());

    // formData.append("Id", this.AgentId);

    this.api.IsLoading();

    this.api.HttpGetType("PospManegment/GetApprovalDenyDetails?Id=" + Id).then(
      (result) => {
        this.api.HideLoading();
        // console.log(result);
        if (result["status"] == 1) {
          this.GeoApprovalDenyDetails = result["Data"];
          // console.log(this.GeoTagDetails);
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

  DownloadPdf(id: any) {
    window.open(
      environment.apiUrl +
        "/Exam/DownloadVerifyPdf?login_type=" +
        this.api.GetUserType() +
        "&login_id=" +
        this.api.GetUserData("Id") +
        "&id=" +
        id
    );
  }

  // downloadAsPDF() {

  //   this.pdfTable = document.getElementById("contentToConvert");

  //   var img: any;
  //   var filename;
  //   var newImage: any;

  //   domtoimage
  //     .toPng(this.pdfTable, { bgcolor: "#fff" })

  //     .then(function (dataUrl) {
  //       img = new Image();
  //       img.src = dataUrl;
  //       newImage = img.src;

  //       img.onload = function () {
  //         var pdfWidth = img.width;
  //         var pdfHeight = img.height;

  //         // FileSaver.saveAs(dataUrl, 'my-pdfimage.png'); // Save as Image

  //         var doc;

  //         if (pdfWidth > pdfHeight) {
  //           doc = new jsPDF("l", "px", [pdfWidth, pdfHeight]);
  //         } else {
  //           doc = new jsPDF("p", "px", [pdfWidth, pdfHeight]);
  //         }

  //         var width = doc.internal.pageSize.getWidth();
  //         var height = doc.internal.pageSize.getHeight();

  //         doc.addImage(newImage, "PNG", 100, 100, width, height);
  //         filename = "Business Report" + Date() + ".pdf";
  //         doc.save(filename);

  //         this.DownloadPdf = "Completed Download";
  //       };
  //     })
  //     .catch(function (error) {
  //       // Error Handling
  //       this.DownloadPdf = "Convert PDF";
  //     });
  //  }
}
