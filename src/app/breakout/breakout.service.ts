import { Injectable } from '@angular/core';
import { timer, fromEvent, BehaviorSubject, combineLatest, Subject, interval } from 'rxjs';
// tslint:disable-next-line:max-line-length
import { pluck, filter, switchMap, takeUntil, scan, map, withLatestFrom, share, startWith, takeWhile, retryWhen, merge, delayWhen } from 'rxjs/operators';
import { animationFrame } from 'rxjs/internal/scheduler/animationFrame';

@Injectable()
export class BreakoutService {
  pause$ = new Subject();
  continue$ = new Subject();
  show = true;
  config;
  private tick$;
  private brick$;
  private paddle$;
  private ball$;
  private hit$;
  private score$;
  private direction$;
  private scene$;
  private wall$;
  private game$;
  createGame(ctx) {
    this.tick$ = timer(100, 1000 / this.config.FPS).pipe(
      merge(this.pause$.pipe(map(v => v.a))),
      retryWhen(obs$ => {
        return obs$.pipe(delayWhen(() => this.continue$));
      })
    );
    // tslint:disable-next-line:max-line-length
    this.wall$ = new BehaviorSubject([this.config.WALL_HEIGHT, this.config.CANVAS_WIDTH - this.config.WALL_HEIGHT, this.config.CANVAS_HEIGHT, this.config.WALL_HEIGHT]);
    this.paddle$ = fromEvent(document, 'keydown').pipe(
      merge(this.pause$.pipe(map(v => v.a))),
      retryWhen(obs$ => {
        return obs$.pipe(delayWhen(() => this.continue$));
      }),
      pluck('keyCode'),
      filter(c => c === 37 || c === 39),
      switchMap(c => {
        return timer(0, 1000 / this.config.FPS).pipe(takeUntil(fromEvent(document, 'keyup')));
      }, (outerValue) => {
        return outerValue === 37 ? { x: -this.config.PADDLE_SPEED, y: 0 } : { x: this.config.PADDLE_SPEED, y: 0 };
      }),
      scan((acc, cur) => {
        return { x: acc.x + cur.x, y: acc.y + cur.y };
      }, this.config.INIT_PADDLE_POSITION),
      map(pos => {
        // tslint:disable-next-line:max-line-length
        pos.x = Math.max(Math.min(pos.x, this.config.CANVAS_WIDTH - this.config.WALL_HEIGHT - this.config.PADDLE_WIDTH), this.config.WALL_HEIGHT);
        return pos;
      }),
      startWith(this.config.INIT_PADDLE_POSITION)
    );
    // tslint:disable-next-line:max-line-length
    this.direction$ = new BehaviorSubject(this.config.INIT_BALL_DIRECTION).pipe(scan((acc, cur) => ({ x: acc.x * cur.x, y: acc.y * cur.y }), { x: 1, y: 1 }));
    this.ball$ = this.tick$.pipe(
      withLatestFrom(this.direction$, (tick, direction) => {
        return direction;
      }),
      scan((acc, cur) => {
        return {
          x: acc.x + cur.x * this.config.BALL_SPEED,
          y: acc.y + cur.y * this.config.BALL_SPEED,
        };
      }, this.config.INIT_BALL_POSITION),
      withLatestFrom(this.paddle$, this.wall$, this.hitWall.bind(this)),
      share()
    );
    this.brick$ = this.ball$.pipe(scan(this.hitBrick.bind(this), this.generateBrick()));
    this.hit$ = new Subject();
    this.score$ = this.hit$.pipe(scan((acc, cur) => acc + cur, 0), startWith(0));
    // tslint:disable-next-line:max-line-length
    this.scene$ = combineLatest(this.ball$, this.paddle$, this.brick$, this.score$, (ball, paddle, brick, score) => ({ ball, paddle, brick, score }));
    this.game$ = interval(1000 / this.config.FPS, animationFrame).pipe(
      withLatestFrom(this.scene$, (_, scene) => {
        if (this.isGameOver(scene)) {
          throw (scene.score);
        }
        return scene;
      }),
      takeWhile(scene => !this.isComplete(scene)),
    );
    this.game$.subscribe(scene => {
      this.renderGame(scene, ctx);
      this.show = false;
    }, (err) => {
      this.renderGameOver(ctx, err);
      this.show = true;
    }, () => {
      this.show = true;
      this.renderComplete(ctx);
    });
  }
  private hitBrick(bricks, ball) {
    // tslint:disable-next-line:max-line-length
    const index = bricks.findIndex((v) => this.isCollision({ ...ball, r: this.config.BALL_RADIUS }, { ...v, w: this.config.BRICK_WIDTH, h: this.config.BRICK_HEIGHT }));
    if (index !== -1) {
      // tslint:disable-next-line:max-line-length
      const n = this.isCollision({ ...ball, r: this.config.BALL_RADIUS }, { ...bricks[index], w: this.config.BRICK_WIDTH, h: this.config.BRICK_HEIGHT });
      const direction = { x: 1, y: 1 };
      if (n === 3 || n === 1) {
        direction.y = -1;
      } else {
        direction.x = -1;
      }
      bricks.splice(index, 1);
      this.hit$.next(1);
      this.direction$.next(direction);
    }
    return bricks;
  }
  private hitWall(ball, paddle, wall) {
    // tslint:disable-next-line:max-line-length
    const n = this.isCollision({ ...ball, r: this.config.BALL_RADIUS }, { ...paddle, w: this.config.PADDLE_WIDTH, h: this.config.PADDLE_HEIGHT });
    const direction = { x: 1, y: 1 };
    if (n) {
      direction.y = -1;
    } else {
      if (ball.x - this.config.BALL_RADIUS <= wall[3] || ball.x + this.config.BALL_RADIUS >= wall[1]) {
        direction.x = -1;
      } else if (ball.y - this.config.BALL_RADIUS <= wall[0]) {
        direction.y = -1;
      }
    }
    this.direction$.next(direction);
    return ball;
  }
  private isCollision(ball, square) {
    const p = { x: null, y: null, direction: null };
    p.x = ball.x < square.x ? square.x : ball.x > square.x + square.w ? square.x + square.w : ball.x;
    p.y = ball.y < square.y ? square.y : ball.y > square.y + square.h ? square.y + square.h : ball.y;
    const dis = Math.sqrt(Math.pow(p.x - ball.x, 2) + Math.pow(p.y - ball.y, 2));
    if (dis <= ball.r) {
      if (p.y === square.y + square.h) {
        p.direction = 3;
      } else if (p.x === square.x) {
        p.direction = 4;
      } else if (p.x === square.x + square.w) {
        p.direction = 2;
      } else {
        p.direction = 1;
      }
      return p.direction;
    }
    return null;
  }
  private isGameOver(scene) {
    if (scene.ball.y > this.config.CANVAS_HEIGHT) {
      return true;
    }
    return false;
  }
  private isComplete(scene) {
    if (!scene.brick.length) {
      return true;
    }
    return false;
  }
  private drawPaddle(pos, ctx) {
    ctx.fillStyle = this.config.PADDLE_COLOR;
    ctx.fillRect(pos.x, pos.y, this.config.PADDLE_WIDTH, this.config.PADDLE_HEIGHT);
  }
  private drawBrick(arr, ctx) {
    arr.forEach(item => {
      ctx.strokeStyle = this.config.BRICK_COLOR;
      ctx.strokeRect(item.x, item.y, this.config.BRICK_WIDTH, this.config.BRICK_HEIGHT);
    });
  }
  private drawBall(pos, ctx) {
    ctx.beginPath();
    ctx.strokeStyle = this.config.BALL_COLOR;
    ctx.arc(pos.x, pos.y, this.config.BALL_RADIUS, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.fill();
  }
  private drawScore(score, ctx) {
    ctx.strokeStyle = 'blue';
    ctx.font = '60px serif';
    ctx.textAlign = 'center';
    ctx.strokeText(score, this.config.CANVAS_WIDTH / 2, this.config.CANVAS_HEIGHT / 2);
  }
  private renderGame({ ball, paddle, brick, score }, ctx) {
    ctx.clearRect(0, 0, this.config.CANVAS_WIDTH, this.config.CANVAS_HEIGHT);
    this.drawBall(ball, ctx);
    this.drawBrick(brick, ctx);
    this.drawPaddle(paddle, ctx);
    this.drawScore(score, ctx);
  }
  private renderGameOver(ctx, err) {
    ctx.clearRect(0, 0, this.config.CANVAS_WIDTH, this.config.CANVAS_HEIGHT);
    ctx.fillStyle = 'red';
    ctx.font = '50px serif';
    ctx.textAlign = 'center';
    ctx.fillText(`GAME OVER! YOU GOT ${err} POINTS`, this.config.CANVAS_WIDTH / 2, this.config.CANVAS_HEIGHT / 2);
  }
  private renderComplete(ctx) {
    ctx.clearRect(0, 0, this.config.CANVAS_WIDTH, this.config.CANVAS_HEIGHT);
    ctx.fillStyle = 'red';
    ctx.font = '40px serif';
    ctx.textAlign = 'center';
    ctx.fillText('CONGRATULATIONS TO COMPLETE THIS GAME!', this.config.CANVAS_WIDTH / 2, this.config.CANVAS_HEIGHT / 2);
  }
  private generateBrick() {
    return Array.apply(null, { length: this.config.BRICK_COLS * this.config.BRICK_ROWS }).map((v, i) => {
      const col = i % this.config.BRICK_COLS;
      const row = Math.floor(i / this.config.BRICK_COLS);
      return {
        x: this.config.WALL_HEIGHT + col * this.config.BRICK_WIDTH,
        y: this.config.WALL_HEIGHT + row * this.config.BRICK_HEIGHT
      };
    });
  }
  constructor(config) {
    this.config = config;
  }
}
