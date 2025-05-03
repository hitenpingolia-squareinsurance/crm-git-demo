import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BusinessComponent } from './business/business.component';
import { RenewalComponent } from './renewal/renewal.component';
import { OfflineQuoteComponent } from './offline-quote/offline-quote.component';
import { EndorsementComponent } from './endorsement/endorsement.component';
import { TicketComponent } from './ticket/ticket.component';
import { RecoveryComponent } from './recovery/recovery.component';
import { PosComponent } from './pos/pos.component';
import { PosActiveInactiveComponent } from './pos-active-inactive/pos-active-inactive.component';
import { GemsreportsComponent } from './gemsreports/gemsreports.component';
import { CashReportComponent } from './cash-report/cash-report.component';
import { BusniessReportComponent } from './Reports/busniess-report/busniess-report.component';


const routes: Routes = [
  { path: 'business', component: BusinessComponent },
  { path: 'business-reports', component: BusinessComponent },
  { path: 'business-reports-mongo', component: BusniessReportComponent },
  { path: 'renewal', component: RenewalComponent },
  { path: 'earning', component: BusinessComponent },
  { path: 'earning-reports', component: BusinessComponent },
  { path: 'policy-issuance', component: BusinessComponent },
  { path: 'policy-issuance-reports', component: BusinessComponent },
  { path: 'offline-quote', component: OfflineQuoteComponent },
  { path: 'offline-quote-pan-india', component: OfflineQuoteComponent },
  { path: 'offline-quote-reports', component: OfflineQuoteComponent },
  { path: 'endorsement', component: EndorsementComponent },
  // { path: 'endorsement', component: EndorsementComponent },
  { path: 'ticket', component: TicketComponent },
  { path: 'recovery', component: RecoveryComponent },
  { path: 'pos', component: PosComponent },
  { path: 'active-inactive-pos', component: PosActiveInactiveComponent },
  { path: 'active-inactive-pos-reports', component: PosActiveInactiveComponent },
  { path: 'pos-active-inactive', component: PosActiveInactiveComponent },
  { path: 'gems-reports', component: GemsreportsComponent },

  
  { path: '64VB-report', component: CashReportComponent },
  { path: '64VB-manager', component: CashReportComponent },
  
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class MisReportsRoutingModule { }
