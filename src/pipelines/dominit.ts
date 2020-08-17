import { pipe } from 'ramda';
import { GameCube } from '../interface/pipeline';

/**
* Handles the creation and injection of canvas object
*/
const createCanvas = (): GameCube => {
  return { canvas: document.createElement('canvas') };
};

/**
* injects into the document, returns the cube
*/
const injectCanvas = (cube: GameCube):GameCube => {
  document.getElementsByTagName('body')[0].appendChild(cube.canvas);
  return cube;
}

export const initializeDOM = pipe(
  createCanvas,
  injectCanvas
);
