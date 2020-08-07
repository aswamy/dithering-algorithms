/**
 * Low Resolution Algorithm
 * 
 * Averages out the pixel colors in an nxn matrix
 * 
 * @author Alok Swamy
 */
const Jimp = require('jimp');

/*
* size of window of pixels to apply average
*/
const COMPARISON_MATRIX_SIZE = 10;

/*
* Main code starts here
*/
async function main() {

  if(!process.env.INPUT_FILE_PATH) {
    console.error('Set environment variable INPUT_FILE_PATH before running the code');
    process.exit(-1);
  }

  const file = Jimp.read(process.env.INPUT_FILE_PATH);

  const image = (await file);

  const imageMatrix = Array.from(Array(image.bitmap.height), () => new Array(image.bitmap.width));

  // Initialize all rbg values into a 2D Array
  for(let y = 0; y < image.bitmap.height; y++) {
    for(let x = 0; x < image.bitmap.width; x++) {
      const { r, g, b } = Jimp.intToRGBA(image.getPixelColor(x, y));
      imageMatrix[y][x] = { r, g, b };
    }
  }

  for(let y = 0; y < image.bitmap.height; y+=COMPARISON_MATRIX_SIZE) {
    for(let x = 0; x < image.bitmap.width; x+=COMPARISON_MATRIX_SIZE) {
      
      let imageMatrixSum = { r: 0, g: 0, b: 0 };
      let cellCount = 0;

      // Find out the grayscale intensity of the cells in the matrix
      for(let comparisonMatrixY = 0; comparisonMatrixY < COMPARISON_MATRIX_SIZE; comparisonMatrixY++) {
        for(let comparisonMatrixX = 0; comparisonMatrixX < COMPARISON_MATRIX_SIZE; comparisonMatrixX++) {
          
          let indexX = comparisonMatrixX + x;
          let indexY = comparisonMatrixY + y;

          if(indexX >= imageMatrix[0].length || indexY >= imageMatrix.length) {
            continue;
          }

          cellCount++;

          let { r, g, b } = imageMatrix[indexY][indexX];

          imageMatrixSum = {
            r: imageMatrixSum.r + r,
            g: imageMatrixSum.g + g,
            b: imageMatrixSum.b + b,
          };
        }
      }
      
      // Fill the cells in the matrix in the same ratio as the cell intensity with 255 or 0
      for(let comparisonMatrixY = 0; comparisonMatrixY < COMPARISON_MATRIX_SIZE; comparisonMatrixY++) {
        for(let comparisonMatrixX = 0; comparisonMatrixX < COMPARISON_MATRIX_SIZE; comparisonMatrixX++) {
          
          let indexX = comparisonMatrixX + x;
          let indexY = comparisonMatrixY + y;

          if(indexX >= imageMatrix[0].length || indexY >= imageMatrix.length) {
            continue;
          }

          imageMatrix[indexY][indexX] = {
            r: Math.round(imageMatrixSum.r / cellCount),
            g: Math.round(imageMatrixSum.g / cellCount),
            b: Math.round(imageMatrixSum.b / cellCount),
          }
        }
      }
    }
  }

  // Set the values from 2D array to image object
  for(let y = 0; y < image.bitmap.height; y++) {
    for(let x = 0; x < image.bitmap.width; x++) {
      image.setPixelColor(Jimp.rgbaToInt(imageMatrix[y][x].r, imageMatrix[y][x].g, imageMatrix[y][x].b, 255), x, y);
    }
  }

  await image.write(`output-${Date.now()}.${image.getExtension()}`);
}


main();