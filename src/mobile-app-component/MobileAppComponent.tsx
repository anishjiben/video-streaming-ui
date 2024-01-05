import { useEffect, useRef, useState } from "react";
import socketClient from "socket.io-client";
import Peer from "simple-peer";
import { Button } from "@WESCO-International/wdp-ui-components";

const WSurl = "http://localhost:8000";

const constraints = {
  video: true,
  audio: false,
};
const getUserMedia = async () => {
  return await navigator.mediaDevices.getUserMedia(constraints);
};
export const MobileAppComponent = () => {
  const socket = socketClient(WSurl);
  const [me, setMe] = useState<string>("");
  const videoRef = useRef<any>();
  const [initater, setInitiater] = useState<any>();
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection>();
  const [stream, setStream] = useState<any>();

  useEffect(() => {
    socket.on("me", async (id) => {
      setMe(id);
      console.log(id);
      const configuration = {
        iceServers: [
          {
            urls: "stun:20.25.113.232:3478",
          },
        ],
      };
      const peerConnection: RTCPeerConnection = new RTCPeerConnection(
        configuration
      );

      // ICE Candidate
      peerConnection.addEventListener(
        "connectionstatechange",
        async (event) => {
          if (peerConnection.connectionState === "connected") {
            console.log("connection status : ", peerConnection.connectionState);
            const localStream: any = await getUserMedia();
            videoRef.current.srcObject = localStream;
            peerConnection.addTrack(localStream.getTracks()[0]);
            // Peers connected!
          }
        }
      );

      socket.on("message", async (data: any) => {
        if (data.type === "offer") {
          peerConnection.setRemoteDescription(
            new RTCSessionDescription(data.offer)
          );
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          socket.emit("message", {
            from: id,
            to: data.from,
            type: "answer",
            answer: answer,
          });
        } else if (data.type === "new-ice-candidate") {
          console.log(data);
          await peerConnection.addIceCandidate(data.iceCandidate);
        }
        setInitiater(data);
        peerConnection.addEventListener("icecandidate", (candidateEv: any) => {
          console.log("ice candidate : ", candidateEv.candidate);
          if (candidateEv.candidate) {
            socket.emit("message", {
              from: id,
              to: data.from,
              type: "new-ice-candidate",
              iceCandidate: candidateEv.candidate,
            });
          }
        });
      });
      setPeerConnection(peerConnection);
    });

    return function cleanup() {
      // socket.disconnect();
      socket.removeAllListeners();
    };
  }, []);

  const replyToPing = async () => {
    // if (peerConnection) {
    //   const localStream = await getUserMedia();
    //   console.log(localStream.getTracks());
    //   localStream.getTracks().forEach((track: any) => {
    //     peerConnection.addTrack(track, localStream);
    //   });
    // }
  };
  return (
    <div>
      <Button label="Stream" onClick={replyToPing} disabled={!initater} />
      <video id="webrtc-player-mobile" ref={videoRef} autoPlay />
    </div>
  );
};
export default MobileAppComponent;
