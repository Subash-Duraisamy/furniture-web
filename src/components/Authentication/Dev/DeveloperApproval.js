// DeveloperApproval.js
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";

const DeveloperApproval = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const querySnapshot = await getDocs(collection(db, "developerRequests"));
      const reqs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRequests(reqs);
    };
    fetchRequests();
  }, []);

  const approveDeveloper = async (request) => {
    await addDoc(collection(db, "developers"), {
      name: request.name,
      email: request.email,
      approvedAt: new Date()
    });

    await deleteDoc(doc(db, "developerRequests", request.id));

    alert(`${request.email} approved as developer!`);
    setRequests(prev => prev.filter(r => r.id !== request.id));
  };

  const rejectDeveloper = async (id) => {
    await deleteDoc(doc(db, "developerRequests", id));
    alert("Developer request rejected.");
    setRequests(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div>
      <h2>Pending Developer Requests</h2>
      {requests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        requests.map(req => (
          <div key={req.id} style={{ border: "1px solid #ccc", padding: "10px", margin: "5px" }}>
            <p><strong>{req.name}</strong> - {req.email}</p>
            <button onClick={() => approveDeveloper(req)}>Approve</button>
            <button onClick={() => rejectDeveloper(req.id)}>Reject</button>
          </div>
        ))
      )}
    </div>
  );
};

export default DeveloperApproval;
