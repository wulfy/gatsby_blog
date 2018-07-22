import React from 'react'

import Header from './components/header'

const favicon = null;
const css = null;

const HTML = props => {
	  return (
        <html lang="fr">
            <head>
              <meta charSet="utf-8" />
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
              />
              {props.headComponents}
              <link rel="shortcut icon" href={favicon} />
              <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.1.1/css/all.css" integrity="sha384-O8whS3fhG2OnA5Kas0Y9l3cfpmYjapjI0E4theH4iuMD+pLhbf6JI0jIMfYcK3yZ" crossOrigin="anonymous"/>
              {css}
            </head> 
            <body>
              <div
                id="___gatsby"
                dangerouslySetInnerHTML={{ __html: props.body }}
              />
              {props.postBodyComponents}
            </body>
          </html>
      );
}

export default HTML;