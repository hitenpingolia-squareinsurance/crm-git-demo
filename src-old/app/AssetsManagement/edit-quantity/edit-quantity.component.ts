import { InventoryLogComponent } from "./../inventory-log/inventory-log.component";
import { Component, OnInit, Inject } from "@angular/core";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { ApiService } from "../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ItemsrnoComponent } from "../itemsrno/itemsrno.component";


@Component({
  selector: "app-edit-quantity",
  templateUrl: "./edit-quantity.component.html",
  styleUrls: ["./edit-quantity.component.css"],
})

export class EditQuantityComponent implements OnInit {
  updateQuantity: FormGroup;

  isSubmitted = false;
  loadAPI: Promise<any>;
  id: any;
  dataArr: any;
  totamount: number;
  stock: number = 0;

  constructor(
    private api: ApiService,
    private router: Router,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<EditQuantityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog
  ) {
    this.id = this.data.Id;
    // this.stock = this.data.In_Stock;
    // this.stock = this.data.In_Stock;
    // this.CategoryId = this.data.In_Stock;

    // console.log(this.stock);

    this.updateQuantity = this.formBuilder.group({
      quantity: ["", [Validators.required]],
      amount: ["", [Validators.required]],
      remark: ["", [Validators.required]],
      totamount: [""],
    });
  }

  ngOnInit() {
    this.getdata();
  }

  onSearchChange() {
    const quantity = this.updateQuantity.value["quantity"];

    const amount = this.updateQuantity.value["amount"];

    this.totamount = quantity * amount;

    // console.log(this.totamount);

    this.updateQuantity.get("totamount").setValue(this.totamount);
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  // getValueEdit() {

  //   // console.log(this.id);

  //   //  var fields = this.loginform.value;
  //   const formData = new FormData();

  //   formData.append("login_type",  this.api.GetUserType());

  //   formData.append("login_id", this.api.GetUserData("Id"));
  //   formData.append("id", this.id);

  //   this.api.IsLoading();
  //   this.api.HttpPostType("AssetsManagement/GetAmount", formData).then((result:any) => {
  //     this.api.HideLoading();
  //     // console.log(result);

  //     if (result['status'] == true) {
  //       this.dataArr = result['data'];

  //     } else {
  //       const msg = 'msg';
  //       this.api.Toast('Warning', result['msg']);

  //     }

  //   }, (err) => {
  //     // Error log
  //     // // console.log(err);
  //     this.api.HideLoading();
  //     const newLocal = 'Warning';
  //     this.api.Toast(newLocal, 'Network Error : ' + err.name + '(' + err.statusText + ')');
  //     //this.api.ErrorMsg('Network Error :- ' + err.message);
  //   });

  // }

  get formControls() {
    return this.updateQuantity.controls;
  }

  submit() {
    this.isSubmitted = true;
    if (this.updateQuantity.invalid) {
      return;
    } else {
      var fields = this.updateQuantity.value;
      const formData = new FormData();

      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("User_Type", this.api.GetUserType());

      formData.append("id", this.id);
      formData.append("quantity", fields["quantity"]);
      formData.append("amount", fields["amount"]);
      formData.append("remark", fields["remark"]);
      formData.append("totamount", fields["totamount"]);

      // console.log(fields);

      this.api.IsLoading();
      this.api.HttpPostType("AssetsManagement/Submit", formData).then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);

          if (result["status"] == 1) {
            this.api.Toast("Success", result["msg"]);
            this.CloseModel();
            // this.router.navigate(["/Assets/Products"]);
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

  getdata() {
    // // console.log(this.id);
    this.api.IsLoading();

    this.api.HttpGetType("AssetsManagement/ShowQuantity?id=" + this.id).then(
      (result) => {
        this.api.HideLoading();

        if (result["status"] == 1) {
          this.stock = result["stock"];
          this.dataArr = result["data"];
          // console.log(this.dataArr);
        } else {
          const msg = "msg";
          this.api.Toast("Warning", result["msg"]);
        }
      },
      (err) => {
        this.api.HideLoading();
        const newLocal = "Warning";
        this.api.Toast(
          newLocal,
          "Network Error : " + err.name + "(" + err.statusText + ")"
        );
      }
    );
  }

  ForApproval(Id: any, category: any) {
    const dialogRef = this.dialog.open(InventoryLogComponent, {
      width: "60%",
      height: "65%",
      // disableClose: true,
      data: { Id: Id, category: category },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(result);
      // this.SearchBtn();
    });
  }

  AddProducts(TotalQuantity: any, Id: any, InventoryId: any) {
    if (TotalQuantity != 0) {
      const dialogRef = this.dialog.open(ItemsrnoComponent, {
        width: "60%",
        height: "65%",
        data: {
          TotalQuantity: TotalQuantity,
          Id: Id,
          InventoryId: InventoryId,
        },
      });

      dialogRef.afterClosed().subscribe((result: any) => {
        // console.log(result);
      });
    } else {
      var r = confirm("Your Product Quantity is 0!");
      if (r == true) {
      }
    }
  }
}
