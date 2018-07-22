import React from 'react'
import Link from 'gatsby-link'

import { CAT_ICON, DEFAULT_ICON } from '../common/constant'

const BlogTitle = props => {
  const style =
    'animatedSvgText' + (props.titleAnimationEnabled ? '' : ' notransition')
  console.log('style')
  console.log(style)
  return (
    <svg className="animatedSvgContainer">
      <text id="blogTitle" className={style} x="50%" y="50%" fill="white">
        WULFY's BLOG
      </text>
      <h1> WULFY's BLOG </h1>
    </svg>
  )
}

export default BlogTitle
