import * as BABYLON from 'babylonjs';
import { ArcRotateCamera, FollowCamera, FreeCamera} from 'babylonjs';
import { MapManifest } from './manifest';
import Peer, { DataConnection } from 'peerjs';
/** Alias type for value that can be null */
export type Nullable<T> = T | null;

export enum Level {
    info,
    error,
    warning
};

export enum AssetType {
    character,
    map,
    terrain,
    skybox,
    heightMap
}

export interface Log {
    state: Level,
    message: string
}

export interface Position {
    x: number,
    y: number,
    z: number
}

//todo extend this interface to include the character manifest
export interface Character {
    id: string,
    mesh?: BABYLON.Mesh,
    //todo add assets, for now, load as sphere
    assets: any,
    position:Position
}

export interface Asset { 
    name: string,
    source: string
};

export enum Matchmaker {
    host,
    join
}

export interface GameCube {
    gameId?: string,
    peers?: Array<string>
    peer?: Peer,
    peerId?: string,
    connection?: DataConnection,
    connectionEvents?: {
        begin: () => void
    },
    actions?:{
        movement: (position: any) => void,
        clickEvent:  (position: any, action: any) => void
    },
    log: (msg: string) => void,
    consoleOutput?: HTMLElement,
    matchmaking?: Matchmaker
    ready?: boolean,
    canvas?: HTMLCanvasElement | Nullable<HTMLCanvasElement> | Node
    scene?: BABYLON.Scene,
    engine?: BABYLON.Engine,
    camera?: FreeCamera,
    logs?: Array<Log>,
    console: Array<string>,
    mapRoot?: string
    loadedAssets?: any,
    characters: Character[],
    materials?: {
        map: MapManifest
    }

};