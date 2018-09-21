import React from 'react'
import Link from 'gatsby-link'

import { DEFAULT_POST_IMG } from '../common/constant';

const MAX_WORDS = 20;
const hits = ({hit}) => {
  console.log(hit.html);
    const preview = hit.html.match(/<p>((s*))(.*)/)[0];
    const hitImg = hit.image.blogImage || DEFAULT_POST_IMG;
    return (

      <div className="card hoverable">
        <div className="card-image waves-effect waves-block waves-light">
          <img className="activator" src={hitImg}/>
          <div className="card_metas activator">
            <span className="card-title post_title meta noAbsolute activator">{hit.frontmatter.title}</span>
            <i className="post_date meta"><i className="fas fa-calendar-alt"></i>July 12, 2017</i>
          </div>
        </div>
        <div className="card-content">
          <span className="card-title activator grey-text text-darken-4">{hit.frontmatter.title} <i className="material-icons right">more_vert</i></span>
          <p><Link to={hit.fields.slug}>Read <i className="material-icons keyboard_arrow_right"> keyboard_arrow_right </i> </Link></p>
        </div>
        <div className="card-reveal">
          <span className="card-title grey-text text-darken-4 truncate">{hit.frontmatter.title}<i className="material-icons right">close</i></span>
          <div dangerouslySetInnerHTML={{ __html: preview }}/>
          <p className="bottom_read"><Link to={hit.fields.slug}>Read <i className="material-icons keyboard_arrow_right"> keyboard_arrow_right </i></Link></p>
        </div>
       </div>
    )
  };

export default hits