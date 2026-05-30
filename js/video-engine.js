/*

SHORTS / REEL CREATOR PRO
VIDEO ENGINE
FINAL TIMELINE COMPATIBLE VERSION
js/video-engine.js

Responsibilities

✔ Load Video
✔ Play Video
✔ Stop Video
✔ Get Duration
✔ Mobile Friendly
✔ Timeline Compatible
✔ Canvas Compatible

====================================================
*/

window.VideoEngine = (() => {

/*

INTERNAL STATE

*/

const video =
document.createElement(
"video"
);

let loaded =
false;

let currentScene =
null;

/*

VIDEO CONFIG

*/

video.preload =
"auto";

video.playsInline =
true;

video.muted =
true;

video.crossOrigin =
"anonymous";

/*

LOAD

*/

async function load(scene) {

if (!scene) {

  throw new Error(
    "Scene missing."
  );

}

const url =
  scene.videoURL ||
  scene.video ||
  "";

if (!url) {

  throw new Error(
    "Video URL missing."
  );

}

currentScene =
  scene;

loaded =
  false;

return new Promise(
  (
    resolve,
    reject
  ) => {

    video.pause();

    video.removeAttribute(
      "src"
    );

    video.load();

    video.onloadedmetadata =
      async () => {

        loaded =
          true;

        try {

          if (
            window.CanvasRecorder &&
            typeof window
              .CanvasRecorder
              .loadVideo ===
              "function"
          ) {

            await window
              .CanvasRecorder
              .loadVideo({

                video

              });

          }

        }

        catch (
          error
        ) {

          console.warn(
            error
          );

        }

        resolve();

      };

    video.onerror =
      reject;

    video.src =
      url;

  }
);

}

/*

PLAY

*/

async function play() {

if (!loaded) {

  return;

}

try {

  await video.play();

  await waitVideoEnd();

}

catch (error) {

  console.warn(
    error
  );

}

}

/*

WAIT VIDEO END

*/

function waitVideoEnd() {

return new Promise(
  (resolve) => {

    video.onended =
      () => {

        resolve();

      };

  }
);

}

/*

PAUSE

*/

function pause() {

try {

  video.pause();

}

catch (error) {

  console.warn(
    error
  );

}

}

/*

STOP

*/

function stop() {

try {

  video.pause();

  video.currentTime =
    0;

}

catch (error) {

  console.warn(
    error
  );

}

}

/*

DURATION

*/

function getDuration() {

return (
  video.duration ||
  0
);

}

/*

CURRENT TIME

*/

function getCurrentTime() {

return (
  video.currentTime ||
  0
);

}

/*

VIDEO ELEMENT

*/

function getVideo() {

return video;

}

/*

IS PLAYING

*/

function isPlaying() {

return (
  !video.paused &&
  !video.ended
);

}

/*

IS LOADED

*/

function isLoaded() {

return loaded;

}

/*

CURRENT SCENE

*/

function getCurrentScene() {

return currentScene;

}

/*

PUBLIC API

*/

return {

load,

play,

pause,

stop,

getVideo,

getDuration,

getCurrentTime,

getCurrentScene,

isLoaded,

isPlaying

};

})();
