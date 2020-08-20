import * as BABYLON from 'babylonjs';
import { ArcRotateCamera, FollowCamera, FreeCamera} from 'babylonjs';
import { MapManifest } from './manifest';
import Peer from 'peerjs';
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

//todo extend this interface to include the character manifest
export interface Character {
    mesh: BABYLON.Mesh
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
    connection?: any
    connectionEvents?: {
        begin: () => void
        error?: (err: any) => void
        /** all data will pass through this */
        data?: (err: any) => void
        close?: (err: any) => void
    }
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
    characters?: Array<Character>,
    materials?: {
        map: MapManifest
    }

};