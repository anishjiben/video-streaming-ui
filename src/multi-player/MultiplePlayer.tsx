import { useEffect, useState } from "react";
import CameraList from "./CameraList";
import MultiPlayerHeader from "./MultiPlayerHeader";

export const MultiplePlayer = () => {
  const cameraNames = ["Camera 1", "Camera 2", "Camera 3", "Camera 4"];
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const [noOfRows, setnoOfRows] = useState<any>(1);
  const createCameraGrid = () => {
    const gridContainer = document.getElementById("grid-container");
    if (gridContainer?.childElementCount) {
      gridContainer.replaceChildren();
    }

    for (let row = 0; row < noOfRows; row++) {
      const rowElement = document.createElement("div");
      rowElement.classList.add("cols", "m-0");

      for (let col = 0; col < noOfRows; col++) {
        const cellElement = document.createElement("div");
        cellElement.classList.add("col", "m-1", "border", "bg-primary-light");

        cellElement.textContent = `Row ${row + 1}, Column ${col + 1}`;
        rowElement.appendChild(cellElement);
      }

      gridContainer?.appendChild(rowElement);
    }
  };

  useEffect(() => {
    createCameraGrid();
  }, []);
  useEffect(() => {
    if (noOfRows) {
      console.log(noOfRows);
      createCameraGrid();
    }
  }, [noOfRows]);

  return (
    <div className="h-100 w-100">
      <div className="border" style={{ height: "10%" }}>
        <MultiPlayerHeader
          onMatrixSelected={(selectedMatrix) => {
            setnoOfRows(+selectedMatrix.charAt(0));
          }}
        />
      </div>
      <div className="flex" style={{ height: "90%" }}>
        <div className="br" style={{ width: "20%" }}>
          <CameraList
            cameraNames={cameraNames}
            onCameraSelect={(cameraName: string) => {
              setnoOfRows(1);
              setSelectedCamera(cameraName);
            }}
          />
        </div>
        <div
          id="grid-container"
          style={{
            width: "80%",
            display: "grid",
            gridTemplateRows: `repeat(${noOfRows}, 1fr)`,
          }}
        ></div>
      </div>
    </div>
  );
};
export default MultiplePlayer;
