import { Component, OnInit, ViewChild, Inject } from "@angular/core";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { environment } from "../../../../environments/environment";
import { ApiService } from "../../../providers/api.service";
import { Router } from "@angular/router";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-club-criteria",
  templateUrl: "./club-criteria.component.html",
  styleUrls: ["./club-criteria.component.css"],
})
export class ClubCriteriaComponent implements OnInit {
  agent_id: any = 0;
  agent_name: any = "";
  cfy: any = [];
  lfy: any = [];
  lfy_total: any = [];
  growth_rate: any = [];
  check_int: any = [];
  lob_club: any = [];
  non_motor_novel: any = 0;
  non_motor_maker: any = 0;
  non_motor_elite: any = 0;
  health_novel: any = 0;
  health_maker: any = 0;
  health_elite: any = 0;
  credit_card_novel: any = 0;
  credit_card_maker: any = 0;
  credit_card_elite: any = 0;
  life_novel: any = 0;
  life_maker: any = 0;
  life_elite: any = 0;
  // travel_novel: any = 0;
  // travel_maker: any = 0;
  // travel_elite: any = 0;
  // pa_novel: any = 0;
  // pa_maker: any = 0;
  // pa_elite: any = 0;
  finance_novel: any = 0;
  finance_maker: any = 0;
  finance_elite: any = 0;
  mutual_fund_novel: any = 0;
  mutual_fund_maker: any = 0;
  mutual_fund_elite: any = 0;
  // real_estate_novel: any = 0;
  // real_estate_maker: any = 0;
  // real_estate_elite: any = 0;
  clubRewardData:any;

  constructor(
    public dialogRef: MatDialogRef<ClubCriteriaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public api: ApiService,
    private http: HttpClient,
    public formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.agent_id = this.data.agent_id;
    this.agent_name = this.data.agent_name;
    this.GetClubCriteriaData();
    this.GetClubRewardsCriteriaData();
  }

  //===== CLOSE MODAL =====//
  CloseModel(): void {
    this.dialogRef.close({
      Status: "Model Close",
    });
  }

  //===== GET CLUB CRITERIA DATA =====//
  GetClubCriteriaData() {
    const formData = new FormData();
    formData.append("agent_id", this.agent_id);
    formData.append("portal", "CRM");

    this.api
      .HttpPostTypeBms("dsr/DsrCommon/GetClubCriteria", formData)
      .then((result: any) => {
        if (result["status"] == true) {
          this.non_motor_novel = result["lob_club"]["non_motor_novel"];
          this.non_motor_maker = result["lob_club"]["non_motor_maker"];
          this.non_motor_elite = result["lob_club"]["non_motor_elite"];

          this.health_novel = result["lob_club"]["health_novel"];
          this.health_maker = result["lob_club"]["health_maker"];
          this.health_elite = result["lob_club"]["health_elite"];

          this.credit_card_novel = result["lob_club"]["credit_card_novel"];
          this.credit_card_maker = result["lob_club"]["credit_card_maker"];
          this.credit_card_elite = result["lob_club"]["credit_card_elite"];

          this.life_novel = result["lob_club"]["life_novel"];
          this.life_maker = result["lob_club"]["life_maker"];
          this.life_elite = result["lob_club"]["life_elite"];

          // this.travel_novel = result["lob_club"]["travel_novel"];
          // this.travel_maker = result["lob_club"]["travel_maker"];
          // this.travel_elite = result["lob_club"]["travel_elite"];

          // this.pa_novel = result["lob_club"]["pa_novel"];
          // this.pa_maker = result["lob_club"]["pa_maker"];
          // this.pa_elite = result["lob_club"]["pa_elite"];

          this.finance_novel = result["lob_club"]["finance_novel"];
          this.finance_maker = result["lob_club"]["finance_maker"];
          this.finance_elite = result["lob_club"]["finance_elite"];

          this.mutual_fund_novel = result["lob_club"]["mutual_fund_novel"];
          this.mutual_fund_maker = result["lob_club"]["mutual_fund_maker"];
          this.mutual_fund_elite = result["lob_club"]["mutual_fund_elite"];

          // this.real_estate_novel = result["lob_club"]["real_estate_novel"];
          // this.real_estate_maker = result["lob_club"]["real_estate_maker"];
          // this.real_estate_elite = result["lob_club"]["real_estate_elite"];
        }
      });
  }

  GetClubRewardsCriteriaData() {
    const formData = new FormData();
    formData.append("agent_id", this.agent_id);
    formData.append("portal", "CRM");

    this.api
      .HttpPostTypeBms("dsr/DsrCommon/GetClubRewardsCriteria", formData)
      .then((result: any) => {
        if (result["status"] == true) {
          this.clubRewardData = result["reward_club"];
        }
      });
  }
}
