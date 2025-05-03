import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';

import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { HttpClient } from '@angular/common/http';
import { ApiService } from "../../providers/api.service";
import { Router } from "@angular/router";
@Component({
  selector: 'app-edit-motor-quotes-label',
  templateUrl: './edit-motor-quotes-label.component.html',
  styleUrls: ['./edit-motor-quotes-label.component.css']
})
export class EditMotorQuotesLabelComponent implements OnInit {
  Updateform: FormGroup;
  lob = [
    { Id: 'motor', Name: 'Motor' },
    { Id: 'health', Name: 'Health' },
  ];

  product_type = [
    { Id: 'pc', Name: 'private car' },
    { Id: 'tw', Name: 'two wheeler' },
    { Id: 'pcv', Name: 'pcv' },
    { Id: 'gcv', Name: 'gcv' },
    { Id: 'miscd', Name: 'miscd' },
  ];

  label_type = [
    { Id: '0', Name: 'normal label' },
    { Id: '1', Name: 'highlighted label' },
  ];

  plan_type = [
    { Id: 'cp', Name: 'comprehensive' },
    { Id: 'tp', Name: 'third party' },
    { Id: 'od', Name: 'standalone OD' },
  ];

  insurer = [
    { Id: 'bajaj', Name: 'bajaj' },
    { Id: 'icici', Name: 'icici' },
    { Id: 'iffco', Name: 'iffco' },
    { Id: 'national', Name: 'national' },
    { Id: 'newindia', Name: 'newindia' },
    { Id: 'oriental', Name: 'oriental' },
    { Id: 'united', Name: 'united' },
    { Id: 'reliance', Name: 'reliance' },
    { Id: 'royalSundaram', Name: 'royalSundaram' },
    { Id: 'tata', Name: 'tata' },
    { Id: 'cholamandalam', Name: 'cholamandalam' },
    { Id: 'hdfc', Name: 'hdfc' },
    { Id: 'future', Name: 'future' },
    { Id: 'universal', Name: 'universal' },
    { Id: 'shriram', Name: 'shriram' },
    { Id: 'bharti', Name: 'bharti' },
    { Id: 'raheja', Name: 'raheja' },
    { Id: 'sbi', Name: 'sbi' },
    { Id: 'magma', Name: 'magma' },
  ];

  dropdownSettingsType = {
    singleSelection: true,
    idField: "Id",
    textField: "Name",
    itemsShowLimit: 1,
    enableCheckAll: false,
    allowSearchFilter: true,
  };
  dataAr: any[];
  Id: any;
  lob_type: any;
  insurer1: any;
  product_type1: any;
  label_type1: any;
  plan_type1: any;
  // Id: any;




  constructor(private router: Router, private api: ApiService, private fb: FormBuilder, private http: HttpClient, public dialogRef: MatDialogRef<EditMotorQuotesLabelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.Id = this.data.Id;
    // alert(this.Id);


    this.Updateform = this.fb.group({
      insurer: [null, Validators.required],
      lob: [null, Validators.required],
      product_type: [null, Validators.required],
      label_type: [null, Validators.required],
      icon_color: [''],
      plan_type: [null, Validators.required],
      label_name: [''],
      font_color: [''],
      icon_name: [''],
      is_deleted: [''],
      createdat: [new Date().toISOString()],
    });
  }


  ngOnInit() {
    this.EditMotorQuotesLabelComponent();
  }


  EditMotorQuotesLabelComponent() {
    const id = this.Id;
    console.log('ID:', id);

    this.api.HttpGetType("WebsiteSection/GetDataById?id=" + id).then(
      (result: { status: string, message: any }) => {
        this.api.HideLoading();
        if (result.status === 'success') {
          console.log(result);
          this.Updateform.patchValue(result['data']);

          this.lob_type = result['lob'];
          this.insurer1 = result['insurer'];
          this.product_type1 = result['product_type'];
          this.label_type1 = result['label_type'];
          this.plan_type1 = result['plan_type'];

        } else {
          this.api.Toast("Warning", result.message || "No data found!");
        }
      },
      (err) => {
        this.api.HideLoading();
        this.api.Toast("Warning", "Network Error: " + err.name + " (" + err.statusText + ")");
      }
    );
  }


  update() {
    if (this.Updateform.valid) {
      const fields = this.Updateform.value;
      let lob = (fields["lob"][0]["Id"]) ? fields["lob"][0]["Id"] : "";
      let insurer = (fields["insurer"][0]["Id"]) ? fields["insurer"][0]["Id"] : "";
      let product_type = (fields["product_type"][0]["Id"]) ? fields["product_type"][0]["Id"] : "";
      let plan_type = (fields["plan_type"][0]["Id"]) ? fields["plan_type"][0]["Id"] : "";
      let label_type = (fields["label_type"][0]["Id"]) ? fields["label_type"][0]["Id"] : "";

      const formData = new FormData();
      formData.append("id", this.Id);
      formData.append("insurer", insurer);
      formData.append("lob", lob);
      formData.append("product_type", product_type);
      formData.append("label_type", label_type);
      formData.append("plan_type", plan_type);
      formData.append("icon_color", fields["icon_color"]);
      formData.append("font_color", fields["font_color"]);
      formData.append("icon_name", fields["icon_name"]);
      formData.append("label_name", fields["label_name"]);

      this.api.HttpPostType("WebsiteSection/updateDataById", formData).then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] === "success") {
            this.api.Toast("Success", result["message"]);
          } else {
            this.api.Toast("Warning", result["message"]);
          }
        },
        (err) => {
          this.api.HideLoading();
          this.api.Toast("Warning", "Network Error: " + err.name + " (" + err.statusText + ")");
        }
      );
    }
    else {
      this.Updateform.markAllAsTouched();
    }
  }


  CloseModel(): void {
    this.dialogRef.close({
      Status: 'Model Close',
    });
  }

}