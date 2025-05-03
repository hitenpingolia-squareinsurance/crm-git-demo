import {
  Component,
  OnInit,
  ViewChild,
  QueryList,
  ViewChildren,
  Inject,
} from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from "@angular/material/dialog";
import { DataTableDirective } from "angular-datatables";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { ApiService } from "src/app/providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";

import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";
import { CompanyMasterComponent } from "../company-master.component";

@Component({
  selector: "app-company-update",
  templateUrl: "./company-update.component.html",
  styleUrls: ["./company-update.component.css"],
})
export class CompanyUpdateComponent implements OnInit {
  AddFieldForm: FormGroup;
  active: any[];
  id: any;
  dataAr: any[] = [];
  isSubmitted = false;
  fileError: any;
  FileNames: any;
  validImageExtensions: string[] = ["jpg", "jpeg", "png", "gif"];
 

  dropdownSettingsmultiselect: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  logoUrl: any;
  selectedFiles: any;
  payin: { Id: string; Name: string; }[];
  split: { Id: number; Name: string; }[];

  constructor(
    public api: ApiService,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private route: ActivatedRoute,

    private dialogRef: MatDialogRef<CompanyMasterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.id = data.id;

    this.dropdownSettingsmultiselect = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.AddFieldForm = this.formBuilder.group({
      id: [""],
      company: ["", [Validators.required, Validators.pattern("[a-zA-Z. ]*")]],
      motor: [false],
      health: [false],
      nonM: [false],
      life: [false],
      pa: [false],
      travel: [false],
      status: ["", Validators.required],
      logo: [""],
      payin: ['', Validators.required],
      split: ['', Validators.required],
    });

    this.active = [
      { Id: "Active", Name: "Active" },
      { Id: "Inactive", Name: "Inactive" },
    ];


    this.payin = [
      { Id: '1', Name: 'Risk Start Date' },
      { Id: '2', Name: 'Issue Date' },
    ];

    this.split = [
      {Id:0,Name:'No'},
      {Id:1,Name:'Yes'}
    ];

  }

  ngOnInit() {
    this.fetch();
  }

  fetch() {
    const formData = new FormData();
    formData.append("id", this.id);
    this.api.IsLoading();
    this.api
      .HttpPostTypeBms("../v2/business_master/CompanyMaster/fetch", formData)
      .then(
        (resp) => {
          
          this.dataAr[0] = resp[0];
          // this.logoUrl = this.dataAr[0].logo;
          // alert(this.logoUrl);
          // console.log(this.dataAr);
          console.log(this.dataAr[0].Payout);

          this.AddFieldForm.patchValue({
            id: this.dataAr[0].Id,
            company: this.dataAr[0].Name,
            motor: this.dataAr[0].Motor,
            health: this.dataAr[0].Health,
            nonM: this.dataAr[0].Non_Motor,
            life: this.dataAr[0].Life,
            pa: this.dataAr[0].PA,
            travel: this.dataAr[0].Travel,
           // payin: [{ Id: this.dataAr[0].payin_posting_criteria, Name: this.dataAr[0].payin_posting_criteria === 1 ? 'Risk Start Date' : 'Issue Date' }],
            //payin: [{ Id: result[0].payin_posting_criteria, Name: result[0].payin_posting_criteria == 1 ? 'Risk Start Date' : 'Issue Date' }],
            payin: [
              {
                Id: this.dataAr[0].Payout == 1 ? "1" : "2",
                Name: this.dataAr[0].Payout == 1 ? "Risk Start Date" : "Issue Date",
              },
            ],
            split: [
              {
                Id: this.dataAr[0].Split == 1 ? 1 : 0,
                Name: this.dataAr[0].Split == 1 ? "Yes" : "No",
              },
            ],
            status: [
              {
                Id: this.dataAr[0].Status == 1 ? "Active" : "Inactive",
                Name: this.dataAr[0].Status == 1 ? "Active" : "Inactive",
              },
            ],
          });
          this.clickMultiple();
          this.api.HideLoading();
        },
        (err) => {
          this.api.HideLoading();
        }
      );
  }


  UploadDocs(event) {
    this.selectedFiles = event.target.files[0];
    if (event.target.files && event.target.files[0]) {

      var str = this.selectedFiles.name;
      var ar = str.split(".");

      var ext;
      for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();

      if (ext == "png" || ext == "jpeg" || ext == "jpg" || ext == "pdf") {
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);

        if (Total_Size >= 1024 * 2) {
          this.api.Toast("Warning", "File size is greater than 2 mb");
         // this.SetImagesValues("unset", Image_no, this.selectedFiles);
        } else {
          //this.SetImagesValues("set", Image_no, this.selectedFiles);
        }
      } else {
        this.api.Toast(
          "Warning",
          "Please choose vaild file ! Example :- PNG,JPEG,JPG,PDF"
        );
        //this.SetImagesValues("unset", Image_no, this.selectedFiles);
      }
    }
  }



  clickMultiple() {
    document.getElementById("click").click();
  }

  SubBtn() {

    console.log(this.selectedFiles);
    this.isSubmitted = true;
    var field = this.AddFieldForm.value;

    if (field["status"][0]["Name"] == "Active") {
      field["status"][0]["Id"] = 1;
    } else {
      field["status"][0]["Id"] = 0;
    }

   
    if (this.AddFieldForm.valid) {
      if (
        field["travel"] == 1 ||
        field["pa"] == 1 ||
        field["life"] == 1 ||
        field["health"] == 1 ||
        field["motor"] == 1 ||
        field["nonM"] == 1
      ) {
        let data = JSON.stringify(this.AddFieldForm.value);
        console.log(data);
        const formData = new FormData();
        formData.append("data", data);
        formData.append("file", this.selectedFiles);
        this.api.IsLoading();
        this.api
          .HttpPostTypeBms(
            "../v2/business_master/CompanyMaster/updateCompany",
            formData
          )
          .then(
            (resp) => {
              this.api.HideLoading();
              this.CloseModel();
              this.api.Toast(resp["status"], resp["msg"]);
              this.business_log(this.id);
              this.isSubmitted = false;
            },
            (err) => {
              this.api.HideLoading();
            }
          );
      } else {
        this.api.Toast("Warning", "Select One Check Box");
      }
    }
  }

  business_log(id: any) {
    let data = JSON.stringify(this.AddFieldForm.value);
    const formData = new FormData();
    formData.append("data", data);
    formData.append("table", "square.d_ins_companies");
    formData.append("log", "update");
    formData.append("id", id);
    formData.append("User_Id", this.api.GetUserData("Id"));
    this.api
      .HttpPostTypeBms("../v2/business_master/Business_Log/logInsert", formData)
      .then(
        (resp) => {
          this.AddFieldForm.reset();
        },
        (err) => {
          this.api.HideLoading();
        }
      );
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  toggleCheckbox(checked: boolean, form: string) {
    this.AddFieldForm.get(form).setValue(checked ? true : false);
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

 
}
