import { initializeDOM } from './generators/document';
import { initializeScene } from './generators/scene';
import { GameCube } from './interface/pipeline';
import { loadCharacter } from './generators/character';
import { loadMap } from './generators/maploader';
import { loadAssets } from './generators/assetloader';

const run = () => { 

  //create the canvas, inject it into document
  let cube: GameCube = initializeDOM();

  //create scene
  cube = initializeScene(cube);

  //load up assets
  cube = loadAssets(cube);

  //get assets

  //load assets
  loadMap(cube);
  

  //load based on this
  loadCharacter(cube);

  //start the render loop
  const { engine, scene } = cube;
  
  engine?.runRenderLoop(() => scene?.render());

  //hook up window listeners
  window.addEventListener('resize', () => engine?.resize());
}

window.addEventListener('load', run);
