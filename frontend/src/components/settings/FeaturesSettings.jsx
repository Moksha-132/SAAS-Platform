import React from 'react';
import { Zap, Plus, Trash2 } from 'lucide-react';

const FeaturesSettings = ({ features, setFeatures }) => {
  const addFeature = () => {
    const newFeature = {
      id: `feat-${Date.now()}`,
      title: 'New Feature Name',
      desc: 'Description of the newly added platform capability.'
    };
    setFeatures([...features, newFeature]);
  };

  const deleteFeature = (id) => {
    setFeatures(features.filter(f => f.id !== id));
  };

  const updateFeature = (id, field, value) => {
    setFeatures(features.map(f => f.id === id ? { ...f, [field]: value } : f));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Zap className="text-[#f97316] w-5 h-5" />
          Manage Platform Features
        </h3>
        <button
          type="button"
          onClick={addFeature}
          className="bg-[#f97316] hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Feature
        </button>
      </div>

      {features.length === 0 ? (
        <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center text-slate-400 text-sm">
          No features added yet. Click "+ Add Feature" to display features on the homepage.
        </div>
      ) : (
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {features.map((feature, idx) => (
            <div key={feature.id} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl relative group">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Feature #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => deleteFeature(feature.id)}
                  className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                  title="Delete Feature"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Feature Title</label>
                  <input
                    type="text"
                    required
                    value={feature.title}
                    onChange={(e) => updateFeature(feature.id, 'title', e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Feature Description</label>
                  <textarea
                    rows="2"
                    required
                    value={feature.desc}
                    onChange={(e) => updateFeature(feature.id, 'desc', e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm bg-white leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturesSettings;
