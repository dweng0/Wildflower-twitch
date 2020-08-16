import { pipe } from 'ramda';

/**
* Handles the creation and injection of canvas object
*/

const createCanvas = ():HTMLCanvasElement => document.createElement('canvas');

/**
* injjects into the document, returns the canvas
*/
const injectCanvas = (canvas: HTMLCanvasElement):HTMLCanvasElement => {
  document.getElementsByTagName('body')[0].appendChild(canvas);
  return canvas;
}

export const getCanvas: HTMLCanvasElement = pipe(
  createCanvas,
  injectCanvas
);
