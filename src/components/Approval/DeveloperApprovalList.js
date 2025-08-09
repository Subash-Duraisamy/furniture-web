import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, deleteDoc, doc, setDoc } from 'firebase/firestore';
import './DeveloperApprovalList.css';

const DeveloperApprovalList = () => {
  const db = getFirestore();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch developer requests inside useEffect
  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'developerRequests'));
        const reqs = [];
        querySnapshot.forEach(docSnap => {
          reqs.push({ id: docSnap.id, ...docSnap.data() });
        });
        setRequests(reqs);
      } catch (error) {
        console.error("Error fetching developer requests:", error);
      }
      setLoading(false);
    };

    fetchRequests();
  }, [db]);

  // Approve a developer request
  const approveRequest = async (request) => {
    try {
      // Add to developers collection
      await setDoc(doc(db, 'developers', request.email), {
        email: request.email,
        role: 'developer',
        name: request.name || '',
      });
      // Remove from developerRequests
      await deleteDoc(doc(db, 'developerRequests', request.id));
      alert(`${request.email} approved as developer.`);

      // Refresh requests list
      const querySnapshot = await getDocs(collection(db, 'developerRequests'));
      const reqs = [];
      querySnapshot.forEach(docSnap => reqs.push({ id: docSnap.id, ...docSnap.data() }));
      setRequests(reqs);
    } catch (error) {
      console.error("Error approving developer:", error);
      alert("Failed to approve developer.");
    }
  };

  // Reject a developer request
  const rejectRequest = async (requestId) => {
    try {
      await deleteDoc(doc(db, 'developerRequests', requestId));
      alert("Request rejected and deleted.");

      // Refresh requests list
      const querySnapshot = await getDocs(collection(db, 'developerRequests'));
      const reqs = [];
      querySnapshot.forEach(docSnap => reqs.push({ id: docSnap.id, ...docSnap.data() }));
      setRequests(reqs);
    } catch (error) {
      console.error("Error rejecting request:", error);
      alert("Failed to reject request.");
    }
  };

  if (loading) return <p>Loading developer requests...</p>;

  if (requests.length === 0) return <p>No developer signup requests pending.</p>;

  return (
    <div>
      <h2>Developer Signup Requests</h2>
      <ul>
        {requests.map((req) => (
          <li
            key={req.id}
            style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc', paddingBottom: '1rem' }}
          >
            <p><strong>Name:</strong> {req.name || "No Name"}</p>
            <p><strong>Email:</strong> {req.email}</p>
            <button onClick={() => approveRequest(req)} style={{ marginRight: '10px' }}>
              Approve
            </button>
            <button onClick={() => rejectRequest(req.id)}>Reject</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeveloperApprovalList;
