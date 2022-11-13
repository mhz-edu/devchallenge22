const sharp = require('sharp');

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

const getCellLevel = async (cellBuf, size) => {
  const stats = await sharp(cellBuf, {
    raw: { width: size, height: size, channels: 1 },
  }).stats();
  return Math.floor(((255 - stats.channels[0].mean) * 100) / 255);
};

module.exports = {
  postImage: async (req, res, next) => {
    const { min_level, image } = req.body;
    try {
      const result = [];
      const img = Buffer.from(image.split('base64,').pop(), 'base64');
      const metadata = await sharp(img).metadata();
      const gridSize = getGridSize(
        await sharp(img).raw().toBuffer(),
        metadata.width
      );
      const colsNumber = (metadata.width - 1) / (gridSize + 1);
      const rowsNumber = (metadata.height - 1) / (gridSize + 1);
      for (let row = 0; row <= rowsNumber; row++) {
        for (let col = 0; col <= colsNumber; col++) {
          const left = col * gridSize + (col + 1);
          const top = row * gridSize + (row + 1);
          const imgCell = await sharp(img)
            .extract({
              left,
              top,
              width: gridSize,
              height: gridSize,
            })
            .raw()
            .toBuffer();
          const level = await getCellLevel(imgCell, gridSize);
          if (level >= min_level) {
            result.push({
              x: col,
              y: row,
              level: level,
            });
          }
        }
      }
      res.status(200).json({ mines: result });
    } catch (error) {
      next(error);
    }
  },
};
