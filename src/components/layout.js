import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { connect } from "react-redux"
import { useStaticQuery, graphql } from 'gatsby';
import icon32 from '../../static/little_ninja_blanc_fav.png'
import Header from '../components/header'

const mapDispatchToProps = dispatch => {
  return { scroll: value => dispatch({ type: `SCROLL`, value: value }) }
}

/* eslint-disable no-undef */
class Layout extends React.Component {

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
    this.initialScrollHeight = document.documentElement.scrollHeight
    const codeBlocks = document.getElementsByTagName("CODE");
    if(codeBlocks.length <= 0) return;

     for (let htmlBlock of codeBlocks){
      hljs.highlightBlock(htmlBlock);
    };
    console.log('did mount root')
    console.log(hljs)
  }

  componentDidUpdate() {
    //render code hightlight if page is displayed during routing (component already created)
    const codeBlocks = document.getElementsByTagName("CODE");
    if(codeBlocks.length <= 0) return;

     for (let htmlBlock of codeBlocks){
      hljs.highlightBlock(htmlBlock);
    };
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
    //console.log("scrolling");
    e.preventDefault();
    scroll(scrollValue);
  }

  render() {
    const { children, location, siteTitle } = this.props;
    console.log(location);
    const classStyle = location.pathname === '/' ? "" : "pageContainer";
    console.log("render layout");
    return( 
        <div>
            <Helmet
              title={siteTitle}
              meta={[
                { name: 'description', content: 'Wulfy s  tech blog' },
                { name: 'keywords', content: 'tech,developer,devops,blog' },
              ]}
              link={[
                        { rel: 'shortcut icon', type: 'image/png', href: `${icon32}` }
                    ]}
            />
             <Header path={location.pathname} title={siteTitle} />
            <div className={classStyle}>{children}</div>
        </div>
    )
  }
}

Layout.propTypes = {
  children: PropTypes.object,
}

// Wrapper component to use the hook and pass data as props
const LayoutWithQuery = (props) => {
  const data = useStaticQuery(graphql`
    query LayoutQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);
  
  return <Layout {...props} siteTitle={data.site.siteMetadata.title} />;
};

export default connect(null, mapDispatchToProps)(LayoutWithQuery);
