import WescoLogo from "@WESCO-International/wdp-ui-components/components/icon/WescoLogo";
import { Dropdown } from "@WESCO-International/wdp-ui-components/components/dropdown";
import { Dialog } from "@WESCO-International/wdp-ui-components/components/dialog";
import { Button } from "@WESCO-International/wdp-ui-components/components/button";

import { useEffect, useState } from "react";
import { findMatrixDimensions } from "./PlayerUtils";
import { Input } from "@WESCO-International/wdp-ui-components/components/input";

type MultiPlayerHeaderProps = {
  numberOfCameras: number;
  onMatrixSelected: (matrix: string) => void;
  onUrlUpdated: (data: any[]) => void;
};
export const MultiPlayerHeader = ({
  numberOfCameras = 0,
  onMatrixSelected,
  onUrlUpdated,
}: MultiPlayerHeaderProps) => {
  const [rowsCols, setRowsCols] = useState("1 X 1");
  const [options, setOptions] = useState<any>([]);
  const [open, setOpen] = useState<boolean>(false);
  const cameraDetails = [
    { id: 1, name: "Camera 1", url: "" },
    { id: 2, name: "Camera 2", url: "" },
    { id: 3, name: "Camera 3", url: "" },
    { id: 4, name: "Camera 4", url: "" },
  ];
  const [data, setData] = useState(cameraDetails);
  useEffect(() => {
    const dimensions = findMatrixDimensions(numberOfCameras);
    const optionsTemp = dimensions.map((innerArray) => {
      const label = `${innerArray[0]} X ${innerArray[1]}`;
      const value = `${innerArray[0]}X${innerArray[1]}`;
      return {
        label,
        value,
      };
    });
    setOptions(optionsTemp);
  }, []);

  const onLoad = (close: any) => {
    // console.log(cameraDetails);
    onUrlUpdated(data);
    close();
  };
  const updateState = (id: number, property: string, value: string) => {
    const newState = data.map((obj) => {
      // 👇️ if id equals 2, update country property
      if (obj.id === id) {
        return { ...obj, [property]: value };
      }

      // 👇️ otherwise return the object as is
      return obj;
    });

    setData(newState);
  };
  return (
    <div className="flex end center px-5" style={{ height: 60 }}>
      <div className="flex g-2">
        <Dialog
          open={open}
          escDismiss
          outClickDismiss
          onOpenChange={(open) => console.log(open)} //Optional. Can be used to set open state outside dialog in case dialog is not controlled using children click
          render={({ close }) => (
            <div className="box">
              <div className="flex g-3 m-3 cols">
                <div className="col cp-20 flex dcol g-3">
                  <div>name</div>
                  <Input
                    id="camera1"
                    onChange={(e: any) => {
                      updateState(1, "name", e.target.value);
                    }}
                  />
                  <Input
                    id="camera2"
                    onChange={(e: any) => {
                      updateState(2, "name", e.target.value);
                    }}
                  />
                  <Input
                    id="camera3"
                    onChange={(e: any) => {
                      updateState(3, "name", e.target.value);
                    }}
                  />
                  <Input
                    id="camera4"
                    onChange={(e: any) => {
                      updateState(4, "name", e.target.value);
                    }}
                  />
                </div>
                <div className="col cp-80 flex dcol g-3">
                  <div>url</div>
                  <Input
                    id="camera1url"
                    onChange={(e: any) => {
                      updateState(1, "url", e.target.value);
                    }}
                  />
                  <Input
                    id="camera2url"
                    onChange={(e: any) => {
                      updateState(2, "url", e.target.value);
                    }}
                  />
                  <Input
                    id="camera3url"
                    onChange={(e: any) => {
                      updateState(3, "url", e.target.value);
                    }}
                  />
                  <Input
                    id="camera4url"
                    onChange={(e: any) => {
                      updateState(4, "url", e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="flex end">
                <Button
                  label="Load"
                  variant="wdp-tertiary"
                  onClick={() => onLoad(close)}
                />
              </div>
            </div>
          )}
        >
          <Button
            label="Add url"
            variant="wdp-primary"
            onClick={() => setOpen(true)}
          />
        </Dialog>
        <Dropdown
          value={rowsCols}
          emptyLabel="Select Grid"
          onChange={(o) => {
            setRowsCols(o.value);
            onMatrixSelected(o.value);
          }}
          options={options}
          style={{
            width: "200px",
          }}
        />
      </div>
    </div>
  );
};

export default MultiPlayerHeader;
