import { useState } from "react";
import "./App.css";

import { Dropdown } from "@WESCO-International/wdp-ui-components/components/dropdown";
import { Input } from "@WESCO-International/wdp-ui-components/components/input";

import ReactVideoPlayer from "./ReactPlayer";
import { BitMovinPlayer } from "./BitMovinPlayer";
import ShakaPlayer from "./ShakaPlayer";
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
  const renderComponent = () => {
    switch (value) {
      case "React Player":
        return <ReactVideoPlayer url={url} />;
      case "Bitmovin":
        return <BitMovinPlayer url={url} />;
      case "Shaka":
        return <ShakaPlayer src={url} />;
      case "Multiple":
        return <MultiplePlayer src={url} />;
      default:
        return <ReactVideoPlayer url={url} />;
    }
  };
  return (
    <div className="App flex center p-5" style={{ height: "100%" }}>
      <div style={{ width: "80%" }}>
        <div className="flex center sb m-5">
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
        </div>
        {value && url ? (
          <div className="flex center">{renderComponent()}</div>
        ) : (
          <div
            className="text-header font size-5 flex center"
            style={{ height: 300 }}
          >
            Please select a player from above dropdown and also post the url
            below
          </div>
        )}
        {/* <div>{renderComponent()}</div> */}
        <div className="flex g-2 mt-5 center">
          <span>URL</span>{" "}
          <Input
            id="input1"
            placeholder="Type your url here"
            value={url}
            onChange={(e: any) => {
              console.log(e.target.value);
              setUrl(e.target.value);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
