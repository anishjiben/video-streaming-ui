import React, { useCallback, useRef, useState } from "react";
import shaka, { Player } from "shaka-player/dist/shaka-player.ui";
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
  const loadPlayer = async () => {
    if (!uiContainerRef.current || !videoRef.current) {
      return;
    }
    const localPlayer = new shaka.Player();
    setPlayer(localPlayer);
    const ui = new shaka.ui.Overlay(
      localPlayer,
      uiContainerRef.current,
      videoRef.current
    );
    setUi(ui);
    await localPlayer.attach(videoRef.current);
    // const controls: any = ui.getControls();
    // const player = controls.getPlayer();
    setPlayer(localPlayer);
    ui.configure({});
    try {
      await localPlayer.load(src);
      setLive(localPlayer.isLive());
      if (localPlayer.isLive()) {
        videoRef.current?.play();
      }
    } catch (networkErr) {
      handlePlaybackError(networkErr);
    }
  };
  React.useEffect(() => {
    if (src) {
      loadPlayer();
    }
  }, []);

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
