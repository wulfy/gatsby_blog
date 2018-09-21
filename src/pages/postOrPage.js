import React from 'react'
import { Link, graphql } from 'gatsby'
import _ from 'lodash'

import { getCatImage } from '../common/utils'

const PostOrPage = props => {
  const posts = props.data ? props.data.results.edges : [];
  const {
    pathContext: { category },
  } = props
  const currentCat = category ? category : 'All cats';

  let catList = []
    let postsList = []
    console.log(posts);
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
export const postOrPageQuery = graphql`
  query ($type : String = "posts") {
    results: allMarkdownRemark(
      filter: { fields : {type: { eq: $type }}}
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

export default PostOrPage
