import { initializeDOM } from './generators/document';
import { initializeScene } from './generators/scene';
import { GameCube, Nullable, Character } from './interface/pipeline';
import { loadCharacters, createCharacterManifest } from './generators/character';
import { getManifests } from './generators/story';
import { fetchAssets } from './generators/assetfetcher';
import { isNil, update, isEmpty } from 'ramda';

import * as BABYLON from 'babylonjs';

const updateCharacterMovement = (character: Character) => {

  if (isNil(character.mesh)) {
    throw new Error('Mesh not defined for character!');
  }

  const { mesh, inputMap } = character;
  const maxSpeed = 4
  let playerIdle = true;
  let velocity = 1;

  Object.keys(inputMap).forEach(key => {
    if (inputMap[key]) {
      playerIdle = false;
    }
  });

  //create a velocity resetter:
  const resetVelocity = () => {
    velocity = 1;
  }

  if (playerIdle) {
    resetVelocity();
  } else {
    velocity = (velocity < maxSpeed) ? velocity + 1 : velocity;
  }
  const direction = new BABYLON.Vector3();

  const withVelocity = () => (velocity / Math.pow(10, 1));
  if (inputMap["w"]) {
    direction.z = 0.1 + withVelocity();
  }
  if (inputMap["a"]) {
    direction.x = -0.1 - withVelocity();
  }
  if (inputMap["s"]) {
    direction.z = -0.1 - withVelocity();
  }
  if (inputMap["d"]) {
    direction.x = 0.1 + withVelocity();
  }
  mesh.moveWithCollisions(direction);
}

const actionManagement = (cube: GameCube): void => {
  cube.log('setting up action manager...');
  if (isNil(cube.scene) || isNil(cube.peerId)) {
    throw new Error('Critical data missing');
  }

  const { scene, peerId, characters } = cube;

  //grab your character from the characters list
  const character = characters.filter(charManifest => charManifest.id === peerId);

  //throw if not found or malformed
  if (isEmpty(character) || isNil(character[0].inputMap)) {
    throw new Error('Could not find your character in the characters manifest, or its malformed');
  }

  //take the input mapper
  const inputMap = character[0].inputMap;

  //set up action management for your characters' inputs

  scene.actionManager = new BABYLON.ActionManager(scene);
  /**
   * Register key down and key up actions for your character
   */
  scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, (evt) => {
    inputMap[evt.sourceEvent.key] = (evt.sourceEvent.type === "keydown");
  }));
  scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, (evt) => {
    inputMap[evt.sourceEvent.key] = (evt.sourceEvent.type === "keydown");
  }));

  //setup an on before render observable that monitors charactor input map for each character
  scene.onBeforeRenderObservable.add(() => characters.forEach(updateCharacterMovement));
}
const run = () => {

  const log = ['Starting cube...'];
  let cube: GameCube = { console: log, loadedAssets: {}, characters: [], log: (msg) => log.push(msg) };

  //create the canvas, and input box, inject it into document
  cube = initializeDOM(cube);

  //load game manifest
  cube = getManifests(cube);
  cube.log('Awaiting connection event...');

  //await successful connection
  cube.connectionEvents = {
    begin: () => {
      cube.log('connection event started');
      //pretend the user has picked a map and its been provided here via some form of input...
      cube.mapRoot = 'stargazer';

      cube.log('loading scene')
      //create scene
      cube = initializeScene(cube);

      cube.log('fetching assets');
      //load up assets
      cube = fetchAssets(cube);

      cube.log('Loading chosen character assets');
      //assume this user has chosen a character
      cube.characters.push(createCharacterManifest({ id: cube.peerId }));

      //load other characters
      loadCharacters(cube);

      actionManagement(cube);
      //start the render loop
      const { engine, scene } = cube;

      cube.log('Rendering');
      engine?.runRenderLoop(() => scene?.render());

      //hook up window listeners
      window.addEventListener('resize', () => engine?.resize());
    }
  }
}

window.addEventListener('load', run);
