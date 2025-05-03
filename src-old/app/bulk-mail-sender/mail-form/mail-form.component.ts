import { Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ApiService } from "src/app/providers/api.service";
import { Router } from "@angular/router";
import { BulkMailComponent } from "../bulk-mail/bulk-mail.component";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ViewComponent } from "../view/view.component";

@Component({
  selector: "app-mail-form",
  templateUrl: "./mail-form.component.html",
  styleUrls: ["./mail-form.component.css"],
})
export class MailFormComponent implements OnInit {
  AddFieldForm: FormGroup;
  active: any[];
  sendbulkmailForm: any;
  NewMailSubmit: any;
  AddMailForm: FormGroup;
  isSubmitted = false;
  isSubmitted1 = false;
  mailForm: any;
  num: any;

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
  };

  currentUrl: string;
  Verticle: [];
  SelectLevel: [];
  MessageBody: string = "";
  fromMail: any[] = [];
  toMailAr: any[] = [];
  toMailAr1: any[] = [];
  attach: any;
  toChange: any;
  toMail: any = "";
  ckconfig = {
    height: 250,
    allowedContent: true,
  };
  attachments: File[] = [];
  MailCheck: any = 0;
  Vertical_Ar: any = [];
  Partner_Ar: any = [];

  constructor(
    public api: ApiService,
    private router: Router,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<BulkMailComponent>
  ) {
    this.dropdownSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: false,
    };

    this.dropdownSettingsMultiselect = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: true,
      allowSearchFilter: true,
    };

    this.AddFieldForm = this.formBuilder.group({
      company: ["", [Validators.required, Validators.pattern("[a-zA-Z. ]*")]],
      motor: ["0"],
      health: ["0"],
      nonM: ["0"],
      life: ["0"],
      pa: ["0"],
      travel: ["0"],
      status: ["", Validators.required],
    });

    this.active = [
      { Id: 1, Name: "Active" },
      { Id: 0, Name: "Inactive" },
    ];

    this.sendbulkmailForm = this.formBuilder.group({
      fromMail: ["", Validators.required],
      toMail: ["", Validators.required],
      verticalform: [""],
      partnerform: [""],
      more: [""],
      subject: ["", Validators.required],
      fromname: ["", Validators.required],
      attachement: [""],
      MessageBody: [""],
    });

    this.NewMailSubmit = this.formBuilder.group({
      fromMail: [
        "",
        [
          Validators.required,
          Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
        ],
      ],
    });

    this.toMailAr1 = [
      { Id: "1", Name: "SP" },
      { Id: "2", Name: "POS" },
      { Id: "3", Name: "SPC" },
      { Id: "4", Name: "Dealer" },
    ];
    this.toMailAr = [
      { Id: "1", Name: "Employee" },
      { Id: "2", Name: "Partner" },
    ];
  }

  ngOnInit() {
    this.currentUrl = this.router.url;
    this.ShowData();
    this.mailForm = 0;
    // this.attach = 0;
    // this.change();
    this.num = 0;
    this.toChange = 0;
  }

  ResetDT() {
    this.sendbulkmailForm.value.reset();
  }

  get formControls() {
    return this.sendbulkmailForm.controls;
  }

  submit() {
    this.api.IsLoading();
    this.isSubmitted = true;
    if (this.sendbulkmailForm.invalid) {
      return;
    } else {
      if (this.toChange == 1) {
        this.moreMail();
      }

      let attachmentValue = [];

      var fields = this.sendbulkmailForm.value;

      let data = {
        fromMail: fields.fromMail,
        toMail:
          this.toMail != "" ? [{ Id: 1, Name: this.toMail }] : fields.toMail,
        subject: fields.subject,
        fromname: fields.fromname,
        attachement: this.attachments,
        MessageBody: fields.MessageBody,
        verticalform: fields.verticalform,
        partnerform: fields.partnerform,
      };

      const formData = new FormData();

      for (var i = 0; i < this.attachments.length; i++) {
        let data = JSON.stringify(this.attachments[i]);
        formData.append("attachement" + "[" + i + "]", this.attachments[i]);
        data = "";
      }

      formData.append("login_id", this.api.GetUserId());
      formData.append("Type", "sp");
      formData.append("mail_message", JSON.stringify(this.MessageBody));
      formData.append("data", JSON.stringify(data));

      this.api.IsLoading();
      this.api
        .HttpPostTypeBms("../v3/bulk/BulkMails/submitMail", formData)
        .then(() => {
          this.api.HideLoading();
          this.sendbulkmailForm.reset();
          this.CloseModel();
        });
    }
  }

  onFileChange(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.attachments = [];
      const maxFiles = Math.min(files.length, 10);

      if (files.length > 9) {
        alert("Only the first 10 files are selected other Removed.");
      } else {
        for (let i = 0; i < maxFiles; i++) {
          files[i].filename = files[i].name;

          this.attachments.push(files[i]);
        }
      }
      //   //   //   console.log("Attachments:", this.attachments);
    }
  }

  addMail(num: any) {
    this.mailForm = num;
    this.NewMailSubmit.get("fromMail").reset();
  }

  moreMail() {
    var moreMail = this.sendbulkmailForm.get("more").value;
    var moreMailArray = moreMail.split(",");
    let updatedToMail: { Id: string; Name: string }[] = [];

    moreMailArray.forEach((mail: string, index: any) => {
      updatedToMail.push({ Id: (1 + index).toString(), Name: mail.trim() });
    });

    this.sendbulkmailForm.patchValue({ toMail: updatedToMail });
  }

  SubmitAttachment(num: any) {
    const attachement = this.sendbulkmailForm.get("attachement");
    if (num == 0) {
      attachement.clearValidators();
      attachement.updateValueAndValidity();
      attachement.reset();
    } else {
      attachement.setValidators([Validators.required]);
      attachement.updateValueAndValidity();
    }
    this.attach = num;
  }

  // change() {
  //   document.getElementById("No").click();
  // }

  submitMail() {
    this.isSubmitted1 = true;
    var fields = this.NewMailSubmit.value;

    if (this.NewMailSubmit.valid) {
      const formData = new FormData();
      formData.append("login_id", this.api.GetUserId());
      formData.append("Type", "sp");
      formData.append("data", JSON.stringify(fields));

      this.api.IsLoading();
      this.api
        .HttpPostTypeBms("../v3/bulk/BulkMails/addMail", formData)
        .then((result) => {
          this.api.HideLoading();
          // this.api.Toast(result['status'], result['msg']);
          this.isSubmitted1 = false;
          this.addMail(0);
          this.fromMail = [0];
          this.ShowData();
        });
    }
  }

  ShowData() {
    this.Verticle = [];
    this.SelectLevel = [];
    const formData = new FormData();
    formData.append("login_id", this.api.GetUserId());
    formData.append("Login_User_Id", "54");
    formData.append("Login_User_Type", "employee");

    this.api.IsLoading();
    this.api.HttpPostTypeBms("../v3/bulk/BulkMails/showEmail", formData).then(
      (result) => {
        this.api.HideLoading();
        this.fromMail = result["emails"].map((item) => ({
          Id: item.Id,
          Name: item.Name,
        }));
      },
      (err) => {
        this.api.HideLoading();
        this.api.Toast(
          "Warning",
          "Network Error : " + err.name + "(" + err.statusText + ")"
        );
      }
    );
  }

  toMailChange(num: any) {
    this.toChange = num;
    var toMail = this.sendbulkmailForm.get("toMail");
    var moreMail = this.sendbulkmailForm.get("more");

    toMail.reset();
    moreMail.reset();

    if (num == 0) {
      moreMail.clearValidators();
      moreMail.updateValueAndValidity();
      toMail.setValidators([Validators.required]);
      toMail.updateValueAndValidity();
    } else {
      toMail.clearValidators();
      toMail.updateValueAndValidity();
      moreMail.setValidators([
        Validators.required,
        Validators.pattern(
          /^\w+([-+.']\w+)*@[a-zA-Z]+\.[a-zA-Z]+(, ?\w+([-+.']\w+)*@[a-zA-Z]+\.[a-zA-Z]+)*$/
        ),
      ]);
      moreMail.updateValueAndValidity();
    }
  }

  formValidationCheck() {
    this.isSubmitted = true;

    if (this.sendbulkmailForm.invalid) {
      return;
    } else {
      this.dailog();
    }
  }

  dailog() {
    const dialogRef = this.dialog.open(ViewComponent, {
      width: "50%",
      height: "70%",
      disableClose: true,
      data: {
        data: this.sendbulkmailForm.value,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      ////   //   console.log(result);
      if (result.Status == 1) {
        if (result.toMail) {
          ////   //   console.log(result);
          this.toMail = result.toMail;
        }
        this.submit();
      }
    });
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  tomailCheck(data: any) {
    let toMail = "";
    if (
      Array.isArray(data) &&
      data.length > 0 &&
      data[0] != "" &&
      data[0].Name != ""
    ) {
      if (data[0].Name == "Employee") {
        this.MailCheck = 1;
        this.verticalData();
      } else {
        this.MailCheck = 2;
      }
    } else {
      this.MailCheck = 0;
    }
  }

  verticalData() {
    const formData = new FormData();
    this.api.IsLoading();
    this.api
      .HttpPostTypeBms(
        "../v3/bulk/BulkMails/SearchVerticalData?" +
          "User_Id=" +
          this.api.GetUserId(),
        formData
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.Vertical_Ar = result["Data"]["Vertical"];
          } else {
          }
        },
        (err) => {
          this.api.HideLoading();
        }
      );
  }

  partnerData(data: any) {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    this.api.IsLoading();
    this.api
      .HttpPostTypeBms("../v3/bulk/BulkMails/SearchPartnerData", formData)
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.Partner_Ar = result["Data"];
          } else {
          }
        },
        (err) => {
          this.api.HideLoading();
        }
      );
  }
}
