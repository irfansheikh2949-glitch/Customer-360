import React, { useState, useEffect } from 'react';
import { ActiveVehiclePolicy } from '../data/mockData';
import { TruckIcon, XMarkIcon, PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/solid';

interface ManageVehiclesDialogProps {
  initialVehicles: ActiveVehiclePolicy[];
  onDismiss: () => void;
  onSave: (vehicles: ActiveVehiclePolicy[]) => void;
}

const ManageVehiclesDialog: React.FC<ManageVehiclesDialogProps> = ({ initialVehicles, onDismiss, onSave }) => {
  const blankVehicle: Omit<ActiveVehiclePolicy, 'id' | 'premium' | 'idv'> & { id?: string } = {
    mmv: '',
    regNo: '',
    insurer: '',
    expiryDate: '',
  };
  
  const [vehicles, setVehicles] = useState<ActiveVehiclePolicy[]>(initialVehicles);
  const [currentVehicle, setCurrentVehicle] = useState(blankVehicle);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentVehicle(prev => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdateVehicle = () => {
    if (!currentVehicle.mmv || !currentVehicle.regNo) {
      alert('Make/Model/Variant and Registration Number are required.');
      return;
    }

    if (editingIndex !== null) {
      // Update existing vehicle
      const updatedVehicles = [...vehicles];
      updatedVehicles[editingIndex] = { ...updatedVehicles[editingIndex], ...currentVehicle };
      setVehicles(updatedVehicles);
      setEditingIndex(null);
    } else {
      // Add new vehicle
      const newVehicle: ActiveVehiclePolicy = {
        id: `v-${Date.now()}`,
        premium: 0, // Default value
        idv: 0,     // Default value
        ...currentVehicle
      };
      setVehicles(prev => [...prev, newVehicle]);
    }
    setCurrentVehicle(blankVehicle); // Reset form
  };
  
  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setCurrentVehicle(vehicles[index]);
  };
  
  const handleCancelEdit = () => {
    setEditingIndex(null);
    setCurrentVehicle(blankVehicle);
  };

  const handleDelete = (index: number) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
        setVehicles(prev => prev.filter((_, i) => i !== index));
    }
  };
  
  const handleSubmit = () => {
    onSave(vehicles);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onDismiss}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center">
            <TruckIcon className="h-6 w-6 text-orange-500 mr-2" />
            <h2 className="text-xl font-bold text-gray-900">Manage Vehicles</h2>
          </div>
          <button onClick={onDismiss} className="p-1 rounded-full hover:bg-gray-200"><XMarkIcon className="h-6 w-6" /></button>
        </div>
        
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="space-y-3 mb-6">
            {vehicles.map((vehicle, index) => (
              <div key={vehicle.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="font-semibold">{vehicle.mmv}</p>
                  <p className="text-sm text-gray-600">{vehicle.regNo} | Expires: {vehicle.expiryDate || 'N/A'}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => handleEdit(index)} className="p-1 text-blue-600 hover:text-blue-800"><PencilIcon className="h-5 w-5"/></button>
                  <button onClick={() => handleDelete(index)} className="p-1 text-red-500 hover:text-red-700"><TrashIcon className="h-5 w-5"/></button>
                </div>
              </div>
            ))}
            {vehicles.length === 0 && <p className="text-center text-gray-500">No vehicles have been added yet.</p>}
          </div>

          <div className="p-4 border rounded-md bg-gray-50">
            <h3 className="font-semibold text-lg mb-3">{editingIndex !== null ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <InputField label="Make, Model, Variant" name="mmv" value={currentVehicle.mmv || ''} onChange={handleInputChange} required />
               <InputField label="Registration No." name="regNo" value={currentVehicle.regNo || ''} onChange={handleInputChange} required />
               <InputField label="Previous Insurer" name="insurer" value={currentVehicle.insurer || ''} onChange={handleInputChange} />
               <InputField label="Insurance Expiry" name="expiryDate" value={currentVehicle.expiryDate || ''} onChange={handleInputChange} type="date" />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
                {editingIndex !== null && (
                    <button onClick={handleCancelEdit} className="px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                        Cancel
                    </button>
                )}
                <button onClick={handleAddOrUpdateVehicle} className="px-3 py-1.5 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 flex items-center">
                    <PlusIcon className="h-5 w-5 mr-1"/> {editingIndex !== null ? 'Update Vehicle' : 'Add Vehicle'}
                </button>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t flex justify-end space-x-3">
          <button onClick={onDismiss} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-green-700">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

const InputField: React.FC<{label: string; name: string; value: string; onChange: any; type?: string; required?: boolean}> = (props) => (
    <div>
        <label htmlFor={props.name} className="block text-sm font-medium text-gray-700">{props.label}{props.required && <span className="text-red-500">*</span>}</label>
        <input {...props} id={props.name} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
    </div>
);

export default ManageVehiclesDialog;
