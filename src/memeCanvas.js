import React, { Component, PropTypes } from "react"
import { drawMultilineText } from "./canvasTextHelper"
import * as StackBlur from 'stackblur-canvas'
import watermarkImgSrc from './images/watermark.png'

export default class MemeCanvas extends Component {

    state = {}

    constructor(props) {
        super(props)
        this.canvasRef = React.createRef()

        this.handleMemeBackgroundImgLoaded = this.handleMemeBackgroundImgLoaded.bind(this)
        this.handleMemeWatermarkImgLoaded = this.handleMemeWatermarkImgLoaded.bind(this)

        const memeBackgroundImg = new Image()
        memeBackgroundImg.onload = this.handleMemeBackgroundImgLoaded

        const memeWatermarkImg = new Image()
        memeWatermarkImg.onload = this.handleMemeWatermarkImgLoaded

        this.state = {
            width: this.calculateImgWidth(),
            height: this.calculateImgHeight(),
            class: this.props.className,
            backgroundImg: memeBackgroundImg,
            watermarkImg: memeWatermarkImg,
        }

        //to support 3rd party images we need to disable cors
        memeBackgroundImg.crossOrigin = "Anonymous"
        memeBackgroundImg.src = this.props.imgSrc
        memeWatermarkImg.src = watermarkImgSrc
    }

    handleMemeBackgroundImgLoaded() {
        if (!this.state.memeBackgroundImgLoaded) {
            this.composeMeme()
        }
    }

    handleMemeWatermarkImgLoaded() {
        if (!this.state.memeWatermarkImgLoaded) {
            this.composeMeme()
        }
    }

    componentDidMount() {
        const backgroundImg = this.state.backgroundImg.current
        if (backgroundImg && backgroundImg.complete) {
            this.setState({ memeBackgroundImgLoaded: true })
        }
        const watermarkImg = this.state.watermarkImg.current
        if (watermarkImg && watermarkImg.complete) {
            this.setState({ memeWatermarkImg: true })
        }

        window.addEventListener("resize", this.updateDimensions.bind(this))
    }

    /**
     * Remove event listener
     */
    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions.bind(this))
        this.setState({})
    }

    updateDimensions() {
        this.setState({ width: this.calculateImgWidth(), height: this.calculateImgHeight(), class: this.state.class })
        this.composeMeme()
    }

    calculateImgWidth() {
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

        if (vh > vw) {
            return 0.9 * vw
        }
        return vh
    }

    calculateImgHeight() {
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

        if (vh > vw) {
            return 0.4 * vh
        }
        return 0.8 * vh
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

    getCanvas() {
        if (this.canvasRef === null) {
            return
        }
        return this.canvasRef.current
    }

    getContext() {
        const canvas = this.getCanvas()
        if (canvas === null) {
            return
        }
        return canvas.getContext("2d")
    }

    addWatermark() {
        const canvas = this.getCanvas()
        const ctx = this.getContext()
        const watermarkLftRhtMargin = 20
        const watermarkTopBtmMargin = 20
        const watermarkWidth = 50
        const watermarkHeight = 20

        ctx.save()

        //force foreground
        ctx.globalCompositeOperation = 'source-over'
        if (this.props.watermarkOpacity) {
            ctx.globalAlpha = this.props.watermarkOpacity
        } else {
            ctx.globalAlpha = 0.3 //0 is fully transparent, 1 is fully opaque
        }
        //Top Left
        ctx.drawImage(this.state.watermarkImg, watermarkLftRhtMargin, watermarkTopBtmMargin, watermarkWidth, watermarkHeight)

        //Bottom Right
        ctx.drawImage(this.state.watermarkImg, canvas.width - (watermarkLftRhtMargin + watermarkWidth), canvas.height - (watermarkTopBtmMargin + watermarkHeight), watermarkWidth, watermarkHeight)

        //Top Right
        ctx.drawImage(this.state.watermarkImg, canvas.width - (watermarkLftRhtMargin + watermarkWidth), watermarkTopBtmMargin, watermarkWidth, watermarkHeight)

        //Bottom Left
        ctx.drawImage(this.state.watermarkImg, watermarkLftRhtMargin, canvas.height - (watermarkTopBtmMargin + watermarkHeight), watermarkWidth, watermarkHeight)

        ctx.restore()
    }

    addText() {
        const ctx = this.getContext()
        const canvas = this.getCanvas()

        const memeText = this.props.text
        const memeReference = this.props.reference

        const textWidth = this.calculateTextWidth()
        const textLeftOffest = this.calculateTextLeftOffset()

        const textHeight = this.calculateTextHeight()
        const textTopOffset = this.calculateTextTopOffset()

        ctx.save()

        //Blur the background of the text in preparation for the text
        StackBlur.canvasRGBA(canvas, 0, 0, canvas.width, canvas.height, 2)
        var grd = ctx.createLinearGradient(textLeftOffest, textTopOffset, textWidth, textHeight)
        grd.addColorStop(0, 'rgba(0, 0, 0, 0.35)')
        grd.addColorStop(1, 'rgba(0, 0, 0, 0.35)')
        ctx.fillStyle = grd
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.restore()
        ctx.fillStyle = '#ffffff'

        //const imgData = ctx.getImageData(textLeftOffest, textTopOffset, textWidth, textHeight)
        const textColor = '#ffffff' //determineTextColor(imgData)
        ctx.fillStyle = `rgb(${textColor.r},${textColor.g},${textColor.b})`
        ctx.strokeStyle = `rgb(${textColor.r},${textColor.g},${textColor.b})`

        //force foreground
        ctx.globalCompositeOperation = 'source-over'

        // Rectangle for text and color debugging
        //ctx.strokeRect(textLeftOffest, textTopOffset, textWidth, textHeight)
        let textRhsBounds = drawMultilineText(ctx, memeText, {
            rect: {
                x: textLeftOffest,
                y: textTopOffset,
                width: textWidth,
                height: textHeight
            },
            font: 'Nunito, "Avenir Next", "Helvetica Neue", Helvetica, Arial, sans-serif',
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
                font: 'Nunito, "Avenir Next", "Helvetica Neue", Helvetica, Arial, sans-serif',
                verbose: false,
                lineHeight: 1.2,
                minFontSize: 2,
                maxFontSize: 16,
                alignment: 'right'
            })
        }
        ctx.restore()
    }

    addBackground() {
        const img = this.state.backgroundImg
        const canvas = this.getCanvas()
        const ctx = this.getContext()
        ctx.save()

        //Scale the image to ensure the image fills the entire canvas
        var hRatio = canvas.width / img.width
        var vRatio = canvas.height / img.height
        var ratio = Math.max(hRatio, vRatio)
        var centerShift_x = (canvas.width - img.width * ratio) / 2
        var centerShift_y = (canvas.height - img.height * ratio) / 2

        //background
        ctx.globalCompositeOperation = 'destination-over'
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, img.width, img.height,
            centerShift_x, centerShift_y, img.width * ratio, img.height * ratio)
    }

    composeMeme() {
        const memeWidth = this.state.width
        const memeHeight = this.state.height

        const canvas = this.getCanvas()
        if (canvas) {
            canvas.width = memeWidth
            canvas.height = memeHeight

            if (this.state.backgroundImg.complete && this.state.backgroundImg.naturalWidth !== 0) {
                this.addBackground()
            }
            this.addText()
            if (this.state.watermarkImg.complete && this.state.watermarkImg.naturalWidth !== 0) {
                this.addWatermark()
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