import React from 'react'
import Link from 'gatsby-link'
import { connect } from "react-redux"

import {
  HOME_IMG,
  SCROLL_SECTION_DELAY,
} from '../common/constant'
import _ from 'lodash'
import Menu from '../components/menu'
import BlogTitle from '../components/blogTitle'
import Me from '../components/me'
import { scrollIt, getCatImage } from '../common/utils'

function* entries(obj) {
  for (let key of Object.keys(obj)) {
    yield [key, obj[key]]
  }
}

const IndexPage2 = () => (
  <div>
    <h1>Hi people</h1>
    <p>Welcome to your new Gatsby site.</p>
    <p>Now go build something great.</p>
    <Link to="/page-2/">Go to page 2</Link>
  </div>
)

const Container = props => <div {...props} style={{ overflow: 'hidden' }} />
const SemiContainer = props => (
  <div
    {...props}
    style={{
      width: '50%',
      height: '100%',
      float: 'left',
      overflow: 'hidden',
      ...props.style,
    }}
  />
)
const ImagedContainer = props => {
  const backgroundStyle = { backgroundImage: `url(${HOME_IMG})` }
  const positionStyle =
    props.position && 'left' === props.position
      ? { backgroundSize: '200% 100%', backgroundPosition: '0% 50%' }
      : { backgroundSize: '200% 100%', backgroundPosition: '100% 50%' }
  const sizeStyle = { width: '100%', height: '100vh' }
  return <div style={{ ...backgroundStyle, ...positionStyle, ...sizeStyle }} />
}

class IndexPage extends React.Component {
  constructor(props) {
    super(props)
    const { edges: posts } = this.props.data.allMarkdownRemark

    /* data compute here because there is no need to build it each rendering
  	didMount can't do it because it is fired AFTER rendering and it
  	calculate the total height (so it needs to have all elements already rendered  ) */

    let catList = []
    let postsList = []
    const postByCats = _.groupBy(posts, 'node.frontmatter.category')
    const categories = []
    _.forEach(postByCats, (posts, category) => {
      categories.push(category)
      const categoryImage = getCatImage(category)
      const postsListItems = posts.reduce((acc, { node: { frontmatter, fields } }) => {
        acc.push(
          <li key={frontmatter.title}>
            <Link to={`${fields.slug}`}>{frontmatter.title}</Link>
          </li>
        )
        return acc
      }, [])
      catList.push(
        <div key={category} id={category} className="arrow">
          <img src={categoryImage} />
        </div>
      )
      postsList.push(
        <div key={`${category}-items`} className="arrow">
         <figure>
            <figcaption></figcaption>
              <ul className="itemList">
                {postsListItems}
                <li><Link to={`/category/${category}`}>Voir tout <i className="fas fa-ellipsis-h"></i></Link></li>
              </ul>
         </figure>
        </div>
      )
    })
    postsList = postsList.reverse()

    this.state = {
      css: {},
      screen: { width: window.innerWidth, height: window.innerHeight },
      selected: '',
      hideHeader:false,
      categories,
      postsList,
      catList,
    }
    this.initialScrollHeight = 0
    this.titleAnimationEnabled = true
    this.rightContainer = null
    this.position = 0
  }

  componentDidMount() {
    this.initialScrollHeight = document.documentElement.scrollHeight
    console.log('did mount')
  }
/*
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleReverseScroll)
  }*/

  handleScrollToSection = e => {
    const targetSection = e.target.dataset.section
    const element = document.querySelector(`#${targetSection}`)
    e.preventDefault()
    element ? scrollIt(element, SCROLL_SECTION_DELAY, 'easeInOutQuint') : null
  }

  handleReverseScroll = e => {
    const { categories } = this.state
    const {scrollValue} = this.props;

    const newCss = {
      css: { transform: `translate(0px, ${scrollValue * 2}px)` },
    }
    // -1 car on ne compte pas la home (si l'icon est ajoutée il faudra enlever -1)
    const currentPosition = document.documentElement.clientHeight
      ? Math.round(scrollValue / document.documentElement.clientHeight) - 1
      : 0

    if (scrollValue <= this.initialScrollHeight) {
      const hideHeader = scrollValue > this.previousScrollValue;
      this.previousScrollValue = scrollValue;
      this.titleAnimationEnabled = false
      this.setState(newCss)
    } else {
      console.log('stop scrolling')
      e.preventDefault()
      return false
    }

    if (this.position != currentPosition) {
      const category = categories[currentPosition];
      
      console.log('SELECTED ' + currentPosition + ' ' + category)
      this.setState({ ...this.state, selected: category })
      //this.position = currentPosition
    }

    //$('.right').css('transform', 'translate3d(0,' + scrollValue*2 + 'px, 0)');
  }

  render() {
    console.log('render');
    const {scrollValue} = this.props;
    const { categories, catList, postsList, selected } = this.state
    const nbSlide = catList ? catList.length : 0
    const currentPosition = document.documentElement.clientHeight
      ? Math.round(scrollValue / document.documentElement.clientHeight) - 1
      : 0
    const RightContainer = props => (
      <SemiContainer
        {...props}
        style={{ marginTop: '-' + nbSlide * 100 + 'vh', ...props.style }}
      />
    );
    let newCss = {}
    let selectedCategory = "";
    if (scrollValue < this.initialScrollHeight) {
      this.previousScrollValue = scrollValue;
      this.titleAnimationEnabled = false
      newCss = {
        css: { transform: `translate(0px, ${scrollValue * 2}px)` },
      }
    }
    selectedCategory = categories[currentPosition];
    return (
      <Container id="home">
        <Menu
          categories={categories}
          handleScrollToSection={this.handleScrollToSection}
          selected={selectedCategory}
        />
        <Me className="me" />
        <BlogTitle titleAnimationEnabled={this.titleAnimationEnabled} />
        <SemiContainer>
          <ImagedContainer className="arrow" position="left" />
          {catList}
        </SemiContainer>
        <RightContainer style={newCss.css}>
          {postsList}
          <ImagedContainer className="arrow" position="right" />
        </RightContainer>
      </Container>
    )
  }
}

const mapStateToProps = state => {
  return {
    scrollValue: state.globalReducer.scrollValue,
  };
}

// eslint-disable-next-line no-undef
export const categoryQuery = graphql`
  query PostsByCategories {
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
export default connect(mapStateToProps, null)(IndexPage);
