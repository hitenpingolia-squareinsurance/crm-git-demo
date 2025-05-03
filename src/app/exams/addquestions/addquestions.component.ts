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
  selector: "app-addquestions",
  templateUrl: "./addquestions.component.html",
  styleUrls: ["./addquestions.component.css"],
})
export class AddquestionsComponent implements OnInit {
  // @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;

  // dtOptions: DataTables.Settings = {};

  // dataAr: any;

  QuestionAnswerForm: FormGroup;

  isSubmitted = false;
  loadAPI: Promise<any>;
  // dataAr2: any;

  showTable: any = 1;
  type: any;
  id: any;

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

  dataArr: any;
  category_Name: any[];
  selectedFiles: any;
  image: any;
  url: string;
  set: { Id: string; Name: string }[];
  set_no: any[];
  setdata: any[];

  // SubProducts: { Id: number; Name: string; }[];
  // Category: any;
  // dataArr: any;
  // actiontype: any;
  // url: string;
  // category_name: any[];
  // categoryname: any;
  // category: any;
  // category_Name: any[];

  // showForm1: any = 0;
  // showForm2: any = 0;
  // showForm3: any = 0;
  // SingleSrLogData: any;
  // financialYearVal: { Id: string; Name: string; }[];

  constructor(
    private api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddquestionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.type = this.data.type;

    this.id = this.data.id;

    // // console.log(this.type);
    // // console.log(this.id);

    this.QuestionAnswerForm = this.formBuilder.group({
      question: ["", Validators.required],
      set: ["", Validators.required],
      optionone: ["", Validators.required],
      optiontwo: ["", Validators.required],
      optionthree: ["", Validators.required],
      optionfour: ["", Validators.required],
      answer: ["", Validators.required],
      marks: ["", Validators.required],
    });

    // else if(this.type=='Sub') {
    //   this.QuestionAnswerForm = this.formBuilder.group({
    //     title: ['', Validators.required],
    //     image: ['', Validators.required],
    //     categoryname: ['', Validators.required],
    //     ckeditorContent: ['', Validators.required],
    //     Url: ['', Validators.required],
    //   });
    // }

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

    this.set = [
      { Id: "1", Name: "Set 1" },
      { Id: "2", Name: "Set 2" },
      { Id: "3", Name: "Set 3" },
      { Id: "4", Name: "Set 4" },
      { Id: "5", Name: "Set 5" },
      { Id: "6", Name: "Set 6" },
      { Id: "7", Name: "Set 7" },
      { Id: "8", Name: "Set 8" },
      { Id: "9", Name: "Set 9" },
      { Id: "10", Name: "Set 10" },
      { Id: "11", Name: "Set 11" },
      { Id: "12", Name: "Set 12" },
    ];
  }

  ngOnInit() {
    if (this.type == "Edit") {
      this.getValueEdit();
    }
  }

  // FilterSet() {
  //   this.api.IsLoading();
  //   this.api
  //     .HttpGetType(
  //       "Exams/FilterSet?User_Id=" +
  //       this.api.GetUserData("Id") +
  //       "&User_Type=" +
  //       this.api.GetUserType()
  //     )
  //     .then(
  //       (result) => {
  //         this.api.HideLoading();
  //         if (result["status"] == 1) {
  //           this.set = result["Data"];
  //           // console.log(this.set);
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
    this.api.HttpPostType("Exams/EditQuestion", formData).then(
      (result) => {
        this.api.HideLoading();
        // console.log(result);

        if (result["status"] == true) {
          this.dataArr = result["data"];
          this.QuestionAnswerForm.patchValue(this.dataArr);

          this.set_no = [result["set_no"]];
          // this.setdata = this.dataArr.set_no;
          // // console.log(this.setdata);

          // this.set_no = [result["set"][0]];
          // console.log(result['set_no']);

          // console.log(this.dataArr);
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
    return this.QuestionAnswerForm.controls;
  }

  submit() {
    // console.log(this.type);

    this.isSubmitted = true;
    if (this.QuestionAnswerForm.invalid) {
      return;
    } else {
      var fields = this.QuestionAnswerForm.value;

      const formData = new FormData();

      formData.append("user_id", this.api.GetUserData("Id"));
      formData.append("user_type", this.api.GetUserType());

      if (this.type == "Edit") {
        formData.append("Id", this.id);
      }

      formData.append("type", this.type);

      //  if(this.type=='Main') {
      //   formData.append('categoryname', fields['categoryname']);
      //   formData.append('Quotes_Url', fields['Quotes_Url']);

      //  }
      //  if(this.type=='Sub') {
      //   formData.append('categoryname', fields['categoryname'][0]['Name']);
      //  }

      formData.append("question", fields["question"]);

      formData.append("set", fields["set"][0]["Id"]);

      formData.append("optionone", fields["optionone"]);
      formData.append("optiontwo", fields["optiontwo"]);
      formData.append("optionthree", fields["optionthree"]);
      formData.append("optionfour", fields["optionfour"]);
      formData.append("answer", fields["answer"]);
      formData.append("marks", fields["marks"]);

      // console.log(formData);

      if (this.type == "Add") {
        this.url = "Exams/AddQuestion";
      }

      if (this.type == "Edit") {
        this.url = "Exams/UpdateQuestionDetails";
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

        if (Total_Size >= 1024 * 3) {
          // allow only 2 mb
          this.api.Toast("Warning", "File size is greater than 3 mb");

          if (Type == "image") {
            this.QuestionAnswerForm.get("image").setValue("");
          }
        } else {
          if (Type == "image") {
            this.image = this.selectedFiles;
          }
        }
      } else {
        // console.log('Extenstion is not vaild !');

        this.api.Toast(
          "Warning",
          "Please choose vaild file ! Example :- PNG,JPEG,JPG,PDF"
        );

        if (Type == "image") {
          this.QuestionAnswerForm.get("image").setValue("");
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
