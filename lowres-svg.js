/**
 * Low Resolution Algorithm
 * Averages out the pixel colors in an nxn matrix
 * 
 * Output an array of circles for A E S T H E T I C purposes :D
 * 
 * @author Alok Swamy
 */
const Jimp = require('jimp');
const fsPromises = require('fs').promises;

/*
* size of window of pixels to apply average
*/
const COMPARISON_MATRIX_SIZE = 30;

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

  const svgFile = await fsPromises.open(`output-${Date.now()}.html`, 'w');
  const svgMatrix = Array.from(Array(Math.ceil(imageMatrix.length / COMPARISON_MATRIX_SIZE)), () => new Array(Math.ceil(imageMatrix[0].length / COMPARISON_MATRIX_SIZE)));

  await svgFile.write(`
    <!DOCTYPE html>
    <html>
    <body>
    <svg width="${svgMatrix[0].length * 10}" height="${svgMatrix.length * 10}">
  `);

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
      
      svgMatrix[y/COMPARISON_MATRIX_SIZE][x/COMPARISON_MATRIX_SIZE] = {
        r: Math.round(imageMatrixSum.r / cellCount),
        g: Math.round(imageMatrixSum.g / cellCount),
        b: Math.round(imageMatrixSum.b / cellCount),
      };
    }
  }

  for(let y = 0; y < svgMatrix.length; y++) {
    for(let x = 0; x < svgMatrix[0].length; x++) {
      await svgFile.write(`<circle cx="${5 + 10*x}" cy="${5 + 10*y}" r="4" fill="rgb(${svgMatrix[y][x].r}, ${svgMatrix[y][x].g}, ${svgMatrix[y][x].b})" />\n`);
    }
  }

  await svgFile.write(`
    </svg>
    </body>
    </html>
  `);

  await svgFile.close();
}


main();