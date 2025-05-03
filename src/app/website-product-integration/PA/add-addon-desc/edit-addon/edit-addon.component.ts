

import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { MatDialogRef } from "@angular/material/dialog";

import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { ApiService } from "../../../../providers/api.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-edit-addon',
  templateUrl: './edit-addon.component.html',
  styleUrls: ['./edit-addon.component.css']
})
export class EditAddonComponent implements OnInit {

  AddDescriptionFrom: FormGroup;
  dataAr: any[];
  Id: any;


  isSubmitted = false;
  currentUrl:any;
  TableName:any;


  dropdownSettingsType = {
    singleSelection: true,
    idField: "Id",
    textField: "Name",
    itemsShowLimit: 1,
    enableCheckAll: false,
    allowSearchFilter: true,
  };

  dropdownSingleSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };

  dropdownSettingsmultiselect: {};

  constructor(private router: Router,
    private api: ApiService,
    private fb: FormBuilder,
    private http: HttpClient,
    public dialogRef: MatDialogRef<EditAddonComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

      this.currentUrl = this.router.url;
    this.Id = this.data.Id;
    this.TableName = this.data.TableName;
      
      
      this.AddDescriptionFrom = this.fb.group({
        description: ["", Validators.required],
       
        
      });


    }

  ngOnInit() {
    this.getValueEdit();
    
  }
  
  getValueEdit() {
    const formData = new FormData();
    formData.append("id", this.Id);
    formData.append("tableName", this.TableName);
    this.api.HttpPostType("WebsiteHealthSection/getEditDataAddon", formData).then(
      (result: any) => {
        this.api.HideLoading();
        if (result["status"] == "success") {
          
          this.AddDescriptionFrom.patchValue(result["data"]);
          
        } else {
          this.api.Toast("Warning", result.message || "No data found!");
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

  submit() {
    this.isSubmitted = true;
    if (this.AddDescriptionFrom.invalid) {
      return;
    } else {
      var fields = this.AddDescriptionFrom.value;

     

      const formData = new FormData();
      formData.append("id", this.Id);
      formData.append("description", fields["description"]);
      formData.append("tableName", this.TableName);

      this.api.IsLoading();
      this.api
        .HttpPostType("WebsiteHealthSection/updateAddon", formData)
        .then(
          (result) => {
            this.api.HideLoading();

            if (result["status"] == true) {
              this.api.Toast("Success", result["msg"]);
              this.CloseModel();
            } else {
               
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


  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

}
