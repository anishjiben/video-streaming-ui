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
import AxisVideoPlayerWrapper from "./webrtc-player/AxisVideoPlayerWrapper";
import MainLayout from "./main-layout/MainLayout";
import IncidentDetection from "./incident-detection/IncidentDetection";

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
    <>
      {/* <div className="br" style={{ width: "100%", height: "100%" }}> */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index path="multi-view" element={<MultiplePlayer />} />
            <Route path="axis-webrtc" element={<AxisVideoPlayer />} />
            <Route path="incident-detection" element={<IncidentDetection />} />
          </Route>
          {/* <Route path="/" element={<MultiplePlayer />} />
            <Route path="axis-webrtc" element={<AxisVideoPlayerWrapper />} /> */}
        </Routes>
      </BrowserRouter>
      {/* <MultiplePlayer /> */}
      {/* <AxisVideoPlayer /> */}
      {/* </div> */}
    </>
  );
}

export default App;
