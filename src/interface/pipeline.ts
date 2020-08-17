import * as BABYLON from 'babylonjs';

export enum Level {
    info,
    error,
    warning
};

export interface Log {
    state: Level,
    message: string
}
export interface GameCube {
    canvas: HTMLCanvasElement,
    scene?: BABYLON.Scene,
    engine?: BABYLON.Engine,
    logs?:Array<Log>
};