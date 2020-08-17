import { initializeDOM } from './pipelines/dominjection';
import { initializeScene } from './pipelines/scene';
import { GameCube } from './interface/pipeline';
import { createCharacter } from './pipelines/characterbuilder';

const run = () => { 

  //initialize babylon, we have not set up controls yet
  const cube: GameCube = initializeScene(initializeDOM()) as GameCube;

  //some network stuff to get characters and manifests

  //load based on this
  createCharacter(cube);

  //start the render loop
  const { engine, scene } = cube;
  
  engine?.runRenderLoop(() => scene?.render());

  //hook up window listeners
  window.addEventListener('resize', () => engine?.resize());
}

window.addEventListener('load', run);
