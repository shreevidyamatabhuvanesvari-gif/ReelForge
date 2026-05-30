/*
====================================================
SHORTS / REEL CREATOR PRO
TIMELINE ENGINE
js/timeline-engine.js
====================================================

Features

✔ Scene Sequencing
✔ Video Playback Control
✔ Subtitle Synchronization
✔ TTS Synchronization
✔ Effects Synchronization
✔ Play / Stop Support
✔ Mobile Friendly
✔ Promise Based Flow

====================================================
*/

window.TimelineEngine = (() => {

  /*
  ====================================================
  STATE
  ====================================================
  */

  let scenes = [];

  let running =
    false;

  let currentScene =
    -1;

  /*
  ====================================================
  START
  ====================================================
  */

  async function start(config = {}) {

    if (running) {

      return;

    }

    scenes =
      config.scenes || [];

    if (
      !scenes.length
    ) {

      console.warn(
        "No scenes found."
      );

      return;

    }

    running =
      true;

    currentScene =
      -1;

    try {

      for (
        let i = 0;
        i < scenes.length;
        i++
      ) {

        if (!running) {

          break;

        }

        currentScene =
          i;

        await playScene(
          scenes[i],
          i
        );

      }

    }

    catch (error) {

      console.error(
        error
      );

    }

    running =
      false;

  }

  /*
  ====================================================
  PLAY SCENE
  ====================================================
  */

  async function playScene(
    scene,
    index
  ) {

    if (!running) {

      return;

    }

    /*
    ==================================================
    VIDEO
    ==================================================
    */

    if (
      window.VideoEngine &&
      window.VideoEngine.load
    ) {

      await window.VideoEngine
        .load(scene);

    }

    /*
    ==================================================
    EFFECT
    ==================================================
    */

    if (
      window.EffectsEngine &&
      window.EffectsEngine
        .setEffect
    ) {

      window.EffectsEngine
        .setEffect(
          scene.effect ||
          "none"
        );

    }

    /*
    ==================================================
    SUBTITLE
    ==================================================
    */

    if (
      window.SubtitleEngine &&
      window.SubtitleEngine
        .setText
    ) {

      window.SubtitleEngine
        .setText(
          scene.text || ""
        );

    }

    /*
    ==================================================
    TTS
    ==================================================
    */

    const ttsPromise =
      speakScene(scene);

    /*
    ==================================================
    VIDEO PLAY
    ==================================================
    */

    const videoPromise =
      playVideo(scene);

    await Promise.all([

      ttsPromise,

      videoPromise

    ]);

    /*
    ==================================================
    CLEANUP
    ==================================================
    */

    if (
      window.SubtitleEngine
    ) {

      window.SubtitleEngine
        .clear();

    }

    await wait(400);

  }

  /*
  ====================================================
  PLAY VIDEO
  ====================================================
  */

  async function playVideo(
    scene
  ) {

    if (
      !window.VideoEngine
    ) {

      return;
    }

    if (
      typeof window
        .VideoEngine
        .play !==
      "function"
    ) {

      return;
    }

    try {

      await window
        .VideoEngine
        .play();

    }

    catch (error) {

      console.warn(
        error
      );

    }

  }

  /*
  ====================================================
  SPEAK SCENE
  ====================================================
  */

  async function speakScene(
    scene
  ) {

    if (
      !window.TTSEngine
    ) {

      return;
    }

    if (
      typeof window
        .TTSEngine
        .speak !==
      "function"
    ) {

      return;
    }

    const text =
      scene.text || "";

    if (!text.trim()) {

      return;

    }

    try {

      await window
        .TTSEngine
        .speak({

          text,

          voiceMode:
            scene.voice ||
            "female"

        });

    }

    catch (error) {

      console.warn(
        error
      );

    }

  }

  /*
  ====================================================
  STOP
  ====================================================
  */

  function stop() {

    running =
      false;

    if (
      window.TTSEngine &&
      window.TTSEngine.stop
    ) {

      window.TTSEngine
        .stop();

    }

    if (
      window.VideoEngine &&
      window.VideoEngine.stop
    ) {

      window.VideoEngine
        .stop();

    }

    if (
      window.SubtitleEngine
    ) {

      window.SubtitleEngine
        .clear();

    }

  }

  /*
  ====================================================
  WAIT
  ====================================================
  */

  function wait(ms) {

    return new Promise(
      (resolve) => {

        setTimeout(
          resolve,
          ms
        );

      }
    );

  }

  /*
  ====================================================
  STATUS
  ====================================================
  */

  function isRunning() {

    return running;

  }

  function getCurrentScene() {

    return currentScene;

  }

  /*
  ====================================================
  API
  ====================================================
  */

  return {

    start,

    stop,

    isRunning,

    getCurrentScene

  };

})();
