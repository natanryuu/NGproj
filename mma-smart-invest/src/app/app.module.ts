import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material';
import { HighchartsChartModule } from 'highcharts-angular';
import { CountUpModule } from 'countup.js-angular2';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexComponent } from './components/index/index.component';
import { AboutTargetComponent } from './components/about-target/about-target.component';
import { AboutModeComponent } from './components/about-mode/about-mode.component';
import { MethodAlgorithmComponent } from './components/method-algorithm/method-algorithm.component';
import { MethodBalanceComponent } from './components/method-balance/method-balance.component';
import { MethodFilterComponent } from './components/method-filter/method-filter.component';
import { CommonQuestionsComponent } from './components/common-questions/common-questions.component';
import { ModalComponent } from './components/modal/modal.component';
import { IndexSec2Component } from './components/modal/index-sec2/index-sec2.component';
import { IndexSec3Component } from './components/modal/index-sec3/index-sec3.component';
import { IndexSec4Component } from './components/modal/index-sec4/index-sec4.component';
import { TrailCalcComponent } from './components/trail-calc/trail-calc.component';
import { SelectPlanComponent } from './components/trail-calc/select-plan/select-plan.component';
import { LoadingComponent } from './components/trail-calc/loading/loading.component';
import { EntryComponent } from './components/trail-calc/entry/entry.component';
import { CommonDescComponent } from './components/trail-calc/common-desc/common-desc.component';
import { PlanAdjustsComponent } from './components/trail-calc/plan-adjusts/plan-adjusts.component';
import { PlanResultsComponent } from './components/trail-calc/plan-results/plan-results.component';
import { PlanInitInputComponent } from './components/trail-calc/plan-init-input/plan-init-input.component';
import { ModalAdjustsComponent } from './components/modal/modal-adjusts/modal-adjusts.component';
import { PlanAdjustsRetireComponent } from './components/trail-calc/plan-adjusts-retire/plan-adjusts-retire.component';
import { ModalAdjustsRetireComponent } from './components/modal/modal-adjusts-retire/modal-adjusts-retire.component';
import { PlanAdjustsCustomComponent } from './components/trail-calc/plan-adjusts-custom/plan-adjusts-custom.component';
import { ModalAdjustsCustomComponent } from './components/modal/modal-adjusts-custom/modal-adjusts-custom.component';
// import { ErrorLogHandler } from './services/error-log-handler';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    AboutTargetComponent,
    AboutModeComponent,
    MethodAlgorithmComponent,
    MethodBalanceComponent,
    MethodFilterComponent,
    CommonQuestionsComponent,
    ModalComponent,
    IndexSec2Component,
    IndexSec3Component,
    IndexSec4Component,
    TrailCalcComponent,
    SelectPlanComponent,
    LoadingComponent,
    EntryComponent,
    CommonDescComponent,
    PlanAdjustsComponent,
    PlanResultsComponent,
    PlanInitInputComponent,
    ModalAdjustsComponent,
    PlanAdjustsRetireComponent,
    ModalAdjustsRetireComponent,
    PlanAdjustsCustomComponent,
    ModalAdjustsCustomComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CountUpModule,
    HighchartsChartModule,
    BrowserAnimationsModule,
    MatSliderModule,
    ScrollToModule.forRoot(),
    HttpClientModule,
    AppRoutingModule
  ],
  // providers: [
  //   ErrorLogHandler,
  //   { provide: ErrorHandler, useClass: ErrorLogHandler }
  // ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
