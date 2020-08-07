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


#### Floyd-Steinberg Algorithm

`npm run floyd-steinberg`


#### Ordered Algorithm

`npm run ordered`

#### Halftone Algorithm

`npm run halftone`

#### Low Resolution

NOTE: This isn't an official Dithering algorithm - I just wanted to have a way of averaging
the color of a matrix of pixels to create a low-res picture for art

`npm run lowres`