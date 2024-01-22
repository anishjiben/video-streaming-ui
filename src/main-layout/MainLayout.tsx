import {
  Navbar,
  NavbarItem,
} from "@WESCO-International/wdp-ui-components/components/navbar";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export const LeftNavItems = () => {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    console.log(location);
  }, [location]);
  return (
    <>
      <NavbarItem
        className="mr-2"
        style={{
          backgroundColor: location.pathname.includes("multi-view")
            ? "#e8e8e9"
            : "",
          borderRadius: "8px",
        }}
        label="Multi View"
        id="multiview"
        onClick={() => navigate("/multi-view")}
      />
      <NavbarItem
        className="mr-2"
        style={{
          backgroundColor: location.pathname.includes("incident-detection")
            ? "#e8e8e9"
            : "",
          borderRadius: "8px",
        }}
        label="Incident Detection"
        id="incidentdetection"
        onClick={() => navigate("/incident-detection")}
      />
      <NavbarItem
        style={{
          backgroundColor: location.pathname.includes("axis-webrtc")
            ? "#e8e8e9"
            : "",
          borderRadius: "8px",
        }}
        label="WebRTC"
        id="webrtc"
        onClick={() => navigate("/axis-webrtc")}
      />
    </>
  );
};
export const MainLayout = () => {
  return (
    <>
      <Navbar left={<LeftNavItems />} />
      <div className="main-wrapper  background-light h-100">
        <Outlet />
      </div>
    </>
  );
};

export default MainLayout;
