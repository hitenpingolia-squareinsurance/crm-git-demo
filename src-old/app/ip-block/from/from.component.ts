import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { ApiService } from "../../providers/api.service";
import {
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from "@angular/router";
@Component({
  selector: "app-from",
  templateUrl: "./from.component.html",
  styleUrls: ["./from.component.css"],
})
export class FromComponent implements OnInit {
  Block: FormGroup;
  IpBlock: FormGroup;
  isSubmitted = false;
  url: string;
  // frequencyOptions: number[] = [];
  dataAr: any = [];
  GetDatalob: any;
  urlRouter: any;
  SrNo: number = 0;
  products: any[] = [];
  lobData: any;
  lobDatas: string;

  dropdownSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };

  dropdownSettingsMultiselect: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
    closeDropDownOnSelection: boolean;
    showSelectedItemsAtTop: boolean;
    defaultOpen: boolean;
    limitSelection: number;
  };
  Timelimit: { Id: string; Name: string }[];
  frequencyOptions: { Id: string; Name: string }[] = [];

  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.dropdownSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.dropdownSettingsMultiselect = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
      limitSelection: 5,
    };

    this.Timelimit = [
      { Id: "0", Name: "0" },
      { Id: "2", Name: "2" },
      { Id: "4", Name: "4" },
      { Id: "6", Name: "6" },
      { Id: "12", Name: "12" },
      { Id: "24", Name: "24" },
      { Id: "48", Name: "48" },
      { Id: "76", Name: "76" },
      { Id: "304", Name: "304" },
    ];
  }
  ngOnInit() {
    this.Block = this.fb.group({
      lob: ["", Validators.required],
      Product: ["", Validators.required],
      Frequancy: ["", Validators.required],
      Timelimit: ["", Validators.required],
    });
    this.IpBlock = this.fb.group({
      IP: ["", Validators.required],
      Status: [""],
    });

    // for (let i = 1; i <= 40; i++) {
    //   this.frequencyOptions.push(i);
    // }
    for (let i = 1; i <= 40; i++) {
      this.frequencyOptions.push({ Id: i.toString(), Name: i.toString() });
    }
    this.urlRouter = this.router.url;
    if (this.urlRouter == "/ipblock/form") {
      this.Get();
    }
    this.GetProduct("0");
  }

  get formControls() {
    return this.Block.controls;
  }

  submit() {
    this.isSubmitted = true;
    if (this.Block.invalid) {
      return;
    } else {
      var fields = this.Block.value;
      const formData = new FormData();

      formData.append("lob", fields["lob"][0]["Id"]);
      formData.append("Product", fields["Product"][0]["Id"]);
      formData.append("Frequancy", fields["Frequancy"][0]["Id"]);
      formData.append("Timelimit", fields["Timelimit"][0]["Id"]);
      this.api.IsLoading();

      this.url = "Ipblock/insertData";

      this.api.HttpPostType(this.url, formData).then(
        (result: any) => {
          this.api.HideLoading();
          if (result["status"] == true) {
            const closebutton = document.getElementById("closemodal");
            closebutton.click();
            this.Block.reset();
            this.Get();
            this.api.Toast("Success", result["msg"]);
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
  }

  submitIpBlock() {
    if (this.IpBlock.invalid) {
      return;
    } else {
      var field = this.IpBlock.value;
      const formData = new FormData();
      formData.append("IP", field["IP"]);
      formData.append("Status", field["Status"]);
      // console.log(field);
      this.api.IsLoading();
      this.url = "Ipblock/DataIpBlock";
      this.api.HttpPostType(this.url, formData).then(
        (result: any) => {
          this.api.HideLoading();
          //   //   //   console.log(result);
          if (result["Status"] == true) {
            this.GetDatalob = result["data"];
            this.Getlob();
            this.api.Toast("Success", result["msg"]);
          } else {
            // this.Getlob();
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
  }

  Get() {
    const formData = new FormData();
    this.api.IsLoading();
    this.url = "Ipblock/GetData";
    this.api.HttpPostType(this.url, formData).then(
      (result: any) => {
        this.api.HideLoading();
        if (result["status"] == true) {
          this.dataAr = result["data"];
          // this.api.Toast("Success", result["msg"]);
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

  Getlob() {
    var field = this.IpBlock.value;
    const formData = new FormData();
    this.api.IsLoading();
    formData.append("IP", field["IP"]);
    this.url = "Ipblock/getDatalob";
    this.api.HttpPostType(this.url, formData).then(
      (result: any) => {
        this.api.HideLoading();
        if (result["status"] == true) {
          this.GetDatalob = result["data"];
          // this.api.Toast("Success", result["msg"]);
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

  ActiveInactive(IPurl: any, Status: any) {
    var confirms = confirm("Are You Sure..!");
    if (confirms == true) {
      const formData = new FormData();
      formData.append("IP", IPurl);
      formData.append("Status", Status);
      formData.append("Type", "update");
      // console.log(field);
      this.api.IsLoading();
      this.url = "Ipblock/DataIpBlock";
      this.api.HttpPostType(this.url, formData).then(
        (result: any) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.Getlob();
            this.api.Toast("Success", result["msg"]);
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
  }

  GetProduct(typeData: any) {
    const formData = new FormData();
    this.lobDatas = "";

    var fields = this.Block.value;
    if (typeData == "1") {
      //   //   //   console.log(fields["lob"][0]["Name"])
      this.lobDatas = fields["lob"][0]["Id"];
      formData.append("lob", fields["lob"][0]["Name"]);
    } else {
      formData.append("lob", "");
    }
    this.api.IsLoading();

    this.url = "Ipblock/GetProduct";
    this.api.HttpPostType(this.url, formData).then(
      (result: any) => {
        this.api.HideLoading();
        if (result["status"] == true) {
          if (this.lobDatas == "") {
            this.lobData = result["data"];
          } else {
            this.products = result["data"];
          }
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

  deleteItem(row: any) {
    //   //   //   console.log(row)
    var confirms = confirm("Are You Sure..!");

    if (confirms == true) {
      const formData = new FormData();
      formData.append("LoginUserId", row["LoginUserId"]);
      formData.append("lob", row["lob"]);
      formData.append("Frequancy", row["Frequancy"]);
      formData.append("Product", row["Product"]);
      formData.append("Timelimit", row["Timelimit"]);
      // console.log(field);
      this.api.IsLoading();
      this.url = "Ipblock/deleteIpForm";
      this.api.HttpPostType(this.url, formData).then(
        (result: any) => {
          this.api.HideLoading();
          if (result["status"] == true) {
            this.Get();
            this.api.Toast("Success", result["message"]);
          } else {
            this.api.Toast("Warning", result["message"]);
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
  }
}
