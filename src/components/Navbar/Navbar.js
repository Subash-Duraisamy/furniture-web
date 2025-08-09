import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // developer or customer
  const [menuOpen, setMenuOpen] = useState(false);
  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser({
          name: currentUser.displayName || 'No Name',
          email: currentUser.email
        });

        // Check if currentUser email is in 'developers' collection
        try {
          const userDoc = await getDoc(doc(db, 'developers', currentUser.email));
          if (userDoc.exists()) {
            setRole(userDoc.data().role || 'developer');
          } else {
            setRole('customer'); // default role
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setRole('customer');
        }
      } else {
        setUser(null);
        setRole(null);
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => navigate('/Signin'))
      .catch((err) => console.error(err));
  };

  const handleHomeClick = () => {
    if (role === 'developer') {
      navigate('/DeveloperDashboard'); // or any admin page
    } else {
      navigate('/Home');
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">MyFurniture</div>

      <ul className="nav-links">
        <li><button onClick={handleHomeClick} className="link-btn">Home</button></li>
        <li><Link to="/About">About</Link></li>
        {role === 'developer' && (
  <li><Link to="/developer-approvals">Developer Approvals</Link></li>
)}
        
        {role === 'developer' && (
  <>
    <li><Link to="/manage-developers">Manage Developers</Link></li>
  </>
)}


        {role === 'developer' ? (
          <li><Link to="/ProductAdmin">Manage Products</Link></li>
        ) : (
          <li><Link to="/Productpage">Products</Link></li>
        )}
        
        <li><Link to="/Contact">Contact</Link></li>
      </ul>
      
      {user && (
        <div className="profile-section">
          <button onClick={() => setMenuOpen(!menuOpen)} className="profile-btn">
            <FontAwesomeIcon icon={faCircleUser} size="lg" />
          </button>
          {menuOpen && (
            <div className="profile-dropdown">
              <p><strong>{user.name}</strong></p>
              <p>{user.email}</p>
              <p className="role-text">Role: {role}</p>
              <button className="logout-btn" onClick={handleLogout}>
                <FontAwesomeIcon icon={faRightFromBracket} /> Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
