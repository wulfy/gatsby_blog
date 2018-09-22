import React from 'react'
import { ME_ICON } from '../common/constant'

const Me = props => {
  return (
    <div {...props}>
      <img alt="me" src={ME_ICON} />
      <span> @Wulfy </span>
    </div>
  )
}

export default Me
