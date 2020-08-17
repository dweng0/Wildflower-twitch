
import { CharacterManifest } from './manifest';

import { Engine, Scene, Mesh } from 'babylonjs';

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
    canvas: HTMLCanvasElement,
    scene?: BABYLON.Scene,
    engine?: BABYLON.Engine,
    logs?: Array<Log>,
    characters?: Array<Character>
};