import React from 'react'
import Link from 'gatsby-link'
import _ from 'lodash'

const Category = props => {
  const { edges: posts } = props.data.allMarkdownRemark
  const {
    pathContext: { category },
  } = props
  const currentCat = category ? category : 'All cats'
  console.log(posts)
  const postsList = category
    ? _.filter(posts, post => post.node.frontmatter.category === category)
    : posts
  const postsListItems = postsList.map((post, index) => (
    <li key={index}>
      <Link to={post.node.frontmatter.path}>
        {' '}
        {post.node.frontmatter.category} - {post.node.frontmatter.title}
      </Link>
    </li>
  ))
  return (
    <div>
      <h1>{currentCat}</h1>
      <p>Posts:</p>
      <ul>{postsListItems}</ul>
    </div>
  )
}

// eslint-disable-next-line no-undef
export const categoryQuery = graphql`
  query PostsByCategory {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      limit: 1000
    ) {
      edges {
        node {
          id
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
            title
          }
        }
      }
    }
  }
`

export default Category
