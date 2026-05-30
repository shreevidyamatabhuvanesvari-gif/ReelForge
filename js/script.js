/*
====================================================
SHORTS / REEL CREATOR PRO
FINAL INTEGRATED APP CONTROLLER
js/script.js
====================================================

Architecture

script.js
   ↓
TimelineEngine
   ↓
VideoEngine
TTSEngine
SubtitleEngine
EffectsEngine
   ↓
CanvasRecorder
   ↓
ExportEngine

====================================================
*/

(() => {

  /*
  ====================================================
  APP STATE
  ====================================================
  */

  const AppState = {

    scenes: [],

    isPlaying: false

  };

  /*
  ====================================================
  DOM
  ====================================================
  */

  const sceneContainer =
    document.getElementById(
      "sceneContainer"
    );

  const addSceneBtn =
    document.getElementById(
      "addSceneBtn"
    );

  const playBtn =
    document.getElementById(
      "playBtn"
    );

  const stopBtn =
    document.getElementById(
      "stopBtn"
    );

  const exportBtn =
    document.getElementById(
      "exportBtn"
    );

  const renderCanvas =
    document.getElementById(
      "renderCanvas"
    );

  const cinematicPreview =
    document.getElementById(
      "cinematicPreview"
    );

  /*
  ====================================================
  INIT
  ====================================================
  */

  initialize();

  function initialize() {

    bindGlobalEvents();

    const firstScene =
      document.querySelector(
        ".scene-card"
      );

    if (firstScene) {

      bindSceneEvents(
        firstScene
      );

    }

    syncScenes();

    console.log(
      "Shorts / Reel Creator Pro Ready"
    );

  }

  /*
  ====================================================
  EVENTS
  ====================================================
  */

  function bindGlobalEvents() {

    addSceneBtn?.addEventListener(
      "click",
      addScene
    );

    playBtn?.addEventListener(
      "click",
      startPlayback
    );

    stopBtn?.addEventListener(
      "click",
      stopPlayback
    );

    exportBtn?.addEventListener(
      "click",
      exportVideo
    );

  }

  /*
  ====================================================
  ADD SCENE
  ====================================================
  */

  function addScene() {

    const count =
      sceneContainer.children.length + 1;

    const card =
      document.createElement(
        "article"
      );

    card.className =
      "scene-card";

    card.innerHTML = `

      <div class="scene-topbar">

        <div class="scene-title">
          Scene ${count}
        </div>

        <button
          type="button"
          class="scene-remove-btn"
        >
          Remove
        </button>

      </div>

      <div class="scene-field">

        <label>
          Upload Video
        </label>

        <input
          type="file"
          accept="video/*"
          class="scene-video-input"
        />

      </div>

      <div class="scene-field">

        <label>
          Narration
        </label>

        <textarea
          class="scene-text-input"
          placeholder="लेख लिखें..."
        ></textarea>

      </div>

      <div class="scene-field">

        <label>
          Voice
        </label>

        <select
          class="scene-voice-select"
        >

          <option value="female">
            Indian Female
          </option>

          <option value="male">
            Indian Male
          </option>

        </select>

      </div>

      <div class="scene-field">

        <label>
          Effect
        </label>

        <select
          class="scene-effect-select"
        >

          <option value="none">
            None
          </option>

          <option value="flowers">
            Flower Rain
          </option>

          <option value="snow">
            Snow Fall
          </option>

          <option value="water">
            Water Rain
          </option>

          <option value="sparkles">
            Sparkles
          </option>

        </select>

      </div>

    `;

    sceneContainer.appendChild(
      card
    );

    bindSceneEvents(card);

    syncScenes();

  }

  /*
  ====================================================
  SCENE EVENTS
  ====================================================
  */

  function bindSceneEvents(scene) {

    scene
      .querySelector(
        ".scene-video-input"
      )
      ?.addEventListener(
        "change",
        syncScenes
      );

    scene
      .querySelector(
        ".scene-text-input"
      )
      ?.addEventListener(
        "input",
        syncScenes
      );

    scene
      .querySelector(
        ".scene-effect-select"
      )
      ?.addEventListener(
        "change",
        syncScenes
      );

    scene
      .querySelector(
        ".scene-voice-select"
      )
      ?.addEventListener(
        "change",
        syncScenes
      );

    scene
      .querySelector(
        ".scene-remove-btn"
      )
      ?.addEventListener(
        "click",
        () => {

          if (
            sceneContainer
              .children.length <= 1
          ) {

            alert(
              "कम से कम एक Scene आवश्यक है।"
            );

            return;

          }

          scene.remove();

          updateSceneTitles();

          syncScenes();

        }
      );

  }

  /*
  ====================================================
  UPDATE TITLES
  ====================================================
  */

  function updateSceneTitles() {

    const cards =
      sceneContainer.querySelectorAll(
        ".scene-card"
      );

    cards.forEach(
      (card, index) => {

        const title =
          card.querySelector(
            ".scene-title"
          );

        if (title) {

          title.textContent =
            `Scene ${index + 1}`;

        }

      }
    );

  }

  /*
  ====================================================
  SYNC
  ====================================================
  */

  function syncScenes() {

    AppState.scenes = [];

    const cards =
      sceneContainer.querySelectorAll(
        ".scene-card"
      );

    cards.forEach((card) => {

      const file =
        card.querySelector(
          ".scene-video-input"
        )?.files?.[0];

      AppState.scenes.push({

        video: file || null,

        videoURL:
          file
            ? URL.createObjectURL(file)
            : "",

        text:
          card.querySelector(
            ".scene-text-input"
          )?.value.trim() || "",

        voice:
          card.querySelector(
            ".scene-voice-select"
          )?.value || "female",

        effect:
          card.querySelector(
            ".scene-effect-select"
          )?.value || "none"

      });

    });

  }

  /*
  ====================================================
  VALIDATE
  ====================================================
  */

  function validateScenes() {

    for (
      const scene
      of AppState.scenes
    ) {

      if (!scene.video) {

        alert(
          "हर Scene में वीडियो आवश्यक है।"
        );

        return false;

      }

      if (!scene.text) {

        alert(
          "हर Scene में Narration आवश्यक है।"
        );

        return false;

      }

    }

    return true;

  }

  /*
  ====================================================
  PLAYBACK
  ====================================================
  */

  async function startPlayback() {

    if (AppState.isPlaying) {

      return;

    }

    syncScenes();

    if (!validateScenes()) {

      return;

    }

    try {

      AppState.isPlaying = true;

      await window.CanvasRecorder
        .initialize({

          canvas:
            renderCanvas,

          previewElement:
            cinematicPreview

        });

      await window.CanvasRecorder
        .startRecording();

      await window.TimelineEngine
        .start({

          scenes:
            AppState.scenes

        });

      const blob =
        await window.CanvasRecorder
          .stopRecording();

      if (
        blob &&
        window.ExportEngine
      ) {

        window.ExportEngine
          .setBlob(blob);

      }

    }

    catch (error) {

      console.error(error);

      alert(
        "Playback Failed"
      );

    }

    finally {

      AppState.isPlaying =
        false;

    }

  }

  /*
  ====================================================
  STOP
  ====================================================
  */

  function stopPlayback() {

    if (
      window.TimelineEngine
    ) {

      window.TimelineEngine.stop();

    }

    AppState.isPlaying =
      false;

  }

  /*
  ====================================================
  EXPORT
  ====================================================
  */

  async function exportVideo() {

    if (
      !window.ExportEngine
    ) {

      return;

    }

    if (
      !window.ExportEngine.hasExport()
    ) {

      alert(
        "पहले Reel Generate करें।"
      );

      return;

    }

    window.ExportEngine
      .download();

  }

})();
