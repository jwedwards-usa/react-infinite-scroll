import startImage from './images/start.jpg'
import secondIntroImage from './images/two.jpg'

function MemeJson() {
    return JSON.stringify([{
        imgSrc: startImage,
        width: 800,
        height: 400,
        text: "You will keep him in perfect peace, whose mind is stayed on You, because he trusts in You.",
        reference: "Isaiah 26:3 (NKJV)"
    }, {
        imgSrc: secondIntroImage,
        width: 800,
        height: 400,
        text: "Welcome to Dwell. Scroll down and enter into that peace. As you meditate on God",
        reference: "Your Brother in Christ"
    }])
}

export default MemeJson