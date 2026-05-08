import React from 'react'
import { Link, graphql } from 'gatsby'
import _ from 'lodash'

import { getCatImage } from '../common/utils'
import Layout from '../components/layout'

const Category = props => {
  const { edges: posts } = props.data.allMarkdownRemark
  const {
    pageContext: { category },
  } = props

    const isProduction = process.env.NODE_ENV === 'production'
    const visiblePosts = isProduction
      ? posts.filter(({ node }) => node.frontmatter.published !== false)
      : posts

    let postsList = []
    const postByCats = _.groupBy(visiblePosts, ({node}) => node.fields.defaultCategory ? node.fields.defaultCategory : node.frontmatter.category);
    _.forEach(postByCats, (posts, currentCategory) => {
      if(category && category !== currentCategory)
      {
        return;
      }
      const postsListItems = posts.reduce((acc, { node: { frontmatter, fields } }) => {
        const isDraft = frontmatter.published === false
        acc.push(
          <li key={frontmatter.title}>
            <Link to={`${fields.slug}`}>{frontmatter.title}</Link>
            {isDraft && <i className="fas fa-times" style={{ color: 'red', marginLeft: '8px' }} title="Not published" />}
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
    const CategoryImage = props => category ? <img {...props} alt={category} src={getCatImage(category)} /> : null ;
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
}

// eslint-disable-next-line no-undef
export const categoryQuery = graphql`
  query postsByCategory {
    allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
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
            published
          }
        }
      }
    }
  }
`

export default Category
