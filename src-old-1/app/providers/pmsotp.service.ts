import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";

@Injectable({
  providedIn: "root",
})
export class PmsOtpService {
  private isVerified: boolean = false;

  constructor(private api: ApiService) {}

  async verifyOtp(): Promise<boolean> {
    try {
      const result = await this.api.HttpGetType("Profile/getPosOTPSession");
      if (result["status"] == 1) {
        //   //   //   console.log("OTP verification successful");
        this.isVerified = true;
        return true;
      } else {
        //   //   //   console.log("OTP verification failed:", result["msg"]);
        this.isVerified = false;
        return false;
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      return false; // Handle HTTP errors or other exceptions
    }
  }
}
