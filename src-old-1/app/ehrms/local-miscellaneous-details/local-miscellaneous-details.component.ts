import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ApiService } from '../../providers/api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-local-miscellaneous-details',
  templateUrl: './local-miscellaneous-details.component.html',
  styleUrls: ['./local-miscellaneous-details.component.css']
})
export class LocalMiscellaneousDetailsComponent implements OnInit {
  Id: any;
  urlSegment: string;
  dataAr: any[];
  LocalData: any[];
  // ClaimUpdateForm: FormGroup;
  // ClaimForm : FormGroup
  Status: any;
  Claim_data: any;
  claimSubmit = false;
  selectedImages: any[];


  constructor(
    private api: ApiService,
    public Router: Router,
    private dialogRef: MatDialogRef<LocalMiscellaneousDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    if (this.data) {
      this.Id = this.data.Id;
    } else {
      this.Id = null;
    }

    // this.ClaimUpdateForm = this.fb.group({});
    // this.ClaimForm = this.fb.group({
    //   Remark: ["", Validators.required],
    // });

    this.urlSegment = this.Router.url.split('/')[2];

  }

  // get FormClaim() {
  //   return this.ClaimForm.controls;
  // }


  ngOnInit() {
    if (this.urlSegment == 'miscellaneousClaim' || this.urlSegment == 'miscellaneousClaim-manager' || this.urlSegment == 'miscellaneousClaim-hod' || this.urlSegment == 'miscellaneousClaim-claim' || this.urlSegment == 'miscellaneousClaim-account') {
      this.Get(this.Id);
    } else if (this.urlSegment == 'localClaim' || this.urlSegment == 'localClaim-manager' || this.urlSegment == 'localClaim-hod' || this.urlSegment == 'localClaim-claim' || this.urlSegment == 'localClaim-account') {

      this.GetLocal(this.Id);

    }

  }


  // ---------------------------------------------------PREVIOUS FORM------------------------------------------------------------

  // createForm(menuItems: any[], formGroup: FormGroup) {

  //   menuItems.forEach((item) => {

  //     const AmountZoneControl = new FormControl('', Validators.required);
  //     formGroup.addControl(`${item.Id}_journeyAmount`, AmountZoneControl);
  //     if (this.urlSegment == 'localClaim-manager') {
  //       AmountZoneControl.setValue(item.EmployeeAmount);
  //     } if (this.urlSegment == 'localClaim-hod') {
  //       AmountZoneControl.setValue(item.managerAmount);
  //     } else if (this.urlSegment == 'localClaim-claim') {
  //       AmountZoneControl.setValue(item.hodAmount);
  //     } else if (this.urlSegment == 'localClaim-account') {
  //       AmountZoneControl.setValue(item.claimAmount);
  //     }
  //   });
  // }

  Get(Id: any) {

    const formdata = new FormData();
    this.Id = Id;
    formdata.append('claimId', this.Id);
    formdata.append('urlSegment', this.urlSegment);

    this.api.HttpPostType("ehrms/ViewRequest?User_Id=" +
      this.api.GetUserData("Id") +
      "&User_Type=" +
      this.api.GetUserType()
      , formdata)
      .then(
        (result: any) => {
          if (result['status'] == true) {

            this.dataAr = result.data;

          } else {

            this.dataAr = [];
          }
        },
        (err) => {
          this.api.Toast("Warning", "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        });

  }

  GetLocal(Id: any) {

    const formdata = new FormData();
    this.Id = Id;
    formdata.append('claimId', this.Id);
    formdata.append('urlSegment', this.urlSegment);


    this.api.HttpPostType("ehrms/ViewLocalRequest?User_Id=" +
      this.api.GetUserData("Id") +
      "&User_Type=" +
      this.api.GetUserType(), formdata)
      .then(
        (result: any) => {
          if (result['status'] == true) {

            this.dataAr = result.data;
            this.Status = result.data[0].status;
            this.LocalData = this.dataAr[0].localForm

            //  this.createForm(this.LocalData, this.ClaimUpdateForm);

          } else {

            this.dataAr = [];
          }
        },
        (err) => {
          this.api.Toast("Warning", "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        });

  }

  ViewDocument(url) {
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }

  CloseModel() {
    this.dialogRef.close();
  }


  // ---------------------------------------------------PREVIOUS FORM------------------------------------------------------------
  // claim_Form() {


  //   var fields = this.ClaimUpdateForm.value;
  //   var Remark = this.ClaimForm.value;
  //   this.Claim_data = this.Id;


  //   this.claimSubmit = true;
  //   if (this.ClaimUpdateForm.invalid || this.ClaimForm.controls.Remark.invalid) {

  //     return;
  //   } else {

  //     const formdata = new FormData();

  //     formdata.append('localClaimId', this.Claim_data);
  //     formdata.append('actionTaken', this.ModalAction);
  //     formdata.append('urlSegment', this.urlSegment);
  //     formdata.append('localAmount', JSON.stringify(fields));
  //     formdata.append('localRemark', JSON.stringify(Remark));

  //     this.api.HttpPostType('ehrms/SaveLogsLocal', formdata)
  //       .then(
  //         (result: any) => {
  //           if (result['status'] == true) {
  //             this.api.Toast('Success' , result['msg']);
  //             this.CloseModel();
  //           } else {
  //             this.api.Toast('Warning' , result['msg']);
  //           }
  //         },
  //         (err) => {
  //           this.api.Toast("Warning", "Network Error : " + err.name + "(" + err.statusText + ")"
  //           );
  //         });
  //   }
  // }


  ViewClaimDocs(img: string) {

    this.selectedImages = [];
    const imageUrls = img.split(',');
    this.selectedImages.push(...imageUrls);

  }


}
