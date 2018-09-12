import React from 'react'
import Link from 'gatsby-link'

import { DEFAULT_POST_IMG } from '../common/constant';

const MAX_WORDS = 20;
const hits = ({hit}) => {
  console.log(hit.html);
    const preview = hit.html.match(/<p>((s*))(.*)/)[0];
    const hitImg = hit.image.blogImage || DEFAULT_POST_IMG;
    return (
        <div className="hit">
          <Link to={hit.fields.slug}>
            <img src={hitImg} /><br/>
            <span>{hit.frontmatter.title}</span>
          </Link>
          <div dangerouslySetInnerHTML={{ __html: preview }}/>
        </div>
        
    )
  }

export default hits