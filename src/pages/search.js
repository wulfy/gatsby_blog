import React from 'react';
import ReactDOM from 'react-dom';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch-dom';

import searchHits from '../components/searchHits';

const searchClient = algoliasearch(
  'DWK4V6LEA0',
  'c7c652c614750a31364fe732b9270a91'
);

const SecondPage = () => (
   <InstantSearch
    indexName="wulfy_blog"
    searchClient={searchClient}
  >
   <div className="categoryList blog-post-container">
    <SearchBox />
    <Hits hitComponent={searchHits} />
   </div> 
  </InstantSearch>
)

export default SecondPage
