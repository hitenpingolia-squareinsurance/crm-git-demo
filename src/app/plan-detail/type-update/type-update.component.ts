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
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { PlanTypeComponent } from "../plan-type/plan-type.component";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-type-update',
  templateUrl: './type-update.component.html',
  styleUrls: ['./type-update.component.css']
})
export class TypeUpdateComponent implements OnInit {

  AddFieldForm: FormGroup;
  LOBdata: any[];
  Input: any[];
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
    private dialogRef: MatDialogRef<PlanTypeComponent>,
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
      LOB: [null, Validators.required],
      Type: [null, Validators.required],
      Input: [null, Validators.required],
    })

    this.LOBdata = [
      { Id: 'Health', Name: 'Health' },
      { Id: 'Life', Name: 'Life' },
      { Id: 'Motor', Name: 'Motor' },
      { Id: 'Non-Motor', Name: 'Non-Motor' },
      { Id: 'Personal Accident', Name: 'Personal Accident' },
      { Id: 'Travel', Name: 'Travel' },
      { Id: 'PET Insurance', Name: 'PET Insurance' }
    ];

    this.Input = [
      { Id: 'text', Name: 'text' },
      { Id: 'textArea', Name: 'textArea' },
      { Id: 'number', Name: 'number' },
      { Id: 'multiple-title/description', Name: 'multiple-title/description' },
      { Id: 'Yes?No', Name: 'Yes?No' },
      { Id: 'Term?Investigation', Name: 'Term?Investigation' },
    ];
  }

  ngOnInit() {
    this.Get();
  }

  Get() {

    const formData = new FormData();
    formData.append("id", this.id);

    const that = this;
    this.api.IsLoading();

    this.api
      .HttpPostType("/Plan_Title/getType", formData)
      .then(
        (result) => {

          that.dataAr[0] = result['data'][0];


          this.AddFieldForm.patchValue({
            LOB: [{ Id: this.dataAr[0].LOB, Name: this.dataAr[0].LOB }],
            Type: this.dataAr[0].Categories,
            Input: [{ Id: this.dataAr[0].input, Name: this.dataAr[0].input }],
          });
          this.api.HideLoading();
          this.show();
        },
        (err) => {
          this.api.HideLoading();
        }
      );
  }

  show() {
    document.getElementById('click').click();
  }

  SubBtn() {
    this.markFormGroupTouched(this.AddFieldForm);
    if (this.AddFieldForm.valid) {
      this.api.IsLoading();
      const field = this.AddFieldForm.value;

      const formData = new FormData();
      formData.append("id", this.id);
      formData.append("Categories", field['Type']);
      formData.append("LOB", field['LOB'][0]['Name']);
      formData.append("input", field['Input'][0]['Name']);
      this.api
        .HttpPostType("/Plan_Title/typeUpdate", formData)
        .then(
          (result) => {
            this.api.HideLoading();
            this.CloseModel();
            this.api.Toast('Success', 'Sucessfully Update');
          },
          (err) => {
            this.api.HideLoading();
            this.CloseModel();
          }
        );
    }
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
