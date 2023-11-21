import ReactPlayer from "react-player";
type ReactPlayerProps = {
  url: string;
};
export const ReactVideoPlayer = ({ url }: ReactPlayerProps) => {
  return (
    <div>
      {" "}
      <ReactPlayer
        muted={true}
        controls
        // url="https://stgpartnerintegration.blob.core.windows.net/bitmovincontainer/camstreamer/manifest.mpd"
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
    </div>
  );
};

export default ReactVideoPlayer;
