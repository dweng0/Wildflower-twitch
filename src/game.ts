import * as BABYLON from 'babylonjs';
import { pipe } from 'ramda';

  //check this is correct
    export const getEngine = (canvas: HTMLCanvasElement):BABYLON.Engine => new BABYLON.Engine(canvas, true);

    export const createScene(engine: BABYLON.Engine): BABYLON.scene => new BABYLON.Scene(engine);



 export const createStage = pipe(

 )
