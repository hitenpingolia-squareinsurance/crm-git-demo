import { Injectable } from "@angular/core";
import { mergeMapTo } from "rxjs/operators";
import { BehaviorSubject } from "rxjs";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { environment } from "../../environments/environment";
import { ApiService } from "./api.service";

@Injectable({
  providedIn: "root",
})
export class FcmService {
  currentMessage = new BehaviorSubject(null);
  message: any = null;
  constructor(public api: ApiService) {}
  ngOnInit(): void {
    this.requestPermission();
    this.listen();
  }
  requestPermission() {
    const messaging = getMessaging();
    getToken(messaging, { vapidKey: environment.firebase.vapidKey })
      .then((currentToken) => {
        if (currentToken) {
          const formData = new FormData();
          formData.append("fcmId", currentToken);
          formData.append("token", "square123123");
          formData.append("loginId", this.api.GetUserData("Id"));
          formData.append("loginType", this.api.GetUserType());

          this.api
            .HttpPostType("Chat/UpdateWebMsgToken", formData)
            .then((result: any) => {
              // alert(result);
            });

          // console.log("Hurraaa!!! we got the token.....");
          // console.log(currentToken);
        } else {
          // console.log('No registration token available. Request permission to generate one.');
        }
      })
      .catch((err) => {
        // console.log('An error occurred while retrieving token. ', err);
      });
  }
  listen() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      // console.log('Message received. ', payload);
      this.message = payload;
    });
  }
}
