import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../providers/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from "angular-datatables";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-travelrequest-master',
  templateUrl: './travelrequest-master.component.html',
  styleUrls: ['./travelrequest-master.component.css']
})
export class TravelrequestMasterComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false }) datatableElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dropdownSettingsType: any = {};
  dropdownSettingsMultiselect: any = {};
  dataAr: any[];

  TravelRequest_purpose: FormGroup;
  TravelRequest_Mode: FormGroup;
  TravelRequest_GuestHouse: FormGroup;
  TravelRequest_Profile: FormGroup;
  TravelRequest_Conveyance: FormGroup;
  TravelRequest_Conveyance_Misc: FormGroup;
  RequestData: FormGroup;

  isSubmitted = false;
  url_segment: string;
  StateData: any[];
  StateId: any;
  CityData: any[];
  Travel_modeData: any[];
  UpdateId: any = "";
  Data: any;
  Selected_State: any[];
  Selected_City: any[];
  GuestHouse: any;
  GuestHouse_Address: any;
  GuestHouse_Contact: any;
  PurposeOfVisit: any;
  SelectedTravel_mode: any;
  Travel_transportData: any;
  Fare_Data: any;
  Status_data: any[];
  Selected_Status: any[];
  Selected_TA_DA_Data: any[];
  Selected_Profile: any[];
  TA_DA_Data: any[];
  Conveyance_Data1: any[];
  Conveyance_Data2: any[];
  SelectedAllowence: any;
  SelectedConveyance: any;
  ProfileData: any[];
  DA: any;
  TA: any;
  Selected_Conveyance_Data1: any[];
  Selected_Conveyance_Data2: any[];
  Local_Conveyance: any;
  Miscellaneous_Conveyance: any;
  FareSelected: any[];
  FareYes: any;
  Selected_Fare: any[];
  hasAccess: boolean = true;
  errorMessage: string = "";
  // Selected_Conveyance_Data123: any;


  constructor(
    private FormBuilder: FormBuilder,
    private api: ApiService,
    private router: Router,
    private activeroute: ActivatedRoute,
    private http: HttpClient,
  ) {

    this.url_segment = router.url.split('/')[2];
    // this.UpdateId = router.url.split('/')[3];


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

    }

    this.Conveyance_Data1 = [
      { Id: 4, Name: 'Local Conveyance Claim' },
    ];
    this.Conveyance_Data2 = [
      { Id: 5, Name: 'Miscellaneous Claim' },
    ];


    // this.Selected_Conveyance_Data1 = [{ Id: 4, Name: "Local Conveyance Claim" }];
    // this.Selected_Conveyance_Data2 = [{ Id: 5, Name: "Miscellaneous Claim" }];

    this.RequestData = this.FormBuilder.group({
      SearchVal: ['']
    })

    this.TravelRequest_purpose = this.FormBuilder.group({
      Purpose_of_visit: ['', Validators.required],
      Status: ['', Validators.required]
    });


    this.TravelRequest_Mode = this.FormBuilder.group({
      Travel_mode: ['', Validators.required],
      Travel_transport: ['', Validators.required],
      FareSelect: ['', Validators.required],
      Fare: [''],
      Status: ['', Validators.required]
    });


    this.TravelRequest_GuestHouse = this.FormBuilder.group({
      State: ['', Validators.required],
      City: ['', Validators.required],
      Guest_house: ['', Validators.required],
      Guest_house_address: ['', Validators.required],
      Contact: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      Status: ['', Validators.required]
    });

    this.TravelRequest_Profile = this.FormBuilder.group({
      Profile: ['', Validators.required],
      TA_DA: ['', Validators.required],
      TA: [''],
      DA: [''],
      Status: ['', Validators.required]
    });

    this.TravelRequest_Conveyance = this.FormBuilder.group({
      Conveyance: [this.Selected_Conveyance_Data1, Validators.required],
      Local_Conveyance: ['', Validators.required],
      Status: ['', Validators.required]
    });

    this.TravelRequest_Conveyance_Misc = this.FormBuilder.group({
      Conveyance: [this.Selected_Conveyance_Data2, Validators.required],
      Miscellaneous_Conveyance: ['', Validators.required],
      Status: ['', Validators.required]
    });

    this.Travel_modeData = [
      { Id: 'Road', Name: 'Road' },
      { Id: 'Railway', Name: 'Railway' },
      { Id: 'Air', Name: 'Air' },
      { Id: 'Sea', Name: 'Sea' },
    ];


    this.Status_data = [
      { Id: 'Active', Name: 'Active' },
      { Id: 'In-Active', Name: 'In-Active' },
    ];

    this.TA_DA_Data = [
      { Id: '1', Name: 'Travel Allowence' },
      { Id: '2', Name: 'Daily Allowence' },
      { Id: '3', Name: 'All' },
    ]



    this.FareSelected = [
      { Id: 'Yes', Name: 'Yes' },
      { Id: 'No', Name: 'No' },
    ]


    this.TravelRequest_Mode.get('FareSelect').valueChanges.subscribe((value) => {

      if (Array.isArray(value) && value.length > 0) {

        if (value[0]['Id'] == 'Yes') {
          this.FareYes = value[0]['Id'];

          this.TravelRequest_Mode.get('Fare').setValidators([Validators.required]);
          this.TravelRequest_Mode.get('Fare').updateValueAndValidity();

        }
        else {
          this.FareYes = value[0]['Id'];
          this.TravelRequest_Mode.get('Fare').setValidators(null);
          this.TravelRequest_Mode.get('Fare').updateValueAndValidity();
        }

      }

    });


    this.TravelRequest_GuestHouse.get('State').valueChanges.subscribe((value) => {
      if (Array.isArray(value) && value.length > 0) {
        this.StateId = value[0]['Id'];
        this.GetCity(this.StateId);
      }
    });

    this.TravelRequest_Profile.get('TA_DA').valueChanges.subscribe((value) => {
      if (Array.isArray(value) && value.length > 0) {
        this.SelectedAllowence = value[0]['Id'];

        if (this.SelectedAllowence == 1) {

          this.TravelRequest_Profile.get('TA').setValidators([Validators.required]);
          this.TravelRequest_Profile.get('TA').updateValueAndValidity();

          this.TravelRequest_Profile.get('DA').setValidators(null);
          this.TravelRequest_Profile.get('DA').updateValueAndValidity();

        } else if (this.SelectedAllowence == 2) {

          this.TravelRequest_Profile.get('DA').setValidators([Validators.required]);
          this.TravelRequest_Profile.get('DA').updateValueAndValidity();

          this.TravelRequest_Profile.get('TA').setValidators(null);
          this.TravelRequest_Profile.get('TA').updateValueAndValidity();

        } else {

          this.TravelRequest_Profile.get('TA').setValidators([Validators.required]);
          this.TravelRequest_Profile.get('TA').updateValueAndValidity();

          this.TravelRequest_Profile.get('DA').setValidators([Validators.required]);
          this.TravelRequest_Profile.get('DA').updateValueAndValidity();
        }
      }
    });

  }

  ngOnInit() {

    if (this.url_segment == 'guestHouse_data') {
      this.GetState();
    } else if (this.url_segment == 'TA-DA_data') {
      this.GetProfile();
    }
    this.Get();


  }

  ClearSearch() {
    this.dataAr = [];
    this.RequestData.reset();
    this.ResetDT();
  }

  Reload() {

    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  ResetDT() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search("").column(0).search("").draw();
    });
  }

  SearchData() {

    var fields = this.RequestData.value;

    this.datatableElement.dtInstance.then((dtInstance: any) => {
      dtInstance.column(0).search(this.api.encryptText(JSON.stringify(fields))).draw();
    });
    this.Get();
  }


  GetState() {

    this.api
      .HttpGetType("TravelRequest/Select_State")
      .then((result: any) => {
        if (result["status"] == true) {
          this.StateData = result["data"];

        } else {
          this.StateData = [];
        }
      });
  }

  GetCity(StateId: any) {
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
            this.CityData = result['data'];

          } else {
            this.CityData = [];
          }
        },
        (err) => {
          this.api.Toast(
            "Warning", "Network Error : + " + err.name + "(" + err.statusText + ")"
          )
        }
      )
  }

  GetProfile() {

    this.api
      .HttpGetType("TravelRequest/Select_Profile")
      .then((result: any) => {
        if (result["status"] == true) {
          this.ProfileData = result["data"];

        } else {
          this.ProfileData = [];
        }
      });
  }

  Save() {

    this.isSubmitted = true;
    const formdata = new FormData();
    if (this.UpdateId != null || this.UpdateId != '') {
      formdata.append("UpdateId", this.UpdateId);
    }

    if (this.url_segment === 'visit_data' && !this.TravelRequest_purpose.invalid) {

      formdata.append("VisitDetails", this.TravelRequest_purpose.get('Purpose_of_visit').value);
      formdata.append("Status", this.TravelRequest_purpose.get('Status').value[0].Id);

    } else if (this.url_segment === 'mode_data' && !this.TravelRequest_Mode.invalid) {

      formdata.append("Transport", this.TravelRequest_Mode.get('Travel_mode').value[0].Id);
      formdata.append("TransportName", this.TravelRequest_Mode.get('Travel_transport').value);
      if (this.FareYes == 'Yes') {
        formdata.append("Fare", this.TravelRequest_Mode.get('Fare').value);
      } else {
        formdata.append("Fare", "0");
      }

      formdata.append("Status", this.TravelRequest_Mode.get('Status').value[0].Id);

    } else if (this.url_segment === 'guestHouse_data' && !this.TravelRequest_GuestHouse.invalid) {

      formdata.append("State", this.TravelRequest_GuestHouse.get('State').value[0].Id);
      formdata.append("City", this.TravelRequest_GuestHouse.get('City').value[0].Id);
      formdata.append("GuestHouse", this.TravelRequest_GuestHouse.get('Guest_house').value);
      formdata.append("GuestHouseAddress", this.TravelRequest_GuestHouse.get('Guest_house_address').value);
      formdata.append("Contact", this.TravelRequest_GuestHouse.get('Contact').value);
      formdata.append("Status", this.TravelRequest_GuestHouse.get('Status').value[0].Id);

    } else if (this.url_segment === 'TA-DA_data' && !this.TravelRequest_Profile.invalid) {

      formdata.append("Profile", JSON.stringify(this.TravelRequest_Profile.get('Profile').value));
      formdata.append("AllowenceType", this.TravelRequest_Profile.get('TA_DA').value[0].Id);
      formdata.append("TA", this.TravelRequest_Profile.get('TA').value);
      formdata.append("DA", this.TravelRequest_Profile.get('DA').value);
      formdata.append("Status", this.TravelRequest_Profile.get('Status').value[0].Id);

    } else if (this.url_segment === 'Local-conveyance_data' && !this.TravelRequest_Conveyance.invalid) {

      formdata.append("ConveyanceType", this.TravelRequest_Conveyance.get('Conveyance').value[0].Id);
      formdata.append("Local_Conveyance", this.TravelRequest_Conveyance.get('Local_Conveyance').value);
      formdata.append("Status", this.TravelRequest_Conveyance.get('Status').value[0].Id);

    } else if (this.url_segment === 'Mis-claim_data' && !this.TravelRequest_Conveyance_Misc.invalid) {

      formdata.append("ConveyanceType", this.TravelRequest_Conveyance_Misc.get('Conveyance').value[0].Id);
      formdata.append("Miscellaneous_Conveyance", this.TravelRequest_Conveyance_Misc.get('Miscellaneous_Conveyance').value);
      formdata.append("Status", this.TravelRequest_Conveyance_Misc.get('Status').value[0].Id);

    } else {

      return;
    }

    formdata.append('UserId', this.api.GetUserData("Id"));
    formdata.append('UserType', this.api.GetUserData("Type"));

    this.api.HttpPostType(
      "TravelRequest/Save_Travel_Master", formdata
    )
      .then(
        (result: any) => {
          if (result['status'] == true) {
            this.api.Toast("Success", result['msg']);

            if (this.url_segment == 'visit_data') {
              this.ResetDT();
              this.TravelRequest_purpose.reset();
              const closeModel = document.getElementById('close');
              closeModel.click();

            } else if (this.url_segment == 'mode_data') {
              this.ResetDT();
              this.TravelRequest_Mode.reset();
              const closeModel = document.getElementById('close');
              closeModel.click();

            } else if (this.url_segment == 'guestHouse_data') {
              this.ResetDT();
              this.TravelRequest_GuestHouse.reset();
              const closeModel = document.getElementById('close');
              closeModel.click();

            } else if (this.url_segment == 'TA-DA_data') {
              this.ResetDT();
              this.TravelRequest_Profile.reset();
              const closeModel = document.getElementById('close');
              closeModel.click();

            } else if (this.url_segment == 'Local-conveyance_data') {
              this.ResetDT();
              this.TravelRequest_Conveyance.reset();
              const closeModel = document.getElementById('close');
              closeModel.click();

            } else if (this.url_segment == 'Mis-claim_data') {
              this.ResetDT();
              this.TravelRequest_Conveyance_Misc.reset();
              const closeModel = document.getElementById('close');
              closeModel.click();

            }

          } else {
            this.api.Toast("Warning", result['msg']);
          }
        },
        (err) => {
          this.api.Toast("Warning", "Network Error : " + err.name + "(" + err.statusText + ")"

          );
        }
      )
  }


  Get(): void {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.api.GetToken(),
      }),
    };


    const that = this;
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.api.additionParmsEnc(environment.apiUrl +
              "/TravelRequest/Travel_Master_List?User_Id=" +
              this.api.GetUserData("Id") +
              "&User_Type=" +
              this.api.GetUserType() + "&SectionUrl=" + this.url_segment),
            dataTablesParameters,
            httpOptions
          )
          .subscribe((res: any) => {
            var resp = JSON.parse(this.api.decryptText(res.response));
            if (resp.status === "urlWrong") {
              that.hasAccess = false;
              that.errorMessage = resp.msg;
              return;
            }
            that.hasAccess = true;

            this.dataAr = resp.data;

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });

          });
      },
    };

  }

  GetUpdateData(ID: any) {

    const formdata = new FormData();
    this.UpdateId = ID;
    formdata.append("UpdateId", ID);
    formdata.append("UpdateId", ID);
    this.api.HttpPostType(
      "TravelRequest/Travel_Master_List?SectionUrl=" + this.url_segment, formdata
    )
      .then(
        (result: any) => {
          this.Data = result.data[0];

          if (this.url_segment == 'TA-DA_data') {
            this.Selected_Status = this.Data.Status ? [{ Id: this.Data.Status, Name: this.Data.Status }] : [];
            this.Selected_Profile = result.data[1]['Selected_Profile'];
            this.Selected_TA_DA_Data = result.data[1]['Selected_Allowance'];

            this.DA = this.Data.Daily_Allowance;
            this.TA = this.Data.Travel_Allowance;
          }

          this.GuestHouse_Contact = this.Data.GuestHouse_Contact;

          if (this.url_segment == 'guestHouse_data') {

            this.Selected_State = result.data[1]['Selected_State'];
            this.Selected_City = result.data[1]['Selected_City'];
            this.GuestHouse = this.Data.GuestHouse;
            this.GuestHouse_Address = this.Data.GuestHouse_Address;
            this.GuestHouse_Contact = this.Data.GuestHouse_Contact;
            this.Selected_Status = this.Data.Status ? [{ Id: this.Data.Status, Name: this.Data.Status }] : [];

          } else if (this.url_segment == 'visit_data') {

            this.PurposeOfVisit = this.Data.Purpose_Of_Visit;
            this.Selected_Status = this.Data.Status ? [{ Id: this.Data.Status, Name: this.Data.Status }] : [];

          } else if (this.url_segment == 'mode_data') {
            this.SelectedTravel_mode = this.Data.Travel_type ? [{ Id: this.Data.Travel_type, Name: this.Data.Travel_type }] : [];
            this.Travel_transportData = this.Data.Travel_mode;
            this.Fare_Data = this.Data.Fare;
            if (this.Fare_Data == 0.00) {
              this.Selected_Fare = this.Data.Travel_type ? [{ Id: 'No', Name: 'No' }] : [];
            } else {
              this.Selected_Fare = this.Data.Travel_type ? [{ Id: 'Yes', Name: 'Yes' }] : [];
            }
            this.Selected_Status = this.Data.Status ? [{ Id: this.Data.Status, Name: this.Data.Status }] : [];
          } else if (this.url_segment == 'Local-conveyance_data') {

            this.Selected_Conveyance_Data1 = result.data['1']['Selected_Conveyance_Data'];
            this.Local_Conveyance = result.data[0].Fare;
            this.Selected_Status = this.Data.Status ? [{ Id: this.Data.Status, Name: this.Data.Status }] : [];

          } else if (this.url_segment == 'Mis-claim_data') {

            this.Selected_Conveyance_Data2 = result.data['1']['Selected_Conveyance_Data'];
            this.Selected_Conveyance_Data2 = [{ Id: 5, Name: "Miscellaneous Claim" }];

            this.Miscellaneous_Conveyance = result.data[0].Fare;
            this.Selected_Status = this.Data.Status ? [{ Id: this.Data.Status, Name: this.Data.Status }] : [];
          }
        }
      )
  }

  AddMasters() {
    this.UpdateId = '';
    if (this.url_segment == 'visit_data') {

      this.TravelRequest_purpose.reset();

    } else if (this.url_segment == 'mode_data') {

      this.TravelRequest_Mode.reset();

    } else if (this.url_segment == 'guestHouse_data') {

      this.TravelRequest_GuestHouse.reset();

    } else if (this.url_segment == 'TA-DA_data') {

      this.TravelRequest_Profile.reset();

    } else if (this.url_segment == 'Local-conveyance_data') {

      this.TravelRequest_Conveyance.reset();

    } else if (this.url_segment == 'Mis-claim_data') {

      this.TravelRequest_Conveyance_Misc.reset();

    }

  }

  closeModel() {

    const closeModel = document.getElementById('close');
    closeModel.click();
    this.UpdateId = '';
  }

}
