const OUT = 99999999999;
const DELTA = 10;
const DEFAULT_Y_ACCELERATION = 0.0001;
const DEFAULT_X_ACCELERATION = 0.0;

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
  [50, 200],
  [100, 175],
  function (x, y) {
    // c = [(x, (5*(x-26)**0.5 + 156)  ) for x in xrange(0, 340) if (x <= 60) and (x >= 26)]
    return (200 -0.5*(x));
  },
  function (x, y, xSpeedBefore, ySpeedBefore) {
    const derivative = -0.5;
    return changeAngle(xSpeedBefore, ySpeedBefore, derivative);
  },
  function (x, y, xSpeedBefore, ySpeedBefore) {
    // return [-xSpeedBefore, ySpeedBefore];
  },
  1
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

const barriers = [
  lineBarier
];

const Ball = function () {
  const self = this;
  this.element = document.getElementById ( 'gameBall' );
  this.xSpeed = -0.02; // +0.02;
  this.ySpeed = 0;
  this.yAcceleration = DEFAULT_Y_ACCELERATION;
  this.xAcceleration = DEFAULT_X_ACCELERATION;
  this.delta = DELTA;
  // work with surfaces and self force
  this.surface = {};
  this.x = 130;
  this.element.setAttribute ( "cx", this.x);
  this.y = 340; // 395
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
  this.setBreakDinamics = function setDinamics(xSpeed, ySpeed, xAcceleration=DEFAULT_X_ACCELERATION, yAcceleration=DEFAULT_Y_ACCELERATION) {
    self.xSpeed = xSpeed;
    self.ySpeed = ySpeed;
    self.xAcceleration = xAcceleration;
    self.yAcceleration = yAcceleration;
  };
  this.defaultDinamics = function defaultDinamics() {
    self.xAcceleration = DEFAULT_X_ACCELERATION;
    self.yAcceleration = DEFAULT_Y_ACCELERATION;
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
    self.checkBreakPoint(cxNew, cyNew, self.xSpeed, self.ySpeed, self.setBreakDinamics, self.defaultDinamics);
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

    if (isBreak == false) {
      self.surface = {};
      simpleSpeedFunc();
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
