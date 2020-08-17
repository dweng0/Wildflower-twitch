import { pipe } from 'ramda';
import { GameCube } from '../interface/pipeline';

/**
* Handles the creation and injection of canvas object
*/
const createCanvas = (): GameCube => {
  const canvas = document.createElement('canvas') as HTMLCanvasElement;
  canvas.width = 1024;
  canvas.height = 768;
  return {canvas};
};

/**
* injects into the document, returns the cube
*/
const injectCanvas = (cube: GameCube):GameCube => {
  document.getElementsByTagName('body')[0].appendChild(cube.canvas as HTMLCanvasElement);
  console.log('created canvas, injected into document');
  return cube;
}

export const initializeDOM = pipe(createCanvas, injectCanvas);