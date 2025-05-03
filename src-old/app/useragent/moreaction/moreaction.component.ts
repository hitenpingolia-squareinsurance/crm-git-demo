import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormGroup,
  FormArray,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { throws } from "assert";

@Component({
  selector: "app-moreaction",
  templateUrl: "./moreaction.component.html",
  styleUrls: ["./moreaction.component.css"],
})
export class MoreactionComponent implements OnInit {
  MoreActionForm: FormGroup;

  isSubmitted = false;
  loadAPI: Promise<any>;

  id: any;

  dataArr: any;

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
  posStatus: any;
  CreatePosPermission: any;
  CreateSpPermission: any;
  Email: any;
  EmployeeId: any;
  EmployeeName: any;
  Employee: any;
  EmployeeNameId: any;
  Id: any;
  currentUrl: string;

  constructor(
    private api: ApiService,
    private router: Router,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<MoreactionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.id = this.data.id;
    // console.log(this.id);

    this.MoreActionForm = this.formBuilder.group({
      emp: [""],
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
    this.getdata();
    this.FilterEmployee();
    this.currentUrl = this.router.url;
    // console.log(this.currentUrl);
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  FilterEmployee() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "UserAgent/FilterEmployeeName?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType()
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == 1) {
            this.EmployeeNameId = result["Data"];
            // // console.log(this.Bank);
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

  get formControls() {
    return this.MoreActionForm.controls;
  }

  submit() {
    // console.log(this.id);

    this.isSubmitted = true;
    if (this.MoreActionForm.invalid) {
      return;
    } else {
      var fields = this.MoreActionForm.value;
      const formData = new FormData();

      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("User_Type", this.api.GetUserType());

      formData.append("id", this.id);

      formData.append("emp", fields["emp"][0]["Id"]);

      // console.log(fields);

      this.api.IsLoading();
      this.api.HttpPostType("UserAgent/EmployeeUpdate", formData).then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);

          if (result["status"] == 1) {
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

  getdata() {
    // // console.log(this.id);
    this.api.IsLoading();

    this.api.HttpGetType("UserAgent/GetMoreActionDetail?id=" + this.id).then(
      (result) => {
        this.api.HideLoading();

        // // console.log(result);

        if (result["status"] == 1) {
          this.dataArr = result["data"];

          this.posStatus = this.dataArr.pos_status;
          this.CreatePosPermission = this.dataArr.create_pos_permission;
          this.CreateSpPermission = this.dataArr.create_sp_permission;
          this.Email = this.dataArr.email;
          this.Id = this.dataArr.id;
          this.Employee = result["Employee"];
          // console.log(this.Id);

          // images

          // console.log(this.Employee);
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

  UpdateSpPermission(Id: any, SpPermission: any, TableName: any) {
    var confirms = confirm("Are You Sure..!");
    if (confirms == true) {
      this.api.IsLoading();

      const formData = new FormData();

      formData.append("Id", Id);
      formData.append("TableName", TableName);
      formData.append("SpPermission", SpPermission);
      formData.append("UserId", this.api.GetUserData("Id"));
      formData.append("UserType", this.api.GetUserType());

      this.api.IsLoading();
      this.api.HttpPostType("UserAgent/UpdateSpPermission", formData).then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);

          if (result["status"] == true) {
            this.api.Toast("Success", result["msg"]);
            this.CloseModel();
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

  // UploadDocs(event, Type) {
  //   this.selectedFiles = event.target.files[0];
  //   if (event.target.files && event.target.files[0]) {

  //     // console.log(this.selectedFiles);
  //     // console.log(this.selectedFiles.name);
  //     var str = this.selectedFiles.name;
  //     var ar = str.split(".");
  //     // console.log(ar);
  //     var ext;
  //     for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();
  //     // console.log(ext);

  //     if (ext == 'png' || ext == 'jpeg' || ext == 'jpg' || ext == 'pdf') {
  //       // console.log('Extenstion is vaild !');
  //       var file_size = event.target.files[0]['size'];
  //       const Total_Size = Math.round((file_size / 1024));

  //       // console.log(Total_Size + ' kb');

  //       if (Total_Size >= 1024 * 10) { // allow only 2 mb
  //         this.api.Toast('Warning', 'File size is greater than 10 mb');

  //         if (Type == 'pancardimage') { this.docsForm.get('pancardimage').setValue(''); }
  //         if (Type == 'aadharfrontimage') { this.docsForm.get('aadharfrontimage').setValue(''); }
  //         if (Type == 'aadharbackimage') { this.docsForm.get('aadharbackimage').setValue(''); }
  //         if (Type == 'qualificationproofimage') { this.docsForm.get('qualificationproofimage').setValue(''); }
  //         if (Type == 'chequeimageproof') { this.docsForm.get('chequeimageproof').setValue(''); }
  //         if (Type == 'prfileimage') { this.docsForm.get('prfileimage').setValue(''); }
  //         if (Type == 'signatureimage') { this.docsForm.get('signatureimage').setValue(''); }
  //         if (Type == 'otherimage') { this.docsForm.get('otherimage').setValue(''); }

  //       } else {

  //         if (Type == 'pancardimage') { this.pancardimage = this.selectedFiles; }
  //         if (Type == 'aadharfrontimage') { this.aadharfrontimage = this.selectedFiles; }
  //         if (Type == 'aadharbackimage') { this.aadharbackimage = this.selectedFiles; }
  //         if (Type == 'qualificationproofimage') { this.qualificationproofimage = this.selectedFiles; }
  //         if (Type == 'chequeimageproof') { this.chequeimageproof = this.selectedFiles; }
  //         if (Type == 'prfileimage') { this.prfileimage = this.selectedFiles; }
  //         if (Type == 'signatureimage') { this.signatureimage = this.selectedFiles; }
  //         if (Type == 'otherimage') { this.otherimage = this.selectedFiles; }

  //       }
  //     } else {
  //       // console.log('Extenstion is not vaild !');

  //       this.api.Toast('Warning', 'Please choose vaild file ! Example :- PNG,JPEG,JPG,PDF');

  //       if (Type == 'pancardimage') { this.docsForm.get('pancardimage').setValue(''); }
  //       if (Type == 'aadharfrontimage') { this.docsForm.get('aadharfrontimage').setValue(''); }
  //       if (Type == 'aadharbackimage') { this.docsForm.get('aadharbackimage').setValue(''); }
  //       if (Type == 'qualificationproofimage') { this.docsForm.get('qualificationproofimage').setValue(''); }
  //       if (Type == 'chequeimageproof') { this.docsForm.get('chequeimageproof').setValue(''); }
  //       if (Type == 'prfileimage') { this.docsForm.get('prfileimage').setValue(''); }
  //       if (Type == 'signatureimage') { this.docsForm.get('signatureimage').setValue(''); }
  //       if (Type == 'otherimage') { this.docsForm.get('otherimage').setValue(''); }

  //     }

  //   }
  // }
}
