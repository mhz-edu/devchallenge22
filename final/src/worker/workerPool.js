const { fork } = require('child_process');

const workers = [];

const queue = [];

const results = {};

let batch = 0;
let processTimer;

const initWorkers = () => {
  workers.push(
    fork('./src/worker/imageWorker.js'),
    fork('./src/worker/imageWorker.js'),
    fork('./src/worker/imageWorker.js'),
    fork('./src/worker/imageWorker.js'),
    fork('./src/worker/imageWorker.js')
  );

  workers.forEach((worker) => {
    worker.on('message', (input) => {
      const message = JSON.parse(input);
      if (message.status === 'free' && !workers.includes(worker)) {
        workers.push(worker);
      } else if (message.data) {
        results[message.batch].data.push(message);
      }
    });
  });

  processTimer = processQueue();
};

const createNewBatch = (batchLength) => {
  const func = function (obj) {
    return new Promise((resolve) => {
      const timer = setInterval(() => {
        if (obj.data.length === batchLength) {
          clearInterval(timer);
          resolve(obj.data);
        }
      }, 100);
    });
  };

  const currentBatch = batch;
  results[currentBatch] = {
    batchLength,
    data: [],
  };
  Object.defineProperty(results[currentBatch], 'batchReady', {
    value: func(results[currentBatch]),
    enumerable: true,
  });
  batch = batch + 1;
  return {
    batchNum: currentBatch,
    batchReady: results[currentBatch].batchReady,
  };
};

const clearBatch = (batchNum) => {
  results[batchNum] = {}
}

const pushTaskToQueue = (task) => {
  queue.push(task);
};

const processQueue = () => {
  const timer = setInterval(async () => {
    const freeWorkers = await getWorkers();
    freeWorkers.forEach((worker) => {
      worker.send(queue.pop());
    });
  }, 100);
  return timer;
};

const getWorkers = () => {
  return new Promise((resolve) => {
    if (workers.length > 0) {
      resolve(workers.slice(0, workers.length));
    } else {
      const timer = setInterval(() => {
        if (workers.length > 0) {
          clearInterval(timer);
          resolve(workers.slice(0, workers.length));
        }
      }, 100);
    }
  });
};

const destroyWorkers = () => {
  clearInterval(processTimer);
  workers.forEach((worker) => {
    worker.kill();
  });
};

module.exports = {
  initWorkers,
  pushTaskToQueue,
  destroyWorkers,
  createNewBatch,
  clearBatch
};
