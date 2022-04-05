function determineTextColor(imageElement, txtStartY, heightOffest) {
    // Create the canavs element
    const tmpCanvas =
        document.createElement('canvas')

    // Get the 2D context of the canvas
    const tmpCtx =
        tmpCanvas.getContext &&
        tmpCanvas.getContext('2d')

    // Define variables for storing
    // the individual red, blue and
    // green colors
    const rgb = { r: 0, g: 0, b: 0 }

    // Define variable for the
    // total number of colors
    let count = 0

    // Set the height and width equal
    // to that of the canvas and the image
    const width = tmpCanvas.width =
        imageElement.naturalWidth ||
        imageElement.offsetWidth ||
        imageElement.width

    const height = tmpCanvas.height =
        imageElement.naturalHeight ||
        imageElement.offsetHeight ||
        imageElement.height

    // Draw the image to the canvas
    tmpCtx.drawImage(imageElement, 0, 0)

    // Get the data of the image
    const imgData = tmpCtx.getImageData(
        0, txtStartY, width, height - heightOffest)

    // Get the length of image data object
    const length = imgData.data.length

    for (let i = 0; i < length; i += 4) {
        // Sum all values of red colour
        rgb.r += imgData.data[i]

        // Sum all values of green colour
        rgb.g += imgData.data[i + 1]

        // Sum all values of blue colour
        rgb.b += imgData.data[i + 2]

        // Increment the total number of
        // values of rgb colours
        count++
    }

    // Find the average of rgb
    rgb.r = Math.floor(rgb.r / count)
    rgb.g = Math.floor(rgb.g / count)
    rgb.b = Math.floor(rgb.b / count)

    // console.log(`before color is ${rgb.r},${rgb.g},${rgb.b})`)
    if (rgb.r > 160 || rgb.g > 160 || rgb.b > 160) {
        rgb.r = 30
        rgb.g = 30
        rgb.b = 30
    } else {
        rgb.r = 235
        rgb.g = 235
        rgb.b = 235
    }
    // console.log(`after color is ${rgb.r},${rgb.g},${rgb.b})`)
    return rgb
}

export { determineTextColor }