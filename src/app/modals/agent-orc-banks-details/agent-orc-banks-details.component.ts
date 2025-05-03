import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../providers/api.service";
import swal from "sweetalert";

@Component({
  selector: "app-agent-orc-banks-details",
  templateUrl: "./agent-orc-banks-details.component.html",
  styleUrls: ["./agent-orc-banks-details.component.css"],
})
export class AgentOrcBanksDetailsComponent implements OnInit {
  BankForm: FormGroup;
  isSubmitted = false;

  selectedFiles: File;
  Cheque_File: File;

  Is_Screen_Status: string = "BanksList";

  BanksAr: Array<any>;
  BanksAccountsAr: Array<any>;
  dropdownSettings: any = {};

  POS_Id: any = 0;
  ORC_Id: any = 0;
  Is_Add_ORC: any = 0;

  constructor(
    public dialogRef: MatDialogRef<AgentOrcBanksDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public api: ApiService,
    private formBuilder: FormBuilder
  ) {
    this.dropdownSettings = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };

    this.BankForm = this.formBuilder.group({
      Bank_Name: ["", [Validators.required]],
      Account_Holder_Name: [
        "",
        [Validators.required, Validators.pattern("[a-zA-Z ]*$")],
      ],
      Account_No: [
        "",
        [Validators.required, Validators.pattern("^[0-9]*.?[0-9]*$")],
      ],
      IFSC_Code: ["", [Validators.required]],
      Cheque: ["", [Validators.required]],
    });

    this.POS_Id = this.data.POS_Id;
    this.ORC_Id = this.data.Id;
  }

  ngOnInit() {
    this.ViewBankAccounts();
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  AddNewBankAccount() {
    this.AddNewBank();

    this.api.IsLoading();
    this.api.CallBms("admin/Geographical/Banks").then(
      (result) => {
        this.api.HideLoading();
        if (result["Status"] == true) {
          this.BanksAr = result["Data"];
          this.Is_Screen_Status = "AddNewBank";
        } else {
          //alert(result['Message']);
        }
      },
      (err) => {
        this.api.HideLoading();
        ////   //   console.log(err.message);
        alert(err.message);
      }
    );
  }
  ViewBankAccounts() {
    this.api.IsLoading();
    this.api
      .CallBms(
        "sr/ORC/View_ORC_Bank?User_Id=" +
          this.api.GetUserId() +
          "&ORC_Id=" +
          this.ORC_Id
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.BanksAccountsAr = result["Data"];
            this.Is_Add_ORC = result["Is_Add_ORC"];
          } else {
            //alert(result['Message']);
          }
        },
        (err) => {
          this.api.HideLoading();
          ////   //   console.log(err.message);
          alert(err.message);
        }
      );
  }

  BackToList() {
    this.BankForm.reset();
    this.Is_Screen_Status = "BanksList";
  }

  get FC() {
    return this.BankForm.controls;
  }

  UploadDocs(event, Type) {
    this.selectedFiles = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      //   //   console.log(this.selectedFiles);
      //   //   console.log(this.selectedFiles.name);
      var str = this.selectedFiles.name;
      var ar = str.split(".");
      //   //   console.log(ar);
      var ext;
      for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();
      //   //   console.log(ext);

      if (ext == "png" || ext == "jpeg" || ext == "jpg" || ext == "pdf") {
        //   //   console.log("Extenstion is vaild !");
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);

        //   //   console.log(Total_Size + " kb");

        if (Total_Size >= 1024 * 2) {
          // allow only 2 mb
          this.api.Toast("Warning", "File size is greater than 2 mb");

          if (Type == "Cheque") {
            this.BankForm.get("Cheque").setValue("");
          }
        } else {
          if (Type == "Cheque") {
            this.Cheque_File = this.selectedFiles;
          }
        }
      } else {
        //   //   console.log("Extenstion is not vaild !");

        this.api.Toast(
          "Warning",
          "Please choose vaild file ! Example :- PNG,JPEG,JPG,PDF"
        );

        if (Type == "Cheque") {
          this.BankForm.get("Cheque").setValue("");
        }
      }
    }
  }

  AddNewBank() {
    //   //   //   console.log(this.BankForm.value);

    this.isSubmitted = true;
    if (this.BankForm.invalid) {
      return;
    } else {
      var fields = this.BankForm.value;
      const formData = new FormData();

      formData.append("User_Id", this.api.GetUserId());
      formData.append("POS_Id", this.POS_Id);
      formData.append("ORC_Id", this.ORC_Id);

      formData.append("Bank_Name", JSON.stringify(fields["Bank_Name"]));
      formData.append("Account_Holder_Name", fields["Account_Holder_Name"]);
      formData.append("Account_No", fields["Account_No"]);
      formData.append("IFSC_Code", fields["IFSC_Code"]);
      formData.append("Cheque_File", this.Cheque_File);

      this.api.IsLoading();
      this.api.HttpPostType("sr/ORC/Add_New_Bank", formData).then(
        (result) => {
          this.api.HideLoading();

          this.BankForm.reset();
          if (result["Status"] == true) {
            this.api.Toast("Success", result["Message"]);
            this.Is_Screen_Status = "BanksList";
            this.ViewBankAccounts();
          } else {
            this.api.Toast("Warning", result["Message"]);
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();
          ////   //   console.log(err.message);
          this.api.Toast(
            "Warning",
            "Network Error, Please try again ! " + err.message
          );
        }
      );
    }
  }

  ViewDocument(orc_id, name) {
    let url = name;
    //alert(url);
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }

  SendForQC(Id) {
    if (confirm("Are you sure to send to QC!") == true) {
      const formData = new FormData();

      formData.append("User_Id", this.api.GetUserId());
      formData.append("POS_Id", this.POS_Id);
      formData.append("ORC_Id", this.ORC_Id);
      formData.append("Id", Id);

      this.api.IsLoading();
      this.api.HttpPostType("sr/ORC/ORC_Send_To_QC", formData).then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.api.Toast("Success", result["Message"]);

            this.ViewBankAccounts();
          } else {
            //alert(result['Message']);
            this.api.Toast("Warning", result["Message"]);
          }
        },
        (err) => {
          this.api.HideLoading();
          ////   //   console.log(err.message);
          this.api.Toast("Warning", err.message);
        }
      );
    }
  }
}
