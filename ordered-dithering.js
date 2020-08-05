/**
 * nxn matrix ordered dithering implementation
 * 
 * @author Alok Swamy
 */
const Jimp = require('jimp');

/*
* Matrix filled with RGB thresholds used to compare a square of pixels
*/
const COMPARISON_MATRIX = Object.freeze([
  [ 0, 128 ],
  [ 192, 64 ]
]);

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

  for(let y = 0; y < image.bitmap.height; y+=COMPARISON_MATRIX.length) {
    for(let x = 0; x < image.bitmap.width; x+=COMPARISON_MATRIX[0].length) {
      
      for(let comparisonMatrixY = 0; comparisonMatrixY < COMPARISON_MATRIX.length; comparisonMatrixY++) {
        for(let comparisonMatrixX = 0; comparisonMatrixX < COMPARISON_MATRIX[0].length; comparisonMatrixX++) {
          
          let indexX = comparisonMatrixX + x;
          let indexY = comparisonMatrixY + y;

          if(indexX >= rgbMatrix[0].length || indexY >= rgbMatrix.length) {
            continue;
          }

          rgbMatrix[indexY][indexX].r = rgbMatrix[indexY][indexX].r > COMPARISON_MATRIX[comparisonMatrixY][comparisonMatrixX] ? 255 : 0;
          rgbMatrix[indexY][indexX].g = rgbMatrix[indexY][indexX].g > COMPARISON_MATRIX[comparisonMatrixY][comparisonMatrixX] ? 255 : 0;
          rgbMatrix[indexY][indexX].b = rgbMatrix[indexY][indexX].b > COMPARISON_MATRIX[comparisonMatrixY][comparisonMatrixX] ? 255 : 0;
        }
      }
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


main();