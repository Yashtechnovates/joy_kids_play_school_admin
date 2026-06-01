import { useState } from 'react';
import { DollarSign, CreditCard, Calendar, Search, Download, Plus, Eye, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';

const Fees = () => {
  const [selectedClass, setSelectedClass] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Sample fee data
  const [feeRecords, setFeeRecords] = useState([
    { id: 1, studentName: 'Aarav Sharma', class: 'Pre-KG', admissionNo: 'PKG001', totalFees: 25000, paid: 25000, due: 0, status: 'Paid', lastPayment: '2024-01-15' },
    { id: 2, studentName: 'Iyer Krishnan', class: 'Pre-KG', admissionNo: 'PKG002', totalFees: 25000, paid: 15000, due: 10000, status: 'Partial', lastPayment: '2024-02-10' },
    { id: 3, studentName: 'Sanya Verma', class: 'LKG', admissionNo: 'LKG001', totalFees: 28000, paid: 28000, due: 0, status: 'Paid', lastPayment: '2024-01-20' },
    { id: 4, studentName: 'Reyansh Patel', class: 'UKG', admissionNo: 'UKG001', totalFees: 30000, paid: 10000, due: 20000, status: 'Pending', lastPayment: '2024-01-05' },
    { id: 5, studentName: 'Advait Singh', class: 'LKG', admissionNo: 'LKG002', totalFees: 28000, paid: 0, due: 28000, status: 'Pending', lastPayment: null },
  ]);

  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    paymentMethod: 'Cash',
    receiptNo: '',
    notes: ''
  });

  const filteredRecords = feeRecords.filter(record => {
    const matchesClass = selectedClass === 'All' || record.class === selectedClass;
    const matchesSearch = record.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          record.admissionNo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSearch;
  });

  const stats = {
    totalCollected: feeRecords.reduce((sum, r) => sum + r.paid, 0),
    totalDue: feeRecords.reduce((sum, r) => sum + r.due, 0),
    collectionRate: (feeRecords.reduce((sum, r) => sum + r.paid, 0) / feeRecords.reduce((sum, r) => sum + r.totalFees, 0) * 100) || 0
  };

  const handlePayment = () => {
    if (!paymentForm.amount || paymentForm.amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const updatedRecords = feeRecords.map(record => {
      if (record.id === selectedStudent.id) {
        const newPaid = record.paid + parseInt(paymentForm.amount);
        const newDue = record.totalFees - newPaid;
        return {
          ...record,
          paid: newPaid,
          due: newDue,
          status: newDue === 0 ? 'Paid' : 'Partial',
          lastPayment: new Date().toISOString().split('T')[0]
        };
      }
      return record;
    });

    setFeeRecords(updatedRecords);
    toast.success(`Payment of ₹${paymentForm.amount} received successfully`);
    setIsModalOpen(false);
    setPaymentForm({ amount: '', paymentMethod: 'Cash', receiptNo: '', notes: '' });
  };

  const exportFees = () => {
    const data = filteredRecords.map(r => ({
      'Student Name': r.studentName,
      'Class': r.class,
      'Admission No': r.admissionNo,
      'Total Fees': r.totalFees,
      'Paid': r.paid,
      'Due': r.due,
      'Status': r.status,
      'Last Payment': r.lastPayment || 'N/A'
    }));
    
    const csv = [Object.keys(data[0]), ...data.map(obj => Object.values(obj))];
    const csvContent = csv.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fee_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Fee report exported successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Fees Management</h1>
          <p className="text-gray-500 mt-1">Track and manage student fee collections</p>
        </div>
        <Button onClick={exportFees} icon={Download}>Export Report</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex justify-between items-start">
            <div><p className="text-green-100">Total Collected</p><p className="text-2xl font-bold">₹{stats.totalCollected.toLocaleString()}</p></div>
            <DollarSign size={32} />
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
          <div className="flex justify-between items-start">
            <div><p className="text-orange-100">Total Due</p><p className="text-2xl font-bold">₹{stats.totalDue.toLocaleString()}</p></div>
            <CreditCard size={32} />
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex justify-between items-start">
            <div><p className="text-blue-100">Collection Rate</p><p className="text-2xl font-bold">{stats.collectionRate.toFixed(1)}%</p></div>
            <Calendar size={32} />
          </div>
        </div>
      </div>

      {/* Fee Records Table */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" placeholder="Search by name or admission number..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
          <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg">
            <option>All</option><option>Pre-KG</option><option>LKG</option><option>UKG</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr><th className="table-header">Admission No</th><th className="table-header">Student Name</th><th className="table-header">Class</th><th className="table-header">Total Fees</th><th className="table-header">Paid</th><th className="table-header">Due</th><th className="table-header">Status</th><th className="table-header">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id}>
                  <td className="table-cell">{record.admissionNo}</td>
                  <td className="table-cell font-medium">{record.studentName}</td>
                  <td className="table-cell">{record.class}</td>
                  <td className="table-cell">₹{record.totalFees.toLocaleString()}</td>
                  <td className="table-cell text-green-600">₹{record.paid.toLocaleString()}</td>
                  <td className="table-cell text-red-600">₹{record.due.toLocaleString()}</td>
                  <td className="table-cell">
                    <span className={`px-2 py-1 rounded-full text-xs ${record.status === 'Paid' ? 'bg-green-100 text-green-700' : record.status === 'Partial' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="table-cell">
                    <button onClick={() => { setSelectedStudent(record); setIsModalOpen(true); }} className="btn-primary text-sm px-3 py-1">Collect Fee</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Collect Fee - ${selectedStudent?.studentName}`} size="md">
        <div className="p-6">
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between mb-2"><span className="text-gray-600">Total Fees:</span><span className="font-semibold">₹{selectedStudent?.totalFees?.toLocaleString()}</span></div>
              <div className="flex justify-between mb-2"><span className="text-gray-600">Already Paid:</span><span className="font-semibold text-green-600">₹{selectedStudent?.paid?.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Due Amount:</span><span className="font-semibold text-red-600">₹{selectedStudent?.due?.toLocaleString()}</span></div>
            </div>
            
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label><input type="number" value={paymentForm.amount} onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})} className="input-field" placeholder="Enter amount" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label><select value={paymentForm.paymentMethod} onChange={(e) => setPaymentForm({...paymentForm, paymentMethod: e.target.value})} className="input-field"><option>Cash</option><option>Cheque</option><option>Bank Transfer</option><option>Card</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Receipt No.</label><input type="text" value={paymentForm.receiptNo} onChange={(e) => setPaymentForm({...paymentForm, receiptNo: e.target.value})} className="input-field" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Notes</label><textarea value={paymentForm.notes} onChange={(e) => setPaymentForm({...paymentForm, notes: e.target.value})} rows="2" className="input-field"></textarea></div>
            
            <div className="flex gap-3 pt-4"><Button onClick={handlePayment}>Process Payment</Button><Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button></div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Fees;