import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../providers/api.service";
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-details',
  templateUrl: './add-details.component.html',
  styleUrls: ['./add-details.component.css']
})

export class AddDetailsComponent implements OnInit {

  addEmployeeForm: FormGroup;
  isSubmitted = false;
  
  dropdownSettingsType: any = {};
  dropdownSettingsMultiselect: any = {};
  loginId: any;
  loginType: any;
  ZoneData: any = [];
  BranchData: any = [];
  selectedBranch: any;
  zone: any;
  ROData: any;
  Current_Tier: { Id: string; Name: string; }[];
  Id: any;
  ro: any;
  Selected_location: any;
  Current_Tier_Val: any;

  constructor(
    private dialogRef: MatDialogRef<AddDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public api: ApiService,
    private http: HttpClient,
    public route: ActivatedRoute,
    private router: Router,
    public FormBuilder: FormBuilder
  ) {
    if (this.data) {
      this.Id = this.data.Id;
    } else {
      this.Id = null;
    }

    this.loginType = this.api.GetUserType();
    this.loginId = this.api.GetUserData("Id");
    this.addEmployeeForm = this.FormBuilder.group({

      zone: ["", [Validators.required]],
      ro: ["", [Validators.required]],
      branch: [""],
      Servicelocation: ["", [Validators.required]],
      Current_Tier: ["", [Validators.required]],

    });

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
    };
    this.Current_Tier = [
      { Id: "Tier 1", Name: "Tier 1" },
      { Id: "Tier 2", Name: "Tier 2" },
      { Id: "Tier 3", Name: "Tier 3" },
    ];
  }


  ngOnInit() {
    this.getZoneData();
    if (this.Id) {
      this.Update();
    }

  }
  get formControls() {
    return this.addEmployeeForm.controls;
  }
  CloseModel() {
    this.dialogRef.close();
  }

  getRoData() {
    this.BranchData = [];
    var fields = this.addEmployeeForm.value;
    const formData = new FormData();
    if(this.zone[0]['Id'] != ''){
     
      formData.append("Zone", this.zone[0]['Id']);
  
    }else{
     
      formData.append("Zone", fields["zone"][0]["Id"]);
  
    }

    this.api
      .HttpPostType("b-crm/Employee/getRoData", formData)
      .then((result: any) => {
        this.api.HideLoading();
        this.ROData = result["ROData"];
        this.BranchData = result["BranchData"];
      });
  }

  //===== GET BRANCH DATA =====//
  getBranchData() {
    var fields = this.addEmployeeForm.value;
    const formData = new FormData();
    if(this.ro[0]['Id'] != '' && this.zone[0]['Id'] != ''){
      formData.append("Zone", this.zone[0]['Id']);
      formData.append("Ro", this.ro[0]['Id']);  
    }else{
      formData.append("Zone", fields["zone"][0]["Id"]);
      formData.append("Ro", fields["ro"][0]["Id"]);
  
    }

    this.api
      .HttpPostType("b-crm/Employee/getBranchData", formData)
      .then((result: any) => {
        this.api.HideLoading();
        this.BranchData = result["BranchData"];
      });
  }

  onItemDeSelect(type: any) {

    if (type === "Zone") {
      this.ro = [];
      this.selectedBranch = [];
      // this.ROData = [];
      // this.BranchData = [];
    }

    if (type === "ro") {
      this.BranchData = [];
    }

    if (type === "Branch") {
      this.getBranchData();
    }

  }
  getZoneData() {
    this.api.IsLoading();
    this.api.HttpGetType("Service_location/getZoneData").then(
      (result: any) => {
        this.api.HideLoading();
        this.ZoneData = result["ZoneData"];
      }

    );
  }


  Update() {
    // console.log(this.id);
    // console.log(this.type);

    //  var fields = this.loginform.value;
    const formData = new FormData();

    formData.append("login_type", this.api.GetUserType());

    formData.append("login_id", this.api.GetUserData("Id"));

    formData.append("Id", this.Id);

    this.api.IsLoading();
    this.api.HttpPostType("Service_location/ServiceLocationDetails", formData).then(
      (result) => {
        this.api.HideLoading();
        // console.log(result);

        if (result["status"] == true) {
          this.Current_Tier_Val = result['data']['Current_Tier'];
          this.selectedBranch = result['data']['branch'];
          this.zone = result['data']['zone'];
          this.ro = result['data']['ro'];
          this.Selected_location = result['data']['serviceLocation'];
          console.log(this.zone);
          if(this.zone[0]['Id'] != ''){
              this.getRoData();
          }
  
          if(this.ro[0]['Id'] != ''){
            this.getBranchData();
          }
  
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


  // Update() {



    











    
  //   const updateId = this.Id ? `?Id=${this.Id}` : '';
  //   this.http.post(environment.apiUrl + "/Service_location/ServiceLocationData?User_Id=" +
  //             this.api.GetUserData("Id") +
  //             "&User_Type=" +
  //             this.api.GetUserType() + "&Id=" + this.Id, {}).subscribe(
  //     (result: any) => {
  //       this.Current_Tier_Val = result['data']['Current_Tier'];
  //       this.selectedBranch = result['data']['branch'];
  //       this.zone = result['data']['zone'];
  //       this.ro = result['data']['ro'];
  //       this.Selected_location = result['data']['serviceLocation'];
  //       console.log(this.zone);
  //       if(this.zone[0]['Id'] != ''){
  //           this.getRoData();
  //       }

  //       if(this.ro[0]['Id'] != ''){
  //         this.getBranchData();
  //       }
        

  //     }
  //   );
  // }

  AddEmployee(Id?: string) {
    this.isSubmitted = true;
    var fields = this.addEmployeeForm.value;
    console.log(fields);
    const formData = new FormData();
    console.log(fields);

    formData.append("zone", fields["zone"][0]["Id"]);
    formData.append("ro", fields["ro"][0]["Id"]);
    if(fields["branch"] != '' && fields["branch"] != undefined){
      formData.append("branch", fields["branch"][0]["Id"]);
    }else{
      formData.append("branch", '');

    }
    
    formData.append("Servicelocation", fields["Servicelocation"]);
    formData.append("Current_Tier", fields["Current_Tier"][0]["Name"]);

    if (this.addEmployeeForm.invalid) {
      return;
    } else {
      if (!Id) {
        this.api.HttpPostType("Service_location/saveLocation", formData).then(
          (result: any) => {
            this.CloseModel();
          }
        );
      } else {
        this.api.HttpPostType("Service_location/saveLocation?Id=" + this.Id, formData).then(
          (result: any) => {
            this.CloseModel();
          }
        );
      }
    }

  }




}





