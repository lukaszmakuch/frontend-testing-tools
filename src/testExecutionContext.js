const { makePromiseReturningCallsChainable } = require("./asyncChaining");

function readModuleAndMethod(name) {
  const matched = name.match(/(?<module>[^A-Z]+)(?<method>([A-Z].+))/)?.groups;
  if (!matched) return;
  const { module, method } = matched;
  return {
    module,
    method: method.replace(/^\w/, (c) => c.toLowerCase()),
  };
}

function makeTestExecutionContext() {
  let modules = {};
  let contexts = {};

  const swapModule = (module) => {
    modules[module.name] = module;
  };

  const createContext = () => {
    let store = {};

    const wholeCtxProxy = {};

    const handler = {
      get(target, prop, receiver) {
        if (store[prop]) {
          return store[prop];
        }

        const moduleAndMethod = readModuleAndMethod(String(prop));
        if (moduleAndMethod) {
          const maybeRawModuleFn =
            modules[moduleAndMethod.module]?.methods?.[moduleAndMethod.method];

          if (!maybeRawModuleFn) return;
          return function (...args) {
            const { wholeCtx } = wholeCtxProxy;
            const result = maybeRawModuleFn.apply(wholeCtx, args);
            if (result === undefined) return wholeCtx;
            return result;
          };
        }

        return null;
      },

      set(obj, prop, value) {
        store[prop] = value;
      },
    };

    const wholeCtx = makePromiseReturningCallsChainable(new Proxy({}, handler));
    wholeCtxProxy.wholeCtx = wholeCtx;
    // makePromiseReturningCallsChainable
    return wholeCtx;
  };

  const getContext = (name) => {
    if (!contexts[name]) contexts[name] = createContext();
    return contexts[name];
  };

  const getAllContexts = () => {
    return Object.values(contexts);
  };

  const engine = new Proxy(
    {
      swapModule,
      getContext,
      getAllContexts,
      [Symbol.iterator]: function* () {
        let index = 0;
        while (true) {
          yield getContext(String(index++));
        }
      },
    },
    {
      get(target, prop) {
        if (/^\d+$/.test(String(prop))) {
          // it's a context index
          return getContext(prop);
        }
        return Reflect.get(...arguments);
      },
    }
  );

  return engine;
}

module.exports = { makeTestExecutionContext };
