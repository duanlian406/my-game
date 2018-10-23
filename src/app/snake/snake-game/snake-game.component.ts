import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { SnakeService } from '../snake.service';
import { last, filter } from 'rxjs/operators';

@Component({
  selector: 'app-snake-game',
  templateUrl: './snake-game.component.html',
  styleUrls: ['./snake-game.component.scss']
})
export class SnakeGameComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas') canvas;
  ctx;
  isPause = false;
  isStart = false;
  result$;
  game$;
  start() {
    this.isStart = true;
    this.ctx.clearRect(0, 0, this.service.options.CANVAS_WIDTH, this.service.options.CANVAS_HEIGHT);
    this.service.tick$ = this.service.tick$.pipe(filter(_ => !this.isPause));
    this.game$ = this.service.createGame();
    this.game$.subscribe({
      next: scene => this.service.renderScene(scene, this.ctx),
      complete: _ => {
        this.service.renderGameOver(this.ctx);
        this.isStart = false;
      },
    });
    this.result$ = this.game$.pipe(last()).subscribe(scene => {
      this.ctx.fillStyle = 'yellow';
      this.ctx.font = '30px serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(`YOU GET ${scene.score} POINTS !`, this.service.options.CANVAS_WIDTH / 2, this.service.options.CANVAS_HEIGHT / 1.5);
    });
  }
  pause() {
    this.isPause = true;
  }
  continue() {
    this.isPause = false;
  }
  constructor(private service: SnakeService) { }
  ngAfterViewInit() {
    this.canvas = this.canvas.nativeElement;
    this.canvas.width = this.service.options.CANVAS_WIDTH;
    this.canvas.height = this.service.options.CANVAS_HEIGHT;
    this.canvas.style.background = this.service.options.BACKGROUND_COLOR;
    this.ctx = this.canvas.getContext('2d');
  }
  ngOnInit() {}
}
