import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreakoutComponent } from './breakout/breakout.component';
import { BreakoutRouteModule } from './breakout-route/breakout-route.module';
import { OPTIONS } from './config';
import { BreakoutService } from './breakout.service';

@NgModule({
  imports: [
    CommonModule,
    BreakoutRouteModule
  ],
  declarations: [BreakoutComponent],
  providers: [
    { provide: 'config', useValue: OPTIONS },
    { provide: BreakoutService, useFactory: (config) => new BreakoutService(config), deps: ['config'] }
  ]
})
export class BreakoutModule { }
