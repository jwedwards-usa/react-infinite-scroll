function findContrastingColor(colorVal, minRgb, maxRgb) {
    //console.log(`colorVal ${colorVal},${minRgb},${maxRgb}`)
    let sum = minRgb + maxRgb - colorVal
    if (sum > 255 || sum <= 0) {
        return 255
    }
    if (colorVal > 200) {
        sum = 50
    } else if (colorVal < 100) {
        sum = 200
    }
    return sum
}

function determineTextColor(imgData) {
    // Define variables for storing
    // the individual red, blue and
    // green colors
    const rgb = { r: 0, g: 0, b: 0 }

    const minRgb = { r: 0, g: 0, b: 0 }
    const maxRgb = { r: 0, g: 0, b: 0 }

    // Define variable for the
    // total number of colors
    let count = 0

    // Get the length of image data object
    const length = imgData.data.length

    for (let i = 0; i < length; i += 4) {
        // Sum all values of red colour
        rgb.r += imgData.data[i]
        minRgb.r = Math.min(minRgb.r, imgData.data[i])
        maxRgb.r = Math.max(maxRgb.r, imgData.data[i])

        // Sum all values of green colour
        rgb.g += imgData.data[i + 1]
        minRgb.g = Math.min(minRgb.g, imgData.data[i + 1])
        maxRgb.g = Math.max(maxRgb.g, imgData.data[i + 1])

        // Sum all values of blue colour
        rgb.b += imgData.data[i + 2]
        minRgb.b = Math.min(minRgb.b, imgData.data[i + 2])
        maxRgb.b = Math.max(maxRgb.b, imgData.data[i + 2])

        // Increment the total number of
        // values of rgb colours
        count++
    }
    // Find the average of rgb
    rgb.r = Math.floor(rgb.r / count)
    rgb.g = Math.floor(rgb.g / count)
    rgb.b = Math.floor(rgb.b / count)

    // Find the contrast rgb
    rgb.r = findContrastingColor(rgb.r, Math.min(minRgb.r, minRgb.g, minRgb.b), Math.max(maxRgb.r, maxRgb.g, maxRgb.b))
    rgb.g = findContrastingColor(rgb.g, Math.min(minRgb.r, minRgb.g, minRgb.b), Math.max(maxRgb.r, maxRgb.g, maxRgb.b))
    rgb.b = findContrastingColor(rgb.b, Math.min(minRgb.r, minRgb.g, minRgb.b), Math.max(maxRgb.r, maxRgb.g, maxRgb.b))

    //console.log(`after color is ${rgb.r},${rgb.g},${rgb.b}`)
    return rgb
}

export { determineTextColor }