import Peer from 'peerjs';
import { GameCube, Matchmaker } from '../interface/pipeline';
import { isNil, of, pipe } from 'ramda';

//https://peerjs.com/docs.html#dataconnection-on
const getPeer = (cube: GameCube): Peer => { 
  if (cube.peer) {
    return cube.peer;
  } else {
    throw new Error('P2P not ready');
  }
}

/**
 * Opens up a p2p connection
 * @param cube 
 */
export const initialPeerConnection = (cube: GameCube) => {
  const peer = new Peer(cube.peerId, { debug:3});
  if (isNil(cube.peers)) {
    cube.peers = [];
  }
  cube.peers.push(peer.id);
  peer.on('open', () => {
    console.log('Connection made');
  })
  cube.peer = peer;
  return cube;
}

/**
 * Hosts a p2p connection
 * @param cube 
 */
export const recieveConnection = (cube: GameCube) => {
  if (!isNil(cube.gameId)) {
    cube.console.push(`Attempting to connect to ${cube.gameId}`);
    cube.connection = getPeer(cube).connect(cube.gameId);
  } else {
    cube.console.push('No gameId provided');
  }
  return cube;
}

/**
 * Join a p2p connection
 * @param cube 
 */
export const hostConnection = (cube: GameCube) => { 
  getPeer(cube).on('connection', (connection) => {
    cube.console.push(`establishing connection with peer: ${connection.peer}`);
    cube.connection = connection;
  });
  return cube;
}

export const initializeP2P = pipe(
  initialPeerConnection,
  (cube: GameCube) => (cube.matchmaking === Matchmaker.join) ? recieveConnection(cube) : hostConnection(cube)
);