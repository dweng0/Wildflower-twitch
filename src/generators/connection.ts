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

const handlePeerConnection = (peer: Peer, cube: GameCube) => {
    peer.on('open', () => 
        peer.on('connection', (connection) => 
            onConnection(connection, cube)));
}

/**
 * Opens up a p2p connection
 * @param cube 
 */
export const initialPeerConnection = (cube: GameCube) => {
  const peer = new Peer(cube.peerId);
  cube.peer = peer;
  return cube;
}

/**
 * Handle the data event, pass it on to the peer folder module
 * @param connection Peerjs DataConnection Object
 */
const onConnection = (connection: DataConnection, cube: GameCube) => {
       //when a connection opens, we send a handshake
    sendHandShake(connection, cube.characters[0]);
    //todo handle errors
    //otherwise listen to the data events
    connection.on('data', (stream: PeerData) => { 
        console.log('data stream');
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
}
/**
 * Join p2p connection
 * @param cube 
 */
export const joinPeerNetwork = (cube: GameCube) => {
    const peer = getPeer(cube);
    handlePeerConnection(peer, cube);
    peer.connect(cube.gameId || 'peer id not set');
  return cube;
}

export const initializeP2P = pipe(
  initialPeerConnection,
  joinPeerNetwork
);