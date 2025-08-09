import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import './Productpage.css';

const DEV_EMAILS = ["yourdeveloper@gmail.com", "anotherdev@gmail.com"]; // developer emails

const ProductAdmin = () => {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [isDev, setIsDev] = useState(false);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '' });
  const [editProductData, setEditProductData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsDev(DEV_EMAILS.includes(currentUser.email));
      }
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const snapshot = await getDocs(collection(db, 'products'));
    setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const addProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      alert("Please fill all fields");
      return;
    }
    await addDoc(collection(db, 'products'), newProduct);
    setNewProduct({ name: '', price: '', description: '' });
    fetchProducts();
  };

  const updateProduct = async () => {
    await updateDoc(doc(db, 'products', editProductData.id), editProductData);
    setEditProductData(null);
    fetchProducts();
  };

  const deleteProduct = async (id) => {
    await deleteDoc(doc(db, 'products', id));
    fetchProducts();
  };

  if (!isDev) {
    return <h2>Access Denied</h2>;
  }

  return (
    <div className="product-page">
      <h1>Manage Products</h1>

      {/* Add Product */}
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

      {/* List + Edit/Delete */}
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
