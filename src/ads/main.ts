import StockfishWeb from "lila-stockfish-web";

const sharedWasmMemory = (lo: number, hi = 32767): WebAssembly.Memory => {
  let shrink = 4; // 32767 -> 24576 -> 16384 -> 12288 -> 8192 -> 6144 -> etc
  while (true) {
    try {
      return new WebAssembly.Memory({ shared: true, initial: lo, maximum: hi });
    } catch (e) {
      if (hi <= lo || !(e instanceof RangeError)) throw e;
      hi = Math.max(lo, Math.ceil(hi - hi / shrink));
      shrink = shrink === 4 ? 3 : 4;
    }
  }
};

export const setupStockfish = (): Promise<StockfishWeb> => {
  return new Promise<StockfishWeb>((resolve, reject) => {
    import("lila-stockfish-web/sf17-79.js").then((makeModule) => {
      makeModule
        .default({
          wasmMemory: sharedWasmMemory(2560!),
          onError: (msg: string) => reject(new Error(msg)),
          locateFile: (name: string) => `assets/stockfish/${name}`,
        })
        .then(async (instance: StockfishWeb) => {
          Promise.all([
            fetch(`assets/stockfish/${instance.getRecommendedNnue(0)}`),
            fetch(`assets/stockfish/${instance.getRecommendedNnue(1)}`),
          ]).then((responses) => {
            Promise.all([
              responses[0].arrayBuffer(),
              responses[1].arrayBuffer(),
            ]).then((buffers) => {
              instance.setNnueBuffer(new Uint8Array(buffers[0]), 0);
              instance.setNnueBuffer(new Uint8Array(buffers[1]), 1);
            });
          });
          resolve(instance);
        });
    });
  });
};
