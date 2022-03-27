import React, { useEffect, useState, useRef } from 'react'
import { getRandomIntInclusive } from './Util'
import { imageSources } from './ImageSources'
import startImage from './images/start.jpg'
import secondIntroImage from './images/two.jpg'
import thridIntroImage from './images/three.jpg'
import fourthIntroImage from './images/four.jpg'

const postImgStyle = {
  width: '100%',
  height: '100%'
}

const postDivStyle = {
  color: 'blue',
  height: '150px',
  width: '400px',
  textAlign: 'center',
  padding: '5px 10px',
  background: '#eee',
  marginTop: '15px',
}

const containerStyle = {
  maxWidth: '1280px',
  margin: '0 auto',
}

function generateCanvas() {
  let imgUrlLocator
  const imageSourceId = 0
  const imgSource = imageSources[imageSourceId]
  while (!imgUrlLocator || imgUrlLocator < imgSource.minRandom || imgUrlLocator > imgSource.maxRandom ||
    imgSource.ignore.includes(imgUrlLocator)) {
    imgUrlLocator = getRandomIntInclusive(imgSource.minRandom, imgSource.maxRandom)
  }
  return imgSource.urlPrefix + imgUrlLocator + imgSource.urlPostFix
}

export function InfiniteScroll() {
  const [postList, setPostList] = useState({ list: [startImage, secondIntroImage, thridIntroImage, fourthIntroImage] })
  // tracking on which page we currently are
  const [page, setPage] = useState(1)
  // add loader reference
  const loader = useRef(null)
  // here we handle what happens when user scrolls to Load More div
  // in this case we just update page variable
  const handleObserver = (entities) => {
    const target = entities[0]
    if (target.isIntersecting) {
      setPage(_page => _page + 1)
    }
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

  return (
    <div className="container" style={containerStyle}>
      <div className="post-list">
        {postList.list.map((post, index) => (
          <div key={index} className="post" style={postDivStyle}>
            <img src={post} style={postImgStyle} alt=''></img>
          </div>
        ))}
        <div className="loading" ref={loader}>
          <h2>Load More</h2>
        </div>
      </div>
    </div>
  )
}