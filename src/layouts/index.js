import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { connect } from "react-redux"

import './index.css'
import Header from '../components/header'

const mapDispatchToProps = dispatch => {
  return { scroll: value => dispatch({ type: `SCROLL`, value: value }) }
}

class Layout extends React.Component {

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
    this.initialScrollHeight = document.documentElement.scrollHeight
    hljs.initHighlightingOnLoad();
    console.log('did mount root')
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll = e => {
    const {scroll} = this.props;
    const supportPageOffset = window.pageXOffset !== undefined
    const isCSS1Compat = (document.compatMode || '') === 'CSS1Compat'
    const scrollValue = supportPageOffset
      ? window.pageYOffset
      : isCSS1Compat
        ? document.documentElement.scrollTop
        : document.body.scrollTop
    console.log("scrolling");
    e.preventDefault();
    scroll(scrollValue);
  }

  render() {
    const { children, data, location, pathContext } = this.props;
    console.log(location);
    const classStyle = location.pathname === '/' ? "" : "pageContainer";
    console.log("reder layout");
    return <div>
      <Helmet
        title={data.site.siteMetadata.title}
        meta={[
          { name: 'description', content: 'Sample' },
          { name: 'keywords', content: 'sample, something' },
        ]}
      />
       <Header path={location.pathname} title={data.site.siteMetadata.title} />
      <div className={classStyle}>{children()}</div>
    </div>
  }
}

Layout.propTypes = {
  children: PropTypes.func,
}

export default connect(null, mapDispatchToProps)(Layout);

export const query = graphql`
  query SiteTitleQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`
