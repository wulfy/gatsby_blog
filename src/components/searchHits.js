import React from 'react'
import {Link} from 'gatsby'

import { DEFAULT_POST_IMG } from '../common/constant';

const MAX_CHARS = 500;
const hits = ({hit}) => {
    let preview = hit.html.match(/<p>((s*))(.*)/) ? hit.html.match(/<p>((s*))(.*)/)[0] : '';

    if(preview.length > MAX_CHARS)
    {
      preview = preview.substr(0, MAX_CHARS);
      preview = preview.substr(0, Math.min(preview.length, preview.lastIndexOf(" ")));
      preview += " ..." ;
    } 

    const hitImg = hit.image.blogImage || DEFAULT_POST_IMG;
    return (

      <div className="card hoverable">
        <div className="card-image waves-effect waves-block waves-light">
          <img alt={hit.frontmatter.title} className="activator" src={hitImg}/>
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