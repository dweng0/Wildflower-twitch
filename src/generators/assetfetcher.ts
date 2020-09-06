/**
 * Manages fetching of assets, not currently used....
 */

import * as BABYLON from 'babylonjs';
import { GameCube, Asset } from '../interface/pipeline';
import { isEmpty, isNil } from 'ramda';
import { loadAssets } from './assetloader';

const rootAssetFolder = './assets/';
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
      cube.log('Error loading asset "' + task.name + '". Unrecognized AssetManager task type.');
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
  const fileExtension = asset.source.split('.').pop()?.toLowerCase();
  let assetTask;
  //load em
  switch (fileExtension) {
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
      assetTask = assetsManager.addTextureTask(asset.name, asset.source);
      break;
    case "dds":
      assetTask = assetsManager.addCubeTextureTask(asset.name, asset.source);
      break;
    case "hdr":
      assetTask = assetsManager.addHDRCubeTextureTask(asset.name, asset.source, 512);
      break;
    case "mp3":
    case "wav":
      assetTask = assetsManager.addBinaryFileTask(asset.name, asset.source);
      break;
    case "babylon":
    case "gltf":
    case "obj":
      assetTask = assetsManager.addMeshTask(asset.name, "", "", asset.source)
      break;
    case "json":
    case "txt":
      assetTask = assetsManager.addTextFileTask(asset.name, asset.source);
      break;
    default:
      cube.log('Error loading asset "' + asset.name + '". Unrecognized file extension "' + fileExtension + '"');
      break;
  }
  if (!isNil(assetTask)) {
    //@ts-ignore
    assetTask.onSuccess = onTaskSuccess;
    //@ts-ignore
    assetTask.onError = onTaskFailure;  
  }
  
}

/**
 * given a map name, use it as the asset root
 * @param cube 
 */
export const fetchAssets = (cube: GameCube) => {
  const { mapRoot } = cube;
   
  if (isEmpty(mapRoot)) {
    cube.log('no assets to load!');
    return cube;
  }

  const assets = [
    {
      name: 'heightmap',
      source: `${rootAssetFolder}map/${mapRoot}/heightmap.png`
    },
    {
      name: 'ground',
      source: `${rootAssetFolder}map/${mapRoot}/ground.jpg`
    }
  ];

  const assetsManager = new BABYLON.AssetsManager(cube.scene as BABYLON.Scene);
  assets.forEach((asset) => loadAsset(asset, assetsManager, cube));

  assetsManager.onProgress = (remaining: Number, total: number, lastFinished: BABYLON.AbstractAssetTask) => {
    cube.logs = [];
    cube.console.push(`Loaded ${remaining} of ${total}...` );
  }

  assetsManager.onFinish = () => { 
    cube.console.push('All assets loaded.');
    loadAssets(cube);
  }
  
  return cube;
}