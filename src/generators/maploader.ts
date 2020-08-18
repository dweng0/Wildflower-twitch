import * as BABYLON from 'babylonjs';
import * as CANNON from "cannon";

import { pipe, isNil } from 'ramda';

import { GameCube } from '../interface/pipeline';

/**
 * Configs
 */
import gravity from '../assets/world/gravity.json';

const mapLoader = (cube: GameCube) => { 
  console.debug('Map loader begin');
  return cube;
}

//add physics
const addPhysics = (cube: GameCube): GameCube => {
  const gravityVector = new BABYLON.Vector3(gravity.x, gravity.y, gravity.z);
  const physics = new BABYLON.CannonJSPlugin();
  cube.scene?.enablePhysics(gravityVector, physics);

  // Create ground collider
  var ground = BABYLON.Mesh.CreateGround("ground1", 600, 600, 2, cube.scene);
  ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.5, restitution: 0.7 }, cube.scene);

  return cube;
};

//add Heightmap
//todo


export const loadMap = pipe(
  mapLoader,
  addPhysics
);