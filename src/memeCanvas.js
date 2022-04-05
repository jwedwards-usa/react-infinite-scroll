import React, { Component, PropTypes } from "react";
import { drawMultilineText } from "./canvasTextHelper";
import { determineTextColor } from "./canvasColorHelper";

export default class MemeCanvas extends Component {

    constructor(props) {
        super(props)
        this.canvasRef = React.createRef();
    }

    componentDidMount() {
        this.updateCanvas();
    }

    updateCanvas() {
        const canvas = this.canvasRef.current
        const ctx = canvas.getContext("2d")

        const memeText = this.props.meme.text
        const memeReference = this.props.meme.reference
        const memeWidth = this.props.meme.width
        const memeHeight = this.props.meme.height

        this.canvasRef.current.width = memeWidth
        this.canvasRef.current.height = memeHeight

        var img = new Image()
        img.src = this.props.meme.image
        img.onload = function() {
            //scaling the image down and scaling back up for a quickly done blur like effect
            ctx.drawImage(img, 0, 0, img.width / 2, img.height / 2);
            ctx.drawImage(img, 0, 0, img.width / 2, img.height / 2, 0, 0, img.width, img.height);

            // Rectangle for color debugging
            //ctx.strokeRect(0, 90, canvas.width, canvas.height - 175)

            const textColor = determineTextColor(canvas, 90, 175)
            ctx.fillStyle = `rgb(${textColor.r},${textColor.g},${textColor.b})` //  '#ffffff'
            ctx.strokeStyle = `rgb(${textColor.r},${textColor.g},${textColor.b})` //   '#ffffff'

            drawMultilineText(ctx, memeText, {
                rect: {
                    x: 50,
                    y: 90,
                    width: memeWidth - 250,
                    height: memeHeight - 175
                },
                font: 'Roboto',
                verbose: false,
                lineHeight: 1.2,
                minFontSize: 22,
                maxFontSize: 32
            })
            if (typeof memeReference !== 'undefined') {
                ctx.font = '22px Roboto'
                ctx.fillText(memeReference, 250, 340)
            }
        }
    }

    render() {
        return <canvas ref = { this.canvasRef } > < /canvas>
    }
}