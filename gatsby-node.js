/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const { createFilePath } = require(`gatsby-source-filesystem`)
const path = require('path')
const fs = require('fs')

const getComponent = type =>
  fs.existsSync(path.resolve(`src/templates/${type}.js`))
    ? path.resolve(`src/templates/${type}.js`)
    : path.resolve(`src/templates/page.js`)

exports.onCreateNode = ({ node, getNode, boundActionCreators }) => {
  const { createNodeField } = boundActionCreators
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

exports.createPages = ({ boundActionCreators, graphql }) => {
  const { createPage } = boundActionCreators
  console.log('bad resolve:')
  console.log(path.resolve(`src/templates/ytyty.js`))
  const postTemplate = path.resolve(`src/templates/post.js`)
  const pageTemplate = path.resolve(`src/templates/page.js`)

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
      console.log(node)
      createPage({
        path: node.frontmatter.path,
        component: getComponent(node.fields.type),
        context: {}, // additional data can be passed via context
      })
    })
  })
}
