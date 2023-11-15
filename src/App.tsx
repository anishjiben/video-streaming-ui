import { useState } from "react";
import "./App.css";

import { Dropdown } from "@WESCO-International/wdp-ui-components/components/dropdown";
import ReactVideoPlayer from "./ReactPlayer";
import { BitMovinPlayer } from "./BitMovinPlayer";

const dropdownOptions = [
  { label: "React Player", value: "React Player" },
  { label: "Bitmovin Player", value: "Bitmovin" },
];
function App() {
  const [value, setValue] = useState("");

  const renderComponent = () => {
    switch (value) {
      case "React Player":
        return <ReactVideoPlayer />;
      case "Bitmovin":
        return <BitMovinPlayer />;
      default:
        return <ReactVideoPlayer />;
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

          {/* <video id="videoPlayer" width="650" controls autoPlay muted>
          <source src="http://localhost:8000/video#t=0" type="video/mp4" />
        </video> */}
        </div>
        <div>{renderComponent()}</div>
      </div>
    </div>
  );
}

export default App;
