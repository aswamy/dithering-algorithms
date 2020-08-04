/**
 * Floyd–Steinberg dithering implementation
 * 
 * @author Alok Swamy
 */
const Jimp = require('jimp');

/*
* Main code starts here
*/
async function main() {

  if(!process.env.INPUT_FILE_PATH) {
    console.error('Set environment variable INPUT_FILE_PATH before running the code');
    process.exit(-1);
  }

  const file = Jimp.read(process.env.INPUT_FILE_PATH);

  // Remove `.greyscale()` if you want to see 3-bit dithering (2^3 = 8 color palette)
  const image = (await file).greyscale();

  const rgbMatrix = Array.from(Array(image.bitmap.height), () => new Array(image.bitmap.width));

  // Initialize all rbg values into a 2D Array
  for(let y = 0; y < image.bitmap.height; y++) {
    for(let x = 0; x < image.bitmap.width; x++) {
      let { r, g, b } = Jimp.intToRGBA(image.getPixelColor(x, y));
      rgbMatrix[y][x] = { r, g, b };
    }
  }

  for(let y = 0; y < image.bitmap.height; y++) {
    for(let x = 0; x < image.bitmap.width; x++) {
      let { r, g, b } = rgbMatrix[y][x];

      // Calculate the new RGB values (push the value to 0 or 255)
      let newR = Math.round(r/255) * 255;
      let newG = Math.round(g/255) * 255;
      let newB = Math.round(b/255) * 255;

      // Calculate the error (difference between new and old values) of new RGB values
      let errorR = r - newR;
      let errorG = g - newG;
      let errorB = b - newB;

      setCell(rgbMatrix, x, y, newR, newG, newB);

      applyError(rgbMatrix, x+1, y, errorR, errorG, errorB, 7/16);
      applyError(rgbMatrix, x-1, y+1, errorR, errorG, errorB, 3/16);
      applyError(rgbMatrix, x, y+1, errorR, errorG, errorB, 5/16);
      applyError(rgbMatrix, x+1, y+1, errorR, errorG, errorB, 1/16);
    }
  }

  // Set the values from 2D array to image object
  for(let y = 0; y < image.bitmap.height; y++) {
    for(let x = 0; x < image.bitmap.width; x++) {
      image.setPixelColor(Jimp.rgbaToInt(rgbMatrix[y][x].r, rgbMatrix[y][x].g, rgbMatrix[y][x].b, 255), x, y);
    }
  }

  await image.write(`output-${Date.now()}.${image.getExtension()}`);
}

/*
* Propogate the error of new RGB values to the cell located at (x,y)
*/
function applyError(rgbMatrix, x, y, errorR, errorG, errorB, fraction) {
  let errorRFraction = Math.floor(errorR * fraction);
  let errorGFraction = Math.floor(errorG * fraction);
  let errorBFraction = Math.floor(errorB * fraction);

  if(x < 0 || y < 0 || x >= rgbMatrix[0].length || y >= rgbMatrix.length) {
    return;
  }

  rgbMatrix[y][x].r = rgbMatrix[y][x].r + errorRFraction;
  rgbMatrix[y][x].g = rgbMatrix[y][x].g + errorGFraction;
  rgbMatrix[y][x].b = rgbMatrix[y][x].b + errorBFraction;
}

/*
* Set the RGB value at a cell located at (x,y)
*/
function setCell(rgbMatrix, x, y, r, g, b) {
  if(x < 0 || y < 0 || x >= rgbMatrix[0].length || y >= rgbMatrix.length) {
    return;
  }

  rgbMatrix[y][x].r = r;
  rgbMatrix[y][x].g = g;
  rgbMatrix[y][x].b = b;
}


main();