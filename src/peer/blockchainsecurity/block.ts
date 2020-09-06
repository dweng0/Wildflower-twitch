import { IAccess, eAccessType } from './interface';
/**
 * @class The block, holds data, meta data and the hash for this block and the previous block.
 */
export class Block {
  index: number;
  timestamp: Date;
  private data: any;
  hash: string;
  previous_hash: string;
  access: Array<IAccess>;
  constructor(index: number, previousHash: string, data: any, secret: string) {
    this.index = index;
    this.timestamp = new Date();
    this.data = data;
    this.previous_hash = previousHash;
    this.hash = this.getHash(secret);
    this.access = new Array();
  }

  /**
   * Creates a new hash from the key provided and the blocks' data
   * @param secret the key
   */
  getHash(secret: string): string {
    const pt = JSON.stringify(this.data);
    //@ts-ignore
    let encrypt = window.crypto.createCipheriv('des-ede3', secret, "");
    let theCipher = encrypt.update(pt, 'utf8', 'base64');
    theCipher += encrypt.final('base64');
    console.log(theCipher);
    return theCipher;
  }

  /**
   * Returns a decrypted version of the blocks data, updates the access array for this block
   * @param secret The secret key
   * @param id The id of the user accessing the data
   */
  getData(secret: string, id: string): string {

    if (id === null) {
      throw new Error("unable to provide data with out a valid access id");
    }

    this.access.push({
      id: id,
      accessType: eAccessType.read,
      message: "read made"
    })
  //@ts-ignore
    let decrypt = window.crypto.createDecipheriv('des-ede3', secret, "");
    let data = decrypt.update(this.hash, 'base64', 'utf8');
    let result = data + decrypt.final('utf8')
    return result;
  }
}