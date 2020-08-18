import * as BABYLON from 'babylonjs';
import { ArcRotateCamera, FollowCamera, FreeCamera} from 'babylonjs';
/** Alias type for value that can be null */
export type Nullable<T> = T | null;

export enum Level {
    info,
    error,
    warning
};

export interface Log {
    state: Level,
    message: string
}

//todo extend this interface to include the character manifest
export interface Character {
    mesh: BABYLON.Mesh
}
export interface GameCube {
    canvas?: HTMLCanvasElement | Nullable<HTMLCanvasElement> | Node
    scene?: BABYLON.Scene,
    engine?: BABYLON.Engine,
    camera?: FreeCamera,
    logs?: Array<Log>,
    characters?: Array<Character>
};