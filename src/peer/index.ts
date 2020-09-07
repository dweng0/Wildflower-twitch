import { GameCube, Character } from "../interface/pipeline";
import { PeerData, DataEventType } from '../generators/connection';
import { pick, isNil } from "ramda";
import { DataConnection } from "peerjs";

/**
 * Handles sending the handshake request
 */
export const sendHandShake = (connection: DataConnection, data: any) => {  
  const dataStream: PeerData = {
    event: DataEventType.handshake,
    data: pick(['id', 'assets', 'position'], data)
  }
  connection.send(dataStream);
};

/**
 * 
 * @param connection setup the communication methods to be used by the game
 * @param cube 
 */
export const setupPeerMethods = (connection: DataConnection, cube: GameCube): void => {
  cube.log('Setting up actions...');
  cube.actions = {
    movement: (position: any) => connection.send({ event: DataEventType.move, data: position }),
    clickEvent: (position: any, action: any) => connection.send({ event: DataEventType.action, data: { ...position, ...action } })
  }
};

/**
 * Handles receiving the handshake request
 */
export const receiveHandShake = (cube: GameCube, character: Character) => {
  cube.log(`received a handshake from ${character.id}`);

  //got a character, check we dont aleady have it...
  let foundCharr = cube.characters?.filter((char) => { return char.id !== character.id });

  //todo sanity check on the data provided (we only check for an ID, this could be dodgy!);
  if (isNil(foundCharr)) {
    cube.log(`Character not found adding ${character.id}`);
    //at this point, there is no mesh. so load it here?
    //todo load character
    cube.characters?.push(character);

    //because we didn't have this char, we should send a handshake back with our details.

    //this assumes that our character is loaded, and that it always loads first.... assumptions are bad...
    const myChar = cube.characters[0] as Character;
    if (!isNil(myChar && myChar !== character)) {

    }
    const data: PeerData = {
      event: DataEventType.handshake,
      data: pick(['id', 'assets', 'position'], myChar)
    }
    cube.connection?.send(data);
  } else {
    cube.log('handshake ignored, character already loaded...');
  }
}