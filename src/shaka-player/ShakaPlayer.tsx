import React, { useCallback, useEffect, useRef, useState } from "react";
import shaka, { Player } from "shaka-player/dist/shaka-player.ui";
import "shaka-player/dist/controls.css";
import "./shaka-player.css";
import { Camera } from "../multi-player/CameraList";
import { Notify } from "@WESCO-International/wdp-ui-components/components/notify";
import WescoLogo from "@WESCO-International/wdp-ui-components/components/icon/WescoLogo";
import { FaVideo } from "@WESCO-International/react-svg-icons/fa/FaVideo";

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
  const uiContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [player, setPlayer] = useState<Player>();
  const [ui, setUi] = useState<shaka.ui.Overlay>();
  const [live, setLive] = useState<boolean>(false);
  const [playbackError, setPlaybackError] = useState<any>();

  const handlePlaybackError = useCallback((error: any) => {
    console.log(cameraDetail?.name, ":", error);
    if (error.severity === shaka.util.Error.Severity.CRITICAL) {
      setPlaybackError(error);
    }
  }, []);

  useEffect(() => {
    if (!uiContainerRef.current || !videoRef.current) {
      return;
    }
    const player = new shaka.Player(videoRef.current);
    // playerConfiguration && player.configure(playerConfiguration);
    player.configure({
      manifest: { retryParameters: { maxAttempts: 15, baseDelay: 60000 } },
    });
    setPlayer(player);

    const ui = new shaka.ui.Overlay(
      player,
      uiContainerRef.current,
      videoRef.current
    );
    // const uiConfig = { ...defaultUiConfig, ...uiConfiguration };
    // ui.configure(uiConfig);
    setUi(ui);

    return () => {
      player.destroy();
      if (ui) {
        ui.destroy();
      }
    };
  }, []);

  const loadVideo = () => {
    if (player && src) {
      player
        .load(src)
        .then(() => {
          setLive(player.isLive());
          if (player.isLive()) {
            videoRef.current?.play();
            ui?.configure({
              controlPanelElements: [
                "play_pause",
                "spacer",
                "mute",
                "volume",
                "overflow_menu",
              ],
              overflowMenuButtons: ["quality", "playback_rate"],
            });
          }
        })
        .catch((networkErr: any) => {
          console.log("Error : ", networkErr);
          handlePlaybackError(networkErr);
        });
    }
  };
  useEffect(() => {
    loadVideo();
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
  if (!src || playbackError) {
    return (
      <div
        className="flex center border h-100"
        style={{
          position: "relative",
          borderColor: playbackError ? "red" : "",
          minWidth: 200,
          // aspectRatio: 16 / 9,
        }}
      >
        <img
          src={process.env.PUBLIC_URL + "/wesco.png"}
          style={{ width: 350 }}
        />
        {/* <WescoLogo style={{ height: 200, width: 200, opacity: 0.3 }} /> */}
        {playbackError ? (
          <Notify
            style={{ position: "absolute", top: 10, right: 6 }}
            variant="danger"
            msg={`Failed to load video (Error code : ${playbackError.code})`}
            closable={false}
            showIcon={false}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
  return (
    <div id={cameraDetail?.name} ref={uiContainerRef} className="videoWrapper">
      <div className="flex sb w-100 p-2 semibold size-6" style={{ zIndex: 1 }}>
        <span className="text-white">{cameraDetail?.name}</span>
        <span className="text-danger">
          {live ? <FaVideo style={{ height: 25, width: 35 }} /> : ""}
        </span>
      </div>

      <video
        id={cameraDetail?.name + "video"}
        ref={videoRef}
        {...rest}
        src={process.env.PUBLIC_URL + "/wesco.png"}
        autoPlay={live}
      />
    </div>
  );
}

export default React.forwardRef(ShakaPlayer);
