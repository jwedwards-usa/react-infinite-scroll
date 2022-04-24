function findContrastingColor(colorVal, minRgb, maxRgb) {
    console.log(`colorVal ${colorVal},${minRgb},${maxRgb})`)
    let sum = minRgb + maxRgb - colorVal
    if (sum > 255 || sum <= 0) {
        // return 255
    }
    return sum
}

function determineTextColor(imgData) {
    // Define variables for storing
    // the individual red, blue and
    // green colors
    const rgb = { r: 0, g: 0, b: 0 }

    // Define variable for the
    // total number of colors
    let count = 0

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

    //Find the min
    let minRgb = Math.min(rgb.r, rgb.g, rgb.b);

    //Find the max
    let maxRgb = Math.max(rgb.r, rgb.g, rgb.b);

    // Find the contrast rgb
    rgb.r = findContrastingColor(rgb.r, minRgb, maxRgb)
    rgb.g = findContrastingColor(rgb.g, minRgb, maxRgb)
    rgb.b = findContrastingColor(rgb.b, minRgb, maxRgb)

    console.log(`after color is ${rgb.r},${rgb.g},${rgb.b})`)
    return rgb
}

export { determineTextColor }