/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */
import React from 'react'
import { Provider } from 'react-redux'

import createStore from './src/store/createStore'

const store = createStore()

export const wrapRootElement = ({ element }) => {

    const ConnectedRootElement = (
        <Provider store={store}>
            {element}
        </Provider>
    )

    return ConnectedRootElement
}