require('dotenv').config();

const ALGOLIA_API_ID = process.env.ALGOLIA_API_ID;
const ALGOLIA_API_KEY = process.env.ALGOLIA_API_KEY;
const ALGOLIA_INDEX_NAME = process.env.ALGOLIA_INDEX_NAME;

const oldquery = `{
  allSitePage {
    edges {
      node {
        objectID: id
        component
        path
        componentChunkName
        jsonName
        defaultCategory
        title
        internal {
          type
          contentDigest
          owner
        }
      }
    }
  }
}`;

//query utilisée pour remonter les infos à Algolia
//`internal.contentDigest` est requis : gatsby-plugin-algolia s'en sert
//comme marker "ce record est géré par moi", et n'efface pas les records
//qui ne l'ont pas. Sans ce champ, les posts retirés de la query restent
//en stale dans l'index.
const query = `{
 allMarkdownRemark {
   edges {
     node {
      objectID: id
      html
      internal {
        contentDigest
      }
      frontmatter {
            path
            category
            title
            published
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

//transformer pour mapper les données dans algolia
//Les posts marqués `published: false` ne doivent jamais finir dans l'index (sinon recherche → 404).
const queries = [
  {
    query,
    transformer: ({ data }) =>
      data.allMarkdownRemark.edges
        .map(({ node }) => node)
        .filter(node => node.frontmatter.published !== false),
    indexName: 'wulfy_blog', // overrides main index name, optional
  },
];

// Base plugins that should always be included
const plugins = [
  'gatsby-plugin-react-helmet',
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      name: `src`,
      path: `${__dirname}/src/`,
    },
  },
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      path: `${__dirname}/content/`,
      name: 'pageAndposts',
    },
  },
  {
    resolve: 'gatsby-transformer-remark',
    options: {
      plugins: [], // just in case those previously mentioned remark plugins sound cool :)
    },
  },
];

// Only add Algolia plugin if credentials are provided
if (ALGOLIA_API_ID && ALGOLIA_API_KEY && ALGOLIA_INDEX_NAME) {
  plugins.push({
    resolve: `gatsby-plugin-algolia`,
    options: {
      appId: ALGOLIA_API_ID,
      apiKey: ALGOLIA_API_KEY,
      indexName: ALGOLIA_INDEX_NAME, // for all queries
      queries,
      chunkSize: 10000, // default: 1000
    },
  });
}

module.exports = {
  siteMetadata: {
    title: "Wulfy's blog",
  },
  plugins,
}
