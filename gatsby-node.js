/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const _ = require("lodash");

const { createFilePath } = require(`gatsby-source-filesystem`)
const path = require('path')
const fs = require('fs')
const categoryTemplate = path.resolve(`src/pages/category.js`);

const getComponent = type =>
  fs.existsSync(path.resolve(`src/templates/${type}.js`))
    ? path.resolve(`src/templates/${type}.js`)
    : path.resolve(`src/templates/page.js`)

//When you implement a Gatsby API, you're passed a collection of "Bound Action Creators" 
// (functions which create and dispatch Redux actions when called) which you can use to manipulate state on your site.
//The object boundActionCreators contains the functions and these can be individually extracted by using ES6 object destructuring.
//Permet de générer les données "slug" et "type" utilisées dans les autres appels graphql comme create page
exports.onCreateNode = ({ node, getNode, boundActionCreators }) => {
  const { createNodeField } = boundActionCreators

  //on vérifie que l'action est bien de type "mardown"
  if (node.internal.type === `MarkdownRemark`) {
    const fileNode = getNode(node.parent)
    //const slug = /pages/.test(fileNode.relativePath) ? createFilePath({ node, getNode, basePath: `pages` }) : createFilePath({ node, getNode, basePath: `posts` })
    let type = ''
    const slug = fileNode.relativePath
    if (fileNode.relativePath.indexOf('/') >= 0) {
      type = fileNode.relativePath.split('/')[0]
    }

    createNodeField({
      node,
      name: `slug`,
      value: `${slug}`,
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
exports.createPages = ({ boundActionCreators, graphql }) => {
  const { createPage } = boundActionCreators
  console.log('bad resolve:')
  console.log(path.resolve(`src/templates/ytyty.js`))

  return graphql(`
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
              slug
              type
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
      return Promise.reject(result.errors)
    }

    result.data.allMarkdownRemark.edges.forEach(({ node }) => {
      console.log(node);
      const category = node.frontmatter.category;
      category ? createPage({
        path: `/category/${_.kebabCase(category)}/`,
        component: categoryTemplate,
        context: {
          category
        }, // additional data can be passed via context
      }) : null;
      createPage({
        path: node.frontmatter.path,
        component: getComponent(node.fields.type),
        context: {}, // additional data can be passed via context
      });
    })
  })
}
