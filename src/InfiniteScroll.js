import React, { useEffect, useState, useRef } from 'react'
import { getRandomIntInclusive } from './util'
import { imageSources } from './imageSources'
import MemeCanvas from './memeCanvas'
import startImage from './images/start.jpg'
import secondIntroImage from './images/two.jpg'

const startingMemes = [{
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
}]

function generateCanvas() {
    let memeText = ''
    let memeReference = ''
    let memeImgSrc = ''

    let imgUrlLocator
    const imageSourceId = 0
    const imgSource = imageSources[imageSourceId]
    while (!imgUrlLocator || imgUrlLocator < imgSource.minRandom || imgUrlLocator > imgSource.maxRandom ||
        imgSource.ignore.includes(imgUrlLocator)) {
        imgUrlLocator = getRandomIntInclusive(imgSource.minRandom, imgSource.maxRandom)
    }
    memeImgSrc = imgSource.urlPrefix + imgUrlLocator + imgSource.urlPostFix

    return {
        imgSrc: memeImgSrc,
        width: imgSource.imgWidth,
        height: imgSource.imgHeight,
        text: memeText,
        reference: memeReference
    }
}

export function InfiniteScroll() {
    const [postList, setPostList] = useState({
            list: startingMemes
        })
        // tracking on which page we currently are
    const [page, setPage] = useState(1)
        // add loader reference
    const loader = useRef(null)

    // here we handle what happens when user scrolls to Load More div
    // in this case we just update page variable
    //@todo move this inside the useEffect function
    const handleObserver = (entities) => {
        const target = entities[0]
        if (target.isIntersecting) {
            setPage(_page => _page + 1)
        }
        //@todo implement observer.unobserve
    }

    useEffect(() => {
        const options = {
                root: null,
                rootMargin: '20px',
                threshold: 1.0,
            }
            // initialize IntersectionObserver and attaching to Load More div
        const observer = new IntersectionObserver(handleObserver, options)
        if (loader.current) {
            observer.observe(loader.current)
        }
    }, [])

    useEffect(() => {
        setPostList((x) => {
            return ({
                list: x.list.concat([generateCanvas(), generateCanvas(), generateCanvas(), generateCanvas()]),
            })
        })
    }, [page])



    return ( <
        div className = "infinite-scroll__container_div" >
        <
        div className = "post-list" > {
            postList.list.map((post, index) => ( <
                div key = { index }
                className = "infinite-scroll__post_div" >
                <
                div alt = '' >
                <
                MemeCanvas text = { post.text }
                reference = { post.reference }
                imgSrc = { post.imgSrc }
                imgWidth = { 900 }
                imgHeight = { 400 }
                className = "infinite-scroll__post_canvas" /
                >
                <
                /
                div > < /
                div >
            ))
        } <
        div className = "loading"
        ref = { loader } >
        <
        h2 > Load More < /h2>  < /
        div > <
        /div>  < /
        div >
    )
}