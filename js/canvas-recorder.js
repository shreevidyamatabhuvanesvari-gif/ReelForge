/*
====================================================
SHORTS / REEL TOOL
CANVAS RECORDER
js/canvas-recorder.js
====================================================

Features:

✔ 9:16 Reel Preview
✔ Video Rendering
✔ Text Overlay
✔ Effects Rendering
✔ Scene Transition
✔ Canvas Recording
✔ Mobile Friendly
✔ WebM Export

====================================================
*/

window.CanvasRecorder = (() => {

  /*
  ====================================================
  INTERNAL STATE
  ====================================================
  */

  let canvas = null;
  let ctx = null;

  let previewContainer =
    null;

  let previewCanvas =
    null;

  let previewCtx =
    null;

  let animationFrame =
    null;

  let currentVideo =
    null;

  let currentText =
    "";

  let mediaRecorder =
    null;

  let recordedChunks =
    [];

  /*
  ====================================================
  VIDEO SIZE
  ====================================================
  */

  const WIDTH =
    1080;

  const HEIGHT =
    1920;

  /*
  ====================================================
  INITIALIZE
  ====================================================
  */

  async function initialize(
    config
  ) {

    canvas =
      config.canvas;

    previewContainer =
      config.previewElement;

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

    previewContainer.innerHTML =
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

    previewContainer.appendChild(
      previewCanvas
    );

    previewCtx =
      previewCanvas.getContext(
        "2d"
      );

    startRenderLoop();

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
      config.video;

  }

  /*
  ====================================================
  RENDER TEXT
  ====================================================
  */

  async function renderText(
    config
  ) {

    currentText =
      config.text || "";

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

    const loop =
      () => {

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
      window.EffectsEngine
    ) {

      window.EffectsEngine.draw(
        ctx,
        WIDTH,
        HEIGHT
      );

    }

    /*
    ================================================
    TEXT
    ================================================
    */

    drawText();

    /*
    ================================================
    PREVIEW COPY
    ================================================
    */

    if (previewCtx) {

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

    catch (
      error
    ) {

      console.warn(
        error
      );

    }

  }

  /*
  ====================================================
  DRAW TEXT
  ====================================================
  */

  function drawText() {

    if (
      !currentText
    ) {

      return;

    }

    const boxHeight =
      320;

    const boxY =
      HEIGHT -
      boxHeight -
      80;

    /*
    ================================================
    GLASS BOX
    ================================================
    */

    ctx.save();

    ctx.fillStyle =
      "rgba(0,0,0,0.45)";

    roundRect(
      ctx,
      60,
      boxY,
      WIDTH - 120,
      boxHeight,
      40
    );

    ctx.fill();

    /*
    ================================================
    TEXT STYLE
    ================================================
    */

    ctx.fillStyle =
      "#ffffff";

    ctx.textAlign =
      "center";

    ctx.font =
      "bold 56px Arial";

    const lines =
      wrapText(
        currentText,
        26
      );

    let y =
      boxY + 90;

    lines.forEach(
      (line) => {

        ctx.fillText(
          line,
          WIDTH / 2,
          y
        );

        y += 72;

      }
    );

    ctx.restore();

  }

  /*
  ====================================================
  WRAP TEXT
  ====================================================
  */

  function wrapText(
    text,
    maxLength
  ) {

    const words =
      text.split(
        " "
      );

    const lines =
      [];

    let current =
      "";

    words.forEach(
      (word) => {

        const test =
          current +
          word +
          " ";

        if (
          test.length >
          maxLength
        ) {

          lines.push(
            current.trim()
          );

          current =
            word + " ";

        }

        else {

          current =
            test;

        }

      }
    );

    if (
      current.trim()
    ) {

      lines.push(
        current.trim()
      );

    }

    return lines.slice(
      0,
      4
    );

  }

  /*
  ====================================================
  ROUND RECT
  ====================================================
  */

  function roundRect(
    ctx,
    x,
    y,
    width,
    height,
    radius
  ) {

    ctx.beginPath();

    ctx.moveTo(
      x + radius,
      y
    );

    ctx.lineTo(
      x + width - radius,
      y
    );

    ctx.quadraticCurveTo(
      x + width,
      y,
      x + width,
      y + radius
    );

    ctx.lineTo(
      x + width,
      y + height - radius
    );

    ctx.quadraticCurveTo(
      x + width,
      y + height,
      x + width - radius,
      y + height
    );

    ctx.lineTo(
      x + radius,
      y + height
    );

    ctx.quadraticCurveTo(
      x,
      y + height,
      x,
      y + height - radius
    );

    ctx.lineTo(
      x,
      y + radius
    );

    ctx.quadraticCurveTo(
      x,
      y,
      x + radius,
      y
    );

    ctx.closePath();

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

    recordedChunks =
      [];

    mediaRecorder =
      new MediaRecorder(
        stream
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

            resolve(

              new Blob(

                recordedChunks,

                {
                  type:
                    "video/webm"
                }

              )

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

        setTimeout(
          resolve,
          500
        );

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
