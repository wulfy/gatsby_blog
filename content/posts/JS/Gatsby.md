---
path: "/gatsby"
date: "2019-02-25T21:15:33.962Z"
title: "Gatsby le blog magnifique"
category: "JS"
blogImage: "https://carnetparisien.files.wordpress.com/2014/11/gatsby-le-magnifique-50d2da1b24146.jpg"
---

## Gatsby base
### Configuration
*gatsby-browser.js*
Définit le bootstrap côté browser

*gatsby-ssr.js*
Définit le bootstrap côté server.

*gatsby-config.js*
Configure Gatsby, principalement les plugins.
Attention, la résolution de l'emplacement des pages et la gestion des nodes se fait via un plugin de gatsby.

```
{
  resolve: `gatsby-source-filesystem`,
  options: {
    name: `src`,
    path: `${__dirname}/src/`,
  },
},
```
Définit ou se trouve le code permetant de construire les pages (tous les composants react).

```
{
  resolve: `gatsby-source-filesystem`,
  options: {
    path: `${__dirname}/content/`,
    name: 'pageAndposts',
  },
},
```

Localise l'emplacement des "textes" des articles (posts/pages)

```
{
  resolve: 'gatsby-transformer-remark',
  options: {
    plugins: [], // just in case those previously mentioned remark plugins sound cool :)
  },
},
```
pas utilisé

*gatsby-node.js*
Contient la logique permettant de récupérer les `nodes` qui représentent des pages de Gatbsy.

La configuration s'appuie sur des fonctions de l'API comme `onCreateNode`.
Par exemple, dans `onCreateNode`, on définit des champs 'custom' pour chaque node créé (des champs qui n'existent pas par défaut).

`createPages` est appelé lorsque les pages sont générées de manière statique.
Elle va faire 3 choses
- créer les pages pour chaque "type" de contenu (posts et pages), qui contiendront la liste des articles qui sont du même type. Comme la fonction boucle sur tous les articles, chaque "type" d'article qu'elle rencontre va lui permettre de créer la page pour ce type.
- créer les pages de "catégorie", qui listeront les articles qui sont de la même catégorie (de même que pour type, en parcourant tous les articles, Gatsby va trouver toutes les catégories et les créer)
- Enfin, la page de l'article en question en s'appuyant sur la donnée `path` définit dans l'entête de l'article.

```
---
path: "/gatsby"
date: "2019-02-25T21:15:33.962Z"
title: "Gatsby le blog magnifique"
category: "JS"
blogImage: "https://carnetparisien.files.wordpress.com/2014/11/gatsby-le-magnifique-50d2da1b24146.jpg"
---
```

Pour chaque page créée gatsby on renseigne le `path`, le `component` chargé de générer le rendu et le `context` qui est un objet qui sera passé au composant. On peut lui associer des données qui seront accessible dans le composant.

<pre>
	<code class='JavaScript'>
		const categoryTemplate = path.resolve(`src/pages/category.js`)

		...


			createPage({
                path: `/category/${category}/`,
                component: categoryTemplate,
                context: {
                  category,
                }, // additional data can be passed via context
             })
	</code>
</pre>

Dans cet exemple, une page "catégorie" est créée.
Elle aura comme composant `categoryTemplate` qui correspond à un fichier JS exportant un composant react + un context `category `


### organisation des pages
Lorsque Gatsby génère une page il va s'appuyer sur le composant fourni dans le fichier de config `gatsby-node.j`.

Gatsby va d'abord appeler le bootstrap selon s'il doit générer côté browser ou server le fichier (ssr permet de générer le fichier statique non vide sur le serveur et ensuite côté browser le client JS prend la main pour gérer les évènements et le routing).
Le bootstrap va configurer le store (utilisé pour le moment uniquement lorsque du scroll pour modifier la CSS de certains composants) et appeler  
html.jsx en injectant le composant correspondant à la page.

Ce composant (exemple posts.js), va recevoir les données nécessaire à son affichage + le contexte et devra générer le rendu .

exempl
```
const {
    pageContext: { category },
  } = props
 ```
Permet de récupérer l'objet `category` et l'utiliser ensuite pour afficher la catégorie: 

```
const title = category ? null : <div className="page_title"> CATEGORIES </div>;
  return (
    <Layout location={props.location}>
      <div className="categoryList blog-post-container">
          {title}
          <CategoryImage className="categoryImage"/>
          {postsList}
      </div>
    </Layout>
  )
```

Actuellement les composants sont organisés tels que suit: 
- *template/pages.js et template/posts.js*, permettant d'afficher les pages/posts des articles
- *pages/category.js*, liste les articles d'une ou toutes les catégories
- search.js, affiche la recherche Algolia.
- */components/*, dans ce répertoire se trouvent tous les composants que l'on retrouve dans plusieurs types de pages différentes (la barre de navigation, le logo, le layout , disqus, etc. ).

### Graphql

```export const pageQuery = graphql`
  query PageByPath($postPath: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(frontmatter: { path: { eq: $postPath } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        path
        title
      }
    }
  }
`
```

The underlying query name BlogPostByPath (note: these query names need to be unique!) will be injected with the current path, e.g. the specific blog post we are viewing. This path will be available as $path in our query. For instance, if we were viewing our previously created blog post, the path of the file that data will be pulled from will be /hello-world.

markdownRemark will be the injected property available via the prop data, as named in the GraphQL query. Each property we pull via the GraphQL query will be available under this markdownRemark property. For example, to access the transformed HTML we would access the data prop via data.markdownRemark.html.

frontmatter, is of course our data structure we provided at the beginning of our Markdown file. Each key we define there will be available to be injected into the query.

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
Basé sur le pattern ```maybe``` , il permet de gérer le fait que dans certains cas des fonctions comme ```window``` renvoient des vrais données (dans le cadre d'une execution dans un browser) et retourne rien (dans le cadre du server side rendering).

### APIs Gatsby


## Export vers algolia
plugin https://github.com/algolia/gatsby-plugin-algolia
Publie lors du build les articles sur Algolia en s'appuyant sur les données exportées via le graphql de Gatsby.

Dans le fichier `gatsby-config`, il faut définir une requete qui va retourner tous les 'nodes' (les posts/pages sont des nodes).
Tout d'abord on va définir la query qui sera appelée pour chaque article.
Elle définit les éléments qui seront récupérés et utilisés dans l'export.

```//query utilisée pour remonter les infos à Algolia
const query = `{
 allMarkdownRemark {
   edges {
     node {
      objectID: id
      html
      frontmatter {
            path
            category
            title
          }
      image: frontmatter { blogImage}
      fields {
        relativePath
        defaultCategory
        slug
        type
      }
     }
   }
 }
}`;
```
Ensuite `queries` définit toutes les requêtes à appeler par le plugin algolia.

```
const queries = [
  {
    query,
    transformer: ({ data }) => data.allMarkdownRemark.edges.map(({ node }) => node), // optional
    indexName: 'wulfy_blog', // overrides main index name, optional
  },
];
```

Ainsi, pour chaque `node`, la requete `query` sera executée et les données envoyées comme nouveau "noeud" sur l'index `wulfy_blog` d'Algolia.

La déclaration du module Algolia se fait plus bas en fin de fichier:

```
module.exports = {
  siteMetadata: {
    title: "Wulfy's blog",
  },
...
    {
      resolve: `gatsby-plugin-algolia`,
      options: {
        appId: ALGOLIA_API_ID,
        apiKey: ALGOLIA_API_KEY,
        indexName: ALGOLIA_INDEX_NAME, // for all queries
        queries,
        chunkSize: 10000, // default: 1000
      },
    },
  ],
}

```

## commentaires disqus
Component : src/components/disqus.js
Script chargé via un loader (cf dans common scriptLoader).
Le loader utiliser un encodage base64 du script pour générer un ID unique permettant de ne pas charger en double un script JS
Le script loader s'appuie sur les event "load" (L’évènement load est émis lorsqu’une ressource et ses ressources dépendantes sont completement chargées) et "error" pour appeler un callback (s'il est définit).

