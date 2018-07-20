import React from 'react'
import Link from 'gatsby-link'

import {CAT_ICON, DEFAULT_ICON} from '../common/constant'

const Menu = (props) => {
	const categories = props.categories ? props.categories : [];
	const categoriesItem = categories.map((category)=> {
		const icon = CAT_ICON[category] ? CAT_ICON[category] : DEFAULT_ICON;
		return <li key={`menu-${category}`}><div className="pastille"><a href="#" onClick={props.goto}><img data-section={category} src={icon}/></a></div><span>{category}</span></li>
	});
	return(
		<ul className="menu">
			{categoriesItem}
		</ul>
		);
};

export default Menu;