import React, { useState } from "react";
import shaka from "shaka-player/dist/shaka-player.ui";
import "shaka-player/dist/controls.css";
import "./shaka-player.css";
import { Button } from "@WESCO-International/wdp-ui-components/components/button";
import PlayPauseButton, { VerticalVolumeFactory } from "./PlayPauseButton";
import VerticalVolume from "./PlayPauseButton";
import { FaVideo } from "@WESCO-International/react-svg-icons/fa/FaVideo";
import { Camera } from "../multi-player/CameraList";

type ShakaPlayerProps = {
  src: string;
  config?: any;
  className?: any;
  chromeless?: any;
  cameraDetail?: Camera;
};
function ShakaPlayer(
  {
    src,
    config,
    chromeless,
    className,
    cameraDetail,
    ...rest
  }: ShakaPlayerProps,
  ref: any
) {
  const uiContainerRef = React.useRef<any>(null);
  const videoRef = React.useRef<any>(null);

  const [player, setPlayer] = React.useState<any>(null);
  const [ui, setUi] = React.useState<any>(null);

  // Effect to handle component mount & mount.
  // Not related to the src prop, this hook creates a shaka.Player instance.
  // This should always be the first effect to run.
  React.useEffect(() => {
    const player = new shaka.Player(videoRef.current);
    setPlayer(player);

    let ui: any;
    if (!chromeless) {
      // shaka.ui.Controls.registerElement(
      //   "play-pause",
      //   new VerticalVolumeFactory()
      // );

      const ui = new shaka.ui.Overlay(
        player,
        uiContainerRef.current,
        videoRef.current
      );
      // uiConfig['controlPanelElements'] = ['rewind', 'fast_forward', 'skip'];
      // ui.configure({
      //   controlPanelElements: ["fast_backward","play-pause","fast_forward", "mute"],
      // });
      setUi(ui);
    }

    return () => {
      player.destroy();
      if (ui) {
        ui.destroy();
      }
    };
  }, []);

  // Keep shaka.Player.configure in sync.
  React.useEffect(() => {
    if (player && config) {
      player.configure(config);
    }
  }, [player, config]);

  // Load the source url when we have one.
  React.useEffect(() => {
    if (player && src) {
      player.load(src);
      console.log(player?.isLive());
    }
  }, [player, src]);

  // Define a handle for easily referencing Shaka's player & ui API's.
  React.useImperativeHandle(
    ref,
    () => ({
      get player() {
        return player;
      },
      get ui() {
        return ui;
      },
      get videoElement() {
        return videoRef.current;
      },
    }),
    [player, ui]
  );

  return (
    <div ref={uiContainerRef} className="videoWrapper">
      {/* <div className="flex sb">{player?.isLive() ? "Live" : ""}</div> */}
      <div className="flex sb w-100 p-2 semibold size-6">
        <span className="text-white">{cameraDetail?.name}</span>
        <span className="text-primary-dark">
          {player?.isLive() ? "Live" : ""}
        </span>
      </div>

      <video id="shaka-player" ref={videoRef} {...rest} />
      {/* <Button
        label="Play"
        onClick={() => {
          if (player && src) {
            player.load(src);
            ui.play();
          }
        }}
      /> */}
    </div>
  );
}

export default React.forwardRef(ShakaPlayer);