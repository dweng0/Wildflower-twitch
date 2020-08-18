import * as BABYLON from 'babylonjs';
import { ArcRotateCamera, FollowCamera, FreeCamera} from 'babylonjs';
import { MapManifest } from './manifest';
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
    src: string
    assetType: AssetType
};

export interface GameCube {
    ready?: boolean,
    canvas?: HTMLCanvasElement | Nullable<HTMLCanvasElement> | Node
    scene?: BABYLON.Scene,
    engine?: BABYLON.Engine,
    camera?: FreeCamera,
    logs?: Array<Log>,
    console: Array<string>,
    assets?: Array<Asset>
    loadedAssets: any,
    characters?: Array<Character>,
    materials?: {
        map: MapManifest
    }
};