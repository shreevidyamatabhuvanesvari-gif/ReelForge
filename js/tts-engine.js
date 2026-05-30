/*
====================================================
SHORTS / REEL CREATOR PRO
TTS ENGINE
js/tts-engine.js
====================================================

Features

✔ Hindi Priority Voice
✔ Female / Male / Auto
✔ Long Text Support
✔ Sentence Based Chunking
✔ Mobile Friendly
✔ Promise Based Playback
✔ Safe Stop
✔ Natural Pauses

====================================================
*/

window.TTSEngine = (() => {

  const synth =
    window.speechSynthesis;

  let voices = [];

  let initialized =
    false;

  let currentVoiceMode =
    "female";

  let stopRequested =
    false;

  /*
  ====================================================
  INITIALIZE
  ====================================================
  */

  async function initialize() {

    if (initialized) {

      return;

    }

    voices =
      await loadVoices();

    initialized =
      true;

    console.log(
      "TTS Engine Ready"
    );

  }

  /*
  ====================================================
  LOAD VOICES
  ====================================================
  */

  function loadVoices() {

    return new Promise(
      (resolve) => {

        let available =
          synth.getVoices();

        if (
          available.length
        ) {

          resolve(
            available
          );

          return;

        }

        const handler =
          () => {

            available =
              synth.getVoices();

            if (
              available.length
            ) {

              synth.removeEventListener?.(
                "voiceschanged",
                handler
              );

              resolve(
                available
              );

            }

          };

        if (
          synth.addEventListener
        ) {

          synth.addEventListener(
            "voiceschanged",
            handler
          );

        }

        synth.onvoiceschanged =
          handler;

        setTimeout(() => {

          resolve(
            synth.getVoices()
          );

        }, 2000);

      }
    );

  }

  /*
  ====================================================
  SPEAK
  ====================================================
  */

  async function speak(config = {}) {

    await initialize();

    stopRequested =
      false;

    const text =
      normalizeText(
        config.text || ""
      );

    currentVoiceMode =
      config.voiceMode ||
      "female";

    if (!text) {

      return;

    }

    const chunks =
      splitIntoSentences(
        text
      );

    for (
      const chunk
      of chunks
    ) {

      if (
        stopRequested
      ) {

        break;

      }

      await speakChunk(
        chunk
      );

      await wait(250);

    }

  }

  /*
  ====================================================
  SPEAK CHUNK
  ====================================================
  */

  function speakChunk(text) {

    return new Promise(
      (
        resolve,
        reject
      ) => {

        const speech =
          new SpeechSynthesisUtterance(
            text
          );

        const voice =
          selectVoice(
            currentVoiceMode
          );

        if (voice) {

          speech.voice =
            voice;

          speech.lang =
            voice.lang;

        } else {

          speech.lang =
            "hi-IN";

        }

        /*
        ==============================================
        SETTINGS
        ==============================================
        */

        if (
          currentVoiceMode ===
          "male"
        ) {

          speech.rate =
            0.95;

          speech.pitch =
            0.90;

        }

        else {

          speech.rate =
            0.95;

          speech.pitch =
            1.05;

        }

        speech.volume =
          1;

        speech.onend =
          () => {

            resolve();

          };

        speech.onerror =
          (event) => {

            console.warn(
              "TTS:",
              event.error
            );

            resolve();

          };

        synth.speak(
          speech
        );

      }
    );

  }

  /*
  ====================================================
  SELECT VOICE
  ====================================================
  */

  function selectVoice(
    mode
  ) {

    const hindiVoices =
      voices.filter(
        (voice) =>
          voice.lang &&
          voice.lang
            .toLowerCase()
            .startsWith("hi")
      );

    if (
      mode === "female"
    ) {

      const female =
        hindiVoices.find(
          (voice) =>
            /female|woman|swara|heera|samantha|zira/i.test(
              voice.name
            )
        );

      return (
        female ||
        hindiVoices[0] ||
        voices[0]
      );

    }

    if (
      mode === "male"
    ) {

      const male =
        hindiVoices.find(
          (voice) =>
            /male|man|ravi|alex|david/i.test(
              voice.name
            )
        );

      return (
        male ||
        hindiVoices[0] ||
        voices[0]
      );

    }

    return (
      hindiVoices[0] ||
      voices[0]
    );

  }

  /*
  ====================================================
  SPLIT SENTENCES
  ====================================================
  */

  function splitIntoSentences(
    text
  ) {

    const parts =
      text
        .replace(
          /\s+/g,
          " "
        )
        .trim()
        .split(
          /(?<=[।!?])\s+/
        );

    const result =
      [];

    for (
      const part
      of parts
    ) {

      if (
        part.trim()
      ) {

        result.push(
          part.trim()
        );

      }

    }

    return result.length
      ? result
      : [text];

  }

  /*
  ====================================================
  NORMALIZE
  ====================================================
  */

  function normalizeText(
    text
  ) {

    return text

      .replace(
        /\n+/g,
        " "
      )

      .replace(
        /\s+/g,
        " "
      )

      .trim();

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
  STOP
  ====================================================
  */

  function stop() {

    stopRequested =
      true;

    try {

      synth.cancel();

    }

    catch (error) {

      console.warn(
        error
      );

    }

  }

  /*
  ====================================================
  IS SPEAKING
  ====================================================
  */

  function isSpeaking() {

    return synth.speaking;

  }

  /*
  ====================================================
  PUBLIC API
  ====================================================
  */

  return {

    initialize,

    speak,

    stop,

    isSpeaking,

    getVoices() {

      return voices;

    },

    getCurrentVoiceMode() {

      return currentVoiceMode;

    }

  };

})();
