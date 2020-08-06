/**
 * Halftone implementation
 * 
 * @author Alok Swamy
 */
const Jimp = require('jimp');

/*
* size of window of pixels to apply halftone
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

  const image = (await file).greyscale();

  const imageMatrix = Array.from(Array(image.bitmap.height), () => new Array(image.bitmap.width));

  // Initialize all rbg values into a 2D Array
  for(let y = 0; y < image.bitmap.height; y++) {
    for(let x = 0; x < image.bitmap.width; x++) {
      // We only use R in the RGB value since all the values are the same in greyscale
      imageMatrix[y][x] = Jimp.intToRGBA(image.getPixelColor(x, y)).r;
    }
  }

  for(let y = 0; y < image.bitmap.height; y+=COMPARISON_MATRIX_SIZE) {
    for(let x = 0; x < image.bitmap.width; x+=COMPARISON_MATRIX_SIZE) {
      
      let imageMatrixSum = 0;
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
          imageMatrixSum += imageMatrix[indexY][indexX];

          imageMatrix[indexY][indexX] = 0;
        }
      }

      let cellsToFill = Math.round(imageMatrixSum / 255);
      
      // Fill the cells in the matrix in the same ratio as the cell intensity with 255 or 0
      for(let comparisonMatrixY = 0; comparisonMatrixY < Math.ceil(Math.sqrt(cellsToFill)); comparisonMatrixY++) {
        for(let comparisonMatrixX = 0; comparisonMatrixX < Math.ceil(Math.sqrt(cellsToFill)); comparisonMatrixX++) {
          
          let indexX = comparisonMatrixX + x;
          let indexY = comparisonMatrixY + y;

          if(indexX >= imageMatrix[0].length || indexY >= imageMatrix.length) {
            continue;
          }

          if(cellsToFill == 0) {
            imageMatrix[indexY][indexX] = 0;
          } else {
            imageMatrix[indexY][indexX] = 255;
            cellsToFill--;
          }
        }
      }
    }
  }

  // Set the values from 2D array to image object
  for(let y = 0; y < image.bitmap.height; y++) {
    for(let x = 0; x < image.bitmap.width; x++) {
      image.setPixelColor(Jimp.rgbaToInt(imageMatrix[y][x], imageMatrix[y][x], imageMatrix[y][x], 255), x, y);
    }
  }

  await image.write(`output-${Date.now()}.${image.getExtension()}`);
}


main();