import React from "react";
import logo from "./logo.svg";
import "./App.css";
import ReactPlayer from "react-player";

function App() {
  return (
    <div className="App" style={{ height: "100%" }}>
      <div style={{ width: 650, margin: "auto" }}>
        <span style={{ margin: "auto", fontSize: "2em" }}>Video Streaming</span>
        <ReactPlayer
          muted={true}
          controls
          url="http://localhost:8000/manifest.mpd"
          config={{
            file: {
              attributes: {
                preload: "none",
              },
            },
          }}
        />
        {/* <video id="videoPlayer" width="650" controls autoPlay muted>
          <source src="http://localhost:8000/video#t=0" type="video/mp4" />
        </video> */}
      </div>
    </div>
  );
}

export default App;
