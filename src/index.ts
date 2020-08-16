import { pipe } from 'ramda';

/**
* Handles the creation and injection of canvas object
*/

export const createCanvas = ():HTMLElement => document.createElement('canvas');

/**
* injjects into the document, returns the canvas
*/
export const injectCanvas = (canvas: HTMLElement):HTMLElement => {
  document.getElementsByTagName('body')[0].appendChild(canvas);
  return canvas;
}

export const getCanvas = pipe(
  createCanvas,
  injectCanvas
);
