import Peer, { DataConnection } from 'peerjs';
import { GameCube, Matchmaker, Character } from '../interface/pipeline';
import { isNil, of, pipe, pick } from 'ramda';
import { loadCharacters } from './character';

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
 * Handle the data event, pass it on to the peer folder module
 * @param connection Peerjs DataConnection Object
 */
const onConnection = (cube: GameCube) => {

  const connection = cube.connection as DataConnection;

  connection.on('open', () => {
    connection.on('data', (stream: PeerData) => { 
        switch (stream.event) {
          case DataEventType.handshake:

            //todo take this into a separate file when ready
            const handShake = (cube: GameCube, character: Character) => {
              console.log('initialising handshake');
              
              //got a character, check we dont aleady have it...
              let foundCharr = cube.characters?.filter((char) => { return char.id !== character.id });

              //todo sanity check on the data provided (we only check for an ID, this could be dodgy!);
              if (isNil(foundCharr)) {
                console.log(`Character not found adding ${character.id}`);
                //at this point, there is no mesh. so load it here?
                //todo load character
                cube.characters?.push(character);
                
                //because we didn't have this char, we should send a handshake back with our details.

                //this assumes that our character is loaded, and that it always loads first.... assumptions are bad...
                const myChar = cube.characters[0] as Character;
                if(!isNil(myChar && myChar !== character)) {

                }
                const data: PeerData = {
                  event: DataEventType.handshake,
                  data: pick(['id', 'assets', 'position'], myChar)
                }
                cube.connection?.send(data);
              } else {
                  console.log('handshake ignored, character already loaded...');
              }
            }
            handShake(cube, stream.data);
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
    cube.console.push(`establishing connection with peer: ${connection.peer}`);
    cube.connection = connection;
  });
  return cube;
}

export const initializeP2P = pipe(
  initialPeerConnection,
  (cube: GameCube) => (cube.matchmaking === Matchmaker.join) ? recieveConnection(cube) : hostConnection(cube)
);