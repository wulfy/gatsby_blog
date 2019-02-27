import React from 'react'
import { loadScript, removeScript } from '../common/scriptLoader'
import { document, window } from 'browser-monads';

const Disqus = props => {
  const {page_url,page_identifier} = props;
  const disqus_shortname = "wulfy-eu";
  const disqusSrc = `https://${disqus_shortname}.disqus.com/embed.js`;
  const disqusConfig = function () {
    return function () {
            this.page.identifier = page_identifier;
            this.page.url = page_url;
            this.page.title = page_identifier;
          };
  };

  if (window && window.DISQUS && document.getElementById('dsq-embed-scr')) {
      setTimeout(()=>window.DISQUS.reset({reload:true}),2000);
  } else {
    window.disqus_config = disqusConfig;
    window.disqus_shortname = disqus_shortname
    loadScript({src:disqusSrc,id:'dsq-embed-scr'});
  }

  return (
    <div id="disqus_thread">
    </div>
  )
}

export default Disqus;