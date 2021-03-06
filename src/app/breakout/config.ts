const WALL_HEIGHT = 5;
const WALL_COLOR = 'black';
const BRICK_HEIGHT = 20;
const BRICK_WIDTH = 100;
const BRICK_COLS = 8;
const BRICK_ROWS = 5;
const BRICK_COLOR = 'green';
const CANVAS_WIDTH = WALL_HEIGHT * 2 + BRICK_WIDTH * BRICK_COLS;
const CANVAS_HEIGHT = WALL_HEIGHT * 2 + (BRICK_HEIGHT * BRICK_ROWS) * 5;
const PADDLE_HEIGHT = 10;
const PADDLE_WIDTH = 200;
const PADDLE_SPEED = 5;
const PADDLE_COLOR = 'blue';
const BALL_RADIUS = 10;
const BALL_SPEED = 3;
const BALL_COLOR = 'red';
const INIT_PADDLE_POSITION = {
    x: (CANVAS_WIDTH - PADDLE_WIDTH) / 2,
    y: CANVAS_HEIGHT - 10
};
const INIT_BALL_POSITION = {
    x: CANVAS_WIDTH / 2,
    y: INIT_PADDLE_POSITION.y - BALL_RADIUS
};
const INIT_BALL_DIRECTION = {
    x: 1,
    y: -1,
};
const FPS = 60;

export const OPTIONS = {
    WALL_HEIGHT,
    WALL_COLOR,
    BRICK_HEIGHT,
    BRICK_WIDTH,
    BRICK_COLS,
    BRICK_ROWS,
    BRICK_COLOR,
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    PADDLE_HEIGHT,
    PADDLE_WIDTH,
    PADDLE_SPEED,
    PADDLE_COLOR,
    BALL_RADIUS,
    BALL_COLOR,
    BALL_SPEED,
    INIT_PADDLE_POSITION,
    INIT_BALL_POSITION,
    INIT_BALL_DIRECTION,
    FPS
};

