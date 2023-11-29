import { useState } from "react";
import "./App.css";

import { Dropdown } from "@WESCO-International/wdp-ui-components/components/dropdown";
import { Input } from "@WESCO-International/wdp-ui-components/components/input";

import ReactVideoPlayer from "./ReactPlayer";
import { BitMovinPlayer } from "./BitMovinPlayer";
import ShakaPlayer from "./shaka-player/ShakaPlayer";
import MultiplePlayer from "./multi-player/MultiplePlayer";

const dropdownOptions = [
  { label: "Bitmovin Player", value: "Bitmovin" },
  { label: "React Player", value: "React Player" },
  { label: "Shaka Player", value: "Shaka" },
  { label: "Multiple Player", value: "Multiple" },
];
function App() {
  const [value, setValue] = useState("");
  const [url, setUrl] = useState("");

  const props = { src: "" };
  // const renderComponent = () => {
  //   switch (value) {
  //     case "React Player":
  //       return <ReactVideoPlayer url={url} />;
  //     case "Bitmovin":
  //       return <BitMovinPlayer url={url} />;
  //     case "Shaka":
  //       return <ShakaPlayer src={url} />;
  //     case "Multiple":
  //       return <MultiplePlayer src={url} />;
  //     default:
  //       return <ReactVideoPlayer url={url} />;
  //   }
  // };
  return (
    <div className="" style={{ height: "100%" }}>
      {/* <div
        className="flex sb p-5 center"
        style={{ width: "40%", height: "10%" }}
      >
        <span className="text-header bold size-3 ff-header">
          Video Streaming
        </span>
        <Dropdown
          value={value}
          onChange={(o) => setValue(o.value)}
          options={dropdownOptions}
          style={{
            width: "200px",
          }}
        />
      </div> */}
      <div className="br" style={{ width: "100%", height: "100%" }}>
        <MultiplePlayer />
      </div>
    </div>
  );
}

export default App;
