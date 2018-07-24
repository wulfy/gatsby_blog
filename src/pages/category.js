import React from 'react'
import Link from 'gatsby-link'
import _ from 'lodash'

const Category = props => {
  const { edges: posts } = props.data.allMarkdownRemark
  const {
    pathContext: { category },
  } = props
  const currentCat = category ? category : 'All cats';

  let catList = []
    let postsList = []
    const postByCats = _.groupBy(posts, 'node.frontmatter.category');
    const categories = []
    _.forEach(postByCats, (posts, currentCategory) => {
      if(category && category != currentCategory)
      {
        return;
      }
      const postsListItems = posts.reduce((acc, { node: { frontmatter } }) => {
        acc.push(
          <li key={frontmatter.title}>
            <Link to={frontmatter.path}>{frontmatter.title}</Link>
          </li>
        )
        return acc
      }, [])
      postsList.push(
        <div key={`${currentCategory}-items`} className="categoryItems">
          <figure>
            <figcaption><i className="fas fa-tags"/> {currentCategory} </figcaption>
              <ul className="itemList">
                {postsListItems}
              </ul>
          </figure>
        </div>
      )
    })

  return (
    <div className="categoryList blog-post-container">
        {postsList}
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
