import { useEffect, useState } from "react";
import CameraList from "./CameraList";
import MultiPlayerHeader from "./MultiPlayerHeader";

export const MultiplePlayer = () => {
  const cameraNames = ["Camera 1", "Camera 2", "Camera 3", "Camera 4"];
  const [selectedCamera, setSelectedCamera] = useState<string>("");

  const createCameraGrid = () => {
    const gridContainer = document.getElementById("grid-container");
    if (gridContainer?.childElementCount) {
      gridContainer.replaceChildren();
    }

    for (let row = 0; row < 3; row++) {
      const rowElement = document.createElement("div");
      rowElement.classList.add("cols", "m-0");

      for (let col = 0; col < 3; col++) {
        const cellElement = document.createElement("div");
        cellElement.classList.add("col", "m-1", "border");

        cellElement.textContent = `Row ${row + 1}, Column ${col + 1}`;
        rowElement.appendChild(cellElement);
      }

      gridContainer?.appendChild(rowElement);
    }
  };

  useEffect(() => {
    createCameraGrid();
  }, []);

  return (
    <div className="h-100 w-100">
      <div className="border" style={{ height: "10%" }}>
        <MultiPlayerHeader />
      </div>
      <div className="flex" style={{ height: "90%" }}>
        <div className="br" style={{ width: "20%" }}>
          <CameraList
            cameraNames={cameraNames}
            onCameraSelect={setSelectedCamera}
          />
        </div>
        <div
          id="grid-container"
          style={{
            width: "80%",
            display: "grid",
            gridTemplateRows: "repeat(3, 1fr)",
          }}
        ></div>
      </div>
    </div>
  );
};
export default MultiplePlayer;
