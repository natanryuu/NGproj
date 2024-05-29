import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './components/index/index.component';
import { AboutTargetComponent } from './components/about-target/about-target.component';
import { AboutModeComponent } from './components/about-mode/about-mode.component';
import { MethodAlgorithmComponent } from './components/method-algorithm/method-algorithm.component';
import { MethodBalanceComponent } from './components/method-balance/method-balance.component';
import { MethodFilterComponent } from './components/method-filter/method-filter.component';
import { CommonQuestionsComponent } from './components/common-questions/common-questions.component';
import { TrailCalcComponent } from './components/trail-calc/trail-calc.component';
import { SelectPlanComponent } from './components/trail-calc/select-plan/select-plan.component';
import { EntryComponent } from './components/trail-calc/entry/entry.component';

const routes: Routes = [
  { path: 'about/target', component: AboutTargetComponent},
  { path: 'about/mode', component: AboutModeComponent },
  { path: 'method/algorithm', component: MethodAlgorithmComponent },
  { path: 'method/balance', component: MethodBalanceComponent },
  { path: 'method/filter', component: MethodFilterComponent },
  { path: 'faq', component: CommonQuestionsComponent },
  {
    path: 'trailcalc',
    component: TrailCalcComponent,
    children: [
      { path: '', component: SelectPlanComponent },
      { path: 'assets-grow', component: EntryComponent },
      { path: 'retire-plan', component: EntryComponent },
      { path: 'shop-funds', component: EntryComponent },
      { path: 'buying-house', component: EntryComponent },
      { path: 'childs-edu', component: EntryComponent },
      { path: 'custom-plan', component: EntryComponent }
    ]
  },
  { path: '', component: IndexComponent},
  { path: '**', component: IndexComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
