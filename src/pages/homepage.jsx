import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ContentList from '../components/content/contentlist';

const Home = () => {
  const [products, setProducts] = useState([]);
  const apiUrl = "http://localhost:3003"
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get(`${apiUrl}/api/products`);
      setProducts(response.data);
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <ContentList contents={products} />
    </div>
  );
};

export default Home;
