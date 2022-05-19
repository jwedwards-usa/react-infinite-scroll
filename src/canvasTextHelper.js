//
// ## Returns true if text contains puntaction characters
//
function containsPunctations(text) {
    // Test string against regexp for many punctactions characters, including CJK ones
    return /[\uFF01-\uFF07,\u0021,\u003F,\u002E,\u002C,\u003A,\u003B,\uFF1A-\uFF1F,\u3002,\uFF0C-\uFF0E,\u2000-\u206F,\uFFED-\uFFEF,\u0028,\u0029]/.test(text)
}

//
// ## Returns array of words in text
// ## For CJK languages almost every char is a word,
// ## for other languages words are separated by spaces
//
function wordsArray(text) {
    // Test for CJK characters
    if (/[\u3400-\u9FBF]/.test(text)) {
        // Contains CJK characters
        const words = []
        const characters = text.split('')
        for (let i = 0; i <= characters.length - 1; i++) {
            if (!containsPunctations(characters[i + 1])) {
                // Next character is "normal"
                words.push(characters[i])
            } else {
                // Next character isn't a single word
                words.push(characters[i] + characters[i + 1])
                i++
            }
        }

        return words
    } else {
        // Other language
        // Converts returns in spaces, removes double spaces
        text = text.replace(/(\r\n|\n|\r)/gm, ' ').replace(/\s+/g, ' ')
            // Simply split by spaces
        return text.split(' ')
    }
}

function lineEndsWithPuncuation(line) {
    return line.endsWith('! ') ||
        line.endsWith('. ') ||
        line.endsWith(', ') ||
        line.endsWith(': ') ||
        line.endsWith('; ')
}

function splitSentenceToFitMaxOnFirstLines(ctx, words, opts) {
    let lines = []

    // Finds max font size  which can be used to print whole text in opts.rec
    let fontSize = opts.maxFontSize
    for (; fontSize >= opts.minFontSize; fontSize--) {
        const lineHeight = fontSize * opts.lineHeight

        // Set font for testing with measureText()
        ctx.font = ' ' + fontSize + 'px ' + opts.font

        const x = opts.rect.x
        let y = opts.rect.y + fontSize // It's the bottom line of the letters
        lines = []
        let line = ''

        for (const word of words) {
            const linePlus = line + word + ' '
                // If added word exceeds rect width...
            if (ctx.measureText(linePlus).width > (opts.rect.width)) {
                // ..."prints" (save) the line without last word
                lines.push({ text: line, x: x, y: y })
                    // New line with ctx last word
                line = word + ' '
                y += lineHeight
            } else if (lineEndsWithPuncuation(line) && linePlus.length > 50) {
                // ..."prints" (save) the line without last word
                lines.push({ text: line, x: x, y: y })
                    // New line with ctx last word
                line = word + ' '
                y += lineHeight
            } else {
                // ...continue appending words
                line = linePlus
            }
        }
        // "Print" last line
        lines.push({ text: line, x: x, y: y })

        // If bottom of rect is reached then break
        if (opts.verbose) opts.logFunction('y=' + y + '  rect.height=' + (opts.rect.height + opts.rect.y) + ' fontSize=' + fontSize)
        if (y <= (opts.rect.height + opts.rect.y)) { break }
    }
    return lines
}

// Adapted from https://gitlab.com/davideblasutto/canvas-multiline-text
function drawMultilineText(ctx, text, opts) {
    // Defaults
    if (!opts) { opts = {} }
    if (!opts.font) { opts.font = 'sans-serif' }
    if (typeof opts.alignment === 'undefined') { opts.alignment = 'center' }
    if (typeof opts.stroke === 'undefined') { opts.stroke = false }
    if (typeof opts.verbose === 'undefined') { opts.verbose = false }
    if (!opts.rect) {
        opts.rect = {
            x: 0,
            y: 0,
            width: ctx.canvas.width,
            height: ctx.canvas.height
        }
    }
    if (!opts.lineHeight) { opts.lineHeight = 1.1 }
    if (!opts.minFontSize) { opts.minFontSize = 12 }
    if (!opts.maxFontSize) { opts.maxFontSize = 48 }

    // Default log function is console.log - Note: if verbose=false, nothing will be logged
    if (!opts.logFunction) { opts.logFunction = function(message) { console.log(message) } }

    const words = wordsArray(text)
    if (opts.verbose) opts.logFunction('Text contains ' + words.length + ' words')

    let lines = splitSentenceToFitMaxOnFirstLines(ctx, words, opts)

    if (opts.verbose) opts.logFunction('Font used: ' + ctx.font)

    let bottomPixelofBottomLine = 0
    let maxWidth = 0
    for (const line of lines) {
        let textString = line.text.trim()
        let measureText = ctx.measureText(textString)
        bottomPixelofBottomLine = line.y + measureText.fontBoundingBoxDescent
        maxWidth = Math.max(maxWidth, measureText.width)
        let x = 0
        if (opts.alignment === 'left') {
            x = line.x
        } else if (opts.alignment === 'right') {
            x = line.x + opts.rect.width - measureText.width
        } else {
            x = (ctx.canvas.width / 2) - (measureText.width / 2)
        }
        if (opts.stroke) {
            ctx.lineWidth = 1
            ctx.shadowBlur = 5
            ctx.strokeText(textString, x, line.y)
            ctx.shadowBlur = 0
            ctx.fillText(textString, x, line.y)
            ctx.fill()
            ctx.stroke()
        } else {
            ctx.fillText(textString, x, line.y)
        }
    }
    return {
        'maxWidth': maxWidth,
        'bottomPixelofBottomLine': bottomPixelofBottomLine
    }
}

export { drawMultilineText }