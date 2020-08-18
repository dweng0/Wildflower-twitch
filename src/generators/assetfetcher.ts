/**
 * Manages fetching of assets, not currently used....
 */

import * as BABYLON from 'babylonjs';
import { GameCube, Asset, Level } from '../interface/pipeline';
import { isEmpty, isNil } from 'ramda';

/**
 * What happens when a task is succesffull?
 */
const onTaskSuccess = (task: any, cube: GameCube) => {

  switch (task.constructor) {
    case BABYLON.TextureAssetTask:
    case BABYLON.CubeTextureAssetTask:
    case BABYLON.HDRCubeTextureAssetTask:
      cube.loadedAssets[task.name] = task.texture;
      break;
    case BABYLON.BinaryFileAssetTask:
      cube.loadedAssets[task.name] = task.data;
      break;
    case BABYLON.MeshAssetTask:
      cube.loadedAssets[task.name] = task.loadedMeshes;
      break;
    case BABYLON.TextFileAssetTask:
      cube.loadedAssets[task.name] = task.text;
      break;
    default:
      console.log('Error loading asset "' + task.name + '". Unrecognized AssetManager task type.');
      break;
  }
};

/**
 * What happens when a task fails?
 */
const onTaskFailure = (task: any, message: string, exception: string) => {
  console.log(message, exception);
};

/**
 * Load an individual asset
 * @param asset 
 * @param cube 
 */
const loadAsset = (asset: Asset, assetsManager: BABYLON.AssetsManager, cube: GameCube) => {
  const fileExtension = asset.src.split('.').pop()?.toLowerCase();
  let assetTask;
  //load em
  switch (fileExtension) {
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
      assetTask = assetsManager.addTextureTask(asset.name, './images/' + asset.src);
      break;
    case "dds":
      assetTask = assetsManager.addCubeTextureTask(asset.name, './images/' + asset.src);
      break;
    case "hdr":
      assetTask = assetsManager.addHDRCubeTextureTask(asset.name, './images/' + asset.src, 512);
      break;
    case "mp3":
    case "wav":
      assetTask = assetsManager.addBinaryFileTask(asset.name, './sounds/' + asset.src);
      break;
    case "babylon":
    case "gltf":
    case "obj":
      assetTask = assetsManager.addMeshTask(asset.name, "", "", './models/' + asset.src)
      break;
    case "json":
    case "txt":
      assetTask = assetsManager.addTextFileTask(asset.name, './data/' + asset.src);
      break;
    default:
      console.log('Error loading asset "' + asset.name + '". Unrecognized file extension "' + fileExtension + '"');
      break;
  }
  if (!isNil(assetTask)) {
    //@ts-ignore
    assetTask.onSuccess = onTaskSuccess;
    //@ts-ignore
    assetTask.onError = onTaskFailure;  
  }
  
}

const loadAssets = (cube: GameCube) => {
  const { assets } = cube;
  
  if (isEmpty(assets)) {
    console.log('no assets to load!');
    return cube;
  }
  const assetsManager = new BABYLON.AssetsManager(cube.scene as BABYLON.Scene);
  assets?.forEach((asset) => loadAsset(asset, assetsManager, cube));

  assetsManager.onProgress = (remaining: Number, total: number, lastFinished: BABYLON.AbstractAssetTask) => {
    cube.logs = [];
    cube.console.push(`Loaded ${remaining} of ${total}...` );
  }

  assetsManager.onFinish = () => { 
    cube.ready = true;
    cube.console.push('All assets loaded.');
  }
  
  return cube;
}