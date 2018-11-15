import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { BreakoutService } from '../breakout.service';

@Component({
  selector: 'app-breakout',
  templateUrl: './breakout.component.html',
  styleUrls: ['./breakout.component.scss']
})
export class BreakoutComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas') canvas;
  start() {
    this.service.createGame(this.canvas.getContext('2d'));
  }
  continue() {
    this.service.pause$.next({ a: 1 });
    this.service.continue$.next();
  }
  pause() {
    this.service.pause$.next();
  }
  constructor(private service: BreakoutService) { }
  ngAfterViewInit() {
    this.canvas = this.canvas.nativeElement;
    this.canvas.width = this.service.config.CANVAS_WIDTH;
    this.canvas.height = this.service.config.CANVAS_HEIGHT;
    this.canvas.style.border = '1px solid #ccc';
    this.canvas.style.background = '#eee';
  }
  ngOnInit() { }

}
