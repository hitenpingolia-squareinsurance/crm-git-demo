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
import { PincodeMasterComponent } from "../pincode-master.component";

@Component({
  selector: "app-update-pincode",
  templateUrl: "./update-pincode.component.html",
  styleUrls: ["./update-pincode.component.css"],
})
export class UpdatePincodeComponent implements OnInit {
  AddFieldForm: FormGroup;
  active: any[];
  stateAr: any[];
  districtAr: any[];
  cityAr: any[];
  dataAr: any[];
  isSubmitted = false;
  id: any;

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
    private dialogRef: MatDialogRef<PincodeMasterComponent>,
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
      area: ["", [Validators.required, Validators.pattern("[a-zA-Z. ]*")]],
      pincode: [
        "",
        [
          Validators.required,
          Validators.min(111111),
          Validators.max(999999),
          Validators.pattern("^[0-9]*$"),
        ],
      ],
      state: ["", Validators.required],
      district: ["", Validators.required],
      city: ["", Validators.required],
      Area_ID_PK: [""],
      id: [""],
    });

    this.active = [
      { Id: 1, Name: "Active" },
      { Id: 0, Name: "Inactive" },
    ];
  }

  ngOnInit() {
    this.getState();
    this.getDetails();
  }

  get FC() {
    return this.AddFieldForm.controls;
  }

  getDetails() {
    const field = new FormData();
    field.append("id", this.id);
    this.api
      .HttpPostTypeBms("../v2/business_master/PincodeMaster/getDetail", field)
      .then(
        (resp) => {
          if (resp["status"] == true) {
            this.AddFieldForm.patchValue({
              area: resp["data"][0].area,
              pincode: resp["data"][0].pincode,
              state: resp["data"][0].state,
              district: resp["data"][0].district,
              city: resp["data"][0].city,
              Area_ID_PK: resp["data"][0].Area_ID_PK,
              id: this.id,
            });

            //   //   //   console.log(resp['data'][0].state)
          }
        },
        (err) => {
          console.error("HTTP error:", err);
        }
      );
  }

  getState() {
    const field = new FormData();
    this.api
      .HttpPostTypeBms("../v2/business_master/PincodeMaster/getState", field)
      .then(
        (resp) => {
          this.stateAr = resp["stateAr"];
        },
        (err) => {
          console.error("HTTP error:", err);
        }
      );
  }

  getDistrict(state: any) {
    const field = new FormData();
    field.append("state", JSON.stringify(state));
    this.api
      .HttpPostTypeBms("../v2/business_master/PincodeMaster/getDistrict", field)
      .then(
        (resp) => {
          this.districtAr = resp["districtAr"];
        },
        (err) => {
          console.error("HTTP error:", err);
        }
      );
  }

  getCity(district: any) {
    const field = new FormData();
    field.append("district", JSON.stringify(district));
    this.api
      .HttpPostTypeBms("../v2/business_master/PincodeMaster/getCity", field)
      .then(
        (resp) => {
          this.cityAr = resp["cityAr"];
        },
        (err) => {
          console.error("HTTP error:", err);
        }
      );
  }

  updatePincdoe() {
    this.isSubmitted = true;
    if (this.AddFieldForm.valid) {
      let data = JSON.stringify(this.AddFieldForm.value);
      const formData = new FormData();
      formData.append("data", data);
      this.api
        .HttpPostTypeBms(
          "../v2/business_master/PincodeMaster/updatePincdoe",
          formData
        )
        .then(
          (resp) => {
            //   //   //   console.log(resp,"res");
            this.api.HideLoading();

            if (resp["status"] == true) {
              this.CloseModel();
              this.isSubmitted = false;
              this.api.Toast("Success", resp["msg"]);
            } else {
              this.api.Toast("Warning", resp["msg"]);
            }
          },
          (err) => {
            this.api.HideLoading();
          }
        );
    }
  }
  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  onlyAllowAlphabet(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (
      (charCode < 65 || charCode > 90) &&
      (charCode < 97 || charCode > 122) &&
      charCode !== 32
    ) {
      event.preventDefault();
    }
  }
  onlyAllowNumbers(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
}
