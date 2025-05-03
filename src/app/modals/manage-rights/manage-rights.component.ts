import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import {
  FormControl,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
} from "@angular/forms";
import { ApiService } from "../../providers/api.service";
import { environment } from "../../../environments/environment";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

@Component({
  selector: "app-manage-rights",
  templateUrl: "./manage-rights.component.html",
  styleUrls: ["./manage-rights.component.css"],
})
export class ManageRightsComponent implements OnInit {
  AddForm: FormGroup;
  isSubmitted = false;
  AddMenuForm: FormGroup;
  isSubmitted_1 = false;

  Id: any;
  row: any = [];
  MasterMenus: any = [];

  IsNewMenuItem: any = 0;

  Additonal_Action_Json: any = [];
  dropdownSettings: any = {};

  url: string = "";
  urlSafe: SafeResourceUrl;

  constructor(
    public dialogRef: MatDialogRef<ManageRightsComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    public api: ApiService,
    public formBuilder: FormBuilder,
    public sanitizer: DomSanitizer
  ) {
    /*  
		this.AddForm = this.formBuilder.group({
		  Menu_Status: [""],
		  Menu_Id: [""],
		  SubMenus : this.formBuilder.array([]),
		});
		*/

    this.AddForm = this.formBuilder.group({
      employees: this.formBuilder.array([]),
    });

    this.AddMenuForm = this.formBuilder.group({
      Platform_Type: [""],
      Menu_Type: [""],
      Master_Menu_Id: [""],
      Menu_Action_Type: [""],
      Menu_Name: [""],
      RouterLink: [""],
      Is_Add: [""],
      Is_Edit: [""],
      Is_Export: [""],
      Additonal_Action: [""],
      Additonal_Action_Json: [""],
    });

    this.dropdownSettings = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      //selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true,
    };
  }

  ngOnInit() {
    this.StyleWork();
    this.Id = this.data.Id;
    // alert(this.data);

    (this.url = this.api.additionParmsEnc(
      environment.apiUrlBmsBase + "/em/Rights1?Emp_Id=" + this.Id
    )),
      this.api.getHeader(environment.apiUrlBmsBase);

    // alert(this.url);
    var newUrl = this.api.decryptText(this.url);

    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(newUrl);

    // console.log(this.urlSafe);
    // console.log(this.url);

    this.GetRights();
    this.GetMasterMenus();
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  employees(): FormArray {
    return this.AddForm.get("employees") as FormArray;
  }

  newEmployee(): FormGroup {
    return this.formBuilder.group({
      Menu_Status: "",
      Menu_Id: "",
      Menu_Name: "",
      Submenus: this.formBuilder.array([]),
    });
  }

  addEmployee() {
    this.employees().push(this.newEmployee());
  }

  removeEmployee(empIndex: number) {
    this.employees().removeAt(empIndex);
  }

  employeeSkills(empIndex: number): FormArray {
    return this.employees().at(empIndex).get("Submenus") as FormArray;
  }

  newSkill(): FormGroup {
    return this.formBuilder.group({
      Sub_Menu_Status: "",
      Sub_Menu_Id: "",
      Sub_Name: "",
      Sub_Action_Type: "",
      Sub_Report_View: "",
      Sub_Add: "",
      Sub_Edit: "",
      Sub_Report_Export: "",
      Additonal_Action: "",
      Sub_Additonal_Action_Ar: "",
      Sub_Additonal_Action_Ar_Selected: "",
    });
  }

  addEmployeeSkill(empIndex: number) {
    this.employeeSkills(empIndex).push(this.newSkill());
  }

  removeEmployeeSkill(empIndex: number, skillIndex: number) {
    this.employeeSkills(empIndex).removeAt(skillIndex);
  }

  AddMenuItem() {
    this.IsNewMenuItem = 1;
  }
  CancelMenuItem() {
    this.IsNewMenuItem = 0;
  }

  AddMenuItems() {
    const formData = new FormData();
    var fields = this.AddMenuForm.value;

    formData.append("User_Id", this.api.GetUserId());
    formData.append("Menu_Type", fields["Menu_Type"]);
    formData.append("Platform_Type", fields["Platform_Type"]);
    formData.append("Master_Menu_Id", fields["Master_Menu_Id"]);
    formData.append("Menu_Action_Type", fields["Menu_Action_Type"]);
    formData.append("Menu_Name", fields["Menu_Name"]);
    formData.append("RouterLink", fields["RouterLink"]);
    formData.append("Is_Add", fields["Is_Add"]);
    formData.append("Is_Edit", fields["Is_Edit"]);
    formData.append("Is_Export", fields["Is_Export"]);
    formData.append("Additonal_Action", fields["Additonal_Action"]);
    formData.append("Additonal_Action_Json", fields["Additonal_Action_Json"]);

    this.api.IsLoading();
    this.api.HttpPostTypeBms("em/Rights1/AddMenuItems", formData).then(
      (result) => {
        this.api.HideLoading();
        if (result["Status"] == true) {
          //this.CloseModel();
          this.IsNewMenuItem = 0;
          this.AddMenuForm.reset();
          this.GetMasterMenus();
          //this.GetRights();
          //this.CloseModel();

          this.api.Toast("Success", result["Message"]);
        } else {
          this.api.Toast("Error", result["Message"]);
        }
      },
      (err) => {
        // Error log
        this.api.HideLoading();
        //// console.log(err.message);
        this.api.Toast("Warning", err.message);
      }
    );
  }

  GetMasterMenus() {
    //this.api.IsLoading();
    this.api
      .CallBms("em/Rights1/GetMasterMenus?User_Id=" + this.api.GetUserId())
      .then(
        (result) => {
          //this.api.HideLoading();

          if (result["Status"] == true) {
            //this.CloseModel();

            this.MasterMenus = result["Data"];
          } else {
            this.api.Toast("Error", result["Message"]);
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();
          //// console.log(err.message);
          this.api.Toast("Warning", err.message);
        }
      );
  }

  GetRights() {
    //this.api.IsLoading();
    this.api
      .CallBms(
        "em/Rights1/GetRights?Emp_Id=" +
          this.Id +
          "&User_Id=" +
          this.api.GetUserId()
      )
      .then(
        (result) => {
          //this.api.HideLoading();

          if (result["Status"] == true) {
            //this.CloseModel();

            this.row = result["Data"]["employees"];

            for (var i = 0; i < result["TotalMenus"]; i++) {
              this.addEmployee();
              for (
                var j = 0;
                j < result["Data"]["employees"][i]["Submenus"].length;
                j++
              ) {
                this.addEmployeeSkill(i);
              }
            }

            this.AddForm.patchValue(result["Data"]);

            // this.api.Toast('Success',result['Message']);
          } else {
            this.api.Toast("Error", result["Message"]);
          }
        },
        (err) => {
          // Error log
          this.api.HideLoading();
          //// console.log(err.message);
          this.api.Toast("Warning", err.message);
        }
      );
  }

  SubmitForm() {
    const formData = new FormData();

    formData.append("User_Id", this.api.GetUserId());
    formData.append("Emp_Id", this.Id);

    this.api.IsLoading();
    this.api.HttpPostTypeBms("em/Rights1/AssignRights", formData).then(
      (result) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          this.CloseModel();

          this.api.Toast("Success", result["Message"]);
        } else {
          this.api.Toast("Error", result["Message"]);
        }
      },
      (err) => {
        // Error log
        this.api.HideLoading();
        //// console.log(err.message);
        this.api.Toast("Warning", err.message);
      }
    );
  }

  UpdateRights() {
    const formData = new FormData();

    var fields = this.AddForm.value;

    formData.append("User_Id", this.api.GetUserId()); //login user id
    formData.append("Emp_Id", this.Id); // assign user id
    formData.append("MenusJson", JSON.stringify(fields["employees"]));

    this.api.IsLoading();
    this.api.HttpPostTypeBms("em/Rights1/UpdateRights", formData).then(
      (result) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          this.CloseModel();

          this.api.Toast("Success", result["Message"]);
        } else {
          this.api.Toast("Error", result["Message"]);
        }
      },
      (err) => {
        // Error log
        this.api.HideLoading();
        //// console.log(err.message);

        this.api.Toast("Warning", err.message);
      }
    );
  }

  StyleWork() {
    $(".mat-dialog-container").css("overflow", "hidden");
  }
}
