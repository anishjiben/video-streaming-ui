import { Button } from "@WESCO-International/wdp-ui-components/components/button";

type CameraListPros = {
  cameraNames: Array<string>;
  onCameraSelect: (cameraName: string) => void;
};
export const CameraList = ({ cameraNames, onCameraSelect }: CameraListPros) => {
  return (
    <div className="flex dcol">
      {cameraNames.map((cameraName: string) => {
        return (
          <Button
            className="norad size-5 semi-bold"
            size="large"
            label={cameraName}
            variant="wdp-ghost"
            onClick={(e: any) => onCameraSelect(cameraName)}
          />
        );
      })}
    </div>
  );
};
export default CameraList;
