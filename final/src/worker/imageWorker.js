const sharp = require('sharp');

const rawPixelsToLevel = (buf)=>{
  const pixelAvg = buf.reduce((acc, curr)=>{
    acc = acc + Number(curr)
    return acc
  }, 0)

  return Math.ceil(pixelAvg / buf.length)
}

process.on('message', ({ batch, lineIndex, gridSize, width, data }) => {
  const colsNumber = (width - 1) / (gridSize + 1);
  const promises = [];

  const imgSource = sharp(Buffer.from(data, 'base64'), {
    raw: { width: width, height: gridSize + 1, channels: 3 },
  });

  for (let col = 0; col < colsNumber; col++) {
    const left = col * gridSize + (col + 1);
    const top = 1;

    promises.push(imgSource
      .clone()
      .extract({
        left,
        top,
        width: gridSize,
        height: gridSize,
      })
      .raw()
      .toBuffer())
  }
  
  Promise.all(promises).then((cells) => {
    const data = cells.map((cell) =>
      Math.floor(((255 - rawPixelsToLevel(cell)) * 100) / 255)
    );
    process.send(
      JSON.stringify({
        batch,
        lineIndex,
        data,
      }),
      () => {
        process.send(JSON.stringify({ status: 'free', pid: process.pid }));
      }
    );
  });
});
