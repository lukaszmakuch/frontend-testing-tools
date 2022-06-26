const { isArrayLike } = require("lodash");

async function consolidateAsyncMethodCalls({
  initialPromise,
  recordedCalls,
  obj,
}) {
  let lastRes = await initialPromise;
  for (let i = 0; i < recordedCalls.length; i++) {
    const recordedCall = recordedCalls[i];
    // This part supports returning some arguments which are later
    // pased as arguments to the next chained method
    const argsToPass = [
      ...(isArrayLike(lastRes) ? lastRes : []),
      ...recordedCall.args,
    ];
    lastRes = await obj[recordedCall.method](...argsToPass);
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
  const objHolder = {};
  objHolder.obj = new Proxy(obj, {
    get(target, prop) {
      if (typeof obj[prop] !== "function") {
        return obj[prop];
      }

      return function (...args) {
        // TODO: perhaps refactor this part
        const result = Promise.resolve(obj[prop](...args));
        return recordAsyncCalls({
          initialPromise: result,
          obj,
        });
      };
    },
  });
  return objHolder.obj;
}

module.exports = { makePromiseReturningCallsChainable };
