import { DataTableDirective } from "angular-datatables";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormArray,
} from "@angular/forms";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-itemsrno",
  templateUrl: "./itemsrno.component.html",
  styleUrls: ["./itemsrno.component.css"],
})
export class ItemsrnoComponent implements OnInit {
  loadAPI: Promise<any>;

  ActionType: any = "";
  srnoform: FormGroup;
  isSubmitted = false;
  TotalQuantity: any;
  InventoryId: any;
  Id: any;

  constructor(
    private api: ApiService,
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<ItemsrnoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.InventoryId = this.data.InventoryId;
    this.Id = this.data.Id;

    this.srnoform = this.formBuilder.group({
      quantities: this.formBuilder.array([]),
    });
  }

  ngOnInit() {
    var i = 1;
    this.TotalQuantity = this.data.TotalQuantity;

    for (i = 1; i <= this.TotalQuantity; i++) {
      this.addQuantity();
    }
  }

  quantities(): FormArray {
    return this.srnoform.get("quantities") as FormArray;
  }

  newQuantity(): FormGroup {
    return this.formBuilder.group({
      srno: [""],
    });
  }

  addQuantity() {
    this.quantities().push(this.newQuantity());
  }

  get formControls() {
    return this.srnoform.value;
  }

  removeQuantity(i: number) {
    this.quantities().removeAt(i);
  }

  // onSubmit() {
  //   // console.log(this.srnoform.value);
  // }
  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }
  onSubmit() {
    var fields = this.srnoform.value;
    // // console.log(fields);

    // var fields1 = this.remarkform.controls;

    // // console.log(fields);

    const formData = new FormData();

    this.isSubmitted = true;
    if (this.srnoform.invalid) {
      return;
    } else {
      var fields = this.srnoform.value;
      const formData = new FormData();

      formData.append("quantities", JSON.stringify(fields["quantities"]));
      formData.append("loginId", this.api.GetUserData("Id"));
      formData.append("loginType", this.api.GetUserType());
      formData.append("InventoryId", this.InventoryId);
      formData.append("Id", this.Id);

      this.api.IsLoading();
      this.api.HttpPostType("AssetsManagement/Srnorequset", formData).then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);

          if (result["status"] == 1) {
            this.api.Toast("Success", result["msg"]);
            this.CloseModel();
            // this.router.navigate(["Assets/Action"]);
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
}
