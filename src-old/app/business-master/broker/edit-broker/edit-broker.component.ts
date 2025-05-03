import {
  Component,
  OnInit,
  Inject,
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { DataTableDirective } from "angular-datatables";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
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
  selector: 'app-edit-broker',
  templateUrl: './edit-broker.component.html',
  styleUrls: ['./edit-broker.component.css']
})
export class EditBrokerComponent implements OnInit {

  AddFieldForm: FormGroup;
  active: any[];
  id: any;
  dataAr: any[] = [];

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
    private dialogRef: MatDialogRef<BrokerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
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
      id: [''],
      name: ['', Validators.required],
      status: ['', Validators.required],
      
    });

    this.active = [
      { Id: 'Active', Name: 'Active' },
      { Id: 'Inactive', Name: 'Inactive' },
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
      .HttpPostTypeBms('../v2/business_master/Brokers/fetch', formData)
      .then(
        (resp) => {
          this.dataAr[0] = resp[0];

          this.AddFieldForm.patchValue({
            id: this.id, 
            name: this.dataAr[0].name, 
            status: [{Id: this.dataAr[0].status == 1? 'Active' : 'Inactive', Name: this.dataAr[0].status == 1? 'Active' : 'Inactive'}],
          })
          
          document.getElementById('close').click();
          this.api.HideLoading();
        },
        (err) => {
          this.api.HideLoading();
        }
      );
  }

  SubBtn() {
    this.markFormGroupTouched(this.AddFieldForm);
    var field = this.AddFieldForm.value;

    if(field['status'][0]['Name'] == 'Active'){
      field['status'][0]['Id'] = 1;
    }
    else{
      field['status'][0]['Id'] = 0;
    }

    if (this.AddFieldForm.valid) {
      let data = (JSON.stringify(this.AddFieldForm.value));
      const formData = new FormData();
      formData.append("data", data);
      this.api.IsLoading();
      this.api
        .HttpPostTypeBms('../v2/business_master/Brokers/updateBroker', formData)
        .then(
          (resp) => {
            this.api.HideLoading();
            this.CloseModel();
            this.api.Toast(resp['status'], resp['msg'])
            // this.AddFieldForm.reset();
            if(resp['status'] == 'Success'){
              this.business_log(this.id);
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
    formData.append("log", 'update');
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
