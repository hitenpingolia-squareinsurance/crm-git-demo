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
import { PincodeMasterComponent } from "../pincode-master.component";

@Component({
  selector: 'app-add-pincode',
  templateUrl: './add-pincode.component.html',
  styleUrls: ['./add-pincode.component.css']
})
export class AddPincodeComponent implements OnInit {
  AddFieldForm: FormGroup;
  active: any[];
  stateAr: any[];
  districtAr: any[];
  cityAr: any[];
  isSubmitted = false;
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
    private dialogRef: MatDialogRef<PincodeMasterComponent>
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
      area: ['', [Validators.required,Validators.pattern('[a-zA-Z. ]*')]],
      pincode: ['', [Validators.required, Validators.min(111111), Validators.max(999999),Validators.pattern("^[0-9]*$")]],
      state: ['', Validators.required],
      district: ['', Validators.required],
      city: ['', Validators.required],
    });

    this.active = [
      { Id: 1, Name: 'Active' },
      { Id: 0, Name: 'Inactive' },
    ];
  }

  ngOnInit() {
    this.getState();
  }

get FC(){
  return this.AddFieldForm.controls;
}
onlyAllowAlphabet(event: KeyboardEvent) {
  const charCode = event.which ? event.which : event.keyCode;
  if ((charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122) && charCode !== 32) {
    event.preventDefault();
  }
}
onlyAllowNumbers(event: KeyboardEvent) {
  const charCode = event.which ? event.which : event.keyCode;
  if (charCode < 48 || charCode > 57) {
    event.preventDefault();
  }
}
  getState() {
    const field = new FormData();
    this.api
      .HttpPostTypeBms('../v2/business_master/PincodeMaster/getState', field)
      .then(
        (resp) => {
         this.stateAr = resp['stateAr']
        },
        (err) => {
          console.error('HTTP error:', err);
        }
      );
  }

  getDistrict(state: any) {
    const field = new FormData();
    field.append('state', JSON.stringify(state));
    this.api
      .HttpPostTypeBms('../v2/business_master/PincodeMaster/getDistrict', field)
      .then(
        (resp) => {
         this.districtAr = resp['districtAr']
        },
        (err) => {
          console.error('HTTP error:', err);
        }
      );
  }

  getCity(district: any) {
    const field = new FormData();
    field.append('district', JSON.stringify(district));
    this.api
      .HttpPostTypeBms('../v2/business_master/PincodeMaster/getCity', field)
      .then(
        (resp) => {
         this.cityAr = resp['cityAr'];
        },
        (err) => {
          console.error('HTTP error:', err);
        }
      );
  }

  SubBtn(){
     this.isSubmitted = true;
     if (this.AddFieldForm.valid) { 
         let data = (JSON.stringify(this.AddFieldForm.value));
         const formData = new FormData();
         formData.append("data", data);
         this.api
           .HttpPostTypeBms('../v2/business_master/PincodeMaster/addpincode', formData)
           .then(
             (resp) => {
               this.api.HideLoading();
               
               if (resp['status'] == true) {
                this.api.Toast("Success", resp['msg'])
                 this.CloseModel();
                 this.isSubmitted = false;
               }else{
                this.api.Toast("Warning", resp['msg'])

               }
             },
             (err) => {
               this.api.HideLoading();
             }
           );
    /* else{
         this.api.Toast('Warning', 'Select One Check Box');
       } */
     }


  }
  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }
}
