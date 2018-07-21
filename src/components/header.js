import React from 'react'
import Link from 'gatsby-link'

const Header = ({ siteTitle, path, hide}) => {
  const headerStyle = {
      background: 'rebeccapurple',
      marginBottom: '0',
      display: (path === '/' || hide) ? 'none' : 'block'
    };
  const textStyle = {
       margin: '0',
  };
  return (
    <div
      style={headerStyle}
    >
      <div>
        <h1 style={textStyle}> hello 
          <Link
            to="/"
            style={{
              color: 'white',
              textDecoration: 'none',
            }}
          />
        </h1>
      </div>
    </div>
  )
}

export default Header
