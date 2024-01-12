import { useState } from "react";
import "./App.css";

import { Dropdown } from "@WESCO-International/wdp-ui-components/components/dropdown";
import { Input } from "@WESCO-International/wdp-ui-components/components/input";

import ReactVideoPlayer from "./ReactPlayer";
import { BitMovinPlayer } from "./BitMovinPlayer";
import ShakaPlayer from "./shaka-player/ShakaPlayer";
import MultiplePlayer from "./multi-player/MultiplePlayer";
import WebRtcPlayer from "./webrtc-player/WebRtcPlayer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MobileAppComponent from "./mobile-app-component/MobileAppComponent";
import AxisVideoPlayer from "./webrtc-player/AxisVideoPlayer";

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
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MultiplePlayer />} />
            <Route path="axis-webrtc" element={<AxisVideoPlayer />} />
          </Routes>
        </BrowserRouter>
        {/* <MultiplePlayer /> */}
        {/* <AxisVideoPlayer /> */}
      </div>
    </div>
  );
}

export default App;
