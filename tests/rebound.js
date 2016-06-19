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



