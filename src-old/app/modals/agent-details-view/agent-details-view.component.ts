import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../providers/api.service";
import swal from "sweetalert";

@Component({
  selector: "app-agent-details-view",
  templateUrl: "./agent-details-view.component.html",
  styleUrls: ["./agent-details-view.component.css"],
})
export class AgentDetailsViewComponent implements OnInit {
  QCForm: FormGroup;
  isSubmitted = false;

  UpdateSPGeneralDetailForm: FormGroup;
  isSubmitted_2 = false;

  Id: any;
  Agent_Id: any;
  Base_Url: any;
  row: any = [];
  RM_Users: any = [];
  RM_Id: any = [];
  Documents = [];
  Logs = [];

  selectedFiles: File;
  PanCard: File;
  AadharCardFront: File;
  AadharCardBack: File;
  Qualification: File;
  Cheque: File;
  Photo: File;
  Signature: File;

  IsDisabled: any = true;

  User_Rights: any = [];

  EditSPNonSalesStatus: any = 0;
  IsFieldsUpdate: any = 0;
  FiledName: any = "";
  FiledValue: any = "";

  Salutation_Type: any;

  constructor(
    public dialogRef: MatDialogRef<AgentDetailsViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    public api: ApiService
  ) {
    this.QCForm = this.formBuilder.group({
      QC_Status: ["", [Validators.required]],
      QC_Remark: ["", [Validators.required]],
    });

    this.UpdateSPGeneralDetailForm = this.formBuilder.group({
      Name: ["", [Validators.pattern("[a-zA-Z ]*$")]],
      Email: [
        "",
        [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")],
      ],
      Mobile: ["", [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      Gender: [""],
    });
  }

  ngOnInit() {
    this.Id = this.data.Id;
    this.GetDocuments();
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  get FC() {
    return this.QCForm.controls;
  }
  get FC_2() {
    return this.UpdateSPGeneralDetailForm.controls;
  }

  QC_Status(e) {
    var Type = e.target.value;
    //   //   console.log(Type);

    const QC_Remark_Control = this.QCForm.get("QC_Remark");

    if (Type == "1") {
      QC_Remark_Control.setValidators(null);
    } else {
      QC_Remark_Control.setValidators([Validators.required]);
    }

    QC_Remark_Control.updateValueAndValidity();
  }

  SubmitQC() {
    this.isSubmitted = true;
    if (this.QCForm.invalid) {
      return;
    } else {
      var fields = this.QCForm.value;
      const formData = new FormData();

      formData.append("User_Id", this.api.GetUserId());

      formData.append("Agent_QC", this.User_Rights["Agent_QC"]);

      formData.append("Agent_Id", this.row.Id);
      formData.append("Agent_Type", this.row.Type);
      formData.append("POS_User_Id", this.row.POS_User_Id);
      formData.append("QC_Status", fields["QC_Status"]);
      formData.append("QC_Remark", fields["QC_Remark"]);

      this.api.IsLoading();
      this.api.HttpPostTypeBms("reports/AgentReport/SubmitQC", formData).then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            this.api.Toast("Success", result["Message"]);
            this.CloseModel();
          } else {
            this.api.Toast("Warning", result["Message"]);
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();
          ////   //   console.log(err.message);
          this.api.Toast("Wanring", err.message);
        }
      );
    }
  }

  GetDocuments() {
    //this.api.IsLoading();
    this.api
      .CallBms(
        "sr/RMAgentReport/ViewDetailsById?Id=" +
          this.Id +
          "&User_Id=" +
          this.api.GetUserId()
      )
      .then(
        (result) => {
          //this.api.HideLoading();

          if (result["Status"] == true) {
            //this.CloseModel();

            this.row = result["Data"];
            this.RM_Id = this.row.POS_RM_Id;
            this.RM_Users = result["RM_Users"];
            this.Base_Url = result["Base_Url"] + this.Id + "/";
            console.log()
            this.Documents = result["Documents"];
            this.Logs = result["Logs"];
            this.User_Rights = result["User_Rights"];

            //alert(this.row.Is_Edit);
            if (result["AdminLogin"] == 1) {
              this.IsDisabled = false;
            } else {
              if (
                this.row.Is_Edit == 0 &&
                (this.row.Type == "SP" || this.row.Type == "Dealer")
              ) {
                this.IsDisabled = false;
                //alert(this.IsDisabled);
              } else {
                this.IsDisabled = true;
              }
            }

            //this.api.ToastMessage(result['Message']);
          } else {
            this.api.Toast("Warning", result["Message"]);
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();
          ////   //   console.log(err.message);
          this.api.Toast("Warning", err.message);
        }
      );
  }

  ViewDocument(name) {
    let url;
    if (this.row.Type == "POS") {
      url = name;
    } else {
      url = name;
    }

    //alert(url);
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }

  ChangeRM() {
    const formData = new FormData();

    formData.append("User_Id", this.api.GetUserId());

    formData.append("Agent_Id", this.Id);
    formData.append("RM_Id", this.RM_Id);
    formData.append("Type", this.row.Type);

    this.api.IsLoading();
    this.api.HttpPostTypeBms("sr/RMAgentReport/UpdateRM", formData).then(
      (result) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          //this.CloseModel();
          this.api.Toast("Success", result["Message"]);
          this.GetDocuments();
        } else {
          this.api.Toast("Warning", result["Message"]);
        }
      },
      (err) => {
        // Error log
        this.api.HideLoading();
        ////   //   console.log(err.message);
        this.api.Toast("Warning", err.message);
      }
    );
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
        //   //   console.log('Extenstion is vaild !');
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);

        //   //   console.log(Total_Size+ ' kb');

        if (Total_Size >= 1024 * 3) {
          // allow only 3 mb
          this.api.Toast("Warning", "File size is greater than 3 mb");

          //if(Type == 'PanCard'){ this.StepFinalForm.get('Pan_Card').setValue(''); }
        } else {
          /*
					if(Type == 'PanCard'){this.PanCard = this.selectedFiles; }
					if(Type == 'AadharCardFront'){this.AadharCardFront = this.selectedFiles; }
					if(Type == 'AadharCardBack'){this.AadharCardBack = this.selectedFiles; }
					if(Type == 'Qualification'){this.Qualification = this.selectedFiles; }
					if(Type == 'Cheque'){this.Cheque = this.selectedFiles; }
					if(Type == 'Photo'){this.Photo = this.selectedFiles; }
					if(Type == 'Signature'){this.Signature = this.selectedFiles; }
					*/

          this.Upload(Type);
        }
      } else {
        //   //   console.log('Extenstion is not vaild !');

        this.api.Toast(
          "Warning",
          "Please choose vaild file ! Example :- PNG,JPEG,JPG,PDF"
        );

        //if(Type == 'PanCard'){ this.StepFinalForm.get('Pan_Card').setValue(''); }
      }
    }
  }

  async Upload(Type) {
    const Is_Confirm = await swal({
      title: "Are you sure?",
      text: "Are you sure that you want to upload document?",
      icon: "warning",
      buttons: ["Cancel", "Yes"],
    });

    if (Is_Confirm) {
      const formData = new FormData();

      formData.append("User_Id", this.api.GetUserId());
      formData.append("Agent_User_Id", this.Id);
      formData.append("Document_Type", Type);
      formData.append("Document", this.selectedFiles);

      /*
			if(Type == 'PanCard'){ formData.append('Document',this.selectedFiles); }
			if(Type == 'AadharCardFront'){ formData.append('Document',this.AadharCardFront); }
			if(Type == 'AadharCardBack'){  formData.append('Document',this.AadharCardBack); }
			if(Type == 'Qualification'){ formData.append('Document',this.Qualification); }
			if(Type == 'Cheque'){ formData.append('Document',this.Cheque); }
			if(Type == 'Photo'){ formData.append('Document',this.Photo); }
			if(Type == 'Signature'){ formData.append('Document',this.Signature); }
			*/

      this.api.IsLoading();
      this.api
        .HttpPostTypeBms("sr/RMAgentReport/Agent_Document_Update", formData)
        .then(
          (result) => {
            this.api.HideLoading();
            if (result["Status"] == true) {
              this.api.Toast("Success", result["Message"]);
              this.Documents = result["Documents"];
            } else {
              //alert(result['Message']);
              this.api.Toast("Wanring", result["Message"]);
            }
          },
          (err) => {
            this.api.HideLoading();
            ////   //   console.log(err.message);
            this.api.Toast("Wanring", err.message);
          }
        );
    }
  }

  EditSPNonSales(Type) {
    this.EditSPNonSalesStatus = Type;
    if (Type == 1) {
      this.UpdateSPGeneralDetailForm.get("Name").setValue(this.row.Name);
      this.UpdateSPGeneralDetailForm.get("Mobile").setValue(this.row.Mobile);
      this.UpdateSPGeneralDetailForm.get("Email").setValue(this.row.Email);
      this.UpdateSPGeneralDetailForm.get("Gender").setValue(this.row.Gender);
    }
  }

  OpenUpdateFields(field) {
    this.FiledName = field;
    this.FiledValue = "";
    this.IsFieldsUpdate = 1;
  }
  UpdateFields() {
    const formData = new FormData();

    formData.append("User_Id", this.api.GetUserId());
    formData.append("Agent_Id", this.row.POS_User_Id);

    formData.append("FiledName", this.FiledName);
    formData.append("FiledValue", this.FiledValue);

    this.api.IsLoading();
    this.api.HttpPostTypeBms("sr/RMAgentReport/UpdateFields", formData).then(
      (result: any) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          this.api.Toast("Success", result["Message"]);
          this.IsFieldsUpdate = 0;
          this.GetDocuments();
        } else {
          this.api.Toast("Warning", result["Message"]);
        }
      },
      (err) => {
        // Error log
        this.api.HideLoading();
        ////   //   console.log(err.message);
        this.api.Toast("Warning", err.message);
      }
    );
  }
  CancleUpdateFields() {
    this.FiledName = "";
    this.FiledValue = "";
    this.IsFieldsUpdate = 0;
  }

  UpdateSPGeneralDetails() {
    this.isSubmitted_2 = true;
    if (this.UpdateSPGeneralDetailForm.invalid) {
      return;
    } else {
      var fields = this.UpdateSPGeneralDetailForm.value;
      const formData = new FormData();

      formData.append("User_Id", this.api.GetUserId());

      formData.append("Agent_QC", this.User_Rights["Agent_QC"]);

      formData.append("Agent_Id", this.row.POS_User_Id);
      formData.append("Agent_Type", this.row.Type);

      formData.append("Name", fields["Name"]);
      formData.append("Mobile", fields["Mobile"]);
      formData.append("Email", fields["Email"]);
      formData.append("Gender", fields["Gender"]);

      this.api.IsLoading();
      this.api
        .HttpPostTypeBms("sr/RMAgentReport/UpdateSPGeneralDetails", formData)
        .then(
          (result) => {
            this.api.HideLoading();

            if (result["Status"] == true) {
              this.api.Toast("Warning", result["Message"]);
              this.EditSPNonSalesStatus = 0;
              //this.CloseModel();
              this.GetDocuments();
            } else {
              this.api.Toast("Warning", result["Message"]);
            }
          },
          (err) => {
            // Error log
            this.api.HideLoading();
            ////   //   console.log(err.message);
            this.api.Toast("Warning", err.message);
          }
        );
    }
  }
}
