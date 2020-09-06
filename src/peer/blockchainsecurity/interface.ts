export enum eAccessType {
  read,
  write,
  start,
  stop
};

/**
* Access interface provides an object with the type of access that has occurred on this block
*/
export interface IAccess {
  id: string;
  accessType: eAccessType
  message?: string;
}