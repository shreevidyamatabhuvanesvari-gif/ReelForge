/*
====================================================
SHORTS / REEL TOOL
VIDEO ENGINE
js/video-engine.js
====================================================

Features:

✔ Multi Scene Playback
✔ 9:16 Vertical Video
✔ Scene Loading
✔ Video Metadata Reader
✔ Effect Integration
✔ TTS Integration
✔ Sequential Playback
✔ Mobile Friendly

====================================================
*/

window.VideoEngine = (() => {

  /*
  ====================================================
  INTERNAL STATE
  ====================================================
  */

  let scenes = [];

  let voiceMode =
    "female";

  let currentSceneIndex =
    0;

  let isRunning =
    false;

  /*
  ====================================================
  VIDEO ELEMENT
  ====================================================
  */

  const video =
    document.createElement(
      "video"
    );

  video.playsInline = true;

  video.muted = true;

  video.preload = "auto";

  /*
  ====================================================
  START
  ====================================================
  */

  async function start(config) {

    scenes =
      config.scenes || [];

    voiceMode =
      config.voiceMode ||
      "female";

    if (!scenes.length) {

      console.warn(
        "No scenes available."
      );

      return;

    }

    isRunning = true;

    currentSceneIndex = 0;

    console.log(
      "Video Engine Started"
    );

    await runScenes();

  }

  /*
  ====================================================
  RUN ALL SCENES
  ====================================================
  */

  async function runScenes() {

    for (
      let i = 0;
      i < scenes.length;
      i++
    ) {

      if (!isRunning) {

        return;

      }

      currentSceneIndex = i;

      const scene =
        scenes[i];

      await playScene(
        scene,
        i
      );

    }

    await completePlayback();

  }

  /*
  ====================================================
  PLAY SINGLE SCENE
  ====================================================
  */

  async function playScene(
    scene,
    sceneIndex
  ) {

    console.log(
      "Playing Scene:",
      sceneIndex + 1
    );

    /*
    ================================================
    LOAD VIDEO
    ================================================
    */

    await loadVideo(
      scene.videoURL
    );

    /*
    ================================================
    APPLY EFFECT
    ================================================
    */

    if (
      window.EffectsEngine &&
      typeof window.EffectsEngine
        .setEffect === "function"
    ) {

      window.EffectsEngine.setEffect(
        scene.effect
      );

    }

    /*
    ================================================
    SEND TO CANVAS
    ================================================
    */

    if (
      window.CanvasRecorder &&
      typeof window.CanvasRecorder
        .loadVideo === "function"
    ) {

      await window.CanvasRecorder
        .loadVideo({

          video,

          sceneIndex

        });

    }

    /*
    ================================================
    DISPLAY TEXT
    ================================================
    */

    if (
      window.CanvasRecorder &&
      typeof window.CanvasRecorder
        .renderText === "function"
    ) {

      await window.CanvasRecorder
        .renderText({

          text:
            scene.narration

        });

    }

    /*
    ================================================
    START VIDEO
    ================================================
    */

    await video.play();

    /*
    ================================================
    TTS
    ================================================
    */

    const ttsPromise =
      speakNarration(
        scene.narration
      );

    /*
    ================================================
    WAIT VIDEO END
    ================================================
    */

    const videoPromise =
      waitVideoEnd();

    await Promise.all([

      videoPromise,

      ttsPromise

    ]);

    /*
    ================================================
    TRANSITION
    ================================================
    */

    if (
      window.CanvasRecorder &&
      typeof window.CanvasRecorder
        .playSceneTransition ===
        "function"
    ) {

      await window.CanvasRecorder
        .playSceneTransition();

    }

  }

  /*
  ====================================================
  LOAD VIDEO
  ====================================================
  */

  function loadVideo(url) {

    return new Promise((resolve, reject) => {

      video.pause();

      video.src = "";

      video.load();

      video.src = url;

      video.onloadedmetadata =
        () => {

          resolve();

        };

      video.onerror =
        reject;

    });

  }

  /*
  ====================================================
  WAIT VIDEO END
  ====================================================
  */

  function waitVideoEnd() {

    return new Promise((resolve) => {

      video.onended =
        () => {

          resolve();

        };

    });

  }

  /*
  ====================================================
  SPEAK
  ====================================================
  */

  async function speakNarration(
    text
  ) {

    if (
      !window.TTSEngine ||
      typeof window.TTSEngine
        .speak !== "function"
    ) {

      return;

    }

    await window.TTSEngine
      .speak({

        text,

        voiceMode

      });

  }

  /*
  ====================================================
  COMPLETE
  ====================================================
  */

  async function completePlayback() {

    isRunning = false;

    console.log(
      "Playback Complete"
    );

    if (
      window.CanvasRecorder &&
      typeof window.CanvasRecorder
        .finalize === "function"
    ) {

      await window.CanvasRecorder
        .finalize();

    }

  }

  /*
  ====================================================
  STOP
  ====================================================
  */

  function stop() {

    isRunning = false;

    video.pause();

    if (
      window.TTSEngine &&
      typeof window.TTSEngine
        .stop === "function"
    ) {

      window.TTSEngine.stop();

    }

  }

  /*
  ====================================================
  GETTERS
  ====================================================
  */

  function getCurrentScene() {

    return currentSceneIndex;

  }

  function isPlaying() {

    return isRunning;

  }

  /*
  ====================================================
  PUBLIC API
  ====================================================
  */

  return {

    start,

    stop,

    isPlaying,

    getCurrentScene

  };

})();
