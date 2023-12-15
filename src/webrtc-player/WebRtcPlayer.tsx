import { useCallback, useEffect, useRef, useState } from "react";
import socketClient from "socket.io-client";
import Peer from "simple-peer";
import { Button } from "@WESCO-International/wdp-ui-components";
import { Input } from "@WESCO-International/wdp-ui-components/components/input";

const WSurl = "http://localhost:8000";

const constraints = {
  video: true,
  audio: false,
};
const getUserMedia = async () => {
  return await navigator.mediaDevices.getUserMedia(constraints);
};
export const WebRtcPlayer = () => {
  const socket = socketClient(WSurl);
  const [me, setMe] = useState<string>("");
  const videoRef = useRef<any>();
  const [idToCall, setIdToCall] = useState<string>();
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection>();
  const [offer, setOffer] = useState<any>();

  const configuration = {
    iceServers: [
      {
        urls: "stun:20.25.113.232:3478",
      },
    ],
  };

  useEffect(() => {
    socket.on("me", async (id) => {
      setMe(id);
      const peerConnection = new RTCPeerConnection(configuration);
      const offer = await peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      await peerConnection.setLocalDescription(offer);
      setOffer(offer);

      peerConnection.addEventListener(
        "connectionstatechange",
        async (event) => {
          console.log("connection status : ", peerConnection.connectionState);
          if (peerConnection.connectionState === "connected") {
            // peerConnection.createDataChannel("video-channel");
            // const localStream: any = await getUserMedia();
            // videoRef.current.srcObject = localStream;
            // Peers connected!
          }
        }
      );
      peerConnection.addEventListener("icecandidate", async (event) => {
        if (event.candidate) {
          socket.emit("message", {
            from: id,
            to: idToCall,
            type: "new-ice-candidate",
            iceCandidate: event.candidate,
          });
        }
      });
      peerConnection.addEventListener("track", (event) => {
        console.log("Track received : ", event);
        const [remoteStream] = event.streams;
        videoRef.current.srcObject = remoteStream;
      });
      socket.on("message", async (data: any) => {
        console.log(data);
        if (data.type === "answer") {
          const remoteDesc = new RTCSessionDescription(data.answer);
          await peerConnection.setRemoteDescription(remoteDesc);
        } else if (data.type === "new-ice-candidate") {
          await peerConnection.addIceCandidate(data.iceCandidate);
        }
      });

      setPeerConnection(peerConnection);
    });
    return function cleanup() {
      socket.removeAllListeners();
    };
  }, []);

  const pingStreamerDevice = async () => {
    if (peerConnection) {
      socket.emit("message", {
        from: me,
        to: idToCall,
        type: "offer",
        offer: offer,
      });
    }
  };

  return (
    <div>
      <Button label="Request Stream" onClick={pingStreamerDevice} />
      <Input
        id="filled-basic"
        label="ID to call"
        value={idToCall}
        onChange={(e) => setIdToCall(e.target.value)}
      />
      <video id="webrtc-player-web" ref={videoRef} autoPlay />
    </div>
  );
};
export default WebRtcPlayer;
