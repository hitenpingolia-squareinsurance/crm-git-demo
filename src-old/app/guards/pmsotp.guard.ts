import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PmsOtpService } from '../providers/pmsotp.service';
import { PmsOtpPopupComponent } from '../pms-otp-popup/pms-otp-popup.component';

@Injectable({
  providedIn: 'root'
})
export class PmsOtpGuard implements CanActivate {

  constructor(private otpService: PmsOtpService, private dialog: MatDialog, private router: Router) {
    window.addEventListener('storage', this.handleStorageChange.bind(this));
    window.addEventListener('otpVerified', this.handleOtpVerified.bind(this));
  }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    try {
      const isVerified = await this.otpService.verifyOtp();
      if (isVerified) {
        return true; // Allow route activation if OTP is verified
      } else {
        return this.openOtpPopupAndRedirect();
      }
    } catch (err) {
      console.error('Error verifying OTP:', err);
      return false; // Handle errors and prevent route activation
    }
  }

  openOtpPopupAndRedirect(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const dialogRef = this.dialog.open(PmsOtpPopupComponent, {
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        resolve(result); // Allow or prevent route activation based on dialog result
      });
    });
  }

  handleStorageChange(event: StorageEvent) {
    if (event.key === 'otpVerified' && event.newValue === 'true') {
      window.location.reload(); // Reload to check the guard again
    }
  }

  handleOtpVerified(event: Event) {
    // Handle OTP verification event if needed
  }
}
