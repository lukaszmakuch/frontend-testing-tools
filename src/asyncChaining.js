async function consolidateAsyncMethodCalls({
  initialPromise,
  recordedCalls,
  obj,
}) {
  let lastRes = await initialPromise;
  for (let i = 0; i < recordedCalls.length; i++) {
    const recordedCall = recordedCalls[i];
    lastRes = await obj[recordedCall.method](...recordedCall.args);
  }

  return lastRes;
}

function recordAsyncCalls({ initialPromise, obj }) {
  let recordedCalls = [];
  const objHolder = {};
  const finalPromiseHolder = {};

  const wrapUp = () => {
    if (!finalPromiseHolder.promise) {
      finalPromiseHolder.promise = consolidateAsyncMethodCalls({
        initialPromise,
        recordedCalls,
        obj,
      });
    }

    return finalPromiseHolder.promise;
  };

  objHolder.obj = new Proxy(obj, {
    get(target, prop) {
      if (["then", "catch", "finally"].includes(prop)) {
        // it's time to wrap it up
        const finalPromise = wrapUp();
        return finalPromise[prop].bind(finalPromise);
      } else {
        // just recording a series of method calls
        return function (...args) {
          recordedCalls.push({ method: prop, args });
          return objHolder.obj;
        };
      }
    },
  });
  return objHolder.obj;
}

function makePromiseReturningCallsChainable(obj) {
  obj.original = true;
  obj.trace = Math.random();
  const objHolder = {};
  objHolder.obj = new Proxy(obj, {
    get(target, prop) {
      if (typeof obj[prop] !== "function") {
        return obj[prop];
      }

      return function (...args) {
        const result = obj[prop](...args);
        if (result === obj) {
          return objHolder.obj;
        }

        if (result?.then) {
          return recordAsyncCalls({
            initialPromise: result,
            obj,
          });
        }

        return result;
      };
    },
  });
  return objHolder.obj;
}

module.exports = { makePromiseReturningCallsChainable };
