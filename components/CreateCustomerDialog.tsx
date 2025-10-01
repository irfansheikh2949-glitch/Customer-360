import React, { useState } from 'react';
import { UserPlusIcon, XMarkIcon, PlusIcon, TrashIcon, HeartIcon, ShieldCheckIcon, TruckIcon } from '@heroicons/react/24/solid';

interface CreateCustomerDialogProps {
  onDismiss: () => void;
  onSave: (customerData: any) => void;
}

const CreateCustomerDialog: React.FC<CreateCustomerDialogProps> = ({ onDismiss, onSave }) => {
    const initialState = {
        fullName: '',
        dob: '',
        gender: 'Male',
        maritalStatus: 'Single',
        mobileNumber: '',
        alternateNumber: '',
        reference: '',
        policyInterest: { health: false, life: false, motor: false },
        familyMembers: [] as { name: string; relation: string; dob: string }[],
        vehicles: [] as { mmv: string; regNo: string }[],
    };

    const [formData, setFormData] = useState(initialState);
    const [newFamilyMember, setNewFamilyMember] = useState({ name: '', relation: '', dob: '' });
    const [newVehicle, setNewVehicle] = useState({ mmv: '', regNo: '' });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, policyInterest: { ...prev.policyInterest, [name]: checked }}));
    }
    
    const handleAddFamilyMember = () => {
        if (newFamilyMember.name && newFamilyMember.relation) {
            setFormData(prev => ({ ...prev, familyMembers: [...prev.familyMembers, newFamilyMember]}));
            setNewFamilyMember({ name: '', relation: '', dob: '' });
        }
    };

    const handleRemoveFamilyMember = (index: number) => {
        setFormData(prev => ({ ...prev, familyMembers: prev.familyMembers.filter((_, i) => i !== index)}));
    };

    const handleAddVehicle = () => {
        if (newVehicle.mmv && newVehicle.regNo) {
            setFormData(prev => ({ ...prev, vehicles: [...prev.vehicles, newVehicle] }));
            setNewVehicle({ mmv: '', regNo: '' });
        }
    };
    
    const handleRemoveVehicle = (index: number) => {
        setFormData(prev => ({ ...prev, vehicles: prev.vehicles.filter((_, i) => i !== index)}));
    };

    const handleSubmit = () => {
        if (!formData.fullName.trim() || !formData.mobileNumber.trim()) {
            alert('Full Name and Mobile Number are required.');
            return;
        }
        onSave(formData);
    };
    
    const FormSection: React.FC<{title: string; children: React.ReactNode}> = ({ title, children }) => (
      <div className="py-4">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">{title}</h3>
        {children}
      </div>
    );
    
    const InputField: React.FC<{label: string; name: string; value: string; onChange: any; type?: string; required?: boolean}> = (props) => (
        <div>
            <label htmlFor={props.name} className="block text-sm font-medium text-gray-700">{props.label}{props.required && <span className="text-red-500">*</span>}</label>
            <input {...props} id={props.name} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
    );
    
    const SelectField: React.FC<{label: string; name: string; value: string; onChange: any; children: React.ReactNode}> = (props) => (
        <div>
            <label htmlFor={props.name} className="block text-sm font-medium text-gray-700">{props.label}</label>
            <select id={props.name} name={props.name} value={props.value} onChange={props.onChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                {props.children}
            </select>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onDismiss}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b flex justify-between items-center">
                    <div className="flex items-center">
                         <UserPlusIcon className="h-6 w-6 text-indigo-600 mr-2" />
                         <h2 className="text-xl font-bold text-gray-900">Create New Customer</h2>
                    </div>
                    <button onClick={onDismiss} className="p-1 rounded-full hover:bg-gray-200"><XMarkIcon className="h-6 w-6" /></button>
                </div>
                
                <div className="p-6 max-h-[75vh] overflow-y-auto">
                    <FormSection title="Personal Details">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InputField label="Full Name" name="fullName" value={formData.fullName} onChange={handleInputChange} required />
                            <InputField label="Date of Birth" name="dob" value={formData.dob} onChange={handleInputChange} type="date" />
                            <SelectField label="Gender" name="gender" value={formData.gender} onChange={handleInputChange}>
                                <option>Male</option><option>Female</option><option>Other</option>
                            </SelectField>
                            <SelectField label="Marital Status" name="maritalStatus" value={formData.maritalStatus} onChange={handleInputChange}>
                                <option>Single</option><option>Married</option><option>Other</option>
                            </SelectField>
                            <InputField label="Mobile Number" name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange} type="tel" required />
                            <InputField label="Alternate Number" name="alternateNumber" value={formData.alternateNumber} onChange={handleInputChange} type="tel" />
                        </div>
                    </FormSection>

                    <FormSection title="Family Members">
                        {formData.familyMembers.map((member, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md mb-2">
                                <p>{member.name} ({member.relation}) - {member.dob}</p>
                                <button onClick={() => handleRemoveFamilyMember(index)} className="p-1 text-red-500 hover:text-red-700"><TrashIcon className="h-5 w-5"/></button>
                            </div>
                        ))}
                         <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-end p-2 border rounded-md">
                            <InputField label="Name" name="name" value={newFamilyMember.name} onChange={e => setNewFamilyMember({...newFamilyMember, name: e.target.value})} />
                            <InputField label="Relation" name="relation" value={newFamilyMember.relation} onChange={e => setNewFamilyMember({...newFamilyMember, relation: e.target.value})} />
                            <InputField label="DOB" name="dob" value={newFamilyMember.dob} onChange={e => setNewFamilyMember({...newFamilyMember, dob: e.target.value})} type="date" />
                            <button onClick={handleAddFamilyMember} className="bg-indigo-100 text-indigo-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-200 flex items-center justify-center">
                                <PlusIcon className="h-5 w-5 mr-1"/> Add
                            </button>
                         </div>
                    </FormSection>
                    
                    <FormSection title="Vehicle Details">
                         {formData.vehicles.map((vehicle, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md mb-2">
                                <p>{vehicle.mmv} ({vehicle.regNo})</p>
                                <button onClick={() => handleRemoveVehicle(index)} className="p-1 text-red-500 hover:text-red-700"><TrashIcon className="h-5 w-5"/></button>
                            </div>
                        ))}
                         <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-end p-2 border rounded-md">
                             <InputField label="Make, Model, Variant" name="mmv" value={newVehicle.mmv} onChange={e => setNewVehicle({...newVehicle, mmv: e.target.value})} />
                             <InputField label="Registration No." name="regNo" value={newVehicle.regNo} onChange={e => setNewVehicle({...newVehicle, regNo: e.target.value})} />
                             <button onClick={handleAddVehicle} className="bg-indigo-100 text-indigo-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-200 flex items-center justify-center">
                                 <PlusIcon className="h-5 w-5 mr-1"/> Add Vehicle
                             </button>
                         </div>
                    </FormSection>

                    <FormSection title="Insurance Product Interest">
                        <div className="flex items-center space-x-6">
                            <label className="flex items-center"><input type="checkbox" name="health" checked={formData.policyInterest.health} onChange={handleCheckboxChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" /><HeartIcon className="h-5 w-5 mx-2 text-red-500"/> Health</label>
                            <label className="flex items-center"><input type="checkbox" name="life" checked={formData.policyInterest.life} onChange={handleCheckboxChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" /><ShieldCheckIcon className="h-5 w-5 mx-2 text-blue-500"/> Life</label>
                            <label className="flex items-center"><input type="checkbox" name="motor" checked={formData.policyInterest.motor} onChange={handleCheckboxChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" /><TruckIcon className="h-5 w-5 mx-2 text-orange-500"/> Motor</label>
                        </div>
                    </FormSection>
                    
                    <FormSection title="Reference">
                       <InputField label="Reference (If any)" name="reference" value={formData.reference} onChange={handleInputChange} />
                    </FormSection>

                </div>
                
                <div className="p-4 border-t flex justify-end space-x-3">
                    <button onClick={onDismiss} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700">Save Customer</button>
                </div>
            </div>
        </div>
    );
};

export default CreateCustomerDialog;
