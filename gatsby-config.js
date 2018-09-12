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

//transformer pour mapper les données dans algolia
const queries = [
  {
    query,
    transformer: ({ data }) => data.allMarkdownRemark.edges.map(({ node }) => node), // optional
    indexName: 'wulfy_blog', // overrides main index name, optional
  },
];


module.exports = {
  siteMetadata: {
    title: 'Gatsby Default Starter',
  },
  plugins: [
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
