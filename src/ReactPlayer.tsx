import ReactPlayer from "react-player";
export const ReactVideoPlayer = () => {
  return (
    <div>
      {" "}
      <ReactPlayer
        muted={true}
        controls
        url="https://stgpartnerintegration.blob.core.windows.net/bitmovincontainer/camstreamer/manifest.mpd"
        config={{
          file: {
            attributes: {
              preload: "none",
            },
          },
        }}
      />
    </div>
  );
};

export default ReactVideoPlayer;
