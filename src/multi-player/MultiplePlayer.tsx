import { useEffect, useState } from "react";
import CameraList, { Camera } from "./CameraList";
import MultiPlayerHeader from "./MultiPlayerHeader";
import { arrayToMatrix } from "./PlayerUtils";
import ShakaPlayer from "../shaka-player/ShakaPlayer";

const defaultCameraDetails = [
  {
    name: "VOD MPEG-DASH",
    url: "https://stgpartnerintegration.blob.core.windows.net/bitmovincontainer/VOD1/manifest.mpd",
  },
  {
    name: "VOD HLS",
    url: "https://stgpartnerintegration.blob.core.windows.net/bitmovincontainer/VOD2/manifest.m3u8",
  },
  {
    name: "LIVE MPEG-DASH",
    url: "https://stgpartnerintegration.blob.core.windows.net/bitmovincontainer/camstreamer1/manifest.mpd",
  },
  {
    name: "LIVE HLS",
    url: "https://stgpartnerintegration.blob.core.windows.net/bitmovincontainer/camstreamer2/manifest.mpd",
  },
];
export const MultiplePlayer = () => {
  const [cameraDetails, setCameraDetails] = useState(defaultCameraDetails);
  const [selectedCamera, setSelectedCamera] = useState<any>(cameraDetails[0]);
  const [noOfRows, setnoOfRows] = useState<any>(1);
  const [noOfCols, setnoOfCols] = useState<any>(1);
  const [cameraMatrix, setCameraMatrix] = useState<any>([]);

  const updateCameraMatrix = (rows: number, cols: number) => {
    const cameraMatrixTemp = arrayToMatrix(cameraDetails, cols);
    setCameraMatrix(cameraMatrixTemp);
    console.log(cameraMatrixTemp);
  };
  useEffect(() => {
    updateCameraMatrix(noOfRows, noOfCols);
  }, []);

  useEffect(() => {
    console.log("camera detailss : ", cameraDetails);
  }, [cameraDetails]);

  const onMatrixSelected = (selectedMatrix: any) => {
    setnoOfRows(+selectedMatrix.charAt(0));
    setnoOfCols(+selectedMatrix.charAt(2));
    setSelectedCamera(undefined);
    updateCameraMatrix(+selectedMatrix.charAt(0), +selectedMatrix.charAt(2));
  };
  const onDetailsUpdated = (details: any[]) => {
    setCameraDetails(details);
    setnoOfRows(1);
    setnoOfCols(1);
    setSelectedCamera(details[0]);
    updateCameraMatrix(1, 1);
  };
  return (
    <div className="h-100 w-100 p-4 ">
      <div style={{ height: "fit-content" }}>
        <MultiPlayerHeader
          numberOfCameras={cameraDetails.length}
          onMatrixSelected={onMatrixSelected}
          onUrlUpdated={onDetailsUpdated}
        />
      </div>
      <div className="flex shadow-2 rad-xl" style={{ height: "90%" }}>
        <div className="br" style={{ width: "20%" }}>
          <CameraList
            cameraDetails={cameraDetails}
            selectedCamera={selectedCamera}
            onCameraSelect={(camera: Camera) => {
              setnoOfRows(1);
              setnoOfCols(1);
              setSelectedCamera(camera);
              updateCameraMatrix(1, 1);
            }}
          />
        </div>
        <div
          id="grid-container"
          className="p-5 h-100"
          style={{
            // aspectRatio: 16 / 9,
            // overflow: "auto",
            width: "80%",
            display: "grid",
            gridTemplateRows: `repeat(${noOfRows}, 1fr)`,
          }}
        >
          {cameraMatrix[0] &&
            cameraMatrix[0].length === noOfCols &&
            [...Array(noOfRows)].map((_, row) => {
              return (
                <div key={row} className="cols h-100">
                  {[...Array(noOfCols)].map((_, col) => {
                    return cameraMatrix[row] && cameraMatrix[row][col].name ? (
                      <div key={col} className="col h-100">
                        {noOfRows == 1 ? (
                          <ShakaPlayer
                            key={selectedCamera.url}
                            src={selectedCamera.url}
                            cameraDetail={selectedCamera}
                          />
                        ) : (
                          <ShakaPlayer
                            key={cameraMatrix[row][col].url}
                            src={cameraMatrix[row][col].url}
                            cameraDetail={cameraMatrix[row][col]}
                          />
                        )}
                      </div>
                    ) : (
                      <div className="col"></div>
                    );
                  })}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
export default MultiplePlayer;
