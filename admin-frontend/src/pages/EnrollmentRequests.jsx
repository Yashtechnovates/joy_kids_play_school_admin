import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Eye, Users, RefreshCw, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';

const EnrollmentRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [filter, setFilter] = useState('pending');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedRejectId, setSelectedRejectId] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/enrollment/requests?status=${filter}`);
      const data = await response.json();
      if (data.success) {
        setRequests(data.data);
      } else {
        toast.error('Failed to load requests');
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Error loading requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  // Simplified approve - backend handles everything
  const handleApprove = async (request) => {
    if (!window.confirm(`Approve enrollment for ${request.firstName} ${request.lastName}?`)) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/enrollment/${request.id}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewedBy: 'Admin' })
      });
      const data = await response.json();
      
      if (data.success) {
        toast.success(`Approved: ${request.firstName} ${request.lastName} (${data.rollNumber || 'Roll number assigned'})`);
        fetchRequests();
      } else {
        toast.error(data.message || 'Failed to approve');
      }
    } catch (error) {
      toast.error('Failed to approve');
      console.error(error);
    }
  };

  const openRejectModal = (requestId) => {
    setSelectedRejectId(requestId);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error('Please enter a rejection reason');
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/api/enrollment/${selectedRejectId}/reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rejectionReason: rejectReason, reviewedBy: 'Admin' })
      });
      const data = await response.json();
      
      if (data.success) {
        toast.success('Enrollment rejected');
        setShowRejectModal(false);
        setRejectReason('');
        setSelectedRejectId(null);
        fetchRequests();
      } else {
        toast.error(data.message || 'Failed to reject');
      }
    } catch (error) {
      toast.error('Failed to reject');
      console.error(error);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs flex items-center gap-1"><Clock size={12} /> Pending</span>;
      case 'approved':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs flex items-center gap-1"><CheckCircle size={12} /> Approved</span>;
      case 'rejected':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs flex items-center gap-1"><XCircle size={12} /> Rejected</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">{status}</span>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Enrollment Requests</h1>
          <p className="text-gray-500 mt-1">Review and approve student enrollment applications</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={fetchRequests} variant="outline" icon={RefreshCw}>Refresh</Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200 flex-wrap">
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 font-medium transition-colors ${filter === 'pending' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Pending ({requests.filter(r => r.status === 'pending').length})
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`px-4 py-2 font-medium transition-colors ${filter === 'approved' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Approved
        </button>
        <button
          onClick={() => setFilter('rejected')}
          className={`px-4 py-2 font-medium transition-colors ${filter === 'rejected' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Rejected
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 font-medium transition-colors ${filter === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          All
        </button>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users size={48} className="mx-auto mb-3 opacity-50" />
            <p>No enrollment requests found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parent Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parent Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parent Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {requests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium">
                      {request.firstName} {request.lastName}
                    </td>
                    <td className="px-4 py-3 text-sm">{request.class}</td>
                    <td className="px-4 py-3 text-sm">{request.fatherName}</td>
                    <td className="px-4 py-3 text-sm">{request.parentEmail || request.email || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm">{request.parentPhone || request.phoneNumber || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm">{formatDate(request.submittedAt)}</td>
                    <td className="px-4 py-3 text-sm">{getStatusBadge(request.status)}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => { setSelectedRequest(request); setIsViewModalOpen(true); }} 
                          className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        {request.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleApprove(request)} 
                              className="p-1 text-green-600 hover:bg-green-50 rounded"
                              title="Approve"
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button 
                              onClick={() => openRejectModal(request.id)} 
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                              title="Reject"
                            >
                              <XCircle size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Request Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Enrollment Details" size="lg">
        {selectedRequest && (
          <div className="space-y-4 p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <h3 className="font-semibold text-gray-800 border-b pb-2 mb-2">Student Information</h3>
              </div>
              <div><p className="text-sm text-gray-500">First Name</p><p className="font-medium">{selectedRequest.firstName || 'N/A'}</p></div>
              <div><p className="text-sm text-gray-500">Last Name</p><p className="font-medium">{selectedRequest.lastName || 'N/A'}</p></div>
              <div><p className="text-sm text-gray-500">Date of Birth</p><p className="font-medium">{selectedRequest.dateOfBirth || 'N/A'}</p></div>
              <div><p className="text-sm text-gray-500">Gender</p><p className="font-medium">{selectedRequest.gender || 'N/A'}</p></div>
              <div><p className="text-sm text-gray-500">Class</p><p className="font-medium">{selectedRequest.class || 'N/A'}</p></div>
              
              <div className="col-span-2 mt-2">
                <h3 className="font-semibold text-gray-800 border-b pb-2 mb-2">Contact Information</h3>
              </div>
              <div><p className="text-sm text-gray-500">Student Email</p><p className="font-medium">{selectedRequest.email || 'N/A'}</p></div>
              <div><p className="text-sm text-gray-500">Student Phone</p><p className="font-medium">{selectedRequest.phoneNumber || 'N/A'}</p></div>
              
              <div className="col-span-2 mt-2">
                <h3 className="font-semibold text-gray-800 border-b pb-2 mb-2">Parent Information</h3>
              </div>
              <div><p className="text-sm text-gray-500">Father's Name</p><p className="font-medium">{selectedRequest.fatherName || 'N/A'}</p></div>
              <div><p className="text-sm text-gray-500">Mother's Name</p><p className="font-medium">{selectedRequest.motherName || 'N/A'}</p></div>
              <div><p className="text-sm text-gray-500">Parent Email</p><p className="font-medium">{selectedRequest.parentEmail || selectedRequest.email || 'N/A'}</p></div>
              <div><p className="text-sm text-gray-500">Parent Phone</p><p className="font-medium">{selectedRequest.parentPhone || selectedRequest.phoneNumber || 'N/A'}</p></div>
              
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{selectedRequest.address || 'N/A'}</p>
              </div>
              
              {selectedRequest.rejectionReason && (
                <div className="col-span-2 mt-2">
                  <p className="text-sm text-red-500">Rejection Reason</p>
                  <p className="font-medium text-red-600">{selectedRequest.rejectionReason}</p>
                </div>
              )}
            </div>
            <button onClick={() => setIsViewModalOpen(false)} className="w-full bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
              Close
            </button>
          </div>
        )}
      </Modal>

      {/* Reject Reason Modal */}
      <Modal isOpen={showRejectModal} onClose={() => setShowRejectModal(false)} title="Reject Enrollment" size="md">
        <div className="space-y-4 p-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Please provide a reason for rejection:
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              placeholder="Enter reason for rejection..."
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleReject}
              className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Confirm Rejection
            </button>
            <button
              onClick={() => setShowRejectModal(false)}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EnrollmentRequests;