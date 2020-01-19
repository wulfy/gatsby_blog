/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const ALGOLIA_API_ID = process.env.ALGOLIA_API_ID;
const ALGOLIA_API_KEY = process.env.ALGOLIA_API_KEY;
const ALGOLIA_INDEX_NAME = process.env.ALGOLIA_INDEX_NAME;

const _ = require('lodash')

const { createFilePath } = require(`gatsby-source-filesystem`)
const path = require('path')
const fs = require('fs')
const categoryTemplate = path.resolve(`src/pages/category.js`)
const postOrPageTemplate = path.resolve(`src/pages/postOrPage.js`)

const getComponent = type =>
  fs.existsSync(path.resolve(`src/templates/${type}.js`))
    ? path.resolve(`src/templates/${type}.js`)
    : path.resolve(`src/templates/pages.js`)


const algoliasearch = require('algoliasearch');
const client = algoliasearch(ALGOLIA_API_ID, ALGOLIA_API_KEY);
const index = client.initIndex(ALGOLIA_INDEX_NAME);

//When you implement a Gatsby API, you're passed a collection of "Bound Action Creators"
// (functions which create and dispatch Redux actions when called) which you can use to manipulate state on your site.
//The object actions contains the functions and these can be individually extracted by using ES6 object destructuring.
//Permet de générer les données "slug" et "type" utilisées dans les autres appels graphql comme create page
exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions

  //on vérifie que l'action est bien de type "mardown"
  if (node.internal.type === `MarkdownRemark`) {

    const fileNode = getNode(node.parent)
    //const slug = /pages/.test(fileNode.relativePath) ? createFilePath({ node, getNode, basePath: `pages` }) : createFilePath({ node, getNode, basePath: `posts` })
    const relativePath = fileNode.relativePath
    const filePathData = fileNode.relativePath.split('/')
    const type = filePathData.length >= 1 ? filePathData[0] : '';
    const defaultCategory = filePathData.length > 2 ? filePathData[1] : '';
    const slug = `/${type}${node.frontmatter.path}`;

    createNodeField({
      node,
      name: `relativePath`,
      value: relativePath,
    })
    createNodeField({
      node,
      name: `defaultCategory`,
      value: defaultCategory,
    })
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })
    createNodeField({
      node,
      name: `type`,
      value: type,
    })
  }
}

//gère le choix du template selon le répertoire où se trouve le fichier désiré
//est appelé lors de la phase du build pour créer les slugs
//We’re using GraphQL to get all Markdown nodes and making them available under the allMarkdownRemark
//One note here is that the exports.createPages API expects a Promise to be returned,
//so it works seamlessly with the graphql function, which returns a Promise
exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions

  return new Promise((resolve, reject) => {
      resolve(
        graphql(`
        {
          allMarkdownRemark(
            sort: { order: DESC, fields: [frontmatter___date] }
            limit: 1000
          ) {
            edges {
              node {
                id
                html
                headings {
                  depth
                  value
                }
                fields {
                  relativePath
                  type
                  slug
                  defaultCategory
                }
                frontmatter {
                  path
                  category
                }
              }
            }
          }
        }
      `).then(result => {
        if (result.errors) {
          reject(result.errors)
        }

        result.data.allMarkdownRemark.edges.forEach(({ node }) => {
          const category = node.fields.defaultCategory ? node.fields.defaultCategory : node.frontmatter.category;
          const type = node.fields.type ;
          createPage({
                path: `/${type}`,
                component: postOrPageTemplate,
                context: {
                  type,
                }, // additional data can be passed via context
              })
          category
            ? createPage({
                path: `/category/${category}/`,
                component: categoryTemplate,
                context: {
                  category,
                }, // additional data can be passed via context
              })
            : null
          createPage({
            path: `${node.fields.slug}`,
            component: getComponent(type),
            context: {
              postPath: node.frontmatter.path,
            }, // additional data can be passed via context
          })
        })

      })// end then
    )// end resolve
  })//end promise
}

//empty algolia search to prevent double posts declaration
exports.onPreBuild = () => {
  index
  .clearIndex();
}
