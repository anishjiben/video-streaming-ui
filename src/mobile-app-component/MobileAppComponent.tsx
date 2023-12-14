import { useEffect, useRef, useState } from "react";
import socketClient from "socket.io-client";
import Peer from "simple-peer";
import { Button } from "@WESCO-International/wdp-ui-components";

const WSurl = "http://localhost:8000";

export const MobileAppComponent = () => {
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
  const mobileVideo = useRef<any>();
  const connectionRef = useRef<any>();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        setStream(stream);
        mobileVideo.current.srcObject = stream;
      });

    socket.on("me", (id) => {
      console.log("Websocket id : ", id);
      setMe(id);
    });

    socket.on("callUser", (data) => {
      console.log("request stream");
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });
  }, []);

  const answerCall = () => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.signal(callerSignal);

    // peer.addStream(stream);
    // peer.emit("stream", stream);
    peer.on("signal", (data) => {
      if (data.type === "answer") {
        console.log("answer ", data, caller);
        socket.emit("answerCall", { signal: data, to: caller });
        setReceivingCall(false);
      }
    });
    // peer.on("stream", (stream) => {
    //   mobileVideo.current.srcObject = stream;
    // });

    connectionRef.current = peer;
  };

  return (
    <div>
      <Button label="Stream" onClick={answerCall} disabled={!receivingCall} />
      <video id="webrtc-player-mobile" ref={mobileVideo} autoPlay />
    </div>
  );
};
export default MobileAppComponent;
