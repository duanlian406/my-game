import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponentComponent } from '../home-component/home-component.component';
import { PageNotFoundComponentComponent } from '../page-not-found-component/page-not-found-component.component';

const routes: Routes = [
  { path: 'home', component: HomeComponentComponent },
  { path: 'snake', loadChildren: '../snake/snake.module#SnakeModule' },
  { path: 'breakout', loadChildren: '../breakout/breakout.module#BreakoutModule' },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponentComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  declarations: []
})
export class AppRouteModule { }
