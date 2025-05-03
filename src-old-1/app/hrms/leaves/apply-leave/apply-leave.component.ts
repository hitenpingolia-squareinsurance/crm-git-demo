import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from "src/app/providers/api.service";
import { HttpClient } from '@angular/common/http';
import { Subscription, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

function noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isWhitespace = (control.value || '').trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  };
}

@Component({
  selector: 'app-apply-leave',
  templateUrl: './apply-leave.component.html',
  styleUrls: ['./apply-leave.component.css']
})
export class ApplyLeaveComponent implements OnInit {
  ApplyLeaveForm: FormGroup;
  isSubmitted = false;
  type: any;
  leaveRequestId:any;
  userId: any;
  minDate = new Date(); // Current date for minDate
  leaveDays = 0; // Field to display the calculated leave days
  holidays = 0;
  subscriptions: Subscription = new Subscription(); // Subscription store karne ke liye

  constructor(  private api: ApiService,
    private router: Router,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<ApplyLeaveComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.leaveRequestId = this.data.id;
    this.type = this.data.type;
  

  }

  ngOnInit() {
    const currentDate = new Date(); 

    this.ApplyLeaveForm = this.formBuilder.group({
      StartDate: [currentDate, Validators.required],
      EndDate: [currentDate, [Validators.required, this.endDateValidator.bind(this)]],
      startDateType: ['full_day', Validators.required],
      endDateType: [{ value: null, disabled: true }, Validators.required],
      reason: ['', [Validators.required, noWhitespaceValidator()]]
    });

    if (this.leaveRequestId) {
      // Edit mode: Fetch existing leave request details
      this.getLeaveRequest();
    
    } else {
      // New leave request: Set up default behavior
      this.updateEndDateTypeState();
      this.calculateLeaveDays();
    }

    
  
   
   
  
   

  }

  chooseDate(type: string) {
    // Purani subscriptions ko remove karein taaki naye duplicate na banein
    this.subscriptions.unsubscribe();
    this.subscriptions = new Subscription();
  
    const applyLeaveForm = this.ApplyLeaveForm;
  
    if (type === 'StartDate') {
      this.subscriptions.add(
        applyLeaveForm.get('StartDate').valueChanges.subscribe((startDateValue) => {
          const endDateControl = applyLeaveForm.get('EndDate');
          if (endDateControl.value) {
            endDateControl.setValue(startDateValue, { emitEvent: false });
          }
          endDateControl.updateValueAndValidity();
          this.updateEndDateTypeState();
        })
      );
    } else if (type === 'EndDate') {
      this.subscriptions.add(
        applyLeaveForm.get('EndDate').valueChanges.subscribe(() => {
          this.updateEndDateTypeState();
        })
      );
    }
  
    // **Merge saare changes ek stream me aur debounceTime ka use karein**
    this.subscriptions.add(
      merge(
        applyLeaveForm.get('StartDate').valueChanges,
        applyLeaveForm.get('EndDate').valueChanges,
        applyLeaveForm.get('startDateType').valueChanges,
        applyLeaveForm.get('endDateType').valueChanges
      )
      .pipe(
        debounceTime(300), // 300ms ka wait karega taaki frequent changes par API baar-baar na chale
        distinctUntilChanged() // Agar value same hai to API call nahi karega
      )
      .subscribe(() => {
        this.calculateLeaveDays(); // API sirf ek baar chalegi
      })
    );
  }

  getLeaveRequest(){

    this.api.HttpGetType(
      "/hrms/AttendanceManagement/get_leave_request_data?User_Id=" +
      this.api.GetUserData("Id") +
      "&User_Type=" +
      this.api.GetUserType() +
      "&leave_request_id=" + this.leaveRequestId

    ).then((result) => {
      this.api.HideLoading();
      if (result["status"] == true) {
        let data = result["data"];
        this.ApplyLeaveForm.patchValue({
          StartDate: new Date(data.start_date),
          EndDate: new Date(data.end_date),
          startDateType: data.start_date_type,
          endDateType: data.end_date_type,
          reason: data.reason
        });
        this.leaveDays = data.actual_leave_days;
        this.holidays = data.holidays;
        this.updateEndDateTypeState();
        this.calculateLeaveDays();

      } else {
        this.api.Toast("Warning", result["message"]);
        this.CloseModel();
      }
    },(err) => {
      this.api.HideLoading();
      this.api.Toast(
        "Warning",
        "Network Error : " + err.name + "(" + err.statusText + ")"
      );
      this.CloseModel();
    });
  
  }

  updateEndDateTypeState() {
    const startDate = new Date(this.ApplyLeaveForm.get('StartDate').value);
    const endDate = new Date(this.ApplyLeaveForm.get('EndDate').value);
    const endDateTypeControl = this.ApplyLeaveForm.get('endDateType');
  
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
  
    if (startDate.getTime() === endDate.getTime()) {
      endDateTypeControl.disable();
      endDateTypeControl.setValue(null); // Clear selection when disabled
    } else {
      endDateTypeControl.enable();
      if (endDateTypeControl.value === null) {
        endDateTypeControl.setValue('full_day'); // Automatically select 'full_day' when enabled
      }
    }
  }
  
  endDateValidator(control) {
    const startDate = this.ApplyLeaveForm ? this.ApplyLeaveForm.get('StartDate').value : null;
    if (startDate && control.value) {
      const start = new Date(startDate);
      const end = new Date(control.value);
  
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
  
      if (end < start) {
        return { invalidEndDate: true }; // Validation error if EndDate is before StartDate
      }
    }
    return null;
  }
  

  async calculateLeaveDays() {
    const startDate = this.ApplyLeaveForm.get('StartDate').value;
    const endDate = this.ApplyLeaveForm.get('EndDate').value;
    const startDateType = this.ApplyLeaveForm.get('startDateType').value;
    const endDateType = this.ApplyLeaveForm.get('endDateType').value;
  
    if (!startDate || !endDate || !startDateType) {
      this.leaveDays = 0; // Default to 0 if any required values are missing
      return;
    }
  
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
  
    const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1; // Include end date
  
    let leaveDays = 0;
  
    if (start.getTime() === end.getTime()) {
      // Same day
      if (startDateType === 'full_day') {
        leaveDays = 1;
      } else if (startDateType === 'first_half' || startDateType === 'second_half') {
        leaveDays = 0.5;
      }
    } else {
      // Different days
      if (startDateType === 'full_day') {
        leaveDays += 1; // Full day for the start date
      } else if (startDateType === 'first_half' || startDateType === 'second_half') {
        leaveDays += 0.5; // Half day for the start date
      }
  
      if (endDateType === 'full_day') {
        leaveDays += 1; // Full day for the end date
      } else if (endDateType === 'first_half' || endDateType === 'second_half') {
        leaveDays += 0.5; // Half day for the end date
      }
  
      if (daysDiff > 2) {
        leaveDays += daysDiff - 2; // Full days for the days in between
      }
    }
    const holidayCount = await this.countHolidays(start, end);
    this.holidays = holidayCount;
    this.leaveDays = Math.max(0, leaveDays - holidayCount);
  }

  
  // async calculateLeaveDays() {
  //   const startDate = this.ApplyLeaveForm.get('StartDate').value;
  //   const endDate = this.ApplyLeaveForm.get('EndDate').value;
  //   const startDateType = this.ApplyLeaveForm.get('startDateType').value;
  //   const endDateType = this.ApplyLeaveForm.get('endDateType').value;

  //   if (!startDate || !endDate || !startDateType) {
  //       this.leaveDays = 0; // Default to 0 if any required values are missing
  //       return;
  //   }

  //   const start = new Date(startDate);
  //   const end = new Date(endDate);

  //   start.setHours(0, 0, 0, 0);
  //   end.setHours(0, 0, 0, 0);

  //   const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1; // Include end date

  //   let leaveDays = 0;

  //   if (start.getTime() === end.getTime()) {
  //       // Single-day leave
  //       leaveDays = (startDateType === 'full_day') ? 1 : 0.5;
  //   } else {
  //       // Multi-day leave
  //       leaveDays += (startDateType === 'full_day') ? 1 : 0.5;
  //       leaveDays += (endDateType === 'full_day') ? 1 : 0.5;

  //       if (daysDiff > 2) {
  //           leaveDays += daysDiff - 2; // Full days in between
  //       }
  //   }

  //   // Wait for holidays count before subtracting
  //   const holidayCount = await this.countHolidays(start, end);
  //   this.holidays = holidayCount;
  //   this.leaveDays = Math.max(0, leaveDays - holidayCount);
  // }

  async countHolidays(startDate: Date, endDate: Date): Promise<number> {
    console.log(
      "startDate",
      startDate.getFullYear() + '-' + 
      String(startDate.getMonth() + 1).padStart(2, '0') + '-' + 
      String(startDate.getDate()).padStart(2, '0')
    );
    return this.getHolidays(startDate, endDate);
  }

  getHolidays(startDate: Date, endDate: Date): Promise<number> {
      return new Promise((resolve) => {
          const formData = new FormData();
          formData.append("start_date", startDate.getFullYear() + '-' + 
          String(startDate.getMonth() + 1).padStart(2, '0') + '-' + 
          String(startDate.getDate()).padStart(2, '0'));

          formData.append("end_date", endDate.getFullYear() + '-' + 
          String(endDate.getMonth() + 1).padStart(2, '0') + '-' + 
          String(endDate.getDate()).padStart(2, '0'));

          this.api.HttpPostType("hrms/AttendanceManagement/getHolidays", formData).then(
              (result) => {
                  this.api.HideLoading();
                  resolve(result["status"] ? result["data"] : 0);
              },
              () => {
                  this.api.HideLoading();
                  this.api.Toast("Warning", "Network Error while fetching holidays.");
                  resolve(0);
              }
          );
      });
  }


  
    
  // countHolidays(startDate: Date, endDate: Date): number {
  //   let holidayCount = 0;
    
  //   const current = new Date(startDate); // Start from the start date
  
  //   while (current <= endDate) {
  //     // Check if the current day is a Sunday
  //     if (current.getDay() === 0) {
  //       holidayCount++;
  //     }
  
  //     // Check if the current day is the second Saturday of the month
  //     const firstDayOfMonth = new Date(current.getFullYear(), current.getMonth(), 1);
  //     const firstSaturday = (6 - firstDayOfMonth.getDay() + 7) % 7;
  //     const secondSaturday = firstSaturday + 7;
  
  //     if (current.getDate() === secondSaturday && current.getDay() === 6) {
  //       holidayCount++;
  //     }
  
  //     // Move to the next day
  //     current.setDate(current.getDate() + 1);
  //   }
  
  //   return holidayCount;
  // }
  
  submit() {
    this.isSubmitted = true;
    if (this.ApplyLeaveForm.invalid) {
      return;
    }
  
    const fields = this.ApplyLeaveForm.value;
    const formData = new FormData();
    formData.append("start_date", fields["StartDate"]);
    formData.append("end_date", fields["EndDate"]);
    formData.append("start_date_type", fields["startDateType"]);
    if(fields["endDateType"]){
      formData.append("end_date_type", fields["endDateType"]);
    }
    if(this.leaveRequestId){
      formData.append("leave_request_id", this.leaveRequestId);
    }
    formData.append("reason", fields["reason"].trim());
  
    const isEditing = !!this.leaveRequestId;
    const confirmationMessage = isEditing 
      ? "You are about to update an existing leave request. Are you sure you want to proceed with these changes?" 
      : "You are about to apply for a new leave request. Are you sure you want to submit this request?";
      
    let Confirms = confirm(confirmationMessage);
    if (Confirms === true) {
      this.api.IsLoading();
      this.api.HttpPostType("hrms/AttendanceManagement/apply_leave_request", formData).then(
        (result) => {
          this.api.HideLoading();
          if (result["status"] == 'success') {
            this.api.Toast("Success", result["message"]);
            this.CloseModel();
          } else {
            this.api.Toast("Warning", result["message"]);
          }
        },
        (err) => {
          this.api.HideLoading();
          this.api.Toast(
            "Warning",
            "Network Error: " + err.name + " (" + err.statusText + ")"
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
