import PropTypes from 'prop-types'
import React from 'react'

//import * as theme from '../theme';

const theme = {}
const styled = (Component, styler) => props => {
  const propsWithTheme = { ...props, theme }
  const style = typeof styler === 'function' ? styler(propsWithTheme) : styler
  /* React doesn't support "forwarding" ref for now
    https://github.com/facebook/react/issues/4213
    https://github.com/styled-components/styled-components/issues/102
  */

  if (propsWithTheme.innerRef) {
    propsWithTheme.ref = propsWithTheme.innerRef
  }

  const component = (
    <Component {...propsWithTheme} style={[style, propsWithTheme.style]} />
  )

  component.propTypes = {
    style: PropTypes.object,
  }
  component.defaultProps = {
    style: {},
  }
  return component
}

export default styled
