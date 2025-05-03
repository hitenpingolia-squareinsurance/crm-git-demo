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
import { environment } from "src/environments/environment";;
import { ApiService } from "../../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";


import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";
import { BrokerComponent } from "../broker.component";

@Component({
  selector: 'app-add-broker',
  templateUrl: './add-broker.component.html',
  styleUrls: ['./add-broker.component.css']
})
export class AddBrokerComponent implements OnInit {

  AddFieldForm: FormGroup;
  active: any[];

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
    private dialogRef: MatDialogRef<BrokerComponent>
  ) {

    this.dropdownSettingsmultiselect = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };


    this.AddFieldForm = this.formBuilder.group({
      name: ['', Validators.required],
      status: ['', Validators.required],
      
    });

    this.active = [
      { Id: 1, Name: 'Active' },
      { Id: 0, Name: 'Inactive' },
    ];
   }

  ngOnInit() {
    
  }

  SubBtn() {
    this.markFormGroupTouched(this.AddFieldForm);
    if (this.AddFieldForm.valid) {
      let data = (JSON.stringify(this.AddFieldForm.value));
      const formData = new FormData();
      formData.append("data", data);
      this.api.IsLoading();
      this.api
        .HttpPostTypeBms('../v2/business_master/Brokers/addbroker', formData)
        .then(
          (resp) => {
            this.api.HideLoading();
            this.CloseModel();
            this.api.Toast(resp['status'], resp['msg'])
            // this.AddFieldForm.reset();
            if(resp['status'] == 'Success'){
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
    formData.append("table", 'bms.d_broker');
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
