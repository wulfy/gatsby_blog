import React from 'react'
import Link from 'gatsby-link'
import { ME_ICON } from '../common/constant'

const Me = props => {
  return (
    <div className="me">
      <img src={ME_ICON} />
      <span> @Wulfy </span>
    </div>
  )
}

export default Me
