import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ApiService } from '../../providers/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';



@Component({
  selector: 'app-travelrequest-details',
  templateUrl: './travelrequest-details.component.html',
  styleUrls: ['./travelrequest-details.component.css']
})
export class TravelrequestDetailsComponent implements OnInit {
  Id: any;
  dataAr: any[];
  DataAr: any[];
  EmployeeData: any[];
  employees_to_travelwith: string;
  requestId: any;
  city_end_point: any;
  city_start_point: any;
  selected_guesthouse: any;
  state_end_point: any;
  state_start_point: any;
  email_to_contact: string;
  Requester_Id: any;
  Images: any[];
  hotelImages: any[];
  travelImages: any[];
  urlSegment: string;
  DetailType: any;

  Claim_status: any;
  ManagerRemark: any;
  TravelRemark: any;
  AccountRemark: any;
  accountAmount: any;
  travelAmount: any;
  managerAmount: any;
  showRaiseClaim = false;
  Account_Amount: any;
  AccountApprovedAmount: any;

  JourneyAmountTotal: number = 0;
  LoadingAmountTotal: number = 0;
  TAAmountTotal: number = 0;
  DAAmountTotal: number = 0;
  OtherAmountTotal: number = 0;
  TotalAmount: number = 0;
  Balance: number = 0;
  hodAmount: any;
  HODRemark: any;
  claimId: any;
  ClaimDataAr: any[];
  Claimrequest_Type = new Set();
  selectedImages: string[] = [];
  Claim_data: any;
  claimType: any;
  url_segment: any;
  ClaimUpdateForm: FormGroup;
  ClaimForm: FormGroup;
  claimSubmit = false;
  Status: any;



  JourneyAmountTotal_1: number = 0;
  LoadingAmountTotal_1: number = 0;
  TAAmountTotal_1: number = 0;
  DAAmountTotal_1: number = 0;
  OtherAmountTotal_1: number = 0;
  TotalAmount_1: number = 0;
  Balance_1: number = 0;


  constructor(
    private api: ApiService,
    public Router: Router,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TravelrequestDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    if (this.data) {

      this.Id = this.data.Id;
      this.DetailType = this.data.Type;
      this.Status = this.data.Status;
    } else {
      this.Id = null;
      this.DetailType = null;
    }

    this.ClaimUpdateForm = this.fb.group({});
    this.ClaimForm = this.fb.group({
      Remark: ["", Validators.required],
    });
    this.url_segment = this.Router.url.split('/')[2];
  }

  ngOnInit() {

    this.GetDetails();
    this.GetEmployeedata();

    if (this.DetailType == 'Claim') {
      this.ViewClaims(this.Id);
    }
  }
  get FormClaim() {
    return this.ClaimForm.controls;
  }

  amountcalculate(value: any, id: string) {

    this.JourneyAmountTotal_1 = 0;
    this.LoadingAmountTotal_1 = 0;
    this.TAAmountTotal_1 = 0;
    this.DAAmountTotal_1 = 0;
    this.OtherAmountTotal_1 = 0;
    this.TotalAmount_1 = 0;
    this.Balance_1 = 0;

    this.ClaimDataAr.forEach(row => {

      if (row.ClaimStatus == 1) {
        amount = row.amount;

      }
      if (row.ClaimStatus == 2) {
        amount = row.managerAmount;
      }
      if (row.ClaimStatus == 3) {
        amount = row.hodAmount;
      }
      if (row.ClaimStatus == 4) {
        amount = row.travelAmount;
      }

      const val = row.id + '_journeyAmount';
      const AmountZoneControl = this.ClaimUpdateForm.get(val).value;

      var amount = AmountZoneControl;

      const avramount = parseFloat(amount);

      if (row.expense_type === '1') {
        this.JourneyAmountTotal_1 += avramount;
      } else if (row.expense_type === '2') {
        this.LoadingAmountTotal_1 += avramount;
      } else if (row.expense_type === '3') {
        this.TAAmountTotal_1 += avramount;
      } else if (row.expense_type === '4') {
        this.DAAmountTotal_1 += avramount;
      } else if (row.expense_type === '5') {
        this.OtherAmountTotal_1 += avramount;
      }

    });

    this.TotalAmount_1 = this.JourneyAmountTotal_1 + this.LoadingAmountTotal_1 + this.TAAmountTotal_1 + this.DAAmountTotal_1 + this.OtherAmountTotal_1;

    this.Balance_1 = this.TotalAmount_1 - this.ClaimDataAr[0].account_amount;

  }

  createForm(menuItems: any[], formGroup: FormGroup) {
    menuItems.forEach((item) => {

      const AmountZoneControl = new FormControl('', Validators.required);
      formGroup.addControl(`${item.id}_journeyAmount`, AmountZoneControl);
      if (this.url_segment == 'claimManager') {
        AmountZoneControl.setValue(item.amount);
      } if (this.url_segment == 'claimHOD') {
        AmountZoneControl.setValue(item.managerAmount);
      } else if (this.url_segment == 'claimTravel') {
        AmountZoneControl.setValue(item.hodAmount);
      } else if (this.url_segment == 'claimAccount') {
        AmountZoneControl.setValue(item.travelAmount);
      }
    });
  }


  claim_Form(): void {


    var fields = this.ClaimUpdateForm.value;
    var Remark = this.ClaimForm.value;
    this.Claim_data = this.Id;


    this.claimSubmit = true;
    if (this.ClaimUpdateForm.invalid || this.ClaimForm.controls.Remark.invalid) {

      return;
    } else {

      const formdata = new FormData();
      formdata.append('Amount', JSON.stringify(fields));
      formdata.append('Remark', JSON.stringify(Remark));
      formdata.append('Url_segment', this.url_segment);
      formdata.append('User_Name', this.api.GetUserData('Name'));
      formdata.append('User_Id', this.api.GetUserData('Id'));
      formdata.append('User_Type', this.api.GetUserData('Type'));
      formdata.append('User_code', this.api.GetUserData('Code'));
      formdata.append('Claim_id', this.Claim_data);
      formdata.append('Claim_type', this.Status);


      this.api.HttpPostType('TravelRequest/claim_status', formdata)
        .then(
          (result: any) => {
            if (result['status'] == true) {
              this.api.Toast("Success", result['msg']);
              this.CloseModel();

            } else {
              this.api.Toast("Warning", result['msg']);
            }
          },
          (err) => {
            this.api.Toast("Warning", "Network Error : " + err.name + "(" + err.statusText + ")"
            );
          });
    }
  }

  CloseModel() {
    this.dialogRef.close();
  }


  GetDetails() {

    this.api.IsLoading();
    this.api.HttpGetType(
      "TravelRequest/view_request?User_Id=" + this.api.GetUserData("Id") + "&User_Type=" +
      this.api.GetUserType() + "&Update_ID=" + this.Id
    ).then(
      (result: any) => {
        if (result['status'] == true) {
          this.dataAr = result.data;
          this.requestId = result.data[0].travel_request_id;
          this.city_end_point = result.city_end_point[0].Name;
          this.city_start_point = result.city_start_point[0].Name;
          this.selected_guesthouse = result.selected_guesthouse[0].Name;
          this.state_end_point = result.state_end_point[0].Name;
          this.state_start_point = result.state_start_point[0].Name;
          this.employees_to_travelwith = result.employees_to_travelwith.map(employee => employee.Name).join(', ');
          this.email_to_contact = result.email_to_contact.map(employee => employee.Name).join(', ');

          this.Images = result.data[0].Documents;
          if (result.data[0].hotelDocument != '' || result.data[0].hotelDocument != null) {
            this.hotelImages = result.data[0].hotelDocument;
          } else {
            this.hotelImages = [];
          }

          this.travelImages = result.data[0].travelDocument;


        } else {
          this.api.HideLoading();

          this.dataAr = [];
        }
        this.api.HideLoading();

      }
    )
  }

  GetEmployeedata() {

    this.api.HttpGetType(
      "TravelRequest/getemployeedata?Update_ID=" + this.Id
    ).then(
      (result: any) => {
        if (result['status'] == true) {
          this.EmployeeData = result.data;

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

  ViewDocument(url) {
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }



  ViewClaimDocs(img: string) {

    this.selectedImages = [];
    const imageUrls = img.split(',');
    this.selectedImages.push(...imageUrls);

  }


  ViewClaims(claimId: any) {

    const formdata = new FormData();
    this.claimId = claimId;
    formdata.append('claimId', this.claimId);
    formdata.append('User_Id', this.api.GetUserData('Id'));
    formdata.append('User_Type', this.api.GetUserData('Type'));
    this.api.HttpPostType('TravelRequest/view_claims', formdata)
      .then(
        (result: any) => {
          if (result['status'] == true) {

            this.ClaimDataAr = result.data;

            this.accountAmount = this.ClaimDataAr[0].accountAmount;
            this.travelAmount = this.ClaimDataAr[0].travelAmount;
            this.managerAmount = this.ClaimDataAr[0].managerAmount;
            this.hodAmount = this.ClaimDataAr[0].hodAmount;

            this.ManagerRemark = result.approved_data.manager_remark;
            this.HODRemark = result.approved_data.HOD_remark;
            this.TravelRemark = result.approved_data.travelmanager_remark;
            this.AccountRemark = result.approved_data.accountmanager_remark;
            this.Claim_status = result.approved_data.ClaimStatus;

            this.JourneyAmountTotal = 0;
            this.LoadingAmountTotal = 0;
            this.TAAmountTotal = 0;
            this.DAAmountTotal = 0;
            this.OtherAmountTotal = 0;
            this.TotalAmount = 0;
            this.Balance = 0;

            this.ClaimDataAr.forEach(row => {
              if (row.expense_type) {
                this.Claimrequest_Type.add(row.expense_type);
              }


              if (row.expense_type == '1') {

                if (row.ClaimStatus == 0 || row.ClaimStatus == 5 || row.ClaimStatus == 9) {
                  this.JourneyAmountTotal += parseInt(row.amount);
                } else if (row.ClaimStatus == 1 || row.ClaimStatus == 6 || row.ClaimStatus == 10) {
                  this.JourneyAmountTotal += parseInt(row.managerAmount);
                } else if (row.ClaimStatus == 2 || row.ClaimStatus == 7 || row.ClaimStatus == 11) {
                  this.JourneyAmountTotal += parseInt(row.hodAmount);
                } else if (row.ClaimStatus == 3 || row.ClaimStatus == 8 || row.ClaimStatus == 12) {
                  this.JourneyAmountTotal += parseInt(row.travelAmount);
                } else if (row.ClaimStatus == 4) {
                  this.JourneyAmountTotal += parseInt(row.accountAmount);
                }

              } else if (row.expense_type == '2') {

                if (row.ClaimStatus == 0 || row.ClaimStatus == 5 || row.ClaimStatus == 9) {
                  this.LoadingAmountTotal += parseInt(row.amount);
                } else if (row.ClaimStatus == 1 || row.ClaimStatus == 6 || row.ClaimStatus == 10) {
                  this.LoadingAmountTotal += parseInt(row.managerAmount);
                } else if (row.ClaimStatus == 2 || row.ClaimStatus == 7 || row.ClaimStatus == 11) {
                  this.LoadingAmountTotal += parseInt(row.hodAmount);
                } else if (row.ClaimStatus == 3 || row.ClaimStatus == 8 || row.ClaimStatus == 12) {
                  this.LoadingAmountTotal += parseInt(row.travelAmount);
                } else if (row.ClaimStatus == 4) {
                  this.LoadingAmountTotal += parseInt(row.accountAmount);
                }

              } else if (row.expense_type == '3') {

                if (row.ClaimStatus == 0 || row.ClaimStatus == 5 || row.ClaimStatus == 9) {
                  this.TAAmountTotal += parseInt(row.amount);
                } else if (row.ClaimStatus == 1 || row.ClaimStatus == 6 || row.ClaimStatus == 10) {
                  this.TAAmountTotal += parseInt(row.managerAmount);
                } else if (row.ClaimStatus == 2 || row.ClaimStatus == 7 || row.ClaimStatus == 11) {
                  this.TAAmountTotal += parseInt(row.hodAmount);
                } else if (row.ClaimStatus == 3 || row.ClaimStatus == 8 || row.ClaimStatus == 12) {
                  this.TAAmountTotal += parseInt(row.travelAmount);
                } else if (row.ClaimStatus == 4) {
                  this.TAAmountTotal += parseInt(row.accountAmount);
                }

              } else if (row.expense_type == '4') {

                if (row.ClaimStatus == 0 || row.ClaimStatus == 5 || row.ClaimStatus == 9) {
                  this.DAAmountTotal += parseInt(row.amount);
                } else if (row.ClaimStatus == 1 || row.ClaimStatus == 6 || row.ClaimStatus == 10) {
                  this.DAAmountTotal += parseInt(row.managerAmount);
                } else if (row.ClaimStatus == 2 || row.ClaimStatus == 7 || row.ClaimStatus == 11) {
                  this.DAAmountTotal += parseInt(row.hodAmount);
                } else if (row.ClaimStatus == 3 || row.ClaimStatus == 8 || row.ClaimStatus == 12) {
                  this.DAAmountTotal += parseInt(row.travelAmount);
                } else if (row.ClaimStatus == 4) {
                  this.DAAmountTotal += parseInt(row.accountAmount);
                }

              } else if (row.expense_type == '5') {

                if (row.ClaimStatus == 0 || row.ClaimStatus == 5 || row.ClaimStatus == 9) {
                  this.OtherAmountTotal += parseInt(row.amount);
                } else if (row.ClaimStatus == 1 || row.ClaimStatus == 6 || row.ClaimStatus == 10) {
                  this.OtherAmountTotal += parseInt(row.managerAmount);
                } else if (row.ClaimStatus == 2 || row.ClaimStatus == 7 || row.ClaimStatus == 11) {
                  this.OtherAmountTotal += parseInt(row.hodAmount);
                } else if (row.ClaimStatus == 3 || row.ClaimStatus == 8 || row.ClaimStatus == 12) {
                  this.OtherAmountTotal += parseInt(row.travelAmount);
                } else if (row.ClaimStatus == 4) {
                  this.OtherAmountTotal += parseInt(row.accountAmount);
                }
              }

              this.TotalAmount = this.JourneyAmountTotal + this.LoadingAmountTotal + this.TAAmountTotal + this.DAAmountTotal + this.OtherAmountTotal;
              this.Balance = this.TotalAmount - this.ClaimDataAr[0].account_amount;
            });


            if (this.Status == 'Approve') {
              this.createForm(this.ClaimDataAr, this.ClaimUpdateForm);
            }

            if (this.Claim_status != 4) {
              this.amountcalculate('', '');
            }

          } else {

            this.DataAr = [];
          }
        },
        (err) => {
          this.api.Toast("Warning", "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        });

  }



}
