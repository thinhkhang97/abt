import { Mexc } from "./mexc";
import { Bitget } from "./bitget";
import { CEX } from "./cex";

const cexes: CEX[] = [new Mexc(), new Bitget()];

export default cexes;
