import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../../firebase';  // Adjust path if needed
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import './Productpage.css';

const DEV_EMAILS = ["yourdeveloper@gmail.com", "anotherdev@gmail.com"]; // Add developer emails here

const ProductAdmin = () => {
  const auth = getAuth();
  const [isDev, setIsDev] = useState(false);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '' });
  const [editProductData, setEditProductData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setIsDev(DEV_EMAILS.includes(currentUser.email));
      } else {
        setIsDev(false);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (isDev) {
      fetchProducts();
    } else {
      setProducts([]);
    }
  }, [isDev]);

  const fetchProducts = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'products'));
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const addProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      alert("Please fill all fields");
      return;
    }
    try {
      await addDoc(collection(db, 'products'), newProduct);
      setNewProduct({ name: '', price: '', description: '' });
      fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product.");
    }
  };

  const updateProduct = async () => {
    try {
      await updateDoc(doc(db, 'products', editProductData.id), {
        name: editProductData.name,
        price: editProductData.price,
        description: editProductData.description,
      });
      setEditProductData(null);
      fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product.");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product.");
    }
  };

  if (!isDev) {
    return <h2>Access Denied</h2>;
  }

  return (
    <div className="product-page">
      <h1>Manage Products</h1>

      {/* Add Product Section */}
      <div className="admin-section">
        <h2>Add Product</h2>
        <input
          type="text"
          placeholder="Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
        />
        <button onClick={addProduct}>Add Product</button>
      </div>

      {/* List of Products */}
      <div className="product-list">
        {products.map(prod => (
          <div key={prod.id} className="product-card">
            <h3>{prod.name}</h3>
            <p>${prod.price}</p>
            <p>{prod.description}</p>
            <button onClick={() => setEditProductData(prod)}>Edit</button>
            <button onClick={() => deleteProduct(prod.id)}>Delete</button>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editProductData && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Product</h2>
            <input
              type="text"
              value={editProductData.name}
              onChange={(e) => setEditProductData({ ...editProductData, name: e.target.value })}
            />
            <input
              type="number"
              value={editProductData.price}
              onChange={(e) => setEditProductData({ ...editProductData, price: e.target.value })}
            />
            <textarea
              value={editProductData.description}
              onChange={(e) => setEditProductData({ ...editProductData, description: e.target.value })}
            />
            <div className="modal-buttons">
              <button onClick={updateProduct}>Save</button>
              <button onClick={() => setEditProductData(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductAdmin;
