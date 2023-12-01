import React from "react";
import shaka from "shaka-player/dist/shaka-player.ui";
import "shaka-player/dist/controls.css";
import "./shaka-player.css";
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
  const [live, setLive] = React.useState<boolean>(false);

  // Effect to handle component mount & mount.
  // Not related to the src prop, this hook creates a shaka.Player instance.
  // This should always be the first effect to run.
  React.useEffect(() => {
    if (player) player.destroy();
    if (src) {
      const player = new shaka.Player(videoRef.current);
      setPlayer(player);

      let ui: any;
      if (!chromeless) {
        ui = new shaka.ui.Overlay(
          player,
          uiContainerRef.current,
          videoRef.current
        );
        setUi(ui);
      }
      return () => {
        player.destroy();
        if (ui) {
          console.log(ui);
          ui.destroy();
        }
      };
    }
  }, []);

  // Keep shaka.Player.configure in sync.
  React.useEffect(() => {
    if (player && config && src) {
      player.configure(config);
    }
  }, [player, config]);

  // Load the source url when we have one.
  React.useEffect(() => {
    if (player && src) {
      player.load(src).then(() => {
        console.log(player?.isLive());
        setLive(player.isLive());
        if (player.isLive()) {
          player?.getMediaElement()?.play();
        }
      });
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
  if (!src) {
    return (
      <div className="flex center">
        <img src={process.env.PUBLIC_URL + "/wesco.png"} />
      </div>
    );
  }
  return (
    <div ref={uiContainerRef} className="videoWrapper">
      <div className="flex sb w-100 p-2 semibold size-6" style={{ zIndex: 99 }}>
        <span className="text-white">{cameraDetail?.name}</span>
        <span className="text-primary-dark">{live ? "Live" : ""}</span>
      </div>

      <video
        id="shaka-player"
        ref={videoRef}
        {...rest}
        src={process.env.PUBLIC_URL + "/wesco.png"}
      />
    </div>
  );
}

export default React.forwardRef(ShakaPlayer);
