import ReactPlayer from "react-player";
export const ReactVideoPlayer = () => {
  return (
    <div>
      {" "}
      <ReactPlayer
        muted={true}
        controls
        url="https://streams.bitmovin.com/cla62u1ub16gfgc49f70/manifest.m3u8"
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
