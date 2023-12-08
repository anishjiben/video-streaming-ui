import React, { useCallback } from "react";
import shaka from "shaka-player/dist/shaka-player.ui";
import "shaka-player/dist/controls.css";
import "./shaka-player.css";
import { Camera } from "../multi-player/CameraList";
import { Notify } from "@WESCO-International/wdp-ui-components/components/notify";

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
  const [playbackError, setPlaybackError] = React.useState<any>();

  const handlePlaybackError = useCallback((error: any) => {
    console.log(cameraDetail?.name, ":", error);
    if (error.severity === shaka.util.Error.Severity.CRITICAL) {
      setPlaybackError(error);
      if (player) {
        player.unload();
        player.destroy();
        setPlayer(null);
      }
      if (ui) {
        ui.destroy();
        setUi(null);
      }
    }
  }, []);

  const vodManifestNotFoundHandler = (
    neError: any /* shaka.net.NetworkingEngine.RetryEvent */
  ) => {
    const code = neError.error.code;
    const data = neError.error.data;

    if (code === shaka.util.Error.Code.BAD_HTTP_STATUS) {
      if (
        // each type of error has its own data structure (or none at all), tread with care
        Array.isArray(data) &&
        data[1] === 404 &&
        data[4] === shaka.net.NetworkingEngine.RequestType.MANIFEST
      ) {
        // Throwing inside a retry callback will immediately stop retries
        throw new Error(neError.error);

        // A proprietary error code can also be thrown
        // throw new shaka.util.Error(
        //   shaka.util.Error.Severity.CRITICAL,
        //   shaka.util.Error.Category.NETWORK,
        //   'RECOGNIZABLE_ERROR_MESSAGE'
        // );
      }
    }
  };
  // Effect to handle component mount & mount.
  // Not related to the src prop, this hook creates a shaka.Player instance.
  // This should always be the first effect to run.
  React.useEffect(() => {
    if (player) player.destroy();
    if (src) {
      const tempplayer = new shaka.Player(videoRef.current);
      tempplayer.addEventListener("error", (networkErr: any) =>
        handlePlaybackError(networkErr.detail)
      );
      tempplayer.addEventListener("retry", vodManifestNotFoundHandler);

      if (config) {
        tempplayer.configure(config);
      }

      let tempUi: any;
      if (!chromeless) {
        tempUi = new shaka.ui.Overlay(
          tempplayer,
          uiContainerRef.current,
          videoRef.current
        );
        setUi(tempUi);
      }
      setPlayer(tempplayer);
      return () => {
        tempplayer.destroy();
        if (tempUi) {
          tempUi.destroy();
        }
      };
    }
  }, []);

  // Load the source url when we have one.
  React.useEffect(() => {
    if (player && src) {
      // handle errors that occur after load
      player
        .load(src)
        .then(() => {
          setLive(player.isLive());
          if (player.isLive()) {
            videoRef.current.play();
            // player?.getMediaElement()?.play();
            // player.play();
          }
        })
        .catch((networkErr: any) => {
          handlePlaybackError(networkErr);
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
  if (!src || playbackError) {
    return (
      <div
        className="flex center border"
        style={{
          position: "relative",
          borderColor: playbackError ? "red" : "",
          minWidth: 200,
        }}
      >
        <img src={process.env.PUBLIC_URL + "/wesco.png"} />
        {playbackError ? (
          <Notify
            style={{ position: "absolute" }}
            variant="danger"
            msg={`Failed to load video (Error code : ${playbackError.code})`}
            closable={false}
            title="Error"
          />
        ) : (
          ""
        )}
      </div>
    );
  }
  return (
    <div id={cameraDetail?.name} ref={uiContainerRef} className="videoWrapper">
      <div className="flex sb w-100 p-2 semibold size-6" style={{ zIndex: 9 }}>
        <span className="text-white">{cameraDetail?.name}</span>
        <span className="text-primary-dark">{live ? "Live" : ""}</span>
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
