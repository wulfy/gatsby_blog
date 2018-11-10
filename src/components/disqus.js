import React from 'react'
import scriptLoader from '../common/scriptLoader'

const Disqus = props => {
  const {page_url,page_identifier} = props;
  const disqusScript = `
          var disqus_config = function () {
            this.page.url = page_url;  
            this.page.identifier = page_identifier;
          };
          (function() { // DON'T EDIT BELOW THIS LINE
          var d = document, s = d.createElement('script');
          s.src = 'https://wulfy-eu.disqus.com/embed.js';
          s.setAttribute('data-timestamp', +new Date());
          (d.head || d.body).appendChild(s);
          })()`;
  scriptLoader({script:disqusScript});
  return (
    <div id="disqus_thread">
    </div>
  )
}

export default Disqus;