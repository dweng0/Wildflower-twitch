import { GameCube } from '../interface/pipeline';
import { isNil } from 'ramda';
import * as BABYLON from 'babylonjs';

export const createCharacter = (cube: GameCube) => {
  if (isNil(cube.scene)) {
    throw new Error('Unable to create character, scene missing!');
  }
  if(isNil(cube.characters)) {
    cube.characters = [];
  }
  const character = { mesh: BABYLON.MeshBuilder.CreateSphere('sphere', { diameter: 2 }, cube.scene) };
  cube.characters.push(character);
}