import React, { useEffect, useState, useRef } from 'react'
import { getRandomIntInclusive } from './util'
import { imageSources } from './imageSources'
import startImage from './images/start.jpg'
import secondIntroImage from './images/two.jpg'
import thridIntroImage from './images/three.jpg'
import fourthIntroImage from './images/four.jpg'

function generateCanvas() {
    let imgUrlLocator
    const imageSourceId = 0
    const imgSource = imageSources[imageSourceId]
    while (!imgUrlLocator || imgUrlLocator < imgSource.minRandom || imgUrlLocator > imgSource.maxRandom ||
        imgSource.ignore.includes(imgUrlLocator)) {
        imgUrlLocator = getRandomIntInclusive(imgSource.minRandom, imgSource.maxRandom)
    }
    return {
        background: '#333 url(' + imgSource.urlPrefix + imgUrlLocator + imgSource.urlPostFix + ') no-repeat center'
    }
}

export function InfiniteScroll() {
    const [postList, setPostList] = useState({
            list: [
                { background: '#333 url(' + startImage + ') no-repeat center' },
                { background: '#333 url(' + secondIntroImage + ') no-repeat center' },
                { background: '#333 url(' + thridIntroImage + ') no-repeat center' },
                { background: '#333 url(' + fourthIntroImage + ') no-repeat center' }
            ]
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
                div style = { post }
                className = "infinite-scroll__post_background_img infinite-scroll__post_background_img--portrait"
                alt = '' > < /div> < /
                div >
            ))
        } <
        div className = "loading"
        ref = { loader } >
        <
        h2 > Load More < /h2> < /
        div > <
        /div> < /
        div >
    )
}