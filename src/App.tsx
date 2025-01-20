import React, { useEffect } from "react";
import { setupStockfish } from "./ads/main";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getPlayerGames = (nickname: string) => {
  return axios
    .get(`https://api.chess.com/pub/player/${nickname}/games/2025/01`)
    .then((res) => res.data);
};

export const App: React.FC = () => {
  const { data: profile } = useQuery({
    queryKey: ["asd"],
    queryFn: () => getPlayerGames("NikitosikSu"),
  });

  console.log(profile);

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
