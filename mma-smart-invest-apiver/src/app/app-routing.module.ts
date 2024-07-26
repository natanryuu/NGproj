import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './components/index/index.component';
import { TrailCalcComponent } from './components/trail-calc/trail-calc.component';
import { SelectPlanComponent } from './components/trail-calc/select-plan/select-plan.component';
import { PlanResultsComponent } from './components/trail-calc/plan-results/plan-results.component';
import { BlankComponent } from './components/trail-calc/blank/blank.component';


const routes: Routes = [
  {
    path: 'trailcalc',
    component: TrailCalcComponent,
    children: [
      { path: '', component: SelectPlanComponent },
      { path: 'results/:activeplan', component: PlanResultsComponent },
      { path: 'process', component: BlankComponent },
    ]
  },
  { path: '', component: IndexComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
