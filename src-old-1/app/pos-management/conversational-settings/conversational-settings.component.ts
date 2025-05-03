import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "../../providers/api.service";
import { Router } from "@angular/router";
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";

@Component({
  selector: "app-conversational-settings",
  templateUrl: "./conversational-settings.component.html",
  styleUrls: ["./conversational-settings.component.css"],
})
export class ConversationalSettingsComponent implements OnInit {
  agreementDocument: any;
  SelectGeneralValue: any;
  SelectlifeValue: any;
  agentCode: any;
  mobile: any;
  email: any;
  UrlRedirectionForm: FormGroup;
  dataArr: any;
  url: string;
  category: any;
  valuesArray: { type: any, massagetype: any, valueToSend: any,agentCodes:any }[] = [];
  constructor(
    private api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ConversationalSettingsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.agentCode = this.data.agentCode;
    this.mobile = this.data.mobile;
    this.email = this.data.email;

    this.UrlRedirectionForm = this.formBuilder.group({
      agreementYear: [""],
    });
  }

  ngOnInit() {
    this.getValueEdit();
    
  }
  updateSelectGeneralValue(event: any) {
    this.SelectGeneralValue = event.target.checked ? 1 : 0;
  }
  updateSelectLifeValue(event: any) {
    this.SelectlifeValue = event.target.checked ? 1 : 0;
  }

  // getValueEdit() {
  //   const formData = new FormData();

  //   formData.append("agentCode", this.agentCode);

  //   this.api.IsLoading();
  //   this.api
  //     .HttpPostType("Url_Redirection/Conversational_GetData", formData)
  //     .then(
  //       (result: any) => {
  //         // alert(result);
  //         this.api.HideLoading();

  //         // if (result["status"] == true) {
  //           if (result.status == true) {
  //           this.dataArr = result["data"];
  //           // this.category = result['data']['rows']['type'];
  //           console.log(this.dataArr);
  //           console.log(result.data);
            

  //         } else {
  //           const msg = "msg";
  //           this.api.Toast("Warning", result["msg"]);
  //         }
  //       },
  //       (err) => {
  //         this.api.HideLoading();
  //         const newLocal = "Warning";
  //         this.api.Toast(
  //           newLocal,
  //           "Network Error : " + err.name + "(" + err.statusText + ")"
  //         );
  //       }
  //     );
  // }


  getValueEdit() {
    const formData = new FormData();
    formData.append("agentCode", this.agentCode);
  
    this.api.IsLoading();
    this.api
      .HttpPostType("Url_Redirection/Conversational_GetData", formData)
      .then(
        (result: any) => {
          this.api.HideLoading();
          
         
          if (result.status == true) {
            this.dataArr = result.data;
            // alert(this.dataArr.Policy_SMS);
          } else {
            // this.api.Toast("Warning", result.msg);
            this.dataArr = result.data;
            // alert(123);  
          }
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


  get formControls() {
    return this.UrlRedirectionForm.controls;
  }

  submit(type: any, massagetype: any, event: any) {

    const isChecked = event.target.checked;
    const valueToSend = isChecked ? 0 : 1;
    // const valueToSend = isChecked ? 1 : 0;
    const agentCodes=this.agentCode;
    this.valuesArray.push({ type, massagetype, valueToSend, agentCodes});
    console.log(this.valuesArray);

   
  }

  SaveData(){
 const formData = new FormData();
 formData.append("valuesArray", JSON.stringify(this.valuesArray));

    // formData.append("type", type);
    // formData.append("massagetype", massagetype);
    // formData.append("valueToSend", valueToSend.toString());
    // formData.append("agentCode", this.agentCode);

    this.url = "/Url_Redirection/Conversational";

    this.api.IsLoading();
    this.api.HttpPostType(this.url, formData).then(
      (result: any) => {
        this.api.HideLoading();
        //console.log(result);
        if (result["status"] == true) {
          this.api.Toast("Success", result["msg"]);
          this.CloseModel11();
          // this.CloseModel11();
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

  CloseModel11(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }
}
