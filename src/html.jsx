import React from 'react'

const favicon = null;
const css = null;

const HTML = (props) => (
	  <html lang="fr">
        <head>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          {props.headComponents}
          <link rel="shortcut icon" href={favicon} />
          {css}
        </head>
        <body>
        	<h1> My title </h1>
          <div
            id="___gatsby"
            dangerouslySetInnerHTML={{ __html: props.body }}
          />
          {props.postBodyComponents}
        </body>
      </html>
)

export default HTML;