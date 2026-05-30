/*
====================================================
SHORTS / REEL CREATOR PRO
FINAL INTEGRATED CANVAS RECORDER
js/canvas-recorder.js
====================================================

Compatible With:

✔ VideoEngine
✔ TimelineEngine
✔ SubtitleEngine
✔ EffectsEngine
✔ ExportEngine

Features:

✔ 9:16 Reel Preview
✔ Real Video Rendering
✔ Subtitle Rendering
✔ Effects Rendering
✔ Recording Support
✔ Scene Transition
✔ Mobile Friendly

====================================================
*/

window.CanvasRecorder = (() => {

  /*
  ====================================================
  STATE
  ====================================================
  */

  let canvas = null;
  let ctx = null;

  let previewCanvas = null;
  let previewCtx = null;

  let previewElement = null;

  let animationFrame = null;

  let currentVideo = null;

  let mediaRecorder = null;

  let recordedChunks = [];

  /*
  ====================================================
  VIDEO SIZE
  ====================================================
  */

  const WIDTH = 1080;

  const HEIGHT = 1920;

  /*
  ====================================================
  INITIALIZE
  ====================================================
  */

  async function initialize(config) {

    canvas =
      config.canvas;

    previewElement =
      config.previewElement;

    if (!canvas) {

      throw new Error(
        "Canvas missing."
      );

    }

    canvas.width =
      WIDTH;

    canvas.height =
      HEIGHT;

    ctx =
      canvas.getContext(
        "2d"
      );

    /*
    ================================================
    PREVIEW CANVAS
    ================================================
    */

    if (previewElement) {

      previewElement.innerHTML =
        "";

      previewCanvas =
        document.createElement(
          "canvas"
        );

      previewCanvas.width =
        WIDTH;

      previewCanvas.height =
        HEIGHT;

      previewCanvas.style.width =
        "100%";

      previewCanvas.style.height =
        "100%";

      previewCanvas.style.display =
        "block";

      previewElement.appendChild(
        previewCanvas
      );

      previewCtx =
        previewCanvas.getContext(
          "2d"
        );

    }

    startRenderLoop();

    console.log(
      "CanvasRecorder Ready"
    );

  }

  /*
  ====================================================
  LOAD VIDEO
  ====================================================
  */

  async function loadVideo(
    config
  ) {

    currentVideo =
      config.video || null;

  }

  /*
  ====================================================
  RENDER TEXT
  ====================================================
  */

  async function renderText(
    config
  ) {

    if (
      window.SubtitleEngine
    ) {

      window.SubtitleEngine
        .setText(
          config.text || ""
        );

    }

  }

  /*
  ====================================================
  MAIN LOOP
  ====================================================
  */

  function startRenderLoop() {

    cancelAnimationFrame(
      animationFrame
    );

    const loop = () => {

      drawFrame();

      animationFrame =
        requestAnimationFrame(
          loop
        );

    };

    loop();

  }

  /*
  ====================================================
  DRAW FRAME
  ====================================================
  */

  function drawFrame() {

    if (!ctx) {

      return;

    }

    ctx.clearRect(
      0,
      0,
      WIDTH,
      HEIGHT
    );

    /*
    ================================================
    BACKGROUND
    ================================================
    */

    ctx.fillStyle =
      "#000";

    ctx.fillRect(
      0,
      0,
      WIDTH,
      HEIGHT
    );

    /*
    ================================================
    VIDEO
    ================================================
    */

    drawVideo();

    /*
    ================================================
    EFFECTS
    ================================================
    */

    if (
      window.EffectsEngine &&
      typeof window
        .EffectsEngine
        .draw ===
      "function"
    ) {

      window.EffectsEngine.draw(
        ctx,
        WIDTH,
        HEIGHT
      );

    }

    /*
    ================================================
    SUBTITLES
    ================================================
    */

    if (
      window.SubtitleEngine &&
      typeof window
        .SubtitleEngine
        .draw ===
      "function"
    ) {

      window.SubtitleEngine.draw(
        ctx,
        WIDTH,
        HEIGHT
      );

    }

    /*
    ================================================
    PREVIEW COPY
    ================================================
    */

    if (
      previewCtx &&
      previewCanvas
    ) {

      previewCtx.clearRect(
        0,
        0,
        WIDTH,
        HEIGHT
      );

      previewCtx.drawImage(
        canvas,
        0,
        0
      );

    }

  }

  /*
  ====================================================
  DRAW VIDEO
  ====================================================
  */

  function drawVideo() {

    if (
      !currentVideo
    ) {

      return;

    }

    if (
      !currentVideo.videoWidth ||
      !currentVideo.videoHeight
    ) {

      return;

    }

    try {

      const videoRatio =
        currentVideo.videoWidth /
        currentVideo.videoHeight;

      const canvasRatio =
        WIDTH / HEIGHT;

      let drawWidth;
      let drawHeight;

      if (
        videoRatio >
        canvasRatio
      ) {

        drawHeight =
          HEIGHT;

        drawWidth =
          HEIGHT *
          videoRatio;

      }

      else {

        drawWidth =
          WIDTH;

        drawHeight =
          WIDTH /
          videoRatio;

      }

      const x =
        (
          WIDTH -
          drawWidth
        ) / 2;

      const y =
        (
          HEIGHT -
          drawHeight
        ) / 2;

      ctx.drawImage(
        currentVideo,
        x,
        y,
        drawWidth,
        drawHeight
      );

    }

    catch (error) {

      console.warn(
        error
      );

    }

  }

  /*
  ====================================================
  START RECORDING
  ====================================================
  */

  async function startRecording() {

    const stream =
      canvas.captureStream(
        30
      );

    recordedChunks = [];

    mediaRecorder =
      new MediaRecorder(
        stream,
        {
          mimeType:
            "video/webm"
        }
      );

    mediaRecorder.ondataavailable =
      (event) => {

        if (
          event.data &&
          event.data.size > 0
        ) {

          recordedChunks.push(
            event.data
          );

        }

      };

    mediaRecorder.start();

    console.log(
      "Recording Started"
    );

  }

  /*
  ====================================================
  STOP RECORDING
  ====================================================
  */

  async function stopRecording() {

    return new Promise(
      (resolve) => {

        if (
          !mediaRecorder
        ) {

          resolve(
            null
          );

          return;

        }

        mediaRecorder.onstop =
          () => {

            const blob =
              new Blob(
                recordedChunks,
                {
                  type:
                    "video/webm"
                }
              );

            resolve(
              blob
            );

          };

        mediaRecorder.stop();

      }
    );

  }

  /*
  ====================================================
  TRANSITION
  ====================================================
  */

  async function playSceneTransition() {

    return new Promise(
      (resolve) => {

        let opacity = 0;

        const fade = () => {

          opacity += 0.08;

          ctx.save();

          ctx.fillStyle =
            `rgba(0,0,0,${opacity})`;

          ctx.fillRect(
            0,
            0,
            WIDTH,
            HEIGHT
          );

          ctx.restore();

          if (
            opacity >= 1
          ) {

            resolve();

            return;

          }

          requestAnimationFrame(
            fade
          );

        };

        fade();

      }
    );

  }

  /*
  ====================================================
  FINALIZE
  ====================================================
  */

  async function finalize() {

    cancelAnimationFrame(
      animationFrame
    );

    animationFrame =
      null;

    currentVideo =
      null;

    console.log(
      "Canvas Finalized"
    );

  }

  /*
  ====================================================
  PUBLIC API
  ====================================================
  */

  return {

    initialize,

    loadVideo,

    renderText,

    startRecording,

    stopRecording,

    playSceneTransition,

    finalize

  };

})();
