import { useEffect } from "react";

export const AxisVideoPlayerWrapper = () => {
  const sessionId = "1";
  const context = "1";
  let targetId: string = "B8A44F48FC66";
  let orgId: string = "50a2c960-d9a2-4255-a03b-046ac19aab56";
  let access_token: string =
    "xaxismachinesession_e4a2f57d-ca62-42c8-ace7-9fc57d4fcd69";

  let init_session_params: any;
  let ws_connection: WebSocket;
  let start_time: any;
  let pc: any;
  let has_displayed_playing_message = false;
  const remoteStream: any = new MediaStream();
  let local_stream: any = null;
  let signalingServerURL =
    "wss://signaling.prod.webrtc.connect.axis.com/client";
  signalingServerURL += "?authorization=Bearer%20" + access_token;

  function getLocalStream() {
    // try to get approval from user to use microphone
    if (navigator.mediaDevices.getUserMedia) {
      return navigator.mediaDevices.getUserMedia({ video: false, audio: true });
    } else {
      console.log("No media devices");
    }
  }

  const onWebsocketOpen = (evt: any) => {
    console.log("WebSocket Open: ", evt);
    // ws_connection.send('{"type":"hello", "id":"noid"}');
    // start_time = new Date().getTime();

    // sendSignalingMessage("initSession", {
    //   apiVersion: "1.0",
    //   type: "request",
    //   sessionId: sessionId,
    //   method: "initSession",
    //   context: context,
    //   params: init_session_params,
    // });
  };
  function onWebsocketError(evt: any) {
    console.log("WebSocket Error: ", evt);
  }
  function onWebsocketClose(evt: any) {
    console.log("WebSocket Close: ", evt);
  }

  function badSignalingMessage() {
    console.log("Bad Signalling...");
  }

  function handleDataPartOfSignalingMessage(data_part: any) {
    if (!data_part["apiVersion"]) {
      badSignalingMessage();
      return;
    }

    if (!data_part["type"]) {
      badSignalingMessage();
      return;
    }
    const type = data_part["type"];

    if (!data_part["method"]) {
      badSignalingMessage();
      return;
    }
    const method = data_part["method"];

    if (type == "response" && data_part["data"]) {
      if (method == "addIceCandidate") {
        // this is just an ack from the target, ignore
        return;
      } else if (method == "initSession") {
        // this is just an ack from the target, ignore
        return;
      } else if (method == "setSdpAnswer") {
        // this is just an ack from the target, ignore
        return;
      }
    } else if (type == "request" && data_part["params"]) {
      const params = data_part["params"];
      if (method == "setSdpOffer") {
        handleSDPOfferFromTarget(params);
        return;
      } else if (method == "addIceCandidate") {
        handleICECandidateFromTarget(params);
        return;
      }
    }

    // message was not handled above
    badSignalingMessage();
    return;
  }
  function createPeerConnection(m: any) {
    const ice_servers = [];
    if (m["stunServers"]) {
      //   let stun_url = m["stunServers"][0]["urls"][0]; // assume existence
      //   if (stun_url.startsWith("stun://")) {
      //     stun_url = "stun:" + stun_url.substr(7);
      //   }
      // assume no username or password
      //   console.log("STUN server : ", stun_url);
      ice_servers.push({ urls: "stun:20.25.113.232:3478" });
    }
    ice_servers.push({
      urls: "turn:20.25.113.232:3478",
      username: "turnuser",
      credential: "turn456",
    });

    pc = new RTCPeerConnection({ iceServers: ice_servers });
    pc.onicecandidate = onICECandidate;
    pc.ontrack = onTrack;

    if (init_session_params["audioSend"]) {
      if (local_stream) {
        console.log("Adding local audio stream");
        pc.addStream(local_stream);
      } else {
        console.log("ERROR: No local stream to add to peer connection");
      }
    }

    const videopanel: any = document.getElementById("axis-webrtc-player-web");
    videopanel.srcObject = remoteStream;
    videopanel.onplay = onPlay;
    videopanel.addEventListener("click", function () {
      console.log("video click when videopanel.paused=" + videopanel.paused);
      if (videopanel.paused) {
        videopanel.play();
      } else {
        videopanel.pause();
      }
    });

    // just more logging:
    videopanel.onplaying = function () {
      console.log("video onPlay");
    };
    videopanel.onpause = function () {
      console.log("video onPause");
    };
    videopanel.onended = function () {
      console.log("video onEnded");
    };
    videopanel.onerror = function () {
      console.log("video onError");
    };
    videopanel.onstalled = function () {
      console.log("video onStalled");
    };

    pc.onconnectionstatechange = function () {
      console.log("onConnectionStateChange: " + pc.connectionState);
    };
    pc.oniceconnectionstatechange = function () {
      console.log("onICEConnectionStateChange: " + pc.iceConnectionState);
      if (pc.iceConnectionState === "connected") {
        console.log(
          " If video does not auto-play, click on video area to toggle play and pause."
        );
      }
    };
    pc.onicegatheringstatechange = function () {
      console.log("onICEGatheringStateChange: " + pc.iceGatheringState);
    };
    pc.onsignalingstatechange = function () {
      console.log("onSignalingStateChange: " + pc.signalingState);
    };
  }

  function onICECandidate(evt: any) {
    if (evt.candidate) {
      if (evt.candidate["candidate"].length > 0) {
        sendSignalingMessage("signaling", {
          apiVersion: "1.0",
          type: "request",
          sessionId: sessionId,
          method: "addIceCandidate",
          context: sessionId,
          params: evt.candidate,
        });
      }
    } else {
      console.log("Finished sending my own ICE candidates.");
    }
  }
  function onTrack(evt: any) {
    console.log("ontrack: Incoming media stream : ", evt);
    remoteStream.addTrack(evt.track, remoteStream);
    const videopanel: any = document.getElementById("axis-webrtc-player-web");
    videopanel.srcObject = evt.streams[0];
  }

  function onPlay() {
    if (!has_displayed_playing_message) {
      const play_time = new Date().getTime();
      console.log(
        "video onPlay: <B>Playing video at " +
          (play_time - start_time) / 1000.0 +
          " seconds since sending initSession</B>"
      );
      let top_msg =
        "<B>Connected, playing video.</B> Click video area to toggle pause/play.";
      if (init_session_params["audioReceive"]) {
        top_msg +=
          "<BR><FONT color=\"RED\"><B>Please note: To hear audio, you must right-click on the video, select 'Show controls' and click the Unmute button.</B></FONT>";
      }
      if (init_session_params["audioSend"]) {
        top_msg +=
          '<BR><FONT color="RED"><B>Please note: To send audio, you must have accepted the browsers request to allow your microphone being used.</B></FONT>';
      }
      //   setTopText(top_msg);
      console.log(top_msg);
      has_displayed_playing_message = true;
    }
  }
  function gotSignalingMessage(evt: any) {
    console.log("Got signaling message : ", evt.data);
    const s = evt.data.replace("\r\n", "\\r\\n");
    const m = JSON.parse(s);

    if (!m["type"]) {
      badSignalingMessage();
      return;
    }
    const type = m["type"];
    if (type === "connected") {
      ws_connection.send('{"type":"hello", "id":"noid"}');
      start_time = new Date().getTime();

      sendSignalingMessage("initSession", {
        apiVersion: "1.0",
        type: "request",
        sessionId: sessionId,
        method: "initSession",
        context: context,
        params: init_session_params,
      });
      return;
    }

    if (type == "hello") {
      // just an ack of our hello-message, do nothing
      return;
    } else if (type == "initSession") {
      createPeerConnection(m);
      return;
    } else if (type == "signaling" && m["data"]) {
      handleDataPartOfSignalingMessage(m["data"]);
      return;
    }

    // message was not handled above
    badSignalingMessage();
    return;
  }

  function handleSDPOfferFromTarget(sdp: any) {
    pc.setRemoteDescription(sdp)
      .then(function () {
        return pc.createAnswer();
      })
      .then(function (answer: any) {
        return pc.setLocalDescription(answer);
      })
      .then(function () {
        sendSignalingMessage("signaling", {
          apiVersion: "1.0",
          type: "request",
          sessionId: sessionId,
          method: "setSdpAnswer",
          context: sessionId,
          params: pc.localDescription,
        });
      });
  }
  function handleICECandidateFromTarget(candidate: any) {
    pc.addIceCandidate(new RTCIceCandidate(candidate)).catch(function (
      err: any
    ) {
      console.log("ERROR: addIceCandidate: " + err);
    });
  }

  function sendSignalingMessage(type: any, data: any) {
    const s = JSON.stringify({
      type: type,
      targetId: targetId,
      orgId: orgId,
      accessToken: access_token,
      data: data,
    });
    console.log("Send signal : ", s);
    ws_connection.send(s);
  }

  function connectWebsocket() {
    console.log("executed twice");
    ws_connection = new WebSocket("ws://localhost:8080");
    ws_connection.onopen = onWebsocketOpen;
    ws_connection.onerror = onWebsocketError;
    ws_connection.onclose = onWebsocketClose;
    ws_connection.onmessage = gotSignalingMessage;
  }

  function startSession() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    init_session_params = { type: "live" };

    if (
      (urlParams.get("videoReceive") &&
        urlParams.get("videoReceive") == "true") ||
      !urlParams.get("videoReceive")
    ) {
      // enable video (on by default if not disabled)
      init_session_params["videoReceive"] = {};

      if (
        urlParams.get("experimentalQualityOfService") &&
        urlParams.get("experimentalQualityOfService")?.toLowerCase() == "true"
      ) {
        init_session_params["videoReceive"]["experimentalQualityOfService"] =
          true;
      }
    }

    if (
      urlParams.get("audioReceive") &&
      urlParams.get("audioReceive") == "true"
    ) {
      // enable audio from device to client
      init_session_params["audioReceive"] = {};
    }

    if (urlParams.get("audioSend") && urlParams.get("audioSend") == "true") {
      // enable audio from client to device
      init_session_params["audioSend"] = {};
    }

    if (urlParams.get("remoteURL")) {
      // special experimental feature
      init_session_params["remote_url"] = urlParams.get("remoteURL");
    }

    // access_token = urlParams.get("accessToken");
    if (access_token != null) {
      //   signalingServerURL += "?authorization=Bearer%20" + access_token;
    }

    // if (init_session_params["audioSend"]) {
    //   // need to await approval from user to use microphone
    //   getLocalStream()
    //     .then((stream) => {
    //       appendToLog("Adding local audio stream");
    //       local_stream = stream;
    //       // ok, now go ahead and connect our websocket
    //       connectWebsocket();
    //       return stream;
    //     })
    //     .catch(appendToLog);
    // } else {
    // no need to wait for microphone permission
    connectWebsocket();
  }

  useEffect(() => {
    startSession();
    // return () => {
    //   ws_connection.close();
    // };
  }, [signalingServerURL]);
  return (
    <div className="flex center w-100 h-100">
      <video id="axis-webrtc-player-web" autoPlay />
    </div>
  );
};

export default AxisVideoPlayerWrapper;
