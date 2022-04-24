import React, { Component, PropTypes } from "react"
import { drawMultilineText } from "./canvasTextHelper"
import { determineTextColor } from "./canvasColorHelper"
import * as StackBlur from 'stackblur-canvas'

export default class MemeCanvas extends Component {

    constructor(props) {
        super(props)
        this.canvasRef = React.createRef()

        this.state = {
            width: this.calculateImgWidth(),
            height: this.calculateImgHeight(),
            class: this.props.className,
        }
    }

    componentDidMount() {
        this.updateCanvas()
        window.addEventListener("resize", this.updateDimensions.bind(this))
    }

    /**
     * Remove event listener
     */
    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions.bind(this))
    }

    calculateImgWidth() {
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
        return 0.9 * vw
    }

    calculateImgHeight() {
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
        return 0.4 * vh
    }

    calculateTextWidth() {
        return 0.8 * this.calculateImgWidth()
    }

    calculateTextLeftOffset() {
        return (this.calculateImgWidth() - this.calculateTextWidth()) / 2
    }

    calculateTextHeight() {
        return 0.4 * this.calculateImgHeight()
    }

    calculateTextTopOffset() {
        return (this.calculateImgHeight() - this.calculateTextHeight()) / 2
    }

    updateDimensions() {
        this.setState({ width: this.calculateImgWidth(), height: this.calculateImgHeight(), class: this.state.class })
        this.updateCanvas()
    }

    updateCanvas() {
        const canvas = this.canvasRef.current
        if (canvas === null) {
            return
        }
        const ctx = canvas.getContext("2d")

        const memeText = this.props.text
        const memeReference = this.props.reference

        const memeWidth = this.state.width
        const memeHeight = this.state.height

        const textWidth = this.calculateTextWidth()
        const textLeftOffest = this.calculateTextLeftOffset()

        const textHeight = this.calculateTextHeight()
        const textTopOffset = this.calculateTextTopOffset()

        this.canvasRef.current.width = memeWidth
        this.canvasRef.current.height = memeHeight

        var img = new Image()
            //to support 3rd party images we need to disable cors
        img.crossOrigin = "Anonymous"
        img.src = this.props.imgSrc
        img.onload = function() {

            //Scale the image to ensure the image fills the entire canvas
            var hRatio = canvas.width / img.width
            var vRatio = canvas.height / img.height
            var ratio = Math.max(hRatio, vRatio)
            var centerShift_x = (canvas.width - img.width * ratio) / 2
            var centerShift_y = (canvas.height - img.height * ratio) / 2
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(img, 0, 0, img.width, img.height,
                centerShift_x, centerShift_y, img.width * ratio, img.height * ratio)

            StackBlur.canvasRGBA(canvas, 0, 0, canvas.width, canvas.height, 2)

            const imgData = ctx.getImageData(textLeftOffest, textTopOffset, textWidth, textHeight)
            const textColor = determineTextColor(imgData)
            ctx.fillStyle = `rgb(${textColor.r},${textColor.g},${textColor.b})` //  '#ffffff'
            ctx.strokeStyle = `rgb(${textColor.r},${textColor.g},${textColor.b})` //   '#ffffff'

            // Rectangle for text and color debugging
            //ctx.strokeRect(textLeftOffest, textTopOffset, textWidth, textHeight)
            let textRhsBounds = drawMultilineText(ctx, memeText, {
                rect: {
                    x: textLeftOffest,
                    y: textTopOffset,
                    width: textWidth,
                    height: textHeight
                },
                font: 'Roboto',
                verbose: false,
                lineHeight: 1.2,
                minFontSize: 2,
                maxFontSize: 28
            })

            if (typeof memeReference !== 'undefined') {
                // Rectangle for reference text debugging
                //ctx.strokeRect(textLeftOffest, textRhsBounds.bottomPixelofBottomLine + 3, Math.min(textWidth, textRhsBounds.maxWidth + (textWidth / 2)), textHeight / 4)
                drawMultilineText(ctx, memeReference, {
                    rect: {
                        x: textLeftOffest,
                        y: textRhsBounds.bottomPixelofBottomLine + 3,
                        width: Math.min(textWidth, textRhsBounds.maxWidth + (textWidth / 2)),
                        height: textHeight / 4
                    },
                    font: 'Roboto',
                    verbose: false,
                    lineHeight: 1.2,
                    minFontSize: 2,
                    maxFontSize: 16,
                    alignment: 'right'
                })
            }
        }
    }

    render() {
        return <canvas ref = { this.canvasRef }
        width = { this.state.width }
        height = { this.state.height }
        className = { this.state.class } > < /canvas>
    }
}