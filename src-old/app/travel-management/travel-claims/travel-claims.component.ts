import { Component, OnInit, Inject } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../providers/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-travel-claims',
  templateUrl: './travel-claims.component.html',
  styleUrls: ['./travel-claims.component.css']
})
export class TravelClaimsComponent implements OnInit {
  dropdownSettingsType: any = {};
  isSubmitted = false;
  is_Submit = false;
  sendClaimRequest: FormGroup;

  details_Of_Journey: { Id: string; Name: string; }[];
  details_Of_Loading: { Id: string; Name: string; }[];
  details_Of_TA: { Id: string; Name: string; }[];
  details_Of_DA: { Id: string; Name: string; }[];
  details_Of_Other_Expense: { Id: string; Name: string; }[];
  TravelData: any;
  JourneyDetails = false;
  LoadingDetails = false;
  TADetails = false;
  DADetails = false;
  Other_ExpenseDetails = false;

  travelmode_data: any[];
  FormData1: any;
  FormData2: any;
  FormData3: any;
  FormData4: any;
  FormData5: any;
  claimId: any;
  fileError: any = '';
  validImageExtensions: string[] = ['jpg', 'jpeg', 'png', 'gif', 'pdf'];
  FileNames: any;
  minDate: Date;
  maxDate: Date;
  fileStorage: any;
  ClaimDataAr: any;
  url_segment: string;
  selecteddetailsOfOther_Expense: { Id: string; Name: string; }[];
  selecteddetailsOfTA: { Id: string; Name: string; }[];
  selecteddetailsOfDA: { Id: string; Name: string; }[];
  selecteddetailsOfLoading: { Id: string; Name: string; }[];
  selecteddetailsOfJourney: { Id: string; Name: string; }[];
  selectedTravelMode: { Id: string; Name: string; }[];
  JourneyDetails1 = true;
  LoadingDetails1 = true;
  TADetails1 = true;
  DADetails1 = true;
  Other_ExpenseDetails1 = true;
  ArrivalPoint: any;
  JourneyAmountTotal: any;
  LoadingAmountTotal: any;
  TAAmountTotal: any;
  DAAmountTotal: any;
  OtherAmountTotal: any;
  TotalAmount: any;
  Balance: any;
  SelectedTA_Date2: any;
  SelectedTA_Date1: any;
  daysDifference: number;
  ProfileData: any;
  TravelAllowence: number;
  SavedForm = false;
  FairAmount: number = 0;
  ShowDistance = false;
  showDistanceForIndex: boolean[] = [];
  show_Distance_For_Index: boolean[] = [];
  DistanceFair: number;
  deletedata: string = '';
  SavedFormChecked = false;


  constructor(
    private FormBuilder: FormBuilder,
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    public Location: Location
  ) {

    this.dropdownSettingsType = {
      singleSelection: true,
      idField: "Id",
      textField: "Name",
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: true
    };

    this.url_segment = router.url.split('/')[2];

    this.sendClaimRequest = this.FormBuilder.group({
      EmployeeName: [''],
      EmployeeId: [''],
      EmployeeDesignation: [''],
      EmployeeProfile: [''],
      EmployeeVerticle: [''],
      EmployeeRM: [''],
      TravelRequestId: [''],
      DateRange: [''],
      PurposeOfVisit: [''],
      PlaceOfVisit: [''],
      detailsOfJourney: ['', Validators.required],
      detailsOfLoading: ['', Validators.required],
      detailsOfTA: ['', Validators.required],
      detailsOfDA: ['', Validators.required],
      detailsOfOther_Expense: ['', Validators.required],

      JourneyDetails_formArrays: this.FormBuilder.array([]),

      LoadingDetails_formArrays: this.FormBuilder.array([]),

      TADetails_formArrays: this.FormBuilder.array([]),

      DADetails_formArrays: this.FormBuilder.array([]),

      Other_ExpenseDetails_formArrays: this.FormBuilder.array([]),

    });

    this.details_Of_Journey = [
      { Id: 'Yes', Name: 'Yes' },
      { Id: 'No', Name: 'No' },
    ];

    this.details_Of_Loading = [
      { Id: 'Yes', Name: 'Yes' },
      { Id: 'No', Name: 'No' },
    ];

    this.details_Of_TA = [
      { Id: 'Yes', Name: 'Yes' },
      { Id: 'No', Name: 'No' },
    ];

    this.details_Of_DA = [
      { Id: 'Yes', Name: 'Yes' },
      { Id: 'No', Name: 'No' },
    ];

    this.details_Of_Other_Expense = [
      { Id: 'Yes', Name: 'Yes' },
      { Id: 'No', Name: 'No' },
    ];



  }



  ShowForm(e, type: string) {

    if (type == 'detailsOfJourney') {
      if (e['Id'] == 'Yes') {
        this.JourneyDetails = true;
        this.JourneyDetails_formArrays.push(this.createArray('Details Of Journey'));
        this.GetTravelMaster();


      } else {
        this.JourneyDetails = false;
        this.JourneyDetails_formArrays.clear();
      }

    }

    if (type == 'detailsOfLoading') {
      if (e['Id'] == 'Yes') {
        this.LoadingDetails = true;
        this.LoadingDetails_formArrays.push(this.createArray('Details Of Loading'));

      } else {
        this.LoadingDetails = false;
        this.LoadingDetails_formArrays.clear();
      }

    }

    if (type == 'detailsOfTA') {
      if (e['Id'] == 'Yes') {
        this.TADetails = true;
        this.TADetails_formArrays.push(this.createArray('Details Of TA'));
        this.GetProfileData();

      } else {
        this.TADetails = false;
        this.TADetails_formArrays.clear();
      }

    }

    if (type == 'detailsOfDA') {
      if (e['Id'] == 'Yes') {
        this.DADetails = true;
        this.GetProfileData();
        this.DADetails_formArrays.push(this.createArray('Details Of DA'));

      } else {
        this.DADetails = false;
        this.DADetails_formArrays.clear();
      }

    }

    if (type == 'detailsOfOther_Expense') {
      if (e['Id'] == 'Yes') {
        this.Other_ExpenseDetails = true;
        this.Other_ExpenseDetails_formArrays.push(this.createArray('Other Expense'));

      } else {
        this.Other_ExpenseDetails = false;
        this.Other_ExpenseDetails_formArrays.clear();
      }

    }
  }


  GetFair(e: any = [], index) {

    if (e[0] != '' && e[0] != undefined) {
      e = e[0].Id;
    } else {
      e = e.Id;
      this.ShowDistance = true;
    }
    this.api.HttpGetType(
      "Ehrms/GetFair?ModeId=" + e
    ).then(
      (result: any) => {
        if (result['status'] == true) {
          this.FairAmount = result.MaxAmount;

          if (this.FairAmount != 0.00 && this.FairAmount != null && this.FairAmount !== 0 && this.ShowDistance) {


            this.show_Distance_For_Index[index] = true;

            const JourneyDetailGroup = this.JourneyDetails_formArrays.at(index) as FormGroup;
            if (JourneyDetailGroup) {
              JourneyDetailGroup.get('JourneyDistance').setValue('');
              JourneyDetailGroup.get('JourneyAmount').setValue('');
              JourneyDetailGroup.get('JourneyDistance').setValidators(Validators.required);
              JourneyDetailGroup.get('JourneyAmount').updateValueAndValidity();
            }

          } else {

            this.show_Distance_For_Index[index] = false;


            const JourneyDetailGroup = this.JourneyDetails_formArrays.at(index) as FormGroup;
            if (JourneyDetailGroup) {
              JourneyDetailGroup.get('JourneyDistance').setValidators(null);
              JourneyDetailGroup.get('JourneyAmount').updateValueAndValidity();
            }

          }

        } else {
          this.FairAmount = 0;
          this.show_Distance_For_Index[index] = false;
        }
      },
      (err) => {
        this.api.Toast("Warning", "Network Error : " + err.name + "(" + err.statusText + ")"
        );
      });


  }

  DistanceAmount(e, i) {

    this.DistanceFair = e.target.value * this.FairAmount;
    const JourneyDetailGroup = this.JourneyDetails_formArrays.at(i) as FormGroup;

    if (JourneyDetailGroup) {
      JourneyDetailGroup.get('JourneyAmount').setValue(this.DistanceFair);
      this.AmountCalculate();
    }

  }



  createArray(Type: string): FormGroup {



    if (Type == 'Details Of Journey' && this.JourneyDetails == true) {

      return this.FormBuilder.group({
        DepartureDate: ['', Validators.required],
        ArrivalDate: ['', Validators.required],
        DepartureTime: ['', Validators.required],
        ArrivalTime: ['', Validators.required],
        DepartureStartPoint: ['', Validators.required],
        ArrivalStartPoint: ['', Validators.required],
        Travelmode: ['', Validators.required],
        JourneyRemark: ['', Validators.required],
        JourneyAmount: ['', Validators.required],
        JourneyDistance: [''],
        JourneyFile: ['', this.url_segment === 'edit_claim' || this.SavedForm ? [] : [Validators.required]],
        // JourneyFile: [''],

        ...(this.url_segment === 'edit_claim' || this.SavedForm ? { id: [''] } : {})

      });
    } else if (Type == 'Details Of Loading' && this.LoadingDetails == true) {
      return this.FormBuilder.group({
        LoadingFromdate: ['', Validators.required],
        LoadingTodate: ['', Validators.required],
        Hotel: ['', Validators.required],
        LoadingRemark: ['', Validators.required],
        LoadingAmount: ['', Validators.required],
        LoadingFile: ['', this.url_segment === 'edit_claim' || this.SavedForm ? [] : [Validators.required]],
        // LoadingFile: [''],

        ...(this.url_segment === 'edit_claim' || this.SavedForm ? { id: [''] } : {})
      });
    } else if (Type == 'Details Of TA' && this.TADetails == true) {


      return this.FormBuilder.group({
        TAFromdate: ['', Validators.required],
        TATodate: ['', Validators.required],
        TARemark: ['', Validators.required],
        TAAmount: ['', Validators.required],

        ...(this.url_segment === 'edit_claim' || this.SavedForm ? { id: [''] } : {})
      });
    } else if (Type == 'Details Of DA' && this.DADetails == true) {
      return this.FormBuilder.group({
        DAFromdate: ['', Validators.required],
        DATodate: ['', Validators.required],
        DARemark: ['', Validators.required],
        DAAmount: ['', Validators.required],

        ...(this.url_segment === 'edit_claim' || this.SavedForm ? { id: [''] } : {})
      });
    } else if (Type == 'Other Expense' && this.Other_ExpenseDetails == true) {
      return this.FormBuilder.group({
        Other_ExpenseFromdate: ['', Validators.required],
        Other_ExpenseTodate: ['', Validators.required],
        Other_ExpenseRemark: ['', Validators.required],
        Other_ExpenseAmount: ['', Validators.required],
        // Other_ExpenseFile: ['',  this.url_segment === 'edit_claim'   || this.SavedForm ? [] : [Validators.required]],
        Other_ExpenseFile: [''],

        ...(this.url_segment === 'edit_claim' || this.SavedForm ? { id: [''] } : {})
      });
    }

  }

  removeArray(index: number, Type: string) {

    var idControl;

    if (Type == 'Details Of Journey') {
      if (this.url_segment == 'edit_claim' || this.SavedFormChecked) {
        idControl = this.JourneyDetails_formArrays.at(index).get('id').value;
      }
      this.JourneyDetails_formArrays.removeAt(index);
    } else if (Type == 'Details Of Loading') {
      if (this.url_segment == 'edit_claim' || this.SavedFormChecked) {
        idControl = this.LoadingDetails_formArrays.at(index).get('id').value;
      }

      this.LoadingDetails_formArrays.removeAt(index);
    } else if (Type == 'Details Of TA') {
      if (this.url_segment == 'edit_claim' || this.SavedFormChecked) {
        idControl = this.TADetails_formArrays.at(index).get('id').value;
      }

      this.TADetails_formArrays.removeAt(index);
    } else if (Type == 'Details Of DA') {
      if (this.url_segment == 'edit_claim' || this.SavedFormChecked) {
        idControl = this.DADetails_formArrays.at(index).get('id').value;
      }

      this.DADetails_formArrays.removeAt(index);
    } else if (Type == 'Other Expense' || this.SavedFormChecked) {
      if (this.url_segment == 'edit_claim') {
        idControl = this.Other_ExpenseDetails_formArrays.at(index).get('id').value;
      }

      this.Other_ExpenseDetails_formArrays.removeAt(index);
    }

    this.AmountCalculate();

    if (this.url_segment == 'edit_claim' || this.SavedFormChecked) {

      this.api.HttpGetType(
        "TravelRequest/RemoveIndex?Remove_Index=" + idControl
      ).then(
        (result: any) => {
          if (result['status'] == true) {
            this.api.Toast("Success", result['msg']);

          } else {
            this.api.Toast("Warning", result['msg']);
          }
        },
        (err) => {
          this.api.Toast(
            "Warning", "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        });
    }

  }



  get FC() {
    return this.sendClaimRequest.controls;
  }

  get JourneyDetails_formArrays() {
    return this.sendClaimRequest.get('JourneyDetails_formArrays') as FormArray;
  }

  get LoadingDetails_formArrays() {
    return this.sendClaimRequest.get('LoadingDetails_formArrays') as FormArray;
  }

  get TADetails_formArrays() {
    return this.sendClaimRequest.get('TADetails_formArrays') as FormArray;
  }

  get DADetails_formArrays() {
    return this.sendClaimRequest.get('DADetails_formArrays') as FormArray;
  }

  get Other_ExpenseDetails_formArrays() {
    return this.sendClaimRequest.get('Other_ExpenseDetails_formArrays') as FormArray;
  }


  getAllowance(type: string) {

    if (type == 'TA') {
      this.TravelAllowence = 0;
      const TADetailsLength = this.TADetails_formArrays.length;

      for (let i = 0; i < TADetailsLength; i++) {
        const TADetailGroup = this.TADetails_formArrays.at(i) as FormGroup;

        if (TADetailGroup) {

          TADetailGroup.get('TAFromdate').valueChanges.subscribe((newDate) => {

            this.SelectedTA_Date1 = newDate;
            if (this.SelectedTA_Date1 && this.SelectedTA_Date2) {
              this.daysDifference = this.SelectedTA_Date2.getDate() - this.SelectedTA_Date1.getDate() + 1;
              if (this.daysDifference < 0) {
                this.daysDifference = 0;
              }

              this.TravelAllowence = this.ProfileData.travel_allowance * this.daysDifference;
              TADetailGroup.get('TAAmount').setValue('0');
            }
          });

          TADetailGroup.get('TATodate').valueChanges.subscribe((newDate) => {

            this.SelectedTA_Date2 = newDate;
            if (this.SelectedTA_Date1 && this.SelectedTA_Date2) {
              this.daysDifference = this.SelectedTA_Date2.getDate() - this.SelectedTA_Date1.getDate() + 1;
              if (this.daysDifference < 0) {
                this.daysDifference = 0;
              }

              if (this.ProfileData != '') {

                this.TravelAllowence = this.ProfileData.travel_allowance * this.daysDifference;

                TADetailGroup.get('TAAmount').setValue(this.TravelAllowence);
                this.AmountCalculate();
              } else {
                TADetailGroup.get('TAAmount').setValue(0);
              }

            }
          });

        }
      }
    } else if (type == 'DA') {
      const DADetailsLength = this.DADetails_formArrays.length;
      this.TravelAllowence = 0;
      for (let i = 0; i < DADetailsLength; i++) {
        const DADetailGroup = this.DADetails_formArrays.at(i) as FormGroup;

        if (DADetailGroup) {

          DADetailGroup.get('DAFromdate').valueChanges.subscribe((newDate) => {

            this.SelectedTA_Date1 = newDate;
            if (this.SelectedTA_Date1 && this.SelectedTA_Date2) {
              this.daysDifference = this.SelectedTA_Date2.getDate() - this.SelectedTA_Date1.getDate() + 1;
              if (this.daysDifference < 0) {
                this.daysDifference = 0;
              }

              if (this.ProfileData != '') {
                this.TravelAllowence = this.ProfileData.daily_allowance * this.daysDifference;
                DADetailGroup.get('DAAmount').setValue(this.TravelAllowence);
              } else {
                DADetailGroup.get('DAAmount').setValue(0);

              }
            }
          });

          DADetailGroup.get('DATodate').valueChanges.subscribe((newDate) => {

            this.SelectedTA_Date2 = newDate;
            if (this.SelectedTA_Date1 && this.SelectedTA_Date2) {
              this.daysDifference = this.SelectedTA_Date2.getDate() - this.SelectedTA_Date1.getDate() + 1;
              if (this.daysDifference < 0) {
                this.daysDifference = 0;
              }
              if (this.ProfileData != '') {
                this.TravelAllowence = this.ProfileData.daily_allowance * this.daysDifference;
                DADetailGroup.get('DAAmount').setValue(this.TravelAllowence);
                this.AmountCalculate();
              } else {
                DADetailGroup.get('DAAmount').setValue(0);

              }
            }
          });

        }
      }
    }
  }


  AddMore(Type: string) {

    if (Type == 'Details Of Journey') {
      this.is_Submit = true;


      let LastFormControlValue: any = '';
      let IndexValue = 0;

      if (this.JourneyDetails_formArrays.invalid) {
        return;
      } else {



        const journeyDetailsLength = this.JourneyDetails_formArrays.length;
        for (let i = 0; i < journeyDetailsLength; i++) {
          const JourneyDetailGroup = this.JourneyDetails_formArrays.at(i) as FormGroup;

          if (JourneyDetailGroup) {
            const selectedDate1 = JourneyDetailGroup.value['DepartureDate'];
            const selectedDate2 = JourneyDetailGroup.value['ArrivalDate'];
            if (selectedDate2 < selectedDate1) {

              JourneyDetailGroup.get('ArrivalDate').setErrors({ toDateInvalid: true });
              return;
            } else {
              JourneyDetailGroup.get('ArrivalDate').setErrors(null);
            }
          }

          LastFormControlValue = this.JourneyDetails_formArrays.at(i).value;
          IndexValue = i + 1;

        }
        if (this.fileError) {
          return;
        } else {
          this.JourneyDetails_formArrays.push(this.createArray('Details Of Journey'));
          this.JourneyDetails_formArrays.at(IndexValue).get('DepartureStartPoint').setValue(LastFormControlValue.ArrivalStartPoint);
          this.JourneyDetails_formArrays.at(IndexValue).get('DepartureDate').setValue(LastFormControlValue.ArrivalDate);
        }


      }
    } else {
      this.is_Submit = false;
    }


    if (Type == 'Details Of Loading') {
      this.is_Submit = true;

      if (this.LoadingDetails_formArrays.invalid) {
        return;
      } else {
        const loadingDetailsLength = this.LoadingDetails_formArrays.length;

        for (let i = 0; i < loadingDetailsLength; i++) {
          const LoadingDetailGroup = this.LoadingDetails_formArrays.at(i) as FormGroup;

          if (LoadingDetailGroup) {
            const selectedDate1 = LoadingDetailGroup.value['LoadingFromdate'];
            const selectedDate2 = LoadingDetailGroup.value['LoadingTodate'];

            if (selectedDate2 < selectedDate1) {
              LoadingDetailGroup.get('LoadingTodate').setErrors({ toDateInvalid: true });
              return;
            } else {
              LoadingDetailGroup.get('LoadingTodate').setErrors(null);
            }

          }

        }

        if (this.fileError) {
          return
        } else {
          this.LoadingDetails_formArrays.push(this.createArray('Details Of Loading'));
        }
      }
    } else {
      this.is_Submit = false;
    }

    if (Type == 'Details Of TA') {
      this.is_Submit = true;

      if (this.TADetails_formArrays.invalid) {
        return;
      } else {

        const TADetailsLength = this.TADetails_formArrays.length;

        for (let i = 0; i < TADetailsLength; i++) {
          const TADetailGroup = this.TADetails_formArrays.at(i) as FormGroup;

          if (TADetailGroup) {
            const selectedDate1 = TADetailGroup.value['TAFromdate'];
            const selectedDate2 = TADetailGroup.value['TATodate'];

            if (selectedDate2 < selectedDate1) {
              TADetailGroup.get('TATodate').setErrors({ toDateInvalid: true });
              return;
            } else {
              TADetailGroup.get('TATodate').setErrors(null);
            }

          }

        }


        this.TADetails_formArrays.push(this.createArray('Details Of TA'));

      }

    } else {
      this.is_Submit = false;
    }

    if (Type == 'Details Of DA') {
      this.is_Submit = true;

      if (this.DADetails_formArrays.invalid) {
        return;
      } else {

        const DADetailsLength = this.DADetails_formArrays.length;

        for (let i = 0; i < DADetailsLength; i++) {
          const DADetailGroup = this.DADetails_formArrays.at(i) as FormGroup;

          if (DADetailGroup) {
            const selectedDate1 = DADetailGroup.value['DAFromdate'];
            const selectedDate2 = DADetailGroup.value['DATodate'];

            if (selectedDate2 < selectedDate1) {
              DADetailGroup.get('DATodate').setErrors({ toDateInvalid: true });
              return;
            } else {
              DADetailGroup.get('DATodate').setErrors(null);
            }
          }

        }


        this.DADetails_formArrays.push(this.createArray('Details Of DA'));
      }

    } else {
      this.is_Submit = false;
    }

    if (Type == 'Other Expense') {
      this.is_Submit = true;

      if (this.Other_ExpenseDetails_formArrays.invalid) {
        return;
      } else {
        const Other_ExpenseDetailsLength = this.Other_ExpenseDetails_formArrays.length;

        for (let i = 0; i < Other_ExpenseDetailsLength; i++) {
          const Other_ExpenseDetailGroup = this.Other_ExpenseDetails_formArrays.at(i) as FormGroup;

          if (Other_ExpenseDetailGroup) {
            const selectedDate1 = Other_ExpenseDetailGroup.value['Other_ExpenseFromdate'];
            const selectedDate2 = Other_ExpenseDetailGroup.value['Other_ExpenseTodate'];

            if (selectedDate2 < selectedDate1) {
              Other_ExpenseDetailGroup.get('Other_ExpenseTodate').setErrors({ toDateInvalid: true });
              return;
            } else {
              Other_ExpenseDetailGroup.get('Other_ExpenseTodate').setErrors(null);
            }
          }
        }

        if (this.fileError) {
          return
        } else {
          this.Other_ExpenseDetails_formArrays.push(this.createArray('Other Expense'));
        }
      }

    } else {
      this.is_Submit = false;
    }

  }



  ngOnInit() {

    this.claimId = this.router.url.split('/')[3];
    this.getTravelData();


    if (this.url_segment == 'edit_claim') {
      this.ViewClaims(this.claimId);
      this.GetTravelMaster();
      this.AmountCalculate();
      this.GetProfileData();
    } else {
      this.checkSaved();
      this.selecteddetailsOfOther_Expense = [{ Id: "No", Name: "No" }];
      this.selecteddetailsOfTA = [{ Id: "No", Name: "No" }];
      this.selecteddetailsOfDA = [{ Id: "No", Name: "No" }];
      this.selecteddetailsOfLoading = [{ Id: "No", Name: "No" }];
      this.selecteddetailsOfJourney = [{ Id: "No", Name: "No" }];
    }

  }


  GetProfileData() {

    this.api
      .HttpGetType("TravelRequest/Get_TA_DA?ProfileId=" + this.TravelData[0].ProfileId)

      .then((result: any) => {
        if (result["status"] == true) {
          this.ProfileData = result["data"];

        } else {
          this.ProfileData = [];
        }
      });
  }

  goBack(): void {
    this.router.navigateByUrl("travel_request/employee");
    // this.Location.back();
  }

  checkSaved() {

    this.api.HttpGetType(
      "TravelRequest/checkSaved?Claim_ID=" + this.claimId
    ).then(
      (result: any) => {
        if (result['status'] == true) {
          if (result.data.length > 0) {
            if (confirm("Do You Want to Edit Previous Form!") == true) {
              this.SavedFormChecked = true;
              this.ViewClaims(this.claimId);

              this.GetTravelMaster();
              this.AmountCalculate();
              this.GetProfileData();
            } else {
              this.SavedFormChecked = false;
              this.deletedata = 'DeleteData';
            }
          } else {

          }

        }
      },
      (err) => {
        this.api.Toast(
          "Warning", "Network Error : " + err.name + "(" + err.statusText + ")"
        );
      }
    )
  }


  parseDateString(dateString: string): Date {
    const [day, month, year] = dateString.split('-');
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  getTravelData() {
    this.api.HttpGetType(
      "TravelRequest/getTravelData?Claim_ID=" + this.claimId
    ).then(
      (result: any) => {
        if (result['status'] == true) {

          this.TravelData = result.data;

          this.minDate = this.parseDateString(this.TravelData ? this.TravelData[0].StartDate : '');
          this.maxDate = this.parseDateString(this.TravelData ? this.TravelData[0].EndDate : '');
          this.GetProfileData();

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


  onFileChange(event: any, type: string, index: number) {
    this.fileError = '';

    if (!this.fileStorage) {
      this.fileStorage = {};
    }

    if (!this.fileStorage[type]) {
      this.fileStorage[type] = {};
    }

    if (!this.fileStorage[type][index]) {
      this.fileStorage[type][index] = [];
    }

    this.fileStorage[type][index] = [];

    if (event.target.files.length > 0) {
      const files = Array.from(event.target.files) as File[];
      const validFiles = [];
      for (let file of files) {
        const extension = file.name.split('.').pop().toLowerCase();
        if (!this.validImageExtensions.includes(extension)) {
          this.fileError = `Invalid file type for ${file.name}. Please upload an image with a valid extension (jpg, jpeg, png, gif).`;
          return;
        }
        validFiles.push(file);
      }


      if (validFiles.length > 5) {

        if (type == 'Other_ExpenseFile') {
          this.Other_ExpenseDetails_formArrays.at(index).get(type).setValue('');
        }
        if (type == 'JourneyFile') {
          this.JourneyDetails_formArrays.at(index).get(type).setValue('');
        }
        if (type == 'LoadingFile') {
          this.LoadingDetails_formArrays.at(index).get(type).setValue('');
        }
        // this.sendClaimRequest

        // this.fileError = 'You can only upload up to 5 images at a time.';

        return;
      }

      this.fileStorage[type][index] = validFiles;






    }
  }


  ViewClaims(claimId: any) {

    this.selecteddetailsOfOther_Expense = [{ Id: "No", Name: "No" }];
    this.selecteddetailsOfTA = [{ Id: "No", Name: "No" }];
    this.selecteddetailsOfDA = [{ Id: "No", Name: "No" }];
    this.selecteddetailsOfLoading = [{ Id: "No", Name: "No" }];
    this.selecteddetailsOfJourney = [{ Id: "No", Name: "No" }];

    const formdata = new FormData();
    this.claimId = claimId;
    formdata.append('claimId', this.claimId);
    formdata.append('UserId', this.api.GetUserData("Id"));
    formdata.append('UserType', this.api.GetUserData("Type"));

    this.api.HttpPostType('TravelRequest/edit_claims', formdata)
      .then(
        (result: any) => {
          if (result['status'] == true) {
            this.ClaimDataAr = result.data;

            this.ClaimDataAr.forEach(element => {

              if (element.expense_type == 1) {
                this.selecteddetailsOfJourney = [{ Id: "Yes", Name: "Yes" }];
                this.selectedTravelMode = element.travel_mode;
                this.JourneyAmountTotal += parseInt(element.amount);
                this.JourneyDetails = true;
                this.JourneyDetails1 = false;
                this.SavedForm = true;

                this.JourneyDetails_formArrays.push(this.createArray('Details Of Journey'));

                this.sendClaimRequest.patchValue({
                  JourneyDetails_formArrays: this.ClaimDataAr
                    .filter((Journey_Details) => Journey_Details.expense_type == 1)
                    .map((Journey_Details, index) => {
                      if (Journey_Details.distance != '') {
                        this.showDistanceForIndex[index] = true;
                      } else {
                        this.showDistanceForIndex[index] = false;
                      }
                      this.GetFair(element.travel_mode, index);

                      return {
                        DepartureDate: Journey_Details.from_date,
                        ArrivalDate: Journey_Details.to_date,
                        DepartureTime: Journey_Details.from_time,
                        ArrivalTime: Journey_Details.to_time,
                        DepartureStartPoint: Journey_Details.hotel,
                        ArrivalStartPoint: Journey_Details.start_point,
                        Travelmode: Journey_Details.travel_mode,
                        JourneyRemark: Journey_Details.remarks,
                        JourneyAmount: Journey_Details.amount,
                        JourneyDistance: Journey_Details.distance,
                        id: Journey_Details.id,
                      };
                    })

                });


              } else {
                this.SavedForm = false;
              }

              if (element.expense_type == 2) {
                this.selecteddetailsOfLoading = [{ Id: "Yes", Name: "Yes" }];
                this.LoadingAmountTotal += parseInt(element.amount);
                this.LoadingDetails = true;
                this.LoadingDetails1 = false;
                this.SavedForm = true;
                this.LoadingDetails_formArrays.push(this.createArray('Details Of Loading'));

                this.sendClaimRequest.patchValue({
                  LoadingDetails_formArrays: this.ClaimDataAr
                    .filter((Loading_Details) => Loading_Details.expense_type == 2)
                    .map((Loading_Details) => {
                      return {
                        LoadingFromdate: Loading_Details.from_date,
                        LoadingTodate: Loading_Details.to_date,
                        LoadingAmount: Loading_Details.amount,
                        LoadingRemark: Loading_Details.remarks,
                        Hotel: Loading_Details.hotel,
                        id: Loading_Details.id,
                      };
                    })
                });


              } else {
                this.SavedForm = false;
              }

              if (element.expense_type == 3) {

                this.selecteddetailsOfTA = [{ Id: "Yes", Name: "Yes" }];
                this.TAAmountTotal += parseInt(element.amount);
                this.TADetails = true;
                this.TADetails1 = false;
                this.SavedForm = true;

                this.TADetails_formArrays.push(this.createArray('Details Of TA'));


                this.sendClaimRequest.patchValue({
                  TADetails_formArrays: this.ClaimDataAr
                    .filter((TA_Details) => TA_Details.expense_type == 3)
                    .map((TA_Details) => {
                      return {
                        TAFromdate: TA_Details.from_date,
                        TATodate: TA_Details.to_date,
                        TAAmount: TA_Details.amount,
                        TARemark: TA_Details.remarks,
                        id: TA_Details.id,
                      };
                    })
                });

              } else {
                this.SavedForm = false;
              }

              if (element.expense_type == 4) {
                this.selecteddetailsOfDA = [{ Id: "Yes", Name: "Yes" }];
                this.DAAmountTotal += parseInt(element.amount);
                this.DADetails = true;
                this.DADetails1 = false;
                this.SavedForm = true;

                this.DADetails_formArrays.push(this.createArray('Details Of DA'));


                this.sendClaimRequest.patchValue({
                  DADetails_formArrays: this.ClaimDataAr
                    .filter((DA_Details) => DA_Details.expense_type == 4)
                    .map((DA_Details) => {
                      return {
                        DAFromdate: DA_Details.from_date,
                        DATodate: DA_Details.to_date,
                        DAAmount: DA_Details.amount,
                        DARemark: DA_Details.remarks,
                        id: DA_Details.id,
                      };
                    })
                });

              } else {
                this.SavedForm = false;
              }
              if (element.expense_type == 5) {
                this.selecteddetailsOfOther_Expense = [{ Id: "Yes", Name: "Yes" }];
                this.OtherAmountTotal += parseInt(element.amount);
                this.Other_ExpenseDetails = true;
                this.Other_ExpenseDetails1 = false;
                this.SavedForm = true;

                this.Other_ExpenseDetails_formArrays.push(this.createArray('Other Expense'));

                this.sendClaimRequest.patchValue({
                  Other_ExpenseDetails_formArrays: this.ClaimDataAr
                    .filter((Other_Expense) => Other_Expense.expense_type == 5)
                    .map((Other_Expense) => {
                      return {
                        Other_ExpenseFromdate: Other_Expense.from_date,
                        Other_ExpenseTodate: Other_Expense.to_date,
                        Other_ExpenseAmount: Other_Expense.amount,
                        Other_ExpenseRemark: Other_Expense.remarks,
                        id: Other_Expense.id,
                      };
                    })
                });

              } else {
                this.SavedForm = false;
              }


              this.TotalAmount = this.JourneyAmountTotal + this.LoadingAmountTotal + this.TAAmountTotal + this.DAAmountTotal + this.OtherAmountTotal;
              this.Balance = this.TotalAmount - this.ClaimDataAr[0].AccountAmount;


            });


          } else {
            this.ClaimDataAr = [];
          }
        },
        (err) => {
          this.api.Toast("Warning", "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        });

  }

  AmountCalculate() {
    const journeyDetailsLength = this.JourneyDetails_formArrays.length;
    this.JourneyAmountTotal = 0;
    for (let i = 0; i < journeyDetailsLength; i++) {
      const JourneyDetailGroup = this.JourneyDetails_formArrays.at(i) as FormGroup;
      if (JourneyDetailGroup) {
        const journeyAmount = JourneyDetailGroup.value['JourneyAmount'];
        if (!isNaN(journeyAmount) && journeyAmount !== null) {
          this.JourneyAmountTotal += parseInt(journeyAmount);
        }

      }
    }


    const loadingDetailsLength = this.LoadingDetails_formArrays.length;
    this.LoadingAmountTotal = 0;
    for (let i = 0; i < loadingDetailsLength; i++) {
      const LoadingDetailGroup = this.LoadingDetails_formArrays.at(i) as FormGroup;
      if (LoadingDetailGroup) {
        const LoadingAmount = LoadingDetailGroup.value['LoadingAmount'];
        if (!isNaN(LoadingAmount) && LoadingAmount !== null) {
          this.LoadingAmountTotal += parseInt(LoadingAmount);
        }
      }
    }

    const TADetailsLength = this.TADetails_formArrays.length;
    this.TAAmountTotal = 0;
    for (let i = 0; i < TADetailsLength; i++) {
      const TADetailGroup = this.TADetails_formArrays.at(i) as FormGroup;
      if (TADetailGroup) {
        const TAAmount = TADetailGroup.value['TAAmount'];
        if (!isNaN(TAAmount) && TAAmount !== null) {
          this.TAAmountTotal += parseInt(TAAmount);
        }
      }
    }

    const DADetailsLength = this.DADetails_formArrays.length;
    this.DAAmountTotal = 0;
    for (let i = 0; i < DADetailsLength; i++) {
      const DADetailGroup = this.DADetails_formArrays.at(i) as FormGroup;
      if (DADetailGroup) {
        const DAAmount = DADetailGroup.value['DAAmount'];
        if (!isNaN(DAAmount) && DAAmount !== null) {
          this.DAAmountTotal += parseInt(DAAmount);
        }
      }
    }

    const Other_ExpenseDetails = this.Other_ExpenseDetails_formArrays.length;
    this.OtherAmountTotal = 0;
    for (let i = 0; i < Other_ExpenseDetails; i++) {
      const Other_ExpenseDetailGroup = this.Other_ExpenseDetails_formArrays.at(i) as FormGroup;
      if (Other_ExpenseDetailGroup) {
        const OtherAmount = Other_ExpenseDetailGroup.value['Other_ExpenseAmount'];

        if (!isNaN(OtherAmount) && OtherAmount !== null) {
          this.OtherAmountTotal += parseInt(OtherAmount);
        }
      }
    }



    const journeyAmount = !isNaN(this.JourneyAmountTotal) ? this.JourneyAmountTotal : 0;
    const loadingAmount = !isNaN(this.LoadingAmountTotal) ? this.LoadingAmountTotal : 0;
    const taAmount = !isNaN(this.TAAmountTotal) ? this.TAAmountTotal : 0;
    const daAmount = !isNaN(this.DAAmountTotal) ? this.DAAmountTotal : 0;
    const otherAmount = !isNaN(this.OtherAmountTotal) ? this.OtherAmountTotal : 0;


    this.TotalAmount = journeyAmount + loadingAmount + taAmount + daAmount + otherAmount;
    this.Balance = this.TotalAmount - this.TravelData[0].Account_Amount;


  }

  claimRequest(type?: string) {


    var FormType = '';
    if (type) {
      if (type === 'saveForm') {
        FormType = type;
      } else {
        FormType = '';
      }
    }


    this.isSubmitted = true;
    this.is_Submit = true;
    const formdata = new FormData();

    this.FormData1 = this.JourneyDetails_formArrays.value;
    this.FormData2 = this.LoadingDetails_formArrays.value;
    this.FormData3 = this.TADetails_formArrays.value;
    this.FormData4 = this.DADetails_formArrays.value;
    this.FormData5 = this.Other_ExpenseDetails_formArrays.value;


    if (this.JourneyDetails == true) {

      if (this.fileStorage) {
        if (this.fileStorage.JourneyFile) {
          Object.keys(this.fileStorage.JourneyFile).forEach((key) => {
            const fileArray = this.fileStorage.JourneyFile[key];
            if (Array.isArray(fileArray)) {
              fileArray.forEach((file: File, index: number) => {
                formdata.append(`JourneyFile[${key}][]`, file, file.name);
              });

            }
          });
        }
      }

      const journeyDetailsLength = this.JourneyDetails_formArrays.length;
      for (let i = 0; i < journeyDetailsLength; i++) {
        const JourneyDetailGroup = this.JourneyDetails_formArrays.at(i) as FormGroup;

        if (JourneyDetailGroup) {
          const selectedDate1 = JourneyDetailGroup.value['DepartureDate'];
          const selectedDate2 = JourneyDetailGroup.value['ArrivalDate'];

          if (selectedDate2 < selectedDate1) {
            JourneyDetailGroup.get('ArrivalDate').setErrors({ toDateInvalid: true });
          } else {
            JourneyDetailGroup.get('ArrivalDate').setErrors(null);
          }
        }

      }

    }

    if (this.LoadingDetails == true) {

      if (this.fileStorage) {
        if (this.fileStorage.LoadingFile) {
          Object.keys(this.fileStorage.LoadingFile).forEach((key) => {
            const fileArray = this.fileStorage.LoadingFile[key];
            if (Array.isArray(fileArray)) {
              fileArray.forEach((file: File, index: number) => {
                formdata.append(`LoadingFile[${key}][]`, file, file.name);
              });
            }
          });
        }
      }
      const loadingDetailsLength = this.LoadingDetails_formArrays.length;
      for (let i = 0; i < loadingDetailsLength; i++) {
        const LoadingDetailGroup = this.LoadingDetails_formArrays.at(i) as FormGroup;

        if (LoadingDetailGroup) {
          const selectedDate1 = LoadingDetailGroup.value['LoadingFromdate'];
          const selectedDate2 = LoadingDetailGroup.value['LoadingTodate'];

          if (selectedDate2 < selectedDate1) {
            LoadingDetailGroup.get('LoadingTodate').setErrors({ toDateInvalid: true });
          } else {
            LoadingDetailGroup.get('LoadingTodate').setErrors(null);
          }
        }
      }

    }

    if (this.TADetails == true) {
      const TADetailsLength = this.TADetails_formArrays.length;

      for (let i = 0; i < TADetailsLength; i++) {
        const TADetailGroup = this.TADetails_formArrays.at(i) as FormGroup;

        if (TADetailGroup) {
          const selectedDate1 = TADetailGroup.value['TAFromdate'];
          const selectedDate2 = TADetailGroup.value['TATodate'];

          if (selectedDate2 < selectedDate1) {
            TADetailGroup.get('TATodate').setErrors({ toDateInvalid: true });
          } else {
            TADetailGroup.get('TATodate').setErrors(null);
          }

        }

      }
    }

    if (this.DADetails == true) {
      const DADetailsLength = this.DADetails_formArrays.length;

      for (let i = 0; i < DADetailsLength; i++) {
        const DADetailGroup = this.DADetails_formArrays.at(i) as FormGroup;

        if (DADetailGroup) {
          const selectedDate1 = DADetailGroup.value['DAFromdate'];
          const selectedDate2 = DADetailGroup.value['DATodate'];

          if (selectedDate2 < selectedDate1) {
            DADetailGroup.get('DATodate').setErrors({ toDateInvalid: true });
          } else {
            DADetailGroup.get('DATodate').setErrors(null);
          }
        }

      }
    }

    if (this.Other_ExpenseDetails == true) {

      if (this.fileStorage) {
        if (this.fileStorage.Other_ExpenseFile) {
          Object.keys(this.fileStorage.Other_ExpenseFile).forEach((key) => {
            const fileArray = this.fileStorage.Other_ExpenseFile[key];
            if (Array.isArray(fileArray)) {
              fileArray.forEach((file: File, index: number) => {
                formdata.append(`Other_ExpenseFile[${key}][]`, file, file.name);
              });
            }

          });

        }
      }

      const Other_ExpenseDetailsLength = this.Other_ExpenseDetails_formArrays.length;

      for (let i = 0; i < Other_ExpenseDetailsLength; i++) {
        const Other_ExpenseDetailGroup = this.Other_ExpenseDetails_formArrays.at(i) as FormGroup;

        if (Other_ExpenseDetailGroup) {
          const selectedDate1 = Other_ExpenseDetailGroup.value['Other_ExpenseFromdate'];
          const selectedDate2 = Other_ExpenseDetailGroup.value['Other_ExpenseTodate'];

          if (selectedDate2 < selectedDate1) {
            Other_ExpenseDetailGroup.get('Other_ExpenseTodate').setErrors({ toDateInvalid: true });
          } else {
            Other_ExpenseDetailGroup.get('Other_ExpenseTodate').setErrors(null);
          }
        }
      }


    }

    if (this.sendClaimRequest.invalid) {
      console.log(this.sendClaimRequest.controls);
      return
    } else {
      formdata.append('FormData1', JSON.stringify(this.FormData1));
      formdata.append('FormData2', JSON.stringify(this.FormData2));
      formdata.append('FormData3', JSON.stringify(this.FormData3));
      formdata.append('FormData4', JSON.stringify(this.FormData4));
      formdata.append('FormData5', JSON.stringify(this.FormData5));
      formdata.append('TravelRequestId', this.claimId);
      formdata.append('FormType', FormType);
      formdata.append('DeleteData', this.deletedata);
      formdata.append('UserId', this.api.GetUserData("Id"));
      formdata.append('UserType', this.api.GetUserData("Type"));

      this.api.HttpPostType(
        "TravelRequest/SaveclaimRequest", formdata
      )
        .then(
          (result: any) => {
            if (result['status'] == true) {
              this.api.Toast("Success", result['msg']);
              this.goBack();

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
  }



}
