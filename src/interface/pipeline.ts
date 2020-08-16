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
    scene: BABYLON.Scene,
    logs:Array<Log>
};