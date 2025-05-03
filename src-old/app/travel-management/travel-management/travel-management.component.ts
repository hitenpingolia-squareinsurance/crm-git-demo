import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../providers/api.service';
import { event } from 'jquery';
import { Router, ActivatedRoute } from '@angular/router';
import { empty } from 'rxjs';

@Component({
  selector: 'app-travel-management',
  templateUrl: './travel-management.component.html',
  styleUrls: ['./travel-management.component.css']
})
export class TravelManagementComponent implements OnInit {
  dropdownSettingsType: any = {};
  dropdownSettingsMultiselect: any = {};
  dataAr: any[];
  Send_request: FormGroup;
  isSubmitted = false;
  EmployeeData: any[];
  SelectData: any[];
  travelarrangement_data: any;
  Travel_with_Data: any;
  HotelRequired_Data: any;
  AccommodationData: any;
  Advance_Data: any
  StateId: any;
  StateIdEnd: any;
  travelwithgroup = false;
  HotelRequired_yes = false;
  GuestHouseRequired_yes = false;
  Advance_yes = false;
  Select_travelEmployees_Data: any[];
  Email_Employees_Data: any[];
  CountryData: any[];
  StateData: any[];
  StateData_EndPoint: any[];
  CityData: any[];
  CityData_EndPoint: any[];
  travelmode_data: any[];
  traveltype_data: any[];
  purpose_of_visitData: any[];
  City_Class_Data: any[];
  GuestHouse_Data: any[];
  selectedFiles: File[] = [];
  fileError: any = '';
  validImageExtensions: string[] = ['jpg', 'jpeg', 'png', 'gif', 'pdf'];
  FileNames: any;
  minDate: Date;
  Update_ID: any = '';
  travelarrangement_Value: any;
  selectedTravelArrangement: any[];
  selectedAdvanceRequirement: any;
  selectedPurpose_Of_Vist: any[];
  selectedTravelType: any[];
  selectedTravelMode: any[];
  selected_StartCountry: any[];
  selected_StartState: any;
  selected_StartCity: any;
  selected_StartTier: any[];
  selected_EndCountry: any[];
  selected_EndState: any;
  selected_EndCity: any;
  selected_EndTier: any[];
  selected_TravelWith: any[];
  Selected_GuestHouse: any[];
  AccommodationValue: any[];
  Selected_HotelRequire: any;
  Selected_Group: any[];
  Selected_Email: any;
  selected_Travel: any;
  selected_StartDate: any;
  selected_EndDate: any;
  selected_Remark: any;
  Selected_WorkInHand: any;
  Selected_NearbyHotel: any;
  Selected_Advance: any;
  hotelName: any;
  Selected_AdvanceDetails: any;
  CityId: any;
  CityId_End: any;
  HotelNameRequired_yes: boolean = false;
  AdvanceValCheck: any;
  ManagerRights = false;
  login_Id: any;
  Employee_Id: any;
  landmarkshowornot: number = 0;

  constructor(
    private FormBuilder: FormBuilder,
    private api: ApiService,
    private router: Router,
    private activeroute: ActivatedRoute
  ) {
    this.dropdownSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true
    };

    this.dropdownSettingsMultiselect = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: true,
      allowSearchFilter: true,
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };

    // this.activeroute.params.subscribe(params => {

    //   if (params['Id'] != undefined) {
    //     this.Update_ID = params['Id'];
    //     this.Edit_Request();
    //   }
    // });

    this.Send_request = this.FormBuilder.group({
      Employee: ['', Validators.required],
      EmployeeName: ['', Validators.required],
      EmployeeId: ['', Validators.required],
      EmployeeDesignation: ['', Validators.required],
      EmployeeProfile: ['', Validators.required],
      EmployeeVerticle: ['', Validators.required],
      EmployeeRM: ['', Validators.required],
      Travelarrangement: ['', Validators.required],
      Traveltype: ['', Validators.required],
      Travelmode: ['', Validators.required],
      Fromdate: ['', Validators.required],
      Todate: ['', Validators.required],
      Purpose_of_visit: ['', Validators.required],
      Country_EndPoint: ['', Validators.required],
      Country: ['', Validators.required],
      State: ['', Validators.required],
      State_EndPoint: ['', Validators.required],
      City_Class: ['', Validators.required],
      City_EndPoint: ['', Validators.required],
      City: ['', Validators.required],
      City_Class_EndPoint: ['', Validators.required],
      Travel_with: ['', Validators.required],
      Select_travelEmployees: [''],
      Email_Employees: ['', Validators.required],
      GuestHouse: [''],
      HotelName: [''],
      Nearby_Hotels: [''],
      Advance: ['', Validators.required],
      AdvanceAmount: [''],
      AdvanceDetails: [''],
      Work_InHand: ['', Validators.required],
      Remark: ['', Validators.required],
      File: [''],
      accommodation: ['']
    });
    // const FileName = this.Send_request.get('File');

    // if (this.Update_ID != '') {
    //   FileName.setValidators(null);
    // } else {
    //   FileName.setValidators(Validators.required);
    // }

    // FileName.updateValueAndValidity();

    this.travelarrangement_data = [
      { Id: 'Self', Name: 'Self' },
      { Id: 'Travel Desk', Name: 'Travel Desk' },
    ];

    this.Travel_with_Data = [
      { Id: 'Individual', Name: 'Individual' },
      { Id: 'Group', Name: 'Group' },
    ];

    this.AccommodationData = [
      { Id: 'Guest House', Name: 'Guest House' },
      { Id: 'Hotel', Name: 'Hotel' },
      { Id: 'None', Name: 'None' },
    ];

    this.Advance_Data = [
      { Id: 'Yes', Name: 'Yes' },
      { Id: 'No', Name: 'No' },
    ];
    this.CountryData = [
      { Id: 'India', Name: 'India' },
    ];

    this.Send_request.get('accommodation').valueChanges.subscribe((value) => {

      if (Array.isArray(value) && value.length > 0) {

        if (value[0]['Id'] == 'Guest House') {
          this.GuestHouseRequired_yes = true;
          this.HotelRequired_yes = false;
          this.HotelNameRequired_yes = true;
          this.Send_request.addControl('GuestHouse', this.FormBuilder.control(''));
          this.Send_request.addControl('Nearby_Hotels', this.FormBuilder.control(''));
        } else if (value[0]['Id'] == 'Hotel') {
          this.HotelRequired_yes = true;
          this.HotelNameRequired_yes = true;
          this.GuestHouseRequired_yes = false;
          this.Send_request.removeControl('GuestHouse');
          this.Send_request.addControl('HotelName', this.FormBuilder.control(''));
          this.Send_request.addControl('Nearby_Hotels', this.FormBuilder.control(''));
        } else if (value[0]['Id'] == 'None') {
          this.HotelRequired_yes = false;
          this.GuestHouseRequired_yes = false;
          this.HotelNameRequired_yes = false;
          this.Send_request.removeControl('GuestHouse');
          this.Send_request.removeControl('HotelName');
          this.Send_request.removeControl('Nearby_Hotels');
        }
        else {
          this.HotelRequired_yes = false;
          this.GuestHouseRequired_yes = false;
          this.HotelNameRequired_yes = false;
          this.Send_request.removeControl('GuestHouse');
          this.Send_request.removeControl('HotelName');
          this.Send_request.removeControl('Nearby_Hotels');
        }
      }
    });



    this.Send_request.get('Travel_with').valueChanges.subscribe((value) => {
      if (Array.isArray(value) && value.length > 0) {
        if (value[0]['Id'] === 'Group') {
          this.travelwithgroup = true;
          this.Send_request.addControl('Select_travelEmployees', this.FormBuilder.control('', Validators.required));
        } else {
          this.travelwithgroup = false;
          this.Send_request.removeControl('Select_travelEmployees');
        }
      }
    });


    this.Send_request.get('State').valueChanges.subscribe((value) => {
      if (Array.isArray(value) && value.length > 0) {
        this.StateId = value[0]['Id'];
        this.GetCity(this.StateId, 'Start');
      }
    });



    this.Send_request.get('State_EndPoint').valueChanges.subscribe((value) => {
      if (Array.isArray(value) && value.length > 0) {
        this.StateId = value[0]['Id'];
        this.StateIdEnd = value[0]['Id'];
        this.GetCity(this.StateId, 'End');
      }
    });


    this.Send_request.get('City').valueChanges.subscribe((value) => {
      if (Array.isArray(value) && value.length > 0) {
        this.CityId = value[0]['Id'];
        this.GetGuestHouse();
      }
    });

    this.Send_request.get('City_EndPoint').valueChanges.subscribe((value) => {
      if (Array.isArray(value) && value.length > 0) {
        this.CityId_End = value[0]['Id'];
        this.GetGuestHouse();
      }
    });



    // this.minDate = new Date();

    //  --------------------DUMY DATA---------------------------------

    this.traveltype_data = [
      { Id: 'Domestic Travel', Name: 'Domestic Travel' }
    ];

    this.City_Class_Data = [
      { Id: 'Tier 1', Name: 'Tier 1' },
      { Id: 'Tier 2', Name: 'Tier 2' },
      { Id: 'Tier 3', Name: 'Tier 3' },
    ];

  }

  get FC() {
    return this.Send_request.controls;
  }

  ngOnInit() {
    this.GetEmployeedata('');
    this.TravelEmployee();
    this.GetState();
    this.GetTravelMaster();


    this.activeroute.params.subscribe(params => {

      if (params['Id'] != undefined) {
        this.Update_ID = params['Id'];
        this.Edit_Request();
      }
    });

    if (this.Update_ID != '') {

      this.Advance_yes = true;
      this.Send_request.get('AdvanceAmount').setValidators(Validators.required);
      this.Send_request.get('AdvanceDetails').setValidators(Validators.required);
    } else {
      this.Advance_yes = false;
      this.Send_request.get('AdvanceAmount').setValidators(null);
      this.Send_request.get('AdvanceDetails').setValidators(null);
    }
    this.Send_request.get('AdvanceAmount').updateValueAndValidity();
    this.Send_request.get('AdvanceDetails').updateValueAndValidity();

  }



  AdvanceYesNO(e) {

    this.AdvanceValCheck = e['Id'];

    if (this.AdvanceValCheck == 'Yes') {
      this.Advance_yes = true;
      this.Send_request.get('AdvanceAmount').setValidators(Validators.required);
      this.Send_request.get('AdvanceDetails').setValidators(Validators.required);
    } else {
      this.Advance_yes = false;
      this.Send_request.get('AdvanceAmount').setValidators(null);
      this.Send_request.get('AdvanceDetails').setValidators(null);
    }
    this.Send_request.get('AdvanceAmount').updateValueAndValidity();
    this.Send_request.get('AdvanceDetails').updateValueAndValidity();
  }


  GetEmployeedata(e: any) {

    if (e) {
      var empId = e.Id;
    } else {
      empId = ''
    }
    this.api.HttpGetType(
      "TravelRequest/getemployeedata?employeeId=" + empId
    ).then(
      (result: any) => {
        if (result['status'] == true) {
          this.EmployeeData = result.data;


          if (empId == '') {
            this.minDate = new Date();
            this.ManagerRights = false;
          } else {
            this.minDate = null;
          }


          if (result.manager == 1) {
            this.ManagerRights = true;
          }



          // this.Send_request.patchValue({
          //   Employee: this.EmployeeData[0].ID,
          //   EmployeeName: this.EmployeeData[0].Employee_Name,
          //   EmployeeId: this.EmployeeData[0].Employee_ID,
          //   EmployeeDesignation: this.EmployeeData[0].DesignationId,
          //   EmployeeProfile: this.EmployeeData[0].ProfileId,
          //   EmployeeVerticle: this.EmployeeData[0].DepartmentId,
          //   EmployeeRM: this.EmployeeData[0].RM_Id
          // });


          this.Send_request.patchValue({
            Employee: this.EmployeeData[0].ID,
            EmployeeName: this.EmployeeData[0].Employee_Name,
            EmployeeId: this.EmployeeData[0].Employee_ID,
            EmployeeDesignation: this.EmployeeData[0].Employee_Designation,
            EmployeeProfile: this.EmployeeData[0].Employee_Profile,
            EmployeeVerticle: this.EmployeeData[0].Employee_Department,
            EmployeeRM: this.EmployeeData[0].Employee_ReportingManager
          });

        } else {
          this.api.Toast("Warning", result['msg']);
        }
      },
      (err) => {
        this.api.Toast(
          "Warning", "Network Error : " + err.name + "(" + err.statusText + ")"
        );
      }
    )
  }

  GetTravelMaster() {
    this.api.HttpGetType(
      "TravelRequest/GetTravelMaster"
    ).then(
      (result: any) => {
        if (result['status'] == true) {

          this.travelmode_data = result.travelmode_data;
          this.purpose_of_visitData = result.purpose_of_visitData;

        } else {
          this.api.Toast("Warning", result['msg']);
        }
      },
      (err) => {
        this.api.Toast(
          "Warning", "Network Error : " + err.name + "(" + err.statusText + ")"
        );
      }
    )
  }

  onFileChange(event: any) {

    this.fileError = '';
    this.selectedFiles = [];

    if (event.target.files.length > 0) {
      for (let i = 0; i < event.target.files.length; i++) {
        const file = event.target.files[i];
        const extension = file.name.split('.').pop().toLowerCase();
        if (!this.validImageExtensions.includes(extension)) {

          this.fileError = `Invalid file type for ${file.name}. Please upload an image with a valid extension (jpg, jpeg, png, gif).`;
          return;
        }
        this.selectedFiles.push(file);
      }
    }

    if (this.selectedFiles.length > 5) {

      this.fileError = 'You can only upload up to 5 images at a time.';
      return;
    }
    this.FileNames = this.selectedFiles[0].name;
  }



  TravelEmployee() {
    this.api
      .HttpGetType("TravelRequest/Select_Employee")
      .then((result: any) => {
        if (result["status"] == true) {
          this.Select_travelEmployees_Data = result["data"];
          this.Email_Employees_Data = result['data'];

        } else {
          this.Select_travelEmployees_Data = [];
          this.Email_Employees_Data = [];
        }
      });
  }

  GetState() {

    this.api
      .HttpGetType("TravelRequest/Select_State")
      .then((result: any) => {
        if (result["status"] == true) {
          this.StateData = result["data"];
          this.StateData_EndPoint = result['data'];

        } else {
          this.StateData = [];
          this.StateData_EndPoint = [];
        }
      });
  }

  GetCity(StateId: any, Type: any) {
    this.StateId = StateId;
    const formdata = new FormData();

    formdata.append('state_id', this.StateId);
    formdata.append('UserId', this.api.GetUserData("Id"));
    formdata.append('UserType', this.api.GetUserData("Type"));
    this.api.HttpPostType(
      "TravelRequest/Select_City", formdata
    )
      .then(
        (result: any) => {
          if (result['status'] == true) {


            if (Type == 'Start') {

              this.CityData = result['data'];
            }
            if (Type == 'End') {

              this.CityData_EndPoint = result['data'];

            }

          } else {
            this.CityData = [];
            this.CityData_EndPoint = [];
          }
        },
        (err) => {
          this.api.Toast(
            "Warning", "Network Error : + " + err.name + "(" + err.statusText + ")"
          )
        }
      )
  }


  GetGuestHouse() {


    const formdata = new FormData();

    formdata.append('CityId_End', this.CityId_End);
    formdata.append('UserId', this.api.GetUserData("Id"));
    formdata.append('UserType', this.api.GetUserData("Type"));
    this.api.HttpPostType(
      "TravelRequest/Select_GuestHouse", formdata
    )
      .then(
        (result: any) => {
          if (result['status'] == true) {
            this.GuestHouse_Data = result['data'];
          } else {
            this.GuestHouse_Data = [];
          }
        },
        (err) => {
          this.api.Toast(
            "Warning", "Network Error : + " + err.name + "(" + err.statusText + ")"
          )
        }
      )

  }


  Cancelrequest() {
    this.router.navigate(['/travel_request/employee']);
  }


  TravelRequest() {
    this.isSubmitted = true;

    const selectedDate1 = this.FC.Fromdate.value;
    const selectedDate2 = this.FC.Todate.value;




    if (selectedDate2 < selectedDate1) {
      this.FC.Todate.setErrors({ dateInvalid: true });
    } else {
      this.FC.Todate.setErrors(null);
    }


    if (this.Send_request.invalid) {

      console.log(this.Send_request);
      return;
    } else {

      const formdata = new FormData();
      const fields = this.Send_request.value;

      const controls = this.FC;

      for (const [controlName, control] of Object.entries(controls)) {
        if (Array.isArray(control.value) && control.value.length > 0 && control.value[0]['Id']) {
          this.SelectData = [];
          for (let i = 0; i < control.value.length; i++) {
            this.SelectData.push({
              Id: control.value[i].Id,
              Name: control.value[i].Name
            });
          }
          formdata.append(controlName, JSON.stringify(this.SelectData));

        } else {
          formdata.append(controlName, control.value);


        }
      }


      formdata.append('EmployeeId', this.EmployeeData[0].Employee_ID);
      formdata.append('EmployeeDesignation', this.EmployeeData[0].DesignationId);
      formdata.append('EmployeeProfile', this.EmployeeData[0].ProfileId);
      formdata.append('EmployeeVerticle', this.EmployeeData[0].DepartmentId);
      formdata.append('EmployeeRM', this.EmployeeData[0].RM_Id);
      formdata.append('UserId', this.api.GetUserData("Id"));
      formdata.append('UserType', this.api.GetUserData("Type"));


      formdata.append('Update_ID', this.Update_ID);


      this.login_Id = this.api.GetUserData("Id");
      this.Employee_Id = this.EmployeeData ? this.EmployeeData[0].ID : '';

      if (this.login_Id == this.Employee_Id) {

        this.minDate = new Date();
        this.ManagerRights = false;
        formdata.append('Manager', '');
      }


      if (this.ManagerRights == true) {
        formdata.append('Manager', 'Manager');
      }
      const Documents = [];

      if (this.selectedFiles) {
        if (this.selectedFiles.length > 0 && this.selectedFiles.length < 6) {
          for (let i = 0; i < this.selectedFiles.length; i++) {
            formdata.append("Documents[]", this.selectedFiles[i], this.selectedFiles[i].name);
          }
        }
      } else {
        return;
      }

      this.api.HttpPostType("TravelRequest/Save_Request", formdata)
        .then(
          (result: any) => {
            if (result['status'] == true) {
              // Reset  form
              this.isSubmitted = false;
              this.Send_request.reset();
              this.GetEmployeedata('');
              this.api.Toast("Success", result['msg']);
              this.router.navigate(['/travel_request/employee']);
            } else {
              this.api.Toast("Warning", result['msg']);
              if (result['msg'] == 'Request Already Raised') {
                this.router.navigate(['/travel_request/employee']);
              }
            }
          },
          (err) => {
            this.api.Toast("Warning", "Network Error : " + err.name + "(" + err.statusText + ")"
            );
          });
    }
  }


  parseDate(dateStr: string): Date {
    const parts = dateStr.split('-');

    return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
  }


  Edit_Request() {
    this.api.HttpGetType("TravelRequest/view_request?Update_ID=" + this.Update_ID + "User_Id=" + this.api.GetUserData("Id") + "&User_Type=" + this.api.GetUserType())
      .then(
        (result: any) => {
          if (result['status'] == true) {
            const data = result.data[0];

            if (result.data[0]['advance_requirement'] == 'Yes') {
              this.Advance_yes = true;
              this.Selected_Advance = result.data[0]['advance_amount'];
              this.hotelName = result.data[0]['HotelName'];
              this.Send_request.addControl('AdvanceAmount', this.FormBuilder.control('', Validators.required));
              this.Send_request.addControl('AdvanceDetails', this.FormBuilder.control('', Validators.required));

            } else {
              this.Advance_yes = false;
              this.Send_request.removeControl('AdvanceAmount');
              this.Send_request.removeControl('AdvanceDetails');
            }

            if (result.data[0]['travel_with'] == 'Group') {

              this.travelwithgroup = true;
              this.Send_request.addControl('Select_travelEmployees', this.FormBuilder.control('', Validators.required));
            } else {
              this.travelwithgroup = false;
              this.Send_request.removeControl('Select_travelEmployees');
            }


            if (result.data[0]['accommodation'] == 'None') {
              this.HotelRequired_yes = false;
              this.GuestHouseRequired_yes = false;
              this.HotelNameRequired_yes = false;
              this.Send_request.removeControl('GuestHouse');
              this.Send_request.removeControl('HotelName');
              this.Send_request.removeControl('Nearby_Hotels');
            } else if (result.data[0]['accommodation'] == 'Guest House') {
              this.GuestHouseRequired_yes = true;
              this.HotelRequired_yes = false;
              this.HotelNameRequired_yes = true;
              this.Send_request.addControl('GuestHouse', this.FormBuilder.control(''));
              this.Send_request.addControl('Nearby_Hotels', this.FormBuilder.control(''));
            } else if (result.data[0]['accommodation'] == 'Hotel') {
              this.HotelRequired_yes = true;
              this.HotelNameRequired_yes = true;
              this.GuestHouseRequired_yes = false;
              this.Send_request.removeControl('GuestHouse');
              this.Send_request.addControl('HotelName', this.FormBuilder.control(''));
              this.Send_request.addControl('Nearby_Hotels', this.FormBuilder.control(''));
            } else {
              this.HotelRequired_yes = false;
              this.GuestHouseRequired_yes = false;
              this.HotelNameRequired_yes = false;
              this.Send_request.removeControl('GuestHouse');
              this.Send_request.removeControl('HotelName');
              this.Send_request.removeControl('Nearby_Hotels');
            }

            this.selectedTravelArrangement = data['travel_arrangement'] ? [{ Id: data['travel_arrangement'], Name: data['travel_arrangement'] }] : [];
            this.selectedAdvanceRequirement = data['advance_requirement'] ? [{ Id: data['advance_requirement'], Name: data['advance_requirement'] }] : [];
            this.selectedPurpose_Of_Vist = result['selectedPurpose_Of_Vist'];
            this.selectedTravelType = data['travel_type'] ? [{ Id: data['travel_type'], Name: data['travel_type'] }] : [];
            this.selectedTravelMode = result['Selected_travelMode'];
            this.selected_StartCountry = data['country_start_point'] ? [{ Id: data['country_start_point'], Name: data['country_start_point'] }] : [];
            this.selected_StartTier = data['tier_start_point'] ? [{ Id: data['tier_start_point'], Name: data['tier_start_point'] }] : [];
            this.selected_EndCountry = data['country_end_point'] ? [{ Id: data['country_end_point'], Name: data['country_end_point'] }] : [];
            this.selected_EndTier = data['tier_end_point'] ? [{ Id: data['tier_end_point'], Name: data['tier_end_point'] }] : [];
            this.selected_Travel = data['travel_with'] ? [{ Id: data['travel_with'], Name: data['travel_with'] }] : [];
            this.Selected_HotelRequire = data['hotel_requirement'] ? [{ Id: data['hotel_requirement'], Name: data['hotel_requirement'] }] : [];

            this.Selected_Email = result['email_to_contact'];
            this.Selected_GuestHouse = result['selected_guesthouse'];
            this.AccommodationValue = result['accommodation'];
            this.selected_TravelWith = result['employees_to_travelwith'];
            this.selected_StartState = result['state_start_point'];
            this.selected_StartCity = result['city_start_point'];
            this.selected_EndState = result['state_end_point'];
            this.selected_EndCity = result['city_end_point'];
            this.selected_StartDate = this.parseDate(result.data[0]['travel_start_date']);
            this.minDate = this.selected_StartDate;

            this.selected_EndDate = result.data[0]['travel_end_date'];
            this.selected_Remark = result.data[0]['remark'];
            this.Selected_WorkInHand = result.data[0]['work_in_hand'];
            this.Selected_NearbyHotel = result.data[0]['nearby_hotels'];
            this.Selected_Advance = result.data[0]['advance_amount'];
            this.Selected_AdvanceDetails = result.data[0]['advance_details'];

            // this.GetCity(this.selected_StartState[0].Id , 'Start');
            // this.GetCity(this.selected_EndState[0].Id , 'End');


          } else {
            this.api.Toast("Warning", result['msg']);
          }
        },
        (err) => {
          this.api.Toast(
            "Warning", "Network Error : " + err.name + "(" + err.statusText + ")"
          )
        }
      )

  }



  NearBy(event: any) {
    if (event.Id == 'Hotel') {
      this.landmarkshowornot = 1;
    } else {
      this.landmarkshowornot = 0;
    }
  }

  citydrop(type: any) {
    if (type == 'start') {
      this.Send_request.get('City').setValue('');
    }

    if (type == 'end') {
      this.Send_request.get('City_EndPoint').setValue('');
    }

  }


}
