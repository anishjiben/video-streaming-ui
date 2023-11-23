import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
type ReactPlayerProps = {
  url: string;
};
export const ReactVideoPlayer = ({ url }: ReactPlayerProps) => {
  return (
    // <div>
    //   {" "}
    <ReactPlayer
      muted={true}
      controls
      style={{ width: "100%", height: "100%" }}
      url={
        url
          ? url
          : "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
      }
      config={{
        file: {
          attributes: {
            preload: "none",
          },
        },
      }}
    />
    // </div>
  );
};

export default ReactVideoPlayer;
