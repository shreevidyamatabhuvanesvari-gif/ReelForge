/*
====================================================
SHORTS / REEL TOOL
MAIN APPLICATION CONTROLLER
js/script.js
====================================================

Features:

✔ Scene Management
✔ Video Selection
✔ Narration Writing
✔ Effect Selection
✔ Voice Selection
✔ Playback Validation
✔ Engine Coordination
✔ Mobile Friendly
✔ Multi Scene Support

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
  DOM REFERENCES
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

  const voiceSelect =
    document.getElementById(
      "voiceSelect"
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
      "Shorts / Reel Tool Ready"
    );

  }

  /*
  ====================================================
  GLOBAL EVENTS
  ====================================================
  */

  function bindGlobalEvents() {

    if (addSceneBtn) {

      addSceneBtn.addEventListener(
        "click",
        addScene
      );

    }

    if (playBtn) {

      playBtn.addEventListener(
        "click",
        startPlayback
      );

    }

  }

  /*
  ====================================================
  ADD SCENE
  ====================================================
  */

  function addScene() {

    const sceneNumber =
      sceneContainer.children.length + 1;

    const card =
      document.createElement(
        "article"
      );

    card.className =
      "scene-card";

    card.innerHTML = `

      <div class="scene-header">

        <h3>
          Scene ${sceneNumber}
        </h3>

        <button
          type="button"
          class="remove-scene-btn"
        >
          Remove
        </button>

      </div>

      <div class="field-group">

        <label>
          Video Clip
        </label>

        <input
          type="file"
          accept="video/*"
          class="scene-video-input"
        >

      </div>

      <div class="field-group">

        <label>
          Narration
        </label>

        <textarea
          class="scene-text-input"
          rows="5"
          placeholder="अपना लेख लिखें..."
        ></textarea>

      </div>

      <div class="field-group">

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
            Flowers Rain
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

    const videoInput =
      scene.querySelector(
        ".scene-video-input"
      );

    const textInput =
      scene.querySelector(
        ".scene-text-input"
      );

    const effectSelect =
      scene.querySelector(
        ".scene-effect-select"
      );

    const removeBtn =
      scene.querySelector(
        ".remove-scene-btn"
      );

    if (videoInput) {

      videoInput.addEventListener(
        "change",
        syncScenes
      );

    }

    if (textInput) {

      textInput.addEventListener(
        "input",
        syncScenes
      );

    }

    if (effectSelect) {

      effectSelect.addEventListener(
        "change",
        syncScenes
      );

    }

    if (removeBtn) {

      removeBtn.addEventListener(
        "click",
        () => {

          if (
            sceneContainer.children.length <= 1
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
          card.querySelector("h3");

        if (title) {

          title.textContent =
            `Scene ${index + 1}`;

        }

      }
    );

  }

  /*
  ====================================================
  SYNC SCENES
  ====================================================
  */

  function syncScenes() {

    AppState.scenes = [];

    const cards =
      sceneContainer.querySelectorAll(
        ".scene-card"
      );

    cards.forEach((card) => {

      const videoInput =
        card.querySelector(
          ".scene-video-input"
        );

      const textInput =
        card.querySelector(
          ".scene-text-input"
        );

      const effectSelect =
        card.querySelector(
          ".scene-effect-select"
        );

      const file =
        videoInput?.files?.[0];

      AppState.scenes.push({

        video: file || null,

        videoURL:
          file
            ? URL.createObjectURL(file)
            : "",

        narration:
          textInput?.value.trim() || "",

        effect:
          effectSelect?.value || "none"

      });

    });

  }

  /*
  ====================================================
  VALIDATE
  ====================================================
  */

  function validateScenes() {

    if (
      !AppState.scenes.length
    ) {

      alert(
        "कोई Scene उपलब्ध नहीं है।"
      );

      return false;

    }

    for (const scene of AppState.scenes) {

      if (!scene.video) {

        alert(
          "हर Scene में वीडियो आवश्यक है।"
        );

        return false;

      }

      if (!scene.narration) {

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
  START PLAYBACK
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

    AppState.isPlaying = true;

    try {

      /*
      ================================================
      VIDEO ENGINE
      ================================================
      */

      if (
        window.VideoEngine &&
        typeof window.VideoEngine.start ===
          "function"
      ) {

        await window.VideoEngine.start({

          scenes:
            AppState.scenes,

          voiceMode:
            voiceSelect?.value ||
            "female"

        });

      }

    } catch (error) {

      console.error(error);

      alert(
        "Playback Failed"
      );

    } finally {

      AppState.isPlaying = false;

    }

  }

})();
