import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BreakoutComponent } from '../breakout/breakout.component';

const routes: Routes = [
  { path: '', component: BreakoutComponent }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  declarations: []
})
export class BreakoutRouteModule { }
