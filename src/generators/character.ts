import { GameCube, Character, Position } from '../interface/pipeline';
import { isNil } from 'ramda';
import * as BABYLON from 'babylonjs';


export const createCharacterManifest = (characterData: any): Character => {
  return {
    id: characterData.id,
    position: { x:0, y:0, z:0},
    assets: {},
    inputMap: {}
  };
}

/**
 * Loads all the characters in our characters array, trys to put the chars on the map
 */
export const loadCharacters = (cube: GameCube) => {

  cube.log('Loading characters');

  if (isNil(cube.scene)) {
    throw new Error('Unable to create character, scene missing!');
  }

  if (isNil(cube.characters)) {
    throw new Error('No characters found to load...');
  }
  const buffer = 15;
  cube.characters = cube.characters.map<Character>((character: Character, index: number) => {
    const newChar = character;
    const { x, y, z } = character.position;
    const position = new BABYLON.Vector3(x + buffer, y, z);
    //todo look at assets to load stuff, for now load spheres
    newChar.mesh = BABYLON.MeshBuilder.CreateSphere(character.id, { diameter: 2 }, cube.scene);
    newChar.mesh.position = position;
    return newChar;
  });
}