import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { HighchartsChartModule } from 'highcharts-angular';
import { CountUpModule } from 'countup.js-angular2';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { CookieService } from 'ngx-cookie-service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexComponent } from './components/index/index.component';
import { LoadingComponent } from './components/modal/loading/loading.component';
import { ModalComponent } from './components/modal/modal.component';
import { TrailCalcComponent } from './components/trail-calc/trail-calc.component';
import { SelectPlanComponent } from './components/trail-calc/select-plan/select-plan.component';
import { ValueAdjustsComponent } from './components/modal/value-adjusts/value-adjusts.component';
import { MessagesComponent } from './components/modal/messages/messages.component';
import { SetPlanNameComponent } from './components/modal/set-plan-name/set-plan-name.component';
import { PlanResultsComponent } from './components/trail-calc/plan-results/plan-results.component';
import { BlankComponent } from './components/trail-calc/blank/blank.component';
import { InitInputComponent } from './components/modal/init-input/init-input.component';
import { WarningsComponent } from './components/modal/warnings/warnings.component';
import { GtagModule } from 'angular-gtag';
import { SpInfoComponent } from './components/modal/sp-info/sp-info.component';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    LoadingComponent,
    ModalComponent,
    TrailCalcComponent,
    SelectPlanComponent,
    ValueAdjustsComponent,
    MessagesComponent,
    SetPlanNameComponent,
    PlanResultsComponent,
    BlankComponent,
    InitInputComponent,
    WarningsComponent,
    SpInfoComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    CountUpModule,
    HighchartsChartModule,
    BrowserAnimationsModule,
    MatSliderModule,
    ScrollToModule.forRoot(),
    HttpClientModule,
    AppRoutingModule,
    GtagModule.forRoot ({ trackingId: 'AW-673706497' , trackPageviews: true })
  ],
  providers: [
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
