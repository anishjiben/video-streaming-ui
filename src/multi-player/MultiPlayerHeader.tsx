import WescoLogo from "@WESCO-International/wdp-ui-components/components/icon/WescoLogo";
import { Dropdown } from "@WESCO-International/wdp-ui-components/components/dropdown";
import { useEffect, useState } from "react";
import { findMatrixDimensions } from "./PlayerUtils";

type MultiPlayerHeaderProps = {
  numberOfCameras: number;
  onMatrixSelected: (matrix: string) => void;
};
export const MultiPlayerHeader = ({
  numberOfCameras = 0,
  onMatrixSelected,
}: MultiPlayerHeaderProps) => {
  const [rowsCols, setRowsCols] = useState("1 X 1");
  const [options, setOptions] = useState<any>([]);

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

  return (
    <div className="flex sb center px-5" style={{ height: 60 }}>
      <WescoLogo style={{ height: 60 }} />
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
  );
};

export default MultiPlayerHeader;
