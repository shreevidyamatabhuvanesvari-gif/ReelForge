/*
====================================================
SHORTS / REEL TOOL
EFFECTS ENGINE
js/effects-engine.js
====================================================

Features:

✔ Flowers Rain
✔ Snow Fall
✔ Water Rain
✔ Sparkles
✔ Hearts
✔ Leaves
✔ Fire Particles
✔ Mobile Friendly

====================================================
*/

window.EffectsEngine = (() => {

  /*
  ====================================================
  INTERNAL STATE
  ====================================================
  */

  let currentEffect =
    "none";

  let particles = [];

  const MAX_PARTICLES =
    80;

  /*
  ====================================================
  SET EFFECT
  ====================================================
  */

  function setEffect(effect) {

    currentEffect =
      effect || "none";

    particles = [];

    createParticles();

    console.log(
      "Effect:",
      currentEffect
    );

  }

  /*
  ====================================================
  CREATE PARTICLES
  ====================================================
  */

  function createParticles() {

    for (
      let i = 0;
      i < MAX_PARTICLES;
      i++
    ) {

      particles.push({

        x:
          Math.random(),

        y:
          Math.random(),

        size:
          0.5 +
          Math.random() * 1.5,

        speed:
          0.002 +
          Math.random() * 0.004,

        drift:
          (
            Math.random() -
            0.5
          ) * 0.002

      });

    }

  }

  /*
  ====================================================
  UPDATE
  ====================================================
  */

  function update() {

    particles.forEach(
      (particle) => {

        particle.y +=
          particle.speed;

        particle.x +=
          particle.drift;

        if (
          particle.y > 1.1
        ) {

          particle.y =
            -0.1;

          particle.x =
            Math.random();

        }

      }
    );

  }

  /*
  ====================================================
  DRAW
  ====================================================
  */

  function draw(
    ctx,
    width,
    height
  ) {

    if (
      currentEffect ===
      "none"
    ) {

      return;

    }

    update();

    particles.forEach(
      (particle) => {

        const x =
          particle.x *
          width;

        const y =
          particle.y *
          height;

        const size =
          particle.size *
          10;

        switch (
          currentEffect
        ) {

          case "flowers":

            drawFlower(
              ctx,
              x,
              y,
              size
            );

            break;

          case "snow":

            drawSnow(
              ctx,
              x,
              y,
              size
            );

            break;

          case "water":

            drawWater(
              ctx,
              x,
              y,
              size
            );

            break;

          case "sparkles":

            drawSparkle(
              ctx,
              x,
              y,
              size
            );

            break;

          case "hearts":

            drawHeart(
              ctx,
              x,
              y,
              size
            );

            break;

          case "leaves":

            drawLeaf(
              ctx,
              x,
              y,
              size
            );

            break;

          case "fire":

            drawFire(
              ctx,
              x,
              y,
              size
            );

            break;

        }

      }
    );

  }

  /*
  ====================================================
  FLOWER
  ====================================================
  */

  function drawFlower(
    ctx,
    x,
    y,
    size
  ) {

    ctx.save();

    ctx.font =
      `${size * 2}px serif`;

    ctx.fillText(
      "🌸",
      x,
      y
    );

    ctx.restore();

  }

  /*
  ====================================================
  SNOW
  ====================================================
  */

  function drawSnow(
    ctx,
    x,
    y,
    size
  ) {

    ctx.save();

    ctx.beginPath();

    ctx.arc(
      x,
      y,
      size,
      0,
      Math.PI * 2
    );

    ctx.fillStyle =
      "rgba(255,255,255,0.9)";

    ctx.fill();

    ctx.restore();

  }

  /*
  ====================================================
  WATER
  ====================================================
  */

  function drawWater(
    ctx,
    x,
    y,
    size
  ) {

    ctx.save();

    ctx.beginPath();

    ctx.arc(
      x,
      y,
      size,
      0,
      Math.PI * 2
    );

    ctx.fillStyle =
      "rgba(0,180,255,0.75)";

    ctx.fill();

    ctx.restore();

  }

  /*
  ====================================================
  SPARKLE
  ====================================================
  */

  function drawSparkle(
    ctx,
    x,
    y,
    size
  ) {

    ctx.save();

    ctx.font =
      `${size * 2}px serif`;

    ctx.fillText(
      "✨",
      x,
      y
    );

    ctx.restore();

  }

  /*
  ====================================================
  HEART
  ====================================================
  */

  function drawHeart(
    ctx,
    x,
    y,
    size
  ) {

    ctx.save();

    ctx.font =
      `${size * 2}px serif`;

    ctx.fillText(
      "❤️",
      x,
      y
    );

    ctx.restore();

  }

  /*
  ====================================================
  LEAF
  ====================================================
  */

  function drawLeaf(
    ctx,
    x,
    y,
    size
  ) {

    ctx.save();

    ctx.font =
      `${size * 2}px serif`;

    ctx.fillText(
      "🍂",
      x,
      y
    );

    ctx.restore();

  }

  /*
  ====================================================
  FIRE
  ====================================================
  */

  function drawFire(
    ctx,
    x,
    y,
    size
  ) {

    ctx.save();

    ctx.font =
      `${size * 2}px serif`;

    ctx.fillText(
      "🔥",
      x,
      y
    );

    ctx.restore();

  }

  /*
  ====================================================
  PUBLIC API
  ====================================================
  */

  return {

    setEffect,

    draw

  };

})();
