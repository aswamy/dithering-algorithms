# Dithering

## Goals
Learning about different types of dithering algorithms. Seems like I can make some cool art using some modified variants of existing algorithms.

## Run Code

#### Prerequisite

- Install NodeJS
- Run the following in the project directory: `npm install`
- Set environment variable for your input image:

Windows: `set INPUT_FILE_PATH={your path to the original image}`

Linux: `INPUT_FILE_PATH={your path to the original image}`

I've used the following picture I've taken to perform my dithering algorithm. It can be found in the `docs/images` folder.

<img src="/docs/images/beach_house_couch_greyscale.png" width="50%" height="50%">

#### Floyd-Steinberg Algorithm

`npm run floyd-steinberg`

<img src="/docs/images/beach_house_couch_floyd-steinberg.png" width="50%" height="50%">

#### Ordered Algorithm

`npm run ordered`

<img src="/docs/images/beach_house_couch_ordered.png" width="50%" height="50%">

#### Halftone Algorithm

`npm run halftone`

<img src="/docs/images/beach_house_couch_halftone.png" width="50%" height="50%">

#### Low Resolution

NOTE: This isn't an official Dithering algorithm - I just wanted to have a way of averaging
the color of a matrix of pixels to create a low-res picture for pixel art

`npm run lowres`

This will output an svg of the image made of dots the size of the matrix chosen
`npm run lowres-svg`