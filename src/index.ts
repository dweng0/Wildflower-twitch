import { initializeDOM } from './generators/document';
import { initializeScene } from './generators/scene';
import { GameCube } from './interface/pipeline';
import { loadCharacters, createCharacterManifest } from './generators/character';
import { initializeP2P, initialPeerConnection } from './generators/connection';
import { getManifests } from './generators/story';
import { fetchAssets } from './generators/assetfetcher';

const run = () => {

  const log = ['Starting cube...'];
  let cube: GameCube = { console: log, loadedAssets: {}, characters: [],  log: (msg) => log.push(msg), secret:crypto.getRandomValues(new Uint32Array(1))[0].toString(), blockChain:[]};

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
