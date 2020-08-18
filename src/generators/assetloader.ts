import * as BABYLON from 'babylonjs';
import { GameCube } from '../interface/pipeline';
import { isNil, pipe } from 'ramda';
import { Physics } from '../interface/physics';
import { MapManifest } from '../interface/manifest';

/**
 * asset loading init
 * @param cube 
 */
export const assetLoaderInit = (cube: GameCube) => {
  console.log('Asset Loading pipeline ');
  return cube;
}

/**
 * Set the skybox for the game
 * @param cube 
 */
export const setSkyBox = (cube: GameCube) => {
  const { scene, materials } = cube;
  const map = materials?.map as MapManifest;
  if (isNil(scene)) {
    throw new Error('unable to create skybox, scene undefined');
  }

  let skybox = BABYLON.Mesh.CreateSphere("skyBox", 10, 2500, scene);
  let skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);

  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.disableLighting = true;

  skybox.material = skyboxMaterial;

  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(map.skyBox as string, scene);
  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
  skybox.renderingGroupId = 0;

  return cube;
}
/**
 * Sets the terrain and provides the physics and imposter and height map
 * loads assets from the gamecube 'ground'  key
 * @param cube 
 */
export const setTerrain = (cube: GameCube): GameCube => {
  const { materials } = cube;

  if (isNil(materials) || isNil(materials.map)) {
    throw new Error('No materials manifest found');
  };
  //load the manifest in!!!
  const map  = materials?.map as MapManifest;
  const physics = map.physics as Physics;
  const scene = cube.scene as BABYLON.Scene;
  const ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", map.heightMap, map.width, map.height, map.subDivisions, 0, 12, scene, true);
  const groundMaterial = new BABYLON.StandardMaterial('groundMaterial', scene);
        groundMaterial.diffuseTexture = cube.loadedAssets['ground'].texture;
        groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        ground.material = groundMaterial;
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.HeightmapImpostor, { mass: physics.mass, restitution: physics.restitution, friction: physics.friction }, scene);
  return cube;
}

export const loadCharacter = (cube: GameCube) => { 

}

export const loadAssets = pipe(
  assetLoaderInit,
  setTerrain,
  setSkyBox
);