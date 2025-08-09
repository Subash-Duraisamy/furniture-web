import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Signin from '../Authentication/Signin/Signin';
import Signup from '../Authentication/Signup/Signup';
import Forgot from '../Authentication/Forgetpassword/ForgotPassword';
import Choose from '../Arc-reactor/Arc_reactor';
import Home from '../../Home';

import Layout from '../Navbar/Layout/Layout'; // new import
import ProductList from '../Productpage/ProductList';
import ProductAdmin from '../Productpage/ProductAdmin';
import DeveloperApprovalList from '../Approval/DeveloperApprovalList';
import DeveloperManagement from '../Authentication/Dev/DeveloperManagement';

const Routing = () => {
  return (
    <Routes>
      <Route path="/" element={<Choose />} />
      <Route path="/Signin" element={<Signin />} />
      <Route path="/Signup" element={<Signup />} />
      <Route path="/Forgot" element={<Forgot />} />

      {/* Wrap all pages that should have the navbar inside Layout */}
      <Route element={<Layout />}>
        <Route path="/Home" element={<Home />} />
        <Route path="/products" element={<ProductList />} />   {/* Customer */}
        <Route path="/admin/products" element={<ProductAdmin />} /> {/* Developer */}
        <Route path="/developer-approvals" element={<DeveloperApprovalList />} />
        <Route path="/manage-developers" element={<DeveloperManagement />} />

        {/* You can add About, Contact here later */}
      </Route>
    </Routes>
  );
};

export default Routing;
