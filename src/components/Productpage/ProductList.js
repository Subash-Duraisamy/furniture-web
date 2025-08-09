import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import './Productpage.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const snapshot = await getDocs(collection(db, 'products'));
    setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  return (
    <div className="product-page">
      <h1>Our Products</h1>
      <div className="product-list">
        {products.map(prod => (
          <div key={prod.id} className="product-card">
            <h3>{prod.name}</h3>
            <p>${prod.price}</p>
            <p>{prod.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
