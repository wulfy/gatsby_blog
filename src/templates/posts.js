import React from 'react'
import Helmet from 'react-helmet'

// import '../css/blog-post.css';

export default function Template({ data }) {
  const { markdownRemark: post } = data
  return (
    <div className="blog-post-container">
      <Helmet title={`Your Blog Name - ${post.frontmatter.title}`} />
      <div className="blog-post">
        <img src={post.frontmatter.blogImage} />
        <div className="post_metas">
          <h1 className="post_title meta">{post.frontmatter.title}</h1>
          <i className="post_date meta"> <i className="fas fa-calendar-alt"></i>  {post.frontmatter.date}</i>
        </div>
        <div
          className="blog-post-content"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </div>
    </div>
  )
}

export const pageQuery = graphql`
  query postByPath($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        path
        title
        blogImage
      }
    }
  }
`
