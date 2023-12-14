import { useCallback, useEffect, useRef, useState } from "react";
import socketClient from "socket.io-client";
import Peer from "simple-peer";
import { Button } from "@WESCO-International/wdp-ui-components";
import { Input } from "@WESCO-International/wdp-ui-components/components/input";

const WSurl = "http://localhost:8000";

export const WebRtcPlayer = () => {
  const socket = socketClient(WSurl);
  const [me, setMe] = useState<string>("");
  const [stream, setStream] = useState<any>();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState<any>();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  //   const myVideo = useRef<any>();
  const videoPlayer = useRef<any>();
  const connectionRef = useRef<any>();

  useEffect(() => {
    socket.on("me", (id) => {
      setMe(id);
      console.log("socket id : ", id);
    });
  }, []);

  const callUser = () => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      //   stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: idToCall,
        signalData: data,
        from: me,
        name: name,
      });
    });
    peer.on("stream", (stream) => {
      videoPlayer.current.srcObject = stream;
    });
    socket.on("offerAccepted", (targetSignal: any) => {
      console.log("Websocket : ", targetSignal);
      setCallAccepted(true);
      peer.signal(targetSignal);
    });
    connectionRef.current = peer;
  };

  return (
    <div>
      <Button label="Request Stream" onClick={callUser} />
      <Input
        id="filled-basic"
        label="ID to call"
        value={idToCall}
        onChange={(e) => setIdToCall(e.target.value)}
      />
      <video id="webrtc-player-web" ref={videoPlayer} autoPlay />
    </div>
  );
};
export default WebRtcPlayer;
