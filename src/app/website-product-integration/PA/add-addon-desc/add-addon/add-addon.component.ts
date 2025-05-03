


import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "../../../../providers/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from "../../../../../environments/environment";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";

// import { youtubeUrlValidator } from './youtube-url.validator';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { DataTableDirective } from "angular-datatables";
@Component({
  selector: 'app-add-addon',
  templateUrl: './add-addon.component.html',
  styleUrls: ['./add-addon.component.css']
})
export class AddAddonComponent implements OnInit {
  AddAddonForm:FormGroup;

  currentUrl: string;
  isSubmitted = false;

  dropdownSingleSettingsType: {
    singleSelection: boolean;
    idField: string;
    textField: string;
    itemsShowLimit: number;
    enableCheckAll: boolean;
    allowSearchFilter: boolean;
  };

  Plans: { Id: string; Name: string }[];
  Companys: { Id: string; Name: string; Code: string }[];
  lobs: { Id: string; Name: string }[];
  SubPlans:{ Id: string; Name: string }[];
  Addons:{Id:string;Name:string}[];
  MotorAddons:{Id:string;Name:string}[];
  TypeData:{Id:string;Name:string}[] =[
    {Id:"addon",Name:"Addon"},
    {Id:"discount",Name:"Discount"}
  ];

  DiscountData:{Id:string;Name:string}[];
  insurer_code:any;
  tempValue:any;
  
  tempTypeData: string = 'addon';
  subPlanId:any;
  constructor(private api: ApiService,
      private router: Router,
      private httpClient: HttpClient,
      private fb: FormBuilder,
      private route: ActivatedRoute,
      public dialogRef: MatDialogRef<AddAddonComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) {

      this.currentUrl = this.router.url;
      this.dropdownSingleSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };

    this.AddAddonForm = this.fb.group({
      Company: [""],
      
      LOB: [""],

      Plan: [""],
      Subplan:[""],
      Addons:[""],
      description:["",Validators.required],
      motorAddons:[""],
      typeData:[""]
      
      
    });

    this.AddAddonForm.get("LOB").valueChanges.subscribe((value) => {
      if (value && value.length > 0) {
        this.tempValue = value[0].Name;
       
        this.FetchMotorAddon();
      }
    });
    this.AddAddonForm.get("typeData").valueChanges.subscribe((value) => {
      if (value && value.length > 0) {
        this.tempTypeData = value[0].Id; 
      }
    });

  }

  ngOnInit() {
    this.FetchHealthCompany();
    
  }
  get formControls() {
    return this.AddAddonForm.controls;
  }

  FetchHealthCompany() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "WebsiteHealthSection/FetchHealthCompany?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType()
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == true) {
            //this.Companys = result["Companys"];
            this.lobs = result["lob"];
            // console.log("The company is :-", this.Companys)
          } else {
            this.api.Toast("Warning", result["msg"]);
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

  FetchCompany(e) {
   
    this.AddAddonForm.get("Company").setValue("");
    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());
    formData.append("LOB", e.Name);
    formData.append("Url", this.currentUrl);

    this.api.IsLoading();
    this.api
      .HttpPostType("WebsiteHealthSection/FetchInsurerLobwise", formData)
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == true) {
            this.Companys = result["lob"];
          } else {
            this.api.Toast("Warning", result["msg"]);
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

  FetchPlans(e) {
    this.AddAddonForm.get("Plan").setValue("");
    

    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());
    formData.append("Company", e.Id);
    // formData.append("Url", this.currentUrl);

    const selected = this.Companys.find((item) => item.Id === e.Id);
    // console.log('Selected Full Object:', selected["Code"]);
    this.insurer_code = selected["Code"];

    this.api.IsLoading();
    this.api.HttpPostType("WebsiteHealthSection/Fetchplans", formData).then(
      (result) => {
        this.api.HideLoading();
        if (result["status"] == true) {
          this.Plans = result["Plans"];
          // this.SubPlans = result["SubPlans"];
        } else {
          this.api.Toast("Warning", result["msg"]);
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


  FetchSubplans(e) {
    this.AddAddonForm.get("Subplan").setValue("");
    
    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());
    formData.append("Company", e.Id);

    this.api.IsLoading();
    this.api.HttpPostType("WebsiteHealthSection/FetchSubplans", formData).then(
      (result) => {
        this.api.HideLoading();
        if (result["status"] == true) {
          this.SubPlans = result["SubPlans"];
        } else {
          this.api.Toast("Warning", result["msg"]);
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
  getSuplanId(e){
    this.subPlanId = e.Id;
  }

  FetchAddon(e){
    this.AddAddonForm.get("Addons").setValue("");

    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());
    formData.append("subPlanId", this.subPlanId);
    if(this.tempTypeData =="addon"){
      formData.append("tableName" ,"ins_company_addon_master");
    }
    else{
      formData.append("tableName" ,"ins_company_discount_addon_masters");

    }

    


    this.api.IsLoading();
    this.api.HttpPostType("WebsiteHealthSection/FetchAddons", formData).then(
      (result) => {
        console.log(result);
        this.api.HideLoading();
        if (result["status"] == true) {
          
          this.Addons = result["addons"];
        } else {
          this.api.Toast("Warning", result["msg"]);
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
  FetchDiscount(e){
    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());
    formData.append("subPlanId", e.Id);


    


    this.api.IsLoading();
    this.api.HttpPostType("WebsiteHealthSection/FetchDiscount", formData).then(
      (result) => {
        console.log(result);
        this.api.HideLoading();
        if (result["status"] == true) {
          this.DiscountData = result["discountData"];
        } else {
          this.api.Toast("Warning", result["msg"]);
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

  FetchMotorAddon(){

    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());
    
    


    this.api.IsLoading();
    this.api.HttpPostType("WebsiteHealthSection/motorAddons",formData).then(
      (result) => {
        console.log(result);
        this.api.HideLoading();
       
        if (result["status"] == true) {
          

          this.MotorAddons = result["motorAddonData"].map((item, index) => ({
            Id: item.Id,
            Name: item.Name
        }));
        } else {
          this.api.Toast("Warning", result["msg"]);
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

  

  submit() {
    ////   //   console.log("HELLO world ");
    this.isSubmitted = true;
    var fields = this.AddAddonForm.value;

    

    if (this.AddAddonForm.invalid) {
      return;
    } else {
      var fields = this.AddAddonForm.value;
      const formData = new FormData();
      formData.append("company", this.insurer_code);
      formData.append("lob", fields["LOB"][0].Name);
      formData.append("plan", fields["Plan"].length>0?fields["Plan"][0].Name:"");
      formData.append("subPlan",fields["Subplan"].length>0?fields["Subplan"][0].Name:"");
      formData.append("addon",fields["Addons"].length>0?fields["Addons"][0].Id:"");
      
      formData.append("motorAddon",fields["motorAddons"].length>0?fields["motorAddons"][0].Id:"");

      formData.append("typeData",fields["typeData"].length>0?fields["typeData"][0].Id:"addon");
      formData.append("description",fields['description']);


      this.api.IsLoading();
      this.api.HttpPostType("WebsiteHealthSection/addAddon", formData).then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);

          if (result["status"] == true ) {
            this.api.Toast("Success", result["msg"]);
            this.CloseModel();
          } else {
            const msg = "msg";
            //alert(result['message']);
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
          //this.api.ErrorMsg('Network Error :- ' + err.message);
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
