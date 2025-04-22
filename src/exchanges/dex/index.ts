import { Panora } from "./aptos/panora";
import { Thala } from "./aptos/thala";
import { DEX } from "./dex";

export const panora = new Panora();
export const thala = new Thala();

export const dexes: DEX[] = [panora, thala];

export const dexesMap = new Map([
  ["panora", panora],
  ["thala", thala],
]);

export default dexes;
