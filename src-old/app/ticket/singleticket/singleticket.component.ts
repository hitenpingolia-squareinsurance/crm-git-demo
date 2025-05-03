import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ApiService } from "../../providers/api.service";
//import { SocketioService } from '../../providers/socketio.service';
import { PusherService } from "../../providers/pusher.service";
import { ClaimDetailsComponent } from "../../modals/claim-details/claim-details.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-singleticket",
  templateUrl: "./singleticket.component.html",
  styleUrls: ["./singleticket.component.css"],
})
export class SingleticketComponent implements OnInit {
  container: HTMLElement;
  ChatForm: FormGroup;
  isSubmitted = false;

  Ticket_Id: any = 0;
  row: any = [];
  Messages: any = [];

  inputMessage: string = "";

  selectedFiles: File;
  Is_Attachement: string = "No";
  CurrentTicketStatus: any;

  ShowUpdateStatusLabels: boolean = false;
  RedicrctBackYypes: string;
  CheckQuotationPopup: boolean = false;

  LoginUserId: any;

  constructor(
    public api: ApiService,
    //public socketService : SocketioService,
    private pusherService: PusherService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  ) {
    this.RedicrctBackYypes = activatedRoute.snapshot.url[0].path;
    this.ChatForm = this.formBuilder.group({
      Message: [""],
    });

    this.LoginUserId = this.api.GetUserData("Id");
  }

  ngOnInit() {
    //this.socketService.setupSocketConnection();
    this.Ticket_Id = this.activatedRoute.snapshot.paramMap.get("Ticket_Id");
    // console.log(this.Ticket_Id);
    this.GetRow();

    this.api.TargetComponent.subscribe(
      (page) => {
        // console.log(page)
        if (page == "Ticket") {
          this.GetRow();
        }
      },
      (err) => {}
    );

    this.pusherService.channel.bind("new-message", (data) => {
      // console.log(data.Message);

      var res = JSON.parse(data.Message);
      // console.log(res);
      // console.log(res.Sender_Id);
      // console.log(res.Receiver_Id);
      // console.log(res.Type);
      //alert(this.LoginUserId);
      if (res.Type == "Ticket") {
        this.GetMessages();
      }
    });
  }

  QuoteToWeb(Url) {
    var UserDatas = this.api.GetUserData("Id");
    var GetUserType = this.api.GetUserType();

    let a = document.createElement("a");
    a.target = "_blank";
    if (GetUserType == "employee") {
      a.href =
        this.api.ReturnWebUrl() +
        "/redirecting-session-users/" +
        GetUserType +
        "/" +
        btoa(UserDatas) +
        "?ReturnUrl=" +
        Url;

      // a.href =
      //   this.api.ReturnWebUrl() +
      //   "/Prequotes/SetSessionEmployee/login/" +
      //   btoa(UserDatas) +
      //   "?ReturnUrl=" +
      //   Url;
    } else {
      if (GetUserType == "user") {
        GetUserType = "agent";
      }

      a.href =
        this.api.ReturnWebUrl() +
        "/redirecting-session-users/" +
        GetUserType +
        "/" +
        btoa(UserDatas) +
        "?ReturnUrl=" +
        Url;

      // a.href =
      //   this.api.ReturnWebUrl() +
      //   "/agents/check/" +
      //   btoa(UserDatas) +
      //   "/" +
      //   btoa(GetUserType) +
      //   "/login?ReturnUrl=" +
      //   Url;
    }
    a.click();
  }

  // QuoteToWeb(Url) {
  //   var UserDatas = this.api.GetUserData("Id");
  //   var GetUserType = this.api.GetUserType();

  //   let a = document.createElement("a");
  //   a.target = "_blank";
  //   if (GetUserType == "employee") {
  //     a.href = Url;
  //   } else {
  //     a.href = Url;
  //   }
  //   a.click();
  // }

  get FC() {
    return this.ChatForm.controls;
  }

  GetRow() {
    this.api.IsLoading();
    this.api.HttpGetType("Ticket/SingleData?Ticket_Id=" + this.Ticket_Id).then(
      (result) => {
        this.api.HideLoading();
        if (result["status"] == 1) {
          this.row = result["data"];

          // console.log(	this.row );
          //  alert(this.row.Quotation_Details.gadi_type);

          if (this.row.TicketType == "1" || this.row.TicketType == "4")
            this.CheckQuotationPopup = true;

          if (
            parseInt(this.row.CurrentUser_Id) ==
              parseInt(this.api.GetUserData("Id")) &&
            this.RedicrctBackYypes == "all-tickets-assign"
          )
            this.ShowUpdateStatusLabels = true;

          this.CurrentTicketStatus = this.row.Status;

          this.GetMessages();
        } else {
          this.api.Toast("Warning", result["msg"]);
        }
      },
      (err) => {
        // Error log
        //// console.log(err);
        this.api.HideLoading();
        this.api.Toast(
          "Warning",
          "Network Error : " + err.name + "(" + err.statusText + ")"
        );
        //this.api.ErrorMsg('Network Error :- ' + err.message);
      }
    );
  }
  ViewDocument(url) {
    //alert(url);
    window.open(url, "", "left=100,top=50,width=800%,height=600");
  }

  UpdateClaimStatus(e) {
    const tempValue = e.target.value;
    if (tempValue == "") {
      this.api.Toast("Warning", "Select A Status..!");
      return false;
    }

    if (confirm("Are you sure !") == true) {
      this.CurrentTicketStatus = e.target.value;
      this.api.IsLoading();
      this.api
        .HttpGetType(
          "Ticket/UpdateStatus?Id=" +
            this.row.Id +
            "&Status=" +
            this.CurrentTicketStatus +
            "&User_Id=" +
            this.api.GetUserData("Id")
        )
        .then(
          (result) => {
            this.api.HideLoading();
            if (result["status"] == 1) {
              this.api.Toast("Success", result["msg"]);

              // this.row.Status =this.CurrentTicketStatus;
              this.GetRow();
            } else {
              this.api.Toast("Warning", result["msg"]);
            }
          },
          (err) => {
            this.api.HideLoading();
            this.api.Toast(
              "Warning",
              "Network Error : " + err.name + "(" + err.statusText + ")"
            );
          }
        );
    } else {
      //this.CurrentTicketStatus = 11;
    }
  }

  UploadAttachment(event) {
    this.selectedFiles = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      // console.log(this.selectedFiles);
      // console.log(this.selectedFiles.name);
      var str = this.selectedFiles.name;
      var ar = str.split(".");
      // console.log(ar);
      var ext;
      for (var i = 0; i < ar.length; i++) ext = ar[i].toLowerCase();
      // console.log(ext);

      if (ext == "png" || ext == "jpeg" || ext == "jpg" || ext == "pdf") {
        // console.log('Extenstion is vaild !');
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);

        // console.log(Total_Size+ ' kb');

        if (Total_Size >= 1024 * 2) {
          // allow only 2 mb
          this.api.Toast("Warning", "File size is greater than 2 mb");
        } else {
          this.selectedFiles;
          this.Is_Attachement = "Yes";
          this.Send();
        }
      } else {
        // console.log('Extenstion is not vaild !');
        this.api.Toast(
          "Warning",
          "Please choose vaild file ! ie :- PNG,JPEG,JPG,PDF"
        );
      }
    }
  }

  Send() {
    //// console.log(this.ChatForm.value);
    //// console.log(this.inputMessage);

    this.isSubmitted = true;
    if (this.ChatForm.invalid) {
      return;
    } else {
      var fields = this.ChatForm.value;

      if (this.Is_Attachement == "No") {
        if (fields["Message"] == "" || fields["Message"] == null) {
          return;
        }
      }
      const formData = new FormData();

      formData.append("Reference_Id", this.row.Id);
      formData.append("Reference_No", this.row.Ticket_Id);

      formData.append("CreateUser_Id", this.row.CreateUser_Id);
      formData.append("CreateUser_Type", this.row.CreateUser_Type);

      formData.append("CurrentUser_Id", this.row.CurrentUser_Id);
      formData.append("CurrentUser_Type", this.row.CurrentUser_Type);

      formData.append("Login_User_Id", this.api.GetUserData("Id"));
      formData.append("Login_User_Type", this.api.GetUserType());

      formData.append("Message", fields["Message"]);
      formData.append("Attachement", this.selectedFiles);

      formData.append("Is_Attachement", this.Is_Attachement);
      formData.append("Type", "Ticket");

      // console.log(formData);

      this.ChatForm.reset();
      this.api.HttpPostType("Chat/Send", formData).then(
        (result) => {
          if (result["status"] == true) {
            //this.socketService.sendMessage({ Receiver_Id : this.row.CurrentUser_Id, Claim_Id:this.row.Id,Message:fields['Message']});

            this.Is_Attachement = "No";

            //this.api.Toast('Success',result['msg']);
            //this.GetMessages();
          } else {
            //alert(result['message']);
            this.Is_Attachement = "No";
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          // Error log
          //// console.log(err);
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
          //this.api.ErrorMsg('Network Error :- ' + err.message);
        }
      );
    }
  }

  GetMessages() {
    //this.api.IsLoading();
    this.api
      .HttpGetType(
        "Chat/Messages?Reference_Id=" +
          this.row.Id +
          "&User_Id=" +
          this.api.GetUserData("Id") +
          "&Type=Ticket"
      )
      .then(
        (result) => {
          //this.api.HideLoading();
          if (result["status"] == 1) {
            //this.api.Toast('Success',result['msg']);
            this.Messages = result["Messages"];
            this.ScrollDown();
          } else {
            //alert(result['message']);
            //this.api.Toast('Warning',result['msg']);
          }
        },
        (err) => {
          // Error log
          //// console.log(err);
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
          //this.api.ErrorMsg('Network Error :- ' + err.message);
        }
      );
  }

  ScrollDown() {
    this.container = document.getElementById("directmessages");
    if (this.container.scrollHeight == 0) {
      this.container.scrollTop = 100;
    } else {
      this.container.scrollTop = this.container.scrollHeight;
    }
  }

  ShowQuotationDetails(Qid): void {
    //  alert(Qid);
    document.getElementById("QuoteIdBtn").click();
  }

  ShowMappingDetails(Qid): void {
    //    alert();
  }

  ViewDetailsPoupup(Quotation: any, Type: any) {
    if (Type == "7") {
      //claim
      const dialogRef = this.dialog.open(ClaimDetailsComponent, {
        width: "70%",
        height: "70%",
        disableClose: true,
        data: { Id: Quotation },
      });

      dialogRef.afterClosed().subscribe((result: any) => {});
    }

    if (Type == "8") {
      //Survey
      this.router.navigateByUrl("/survey/view-Details/" + Quotation);
    }

    if (Type == "9") {
      //Offline-Quote
      this.router.navigateByUrl(
        "/offline-quote/view-Details-quote/" + Quotation
      );
    }

    if (Type == "10") {
      //Cancellation
      // this.router.navigateByUrl('/offline-quote/view-Details-quote/'+Quotation);
    }

    if (Type == "11") {
      //Endorsement
      this.router.navigateByUrl("/endosment/view-details/" + Quotation);
    }
  }
}
