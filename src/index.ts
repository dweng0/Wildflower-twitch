import { initializeDOM } from './generators/document';
import { initializeScene } from './generators/scene';
import { GameCube } from './interface/pipeline';
import { loadCharacters, createCharacterManifest } from './generators/character';
import { initializeP2P, initialPeerConnection } from './generators/connection';
import { getManifests } from './generators/story';
import { fetchAssets } from './generators/assetfetcher';

const run = () => {
    console.log('creating game cube');
    let cube: GameCube = { console: ['Canvas created'], loadedAssets: {}, characters: []};

    console.log('initializing dom');
  //create the canvas, and input box, inject it into document
    cube = initializeDOM(cube);

  //load game manifest
  cube = getManifests(cube);
  console.log('Awaiting connection event...');

  //await successful connection
  cube.connectionEvents = {
    begin: () => {
        console.log('connection event started');
      //pretend the user has picked a map and its been provided here via some form of input...
      cube.mapRoot = 'stargazer';

      console.log('loading scene')
      //create scene
      cube = initializeScene(cube);

      console.log('fetching assets');
      //load up assets
      cube = fetchAssets(cube);

      console.log('Loading chosen character assets');
      //assume this user has chosen a character
      cube.characters.push(createCharacterManifest({id:cube.peerId}));
      
      //load other characters
      loadCharacters(cube);
      
      //start the render loop
      const { engine, scene } = cube;
      
      console.log('Rendering');
      engine?.runRenderLoop(() => scene?.render());

      //hook up window listeners
      window.addEventListener('resize', () => engine?.resize());
    }
  }
}

window.addEventListener('load', run);
