import WescoLogo from "@WESCO-International/wdp-ui-components/components/icon/WescoLogo";
import { Dropdown } from "@WESCO-International/wdp-ui-components/components/dropdown";
import { useState } from "react";

type MultiPlayerHeaderProps = {
  onMatrixSelected: (matrix: string) => void;
};
export const MultiPlayerHeader = ({
  onMatrixSelected,
}: MultiPlayerHeaderProps) => {
  const [rowsCols, setRowsCols] = useState("1 X 1");
  const rowsAndColsOptins = [
    { label: "2 X 2", value: "2X2" },
    { label: "3 X 3", value: "3X3" },
  ];
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
        options={rowsAndColsOptins}
        style={{
          width: "200px",
        }}
      />
    </div>
  );
};

export default MultiPlayerHeader;
