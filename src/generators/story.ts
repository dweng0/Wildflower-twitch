import { GameCube } from '../interface/pipeline';
import { pipe } from 'ramda';

/**
 * This may be temporary, we need something to hold manifest data...
 */
export const getMap = (cube: GameCube): GameCube => {
  cube.materials = {
    map: {
      height: 500,
      width: 500,
      baseUrl: 'stargazer',
      subDivisions: 20,
      physics: {
        friction: 0.2,
        mass: 1,
        restitution: 0.7
      }
    }
  }
  return cube;
}

export const getManifests = pipe(getMap);