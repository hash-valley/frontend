import React from "react";
import dynamic from "next/dynamic";

// @ts-ignore
const Sketch = dynamic(() => import("react-p5").then((mod) => mod.default), {
  ssr: false,
});

const MintSketch: React.FC<any> = ({ vine_location, vine_elevation, vine_soil }) => {
  const day = 86400;
  const offsets = [2, 9, -7, -10, -2, 5, 9, 7, 6, -4, -4, 7, 8, -4, 2];

  let numVines = 20;
  let vines: any = [];
  let cloudX = -200;
  let cloudY = 550;
  if (vine_location == 16 || vine_location == 17) {
    cloudY = -200;
  }
  if (vine_location == 17) {
    numVines = 40;
  }
  let trainX = -200;
  let width = 600;
  let height = 600;

  const setup = (p5: any, canvasParentRef: any) => {
    // use parent to render the canvas in this ref
    // (without that p5 will render the canvas outside of your component)
    p5.createCanvas(width, height).parent(canvasParentRef);

    const canvasElement = document.getElementById("defaultCanvas0");

    if (document.body.clientWidth > 500) {
      canvasElement!.style.width = "450px";
      canvasElement!.style.height = "450px";
    } else if (document.body.clientWidth > 345) {
      canvasElement!.style.width = "316px";
      canvasElement!.style.height = "316px";
    } else {
      canvasElement!.style.width = "285px";
      canvasElement!.style.height = "285px";
    }
    p5.noStroke();
  };

  const draw = (p5: any) => {
    class Vineyard {
      x;
      y;
      constructor(i: number) {
        if (vine_location < 17) {
          if (i < numVines / 2) {
            this.x = 100 + i * 40;
            this.y = 500;
          } else {
            this.x = -300 + i * 40;
            this.y = 550;
          }
        } else {
          if (i < 20) {
            this.x = -4 + i * 40;
            this.y = 500;
          } else {
            this.x = -4 + (i - 20) * 40;
            this.y = 550;
          }
        }
      }

      fillNextColor() {
        p5.fill(
          `rgb(${parseInt(p5.random(0, 255))},${parseInt(p5.random(0, 255))},${parseInt(
            p5.random(0, 255)
          )})`
        );
      }

      display() {
        if (vine_location < 17) {
          p5.fill("#594300");
          p5.rect(this.x, this.y, 8, 32);
        }

        p5.fill("#268415");
        p5.ellipse(this.x + 4, this.y + 7, 24, 24);

        if (vine_location == 15) p5.fill("#B8ECFF");
        else if (vine_location == 16) p5.fill("#FC61D0");
        else if (vine_location == 17) this.fillNextColor();
        else p5.fill("#c013ed");
        p5.ellipse(this.x + 4, this.y + 7, 16, 16);

        p5.fill("#268415");
        p5.ellipse(this.x + 4, this.y + 7, 8, 8);
      }
    }

    if (vine_location < 17) {
      for (let i = 0; i < numVines; i++) {
        vines[i] = new Vineyard(i);
      }
    } else {
      for (let i = 0; i < 40; i++) {
        vines[i] = new Vineyard(i);
      }
      numVines = 40;
    }

    function timeOfDay() {
      const seconds = Math.floor((Date.now() / 1000) % (24 * 60 * 60));
      return seconds + offsets[vine_location] * 60 * 60;
    }

    function backgroundFromTime() {
      const time = timeOfDay();
      const factor = time / (day / 2);
      let result;
      if (time <= day / 2) result = factor * 255;
      else result = -(factor - 1) * 255 + 255;
      return result;
    }

    function locationAction() {
      doTerrain();
    }

    function doGround(h: any) {
      if (vine_soil == 0) p5.fill("#c4c4c4");
      else if (vine_soil == 1) p5.fill("#f3f4a0");
      else if (vine_soil == 2) p5.fill("#eeb75d");
      else if (vine_soil == 3) p5.fill("#0b6707");
      else if (vine_soil == 4) p5.fill("#00952f");
      else if (vine_soil == 5) p5.fill("#c5b973");
      else if (vine_soil == 6) p5.fill("#e8afa1");
      else if (vine_soil == 7) p5.fill("#2d2921");
      else if (vine_soil == 8) p5.fill("#f1eae3");

      p5.rect(0, h, width, height);
    }

    function doTulips(x: any, y: any) {
      p5.strokeWeight(8);
      for (let i = 0; i < 3; i++) {
        y += 12;
        p5.stroke("#f7167d");
        p5.line(x, y, x + 260, y);
        p5.stroke("#16f7db");
        p5.line(x, y + 4, x + 260, y + 4);
        p5.stroke("#f7f016");
        p5.line(x, y + 8, x + 260, y + 8);
      }
      p5.noStroke();
    }

    function doRiver(x: any, y: any) {
      p5.strokeWeight(40);
      p5.stroke("#169bf7");
      p5.bezier(x, y, x + 150, y + 100, x + 300, y, x + 600, y + 120);
      p5.noStroke();
    }

    function doWaterfall(x: any, y: any, weight: any, length: any, xVary: any) {
      p5.noFill();
      p5.strokeWeight(weight);
      p5.stroke("#169bf7");
      p5.bezier(x, y, x + xVary, y + length / 2, x - xVary, y + length, x, y + length * 2);
      p5.noStroke();
    }

    function doTusks() {
      let x = 500;
      let y = 400;
      p5.stroke("white");
      p5.noFill();
      p5.strokeWeight(8);
      p5.arc(x, y, 20, 40, 0, p5.PI + p5.HALF_PI);
      p5.arc(x - 30, y, 20, 40, -(2 * p5.PI + p5.HALF_PI), p5.PI);

      x = 50;
      y = 360;
      p5.strokeWeight(3);
      p5.arc(x, y, 5, 15, 0, p5.PI + p5.HALF_PI);
      p5.arc(x - 10, y, 5, 15, -(2 * p5.PI + p5.HALF_PI), p5.PI);
      p5.noStroke();
    }

    function mHeight(h: any, big = false) {
      let elev_factor;
      if (big) {
        elev_factor = p5.map(vine_elevation, 117406080, 8448000, 0, 1);
        return elev_factor * h + 12;
      } else {
        elev_factor = p5.map(vine_elevation, -6000, 25000, 0, 1);
        return (1 - elev_factor) * h;
      }
    }

    function doTerrain() {
      if (vine_location == 0) {
        //Amsterdam
        doGround(425);

        p5.fill("#416C6C");
        p5.triangle(-200, 425, 0, 350, 400, 425);
        p5.fill("#CCD8D9");
        p5.triangle(200, 425, 450, 350, 800, 425);

        doTulips(300, 430);
      } else if (vine_location == 1) {
        //tokyo
        doGround(475);

        p5.fill("#CCD8D9");
        p5.triangle(-100, 375, 70, 240, 300, 375);
        p5.triangle(200, 375, 425, 240, 900, 375);
        p5.fill("#B8CBCD");
        p5.triangle(-200, 475, 270, 280, 1000, 475);
        p5.fill("#94AEB2");
        p5.triangle(-400, 475, 50, 360, 420, 475);

        //building 1
        p5.fill(224, 193, 215);
        p5.rect(80, 335, 64, 140);
        p5.rect(85, 330, 52, 10);
        //windows
        p5.fill(194, 168, 187);
        p5.rect(83, 340, 8, 130);
        p5.rect(93, 340, 8, 130);
        p5.rect(103, 340, 8, 130);
        p5.rect(113, 340, 8, 130);
        p5.rect(123, 340, 8, 130);
        p5.rect(133, 340, 8, 130);

        //building 2
        p5.fill(224, 193, 215);
        p5.rect(205, 325, 40, 150);
        p5.ellipse(225, 325, 20, 20);
        p5.strokeWeight(1);
        p5.stroke(224, 193, 215);
        p5.line(225, 325, 225, 300);
        p5.noStroke();

        //building 3
        p5.fill(224, 193, 215);
        p5.rect(300, 345, 60, 130);
        p5.fill(194, 168, 187);
        p5.rect(298, 355, 64, 10);
        p5.rect(298, 375, 64, 10);
        p5.rect(298, 395, 64, 10);
        p5.rect(298, 415, 64, 10);
        p5.rect(298, 435, 64, 10);
        p5.rect(298, 455, 64, 10);

        //building 4
        p5.fill(224, 193, 215);
        p5.rect(425, 355, 65, 120);
        p5.rect(435, 325, 45, 40);
        p5.rect(456, 295, 5, 40);
      } else if (vine_location == 2) {
        // napa
        doGround(325);

        p5.fill("#CCD8D9");
        p5.triangle(200, 325, 450, 250, 800, 325);

        // hot air balloon
        balloon(120, 130, "rgb(238,81,81)");
        balloon(470, 155, "rgb(237,241,161)");
      } else if (vine_location == 3) {
        //denali
        doGround(275);

        p5.fill("#CCD8D9");
        p5.triangle(-100, 275, 70, mHeight(275), 300, 275);
        p5.triangle(200, 275, 425, mHeight(275), 900, 275);
        p5.fill("#B8CBCD");
        p5.triangle(-200, 375, 270, mHeight(375), 1000, 375);
        p5.fill("#94AEB2");
        p5.triangle(-200, 425, 20, mHeight(425), 300, 425);
        p5.fill("#6E9091");
        p5.triangle(100, 425, 320, mHeight(425), 600, 425);
        p5.fill("#416C6C");
        p5.triangle(-200, 425, 0, mHeight(425), 400, 425);

        // glaciers
        p5.fill("rgb(209,248,241)");
        p5.quad(60, 600, 30, 470, -10, 450, -10, 600);
        p5.quad(540, 600, 570, 470, 610, 450, 610, 600);
      } else if (vine_location == 4) {
        //madeira
        doGround(375);

        p5.fill("#dad78d");
        p5.triangle(-100, 375, 70, mHeight(225), 300, 375);
        p5.triangle(200, 375, 425, mHeight(255), 900, 375);

        doWaterfall(25, 340, 3, -44, 24);
        doWaterfall(410, 265, 3, 20, 17);

        p5.fill("#6a7325");
        p5.triangle(-200, 420, 210, mHeight(320), 1000, 420);

        doWaterfall(75, 340, 3, 38, 24);
        doWaterfall(490, 340, 3, 38, -24);

        p5.fill("#b3c480");
        p5.triangle(250, 475, 590, mHeight(455), 900, 475);
      } else if (vine_location == 5) {
        //kashmere
        doGround(275);

        p5.fill("#CCD8D9");
        p5.triangle(-100, 275, 70, mHeight(275), 300, 275);
        p5.triangle(200, 275, 425, mHeight(275), 900, 275);
        p5.fill("#B8CBCD");
        p5.triangle(-200, 375, 270, mHeight(375), 1000, 375);
        p5.fill("#94AEB2");
        p5.triangle(60, 275, 280, mHeight(275), 490, 275);
        p5.fill("#6E9091");
        p5.triangle(100, 425, 320, mHeight(425), 600, 425);
        p5.fill("#416C6C");
        p5.triangle(-200, 425, 0, mHeight(425), 400, 425);
      } else if (vine_location == 6) {
        //outback
        doGround(325);

        p5.fill("#c44715");
        p5.quad(150, 325, 180, mHeight(310), 420, mHeight(310), 450, 325);
      } else if (vine_location == 7) {
        //siberia
        doGround(325);

        p5.fill("#d8f2f4");
        p5.triangle(-100, 325, 150, mHeight(250), 700, 325);
        p5.triangle(-200, 325, 50, mHeight(250), 200, 325);

        // tusks
        doTusks();
      } else if (vine_location == 8) {
        //mt everest
        doGround(325);

        p5.fill("#a3b0c5");
        p5.triangle(-200, 325, 40, 125, 400, 325);
        p5.fill("#4e6384");
        p5.triangle(-200, 325, 300, 25, 800, 325);
        p5.fill("#fff");
        p5.triangle(91, 150, 300, 25, 509, 150);
      } else if (vine_location == 9) {
        //amazon
        doGround(325);
        doRiver(0, 325);

        p5.fill("#50e842");
        p5.triangle(200, 325, 450, mHeight(250), 800, 325);
        p5.fill("#2a9720");
        p5.triangle(-200, 325, 40, mHeight(305), 400, 325);

        // trees
        tree(74, 315, 22, 16);
        tree(104, 319, 22, 16);
        tree(118, 326, 22, 16);
        tree(132, 316, 22, 16);
        tree(162, 324, 22, 14);
        tree(188, 316, 18, 24);
        tree(238, 316, 29, 16);
        tree(258, 322, 22, 26);
        tree(288, 316, 26, 16);
        tree(318, 316, 24, 18);
        tree(358, 316, 19, 16);
        tree(374, 336, 24, 24);

        tree(104, 319, 22, 16);
        tree(455, 335, 22, 14);
        tree(335, 325, 32, 16);
        tree(215, 315, 16, 18);
        tree(535, 325, 42, 15);
        tree(525, 315, 32, 21);
        tree(515, 345, 31, 22);
        tree(535, 325, 32, 16);
        tree(475, 342, 32, 12);
        tree(425, 335, 32, 16);
        tree(410, 315, 32, 19);
        tree(465, 315, 22, 16);
        tree(575, 315, 38, 16);
        tree(565, 345, 55, 23);
        tree(585, 365, 26, 25);
      } else if (vine_location == 10) {
        //ohio
        doGround(325);

        p5.fill("#95855e");
        p5.triangle(200, 325, 450, mHeight(350), 800, 325);
      } else if (vine_location == 11) {
        //borneo
        doGround(325);

        p5.fill("#7cf17d");
        p5.triangle(200, 325, 450, mHeight(250), 800, 325);
        p5.fill("#7cc67c");
        p5.triangle(-100, 345, 80, mHeight(250), 345, 345);

        // trees
        tree(14, 335, 22, 21);
        tree(34, 345, 22, 18);
        tree(54, 340, 22, 17);
        tree(84, 340, 22, 25);
        tree(112, 333, 22, 16);

        tree(455, 335, 22, 14);
        tree(335, 325, 32, 16);
        tree(535, 325, 42, 15);
        tree(525, 315, 32, 21);
        tree(515, 345, 31, 22);
        tree(535, 325, 32, 16);
        tree(475, 342, 26, 12);
        tree(425, 335, 23, 16);
        tree(410, 315, 32, 19);
        tree(465, 315, 22, 16);
        tree(575, 315, 38, 16);

        p5.fill("#53c454");
        p5.triangle(-200, 420, 210, mHeight(420), 1000, 420);
      } else if (vine_location == 12) {
        //fujian
        doGround(325);

        p5.fill("#a3b0c5");
        p5.triangle(-200, 325, 40, mHeight(310), 400, 325);
        p5.fill("#657165");
        p5.triangle(200, 325, 450, mHeight(250), 800, 325);

        // pagoda lol
        pagoda(490, 305);
        pagoda(50, 290);
        pagoda(270, 345);
      } else if (vine_location == 13) {
        //long island
        doGround(325);

        //building 1
        p5.fill("#8ca7d1");
        p5.rect(80, 185, 64, 140);
        p5.rect(85, 180, 52, 10);
        //windows
        p5.fill("#ab8cd1");
        p5.rect(83, 190, 8, 130);
        p5.rect(93, 190, 8, 130);
        p5.rect(103, 190, 8, 130);
        p5.rect(113, 190, 8, 130);
        p5.rect(123, 190, 8, 130);
        p5.rect(133, 190, 8, 130);

        //building 2
        p5.fill("#8ca7d1");
        p5.rect(205, 175, 40, 150);
        p5.ellipse(225, 175, 20, 20);
        p5.strokeWeight(1);
        p5.stroke("#8ca7d1");
        p5.line(225, 175, 225, 150);
        p5.noStroke();

        //building 3
        p5.fill("#8ca7d1");
        p5.rect(300, 195, 60, 130);
        p5.fill("#ab8cd1");
        p5.rect(298, 205, 64, 10);
        p5.rect(298, 225, 64, 10);
        p5.rect(298, 245, 64, 10);
        p5.rect(298, 265, 64, 10);
        p5.rect(298, 285, 64, 10);
        p5.rect(298, 305, 64, 10);

        //building 4
        p5.fill("#8ca7d1");
        p5.rect(425, 205, 65, 120);
        p5.rect(435, 175, 45, 40);
        p5.rect(456, 145, 5, 40);

        //monorail
        p5.fill("#6f85a7");
        p5.rect(0, 350, 600, 10);
        p5.rect(40, 350, 8, 30);
        p5.rect(140, 350, 8, 30);
        p5.rect(240, 350, 8, 30);
        p5.rect(340, 350, 8, 30);
        p5.rect(440, 350, 8, 30);
        p5.rect(540, 350, 8, 30);

        //train
        p5.fill("#d4e9ed");
        let trainXs = [0, 30, 60, 90, 120];
        p5.rect(trainX + trainXs[0], 340, 20, 10);
        p5.rect(trainX + trainXs[1], 340, 20, 10);
        p5.rect(trainX + trainXs[2], 340, 20, 10);
        p5.rect(trainX + trainXs[3], 340, 20, 10);
        p5.rect(trainX + trainXs[4], 340, 20, 10);
      } else if (vine_location == 14) {
        //champagne
        doGround(325);

        p5.fill("#896b9a");
        p5.triangle(-80, 325, 150, mHeight(320), 500, 325);
        p5.fill("#998e9f");
        p5.triangle(200, 325, 450, mHeight(320), 800, 325);

        //windmill
        windmill(500, 360);
        windmill(200, 300);
      } else if (vine_location == 15) {
        //atlantis
        doGround(425);

        p5.fill("#875e91");
        p5.triangle(-240, 425, 150, mHeight(280), 500, 425);
        p5.fill("#70abd0");
        p5.triangle(200, 425, 450, mHeight(380), 900, 425);

        p5.fill("#875e91");
        p5.ellipse(41, 464, 22, 22);
        p5.fill("#4b4153");
        p5.ellipse(34, 514, 32, 32);
        p5.fill("#a8d9cf");
        p5.ellipse(15, 515, 32, 32);
        p5.fill("#4b4153");
        p5.ellipse(415, 478, 28, 28);
        p5.fill("#e9ef15");
        p5.ellipse(199, 456, 20, 20);
        p5.fill("#e6859b");
        p5.ellipse(214, 452, 20, 20);
        p5.fill("#e9ef15");
        p5.ellipse(539, 488, 34, 34);
        p5.fill("#9267b7");
        p5.ellipse(518, 492, 34, 34);
        p5.fill("#54e7cb");
        p5.ellipse(560, 504, 28, 28);
        p5.fill("#e6859b");
        p5.ellipse(472, 438, 16, 16);
        p5.fill("#39d175");
        p5.ellipse(372, 442, 17, 17);
        p5.fill("#a8d9cf");
        p5.ellipse(378, 448, 17, 17);
        p5.fill("#9f344a");
        p5.ellipse(283, 466, 19, 19);
      } else if (vine_location == 16) {
        //secret
        doGround(460);
        p5.fill("#6AC8EF");
        p5.ellipse(440, 150, mHeight(128, true), mHeight(128, true));
      } else if (vine_location == 17) {
        //secret
      }
    }

    function doClouds() {
      p5.fill(256, 125);
      let x1s = [
        cloudX + 74,
        cloudX + 135,
        cloudX + 40,
        cloudX + 17,
        cloudX,
        cloudX + 55,
        cloudX + 145,
        cloudX + 95,
      ];

      cloud(x1s[0], 231);
      cloud(x1s[1], 217);
      cloud(x1s[2], 240);
      cloud(x1s[3], 235);
      cloud(x1s[4], 214);
      cloud(x1s[5], 265);
      cloud(x1s[6], 258);
      cloud(x1s[7], 265);
    }

    function cloud(x: any, y: any) {
      p5.fill(256, 125);
      p5.ellipse(x, y, 64, 64);

      p5.fill("rgba(193,254,255, 0.25)");
      p5.ellipse(x, y, 48, 48);
    }

    function doBubbles() {
      p5.fill(256, 125);
      let x1s = [
        cloudY + 74,
        cloudY + 135,
        cloudY + 40,
        cloudY + 17,
        cloudY,
        cloudY + 55,
        cloudY + 145,
        cloudY + 95,
      ];

      bubble(x1s[0], 78);
      bubble(x1s[1], 123);
      bubble(x1s[2], 168);
      bubble(x1s[3], 341);
      bubble(x1s[4], 412);
      bubble(x1s[5], 434);
      bubble(x1s[6], 565);
      bubble(x1s[7], 590);
    }

    function bubble(y: any, x: any) {
      p5.fill(256, 125);
      p5.ellipse(x, y, 64, 64);

      p5.fill("rgba(193,254,255, 0.25)");
      p5.ellipse(x - 15, y - 15, 12, 12);
    }

    function doComet() {
      if (vine_location == 16) p5.fill("#white");
      // else p5.fill("#black");
      p5.ellipse(cloudX, cloudY, 12, 12);
      p5.triangle(cloudX - 4, cloudY + 2, cloudX + 4, cloudY - 2, cloudX - 64, cloudY - 64);
    }

    function manor() {
      if (vine_location <= 14) {
        p5.fill("#e9edc5"); // white
        p5.rect(95, 415, 80, 70);

        p5.fill(0); // black
        p5.rect(105, 425, 8, 15);
        p5.rect(131, 425, 8, 15);
        p5.rect(157, 425, 8, 15);
        p5.rect(128.5, 470, 15, 15);

        p5.fill("#e96161"); //red
        p5.rect(95, 450, 80, 4);
        p5.quad(85, 415, 100, 405, 170, 405, 185, 415);
      } else if (vine_location == 15) {
        p5.fill("#DDED0E"); // white
        p5.rect(95, 415, 80, 70);

        p5.fill(0); // black
        p5.rect(105, 425, 8, 15);
        p5.rect(131, 425, 8, 15);
        p5.rect(157, 425, 8, 15);
        p5.rect(128.5, 470, 15, 15);

        p5.fill("#f58f30"); //red
        p5.rect(95, 450, 80, 4);
        p5.quad(85, 415, 100, 405, 170, 405, 185, 415);
      } else if (vine_location == 16) {
        p5.fill("#e9edc5"); // white
        p5.rect(95, 415, 80, 70);

        p5.fill(0); // black
        p5.rect(105, 425, 8, 15);
        p5.rect(131, 425, 8, 15);
        p5.rect(157, 425, 8, 15);
        p5.rect(128.5, 470, 15, 15);

        p5.fill("#e96161"); //red
        p5.rect(95, 450, 80, 4);
        p5.quad(85, 415, 100, 405, 170, 405, 185, 415);

        p5.fill("rgba(88,198,241,0.41)");
        p5.ellipse(300, 600, 700, 700);
      } else if (vine_location == 17) {
        p5.fill("#e96161"); //red
        p5.ellipse(300, 300, 140, 140);

        p5.fill("#e9edc5"); // white
        p5.ellipse(300, 300, 120, 120);

        p5.fill("#e96161"); //red
        p5.ellipse(300, 300, 100, 100);

        p5.fill("#e9edc5"); // white
        p5.ellipse(300, 300, 80, 80);

        p5.fill(0); // black
        p5.ellipse(280, 300, 20, 20);
        p5.ellipse(320, 300, 20, 20);
        p5.ellipse(300, 280, 20, 20);
        p5.ellipse(300, 320, 20, 20);
      }
    }

    function trellis() {
      if (vine_location < 17) {
        p5.fill("#594300");
        p5.rect(102, 500, 365, 15);
        p5.rect(102, 550, 365, 15);

        p5.fill("#268415");
        p5.rect(102, 503, 365, 9);
        p5.rect(102, 553, 365, 9);

        p5.fill("#594300");
        p5.rect(102, 506, 365, 3);
        p5.rect(102, 556, 365, 3);
      } else {
        p5.fill("#594300");
        p5.rect(0, 500, width, 15);
        p5.rect(0, 550, width, 15);

        p5.fill("#268415");
        p5.rect(0, 503, width, 9);
        p5.rect(0, 553, width, 9);

        p5.fill("#594300");
        p5.rect(0, 506, width, 3);
        p5.rect(0, 556, width, 3);
      }
    }

    function windmill(x: any, y: any) {
      p5.fill("rgb(117,42,42)");
      p5.ellipse(x, y, 30, 30);
      p5.quad(x - 15, y, x + 15, y, x + 20, y + 55, x - 20, y + 55);
      p5.fill("brown");
      p5.triangle(x, y, x - 48, y - 8, x - 48, y + 8);
      p5.triangle(x, y, x + 48, y + 8, x + 48, y - 8);
      p5.triangle(x, y, x - 8, y - 48, x + 8, y - 48);
      p5.triangle(x, y, x - 8, y + 40, x + 8, y + 40);
    }

    function pagoda(x: any, y: any) {
      p5.fill("#F6FAD6"); // white
      p5.rect(x, y, 40, 80);

      p5.fill("black");
      p5.rect(x + 10, y + 70, 10, 10);

      p5.fill("#e96161"); //red
      p5.quad(x, y, x + 40, y, x + 75, y + 10, x - 35, y + 10);
      p5.quad(x, y + 20, x + 40, y + 20, x + 75, y + 30, x - 35, y + 30);
      p5.quad(x, y + 40, x + 40, y + 40, x + 75, y + 50, x - 35, y + 50);
    }

    function balloon(x: any, y: any, color: any) {
      let size = 60;
      p5.stroke("white");
      p5.line(x - 11, y + 50, x - 18, y + 15);
      p5.line(x + 11, y + 50, x + 18, y + 15);
      p5.noStroke();
      p5.fill(color);
      p5.ellipse(x, y, size, size);
      p5.fill("brown");
      p5.quad(x - 12, y + 50, x + 12, y + 50, x + 10, y + 60, x - 10, y + 60);
    }

    function tree(x: any, y: any, height: any, width: any) {
      p5.fill("brown");
      p5.quad(x - 2, y, x + 2, y, x + 2, y + height, x - 2, y + height);

      p5.fill("#68B35A");
      p5.ellipse(x, y, width, width);
    }

    if (vine_location <= 14) {
      p5.background(backgroundFromTime(), 73, 100);
    } else if (vine_location == 15) {
      p5.background(0, 45, backgroundFromTime());
    } else if (vine_location == 16) {
      p5.background(0, 0, 0);
    } else if (vine_location == 17) {
      p5.background(255, 255, 255);
    }

    if (vine_location == 15) {
      cloudY -= 1.2;
      if (cloudY < -300) cloudY = 510;
      doBubbles();
    }
    if (vine_location == 16) {
      cloudY += 8;
      cloudX += 8;
      if (cloudY > 1500) {
        cloudY = -200;
        cloudX = -200;
      }
      doComet();
    }
    if (vine_location == 17) {
      cloudY += 8;
      cloudX += 8;
      if (cloudY > 1500) {
        cloudY = -200;
        cloudX = -200;
      }
      doComet();
    }

    locationAction();

    manor();

    trellis();

    for (let i = 0; i < numVines; i++) {
      vines[i].display();
    }

    if (vine_location <= 14) {
      cloudX += 0.2;
      if (cloudX == 700) cloudX = -200;
      doClouds();
    }

    if (vine_location == 13) {
      trainX += 8;
      if (trainX == 3000) trainX = -200;
    }
  };

  // @ts-ignore
  return <Sketch setup={setup} draw={draw} />;
};

export default MintSketch;
