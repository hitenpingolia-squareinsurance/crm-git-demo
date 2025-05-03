import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ApiService } from "../../../providers/api.service";

@Component({
  selector: "app-employee-rights",
  templateUrl: "./employee-rights.component.html",
  styleUrls: ["./employee-rights.component.css"],
})
export class EmployeeRightsComponent implements OnInit {
  ChatForm: FormGroup;
  isSubmitted = false;

  Emp_Id: any = 0;
  Menus: any = [];
  Ins_Ar: any = [];

  inputMessage: string = "";

  dropdownSettings: any = {};

  title = "Nested FormArray Example Add Form Fields Dynamically";
  empForm: FormGroup;
  selectedItems: any = [];

  Manage_Sub_Requests_Ar: any = [];

  constructor(
    public api: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.ChatForm = this.fb.group({
      Message: [""],
    });

    this.empForm = this.fb.group({
      MainMenu: this.fb.array([]),
    });

    this.dropdownSettings = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
  }

  ngOnInit() {
    this.Emp_Id = this.activatedRoute.snapshot.paramMap.get("Emp_Id");
    // console.log(this.Emp_Id);
    this.GetRow();
  }

  get FC() {
    return this.ChatForm.controls;
  }

  GetRow() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "Permission/RightsData?Emp_Id=" +
          this.Emp_Id +
          "&User_Type=" +
          this.api.GetUserType()
      )
      .then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == 1) {
            //this.api.Toast('Success',result['msg']);
            this.Menus = result["data"];
            this.Manage_Sub_Requests_Ar = result["Manage_Sub_Requests_Ar"];
            this.Ins_Ar = result["CompanyList"];

            for (var i = 0; i < this.Menus.length; i++) {
              this.addEmployee();
              this.addEmployeeSkill(i);
            }
            /*
			for(var k=0; k<this.Menus.length; k++){
				const MenusGroupFields = (<FormArray>this.empForm.get("MainMenu")).at(k);
				MenusGroupFields.patchValue({
				  MainMenu_Id: this.Menus[k]['Id'], 	
				  MainMenu_Status: this.Menus[k]['User_Rights']['Status'],
				});
				//// console.log(MenusGroupFields);
			}
			*/

            /*		
			var data = {
				  MainMenu: [
					{
					  MainMenu_Id: '2',MainMenu_Status:'1', SubMenus: [
						{ Create: '1',View: '1',ViewType: 'All',ExcelExport: '1', InsuranceCompanies :[{ Id: 1, Name: 'acko' }] },
					  ]
					}
				  ]
				}
			 // console.log(data);
			*/
            //// console.log(result['User_Rights']);
            //this.selectedItems = [{ Id: '1', Name: 'acko' },{ Id: '2', Name: 'digit' }];
            this.empForm.patchValue(result["User_Rights"]);

            //// console.log((<FormArray>this.empForm.get("MainMenu")).at(0));
          } else {
            //alert(result['message']);
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          // Error log
          //// console.log(err);
          this.api.HideLoading();
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
          //this.api.ErrorMsg('Network Error :- ' + err.message);
        }
      );
  }

  GetValues(index, subindex) {
    return this.Menus[index]["Name"];
  }

  MainMenu(): FormArray {
    return this.empForm.get("MainMenu") as FormArray;
  }

  newEmployee(): FormGroup {
    return this.fb.group({
      MainMenu_Id: "",
      MainMenu_Status: "",
      SubMenus: this.fb.array([]),
    });
  }

  addEmployee() {
    // console.log("Adding a employee");
    this.MainMenu().push(this.newEmployee());
  }

  removeEmployee(empIndex: number) {
    this.MainMenu().removeAt(empIndex);
  }

  employeeSkills(empIndex: number): FormArray {
    return this.MainMenu().at(empIndex).get("SubMenus") as FormArray;
  }

  newSkill(): FormGroup {
    return this.fb.group({
      Create: "",
      View: "",
      ViewType: "",
      ExcelExport: "",
      Manage_Requests: "",
      InsuranceCompanies: "",
      Manage_Sub_Requests: "",
    });
  }

  addEmployeeSkill(empIndex: number) {
    this.employeeSkills(empIndex).push(this.newSkill());
  }

  removeEmployeeSkill(empIndex: number, skillIndex: number) {
    this.employeeSkills(empIndex).removeAt(skillIndex);
  }

  onSubmit() {
    // console.log(this.empForm.value);

    var fields = this.empForm.value;
    const formData = new FormData();

    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());
    formData.append("Emp_Id", this.Emp_Id);
    formData.append("MenusJson", JSON.stringify(fields["MainMenu"]));

    this.api.IsLoading();
    this.api.HttpPostType("Permission/UpdateRights", formData).then(
      (result) => {
        this.api.HideLoading();
        if (result["status"] == 1) {
          this.api.Toast("Success", result["msg"]);

          this.router.navigate(["report-management/employee-report"]);
        } else {
          //alert(result['message']);
          this.api.Toast("Warning", result["msg"]);
        }
      },
      (err) => {
        // Error log
        //// console.log(err);
        this.api.HideLoading();
        this.api.Toast(
          "Warning",
          "Network Error : " + err.name + "(" + err.statusText + ")"
        );
        //this.api.ErrorMsg('Network Error :- ' + err.message);
      }
    );
  }
}
