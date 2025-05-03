// import {
//   Component,
//   OnInit,
//   ViewChild,
//   QueryList,
//   ViewChildren,
//   Inject
// } from "@angular/core";

// import { DataTableDirective } from "angular-datatables";
// import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
// import { Router, ActivatedRoute } from "@angular/router";
// import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
// import { ApiService } from "src/app/providers/api.service";
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { FormBuilder, FormGroup, Validators } from "@angular/forms";

// @Component({
//   selector: 'app-add-lang',
//   templateUrl: './add-lang.component.html',
//   styleUrls: ['./add-lang.component.css']
// })
// export class AddLangComponent implements OnInit {
//   [x: string]: any;

//   AddFieldForm: FormGroup;
//   isUpdate: boolean = false;

//   isSubmitted: boolean = false;
//   currentUrl: any;
//   type: any;
//   constructor(private api: ApiService,
//      public dialog: MatDialog,
//       public fb: FormBuilder,
//       public router : Router,
//       public dialogRef: MatDialogRef<AddLangComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: any

//   ) {


//     this.type = this.data.type;
//     this.id = this.data.id;
    
//     this.currentUrl = this.router.url;
//     // alert(this.currentUrl);

//     this.AddFieldForm = this.fb.group({
//       key_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z_]+$')]],
//       english: ['', Validators.required],
//       hindi: ['', Validators.required],
//       bengali: ['', Validators.required],
//       marathi: ['', Validators.required],
//       telugu: ['', Validators.required],
//       tamil: ['', Validators.required],
//     });
//   }

//   ngOnInit() {
//     if (this.data) {
//       this.isUpdate = true;

//       this.type = this.data.type;
//       this.AddFieldForm.patchValue({
//         key_name: this.data.key_name,
//         english: this.data.english,
//         hindi: this.data.hindi,
//         bengali: this.data.bengali,
//         marathi: this.data.marathi,
//         telugu: this.data.telugu,
//         tamil: this.data.tamil
//       });
//     }
//   }



//   submitForm() {

//     console.log(this.AddFieldForm.value);



//     this.isSubmitted = true
//     if (this.AddFieldForm.valid) {

//       const httpOptions = {
//         headers: new HttpHeaders({
//           Authorization: "Bearer " + this.api.GetToken(),
//         }),
//       };

//       const formData = new FormData();

      
//       formData.append("key_name", this.AddFieldForm.value['key_name']);
//       formData.append("english", this.AddFieldForm.value['english']);
//       formData.append("hindi", this.AddFieldForm.value['hindi']);
//       formData.append("bengali", this.AddFieldForm.value['bengali']);
//       formData.append("marathi", this.AddFieldForm.value['marathi']);
//       formData.append("telugu", this.AddFieldForm.value['telugu']);
//       formData.append("tamil", this.AddFieldForm.value['tamil']);
//       formData.append("Login_User_Id", this.api.GetUserData("Code"));
//       formData.append("Login_User_Type", this.api.GetUserData("Type"));
//       this.api.IsLoading();

//       this.api
//         .HttpPostType('v2/language/addLang', formData)
//         .then(
//           (resp) => {
//             this.api.HideLoading();
//             if (resp['data']) {
//               this.api.Toast(resp['data'], resp['msg']);
//             }

//           },
//           (err) => {
//             this.api.HideLoading();
//           }
//         );
//     }
//   }


//   CloseModel(): void {
//     this.dialogRef.close({
//       Status: "Model Close",
//     });
//   }
// }



import {
  Component,
  OnInit,
  ViewChild,
  QueryList,
  ViewChildren,
  Inject
} from "@angular/core";

import { DataTableDirective } from "angular-datatables";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ApiService } from "src/app/providers/api.service";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-add-lang',
  templateUrl: './add-lang.component.html',
  styleUrls: ['./add-lang.component.css']
})
export class AddLangComponent implements OnInit {
  AddFieldForm: FormGroup;
  isUpdate: boolean = false;
  isSubmitted: boolean = false;
  currentUrl: any;
  type: any;

  id: any;

  constructor(
    private api: ApiService,
    public dialog: MatDialog,
    public fb: FormBuilder,
    public router: Router,
    public dialogRef: MatDialogRef<AddLangComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.type = this.data.type;
    this.id = this.data.id;
    this.currentUrl = this.router.url;

    this.AddFieldForm = this.fb.group({
      key_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z_]+$')]],
      english: ['', Validators.required],
      hindi: ['', Validators.required],
      bengali: ['', Validators.required],
      marathi: ['', Validators.required],
      telugu: ['', Validators.required],
      tamil: ['', Validators.required],
    });
  }

  ngOnInit() {
    if (this.data) {
      this.isUpdate = true;
      this.AddFieldForm.patchValue({
        key_name: this.data.key_name,
        english: this.data.english,
        hindi: this.data.hindi,
        bengali: this.data.bengali,
        marathi: this.data.marathi,
        telugu: this.data.telugu,
        tamil: this.data.tamil
      });
    }
  }

  // submitForm() {
  //   console.log(this.AddFieldForm.value);
  //   this.isSubmitted = true;

  //   if (this.AddFieldForm.valid) {
  //     const httpOptions = {
  //       headers: new HttpHeaders({
  //         Authorization: "Bearer " + this.api.GetToken(),
  //       }),
  //     };

  //     const formData = new FormData();
  //     formData.append("key_name", this.AddFieldForm.value['key_name']);
  //     formData.append("english", this.AddFieldForm.value['english']);
  //     formData.append("hindi", this.AddFieldForm.value['hindi']);
  //     formData.append("bengali", this.AddFieldForm.value['bengali']);
  //     formData.append("marathi", this.AddFieldForm.value['marathi']);
  //     formData.append("telugu", this.AddFieldForm.value['telugu']);
  //     formData.append("tamil", this.AddFieldForm.value['tamil']);
  //     formData.append("Login_User_Id", this.api.GetUserData("Code"));
  //     formData.append("Login_User_Type", this.api.GetUserData("Type"));

  //     this.api.IsLoading();


  //     if (this.isUpdate) {

  //       formData.append("id", this.id);  
  //       this.api.HttpPostType('v2/language/updateLang', formData).then(
  //         (resp) => {
  //           this.api.HideLoading();
  //           if (resp['status'] == "Success") {
  //             this.CloseModel();
  //             this.api.Toast('Success', resp['msg']);
  //           }
  //         },
  //         (err) => {
  //           this.api.HideLoading();
  //           this.api.Toast("Error", "Failed to update language");
  //         }
  //       );
      
  //     }
      
      
  //     else {
  //       this.api.HttpPostType('v2/language/addLang', formData).then(
  //         (resp) => {
  //           this.api.HideLoading();
  //           if (resp['data']) {
  //             this.api.Toast(resp['data'], resp['msg']);
  //             this.dialogRef.close({ Status: "Add Successful" });
  //           }
  //         },
  //         (err) => {
  //           this.api.HideLoading();
  //           this.api.Toast("Error", "Failed to add language");
  //         }
  //       );
  //     }
  //   }
  //   }





  submitForm() {
    this.isSubmitted = true;

    if (this.AddFieldForm.valid) {
      const httpOptions = {
        headers: new HttpHeaders({
          Authorization: "Bearer " + this.api.GetToken(),
        }),
      };

      const formData = new FormData();
      formData.append("key_name", this.AddFieldForm.value['key_name']);
      formData.append("english", this.AddFieldForm.value['english']);
      formData.append("hindi", this.AddFieldForm.value['hindi']);
      formData.append("bengali", this.AddFieldForm.value['bengali']);
      formData.append("marathi", this.AddFieldForm.value['marathi']);
      formData.append("telugu", this.AddFieldForm.value['telugu']);
      formData.append("tamil", this.AddFieldForm.value['tamil']);
      formData.append("update_stamp", this.AddFieldForm.value['update_stamp']);

      formData.append("Login_User_Id", this.api.GetUserData("Code"));
      formData.append("Login_User_Type", this.api.GetUserData("Type"));

      this.api.IsLoading();

      if (this.isUpdate) {
        formData.append("id", this.id);
        this.api.HttpPostType('lang-localizations/Languagelocalizations/updateLang', formData).then(
          (resp) => {
            this.api.HideLoading();
            if (resp['status'] == "Success") {
              this.CloseModel();
              this.api.Toast('Success', resp['msg']);
            }
          },
          (err) => {
            this.api.HideLoading();
            this.api.Toast("Error", "Failed to update language");
          }
        );
      }
    }
  }


  update() {
    this.submitForm();
  }
  add(){
    this.isSubmitted = true;

      if (this.AddFieldForm.valid) {
        const httpOptions = {
          headers: new HttpHeaders({
            Authorization: "Bearer " + this.api.GetToken(),
          }),
        };

    console.log(this.AddFieldForm.value);
    const formData = new FormData();
    formData.append("key_name", this.AddFieldForm.value['key_name']);
    formData.append("english", this.AddFieldForm.value['english']);
    formData.append("hindi", this.AddFieldForm.value['hindi']);
    formData.append("bengali", this.AddFieldForm.value['bengali']);
    formData.append("marathi", this.AddFieldForm.value['marathi']);
    formData.append("telugu", this.AddFieldForm.value['telugu']);
    formData.append("tamil", this.AddFieldForm.value['tamil']);
    formData.append("Login_User_Id", this.api.GetUserData("Code"));
    formData.append("Login_User_Type", this.api.GetUserData("Type"));

    this.api.IsLoading();
    this.api.HttpPostType('lang-localizations/Languagelocalizations/addLang', formData).then(
      (resp) => {
        this.api.HideLoading();
        if (resp['status'] == true) {
        
          this.api.Toast('Success', resp['msg']);
          this.CloseModel();

        }else{
          this.api.Toast('Warning', resp['msg']);
        }
      },
      (err) => {
        this.api.HideLoading();
        this.api.Toast("Error", "Failed to add language");
      }
    );
  }
  }
  
  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }
}



