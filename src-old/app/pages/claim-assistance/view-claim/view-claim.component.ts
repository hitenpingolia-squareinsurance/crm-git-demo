//import { Component, OnInit  } from '@angular/core';
import {
  AfterViewInit,
  Component,
  ViewChild,
  ViewChildren,
  ElementRef,
  QueryList,
  HostListener,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ApiService } from "../../../providers/api.service";
//import { SocketioService } from '../../../providers/socketio.service';
import { PusherService } from "../../../providers/pusher.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { StatusBoxComponent } from "../status-box/status-box.component";
import { ClaimDetailsComponent } from "../../../modals/claim-details/claim-details.component";
import { PolicydetailsComponent } from "../../../modals/policydetails/policydetails.component";
import { ViewSrDetailsComponent } from "../../../modals/view-sr-details/view-sr-details.component";

@Component({
  selector: "app-view-claim",
  templateUrl: "./view-claim.component.html",
  styleUrls: ["./view-claim.component.css"],
})
export class ViewClaimComponent implements AfterViewInit {
  @ViewChild("scrollframe", { static: false }) scrollFrame: ElementRef;
  @ViewChildren("item") itemElements: QueryList<any>;

  private itemContainer: any;
  private scrollContainer: any;
  private items = [];
  private isNearBottom = true;

  ChatForm: FormGroup;
  isSubmitted = false;
  currentSatatus = "";
  Claim_Id: any = 0;
  row: any = [];
  Messages: any = [];

  inputMessage: string = "";

  selectedFiles: File;
  Is_Attachement: string = "No";
  CurrentClaimStatus: any;

  LoginUserId: any;
  Bank: any = [];
  State: any = [];
  Citys: any = [];
  AccountType: any = [];

  constructor(
    public api: ApiService,
    //public socketService : SocketioService,
    private pusherService: PusherService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  ) {
    this.currentSatatus = "0";

    this.ChatForm = this.formBuilder.group({
      Message: [""],
    });

    this.LoginUserId = this.api.GetUserData("Id");
    this.Claim_Id = this.activatedRoute.snapshot.paramMap.get("Claim_Id");
    // console.log(this.Claim_Id);

    this.GetRow();

    // this.api.TargetComponent.subscribe(
    //   (page) => {

    //     // console.log(page);
    //     if (page == "Claim-Discussion") {
    //       this.GetRow();
    //     }
    //   },
    //   (err) => {}
    // );
  }

  ngAfterViewInit() {
    this.scrollContainer = this.scrollFrame.nativeElement;
    this.itemElements.changes.subscribe((_) => this.onItemElementsChanged());

    this.pusherService.channel.bind("new-message", (data) => {
      // // console.log(data.Message);

      var res = JSON.parse(data.Message);

      //// console.log(res.Sender_Id);
      //// console.log(res.Receiver_Id);
      //// console.log(res.Type);

      if (
        (res.Sender_Id == this.LoginUserId ||
          res.Receiver_Id == this.LoginUserId) &&
        res.Type == "Claim"
      ) {
        this.GetMessages();
      }
    });

    this.api.TargetComponent.subscribe(
      (page) => {
        // console.log(page);
        if (page == "Claim") {
          this.GetRow();
        }
      },
      (err) => {}
    );
  }

  private onItemElementsChanged(): void {
    if (this.isNearBottom) {
      this.scrollToBottom();
    }
  }

  private isUserNearBottom(): boolean {
    const threshold = 150;
    const position =
      this.scrollContainer.scrollTop + this.scrollContainer.offsetHeight;
    const height = this.scrollContainer.scrollHeight;
    return position > height - threshold;
  }

  scrolled(event: any): void {
    this.isNearBottom = this.isUserNearBottom();
  }
  private scrollToBottom(): void {
    this.scrollContainer.scroll({
      top: this.scrollContainer.scrollHeight,
      left: 0,
      behavior: "smooth",
    });
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
        // console.log("Extenstion is vaild !");
        var file_size = event.target.files[0]["size"];
        const Total_Size = Math.round(file_size / 1024);

        // console.log(Total_Size + " kb");

        if (Total_Size >= 1024 * 2) {
          // allow only 2 mb
          this.api.Toast("Warning", "File size is greater than 2 mb");
        } else {
          this.selectedFiles;
          this.Is_Attachement = "Yes";
          this.Send();
        }
      } else {
        // console.log("Extenstion is not vaild !");
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
      formData.append("Reference_No", this.row.Claim_Id);

      formData.append("CreateUser_Id", this.row.CreateUser_Id);
      formData.append("CreateUser_Type", this.row.CreateUser_Type);

      formData.append("CurrentUser_Id", this.row.CurrentUser_Id);
      formData.append("CurrentUser_Type", this.row.CurrentUser_Type);

      formData.append("Login_User_Id", this.api.GetUserData("Id"));
      formData.append("Login_User_Type", this.api.GetUserType());

      formData.append("Message", fields["Message"]);
      formData.append("Attachement", this.selectedFiles);
      formData.append("Is_Attachement", this.Is_Attachement);
      formData.append("Type", "Claim");

      this.ChatForm.reset();
      if (this.Is_Attachement == "Yes") {
        this.api.IsLoading();
      }

      this.api.HttpPostType("Chat/Send", formData).then(
        (result) => {
          if (this.Is_Attachement == "Yes") {
            this.api.HideLoading();
          }

          if (result["status"] == true) {
            //this.socketService.sendMessage({ Receiver_Id : this.row.CurrentUser_Id, Claim_Id:this.row.Id,Message:fields['Message']});

            this.Is_Attachement = "No";

            //this.api.Toast('Success',result['msg']);
          } else {
            //alert(result['message']);
            this.Is_Attachement = "No";
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
  }

  GetMessages() {
    //this.api.IsLoading();
    this.api
      .HttpGetType(
        "Chat/Messages?Reference_Id=" +
          this.row.Id +
          "&User_Id=" +
          this.api.GetUserData("Id") +
          "&Type=Claim"
      )
      .then(
        (result) => {
          //this.api.HideLoading();
          if (result["status"] == true) {
            //this.api.Toast('Success',result['msg']);
            this.Messages = result["Messages"];
            this.scrollToBottom();
          } else {
            //alert(result['message']);
            //this.api.Toast('Warning',result['msg']);
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

  get FC() {
    return this.ChatForm.controls;
  }

  GetRow() {
    this.api.IsLoading();
    this.api.HttpGetType("Claim/SingleData?Claim_Id=" + this.Claim_Id).then(
      (result) => {
        this.api.HideLoading();
        if (result["status"] == 1) {
          //this.api.Toast('Success',result['msg']);
          this.row = result["data"];

          if (this.row.Status == "1") {
            this.currentSatatus = "1";
          }
          this.GetMessages();
        } else {
          //alert(result['message']);
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
    this.CurrentClaimStatus = e.target.value;

    if (e.target.value == "0") {
    } else if (confirm("Are you sure !") == true) {
      this.api.IsLoading();
      this.api
        .HttpGetType(
          "Claim/UpdateStatus?Id=" +
            this.row.Id +
            "&Status=" +
            this.CurrentClaimStatus +
            "&User_Id=" +
            this.api.GetUserData("Id")
        )
        .then(
          (result) => {
            this.api.HideLoading();
            if (result["status"] == 1) {
              this.api.Toast("Success", result["msg"]);
              //this.row = result['data'];

              this.row.Status = this.CurrentClaimStatus;
              this.currentSatatus = "0";
              this.GetRow();
            } else {
              //alert(result['message']);
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
          }
        );
    }
  }

  UpdateClaimStatus1(e): void {
    // alert(Id);
    this.CurrentClaimStatus = e.target.value;
    // // console.log(Id,Status);
    if (this.CurrentClaimStatus == "0" || this.CurrentClaimStatus == "1") {
    } else {
      const dialogRef = this.dialog.open(StatusBoxComponent, {
        width: "50%",
        height: "35%",
        disableClose: true,
        data: { Id: this.row.Id, Status: this.CurrentClaimStatus },
      });

      dialogRef.afterClosed().subscribe((result: any) => {
        this.GetRow();
      });
    }
  }

  GetClaimDetails(Type: any) {
    const dialogRef = this.dialog.open(ClaimDetailsComponent, {
      width: "70%",
      height: "70%",
      disableClose: true,
      data: { Id: Type },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.GetRow();
    });
  }

  // GetPolicyDetails(Type: any) {
  //   const dialogRef = this.dialog.open(PolicydetailsComponent, {
  //     width: "70%",
  //     height: "70%",
  //     disableClose: true,
  //     data: { Id: Type },
  //   });

  //   dialogRef.afterClosed().subscribe((result:any) => {});
  // }

  GetPolicyDetails(Type: any) {
    // const dialogRef = this.dialog.open(PolicydetailsComponent, {
    //   width: "70%",
    //   height: "70%",
    //   disableClose: true,
    //   data: { Id: Type },
    // });
    const dialogRef = this.dialog.open(ViewSrDetailsComponent, {
      width: "75%",
      height: "75%",
      data: { Id: Type },
    });
    dialogRef.afterClosed().subscribe((result: any) => {});
  }
}
