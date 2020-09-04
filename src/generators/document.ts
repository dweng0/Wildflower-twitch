import { pipe } from 'ramda';
import { GameCube, Matchmaker } from '../interface/pipeline';
import { Chance } from 'chance';


/**
* Handles the creation and injection of dom elements
*/

const chance = new Chance();
//the unique host id that will be used if the user decides to host
//let hostId = `${chance.name().replace(' ', '_').replace('.', '_')}_the_inquisitive_${chance.animal().replace(' ', '_').replace('.', '_')}_works_at_${chance.company().replace(' ', '_').replace('.', '_')}_as_an_aspiring_${chance.profession({ rank: true }).replace(' ', '_').replace('.', '_')}`;
let hostId = chance.name() + '_the_inquisitive_' + chance.animal() + 'works_at_' + chance.company() + '_as_an_aspiring_' + chance.profession();
hostId = hostId.replace(' ', '_');
hostId = hostId.replace('.', '');

const createCanvas = (): GameCube => {
  const canvas = document.createElement('canvas') as HTMLCanvasElement;
  canvas.width = 1024;
  canvas.height = 768;
  return { canvas, console: ['Canvas created'], loadedAssets: {}, characters: []};
};

const createText = (cube: GameCube): GameCube => {
  const text = document.createElement('p') as HTMLParagraphElement;
  text.innerText = hostId;
  console.log(`id is: ${hostId}`);
  document.getElementsByTagName('body')[0].appendChild(text);
  cube.gameId = hostId;
  cube.peerId = hostId;
  return cube;
};

const createHostButton = (cube: GameCube): GameCube => { 
  const btn = document.createElement('button') as HTMLButtonElement;
  btn.textContent = 'Host';
  btn.addEventListener('click', () => { 
    cube.gameId = hostId;
    cube.matchmaking = Matchmaker.host;
    alert('You have opted to host, share the host id with your friends, so they can join you');
    cube.connectionEvents?.begin();
  })
  document.getElementsByTagName('body')[0].appendChild(btn);
  return cube;
}

const createJoinContent = (cube: GameCube): GameCube => { 
  const body = document.getElementsByTagName('body')[0];

  //create input
  const input = document.createElement('input') as HTMLInputElement;
  input.placeholder = 'Enter a gameId';
  input.type = 'text';

  //and join button
  const btn = document.createElement('button') as HTMLButtonElement;
  btn.textContent = 'Join';

  btn.addEventListener('click', () => {
    cube.gameId = input.value;
    cube.matchmaking = Matchmaker.join;
    console.log('connecting to peer: ', cube.gameId);    
    cube.peer?.connect(cube.gameId);
    cube.connectionEvents?.begin();
  });

  body.appendChild(input);
  body.appendChild(btn);
  return cube;
}

/**
* injects into the document, returns the cube
*/
const injectCanvas = (cube: GameCube):GameCube => {
  document.getElementsByTagName('body')[0].appendChild(cube.canvas as HTMLCanvasElement);
  console.log('created canvas, injected into document');
  return cube;
}

export const initializeDOM = pipe(  
  createCanvas,
  injectCanvas,
  createText,
  createHostButton,
  createJoinContent,
);