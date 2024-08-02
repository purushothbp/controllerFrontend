import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, CircularProgress, Avatar } from '@mui/material';
import AppBarLayout from '../components/appBAr/persistaneAppbar';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = 'http://localhost:3003';
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/products/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>;
  }

  return (
    <Container>
      <AppBarLayout title={product.title}></AppBarLayout>
      <Avatar
        alt={product.title}
        src={product.imageUrl}
        style={{ width: '100%', height: 'auto', borderRadius: '10px' }}
      />
      <Typography variant="h4">{product.title}</Typography>
      <Typography variant="h6">{product.instructor}</Typography>
      <Typography variant="body1" color="textSecondary">
        Price: ${product.price}
      </Typography>
      <Typography variant="body1" color="textSecondary">
        {product.description}
      </Typography>
    </Container>
  );
};

export default ProductDetails;
