import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnakeGameComponent } from './snake-game/snake-game.component';
import { SnakeRouteModule } from './snake-route/snake-route.module';
import { SnakeService } from './snake.service';
import { options } from './config';

@NgModule({
  imports: [
    CommonModule,
    SnakeRouteModule
  ],
  declarations: [SnakeGameComponent],
  providers: [
    { provide: 'config', useValue: options },
    { provide: SnakeService, useFactory: c => new SnakeService(c), deps: ['config'] }
  ]
})
export class SnakeModule { }
