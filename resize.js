const axios = require("axios");
const sharp = require("sharp");
const path = require("path");
const DEFAULT_WIDTH = 400;
const DEFAULT_HEIGHT = 400;

async function resizeImage(url, opt) {
  const { height = DEFAULT_HEIGHT, width = DEFAULT_WIDTH } = opt;
  const extension = path.extname(url).replace(".", "");
  let origin, imageBuffer;
  try {
    origin = await axios.get(url, { responseType: "arraybuffer" });
  } catch (e) {
    console.log(`failed fetch image ${url} ${e}`);
    throw e;
  }
  try {
    imageBuffer = await _resize(origin, height, width);
    const image = imageBuffer.toString("base64");
    return `data:image/${extension};base64,${image}`;
  } catch (e) {
    console.log(`failed resize image ${url} ${e}`);
    e.status = 500;
    throw e;
  }
}

async function _resize(origin, height, width) {
  return await sharp(origin.data)
    .resize(width, height, {
      fit: sharp.fit.inside,
    })
    .toBuffer();
}

module.exports = resizeImage;
