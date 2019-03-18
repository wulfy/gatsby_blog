---
path: "/gatsby"
date: "2019-02-25T21:15:33.962Z"
title: "Gatsby le blog magnifique"
category: "JS"
blogImage: "https://carnetparisien.files.wordpress.com/2014/11/gatsby-le-magnifique-50d2da1b24146.jpg"
---

## Gatsby base
### organisation des pages
html.jsx , index.js, pages/posts.js , etc.

### Graphql
### browser/config/node/ssr
browser
```
wrapRootElement
Allow a plugin to wrap the root element.

This is useful to setup any Providers component that will wrap your application. For setting persistent UI elements around pages use
``` 

config
node
ssr (server side rendering) 

```
wrapRootElement
Allow a plugin to wrap the root element.

This is useful to setup any Providers component that will wrap your application. For setting persistent UI elements around pages use
``` 

## browser monad 
## algolia
plugin https://github.com/algolia/gatsby-plugin-algolia
When you run gatsby build, it will publish those to Algolia.

configured in gatsby-config
```
const queries = [
  {
    query,
    transformer: ({ data }) => data.allMarkdownRemark.edges.map(({ node }) => node), // optional
    indexName: 'wulfy_blog', // overrides main index name, optional
  },
];
```

## commentaires disqus
Component : src/components/disqus.js
Script chargé via un loader (cf dans common scriptLoader).
Le loader utiliser un encodage base64 du script pour générer un ID unique permettant de ne pas charger en double un script JS
Le script loader s'appuie sur les event "load" (L’évènement load est émis lorsqu’une ressource et ses ressources dépendantes sont completement chargées) et "error" pour appeler un callback (s'il est définit).

