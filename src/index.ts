import { initializeDOM } from './generators/document';
import { initializeScene } from './generators/scene';
import { GameCube } from './interface/pipeline';
import { loadCharacter } from './generators/character';
import { loadMap } from './generators/maploader';
import { loadAssets } from './generators/assetloader';
import { initializeP2P } from './generators/connection';
import { getManifests } from './generators/story';
import { fetchAssets } from './generators/assetfetcher';

const run = () => {
  //create the canvas, and input box, inject it into document
  let cube: GameCube = initializeDOM();

  
  //create or host the P2P connection
  cube = initializeP2P(cube);

  //load game manifest
  cube = getManifests(cube);
  console.log('here');
  
  //await successful connection
  cube.connectionEvents = {
    begin: () => {

      //pretend the user has picked a map and its been provided here via some form of input...
      cube.mapRoot = 'stargazer';

      //create scene
      cube = initializeScene(cube);

      //load up assets
      cube = fetchAssets(cube);
      
      //load based on this
      loadCharacter(cube);
      
      //start the render loop
      const { engine, scene } = cube;
      
      engine?.runRenderLoop(() => scene?.render());

      //hook up window listeners
      window.addEventListener('resize', () => engine?.resize());
    }
  }
}

window.addEventListener('load', run);
