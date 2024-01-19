import init, { LiveVideoRequestParamObject, SignalingHandler, WebRtcContext } from "./webrtcvideo.js";

async function main() {
    await init();
}

const signalServer = "wss://signaling.prod.webrtc.connect.axis.com/client";
let streamDetails = { videoReceive: { width: 1280, height: 720, framerate: 30 } };
let audioReceive = false;
let signal = undefined;
let context = undefined;
let accessToken = undefined;
let orgId = undefined;
let targetId = undefined;
let ptzVelocity = 0;
let ptzZoomTimer = undefined;

document.addEventListener('DOMContentLoaded', () => {
    // Resolve query parameters
    const urlParams = new URLSearchParams(window.location.search);
    accessToken = urlParams.get('accessToken');
    orgId = urlParams.get('orgId');
    targetId = urlParams.get('targetId');
    const ptzEnable = urlParams.get('ptzEnable');
    const controlsEnable = urlParams.get('controlsEnable');
    const width = urlParams.get('width');
    const height = urlParams.get('height');
    const framerate = urlParams.get('framerate');
    audioReceive = !!urlParams.get('audioEnable');

    if (width) { streamDetails.videoReceive.width = Number(width); }
    if (height) { streamDetails.videoReceive.height = Number(height); }
    if (framerate) { streamDetails.videoReceive.framerate = Number(framerate); }

    // Only initialize video stream if mandatory query params exists, otherwise show help text
    if (accessToken && orgId && targetId) {
        main().then(async () => {
            // Start live stream
            await startLive();

            if (ptzEnable) {
                // Register click event for PAN
                document.getElementById("video").addEventListener('click', function (clickEvent) {
                    if (context) {
                        const element = document.getElementById("video");
                        const offsetX = (clickEvent.clientX - element.offsetLeft)
                        const offsetY = (clickEvent.clientY - element.offsetTop)
                        context.ptzCenter(offsetX, offsetY).catch((error) => {
                            console.error(`Ptz operation threw: ${error}`);
                        });
                    }
                });

                // Register wheel event for zoom
                document.getElementById("video").addEventListener('wheel', function (wheelEvent) {
                    let velocity = wheelEvent.deltaY < 0 ? 75 : -75;
                    wheelEvent.preventDefault();
                    if (velocity !== ptzVelocity) {
                        if (ptzZoomTimer) {
                            clearTimeout(ptzZoomTimer);
                            ptzZoomTimer = undefined;
                        }

                        ptzZoomTimer = setTimeout(() => {
                            ptzVelocity = 0;
                            if (context) {
                                context.ptzContinuousZoom(ptzVelocity);
                            }
                        }, 500);

                        ptzVelocity = velocity;
                        if (context) {
                            context.ptzContinuousZoom(ptzVelocity);
                        }
                    }
                }, { passive: false });
            }

            if (controlsEnable) {
                document.getElementById("controlsContainer").style.display = "block";
                document.getElementById("playButton").addEventListener('click', function (clickEvent) {
                    if (context) context.play();
                });
                document.getElementById("pauseButton").addEventListener('click', function (clickEvent) {
                    if (context) context.pause();
                });
                document.getElementById("muteButton").addEventListener('click', function (clickEvent) {
                    if (context) context.setMuted(true);
                });
                document.getElementById("unmuteButton").addEventListener('click', function (clickEvent) {
                    if (context) context.setMuted(false);
                });
                document.getElementById("videoSnapshot").addEventListener('click', function (clickEvent) {
                    recordLive(10000);
                });
            }
        });
    }
    else {
        showHelp();
    }
});

function showHelp() {
    document.getElementById("helpContainer").style.display = "block";
    document.getElementById("videoContainer").style.display = "none";
}

async function startLive() {
    try {
        signal = new SignalingHandler();

        await signal.setAccessToken(accessToken);
        await signal.setErrorHandler((error) => {
            console.error("Custom signal error handler:", error.toString());
        });
        await signal.connect(signalServer);

        let videoEl = document.getElementById('video');
        context = new WebRtcContext(signal, videoEl);

        await context.setDeviceAccessToken(accessToken);
        await context.setErrorHandler((error) => {
            console.error("Custom context error handler:", error.toString());
        });

        let request = new LiveVideoRequestParamObject(targetId);
        request.setOrgId(orgId);
        request.setStreamDetails(streamDetails);
        request.setVideoReceive(true);
        request.setAudioReceive(audioReceive);

        await context.requestLive(request);
        const res = context.getResolution();
        console.log(`Resolution: ${res.width}x${res.height}`);
    } catch (e) {
        console.error("startLive() failed:", e.toString());
    }
}

function recordLive(length) {
    const downloadButton = document.getElementById("videoSnapshot");
    let downloadLink = document.getElementById("downloadLink");

    // NOTE! This is a hack and not part of the supported webrtcvideo API
    // This hack can cease to work at any time
    const videoSrc = document.getElementById("video").children[0];
    const stream = videoSrc.captureStream ? videoSrc.captureStream() : videoSrc.mozCaptureStream();

    let recordedChunks = [];

    downloadButton.disabled = true;

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = (event) => recordedChunks.push(event.data);

    mediaRecorder.onstop = (event) => {
        console.log("Recorder stopped");
        let recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
        const blob = URL.createObjectURL(recordedBlob);
        downloadLink.href = blob;
        downloadLink.download = "RecordedVideo.webm";
        downloadLink.click();
        downloadButton.disabled = false;
    };

    setTimeout((event) => {
        mediaRecorder.stop();
    }, length);

    mediaRecorder.start();
    console.log("Recorder started");
}
