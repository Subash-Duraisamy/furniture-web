import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import './DeveloperManagement.css'

const DeveloperManagement = () => {
  const db = getFirestore();
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const SUPER_ADMIN_EMAIL = "subash111425@gmail.com";

  const fetchDevelopers = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'developers'));
      const devs = [];
      querySnapshot.forEach((doc) => {
        devs.push({ id: doc.id, ...doc.data() });
      });
      setDevelopers(devs);
    } catch (error) {
      console.error("Error fetching developers:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDevelopers();
  }, []);

  const handleDelete = async (email) => {
    if (email === SUPER_ADMIN_EMAIL) {
      alert("You cannot delete the super admin!");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete developer ${email}?`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'developers', email));
      alert(`Developer ${email} deleted successfully.`);
      fetchDevelopers();
    } catch (error) {
      console.error("Error deleting developer:", error);
      alert("Failed to delete developer.");
    }
  };

  if (loading) return <p>Loading developers...</p>;

  return (
    <div>
      <h2>Manage Developers</h2>
      {developers.length === 0 ? (
        <p>No developers found.</p>
      ) : (
        <table border="1" cellPadding="10" style={{borderCollapse: 'collapse'}}>
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {developers.map(({ id, email, role }) => (
              <tr key={id}>
                <td>{email}</td>
                <td>{role}</td>
                <td>
                  {email !== SUPER_ADMIN_EMAIL && (
                    <button onClick={() => handleDelete(email)}>Delete</button>
                  )}
                  {email === SUPER_ADMIN_EMAIL && <span>Super Admin</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DeveloperManagement;
