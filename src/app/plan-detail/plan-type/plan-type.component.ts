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
import { PlanComponent } from "../plan/plan.component";
import { TypeUpdateComponent } from "../type-update/type-update.component";

import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";


class ColumnsObj {
  type: string;
  price: string;
  effect: string;
  create: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-plan-type',
  templateUrl: './plan-type.component.html',
  styleUrls: ['./plan-type.component.css']
})
export class PlanTypeComponent implements OnInit {

  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;

  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataAr: any[] = [];

  servicedata: any[];
  AddFieldForm: FormGroup;
  Sno: any = 0;
  LOBdata: any[];
  Input: any[];
  currentUrl: string;
  ActionType: any = "";

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
    private dialogRef: MatDialogRef<PlanComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
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
      LOB: ["", Validators.required],
      Categories: ["", Validators.required],
      Input: ["", Validators.required],
    });

    this.Input = [
      { Id: 1, Name: 'text' },
      { Id: 2, Name: 'textArea' },
      { Id: 3, Name: 'number' },
      { Id: 4, Name: 'multiple-title/description' },
      { Id: 5, Name: 'Yes?No' },
      { Id: 6, Name: 'Term?Investigation' },
    ];

  }
  ngOnInit(): void {
    this.getLOB();
    this.Get();
    this.currentUrl = this.router.url;
  }

  getLOB() {
    const formData = new FormData();
    this.api
      .HttpPostType('Plan_Title/getLOB', formData)
      .then(
        (resp) => {
          this.LOBdata = resp['lob'].map(item => ({ Id: item.Id, Name: item.Name }));
        },
        (err) => {
          console.error('HTTP error:', err);
          this.api.HideLoading();
        }
      );
  }


  SubBtn() {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.api.GetToken(),
      }),
    };


    if (this.AddFieldForm.valid) {
      const fields = this.AddFieldForm.value;
      const formData = new FormData();

      formData.append("LOB", fields['LOB'][0]['Name'])
      formData.append("Categories", fields["Categories"].trim());
      formData.append("input", fields['Input'][0]['Name']);
      formData.append("status", '1');


      const that = this;
      this.api.IsLoading();

      this.api
        .HttpPostType("/Plan_Title/planTitle", formData)
        .then(
          (result) => {
            if(result == 'Success'){

              this.AddFieldForm.get('LOB').reset();
              this.AddFieldForm.get('Categories').reset();
              this.AddFieldForm.get('Input').reset();

              this.Reload();
              this.api.HideLoading();
              this.api.Toast('Success', 'LOB Add Successfully');
              document.getElementById('formReset').click();
            }else{
              this.api.HideLoading();
              this.api.Toast('Warning', 'LOB Type Already Have');
            }
          },
          (err) => {
            this.api.HideLoading();
            this.Reload();
          }
        );
    }else{
      this.api.Toast('Warning', 'Check the Fields');
    }
  }

  Get() {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.api.GetToken(),
      }),
    };

    const that = this;
    this.dtOptions = {
      pagingType: "simple_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      searching: false,
      // dom: "ilpftripl",
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(environment.apiUrl + '/Plan_Title/planFetch?User_Id=' +
            this.api.GetUserData("Id") +
            '&User_Type=' +
            this.api.GetUserType() +
            '&url=' +
            this.currentUrl +
            '&Action=' +
            this.ActionType),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((res:any) => {
    var resp = JSON.parse(this.api.decryptText(res.response));
            that.dataAr = resp.data;
            this.AddFieldForm.reset();
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
    };
  }

  Reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var pageinfo = dtInstance.page.info().page;
      //dtInstance.draw();
      dtInstance.page(pageinfo).draw(false);
    });
  }

  status(id, st) {
    let con = confirm('Are You Sure');
    if (con) {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("st", st);

      const that = this;
      this.api.IsLoading();

      this.api
        .HttpPostType("/Plan_Title/planStatus", formData)
        .then(
          (result) => {
            this.AddFieldForm.reset();
            this.Reload();
            this.api.HideLoading();
            this.api.Toast('Success', 'Status Update Successfully');
          },
          (err) => {
            this.Reload();
            this.api.HideLoading();
          }
        );
    }
  }

  dailog(id) {
    const dialogRef = this.dialog.open(TypeUpdateComponent, {
      width: "60%",
      height: "60%",
      disableClose: true,
      data: { id: id }
    })

    dialogRef.afterClosed().subscribe(result => {
      this.Reload();
    });
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }
}
