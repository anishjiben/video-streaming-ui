import { Button } from "@WESCO-International/wdp-ui-components/components/button";
import { useState } from "react";

export type Camera = {
  name: string;
  url: string;
};
type CameraListPros = {
  selectedCamera: Camera;
  cameraDetails: Array<Camera>;
  onCameraSelect: (camera: Camera) => void;
};
export const CameraList = ({
  selectedCamera,
  cameraDetails,
  onCameraSelect,
}: CameraListPros) => {
  // const [selectedCamera, setSelectedCamera] = useState<Camera>();
  return (
    <div className="flex dcol">
      {cameraDetails.map((camera: Camera) => {
        return (
          <Button
            key={camera.name}
            className="norad size-5 semi-bold"
            size="large"
            label={camera.name}
            variant="wdp-ghost"
            onClick={(e: any) => {
              onCameraSelect(camera);
              // setSelectedCamera(camera);
            }}
            style={{
              backgroundColor:
                selectedCamera?.name === camera.name ? "#ebffed" : "",
            }}
          />
        );
      })}
    </div>
  );
};
export default CameraList;
