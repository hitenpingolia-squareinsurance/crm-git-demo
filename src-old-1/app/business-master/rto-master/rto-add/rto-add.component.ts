import {
  Component,
  OnInit,
  ViewChild,
  QueryList,
  ViewChildren,
  Inject,
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
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
import { RtoMasterComponent } from "../rto-master.component";



@Component({
  selector: 'app-rto-add',
  templateUrl: './rto-add.component.html',
  styleUrls: ['./rto-add.component.css']
})
export class RtoAddComponent implements OnInit {

  AddFieldForm: FormGroup;
  state: any[];

  financialYearVal: { Id: string; Name: string }[];

  dropdownSettingsmultiselect: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };

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
    private dialogRef: MatDialogRef<RtoMasterComponent>,
  ) {
    this.AddFieldForm = this.formBuilder.group({
      rto: ['', Validators.required],
      code: ['', [Validators.required, Validators.maxLength(4), Validators.minLength(3)]],
      state: ['', Validators.required],
    });

    this.dropdownSettingsmultiselect = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };
  }

  ngOnInit() {
    this.getstate();
  }

  getstate() {
    const formData = new FormData();

    this.api
      .HttpPostTypeBms('../v2/business_master/RTO/getstate', formData)
      .then(
        (resp) => {
          this.state = resp['data'].map(item => ({ Id: item.Id, Name: item.Name }));
          // this.LOBdata = resp['data'];
        },
        (err) => {
          console.error('HTTP error:', err);
        }
      );
  }

  onClose() {
    document.getElementById('close').click();
  }

  onRTOcode(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value.toUpperCase();

    const alphaPart = inputValue.substring(0, 2);
    const numericPart = inputValue.substring(2, 4);
    // const midAlphaPart = inputValue.substring(4, 6);
    // const lastnumericPart = inputValue.substring(6, 10);

    let updatedValue = '';

    if (alphaPart !== '' && this.isValid(alphaPart, /^[A-Z]+$/)) {
      updatedValue += alphaPart;
    }
    else {
      updatedValue += alphaPart.slice(0, -1);
    }

    if (numericPart !== '' && this.isValid(numericPart, /^[0-9]+$/)) {
      updatedValue += numericPart;
    }
    else {
      updatedValue += numericPart.slice(0, -1);
    }

    // if (midAlphaPart !== '' && this.isValid(midAlphaPart, /^[A-Z]+$/)) {
    //   updatedValue += midAlphaPart;
    // }
    // else {
    //   updatedValue += midAlphaPart.slice(0, -1);
    // }

    // if (lastnumericPart !== '' && this.isValid(lastnumericPart, /^[0-9]+$/)) {
    //   updatedValue += lastnumericPart;
    // }
    // else {
    //   updatedValue += lastnumericPart.slice(0, -1);
    // }

    this.AddFieldForm.get('code').setValue(updatedValue);
  }

  private isValid(value: string, regex: RegExp): boolean {
    return regex.test(value);
  }

  SubBtn() {
    this.markFormGroupTouched(this.AddFieldForm);
    if (this.AddFieldForm.valid) {

      let data = (JSON.stringify(this.AddFieldForm.value));
      const formData = new FormData();

      formData.append("data", data);
      this.api.IsLoading();
      this.api
        .HttpPostTypeBms('../v2/business_master/RTO/addRTO', formData)
        .then(
          (resp) => {
            this.api.HideLoading();
            this.api.Toast(resp['status'], resp['msg']);
            if (resp['status'] == 'Success') {
              this.CloseModel();
              this.business_log(resp['id']);
            }
          },
          (err) => {
            this.api.HideLoading();
          }
        );
    }
  }

  business_log(id: any) {
    let data = (JSON.stringify(this.AddFieldForm.value));
    const formData = new FormData();
    formData.append("data", data);
    formData.append("table", 'square.rto');
    formData.append("log", 'insert');
    formData.append("id", id);
    formData.append("User_Id", this.api.GetUserData("Id"));
    this.api
      .HttpPostTypeBms('../v2/business_master/Business_Log/logInsert', formData)
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
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

}
