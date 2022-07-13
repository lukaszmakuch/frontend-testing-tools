// TODO: support other function signatures, like fn, delay, param or code, delay, param

function makeFakeTimeout({ DateToUse }) {
  let lastIndex = 0;
  let scheduled = {};

  const fakeSetTimeout = function (cb, delay) {
    const index = lastIndex++;
    const timeToFire = DateToUse.now() + delay;
    scheduled[index] = { cb, timeToFire };
    return index;
  };

  const fakeClearTimeout = (index) => {
    delete scheduled[index];
  };

  const tick = () => {
    Object.entries(scheduled).forEach(([index, { cb, timeToFire }]) => {
      if (timeToFire <= DateToUse.now()) {
        delete scheduled[index];
        cb();
      }
    });
  };

  return { fakeSetTimeout, fakeClearTimeout, tick };
}
