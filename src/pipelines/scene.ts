import * as BABYLON from 'babylonjs';
import { pipe, isNil } from 'ramda';
import { GameCube } from '../interface/pipeline';
import { initializeDOM } from './dominit';

/**
 * Add engine to the cube
 * @param cube object
 */
const getEngine = (cube: GameCube): GameCube => {
  cube.engine = new BABYLON.Engine(cube.canvas, true);
  return cube;
};

/**
 * Creates the scene, checks if engine exists, if not, throw
 * @param cube Create the scene
 */
const createScene = (cube: GameCube): GameCube => {
  if (isNil(cube.engine)) {
    throw new Error('No engine was defined!');
  }
  cube.scene = new BABYLON.Scene(cube.engine);
  return cube;
};

/**
 * Handle the lighting process
 * @param cube 
 */
const createLighting = (cube: GameCube): GameCube => { 
  if (isNil(cube.scene)) {
    throw new Error('No Scene was defined');
  }
  new BABYLON.HemisphericLight('l1', new BABYLON.Vector3(1, 1, 0), cube.scene);
  new BABYLON.PointLight('l2', new BABYLON.Vector3(0, 1, -1), cube.scene);
  return cube;
}

export const initializeScene = () => pipe(
  initializeDOM,
  getEngine,
  createScene,
  createLighting
);