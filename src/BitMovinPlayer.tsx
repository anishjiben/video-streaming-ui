import { Player, PlayerEvent } from "bitmovin-player";
import { useEffect, useRef, useState } from "react";
import DashModule from "bitmovin-player/modules/bitmovinplayer-dash";
import { UIFactory } from "bitmovin-player-ui";
// import "bitmovin-player/bitmovinplayer-ui.css";
const playerConfig = {
  key: "MY-PLAYER-KEY",
  playback: {
    muted: true,
    autoplay: false,
  },
};

export const BitMovinPlayer = () => {
  const [player, setPlayer] = useState<any>(null);
  const playerSource = {
    dash: "http://localhost:8000/manifest.mpd",
  };

  useEffect(() => {
    function setupPlayer() {
      Player.addModule(DashModule);
      const playerInstance = new Player(
        document.getElementById("player")!,
        playerConfig
      );
      UIFactory.buildDefaultUI(playerInstance);
      playerInstance.load(playerSource).then(
        () => {
          setPlayer(playerInstance);
          console.log("Successfully loaded source");
        },
        () => {
          console.log("Error while loading source");
        }
      );
    }

    setupPlayer();

    return () => {
      if (player != null) {
        player.destroy();
        setPlayer(null);
      }
    };
  }, []);

  return <div id="player" />;
};

export default BitMovinPlayer;
