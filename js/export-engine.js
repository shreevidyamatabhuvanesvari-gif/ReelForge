/*
====================================================
SHORTS / REEL CREATOR PRO
EXPORT ENGINE
js/export-engine.js
====================================================

Features

✔ WebM Export
✔ Download Support
✔ Mobile Friendly
✔ Export Button Support
✔ Blob Management
✔ Safe Error Handling
✔ Canvas Recorder Integration

====================================================
*/

window.ExportEngine = (() => {

  /*
  ====================================================
  INTERNAL STATE
  ====================================================
  */

  let exportedBlob =
    null;

  /*
  ====================================================
  SET EXPORTED BLOB
  ====================================================
  */

  function setBlob(blob) {

    exportedBlob =
      blob || null;

  }

  /*
  ====================================================
  GET EXPORTED BLOB
  ====================================================
  */

  function getBlob() {

    return exportedBlob;

  }

  /*
  ====================================================
  HAS EXPORT
  ====================================================
  */

  function hasExport() {

    return !!exportedBlob;

  }

  /*
  ====================================================
  EXPORT FROM RECORDER
  ====================================================
  */

  async function exportVideo() {

    try {

      if (
        !window.CanvasRecorder
      ) {

        throw new Error(
          "CanvasRecorder not found."
        );

      }

      if (
        typeof window.CanvasRecorder
          .stopRecording !==
        "function"
      ) {

        throw new Error(
          "stopRecording() missing."
        );

      }

      const blob =
        await window.CanvasRecorder
          .stopRecording();

      if (!blob) {

        throw new Error(
          "No video generated."
        );

      }

      exportedBlob =
        blob;

      return blob;

    }

    catch (error) {

      console.error(
        "Export failed:",
        error
      );

      throw error;

    }

  }

  /*
  ====================================================
  DOWNLOAD
  ====================================================
  */

  function download(
    filename =
      createFileName()
  ) {

    if (!exportedBlob) {

      alert(
        "कोई exported वीडियो उपलब्ध नहीं है।"
      );

      return;

    }

    const url =
      URL.createObjectURL(
        exportedBlob
      );

    const link =
      document.createElement(
        "a"
      );

    link.href =
      url;

    link.download =
      filename;

    document.body.appendChild(
      link
    );

    link.click();

    document.body.removeChild(
      link
    );

    setTimeout(() => {

      URL.revokeObjectURL(
        url
      );

    }, 1000);

  }

  /*
  ====================================================
  EXPORT + DOWNLOAD
  ====================================================
  */

  async function exportAndDownload() {

    const blob =
      await exportVideo();

    if (blob) {

      download();

    }

  }

  /*
  ====================================================
  CREATE FILE NAME
  ====================================================
  */

  function createFileName() {

    const date =
      new Date();

    const stamp =
      [

        date.getFullYear(),

        pad(
          date.getMonth() + 1
        ),

        pad(
          date.getDate()
        ),

        "-",

        pad(
          date.getHours()
        ),

        pad(
          date.getMinutes()
        ),

        pad(
          date.getSeconds()
        )

      ].join("");

    return (
      "reel-" +
      stamp +
      ".webm"
    );

  }

  /*
  ====================================================
  PAD
  ====================================================
  */

  function pad(value) {

    return String(
      value
    ).padStart(
      2,
      "0"
    );

  }

  /*
  ====================================================
  CLEAR
  ====================================================
  */

  function clear() {

    exportedBlob =
      null;

  }

  /*
  ====================================================
  SHARE (MOBILE)
  ====================================================
  */

  async function share() {

    try {

      if (
        !exportedBlob
      ) {

        alert(
          "कोई exported वीडियो उपलब्ध नहीं है।"
        );

        return;

      }

      if (
        !navigator.share
      ) {

        download();

        return;

      }

      const file =
        new File(
          [exportedBlob],
          createFileName(),
          {
            type:
              "video/webm"
          }
        );

      await navigator.share({

        files: [file],

        title:
          "Shorts Reel",

        text:
          "Created with Reel Creator Pro"

      });

    }

    catch (error) {

      console.warn(
        "Share cancelled:",
        error
      );

    }

  }

  /*
  ====================================================
  PUBLIC API
  ====================================================
  */

  return {

    setBlob,

    getBlob,

    hasExport,

    exportVideo,

    exportAndDownload,

    download,

    share,

    clear

  };

})();
