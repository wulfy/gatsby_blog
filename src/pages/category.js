import React from 'react'
import Link from 'gatsby-link'
import _ from 'lodash'

import { getCatImage } from '../common/utils'

const Category = props => {
  const { edges: posts } = props.data.allMarkdownRemark
  const {
    pathContext: { category },
  } = props
  const currentCat = category ? category : 'All cats';

  let catList = []
    let postsList = []
    const postByCats = _.groupBy(posts, ({node}) => node.fields.defaultCategory ? node.fields.defaultCategory : node.frontmatter.category);
    const categories = []
    _.forEach(postByCats, (posts, currentCategory) => {
      if(category && category != currentCategory)
      {
        return;
      }
      const postsListItems = posts.reduce((acc, { node: { frontmatter, fields } }) => {
        acc.push(
          <li key={frontmatter.title}>
            <Link to={`${fields.slug}`}>{frontmatter.title}</Link>
          </li>
        )
        return acc
      }, [])
      postsList.push(
        <div key={`${currentCategory}-items`} className="categoryItems">
          <figure>
            <figcaption><Link to={`/category/${currentCategory}`}><i className="fas fa-tags"/> {currentCategory} </Link></figcaption>
              <ul className="itemList">
                {postsListItems}
              </ul>
          </figure>
        </div>
      )
    })
    const CategoryImage = props => category ? <img {...props} src={getCatImage(category)} /> : null ;

  return (
    <div className="categoryList blog-post-container">
        <CategoryImage className="categoryImage"/>
        {postsList}
    </div>
  )
}

// eslint-disable-next-line no-undef
export const categoryQuery = graphql`
  query postsByCategory {
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
            defaultCategory
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
