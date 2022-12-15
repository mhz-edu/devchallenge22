const sharp = require('sharp');
const {
  initWorkers,
  pushTaskToQueue,
  createNewBatch,
  clearBatch,
} = require('../worker/workerPool');

const getGridSize = (imageBuf, imageWidth) => {
  const bytesInPixel = 3;
  const imageWidthBytes = imageWidth * bytesInPixel;
  const imageSecondLine = imageBuf.subarray(
    imageWidthBytes,
    2 * imageWidthBytes - bytesInPixel
  );
  const gridPixel = Buffer.from([255, 255, 255]);
  const pos = imageSecondLine.indexOf(gridPixel, 1);
  if (pos === -1) {
    const error = new Error('Grid cannot be found');
    error.status = 422;
    throw error;
  }
  const gridSize = pos / bytesInPixel - 1;
  return gridSize;
};

initWorkers();

module.exports = {
  postImage: async (req, res, next) => {
    const { min_level, image } = req.body;
    try {
      const img = Buffer.from(image.split('base64,').pop(), 'base64');
      const metadata = await sharp(img).metadata();
      const gridSize = getGridSize(
        await sharp(img).raw().toBuffer(),
        metadata.width
      );
      console.log(metadata, Date.now());

      const rowsNumber = Math.floor((metadata.height - 1) / (gridSize + 1));
      console.log(gridSize, rowsNumber);
      const imgSource = sharp(img);

      const { batchNum, batchReady } = createNewBatch(rowsNumber);

      for (let row = 0; row < rowsNumber; row++) {
        const left = 0;
        const top = row * gridSize + row;

        const imgStrip = await imgSource
          .clone()
          .extract({
            left,
            top,
            width: metadata.width,
            height: gridSize + 2,
          })
          .raw()
          .toBuffer();

        pushTaskToQueue({
          batch: batchNum,
          lineIndex: row,
          gridSize: gridSize,
          width: metadata.width,
          data: imgStrip.toString('base64'),
        });
      }
      batchReady
        .then((taskResult) => {
          const result = [];
          taskResult.forEach(({ data: levels, lineIndex }) => {
            levels.forEach((level, levelIndex) => {
              if (level >= min_level) {
                result.push({
                  x: levelIndex,
                  y: lineIndex,
                  level: level,
                });
              }
            });
          });

          res.status(200).json({
            mines: result.sort((a, b) => {
              if (a.y === b.y) {
                return a.x - b.x;
              } else {
                return a.y - b.y;
              }
            }),
          });
        })
        .finally(() => {
          clearBatch(batchNum);
        });
    } catch (error) {
      next(error);
    }
  },
};
