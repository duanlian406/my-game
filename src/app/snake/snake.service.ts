import { Injectable } from '@angular/core';
import { fromEvent, timer, BehaviorSubject, combineLatest, interval } from 'rxjs';
import { map, filter, scan, startWith, withLatestFrom, share, distinctUntilChanged, takeWhile } from 'rxjs/operators';
import { animationFrame } from 'rxjs/internal/scheduler/animationFrame';

@Injectable()
export class SnakeService {
  options;
  tick$;
  private keydown$;
  private direction$;
  private length$;
  private snakeLength$;
  private snake$;
  private score$;
  private apple$;
  private scene$;
  private game$;
  private keycode(ev) {
    const direction = {
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down'
    };
    const option = {
      'left': { x: -1, y: 0 },
      'up': { x: 0, y: -1 },
      'right': { x: 1, y: 0 },
      'down': { x: 0, y: 1 }
    };
    return option[direction[ev.keyCode]];
  }
  private generateSnake(n) {
    return Array.apply(null, { length: n }).map((v, i) => ({ x: i, y: 0 }));
  }
  private snakeMove(snake, cur) {
    const [direction, length] = cur;
    const oHead = snake[snake.length - 1];
    const nHead = { x: oHead.x + direction.x, y: oHead.y + direction.y };
    nHead.x = nHead.x < 0 ? (this.options.COLS - 1) : nHead.x > (this.options.COLS - 1) ? 0 : nHead.x;
    nHead.y = nHead.y < 0 ? (this.options.ROWS - 1) : nHead.y > (this.options.ROWS - 1) ? 0 : nHead.y;
    // tslint:disable-next-line:no-unused-expression
    (length === snake.length) && snake.shift();
    snake.push(nHead);
    return snake;
  }
  private generateApple(n) {
    return Array.apply(null, { length: n }).map((v, i, arr) => this.getRandomCell([...this.generateSnake(this.options.SNAKE_LENGTH)]));
  }
  private eatApple(apples, snake) {
    const head = snake[snake.length - 1];
    if (this.checkCollision(head, apples)) {
      const i = apples.findIndex(apple => apple.x === head.x && apple.y === head.y);
      apples.splice(i, 1);
      apples.push(this.getRandomCell([...snake, ...apples]));
      this.length$.next(1);
    }
    return apples;
  }
  private checkCollision(head, apples) {
    return apples.some(apple => apple.x === head.x && apple.y === head.y);
  }
  private getRandomCell(arr) {
    const r = { x: this.random(0, this.options.COLS - 1), y: this.random(0, this.options.ROWS - 1) };
    return this.checkCollision(r, arr) ? this.getRandomCell(arr) : r;
  }
  private random(n, m) {
    return Math.floor(Math.random() * (m - n + 1) + n);
  }
  private isGameOver(scene) {
    const head = scene.snake[scene.snake.length - 1];
    return this.checkCollision(head, scene.snake.slice(0, scene.snake.length - 1));
  }
  renderScene(scene, ctx) {
    ctx.clearRect(0, 0, this.options.CANVAS_WIDTH, this.options.CANVAS_HEIGHT);
    this.drawSnake(scene.snake, ctx);
    this.drawApple(scene.apple, ctx);
    this.drawScore(scene.score, ctx);
  }
  renderGameOver(ctx) {
    ctx.clearRect(0, 0, this.options.CANVAS_WIDTH, this.options.CANVAS_HEIGHT);
    ctx.fillStyle = 'red';
    ctx.font = '50px serif';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', this.options.CANVAS_WIDTH / 2, this.options.CANVAS_HEIGHT / 2);
  }
  private drawSnake(snakes, ctx) {
    ctx.fillStyle = this.options.SNAKE_COLOR;
    snakes.forEach(snake => {
      ctx.fillRect(
        snake.x * (this.options.CELL_SIZE + this.options.GAP_SIZE),
        snake.y * (this.options.CELL_SIZE + this.options.GAP_SIZE),
        this.options.CELL_SIZE,
        this.options.CELL_SIZE
      );
    });
  }
  private drawApple(apples, ctx) {
    ctx.fillStyle = this.options.APPLE_COLOR;
    apples.forEach(apple => {
      ctx.fillRect(
        apple.x * (this.options.CELL_SIZE + this.options.GAP_SIZE),
        apple.y * (this.options.CELL_SIZE + this.options.GAP_SIZE),
        this.options.CELL_SIZE,
        this.options.CELL_SIZE
      );
    });
  }
  private drawScore(scores, ctx) {
    ctx.strokeStyle = 'blue';
    ctx.font = '60px serif';
    ctx.textAlign = 'center';
    ctx.strokeText(scores, this.options.CANVAS_WIDTH / 2, this.options.CANVAS_HEIGHT / 2);
  }
  createGame() {
    this.keydown$ = fromEvent(document, 'keydown');
    this.direction$ = this.keydown$.pipe(
      map(this.keycode),
      filter(d => !!d),
      startWith(this.options.INIT_DIRECTION),
      scan((acc, cur) => (cur.x === -acc.x || cur.y === -acc.y) ? acc : cur),
      distinctUntilChanged()
    );
    this.length$ = new BehaviorSubject(this.options.SNAKE_LENGTH);
    this.snakeLength$ = this.length$.pipe(
      scan((acc, cur) => acc + 1),
      share()
    );
    this.score$ = this.snakeLength$.pipe(
      startWith(0),
      scan((acc, cur) => acc + 1)
    );
    this.snake$ = this.tick$.pipe(
      withLatestFrom(this.direction$, this.snakeLength$, (_, direction, snakeLength) => [direction, snakeLength]),
      scan(this.snakeMove.bind(this), this.generateSnake(this.options.SNAKE_LENGTH)),
      share()
    );
    this.apple$ = this.snake$.pipe(
      scan(this.eatApple.bind(this), this.generateApple.bind(this)(this.options.APPLE_COUNT)),
      distinctUntilChanged(),
    );
    this.scene$ = combineLatest(this.snake$, this.apple$, this.score$, (snake, apple, score) => ({ snake, apple, score }));
    this.game$ = interval(1000 / this.options.FPS, animationFrame).pipe(
      withLatestFrom(this.scene$, (_, scene) => scene),
      takeWhile(scene => !this.isGameOver(scene)),
    );
    return this.game$;
  }
  constructor(config) {
    this.options = config;
    this.tick$ = timer(1000, this.options.SPEED);
  }
}
