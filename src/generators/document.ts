import { pipe, isEmpty } from 'ramda';
import { GameCube, Matchmaker } from '../interface/pipeline';
import { Chance } from 'chance';
import { initializeP2P } from './connection';


/**
* Handles the creation and injection of dom elements
*/

const chance = new Chance();
//the unique host id that will be used if the user decides to host
let hostId = chance.guid();

//apply regex
const createCanvas = (cube: GameCube): GameCube => {
  const canvas = document.createElement('canvas') as HTMLCanvasElement;
  canvas.width = 1024;
  canvas.height = 768;
    cube.canvas = canvas;
    return cube;
};

const createText = (cube: GameCube): GameCube => {
  const text = document.createElement('p') as HTMLParagraphElement;
  text.innerText = hostId;
  cube.log(`peer id is: ${hostId}`);
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
    cube.log('hosting a network');
    initializeP2P(cube);
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
    if(!input.value.trim()) {
        alert('please enter a host id.');
        return;
    }
    cube.gameId = input.value;
    cube.matchmaking = Matchmaker.join;
    cube.log(`Joining peer ${cube.gameId}`);
    initializeP2P(cube);
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
  cube.console.push('created canvas, injected into document');
  return cube;
}

/**
 * Setup element to inject console logs into
 */
const injectLogging = (cube: GameCube): GameCube => {

  //create a text area
  const pre = document.createElement("TEXTAREA") as HTMLTextAreaElement;
  pre.setAttribute('disabled', 'true');
  pre.value = '';
  pre.rows = 6;
  pre.style.width = '100%';

  //set up the log fn and make sure any pre existing logs are added to the element.
  cube.console.forEach((msg) => { pre.value = `${pre.value} \n ${msg}` } )

  cube.log = (msg: string) => {
    cube.console.push(msg);
    pre.value = `${msg} \n ${pre.value}`;
  }

  document.getElementsByTagName('body')[0].appendChild(pre);
  return cube;
}

export const initializeDOM = pipe(
  createCanvas,
  injectCanvas,
  createText,
  createHostButton,
  createJoinContent,
  injectLogging,
);