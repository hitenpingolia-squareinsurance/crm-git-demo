import { Component, OnInit } from '@angular/core';
import { MatDialog} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ApiService } from "../../providers/api.service";
import { Router } from "@angular/router";
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-add-motor-quotes-label',
  templateUrl: './add-motor-quotes-label.component.html',
  styleUrls: ['./add-motor-quotes-label.component.css']
})
export class AddMotorQuotesLabelComponent implements OnInit {
  Submitform: FormGroup;
  currentUrl: string;

  lob = [
    { Id: 'motor', Name: 'Motor' },
    { Id: 'health', Name: 'Health' },
  ];

  product_type = [
    { Id: 'pc', Name: 'Private car' },
    { Id: 'tw', Name: 'Two Wheeler' },
    { Id: 'pcv', Name: 'Passenger Carrying Vehicle' },
    { Id: 'gcv', Name: 'Goods Carrying Vehicle' },
    { Id: 'miscd', Name: 'Miscellaneous Vehicle' },
  ];

  label_type = [
    { Id: '0', Name: 'Normal label' },
    { Id: '1', Name: 'Highlighted label' },
  ];

  plan_type = [
    { Id: 'cp', Name: 'Comprehensive' },
    { Id: 'tp', Name: 'Third Party' },
    { Id: 'od', Name: 'Standalone OD' },
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

  constructor(public dialogRef: MatDialogRef<AddMotorQuotesLabelComponent>, private router: Router, private api: ApiService, private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit() {
    this.currentUrl = this.router.url;
    this.Submitform = this.fb.group({
      insurer: [null, Validators.required],
      lob: [null, Validators.required],
      product_type: [null, Validators.required],
      label_type: [null, Validators.required],
      icon_color: [''],
      plan_type: [null, Validators.required],
      label_name: ['', Validators.required],
      font_color: [''],
      icon_name: [''],
      is_deleted: [''],
      createdat: [new Date().toISOString()],
    });
  }

  submit() {
    if (this.Submitform.valid) {
      const fields = this.Submitform.value;
      let lob = (fields["lob"][0]["Id"]) ? fields["lob"][0]["Id"] : "";
      let insurer = (fields["insurer"][0]["Id"]) ? fields["insurer"][0]["Id"] : "";
      let product_type = (fields["product_type"][0]["Id"]) ? fields["product_type"][0]["Id"] : "";
      let plan_type = (fields["plan_type"][0]["Id"]) ? fields["plan_type"][0]["Id"] : "";
      let label_type = (fields["label_type"][0]["Id"]) ? fields["label_type"][0]["Id"] : "";

      const formData = new FormData();
      formData.append("insurer", insurer);
      formData.append("lob", lob);
      formData.append("product_type", product_type);
      formData.append("label_type", label_type);
      formData.append("plan_type", plan_type);
      formData.append("icon_color", fields["icon_color"]);
      formData.append("font_color", fields["font_color"]);
      formData.append("icon_name", fields["icon_name"]);
      formData.append("is_deleted", fields["is_deleted"]);
      formData.append("label_name", fields["label_name"]);
      formData.append("createdat", fields["createdat"]);

      this.api.HttpPostType("WebsiteSection/addmotorquotes", formData).then(
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
    } else {
      this.Submitform.markAllAsTouched();
    }
  }
  CloseModel(): void {
    this.dialogRef.close({
      Status: 'Model Close',
    });
  }

}


