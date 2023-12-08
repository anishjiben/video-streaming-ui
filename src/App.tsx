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
  return (
    <div className="" style={{ height: "100%" }}>
      <div className="br" style={{ width: "100%", height: "100%" }}>
        <MultiplePlayer />
      </div>
    </div>
  );
}

export default App;
