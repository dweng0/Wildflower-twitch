import * as BABYLON from 'babylonjs';
import { pipe, isNil } from 'ramda';
import { GameCube } from '../interface/pipeline';
import { Nullable } from 'babylonjs';

/**
 * Configs
 */
import followCameraConfig from '../assets/camera/follow.json';
import gravity from '../assets/world/gravity.json';
import { loadAssets } from './assetloader';

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

/**
 * At some point we need to change the camera type here.
 * @param cube 
 */
const attachCamera = (cube: GameCube): GameCube => { 
  if (isNil(cube.scene)) {
    throw new Error('No Scene was defined');
  }
  
  cube.camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), cube.scene) as BABYLON.FreeCamera;
  cube.camera.setTarget(BABYLON.Vector3.Zero());
  cube.camera.attachControl(cube.canvas as HTMLCanvasElement, true);
  return cube
}

//add physics
const addPhysics = (cube: GameCube): GameCube => {
  const gravityVector = new BABYLON.Vector3(gravity.x, gravity.y, gravity.z);
  const physics = new BABYLON.CannonJSPlugin();
  cube.scene?.enablePhysics(gravityVector, physics);

  // Create ground collider
  var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, cube.scene);
  ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.5, restitution: 0.7 }, cube.scene);

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

export const initializeScene = pipe(
  sceneEnrichment,
  getEngine,
  createScene,
  attachCamera,
  createLighting
);