import { Mexc } from "./mexc";
import { Bitget } from "./bitget";
import { Gateio } from "./gateio";
import { CEX } from "./cex";

export const bitget = new Bitget();
export const gateio = new Gateio();
export const mexc = new Mexc();

export const cexes: CEX[] = [mexc, bitget, gateio];
export const cexesMap = new Map([
  ["mexc", mexc],
  ["bitget", bitget],
  ["gateio", gateio],
]);

export default cexes;
