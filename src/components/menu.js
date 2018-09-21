import React from 'react'
import {Link} from 'gatsby'

import { CAT_ICON, DEFAULT_ICON } from '../common/constant'

const Menu = props => {
  const categories = props.categories ? props.categories : []
  const categoriesItem = categories.map(category => {
    const icon = CAT_ICON[category] ? CAT_ICON[category] : DEFAULT_ICON
    const additionnalClass = props.selected === category ? 'isSelected' : ''
    return (
      <li key={`menu-${category}`} className={`${additionnalClass}`}>
        <div className={`pastille ${additionnalClass}`}>
          <a href="#" onClick={props.handleScrollToSection}>
            <img data-section={category} src={icon} />
          </a>
        </div>
        <span>{category}</span>
      </li>
    )
  })
  return <ul className="menu">{categoriesItem}</ul>
}

export default Menu
