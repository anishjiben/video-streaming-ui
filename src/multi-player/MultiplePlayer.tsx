import ShakaPlayer from "../ShakaPlayer";
// import ReactVideoPlayer from "./ReactPlayer";

type MultiplePlayerProps = {
  src: string;
};
export const MultiplePlayer = ({ src }: MultiplePlayerProps) => {
  return (
    <div className="flex">
      <div style={{ width: "50%" }}>
        <ShakaPlayer src={src} />
        {/* <ReactVideoPlayer url={src} /> */}
      </div>
      <div style={{ width: "50%" }}>
        <ShakaPlayer src={src} />
        {/* <ReactVideoPlayer url={src} /> */}
      </div>
    </div>
  );
};
export default MultiplePlayer;
