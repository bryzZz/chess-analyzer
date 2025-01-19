import React, { useEffect } from "react";
import { setupStockfish } from "./ads/main";

export const App: React.FC = () => {
  useEffect(() => {
    setupStockfish()
      .then((engine) => {
        engine.onError = (msg) => console.error(`Engine Error ${msg}`);

        engine.listen = (data) => {
          if (data.startsWith("bestmove")) {
            console.log(`Bestmove ${data}`);
          }
        };

        engine.uci("uci");
        engine.uci("position startpos");
        engine.uci("go depth 10");
        engine.uci("quit");
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold underline">Chess Analyzer</h1>
    </div>
  );
};
