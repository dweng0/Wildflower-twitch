import { initializeDOM } from './pipelines/dominjection';
import { initializeScene } from './pipelines/scene';
import { GameCube } from './interface/pipeline';
import { createCharacter } from './pipelines/characterbuilder';
import { loadMap } from './pipelines/maploader';

const run = () => { 

  //initialize babylon, we have not set up controls yet
  const cube: GameCube = initializeScene(initializeDOM()) as GameCube;

  //load mpp
  loadMap(cube);
  

  //load based on this
  createCharacter(cube);


  //start the render loop
  const { engine, scene } = cube;
  
  engine?.runRenderLoop(() => scene?.render());

  //hook up window listeners
  window.addEventListener('resize', () => engine?.resize());
}

window.addEventListener('load', run);
