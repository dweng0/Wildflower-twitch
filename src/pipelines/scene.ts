import * as BABYLON from 'babylonjs';
import { pipe, isNil } from 'ramda';
import { GameCube } from '../interface/pipeline';
import { Nullable } from 'babylonjs';

const sceneEnrichment = (cube: GameCube) => { 
  console.debug('Scene enrichment begin');
  return cube;
}
/**
 * Add engine to the cube
 * @param cube object
 */
const getEngine = (cube: GameCube): GameCube => {
  if (isNil(cube.canvas)) {
    throw new Error('Canvas has not been set!');
  }
  cube.engine = new BABYLON.Engine(cube.canvas as Nullable<HTMLCanvasElement>);
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

const attachCamera = (cube: GameCube): GameCube => { 
  if (isNil(cube.scene)) {
    throw new Error('No Scene was defined');
  }
  cube.camera = new BABYLON.ArcRotateCamera('camera', Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(0, 0, 5), cube.scene);
  return cube
}

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

export const initializeScene = pipe(
  sceneEnrichment,
  getEngine,
  createScene,
  attachCamera,
  createLighting,
);