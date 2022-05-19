import * as tinycolor from 'tinycolor2'

const readableColors = [tinycolor('white'), tinycolor('black'), tinycolor('#8ed8df'), tinycolor('#80f6b3'), tinycolor('#b791ea'), tinycolor('#e8a8bc'), tinycolor('#f5c295')]

function determineTextColor(imgData) {
    // Define variables for storing
    // the individual red, blue and
    // green colors
    const avgRgb = { r: 0, g: 0, b: 0 }
    const readables = new Map();
    const unreadables = new Map();
    const minRgb = { r: 0, g: 0, b: 0 }
    const maxRgb = { r: 0, g: 0, b: 0 }

    for (let i = 0; i < imgData.data.length; i += 3) {
        // Sum all values of red colour
        avgRgb.r += imgData.data[i]
        minRgb.r = Math.min(minRgb.r, imgData.data[i])
        maxRgb.r = Math.max(maxRgb.r, imgData.data[i])

        // Sum all values of green colour
        avgRgb.g += imgData.data[i + 1]
        minRgb.g = Math.min(minRgb.g, imgData.data[i + 1])
        maxRgb.g = Math.max(maxRgb.g, imgData.data[i + 1])

        // Sum all values of blue colour
        avgRgb.b += imgData.data[i + 2]
        minRgb.b = Math.min(minRgb.b, imgData.data[i + 2])
        maxRgb.b = Math.max(maxRgb.b, imgData.data[i + 2])

        //Most readable
        const pxCol = tinycolor({ r: imgData.data[i], g: imgData.data[i + 1], b: imgData.data[i + 2] })
        const mostReadable = tinycolor.mostReadable(pxCol, readableColors).toHexString()
        if (!unreadables.has(mostReadable)) {
            if (typeof readables.get(mostReadable) === 'number') {
                readables.set(mostReadable, readables.get(mostReadable) + 1)
            } else {
                readables.set(mostReadable, 1)
            }
        }

        for (const entry of readables.entries()) {
            if (!tinycolor.isReadable(entry[0], pxCol)) {
                if (typeof readables.get(entry[0]) === 'number') {
                    unreadables.set(entry[0], unreadables.get(entry[0]) + 1)
                } else {
                    unreadables.set(entry[0], 1)
                }
            }
        }
    }
    const sortedReadables = new Map([...readables.entries()].sort((a, b) => b[1] - a[1]));


    for (const entry of sortedReadables.entries()) {
        if (!unreadables.has(entry[0])) {
            console.log(`most readable color is ${entry[0]}`)
            return entry[0]
        }
    }
    const reverseSortedUnreadables = new Map([...unreadables.entries()].sort((a, b) => a[1] - b[1]));
    const mostReabableUnreadableColor = reverseSortedUnreadables.keys().next().value;
    console.log(`most readable unreadable color is ${mostReabableUnreadableColor}`)
    return mostReabableUnreadableColor
}

export { determineTextColor }