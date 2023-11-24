import { useEffect, useState } from "react";
import CameraList, { Camera } from "./CameraList";
import MultiPlayerHeader from "./MultiPlayerHeader";
import { arrayToMatrix } from "./PlayerUtils";

const cameraDetails = [
  { name: "Camera 1", url: "" },
  { name: "Camera 2", url: "" },
  { name: "Camera 3", url: "" },
  { name: "Camera 4", url: "" },
  { name: "Camera 5", url: "" },
];
export const MultiplePlayer = () => {
  const [selectedCamera, setSelectedCamera] = useState<Camera>(
    cameraDetails[0]
  );
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

  const onMatrixSelected = (selectedMatrix: any) => {
    setnoOfRows(+selectedMatrix.charAt(0));
    setnoOfCols(+selectedMatrix.charAt(2));
    updateCameraMatrix(+selectedMatrix.charAt(0), +selectedMatrix.charAt(2));
  };
  return (
    <div className="h-100 w-100">
      <div className="border" style={{ height: "10%" }}>
        <MultiPlayerHeader
          numberOfCameras={cameraDetails.length}
          onMatrixSelected={onMatrixSelected}
        />
      </div>
      <div className="flex" style={{ height: "90%" }}>
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
          className="p-2"
          style={{
            width: "80%",
            display: "grid",
            gridTemplateRows: `repeat(${noOfRows}, 1fr)`,
          }}
        >
          {cameraMatrix[0] &&
            cameraMatrix[0].length === noOfCols &&
            [...Array(noOfRows)].map((_, row) => {
              return (
                <div key={row} className="cols m-0">
                  {[...Array(noOfCols)].map((_, col) => {
                    return cameraMatrix[row] && cameraMatrix[row][col].name ? (
                      <div
                        key={col}
                        className="col m-2 border bg-primary-light"
                      >
                        {noOfRows == 1
                          ? selectedCamera?.name
                          : cameraMatrix[row][col].name}
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
