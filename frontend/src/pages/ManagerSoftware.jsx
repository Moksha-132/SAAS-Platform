import React, { useState, useEffect } from 'react';
import ManagerSidebar from '../components/ManagerSidebar';
import { Package, Link as LinkIcon, ExternalLink, Plus, Edit, Trash2, FileText, Upload, CheckCircle2, Loader2 } from 'lucide-react';

const ManagerSoftware = () => {
  const [softwareList, setSoftwareList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  
  const initialFormState = {
    name: '',
    description: '',
    deploymentLink: '',
    documentUrl: '',
    monthlyPrice: '',
    yearlyPrice: ''
  };
  const [formData, setFormData] = useState(initialFormState);

  const fetchSoftware = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/managers/software', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setSoftwareList(data.software);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSoftware();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setUploadedFileName('');
    setIsModalOpen(true);
  };

  const openEditModal = (software) => {
    setEditingId(software.id);
    setFormData({
      name: software.name,
      description: software.description,
      deploymentLink: software.deployment_link || '',
      documentUrl: software.document_url || '',
      monthlyPrice: software.monthly_price,
      yearlyPrice: software.yearly_price
    });
    setUploadedFileName(software.document_url ? 'Uploaded Project Document' : '');
    setIsModalOpen(true);
  };

  const handleDeleteSoftware = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this software from the marketplace?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/managers/software/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        fetchSoftware();
      } else {
        alert(data.message || 'Failed to delete software.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('file', file);

    setIsUploading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/managers/upload-document', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: uploadData
      });
      const data = await res.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, documentUrl: data.documentUrl }));
        setUploadedFileName(file.name);
      } else {
        alert(data.message || 'File upload failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed due to network error.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingId 
        ? `http://localhost:5000/api/managers/software/${editingId}`
        : 'http://localhost:5000/api/managers/software';
        
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setFormData(initialFormState);
        setEditingId(null);
        setUploadedFileName('');
        fetchSoftware();
      } else {
        alert(data.message || 'Failed to save software.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Unable to process request.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <ManagerSidebar />
      <div className="flex-grow md:ml-64 ml-0 p-4 md:p-8 lg:p-12 pt-20 md:pt-8">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-100 p-8 lg:p-10 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-8 border-b border-slate-100 mb-10 gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Hosted Software</h1>
              <p className="text-slate-500 font-medium">Manage and deploy SaaS products to the marketplace.</p>
            </div>
            <button 
              onClick={openAddModal}
              className="bg-[#b45309] hover:bg-amber-800 text-white px-5 py-2.5 rounded-xl font-bold shadow-md transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> Host New Software
            </button>
          </div>
          
          {softwareList.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl">
               <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
               <h3 className="text-lg font-bold text-slate-700 mb-2">No Software Hosted Yet</h3>
               <p className="text-slate-500 mb-6">You are not currently hosting any SaaS products on the marketplace.</p>
               <button 
                 onClick={openAddModal}
                 className="bg-white border border-slate-200 text-[#b45309] hover:bg-amber-50 px-6 py-2 rounded-lg font-bold shadow-sm transition-colors"
               >
                 Host Your First App
               </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {softwareList.map((software) => (
                <div key={software.id} className="p-6 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between relative group">
                  
                  {/* Action Menu overlay shown on hover */}
                  <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => openEditModal(software)}
                      className="bg-white text-slate-600 hover:text-[#b45309] p-2 rounded-lg shadow-sm border border-slate-200 transition-colors"
                      title="Edit Software"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteSoftware(software.id)}
                      className="bg-white text-slate-600 hover:text-red-600 p-2 rounded-lg shadow-sm border border-slate-200 transition-colors"
                      title="Delete Software"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <div className="flex justify-between items-start mb-4 pr-16">
                      <div className="p-3 bg-amber-100 rounded-xl">
                        <Package className="text-[#b45309] w-6 h-6" />
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wider">Active</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-xl mb-2">{software.name}</h3>
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">{software.description}</p>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500 font-medium">Monthly Plan:</span>
                        <span className="font-bold text-slate-900">${software.monthly_price}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500 font-medium">Yearly Plan:</span>
                        <span className="font-bold text-slate-900">${software.yearly_price}</span>
                      </div>
                    </div>
                  </div>
                  
                  {software.deployment_link ? (
                    <a 
                      href={software.deployment_link.startsWith('http') ? software.deployment_link : `https://${software.deployment_link}`}
                      target="_blank" rel="noreferrer"
                      className="w-full bg-white border border-slate-200 hover:border-[#b45309] text-[#b45309] flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" /> View Deployment
                    </a>
                  ) : (
                    <button className="w-full bg-slate-200 text-slate-400 cursor-not-allowed py-2.5 rounded-lg font-bold flex items-center justify-center gap-2">
                      <LinkIcon className="w-4 h-4" /> No Link Provided
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Software Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-black text-slate-900 mb-2">
              {editingId ? 'Edit Hosted Software' : 'Host New Software'}
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              {editingId ? 'Update pricing, details, and project documents.' : 'Provide product details, pricing, and deployment URL for the marketplace.'}
            </p>
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1.5">Software Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#b45309]" 
                  placeholder="e.g. DocuSign Pro" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1.5">Deployment URL</label>
                <input 
                  type="text" 
                  value={formData.deploymentLink}
                  onChange={(e) => setFormData({...formData, deploymentLink: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#b45309]" 
                  placeholder="https://app.yourdomain.com" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1.5">Project Document</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors relative">
                  <div className="space-y-1 text-center">
                    {isUploading ? (
                      <div className="flex flex-col items-center py-2">
                        <Loader2 className="w-10 h-10 text-[#b45309] animate-spin mb-2" />
                        <p className="text-sm font-bold text-slate-600">Uploading document...</p>
                      </div>
                    ) : formData.documentUrl ? (
                      <div className="flex flex-col items-center">
                        <CheckCircle2 className="w-10 h-10 text-green-600 mb-2" />
                        <p className="text-sm font-bold text-slate-800 max-w-xs truncate">{uploadedFileName || 'Document uploaded successfully'}</p>
                        <p className="text-xs text-slate-400 mt-1">Click below to replace file</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="mx-auto h-12 w-12 text-slate-400 mb-2" />
                        <div className="flex text-sm text-slate-600 justify-center">
                          <label className="relative cursor-pointer rounded-md font-bold text-[#b45309] hover:text-amber-800 focus-within:outline-none">
                            <span>Upload a file</span>
                            <input 
                              type="file" 
                              className="sr-only" 
                              onChange={handleFileUpload}
                              accept=".pdf,.zip,.rar,.docx,.txt,.png,.jpg,.jpeg"
                            />
                          </label>
                        </div>
                        <p className="text-xs text-slate-400">PDF, ZIP, RAR, DOCX, TXT, or images up to 15MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1.5">Description</label>
                <textarea 
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#b45309]" 
                  placeholder="Describe your SaaS features..."
                  rows="3"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-1.5">Monthly Price ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    value={formData.monthlyPrice}
                    onChange={(e) => setFormData({...formData, monthlyPrice: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#b45309]" 
                    placeholder="29.99" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-1.5">Yearly Price ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    value={formData.yearlyPrice}
                    onChange={(e) => setFormData({...formData, yearlyPrice: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#b45309]" 
                    placeholder="290.00" 
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 mt-6 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-white border border-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-[#b45309] text-white py-3 rounded-xl font-bold hover:bg-amber-800 transition-colors shadow-md"
                >
                  {editingId ? 'Save Changes' : 'Host Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerSoftware;

