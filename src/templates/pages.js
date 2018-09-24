import React from 'react'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby';

import Layout from '../components/layout'
// import '../css/blog-post.css';

export default function Template({ data, location }) {
  const { markdownRemark: post } = data
  return (
    <Layout location={location}>
        <div className="blog-page-container">
          <Helmet title={`${data.site.siteMetadata.title} - ${post.frontmatter.title}`} />
          <div className="blog-post">
            <h1>{post.frontmatter.title}</h1>
            <div
              className="blog-post-content"
              dangerouslySetInnerHTML={{ __html: post.html }}
            />
          </div>
        </div>
    </Layout>
  )
}

export const pageQuery = graphql`
  query PageByPath($postPath: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(frontmatter: { path: { eq: $postPath } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        path
        title
      }
    }
  }
`
