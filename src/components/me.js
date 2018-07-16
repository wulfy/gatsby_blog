import React from 'react'
import Link from 'gatsby-link'

const Me = (props) => {
	return(
	<div className="me">
		<img src="mini_little_ninja_blanc.png" />
		<ul>
			<li>
				<span> @Wulfy </span>
			</li>
			<li>
				<img className="mini" src="github.png"/>
				<img className="mini" src="twitter.png"/>
				<img className="mini" src="pen.png"/>
			</li>
		</ul>
	</div>
		);
};

export default Me;