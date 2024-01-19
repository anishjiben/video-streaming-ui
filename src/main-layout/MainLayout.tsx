import {
  Navbar,
  NavbarItem,
} from "@WESCO-International/wdp-ui-components/components/navbar";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export const LeftNavItems = () => {
  const navigate = useNavigate();
  return (
    <>
      <NavbarItem
        label="Multi View"
        id="multiview"
        onClick={() => navigate("/multi-view")}
      />
      <NavbarItem
        label="Incident Detection"
        id="incidentdetection"
        onClick={() => navigate("/incident-detection")}
      />
      <NavbarItem
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
      <Navbar left={<LeftNavItems />} style={{ position: "sticky" }} />
      <div className="background-light h-100">
        <Outlet />
      </div>
    </>
  );
};

export default MainLayout;
