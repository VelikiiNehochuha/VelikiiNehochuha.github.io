const OUT = 99999999999;
const DELTA = 10;

function getRandomArbitary(min, max) {
  return Math.random() * (max - min) + min;
}

const Barrier = function (id, xDiapason, yDiapason, getBarrier, getSpeedAfterBreak, getCaptureSurfaceSpeed, limit=1) {
  const self = this;
  this.id = id;
  this.xDiapason = xDiapason;
  this.yDiapason = yDiapason;
  this.getBarrier = getBarrier; // must be function y(x) and get args x, y
  this.getSpeedAfterBreak = getSpeedAfterBreak; // function, args: x, y, ySpeedBefore, xSeedBefore
  this.getCaptureSurfaceSpeed = getCaptureSurfaceSpeed; // function, args: x, y, ySpeedBefore, xSeedBefore
  this.checkBreak = function checkBreak(x, y) {
    let isBreak = false;
    if (y < self.yDiapason[1] && y > self.yDiapason[0]) {
      const yCalc = self.getBarrier(x, y);
      if (((Math.floor(y) - limit) <  Number((yCalc).toFixed(1))) && (Number((yCalc).toFixed(1)) < (Math.ceil(y) + limit))) {
        isBreak = true;
      } else {
        isBreak = false;
      }
    } else if (self.yDiapason[1] === self.yDiapason[0] && x < self.xDiapason[1] && x > self.xDiapason[0]) {
      const yCalc = self.yDiapason[1];
      if (((Math.floor(y) - limit) <  Number((yCalc).toFixed(1))) && (Number((yCalc).toFixed(1)) < (Math.ceil(y) + limit))) {
        isBreak = true;
      } else {
        isBreak = false;
      }
    }
    return isBreak;
  };
};



const lineBarier = new Barrier(
  'topParabola',
  [0, 320],
  [0, 500],
  function (x, y) {
    // c = [(x, (5*(x-26)**0.5 + 156)  ) for x in xrange(0, 340) if (x <= 60) and (x >= 26)]
    return (50 -0.5*(x));
  },
  function (x, y, xSpeedBefore, ySpeedBefore) {
    const derivative = -0.5;
    return changeAngle(xSpeedBefore, ySpeedBefore, derivative);
  },
  function (x, y, xSpeedBefore, ySpeedBefore) {
    // return [-xSpeedBefore, ySpeedBefore];
  },
  10
);


function changeAngle(xSpeedBefore, ySpeedBefore, der) {
  let derivative = der;
  const tAngle = Math.atan(derivative);
  const vAngle = Math.atan(ySpeedBefore / xSpeedBefore);
  const diffAngle = tAngle - vAngle;
  const resAngle = diffAngle*2;
  const xSpeedAfter = xSpeedBefore * Math.cos(resAngle) - ySpeedBefore * Math.sin(resAngle);
  const ySpeedAfter = xSpeedBefore * Math.sin(resAngle) + ySpeedBefore * Math.cos(resAngle);
  return [xSpeedAfter, ySpeedAfter];
}


function test() {
  let res = changeAngle(0.29999999999999993, 0.05000000000000009, 1);
  if (res[0] === 0.05000000000000009 && res[1] === 0.29999999999999993) {
    console.log('ok');
  } else {
    throw Error('0.29999999999999993, 0.05000000000000009, 1');
  }

  res = changeAngle(-0.002, 0.2, 1);
  if (res[0] === 0.2 && res[1] === -0.0019999999999999723) {
    console.log('ok');
  } else {
    throw Error('-0.002, 0.2, 1');
  }

  res = changeAngle(-0.02, -0.01, 50);
  if (res[0] === 0.019584166333466612 && res[1] === -0.010791683326669334) {
    console.log('ok');
  } else {
    throw Error('-0.02, -0.01, 50');
  }

  res = changeAngle(-0.02, 0.2, 50);
  if (res[0] === 0.027980807676929207 && res[1] === 0.19904038384646142) {
    console.log('ok');
  } else {
    throw Error('-0.02, -0.01, 50');
  }

  res = changeAngle(0.02, -0.02, 50);
  if (res[0] === -0.020783686525389845 && res[1] === -0.0191843262694922) {
    console.log('ok');
  } else {
    throw Error('0.02 -0.02, 50');
  }

  res = changeAngle(0.02, -0.04, -1);
  if (res[0] === 0.039999999999999994 && res[1] === -0.020000000000000004) {
    console.log('ok');
  } else {
    throw Error('0.02, -0.04, -1');
  }

  res = changeAngle(0.02, 0.04, -1);
  if (res[0] === -0.039999999999999994 && res[1] === -0.02000000000000001) {
    console.log('ok');
  } else {
    throw Error('0.02, 0.04, -1');
  }

  res = changeAngle(0.02, -0.04, -0.5);
  if (res[0] === 0.044000000000000004 && res[1] === 0.007999999999999988) {
    console.log('ok');
  } else {
    throw Error('0.02, -0.04, -0.5');
  }

}

test();


const barriers = [
  lineBarier
];


const Ball = function () {
  const self = this;
  this.element = document.getElementById ( 'gameBall' );
  this.xSpeed = 0.02;
  this.ySpeed = -0.04;


  this.yAcceleration = 0;
  this.xAcceleration = 0;
  this.delta = DELTA;
  // work with surfaces and self force
  this.surface = {};
  this.x = 10;
  this.element.setAttribute ( "cx", this.x);
  this.y = 70; // 395
  this.element.setAttribute ( "cy", this.y);
  this.bang = false;
  this.init = function init(stopFunc) {
    this.stopCallBack = stopFunc;
  };
  this.stopBall = function stopBall() {
    self.xSpeed = 0;
    self.ySpeed = 0;
    self.yAcceleration = 0;
    self.xAcceleration = 0;
    self.stopCallBack();
  };
  this.setNewSpeed = function setNewSpeed(xSpeed, ySpeed) {
    self.xSpeed = xSpeed;
    self.ySpeed = ySpeed;
  };
  this.getNewSpeed = function getNewSpeed() {
    self.xSpeed = self.xSpeed + self.xAcceleration * self.delta;
    self.ySpeed = self.ySpeed + self.yAcceleration * self.delta;
  };
  this.getNewPosition = function getNewPosition() {
    let cxNew, cyNew;
    const cxPrev = self.element.getAttribute( 'cx' );
    const cyPrev = self.element.getAttribute( 'cy' );
    cyNew = parseFloat(cyPrev) + self.ySpeed * self.delta + self.yAcceleration * self.delta * self.delta / 2;
    cxNew = parseFloat(cxPrev) + self.xSpeed * self.delta + self.xAcceleration * self.delta * self.delta / 2;
    self.element.setAttribute ( "cx", cxNew );
    self.element.setAttribute ( "cy", cyNew );
    self.checkBreakPoint(cxNew, cyNew, self.xSpeed, self.ySpeed, self.setNewSpeed, self.getNewSpeed);
    // self.stopBall();
  };
  this.checkBreakPoint = function checkBreakPoint(x, y, xSpeedBefore, ySpeedBefore, breakSpeedFunc, simpleSpeedFunc) {
    let isBreak = false;
    for (let i in barriers) {
      if (barriers[i].checkBreak(x, y)) {
        isBreak = true;
        if (breakSpeedFunc) {
          // check if prev surface equel current then get speed with self force
          if (self.surface && self.surface.id === barriers[i]) {
            console.log('self force calc');
          } else {
            breakSpeedFunc.apply(self, barriers[i].getSpeedAfterBreak(x, y, xSpeedBefore, ySpeedBefore));
          }
          self.surface = barriers[i];
        }
        // self.stopBall();
        break;
      }
    }

    return isBreak;
  };
};




const Game = function () {
  const self = this;
  this.animate = function animate() {
    self.gameBall.getNewPosition();
  };
  this.play = function play() {
    const gameBall = new Ball();
    gameBall.init(self.stop);
    self.gameBall = gameBall;
    self.animateInterval = setInterval(self.animate, DELTA);
  };
  this.stop = function stop() {
    clearInterval(self.animateInterval);
  };
  this.start = function start() {
    self.animateInterval = setInterval(self.animate, DELTA);
  };
  this.reset = function reset() {
    clearInterval(self.animateInterval);
    delete self.gameBall;
    const gameBall = new Ball();
    self.gameBall = gameBall;
    self.animateInterval = setInterval(self.animate, DELTA);
  };
};


const game = new Game();
game.play();



