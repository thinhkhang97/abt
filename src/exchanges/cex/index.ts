import { Mexc } from "./mexc";
import { Bitget } from "./bitget";
import { Gateio } from "./gateio";
import { CEX } from "./cex";

const cexes: CEX[] = [new Mexc(), new Bitget(), new Gateio()];

export default cexes;
