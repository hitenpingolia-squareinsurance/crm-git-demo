import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { NgxSpinnerService } from "ngx-spinner";
import { BehaviorSubject } from "rxjs";
import { environment } from "../../environments/environment";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import swal from "sweetalert";
import { SessionExpiredComponent } from "../modals/session-expired/session-expired.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import * as CryptoJS from "crypto-js";

declare function loadingServiceShow(zindex, id, flag);
declare function loadingServiceHide(id);

@Injectable({
  providedIn: "root",
})
export class ApiService {
  apiUrl: string;
  //secretKey: string = '1f3f3cea26ccd91a343edd63d87500e3ef71d4438619a3b3c55d094dbfa70c09';
  secretKey: string =
    "1f3f3cea26ccd91a343edd63d87500e3ef71d4438619a3b3c55d094dbfa70c09";

  private messageSource = new BehaviorSubject({ IsLoggedIn: "FALSE" });
  currentMessage = this.messageSource.asObservable();

  private PageSource = new BehaviorSubject("AppComponent"); //Page_Name
  TargetComponent = this.PageSource.asObservable();

  private RenwalTabType = new BehaviorSubject([
    { Id: "45_Days", Name: "45 Days" },
  ]);
  RenwalfilterTabType = this.RenwalTabType.asObservable();

  private attendanceMarkedSource = new BehaviorSubject<boolean>(false);
  attendanceMarked$ = this.attendanceMarkedSource.asObservable();

  markAttendance(status: boolean) {
    this.attendanceMarkedSource.next(status);
  }

  SiteUrl: string;
  apiUrlBms: string;
  RenewalQuery: any;
  LoadingDashboardPoupup: any = 0;
  RenewalGetTabType: any;
  SOCKET_ENDPOINT: string;
  Send_Renewal_mail_Condition: any = 0;
  apiUrlBmsBase: string;
  DataRightsNavigationValue: any = "Rights";
  DataRightsNavigationNumberValue: any = 1;
  urlSegment: any;
  currentUrl: any;
  urlSegmentRoot: any;
  urlSegmentSub: any;
  CopyPasteRights: any = 0;
  apiUrlpms: string;
  Masking: any = "Temp";
  SetDateRangeSet1: any;
  SetDateRangeGet1: any;
  TokenExpiredVal: any = 0;
  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router
  ) {
    // console.log("API Calling..." + environment.apiUrl);
    this.apiUrl = environment.apiUrl;

    // api.service

    this.apiUrlBmsBase = environment.apiUrlBmsBase;
    // "https://api.policyonweb.com/API/v1";
    this.SOCKET_ENDPOINT = environment.SOCKET_ENDPOINT;

    this.SiteUrl = "";

    // this.apiUrlpms = environment.apiUrlpms;
    this.apiUrlBms = environment.apiUrlBms;

    this.currentUrl = this.router.url;

    var splitted = this.currentUrl.split("/");
    if (typeof splitted[2] != "undefined") {
      this.urlSegment = splitted[2];
    }

    if (typeof splitted[1] != "undefined") {
      this.urlSegmentRoot = splitted[1];
    }

    if (typeof splitted[3] != "undefined") {
      this.urlSegmentSub = splitted[3];
    }

    if (this.GetUserData("Code") == "SIBAdmin") {
      this.apiUrl = "https://crm.squareinsurance.in/backuplivelife-copy/api";
      this.apiUrlBmsBase = "https://api.policyonweb.com/copy-api/v1";
    }

    //   //   //   console.log(this.apiUrl);
  }

  ShowMaskingField(i) {
    this.Masking = i;
  }
  ChangeRenwalTabtype(message: any) {
    this.RenwalTabType.next(message);
  }

  changeMessage(message: any) {
    this.messageSource.next(message);
  }
  changeComponent(Page: any) {
    this.PageSource.next(Page);
  }

  //=== TAB CHANGE REQUEST-RESPONSE RELATED FUNCTIONS START===//
  private tabRelatedData = new BehaviorSubject<Array<any>>([]);
  data$ = this.tabRelatedData.asObservable();

  public SetActiveTabModuleWise(tab_name: any, menu_name: any) {
    var data = [{ tab_name: tab_name, menu_name: menu_name }];
    this.tabRelatedData.next(data);
  }

  private TabTriggerResponse = new BehaviorSubject<string>("Initial Data");
  data1$ = this.TabTriggerResponse.asObservable();

  public SetTabChangeResponse(value: any) {
    this.TabTriggerResponse.next(value);
  }

  public ReturnWebUrl() {
    return "https://webapi.squareinsurance.in";
  }

  public encryptText(plainText: string): string {
    // var encryptedString = CryptoJS.AES.encrypt(plainText, this.secretKey).toString();
    // return encryptedString;

    const key256C = CryptoJS.SHA256(this.secretKey).toString().substring(0, 64);
    const key128C = CryptoJS.SHA256(this.secretKey).toString().substring(0, 32);
    const key = CryptoJS.enc.Hex.parse(key256C);
    const iv = CryptoJS.enc.Hex.parse(key128C);

    const vEncrypted = CryptoJS.AES.encrypt(plainText, key, {
      iv: iv,
    }).toString();
    return btoa(vEncrypted);
  }

  public decryptText(encryptedString: string): string {
    if (encryptedString) {
      // const bytes = CryptoJS.AES.decrypt(encryptedString, this.secretKey);
      // var decryptedString = bytes.toString(CryptoJS.enc.Utf8);
      // return decryptedString;

      const key256C = CryptoJS.SHA256(this.secretKey)
        .toString()
        .substring(0, 64);
      const key128C = CryptoJS.SHA256(this.secretKey)
        .toString()
        .substring(0, 32);

      const key = CryptoJS.enc.Hex.parse(key256C);
      const iv = CryptoJS.enc.Hex.parse(key128C);

      // Decrypt the data
      const decryptedBytes = CryptoJS.AES.decrypt(encryptedString, key, {
        iv: iv,
      });
      const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);

      return decryptedText;
    } else {
      return "{}";
    }
  }

  public enc_FormData(data: any): FormData {
    //return data;
    ////   //   console.log(data);

    const formData = new FormData();
    data.forEach((value: any, key: string) => {
      // Encrypt both key and value before appending to formData
      ////   //   console.log(key,value);

      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(this.encryptText(key), this.encryptText(value));
      }

      //
    });
    return formData; // Return the formData object
  }

  public queryStringToArray(queryString) {
    //return queryString;
    let queryArray = queryString
      .split("&")
      .filter(Boolean)
      .map((pair) => pair.trim());
    ////   //   console.log(queryString);

    let modifiedQueryArray = queryArray.map((pair) => {
      let [key, value] = pair.split("=");
      return `${this.encryptText(key)}=${this.encryptText(value)}`;
      //return `${(key)}=${(value)}`;
    });

    ////   //   console.log(modifiedQueryArray.join('&'));

    return modifiedQueryArray.join("&");
  }

  public additionParmsEnc(apiName: any) {
    // Split the URL at the first '?' to separate base URL and query string
    var urldata = apiName.split("?");

    // If there's no query string (urldata[1] is undefined), handle that case
    var u_r_l = urldata[0];
    var query_params = urldata[1] ? urldata[1] : "";

    // If there are query parameters, process them using queryStringToArray
    var full_url =
      u_r_l + (query_params ? "?" + this.queryStringToArray(query_params) : "");

    return full_url;
  }

  public HttpPostTypeArray(apiName, data) {
    return new Promise((resolve, reject) => {
      this.http
        .post(
          this.additionParmsEnc(this.apiUrl + "/" + apiName),
          this.enc_FormData(data),
          this.getHeader(this.apiUrl)
        )
        .subscribe(
          (resp: any) => {
            var res = JSON.parse(this.decryptText(resp.response));
            this.TokenExpired(res);
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  public HttpPostType1(apiName, data) {
    return new Promise((resolve, reject) => {
      this.http
        .post(
          "http://13.127.142.101/sanity/ci/crm-api/backuplive/api/welcome/test",
          null,
          this.getHeader("")
        )
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  public DataRightsNavigation(value: any) {
    this.DataRightsNavigationValue = value;
  }

  public DataRightsGetNavigation() {
    return this.DataRightsNavigationValue;
  }

  public DataRightsNavigationNumber(value: any) {
    this.DataRightsNavigationNumberValue = value;
  }

  public DataRightsGetNavigationNumber() {
    return this.DataRightsNavigationNumberValue;
  }

  public Toast(Type, Message) {
    // alert(this.CheckSessionExpiredStatus());
    if (this.CheckSessionExpiredStatus() == "FALSE") {
      switch (Type) {
        case "Success": {
          //statements;
          this.toastr.success(Type, Message, {
            closeButton: true,
            progressBar: true,
            progressAnimation: "increasing",
            timeOut: 3000,
          });
          break;
        }
        case "Notification": {
          //statements;
          this.toastr.success(Type, Message, {
            closeButton: true,
            progressBar: true,
            progressAnimation: "increasing",
            timeOut: 3000,
          });
          break;
        }
        case "Error": {
          //statements;
          this.toastr.error(Type, Message, {
            closeButton: true,
            progressBar: true,
            progressAnimation: "increasing",
            timeOut: 3000,
          });
          break;
        }
        case "Info": {
          //statements;
          this.toastr.info(Type, Message, {
            closeButton: true,
            progressBar: true,
            progressAnimation: "increasing",
            timeOut: 3000,
          });
          break;
        }
        case "Warning": {
          //statements;
          this.toastr.warning(Type, Message, {
            closeButton: true,
            progressBar: true,
            progressAnimation: "increasing",
            timeOut: 3000,
          });
          break;
        }
        default: {
          //statements;
          break;
        }
      }
    }
  }

  public ToastBeforeLogin(Type, Message) {
    switch (Type) {
      case "Success": {
        //statements;
        this.toastr.success(Type, Message, {
          closeButton: true,
          progressBar: true,
          progressAnimation: "increasing",
          timeOut: 3000,
        });
        break;
      }
      case "Notification": {
        //statements;
        this.toastr.success(Type, Message, {
          closeButton: true,
          progressBar: true,
          progressAnimation: "increasing",
          timeOut: 3000,
        });
        break;
      }
      case "Error": {
        //statements;
        this.toastr.error(Type, Message, {
          closeButton: true,
          progressBar: true,
          progressAnimation: "increasing",
          timeOut: 3000,
        });
        break;
      }
      case "Info": {
        //statements;
        this.toastr.info(Type, Message, {
          closeButton: true,
          progressBar: true,
          progressAnimation: "increasing",
          timeOut: 3000,
        });
        break;
      }
      case "Warning": {
        //statements;
        this.toastr.warning(Type, Message, {
          closeButton: true,
          progressBar: true,
          progressAnimation: "increasing",
          timeOut: 3000,
        });
        break;
      }
      default: {
        //statements;
        break;
      }
    }
  }

  // public IsLoading() {
  //   this.spinner.show();

  // }
  // public HideLoading() {
  //   this.spinner.hide();

  // }

  public IsLoading() {
    $("#LoaderhaiBhaiYeh").removeClass("custom_loader_new d_none_one");

    $("#LoaderhaiBhaiYeh").addClass("custom_loader_new d_block_one");
  }

  public HideLoading() {
    $("#LoaderhaiBhaiYeh").removeClass("custom_loader_new d_block_one");

    $("#LoaderhaiBhaiYeh").addClass("custom_loader_new d_none_one");
  }

  public getHeader(url: any) {
    const parsedUrl = new URL(url);
    const domain = parsedUrl.hostname;
    ////   //   console.log(domain);

    let api_key =
      domain == "api.policyonweb.com"
        ? this.GetUserData("jwtToken_bms")
        : this.GetUserData("jwtToken_crm");
    //return {};

    const httpOptions = {
      headers: new HttpHeaders({
        //"Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${api_key}`,
      }),
    };

    return httpOptions;
  }

  public GetToken() {
    //// console.log(localStorage.getItem('Logged_In') + '-Test');
    const data = localStorage.getItem("Logged_In");
    if (data != null) {
      if (data == "FALSE") {
        return "FALSE";
      } else {
        //return localStorage.getItem("Token");
        return this.GetUserData("jwtToken_crm");
      }
    } else {
      return "FALSE";
    }
  }

  public HttpPostType(apiName, data) {
    var currentUrl = this.router.url;

    data.append("Login_User_Id", this.GetUserData("Id"));
    data.append("Login_User_Type", this.GetUserType());
    data.append("RightType", this.DataRightsNavigationValue);
    data.append("SectionUrl", currentUrl);

    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: this.GetToken(),
        "Access-Control-Allow-Origin": "*",
      }),
    };
    // console.log(location.origin);
    if (
      location.origin == "http://localhost:4200" ||
      location.origin == "http://localhost:4500"
    ) {
      // alert();

      var Returns = new Promise((resolve, reject) => {
        this.http
          .post(
            this.additionParmsEnc(this.apiUrl + "/" + apiName),
            this.enc_FormData(data),
            this.getHeader(this.apiUrl)
          )
          .subscribe(
            (resp: any) => {
              var res = JSON.parse(this.decryptText(resp.response));
              // alert();
              this.TokenExpired(res);
              resolve(res);
            },
            (err) => {
              if (err.error.Status == "TokenError") {
                //this.TokenExpired();
              } else {
                reject(err);
              }
              //  //   //   console.log(err);
              //  //   //   console.log(err.error.Status);
              //  //   //   console.log(err["error"]);
            }
          );
      });
      Returns.then(async (resp: any) => {
        var res = JSON.parse(this.decryptText(resp.response));
        this.TokenExpired(res);
        if (res["Status"] && res["Status"] == "TokenError") {
          // alert();
          this.TokenExpired(res);

          return false;
        }
      });
    } else {
      var Returns = new Promise((resolve, reject) => {
        this.http
          .post(
            this.additionParmsEnc(this.apiUrl + "/" + apiName),
            this.enc_FormData(data),
            this.getHeader(this.apiUrl)
          )
          .subscribe(
            (resp: any) => {
              var res = JSON.parse(this.decryptText(resp.response));
              this.TokenExpired(res);
              resolve(res);
            },
            (err) => {
              if (err.error.Status == "TokenError") {
                //this.TokenExpired();
              } else {
                reject(err);
              }
            }
          );
      });
      Returns.then(async (resp: any) => {
        var res = JSON.parse(this.decryptText(resp.response));
        this.TokenExpired(res);
        if (res["Status"] && res["Status"] == "TokenError") {
          return false;
        }
      });
    }

    return Returns;
  }

  public HttpPostTypeLogin(apiName, data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + "/" + apiName, data, {}).subscribe(
        (resp: any) => {
          var res = JSON.parse(this.decryptText(resp.response));
          this.TokenExpired(res);
          resolve(res);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  public HttpGetType(apiName) {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: this.GetToken(),
        "Access-Control-Allow-Origin": "*",
      }),
    };

    var Login_User_Id = this.GetUserData("Id");
    var Login_User_Type = this.GetUserType();
    var currentUrl = this.router.url;

    if (apiName.indexOf("?") > -1)
      apiName +=
        "&Login_User_Id=" +
        Login_User_Id +
        "&Login_User_Type=" +
        Login_User_Type +
        "&SectionUrl=" +
        currentUrl;
    else
      apiName +=
        "?Login_User_Id=" +
        Login_User_Id +
        "&Login_User_Type=" +
        Login_User_Type +
        "&SectionUrl=" +
        currentUrl;

    if (
      location.origin == "http://localhost:4200" ||
      location.origin == "http://localhost:4500"
    ) {
      var Returns = new Promise((resolve, reject) => {
        this.http
          .get(
            this.additionParmsEnc(
              this.apiUrl +
                "/" +
                apiName +
                "&RightType=" +
                this.DataRightsNavigationValue
            ),
            this.getHeader(this.apiUrl)
          )
          .subscribe(
            (resp: any) => {
              var res = JSON.parse(this.decryptText(resp.response));
              this.TokenExpired(res);
              resolve(res);
            },
            (err) => {
              if (err.error.Status == "TokenError") {
                //this.TokenExpired();
              } else {
                reject(err);
              }

              // reject(err);
            }
          );
      });
    } else {
      var Returns = new Promise((resolve, reject) => {
        this.http
          .get(
            this.additionParmsEnc(
              this.apiUrl +
                "/" +
                apiName +
                "&RightType=" +
                this.DataRightsNavigationValue
            ),
            this.getHeader(this.apiUrl)
          )
          .subscribe(
            (resp: any) => {
              var res = JSON.parse(this.decryptText(resp.response));
              this.TokenExpired(res);
              resolve(res);
            },
            (err) => {
              // reject(err);
              if (err.error.Status == "TokenError") {
                //this.TokenExpired();
              } else {
                reject(err);
              }
            }
          );
      });
    }

    Returns.then(async (resp: any) => {
      var res = JSON.parse(this.decryptText(resp.response));
      this.TokenExpired(res);
      if (res["Status"] && res["Status"] == "TokenError") {
        return false;
      }
    });

    return Returns;

    //yaha tak
  }

  public HttpGetSOCKET_ENDPOINT(apiName) {
    let api_key = this.GetUserData("jwtToken_crm");
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${api_key}`,
      }),
    };

    var Returns = new Promise((resolve, reject) => {
      this.http
        .get(this.SOCKET_ENDPOINT + "/" + apiName, httpOptions)
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            // reject(err);
            if (err.error.Status == "TokenError") {
              //this.TokenExpired();
            } else {
              reject(err);
            }
          }
        );
    });

    Returns.then(async (resp: any) => {
      var res = JSON.parse(this.decryptText(resp.response));
      this.TokenExpired(res);
      if (res["Status"] && res["Status"] == "TokenError") {
        return false;
      }
    });

    return Returns;
  }

  public GetPosType() {
    if (this.GetUserData("Logged_In") == "FALSE") {
      return 0;
    } else {
      return this.GetUserData("pos_type");
    }
  }

  public GetUserData(key) {
    const data = JSON.parse(localStorage.getItem("UserData"));
    if (data != null) {
      return data[key];
    } else {
      return "FALSE";
    }
  }

  public GetUserId() {
    if (this.GetUserData("Logged_In") == "FALSE") {
      return 0;
    } else {
      return this.GetUserData("User_Id");
    }
  }

  public CheckSessionExpiredStatus() {
    const data = localStorage.getItem("LoginExpiredStatus");
    // alert(data);
    if (data != null) {
      if (data == "FALSE") {
        return "FALSE";
      } else {
        return "TRUE";
      }
    } else {
      return "TRUE";
    }
  }

  public CheckLoginStatus() {
    //// console.log(localStorage.getItem('Logged_In') + '-Test');
    const data = localStorage.getItem("Logged_In");
    if (data != null) {
      if (data == "FALSE") {
        return "FALSE";
      } else {
        return "TRUE";
      }
    } else {
      return "FALSE";
    }
  }

  public GetUserType() {
    const data = localStorage.getItem("Logged_In");
    if (data != null) {
      if (data == "FALSE") {
        return "FALSE";
      } else {
        return localStorage.getItem("LoginType");
      }
    } else {
      return "FALSE";
    }
  }

  public GetPrimeStatus() {
    return localStorage.getItem("Prime_Status");
  }

  public GetGemsStatus() {
    return localStorage.getItem("GemsStatus");
  }
  public GetFcmToken() {
    const data = localStorage.getItem("FCM_Token");
    if (data != null) {
      return data;
    } else {
      return "";
    }
  }

  public StandrdToDDMMYYY(d) {
    return d;
    // console.log(d);
    // console.log(new Date(d));
    if (d == "" || d == null || d == "00-00-0000") {
      return "";
    } else {
      d = new Date(d);
      return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); // + ' '+d.toString().split(' ')[4];
      //return d.getDate() + "-"+(d.getMonth()+1) +"-"+d.getFullYear();
      // for time part you may wish to refer http://stackoverflow.com/questions/6312993/javascript-seconds-to-time-string-with-format-hhmmss
    }
  }

  public HttpForSR(Type, apiName, data) {
    if (Type == "post") {
      return new Promise((resolve, reject) => {
        this.http
          .post(
            this.additionParmsEnc(this.apiUrlBms + "/" + apiName),
            this.enc_FormData(data),
            this.getHeader(this.apiUrlBms)
          )
          .subscribe(
            (resp: any) => {
              var res = JSON.parse(this.decryptText(resp.response));
              this.TokenExpired(res);
              resolve(res);
            },
            (err) => {
              reject(err);
            }
          );
      });
    } else {
      return new Promise((resolve, reject) => {
        this.http
          .get(
            this.additionParmsEnc(this.apiUrlBms + "/" + apiName),
            this.getHeader(this.apiUrlBms)
          )
          .subscribe(
            (resp: any) => {
              var res = JSON.parse(this.decryptText(resp.response));
              this.TokenExpired(res);
              resolve(res);
            },
            (err) => {
              reject(err);
            }
          );
      });
    }
  }

  RenewalQueryGet(value: any) {
    this.RenewalQuery = "";
    if (value != "0") {
      this.RenewalQuery = value;
    }
  }

  GetRenwals() {
    return this.RenewalQuery;
  }

  public RenewalQueryGetTabType(value: any) {
    this.RenewalGetTabType = value;
  }

  public RenewalQueryFetchTabType() {
    return this.RenewalGetTabType;
  }

  public SetDashboardLoginPoupupValue(value: any) {
    this.LoadingDashboardPoupup = value;
    // console.log(this.LoadingDashboardPoupup);
  }

  // public GetDashboardLoginPoupup(){
  //     return  this.LoadingDashboardPoupup;
  //   }

  public GetDashboardLoginPoupup() {
    // console.log(localStorage.getItem("LoadingDashboardPoupup"));

    return localStorage.getItem("LoadingDashboardPoupup");
  }

  public Send_Renewal_mail_Set_Condition(value: any) {
    this.Send_Renewal_mail_Condition = value;
  }

  public Send_Renewal_mail_get_Condition() {
    return this.Send_Renewal_mail_Condition;
  }

  public SetDateRangeSet(value: any) {
    this.SetDateRangeSet1 = value;
  }

  public SetDateRangeGet() {
    return this.SetDateRangeSet1;
  }

  //===== CALL BMS COMMON URL =====//
  public CallBms(paramsNames) {
    return new Promise((resolve, reject) => {
      this.http
        .get(
          this.additionParmsEnc(this.apiUrlBmsBase + "/" + paramsNames),
          this.getHeader(this.apiUrlBmsBase)
        )
        .subscribe(
          (resp: any) => {
            var res = JSON.parse(this.decryptText(resp.response));
            this.TokenExpired(res);
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  public HttpPostTypeBms(apiName, data) {
    return new Promise((resolve, reject) => {
      this.http
        .post(
          this.additionParmsEnc(this.apiUrlBmsBase + "/" + apiName),
          this.enc_FormData(data),
          this.getHeader(this.apiUrlBmsBase)
        )
        .subscribe(
          (resp: any) => {
            var res = JSON.parse(this.decryptText(resp.response));

            this.TokenExpired(res);
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  getPosition(): Promise<any> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (resp) => {
          resolve({ lng: resp.coords.longitude, lat: resp.coords.latitude });
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  callme(Id) {
    loadingServiceShow(1, Id, false);
  }

  //===== HIDE DIV LOADER =====//
  callmestop(Id) {
    loadingServiceHide(Id);
  }

  public Copy_Paste_Set_Condition(value: any) {
    this.CopyPasteRights = value;
  }

  public Copy_Paste_get_Condition() {
    return this.CopyPasteRights;
  }

  CopyText(inputElement) {
    navigator.clipboard.writeText(inputElement);
  }

  TokenExpired(res: any) {
    ////   //   console.log(res);

    if (res.Status == false && res.Rate_limit == false) {
      this.Toast("Warning", res.Message);
    }

    if (res.Status == false && res.Token == false) {
      // localStorage.setItem("LoginExpiredStatus", "TRUE");
      // localStorage.clear();

      this.Toast("Warning", res.Message);

      this.router.navigate(["Logoutweb"]);

      // var LoginTypes = localStorage.getItem("LoginType");
      // var LoginId = localStorage.getItem("LoginIdSet");

      // var CurrentUrl = window.location.pathname;

      // localStorage.removeItem("LoginType");
      // localStorage.removeItem("Token");
      // localStorage.removeItem("UserData");
      // localStorage.setItem("Logged_In", "FALSE");
      // localStorage.removeItem("Login_Token");
      // localStorage.removeItem("Login_Token");
      // localStorage.removeItem("LoginIdSet");
      // const params = new URLSearchParams(window.location.search);
      // var name = params.get("type");
      // var Id = params.get("Id");
      // if (
      //   CurrentUrl == "/Logoutweb" &&
      //   (name == "employee" ||
      //     name == "agent" ||
      //     name == "user" ||
      //     name == "sp")
      // ) {
      //   window.location.href = this.ReturnWebUrl() + "/logout-users/" + name;
      // } else {
      //   window.location.href =
      //     this.ReturnWebUrl() + "/logout-users/" + LoginTypes;
      // }
    }
  }

  TokenExpired_() {
    // localStorage.removeItem("LoginExpiredStatus");
    localStorage.setItem("LoginExpiredStatus", "TRUE");
    // console.log("Ye aPI SE HUA HAI");

    // alert("Ye aPI SE HUA HAI");
    // if (
    //   (this.GetUserType() == "employee" || this.GetUserType() == "agent") &&
    //   this.CheckSessionExpiredStatus() == "FALSE"
    // ) {
    ////   //   //   console.log(
    //     this.CheckSessionExpiredStatus(),
    //     "Api session Expired mein "
    //   );

    //   this.TokenExpiredVal = 1;
    //   const dialogRef = this.dialog.open(SessionExpiredComponent, {
    //     width: "45rem",
    //     height: "350px",
    //     disableClose: true,
    //     data: { Id: 0 },
    //   });
    //   dialogRef.afterClosed().subscribe((result:any) => {
    //     this.TokenExpiredVal = 0;
    //   });
    // } else if (this.GetUserType() == "sp" || this.GetUserType() == "user") {
    //   ////   //   console.log("Ye Session Time Out  -" + this.GetUserType());
    //   // alert(1234567);
    //   this.Toast("Warning", "Session Time Out");
    //   this.router.navigate(["Logoutweb"]);
    //   this.TokenExpiredVal = 0;
    // }
  }

  saveState(user: any, userType: any): void {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("userType", JSON.stringify(userType));
  }

  // Retrieve user and userType from localStorage
  getState(): { user: any; userType: any } | null {
    const user = localStorage.getItem("user");
    const userType = localStorage.getItem("userType");

    if (user && userType) {
      return {
        user: JSON.parse(user),
        userType: JSON.parse(userType),
      };
    }
    return null;
  }
}
