const sharp = require('sharp');

const generateMultiCell = async (size, levelArray, widthNum, heightNum) => {
  const widthInPixels = widthNum * size + (widthNum + 1);
  const heightInPixels = heightNum * size + (heightNum + 1);
  const gridBackground = {
    create: {
      width: widthInPixels,
      height: heightInPixels,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  };

  const cell = (level) => ({
    create: {
      width: size,
      height: size,
      channels: 3,
      background: { r: 0, g: 0, b: 0 },
      noise: {
        type: 'gaussian',
        mean: (255 * (100 - level)) / 100,
        sigma: 0,
      },
    },
  });

  const images = [];

  let cellIndex = 0;
  for (let row = 0; row < heightNum; row++) {
    for (let col = 0; col < widthNum; col++) {
      images.push({
        input: cell(levelArray[cellIndex]),
        left: col * size + (col + 1),
        top: row * size + (row + 1),
      });
      cellIndex++;
    }
  }

  const output = await sharp(gridBackground)
    .composite(images)
    .toColorspace('b-w')
    .removeAlpha()
    .png()
    .toBuffer();

  return output;
};

module.exports = { generateMultiCell };
