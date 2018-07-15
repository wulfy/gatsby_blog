import React from 'react'
import Link from 'gatsby-link'

import {CAT_ICON, DEFAULT_ICON} from '../common/constant'

const BlogTitle = (props) => {
	return(
		<svg className="animatedSvgContainer">
		  <text className="animatedSvgText" x="0" y="1em" fill="white">WULFY's BOG</text>
		  <text className="animatedSvgTextBorder" x="0.5px" y="1em" fill="white">WULFY's BOG</text>
		  <h1> WULFY's BOG </h1>
		</svg>
		);
};

export default BlogTitle;