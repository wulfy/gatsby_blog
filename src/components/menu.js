import React from 'react'
import Link from 'gatsby-link'

import {CAT_ICON, DEFAULT_ICON} from '../common/constant'

const Menu = (props) => {
	const categories = props.categories ? props.categories : [];
	const categoriesItem = categories.map((category)=> {
		const icon = CAT_ICON[category] ? CAT_ICON[category] : DEFAULT_ICON;
		return <li><div className="pastille"><Link to={`/category/${category}`}><img src={icon}/></Link></div><span>{category}</span></li>
	});
	return(
		<ul className="menu">
			{categoriesItem}
		</ul>
		);
};

export default Menu;