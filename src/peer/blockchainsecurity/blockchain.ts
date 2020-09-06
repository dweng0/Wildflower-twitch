import { Block } from "./block";;

/**
 * @class BlockChain
 * Creates a block chain with interfaces for creating and validating blocks
 */
export class BlockChain {
  private hashType: string;
  private secret: string;
  private hashKey: string;
  private chain: Array<Block>;
  constructor(secret: string) {
    this.secret = secret;
    this.hashType = 'sha256';
    this.hashKey = 'c4ff3';
    this.chain = new Array<Block>();
    this.chain.push(new Block(0, "0", "First block", this.secret));
  }
  /**
   * Creates a block, adds it to the chain
   * @param data data to go into block
   * @return Block
   */
  creatBlock(data: any): Block {
    let previousHash = this.getLatestBlock().hash;
    let block = new Block(this.chain.length + 1, previousHash, data, this.secret)
    this.chain.push(block);
    return block;
  }

  /**
   * Returns the latest block in the chain
   * @return Block
   */
  getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  /**
   * validates the hash between two blocks
   * @param newBLock
   * @param previousBlock
   * @returns boolean
   */
  validateBlock(newBLock: Block, previousBlock: Block): boolean {
    return (previousBlock.getHash(this.secret) === newBLock.previous_hash);
  }

  /**
   * Validates the entire block chain
   * @returns boolean
   */
  validate(): boolean {
    let valid = true;

    if (this.chain.length > 1) {
      let latestBlock = this.getLatestBlock();
      let previousBock = this.chain[this.chain.length - 2];

      for (let i = this.chain.length - 1; i > 0; i--) {
        let currentBlock = this.chain[i]
        let previousBlock = this.chain[i - 1];
        valid = this.validateBlock(currentBlock, previousBlock);
        if (!valid) {
          break;
        }
      }
    }
    else {
      valid = false;
    }
    return valid;
  }
}

/**
 * for testing purpose we provide a key like so
 */
const key = "abcdefghijklmnopqrstuvwx"

/**
 * create a chain to hold our blocks, passing in the key and the encryption protocol
 */
const chain = new BlockChain(key);

/**
 * create some blocks, these are addedto the chain
 */
const blockOne = chain.creatBlock("another block");
const blockTwo = chain.creatBlock("YET ANOTHER BLOCK!");

/**
 * Check the validity of the block by using validate block (order is important)
 */
const isValid = chain.validateBlock(blockTwo, blockOne)
const isValidTwo = chain.validateBlock(blockOne, blockTwo)
console.log("valid?", isValid);

// this will not because the blocks are the wrong way round
console.log("valid? 2", isValidTwo);

// we can get data from the blocks

/**
 * Abstract data from the block, can only be done if the key is known
 */
const data = blockOne.getData(key, "jayusername@domain");
console.log(data);
console.log(blockTwo.getData(key, "jayusername@domain"));

/**
 *  and validate the chain as a whole
 */
const isChainValid = chain.validate();
console.log('validating chain: ', isChainValid);

console.log('adding some bogus hocus pocus for integrity testing')

// if we try to inject a hash
let block = chain.creatBlock("amazing");
block.hash = "megamegamegalolz";

// and then create a new block
chain.creatBlock("this block is built on a mdified block");


// it will be invalid
console.log('is the chain valid, ', chain.validate());