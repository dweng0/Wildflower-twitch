import Peer, { DataConnection } from 'peerjs';
import { GameCube, Matchmaker, Character } from '../interface/pipeline';
import { isNil, pipe, pick } from 'ramda';
import { receiveHandShake, sendHandShake } from '../peer';

/**
 * Different data types we expect to send to our peers
 */
export enum DataEventType {
  handshake,
  move,
  action,
  blockchain
}

export interface PeerData {
  event: DataEventType,
  data: any,
  ledger?: any
}

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
 * Handle the data event, pass it on to the peer folder module
 * @param connection Peerjs DataConnection Object
 */
const onConnection = (cube: GameCube) => {

  const connection = cube.connection as DataConnection;

  connection.on('open', () => {
      console.log(`connection opened with ${cube.gameId}`);
      //when a connection opens, we send a handshake
    sendHandShake(connection, cube.characters[0]);
    //todo handle errors
    //otherwise listen to the data events
    connection.on('data', (stream: PeerData) => { 
        switch (stream.event) {
          case DataEventType.handshake:
            receiveHandShake(cube, stream.data);
            break;
          case DataEventType.action:
            break;
          case DataEventType.move:
            break;
          case DataEventType.blockchain:
            break;
          default:
            break;
        }
    })
  });
}
/**
 * Join a p2p connection
 * @param cube 
 */
export const hostConnection = (cube: GameCube) => { 
  getPeer(cube).on('connection', (connection) => {
    console.log(`establishing connection with peer: ${connection.peer}`);
    cube.connection = connection;
    onConnection(cube);
  });
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
    onConnection(cube);
  } else {
    cube.console.push('No gameId provided');
  }
  return cube;
}


export const initializeP2P = pipe(
  initialPeerConnection,
  (cube: GameCube) => (cube.matchmaking === Matchmaker.join) ? recieveConnection(cube) : hostConnection(cube)
);