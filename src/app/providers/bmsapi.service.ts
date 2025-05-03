import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { NgxSpinnerService } from "ngx-spinner";

import { environment } from "../../environments/environment";
import swal from "sweetalert";
import { BehaviorSubject } from "rxjs";
import * as CryptoJS from "crypto-js";

@Injectable({
  providedIn: "root",
})
export class BmsapiService {
  apiUrl: string;
  BaseUrlCrm: string;
  secretKey: string =
    "1f3f3cea26ccd91a343edd63d87500e3ef71d4438619a3b3c55d094dbfa70c09";

  private messageSource = new BehaviorSubject({ IsLogged: "FALSE" });
  currentMessage = this.messageSource.asObservable();

  constructor(private http: HttpClient, private spinner: NgxSpinnerService) {
    // console.log('API Calling...'+ environment.apiUrlBmsBase );
    this.apiUrl = environment.apiUrlBmsBase;
    this.BaseUrlCrm = ""; //environment.BaseUrlCrm;

    if (this.GetUserData("Code") == "SIBAdmin") {
      //this.apiUrl = 'https://crm.squareinsurance.in/backuplivelife-copy/api';
      this.apiUrl = "https://api.policyonweb.com/copy-api/v1";
    }

    //alert(this.apiUrl);
  }

  changeMessage(message: any) {
    this.messageSource.next(message);
  }

  public IsLoading() {
    this.spinner.show();
  }
  public HideLoading() {
    this.spinner.hide();
  }

  public ErrorMsg(msg) {
    swal("Warning!", msg, "warning");
  }
  public ToastMessage(msg) {
    swal("success!", msg, "success");
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
    //   //   //   console.log(queryString);

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

  public Call(paramsNames) {
    const index = paramsNames.indexOf("?");
    var other_prams = "";
    if (index !== -1) {
      //alert(`The ? mark is found at index ${index}.`);
      other_prams = "&source=crm";
    } else {
      //alert("The ? mark is not found in the string.");
      other_prams = "?source=crm";
    }

    return new Promise((resolve, reject) => {
      this.http
        .get(
          this.additionParmsEnc(this.apiUrl + "/" + paramsNames + other_prams),
          this.getHeader(this.apiUrl)
        )
        .subscribe(
          (resp: any) => {
            var res = JSON.parse(this.decryptText(resp.response));
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  public Call_2(paramsNames) {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.additionParmsEnc(paramsNames), this.getHeader(this.apiUrl))
        .subscribe(
          (resp: any) => {
            var res = JSON.parse(this.decryptText(resp.response));
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }
  public Call3(paramsNames) {
    return new Promise((resolve, reject) => {
      this.http
        .get(
          this.additionParmsEnc(this.BaseUrlCrm + "/" + paramsNames),
          this.getHeader(this.apiUrl)
        )
        .subscribe(
          (resp: any) => {
            var res = JSON.parse(this.decryptText(resp.response));
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  public Call4(urls, paramsNames) {
    // this.apiUrl="https://api.policyonweb.com/API/v1";

    return new Promise((resolve, reject) => {
      this.http
        .get(
          this.additionParmsEnc(this.apiUrl + "/" + urls + "" + paramsNames),
          this.getHeader(this.apiUrl)
        )
        .subscribe(
          (resp: any) => {
            var res = JSON.parse(this.decryptText(resp.response));
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  public HttpPostType(apiName, data) {
    const index = apiName.indexOf("?");
    var other_prams = "";
    if (index !== -1) {
      //alert(`The ? mark is found at index ${index}.`);
      other_prams = "&source=crm";
    } else {
      //alert("The ? mark is not found in the string.");
      other_prams = "?source=crm";
    }

    return new Promise((resolve, reject) => {
      this.http
        .post(
          this.additionParmsEnc(this.apiUrl + "/" + apiName + other_prams),
          this.enc_FormData(data),
          this.getHeader(this.apiUrl)
        )
        .subscribe(
          (resp: any) => {
            var res = JSON.parse(this.decryptText(resp.response));
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
          this.additionParmsEnc(this.BaseUrlCrm + "/" + apiName),
          this.enc_FormData(data),
          this.getHeader(this.apiUrl)
        )
        .subscribe(
          (resp: any) => {
            var res = JSON.parse(this.decryptText(resp.response));
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  public HttpPostTypeCrm(apiName, data) {
    return new Promise((resolve, reject) => {
      this.http
        .post(
          "http://13.127.142.101/sanity/ci/crmdev/api/" + apiName,
          data,
          this.getHeader(this.apiUrl)
        )
        .subscribe(
          (resp: any) => {
            var res = JSON.parse(this.decryptText(resp.response));
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }
  public Toast(Type, Message) {
    alert(Message);
  }

  public HttpPostTypeProxy(apiName, data) {
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
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  public HttpForSR(Type, apiName, data) {
    if (Type == "post") {
      return new Promise((resolve, reject) => {
        this.http
          .post(
            this.additionParmsEnc(this.apiUrl + "/crm/" + apiName),
            this.enc_FormData(data),
            this.getHeader(this.apiUrl)
          )
          .subscribe(
            (resp: any) => {
              var res = JSON.parse(this.decryptText(resp.response));
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
            this.additionParmsEnc(this.apiUrl + "/crm/" + apiName),
            this.getHeader(this.apiUrl)
          )
          .subscribe(
            (resp: any) => {
              var res = JSON.parse(this.decryptText(resp.response));
              resolve(res);
            },
            (err) => {
              reject(err);
            }
          );
      });
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

  public GetIs_Remember(key) {
    const data = JSON.parse(localStorage.getItem("Is_Remember_Data"));
    if (data == null) {
      return 0;
    } else {
      return data[key];
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
}
