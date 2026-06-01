import { useState, useEffect } from 'react';
import { UserPlus, Check, X, Eye, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from './Modal';

const EnrollmentRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/pending-students');
      const data = await response.json();
      if (data.success) {
        setRequests(data.data);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // Poll every 10 seconds for new requests
    const interval = setInterval(fetchRequests, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleApprove = async (id, request) => {
    try {
      const response = await fetch(`http://localhost:5000/api/pending-students/${id}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (data.success) {
        toast.success(`✅ ${request.name} has been enrolled successfully!`);
        fetchRequests();
        // Trigger refresh of student list
        window.dispatchEvent(new CustomEvent('student-enrolled'));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to approve enrollment');
    }
  };

  const handleReject = async (id, name) => {
    if (window.confirm(`Reject enrollment for ${name}?`)) {
      try {
        const response = await fetch(`http://localhost:5000/api/pending-students/${id}/reject`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        if (data.success) {
          toast.success(`❌ ${name}'s enrollment rejected`);
          fetchRequests();
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error('Failed to reject enrollment');
      }
    }
  };

  const viewDetails = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  if (requests.length === 0 && !loading) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <UserPlus size={20} className="text-white" />
          <h2 className="text-white font-semibold">Enrollment Requests</h2>
          {pendingCount > 0 && (
            <span className="bg-yellow-400 text-purple-900 text-xs font-bold px-2 py-1 rounded-full">
              {pendingCount} Pending
            </span>
          )}
        </div>
        <button onClick={fetchRequests} className="text-white hover:bg-white/20 p-1 rounded">
          <RefreshCw size={16} />
        </button>
      </div>

      <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
          </div>
        ) : (
          requests.map((request) => (
            <div key={request._id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-800">{request.name}</h3>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                      {request.class}
                    </span>
                    {request.status === 'pending' && (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                        Pending Approval
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    📞 {request.contact} | 👨‍👩 {request.fatherName} & {request.motherName}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Enrolled: {new Date(request.enrolledAt).toLocaleDateString()}
                  </p>
                </div>
                
                {request.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => viewDetails(request)}
                      className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleApprove(request._id, request)}
                      className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                      title="Approve"
                    >
                      <Check size={18} />
                    </button>
                    <button
                      onClick={() => handleReject(request._id, request.name)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Reject"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}
                
                {request.status === 'approved' && (
                  <div className="text-green-500 text-sm">✓ Approved</div>
                )}
                
                {request.status === 'rejected' && (
                  <div className="text-red-500 text-sm">✗ Rejected</div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* View Details Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Student Details" size="lg">
        {selectedRequest && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><p className="text-xs text-gray-500">Full Name</p><p className="font-medium">{selectedRequest.name}</p></div>
              <div><p className="text-xs text-gray-500">Class</p><p className="font-medium">{selectedRequest.class}</p></div>
              <div><p className="text-xs text-gray-500">Date of Birth</p><p className="font-medium">{selectedRequest.dateOfBirth}</p></div>
              <div><p className="text-xs text-gray-500">Gender</p><p className="font-medium">{selectedRequest.gender}</p></div>
              <div><p className="text-xs text-gray-500">Contact</p><p className="font-medium">{selectedRequest.contact}</p></div>
              <div><p className="text-xs text-gray-500">Email</p><p className="font-medium">{selectedRequest.email || 'N/A'}</p></div>
              <div><p className="text-xs text-gray-500">Father's Name</p><p className="font-medium">{selectedRequest.fatherName}</p></div>
              <div><p className="text-xs text-gray-500">Mother's Name</p><p className="font-medium">{selectedRequest.motherName}</p></div>
              <div><p className="text-xs text-gray-500">Parent Contact</p><p className="font-medium">{selectedRequest.parentPhone}</p></div>
              <div className="col-span-2"><p className="text-xs text-gray-500">Address</p><p className="font-medium">{selectedRequest.address}</p></div>
            </div>
            <div className="flex gap-3 pt-3">
              <button
                onClick={() => {
                  handleApprove(selectedRequest._id, selectedRequest);
                  setShowModal(false);
                }}
                className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
              >
                Approve Enrollment
              </button>
              <button
                onClick={() => {
                  handleReject(selectedRequest._id, selectedRequest.name);
                  setShowModal(false);
                }}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
              >
                Reject
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EnrollmentRequests;