import { ThrowStmt } from "@angular/compiler";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { trim } from "jquery";
import { ApiService } from "../../providers/api.service";
import { SocketioService } from "../../providers/socketio.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { PopupexamconfirmComponent } from "../popupexamconfirm/popupexamconfirm.component";

@Component({
  selector: "app-examstartpage",
  templateUrl: "./examstartpage.component.html",
  styleUrls: ["./examstartpage.component.css"],
})
export class ExamstartpageComponent implements OnInit {
  Training_Type: string;
  ShowAllQuestions: any;
  TotalQuestions: any;
  CurrentQuestionRunning: number = 1;
  Answer1Radio1: any = "";
  Answer1Radio2: any = "";
  Answer1Radio3: any = "";
  Answer1Radio4: any = "";
  RadioAnswer: any = "";
  QuestionShow: any;
  Option1: any;
  Option3: any;
  Option2: any;
  Option4: any;
  AttemptQuestion: any = "";
  Training_Time: any = "00:00:00";
  Current_Time: any = "00:00:00";
  ExamCompleted: any;
  TimesInetrvals: any;
  RadioBtn: boolean = true;
  RadioBtn1: boolean = false;
  RadioBtn2: boolean = false;
  RadioBtn3: boolean = false;
  RadioBtn4: boolean = false;
  Q_Id: any;

  constructor(
    public api: ApiService,
    public socketService: SocketioService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.Training_Type = atob(
      this.activatedRoute.snapshot.paramMap.get("Type")
    );
    if (this.Training_Type == "Motor" || this.Training_Type == "Life") {
      this.SetupExamDetails();
      setTimeout(() => {
        if (this.Training_Type == "Motor") this.GetQuestionAnsweer(1);
        else this.GetQuestionAnsweer(51);
      }, 600);
      this.GetTimersUpdates();
      this.TimesInetrvals = setInterval(() => {
        this.GetTimersUpdates();
      }, 5000);
    } else {
      this.router.navigate(["Logoutweb"]);
    }

    if (document.getElementById("ExamDivLabelTraining"))
      document.getElementById("ExamDivLabelTraining").style.display = "none";
  }

  SetupExamDetails() {
    var Ids = this.api.GetUserData("Id");
    var Roles = this.api.GetUserType();

    this.api.IsLoading();
    this.api
      .HttpGetType(
        "Exam/exam?User_Id=" + Ids + "&Training_Type=" + this.Training_Type
      )
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["status"] == true) {
            this.ShowAllQuestions = result["data"]["question_datas"];
            this.TotalQuestions = result["data"]["TotalQuestions"];
          } else {
            this.api.Toast("Warning", result["msg"]);

            setTimeout(() => {
              this.router.navigate([result["data"]["Return"]]);
            }, 1000);
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
  }

  ChangeQuestionsNextPrev(CurrentQuestion: any, Q_Id = "") {
    var Ids = this.api.GetUserData("Id");
    var Roles = this.api.GetUserType();

    //alert(this.RadioAnswer); return false;

    // this.api.IsLoading();
    this.api
      .HttpGetType(
        "Exam/submit_answer/?User_Id=" +
          Ids +
          "&Training_Type=" +
          this.Training_Type +
          "&qid=" +
          CurrentQuestion +
          "&answer=" +
          btoa(this.RadioAnswer) +
          "&Q_Id=" +
          Q_Id
      )
      .then(
        (result) => {
          // this.api.HideLoading();

          if (result["status"] == true) {
            this.RadioAnswer = "";
            //  this.GetQuestionAnsweer(this.CurrentQuestionRunning);
            this.GetQuestionAnsweer(this.Q_Id);
          } else {
            this.api.Toast("Warning", result["msg"]);

            setTimeout(() => {
              this.router.navigate([result["data"]["Return"]]);
            }, 1000);
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
  }
  GetQuestionAnsweer(Qid: any) {
    var Ids = this.api.GetUserData("Id");
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "Exam/GetQuestionDetails/?Training_Type=" +
          this.Training_Type +
          "&Qid=" +
          Qid +
          "&User_Id=" +
          Ids
      )
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["status"] == true) {
            this.QuestionShow = result["data"]["question"];
            this.Option1 = result["data"]["option1"];
            this.Option2 = result["data"]["option2"];
            this.Option3 = result["data"]["option3"];
            this.Option4 = result["data"]["option4"];
            this.Q_Id = result["data"]["Q_Id"];

            if (result["data"]["AttemptQuestion"] == "") {
              this.AttemptQuestion = "";
            } else this.AttemptQuestion = result["data"]["AttemptQuestion"];

            this.RadioAnswer = this.AttemptQuestion;

            if (this.Option1 == this.RadioAnswer) {
              $("#radio-1").prop("checked", true);
            } else if (this.Option2 == this.RadioAnswer) {
              $("#radio-2").prop("checked", true);
            } else if (this.Option3 == this.RadioAnswer) {
              $("#radio-3").prop("checked", true);
            } else if (this.Option4 == this.RadioAnswer) {
              $("#radio-4").prop("checked", true);
            } else {
              $("#radio-1").prop("checked", false);
              $("#radio-2").prop("checked", false);
              $("#radio-3").prop("checked", false);
              $("#radio-4").prop("checked", false);
            }

            this.SetupExamDetails();
          } else {
            this.api.Toast("Warning", result["msg"]);
            this.QuestionShow = "";
            this.Option1 = "";
            this.Option2 = "";
            this.Option3 = "";
            this.Option4 = "";
            this.AttemptQuestion = "";

            setTimeout(() => {
              this.router.navigate([result["data"]["Return"]]);
            }, 1000);
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
  }
  GetTimersUpdates() {
    var Ids = this.api.GetUserData("Id");
    // this.api.IsLoading();
    this.api
      .HttpGetType(
        "Exam/checkTimers/?Training_Type=" +
          this.Training_Type +
          "&User_Id=" +
          Ids
      )
      .then(
        (result) => {
          // this.api.HideLoading();

          if (result["status"] == true) {
            this.Training_Time = result["data"]["TotalTimeExam"];
            this.Current_Time = result["data"]["CurrentUserExamTime"];
            this.ExamCompleted = result["data"]["ExamCompleted"];
            if (this.ExamCompleted == "Yes") {
              this.api.Toast("Warning", "Your Exam Time has completed");
              clearInterval(this.TimesInetrvals);
              setTimeout(() => {
                this.router.navigate([
                  "Agent/ExamResult/" + btoa(this.Training_Type),
                ]);
              }, 2000);
            }
          } else {
            setTimeout(() => {
              this.router.navigate([result["data"]["Return"]]);
            }, 1000);
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
  }

  MangeQuestionNextPre(Type: any, Q_Id: any) {
    var CurrentQuestion = this.CurrentQuestionRunning;

    var CurrentQuestion = parseInt(this.Q_Id);

    if (Type == "N") {
      this.Q_Id = parseInt(this.Q_Id) + 1;
      this.CurrentQuestionRunning = this.CurrentQuestionRunning + 1;
    } else if (Type == "P") {
      this.Q_Id = parseInt(this.Q_Id) - 1;
      this.CurrentQuestionRunning = this.CurrentQuestionRunning - 1;
    }

    // alert(CurrentQuestion+' '+this.CurrentQuestionRunning+' '+this.Q_Id+' '+Q_Id);
    this.ChangeQuestionsNextPrev(CurrentQuestion, Q_Id);
  }
  RadioValueSet(e: any, Valye) {
    this.RadioAnswer = Valye;
  }

  ClickAllQuestion(Qno: any, Qid: any) {
    this.CurrentQuestionRunning = Qno;
    // this.GetQuestionAnsweer(this.CurrentQuestionRunning);
    this.GetQuestionAnsweer(Qid);
    //alert(Qno+' '+Qid);
  }

  OpenConfirmSubmitExam() {
    var Ids = this.api.GetUserData("Id");
    const dialogRef = this.dialog.open(PopupexamconfirmComponent, {
      width: "30%",
      height: "50%",
      data: {
        User_id: Ids,
        Training_Type: this.Training_Type,
        Intervals: this.TimesInetrvals,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(result);
    });
  }
}
