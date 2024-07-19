import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ContentList from './ContentList';
import ProductDetails from '../components/product/productDetails';

const productInfo = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ContentList />} />
        <Route path="/product/:productId" element={<ProductDetails />} />
      </Routes>
    </Router>
  );
};

export default productInfo;
