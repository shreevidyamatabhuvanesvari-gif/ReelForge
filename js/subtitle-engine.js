/*
====================================================
SHORTS / REEL CREATOR PRO
SUBTITLE ENGINE
js/subtitle-engine.js
====================================================

Features

✔ Hindi Subtitle Support
✔ Multi Line Captions
✔ Instagram Style Layout
✔ YouTube Shorts Style Layout
✔ Word Wrapping
✔ Dynamic Font Scaling
✔ Safe Area Rendering
✔ Mobile Friendly
✔ Canvas Compatible

====================================================
*/

window.SubtitleEngine = (() => {

  /*
  ====================================================
  CONFIG
  ====================================================
  */

  const CONFIG = {

    MAX_WIDTH_RATIO:
      0.84,

    BOTTOM_MARGIN:
      220,

    SIDE_PADDING:
      40,

    LINE_HEIGHT_RATIO:
      1.35,

    MAX_LINES:
      4,

    MIN_FONT_SIZE:
      42,

    MAX_FONT_SIZE:
      72

  };

  /*
  ====================================================
  CURRENT SUBTITLE
  ====================================================
  */

  let currentText =
    "";

  /*
  ====================================================
  SET TEXT
  ====================================================
  */

  function setText(text) {

    currentText =
      sanitizeText(
        text || ""
      );

  }

  /*
  ====================================================
  GET TEXT
  ====================================================
  */

  function getText() {

    return currentText;

  }

  /*
  ====================================================
  CLEAR
  ====================================================
  */

  function clear() {

    currentText =
      "";

  }

  /*
  ====================================================
  DRAW
  ====================================================
  */

  function draw(
    ctx,
    canvasWidth,
    canvasHeight
  ) {

    if (
      !currentText
    ) {

      return;

    }

    const fontSize =
      calculateFontSize(
        currentText
      );

    ctx.save();

    ctx.font =
      `700 ${fontSize}px Arial`;

    ctx.textAlign =
      "center";

    ctx.textBaseline =
      "middle";

    const maxWidth =
      canvasWidth *
      CONFIG.MAX_WIDTH_RATIO;

    const lines =
      wrapText(
        ctx,
        currentText,
        maxWidth
      );

    const visibleLines =
      lines.slice(
        0,
        CONFIG.MAX_LINES
      );

    const lineHeight =
      fontSize *
      CONFIG.LINE_HEIGHT_RATIO;

    const blockHeight =
      visibleLines.length *
      lineHeight;

    const startY =
      canvasHeight -
      CONFIG.BOTTOM_MARGIN -
      (
        blockHeight / 2
      );

    /*
    ==================================================
    DRAW BACKGROUND
    ==================================================
    */

    drawBackgroundBox(

      ctx,

      canvasWidth,

      startY,

      visibleLines,

      lineHeight,

      maxWidth

    );

    /*
    ==================================================
    DRAW TEXT
    ==================================================
    */

    visibleLines.forEach(

      (
        line,
        index
      ) => {

        const y =
          startY +
          (
            index *
            lineHeight
          );

        ctx.lineWidth =
          8;

        ctx.strokeStyle =
          "rgba(0,0,0,0.9)";

        ctx.strokeText(

          line,

          canvasWidth / 2,

          y

        );

        ctx.fillStyle =
          "#ffffff";

        ctx.fillText(

          line,

          canvasWidth / 2,

          y

        );

      }

    );

    ctx.restore();

  }

  /*
  ====================================================
  BACKGROUND BOX
  ====================================================
  */

  function drawBackgroundBox(

    ctx,

    canvasWidth,

    startY,

    lines,

    lineHeight,

    maxWidth

  ) {

    const height =
      lines.length *
      lineHeight +
      50;

    const width =
      maxWidth + 40;

    const x =
      (
        canvasWidth -
        width
      ) / 2;

    const y =
      startY - 35;

    const radius =
      24;

    ctx.save();

    ctx.fillStyle =
      "rgba(0,0,0,0.45)";

    roundRect(

      ctx,

      x,

      y,

      width,

      height,

      radius

    );

    ctx.fill();

    ctx.restore();

  }

  /*
  ====================================================
  WRAP TEXT
  ====================================================
  */

  function wrapText(

    ctx,

    text,

    maxWidth

  ) {

    const words =
      text.split(" ");

    const lines =
      [];

    let line =
      "";

    for (
      const word
      of words
    ) {

      const testLine =
        line +
        word +
        " ";

      const width =
        ctx.measureText(
          testLine
        ).width;

      if (
        width >
          maxWidth &&
        line
      ) {

        lines.push(
          line.trim()
        );

        line =
          word + " ";

      }

      else {

        line =
          testLine;

      }

    }

    if (
      line.trim()
    ) {

      lines.push(
        line.trim()
      );

    }

    return lines;

  }

  /*
  ====================================================
  FONT SIZE
  ====================================================
  */

  function calculateFontSize(
    text
  ) {

    const length =
      text.length;

    if (
      length < 40
    ) {

      return 72;

    }

    if (
      length < 80
    ) {

      return 64;

    }

    if (
      length < 120
    ) {

      return 58;

    }

    if (
      length < 180
    ) {

      return 52;

    }

    return 46;

  }

  /*
  ====================================================
  SANITIZE
  ====================================================
  */

  function sanitizeText(
    text
  ) {

    return text

      .replace(
        /\s+/g,
        " "
      )

      .trim();

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
  PUBLIC API
  ====================================================
  */

  return {

    setText,

    getText,

    clear,

    draw

  };

})();
