import React from 'react'
import {Link} from 'gatsby'
import { ME_ICON } from '../common/constant'

const Me = props => {
  return (
    <div {...props}>
      <img src={ME_ICON} />
      <span> @Wulfy </span>
    </div>
  )
}

export default Me
