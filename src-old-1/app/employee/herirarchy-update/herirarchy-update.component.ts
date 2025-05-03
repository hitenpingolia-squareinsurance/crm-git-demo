import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormArray,
} from "@angular/forms";

@Component({
  selector: "app-herirarchy-update",
  templateUrl: "./herirarchy-update.component.html",
  styleUrls: ["./herirarchy-update.component.css"],
})
export class HerirarchyUpdateComponent implements OnInit {
  isSubmitted = false;
  loadAPI: Promise<any>;
  // AddCatForm: FormGroup;
  AddFieldForm: FormGroup;
  LeadForm: any;
  AddedField = 0;
  maxDate = new Date();
  minDate = new Date();
  financialYearVal: { Id: string; Name: string }[];
  EmpDaataAr: any;

  dropdownSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };
  selectedValue: string;
  employeeId: any;
  Dataresult: any;
  dataArr: unknown;
  EmployeeId: any;

  constructor(
    private api: ApiService,
    private router: Router,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<HerirarchyUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.EmployeeId = this.data.EmployeeId;

    this.dropdownSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.selectedValue = "Select Type";
  }

  ngOnInit() {
    this.getdata();
  }
  CloseModel() {
    this.dialogRef.close();
  }
  getdata() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "b-crm/employee/EmployeeHirerchylog?EmployeeId=" + this.EmployeeId
      )
      .then(
        (result) => {
          this.api.HideLoading();
          this.dataArr = result;
        },
        (err) => {
          this.api.HideLoading();
          this.dataArr = err["error"]["text"];
          // console.log( this.dataArr);
        }
      );
  }
}
