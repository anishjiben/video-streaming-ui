import { useEffect, useState } from "react";
import ShakaPlayer from "../shaka-player/ShakaPlayer";
import CameraList, { Camera } from "../multi-player/CameraList";
import BounceSpinner from "@WESCO-International/wdp-ui-components/components/spinner/BounceSpinner";

const isArrayPresent = (array1: any, array2: any) => {
  const matchingElements = array2.filter((element: any) =>
    array1.includes(element)
  );
  const isSubarray = matchingElements.length === array2.length;
  return isSubarray;
};
export const IncidentDetection = () => {
  const [incidents, setIncidents] = useState<any>([]);
  const [error, setError] = useState<any>(null);
  const [selectedCamera, setSelectedCamera] = useState<any>(incidents[0]);
  const [newIncidentAvailable, setNewIncidentAvailable] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://20.25.113.232:8081/media");
        const newData = await response.json();

        if (newData) {
          setLoading(false);
          // setSelectedCamera(newData[0]);
          setIncidents(newData);
        }
        setError(null);
      } catch (error) {
        setError(error);
      }
    };

    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div className="h-100 w-100 flex center">
        <BounceSpinner />
      </div>
    );
  }
  return (
    <div className="p-4 h-100 w-100 g-1 flex">
      {incidents.length > 0 && (
        <div className="rad-xl flex h-100 shadow-2 w-100">
          <div className="br h-100 " style={{ width: "20%", overflow: "auto" }}>
            <div className="flex center bold size-5 m-2 text-header">
              Incidents
            </div>
            <CameraList
              cameraDetails={incidents}
              selectedCamera={selectedCamera}
              onCameraSelect={(camera: Camera) => {
                setSelectedCamera(camera);
              }}
            />
          </div>
          {selectedCamera ? (
            <div className="p-5 h-100" style={{ width: "80%" }}>
              <ShakaPlayer
                key={selectedCamera.url}
                src={selectedCamera.url}
                cameraDetail={selectedCamera}
              />
            </div>
          ) : (
            <div className="flex center w-100">
              Please select an Incident to view
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default IncidentDetection;
