import React from 'react'
import Link from 'gatsby-link'
import {CAT_IMG, DEFAULT_IMG, HOME_IMG} from '../common/constant'
import _ from 'lodash'
import Menu from '../components/menu'
import BlogTitle from '../components/blogTitle'

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

class IndexPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {css: {}, screen: { width: window.innerWidth, height: window.innerHeight }};
    this.initialScrollHeight = 0;
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    this.initialScrollHeight = document.documentElement.scrollHeight;
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = (e) => {
  	const supportPageOffset = window.pageXOffset !== undefined;
    const isCSS1Compat = ((document.compatMode || '') === 'CSS1Compat');
    const scrollValue = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;
  	const newCss = {css: {transform: `translate(0px, ${scrollValue*2}px)`}};

  	if(scrollValue <= this.initialScrollHeight)
  	{
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
  	  	const { edges: posts } = this.props.data.allMarkdownRemark;
  	  	let catList = [];
  	  	let postsList = [];
  	  	const categories = [];
  	  	const SemiContainer = (props)=><div {...props} style={{width:'50%', height:'100%', float: 'left', overflow: 'hidden',...props.style}}/>;
		const ImagedContainer = (props)=> {
			const backgroundStyle = {backgroundImage:`url(${HOME_IMG})`};
			const positionStyle = props.position && "left" === props.position ? {backgroundSize: "200% 100%", backgroundPosition: "0% 50%"} : {backgroundSize: "200% 100%", backgroundPosition: "100% 50%"};
			const sizeStyle = {width: '100%',height: '100vh'};
			return(
				<div style={{...backgroundStyle,...positionStyle,...sizeStyle}} />
			)
		};
		const Container = (props) => <div style={{overflow:"hidden"}}> {props.children} </div>;
  	  	const postByCats = _.groupBy(posts, "node.frontmatter.category");

		_.forEach(postByCats,(posts,category) => {
			categories.push(category);
			const categoryImage = getCatImage(category);
			const postsListItems = posts.reduce((acc, {node:{frontmatter}}) => {
				acc.push(<li key={frontmatter.title}><Link to={frontmatter.path}>{frontmatter.title}</Link></li>);
				return acc;
			},[]);
			catList.push(<div key={category} className="arrow"><img src={categoryImage} /></div>); 
			postsList.push(<div key={`${category}-items`} className="arrow"><ul className="itemList">{postsListItems}</ul></div>);
		});
		postsList = postsList.reverse();
		const nbSlide = catList ? catList.length : 0;
  	  	const RightContainer = (props)=><SemiContainer {...props} style={{marginTop:'-'+(nbSlide+1)*100+'vh', ...props.style}}/>;
		
  	  	return (
		  <Container>
		  	<Menu categories={categories}/>
		  	<BlogTitle/>
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
