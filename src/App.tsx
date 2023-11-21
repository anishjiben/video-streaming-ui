import { useState } from "react";
import "./App.css";

import { Dropdown } from "@WESCO-International/wdp-ui-components/components/dropdown";
import { Input } from "@WESCO-International/wdp-ui-components/components/input";
import { Button } from "@WESCO-International/wdp-ui-components/components/button";
import { MdPlayArrow } from "@WESCO-International/react-svg-icons/md/MdPlayArrow";

import ReactVideoPlayer from "./ReactPlayer";
import { BitMovinPlayer } from "./BitMovinPlayer";

const dropdownOptions = [
  { label: "React Player", value: "React Player" },
  { label: "Bitmovin Player", value: "Bitmovin" },
];
function App() {
  const [value, setValue] = useState("");
  const [url, setUrl] = useState("");

  const renderComponent = () => {
    switch (value) {
      case "React Player":
        return <ReactVideoPlayer url={url} />;
      case "Bitmovin":
        return <BitMovinPlayer url={url} />;
      default:
        return <ReactVideoPlayer url={url} />;
    }
  };
  return (
    <div className="App flex center" style={{ height: "100%" }}>
      <div style={{ width: 650 }}>
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
        <div>{renderComponent()}</div>
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
