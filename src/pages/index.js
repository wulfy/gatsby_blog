import React from 'react'
import Link from 'gatsby-link'
import {CAT_IMG, DEFAULT_IMG, HOME_IMG} from '../common/constant'
import _ from 'lodash'
import Menu from '../components/menu'
import BlogTitle from '../components/blogTitle'
import Me from '../components/me'
import {scrollIt} from '../common/utils'

function* entries(obj) {
   for (let key of Object.keys(obj)) {
     yield [key, obj[key]];
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

const getCatImage = (category) =>  CAT_IMG[category] ? CAT_IMG[category] : DEFAULT_IMG;
const Container = (props) => <div {...props} style={{overflow:"hidden"}}/>;
const SemiContainer = (props)=><div {...props} style={{width:'50%', height:'100%', float: 'left', overflow: 'hidden',...props.style}}/>;
const ImagedContainer = (props)=> {
	const backgroundStyle = {backgroundImage:`url(${HOME_IMG})`};
	const positionStyle = props.position && "left" === props.position ? {backgroundSize: "200% 100%", backgroundPosition: "0% 50%"} : {backgroundSize: "200% 100%", backgroundPosition: "100% 50%"};
	const sizeStyle = {width: '100%',height: '100vh'};
	return(
		<div style={{...backgroundStyle,...positionStyle,...sizeStyle}} />
	)
};

const gotoPage= (element) => {
	console.log(element);
	console.log("clicked");
	return false;
	//console.log(document.querySelector(pageId));
	//element ? scrollIt(element,300,'easeOutQuad') : null;
};

class IndexPage extends React.Component {

  constructor(props) {
    super(props);
  	const { edges: posts } = this.props.data.allMarkdownRemark;

  	/* data compute here because there is no need to build it each rendering
  	didMount can't do it because it is fired AFTER rendering and it
  	calculate the total height (so it needs to have all elements already rendered  ) */

  	let catList = [];
  	let postsList = [];
  	const postByCats = _.groupBy(posts, "node.frontmatter.category");
  	const categories = [];
	_.forEach(postByCats,(posts,category) => {
		categories.push(category);
		const categoryImage = getCatImage(category);
		const postsListItems = posts.reduce((acc, {node:{frontmatter}}) => {
			acc.push(<li key={frontmatter.title}><Link to={frontmatter.path}>{frontmatter.title}</Link></li>);
			return acc;
		},[]);
		catList.push(<div key={category} id={category} className="arrow"><img src={categoryImage} /></div>); 
		postsList.push(<div key={`${category}-items`} className="arrow"><ul className="itemList">{postsListItems}</ul></div>);
	});
	postsList = postsList.reverse();

    this.state = {css: {}, screen: { width: window.innerWidth, height: window.innerHeight }, categories, postsList, catList};
    this.initialScrollHeight = 0;
    this.titleAnimationEnabled = true;
    this.rightContainer = null;
  }

  componentDidMount() {
	window.addEventListener('scroll', this.handleReverseScroll);
    this.initialScrollHeight = document.documentElement.scrollHeight;
    console.log("did mount");
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleReverseScroll);
  }

  handleScroll = (e) => {
  	const targetSection = e.target.dataset.section;
  	const element = document.querySelector(`#${targetSection}`);
  	e.preventDefault();
  	console.log(e.target);
	element ? scrollIt(element,300,'easeOutQuad') : null;
  }

  handleReverseScroll = (e) => {
  	const supportPageOffset = window.pageXOffset !== undefined;
    const isCSS1Compat = ((document.compatMode || '') === 'CSS1Compat');
    const scrollValue = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;
  	const newCss = {css: {transform: `translate(0px, ${scrollValue*2}px)`}};
  	
  	if(scrollValue <= this.initialScrollHeight)
  	{
  		this.titleAnimationEnabled = false;
  		this.setState(newCss);
  	}else 
  	{
  		console.log("stop scrolling");
  		e.preventDefault();
  		return false;
  	}
	//$('.right').css('transform', 'translate3d(0,' + scrollValue*2 + 'px, 0)');
  }

  render() {
  	console.log("render");
  		const {categories,catList,postsList} = this.state;
  	  	const nbSlide = catList ? catList.length : 0;
  	  	console.log("nb slide");
  	  	console.log(nbSlide);
  	 	const RightContainer = (props)=><SemiContainer {...props} style={{marginTop:'-'+(nbSlide+1)*100+'vh', ...props.style}}/>;
	 
  	  	return (
		  <Container>
		  	<Menu categories={categories} goto={this.handleScroll} />
		  	<Me/>
		  	<BlogTitle titleAnimationEnabled={this.titleAnimationEnabled} />
		  	<SemiContainer>
			   <ImagedContainer className="arrow" position="left"/>
			  <div className="arrow">
			  	<img src="https://www.djerfy.com/wp-content/uploads/2016/05/docker-large-h-trans.png"/>
			  </div>
			   {catList}
			</SemiContainer>
			<RightContainer style={this.state.css}>
			   {postsList}
			   <div className="arrow">
			   		<ul className="itemList">
			   			<li>Ceci est un post avec un long titre</li>
			   			<li> Article 2</li>
			   			<li> Article 1</li>
			   			<li> Article 2</li>
			   			<li> Et pourquoi pas?</li>
			   			<li> Une fois oui</li>
			   			<li> Article 1</li>
			   			<li> Comment j'ai créé l'agilité 2.0</li>
			   		</ul>
			   </div>
			   <ImagedContainer className="arrow" position="right"/>
			</RightContainer>
		</Container>
		);
  }
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
`;

export default IndexPage
