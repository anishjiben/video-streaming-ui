import React from "react";
// import shaka from "shaka-player";
import shaka from "shaka-player/dist/shaka-player.ui";
import "shaka-player/dist/controls.css";
import { Button } from "@WESCO-International/wdp-ui-components/components/button";

type ShakaPlayerProps = {
  src: string;
  config?: any;
  className?: any;
  chromeless?: any;
};
function ShakaPlayer(
  { src, config, chromeless, className, ...rest }: ShakaPlayerProps,
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
      const ui = new shaka.ui.Overlay(
        player,
        uiContainerRef.current,
        videoRef.current
      );
      ui.configure({});
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
    <div ref={uiContainerRef} className={className}>
      <video
        id="shaka-player"
        ref={videoRef}
        style={{
          maxWidth: "100%",
          width: "100%",
        }}
        {...rest}
      />
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
