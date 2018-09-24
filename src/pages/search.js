import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch-dom';

import searchHits from '../components/searchHits';
import Layout from '../components/layout'

const searchClient = algoliasearch(
  'DWK4V6LEA0',
  'c7c652c614750a31364fe732b9270a91'
);

const SecondPage = ({location}) => (
   <Layout location={location}>
       <InstantSearch
        indexName="wulfy_blog"
        searchClient={searchClient}
      >
       <div className="categoryList blog-post-container">
       <div className="page_title"> SEARCH </div>
        <SearchBox />
        <Hits hitComponent={searchHits} />
       </div> 
      </InstantSearch>
  </Layout>
)

export default SecondPage
