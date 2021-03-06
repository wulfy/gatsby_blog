import React from 'react'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'

import {
  DEFAULT_POST_IMG,
} from '../common/constant'
import Layout from '../components/layout'
import Disqus from '../components/disqus'

//https://www.gatsbyjs.org/tutorial/part-seven/#creating-slugs-for-pages
export default ({ data,pathContext,location }) => {
  const { markdownRemark: post } = data
  const postImg = post.frontmatter.blogImage ? post.frontmatter.blogImage : DEFAULT_POST_IMG;
  const style = {
    background:`url("${postImg}")`,
    backgroundPosition: "center",
    backgroundSize: "cover",
  }
  console.log("re render posts");
  return (
    <Layout location={location}>
        <div className="blog-post-container">
          <Helmet title={`${data.site.siteMetadata.title} - ${post.frontmatter.title}`} />
          <div className="blog-post">
            <div className="postImage" style={style} />
            <div className="post_metas">
              <h1 className="post_title meta">{post.frontmatter.title}</h1>
              <i className="post_date meta"> <i className="fas fa-calendar-alt"></i>  {post.frontmatter.date}</i>
            </div>
            <div
              className="blog-post-content"
              dangerouslySetInnerHTML={{ __html: post.html }}
            />
          </div>
          <Disqus page_url={post.frontmatter.path} page_identifier={post.id} />
        </div>
    </Layout>
  )
}

//j'utilise postPath pour filtrer par path car
//dans gatbsy node le "path" des pages crées est custom
// il correspond à style/path , du coup il ne faut pas filtrer par ce path
// postPath est un paramètre fourni par le context de createpage dans gatsby-node
export const pageQuery = graphql`
  query postByPath($postPath: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(frontmatter: { path: { eq: $postPath } }) {
      html
      id
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        path
        title
        blogImage
      }
    }
  }
`
