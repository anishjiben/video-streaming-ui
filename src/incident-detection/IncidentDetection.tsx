import { useEffect, useState } from "react";
import { ClientDataTable } from "@WESCO-International/wdp-ui-components/components/table/DataTable";
import { Button } from "@WESCO-International/wdp-ui-components/components/button";
import { FaPlay } from "@WESCO-International/react-svg-icons/fa/FaPlay";
import { MdPlayCircleOutline } from "@WESCO-International/react-svg-icons/md/MdPlayCircleOutline";
import { Dialog } from "@WESCO-International/wdp-ui-components/components/dialog";
import ShakaPlayer from "../shaka-player/ShakaPlayer";
import { MdClose } from "@WESCO-International/react-svg-icons/md/MdClose";
import CameraList, { Camera } from "../multi-player/CameraList";

const TableCols = [
  { key: "name", name: "Name" },
  {
    key: "cameraName",
    name: "Camera Name",
    formatter: (args: any) => {
      return <div>---</div>;
    },
  },
  {
    key: "description",
    name: "Description",
    formatter: (args: any) => {
      return <div>---</div>;
    },
  },
  {
    key: "view",
    name: "",
    width: 60,
    cellClass: "flex center",
    formatter: (args: any) => {
      return (
        <Dialog
          escDismiss
          outClickDismiss
          render={({ close, labelId, descriptionId }) => (
            <div className="box">
              <div className="flex end pb-2">
                <Button
                  variant="wdp-tertiary"
                  icon={<MdClose />}
                  size="small"
                  onClick={close}
                />
              </div>
              <ShakaPlayer
                key={args.row.name}
                src={args.row.url}
                cameraDetail={args.row}
              />
            </div>
          )}
        >
          <Button
            id="btn3_8"
            variant="wdp-tertiary"
            size="small"
            accentColor="success"
            style={{ height: 25, width: 25 }}
            icon={<MdPlayCircleOutline />}
          />
        </Dialog>
      );
    },
  },
];
export const IncidentDetection = () => {
  const [incidents, setIncidents] = useState([
    {
      name: "Demo 1",
      url: "https://stgpartnerintegration.blob.core.windows.net/bitmovincontainer/VOD1/manifest.mpd",
    },
    {
      name: "Demo 2",
      url: "https://stgpartnerintegration.blob.core.windows.net/bitmovincontainer/VOD1/manifest.mpd",
    },
    {
      name: "Demo 3",
      url: "https://stgpartnerintegration.blob.core.windows.net/bitmovincontainer/VOD1/manifest.mpd",
    },
    {
      name: "Demo 4",
      url: "https://stgpartnerintegration.blob.core.windows.net/bitmovincontainer/VOD1/manifest.mpd",
    },
    {
      name: "Demo 5",
      url: "https://stgpartnerintegration.blob.core.windows.net/bitmovincontainer/VOD1/manifest.mpd",
    },
  ]);
  const [selectedCamera, setSelectedCamera] = useState<any>(incidents[0]);
  useEffect(() => {
    fetch("http://20.25.113.232:8081/media")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setIncidents(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);
  return (
    <div className="p-4 h-100 w-100 g-1 flex">
      {/* <div style={{ height: "35rem", width: "50rem", margin: "auto" }}> */}
      {/* <div className="text-header semibold size-5">Detected Incidents</div> */}
      {/* <div className="shadow-2 h-100">
          <ClientDataTable columns={TableCols} rows={incidents} paginate />
        </div> */}
      {/* </div> */}
      <div className="rad-xl flex h-100 shadow-2 w-100">
        <div className="br h-100 " style={{ width: "20%", overflow: "auto" }}>
          <CameraList
            cameraDetails={incidents}
            selectedCamera={selectedCamera}
            onCameraSelect={(camera: Camera) => {
              setSelectedCamera(camera);
            }}
          />
        </div>
        <div className="p-5 h-100" style={{ width: "80%" }}>
          <ShakaPlayer
            key={selectedCamera.url}
            src={selectedCamera.url}
            cameraDetail={selectedCamera}
          />
        </div>
      </div>
    </div>
  );
};
export default IncidentDetection;
