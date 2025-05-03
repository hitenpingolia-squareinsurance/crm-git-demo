import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { ApiService } from "src/app/providers/api.service";
import { DomSanitizer } from "@angular/platform-browser";

interface DataItem {
  add_stamp: string;
  subject: string;
  fromemail: string;
  toemail: string;
  message?: string;
}

@Component({
  selector: "app-recipients",
  templateUrl: "./recipients.component.html",
  styleUrls: ["./recipients.component.css"]
})

export class RecipientsComponent implements OnInit {
  dataAr: DataItem[] = [];
  type: any;
  isEmailVisible: boolean = true;
  isContentVisible: boolean = false;
  download: any;
  doc: any = 0;
  fileUrl: any;
  filename: any;

  constructor(
    public dialog: MatDialog,
    public api: ApiService,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<RecipientsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.type = this.data.type;
  }

  ngOnInit() {
    this.loadEmailDetails();
  }

  loadEmailDetails() {
    this.isEmailVisible = true;
    this.isContentVisible = false;

    let email = document.getElementById("email");
    email.classList.add("active");

    let content = document.getElementById("content");
    content.classList.remove("active");

    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     Authorization: this.api.GetToken()
    //   })
    // };

    const endpoint = `${environment.apiUrlBmsBase}/../v3/bulk/BulkMails/emaildetails?User_Id=${this.api.GetUserData("Id")}
    &User_Type=${this.api.GetUserType()}&User_Code=${this.api.GetUserData("Code")}&type=${this.type}`;

    this.http.post<any>(this.api.additionParmsEnc(endpoint), {}, this.api.getHeader(environment.apiUrlBmsBase)).subscribe((res:any) => {
    var resp = JSON.parse(this.api.decryptText(res.response));
      this.dataAr = resp.data;
      this.download = this.dataAr[0]["attachment"];
      this.filename = this.dataAr[0]["filename"];
      if (this.download) {
        this.doc = 1;
      } else {
        this.doc = 0;
      }
      const data = this.download;
      const blob = new Blob([data], {
        type: "application/octet-stream"
      });
      this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        window.URL.createObjectURL(blob)
      );
      this.api.HideLoading();
    });
  }

  loadContentPreview() {
    this.isEmailVisible = false;
    this.isContentVisible = true;

    let email = document.getElementById("email");
    email.classList.remove("active");

    let content = document.getElementById("content");
    content.classList.add("active");

    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     Authorization: this.api.GetToken()
    //   })
    // };

    const endpoint = `${
      environment.apiUrlBmsBase
    }/../v3/bulk/BulkMails/contentdetails?User_Id=${this.api.GetUserData(
      "Id"
    )}&User_Type=${this.api.GetUserType()}&User_Code=${this.api.GetUserData(
      "Code"
    )}&type=${this.type}`;

    this.http.post<any>(this.api.additionParmsEnc(endpoint), {}, this.api.getHeader(environment.apiUrlBmsBase)).subscribe((res:any) => {
    var resp = JSON.parse(this.api.decryptText(res.response));
      this.dataAr = resp.data || [];
      this.api.HideLoading();
    });
  }

  Download(fileName: any) {
    window.open(
      environment.apiUrlBmsBase +
        "/../v3/bulk/BulkMails/DownloadFile?login_type=" +
        this.api.GetUserType() +
        "&login_id=" +
        this.api.GetUserData("Id") +
        "&fileName=" +
        fileName
    );
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}

function saveAs(response: Blob, filename: string) {
  throw new Error("Function not implemented.");
}
