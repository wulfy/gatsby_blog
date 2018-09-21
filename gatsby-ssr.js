/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

// You can delete this file if you're not using it
// ce fichier permet de ne pas planter lors de la génération côté serveur de redux
// les routes ne sont pas prises en compte mais ce n'est pas grave car c'est côté client que le routing sera calculé
// le rendu d'une page ne dépend pas du routing (les liens sont évalués côté client)
import React from 'react'
import { Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { renderToString } from 'react-dom/server'

import createStore from './src/store/createStore'

const replaceRenderer = ({ bodyComponent, replaceBodyHTMLString }) => {
  const store = createStore()
  const ConnectedBody = () => <Provider store={store}>{bodyComponent}</Provider>
  replaceBodyHTMLString(renderToString(<ConnectedBody />))
}

export default replaceRenderer;