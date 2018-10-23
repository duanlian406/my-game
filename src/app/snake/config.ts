const COLS = 30;
const ROWS = 30;
const GAP_SIZE = 1;
const CELL_SIZE = 10;
const CANVAS_WIDTH = COLS * (CELL_SIZE + GAP_SIZE);
const CANVAS_HEIGHT = ROWS * (CELL_SIZE + GAP_SIZE);
const SNAKE_LENGTH = 5;
const APPLE_COUNT = 3;
const INIT_DIRECTION = { x: 1, y: 0 };
const FPS = 60;
const SPEED = 200;
const BACKGROUND_COLOR = '#CCC';
const SNAKE_COLOR = 'red';
const APPLE_COLOR = 'GREEN';
// tslint:disable-next-line:max-line-length
export const options = {
    COLS, ROWS,
    GAP_SIZE,
    CELL_SIZE,
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    SNAKE_LENGTH,
    INIT_DIRECTION,
    FPS, SPEED,
    APPLE_COUNT,
    BACKGROUND_COLOR,
    SNAKE_COLOR,
    APPLE_COLOR
};
