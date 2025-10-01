import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Customer, ActiveVehiclePolicy } from '../data/mockData';
import ManageVehiclesDialog from '../components/ManageVehiclesDialog';
import { 
    ArrowLeftIcon, PhoneIcon, ChatBubbleBottomCenterTextIcon, UserCircleIcon, 
    UsersIcon, ClipboardDocumentListIcon, HeartIcon, ShieldCheckIcon, 
    TruckIcon, PencilSquareIcon, SparklesIcon, CalendarDaysIcon, BanknotesIcon,
    LinkIcon, NoSymbolIcon, PlusCircleIcon, CheckIcon, XMarkIcon
} from '@heroicons/react/24/outline';

interface CustomerProfileScreenProps {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
}

const CustomerProfileScreen: React.FC<CustomerProfileScreenProps> = ({ customers, setCustomers }) => {
  const { customerId } = useParams<{ customerId: string }>();
  const customer = customers.find(c => c.id.toString() === customerId);

  const [isEditing, setIsEditing] = useState(false);
  const [editableCustomer, setEditableCustomer] = useState<Customer | null>(null);
  const [showManageVehicles, setShowManageVehicles] = useState(false);

  useEffect(() => {
    if (customer) {
      setEditableCustomer(customer);
    }
  }, [customer]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editableCustomer) {
      setEditableCustomer({ ...editableCustomer, [name]: value });
    }
  };

  const handleSave = () => {
    if (!editableCustomer?.name || !editableCustomer?.contact) {
      alert("Customer name and contact cannot be empty.");
      return;
    }
    setCustomers(prev => prev.map(c => c.id === editableCustomer.id ? editableCustomer : c));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditableCustomer(customer || null);
    setIsEditing(false);
  };
  
  const handleSaveVehicles = (updatedVehicles: ActiveVehiclePolicy[]) => {
    if (customer) {
      const updatedCustomer: Customer = {
        ...customer,
        vehicleCount: updatedVehicles.length,
        policies: {
          ...customer.policies,
          motor: {
            ...customer.policies.motor,
            vehicles: updatedVehicles,
            // If vehicles are added and status was OutOfScope, change to Opportunity
            status: updatedVehicles.length > 0 && customer.policies.motor.status === 'OutOfScope' ? 'Opportunity' : customer.policies.motor.status,
            reason: updatedVehicles.length > 0 && customer.policies.motor.status === 'OutOfScope' ? 'New vehicle added.' : customer.policies.motor.reason,
          }
        }
      };
      setCustomers(prev => prev.map(c => c.id === customer.id ? updatedCustomer : c));
    }
    setShowManageVehicles(false);
  };


  if (!customer || !editableCustomer) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl text-red-500">Customer not found</h1>
        <Link to="/dashboard" className="ml-4 text-indigo-600 hover:underline">Go Back</Link>
      </div>
    );
  }
  
  const formatCurrency = (amount?: number | null) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount || 0);

  const InfoCard: React.FC<{title: string; icon: React.ReactNode; children: React.ReactNode; action?: React.ReactNode}> = ({title, icon, children, action}) => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center">
                {icon}
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            </div>
            {action}
        </div>
        <div className="p-4 md:p-6">
            {children}
        </div>
    </div>
  );
  
  const InfoPair: React.FC<{label: string; value?: string | null}> = ({label, value}) => (
      <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="font-semibold text-gray-800">{value || '-'}</p>
      </div>
  );

  const EditableInfoPair: React.FC<{label: string; name: keyof Customer; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; required?: boolean;}> = ({label, name, value, onChange, type = 'text', required}) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-500">{label}{required && <span className="text-red-500">*</span>}</label>
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className="mt-1 block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
    </div>
  );
  
  const PolicyCard: React.FC<{policy: any; type: 'Health' | 'Life' | 'Motor'}> = ({ policy, type }) => {
    
    if (policy.status === "OutOfScope") {
        return <div className="p-4 rounded-md bg-gray-100 text-center text-gray-600">
            <p className="font-semibold">Out of Scope</p>
            <p className="text-sm">{policy.reason}</p>
        </div>
    }

    if (policy.status === "Declined") {
        return <div className="p-4 rounded-md bg-red-50 border border-red-200 text-center text-red-700">
            <p className="font-semibold">Declined</p>
            <p className="text-sm">{policy.declineReason}</p>
        </div>
    }

    if (policy.status === "Opportunity") {
      return (
        <div className="p-4 rounded-md bg-green-50 border border-green-200">
          <p className="font-semibold text-green-800 text-lg mb-2">Opportunity</p>
          <p className="text-sm text-gray-600 mb-4">{policy.reason}</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <InfoPair label="Suggested Insurer" value={policy.leadDetails?.suggestedInsurer} />
            <InfoPair label="Suggested Plan" value={policy.leadDetails?.suggestedPlan} />
            <InfoPair label="Sum Insured" value={formatCurrency(policy.leadDetails?.suggestedSumInsured)} />
            <InfoPair label="Tentative Premium" value={formatCurrency(policy.tentativePremium)} />
          </div>
           <div className="grid grid-cols-2 gap-4 mb-4">
             <InfoPair label="Potential Payout" value={formatCurrency(policy.potentialPayout)} />
             <InfoPair label="Follow-up Date" value={policy.followUpDate} />
           </div>
          {policy.cjLink && <a href={policy.cjLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-semibold flex items-center mb-4"><LinkIcon className="h-4 w-4 mr-1"/> View Quote Journey</a>}
          <div className="flex space-x-2 mt-4">
              <button className="flex-1 text-sm bg-blue-500 text-white py-2 px-3 rounded-md hover:bg-blue-600 flex items-center justify-center"><PlusCircleIcon className="h-4 w-4 mr-1"/> Add Follow-up</button>
              <button className="flex-1 text-sm bg-red-500 text-white py-2 px-3 rounded-md hover:bg-red-600 flex items-center justify-center"><NoSymbolIcon className="h-4 w-4 mr-1"/> Mark Declined</button>
          </div>
        </div>
      );
    }

    // Active policies
    if (type === 'Health' || type === 'Life') {
        return (
            <div>
                {policy.policies?.map((p: any) => (
                    <div key={p.id} className="p-4 rounded-md border border-gray-200 mb-3">
                        <p className="font-bold text-gray-800">{p.plan}</p>
                        <p className="text-sm text-gray-500">{p.insurer}</p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
                           <InfoPair label="Sum Insured" value={formatCurrency(p.sumInsured)} />
                           {p.premium && <InfoPair label="Premium" value={formatCurrency(p.premium)} />}
                           {p.planType && <InfoPair label="Plan Type" value={p.planType} />}
                           {p.insuredName && <InfoPair label="Insured" value={p.insuredName} />}
                           <InfoPair label="Renewal Date" value={p.renewalDate} />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    if (type === 'Motor') {
        return (
            <div>
                {(!policy.vehicles || policy.vehicles.length === 0) && <p className="text-gray-500 text-center">No vehicles added.</p>}
                {policy.vehicles?.map((v: any) => (
                    <div key={v.id} className="p-4 rounded-md border border-gray-200 mb-3">
                        <p className="font-bold text-gray-800">{v.regNo} - {v.mmv}</p>
                        <p className="text-sm text-gray-500">{v.insurer}</p>
                         <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
                           <InfoPair label="IDV" value={formatCurrency(v.idv)} />
                           <InfoPair label="Premium" value={formatCurrency(v.premium)} />
                           <InfoPair label="Expiry Date" value={v.expiryDate} />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return null;
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <Link to="/dashboard" className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </header>
        
        <main className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                     {/* Main Profile Card */}
                     <InfoCard 
                      title="Client Profile" 
                      icon={<UserCircleIcon className="h-6 w-6 mr-2 text-indigo-600"/>}
                      action={!isEditing ? (
                        <button onClick={() => setIsEditing(true)} className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800">
                          <PencilSquareIcon className="h-4 w-4 mr-1" />
                          Edit Details
                        </button>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <button onClick={handleSave} className="flex items-center text-sm font-medium text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md">
                            <CheckIcon className="h-4 w-4 mr-1" />
                            Save
                          </button>
                          <button onClick={handleCancel} className="flex items-center text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md">
                            <XMarkIcon className="h-4 w-4 mr-1" />
                            Cancel
                          </button>
                        </div>
                      )}
                     >
                         {!isEditing ? (
                         <>
                           <div className="flex justify-between items-start">
                               <div>
                                   <h1 className="text-3xl font-bold text-gray-900">{customer.name}</h1>
                                   <p className="text-indigo-600">{customer.occupation}</p>
                               </div>
                               <div className="flex space-x-2">
                                   <a href={`tel:${customer.contact}`} className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 shadow-md"><PhoneIcon className="h-6 w-6"/></a>
                                   <a href={`https://wa.me/${customer.contact.replace(/\s/g, '')}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-teal-500 text-white rounded-full hover:bg-teal-600 shadow-md"><ChatBubbleBottomCenterTextIcon className="h-6 w-6"/></a>
                               </div>
                           </div>
                           <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6 border-t pt-6">
                               <InfoPair label="Primary Contact" value={customer.contact} />
                               <InfoPair label="Alternate Contact" value={customer.alternateContact} />
                               <InfoPair label="Email" value={customer.email} />
                               <InfoPair label="Date of Birth" value={customer.dob} />
                               <InfoPair label="Address" value={`${customer.area}, ${customer.city}`} />
                               <InfoPair label="Lead Source" value={customer.leadSource} />
                           </div>
                         </>
                         ) : (
                          <div className="space-y-4">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <EditableInfoPair label="Full Name" name="name" value={editableCustomer.name} onChange={handleInputChange} required />
                               <EditableInfoPair label="Occupation" name="occupation" value={editableCustomer.occupation || ''} onChange={handleInputChange} />
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <EditableInfoPair label="Primary Contact" name="contact" value={editableCustomer.contact} onChange={handleInputChange} type="tel" required />
                               <EditableInfoPair label="Alternate Contact" name="alternateContact" value={editableCustomer.alternateContact || ''} onChange={handleInputChange} type="tel" />
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <EditableInfoPair label="Email" name="email" value={editableCustomer.email || ''} onChange={handleInputChange} type="email" />
                               <EditableInfoPair label="Date of Birth" name="dob" value={editableCustomer.dob || ''} onChange={handleInputChange} type="date" />
                             </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <EditableInfoPair label="City" name="city" value={editableCustomer.city} onChange={handleInputChange} />
                                  <EditableInfoPair label="Area" name="area" value={editableCustomer.area} onChange={handleInputChange} />
                              </div>
                             <EditableInfoPair label="Lead Source" name="leadSource" value={editableCustomer.leadSource || ''} onChange={handleInputChange} />
                          </div>
                         )}

                         {customer.policies.motor.vehicles && customer.policies.motor.vehicles.length > 0 && (
                            <div className="mt-6 border-t pt-6">
                                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Vehicles ({customer.vehicleCount})</h4>
                                <div className="space-y-2">
                                    {customer.policies.motor.vehicles.map(vehicle => (
                                        <div key={vehicle.id} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded-md">
                                            <p className="font-semibold text-gray-800">{vehicle.mmv}</p>
                                            <p className="text-gray-600 font-mono bg-gray-200 px-2 py-0.5 rounded">{vehicle.regNo}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                          )}
                     </InfoCard>

                     {/* Policy Cards */}
                     <InfoCard title="Health Insurance" icon={<HeartIcon className="h-6 w-6 mr-2 text-red-500"/>}><PolicyCard policy={customer.policies.health} type="Health"/></InfoCard>
                     <InfoCard title="Life Insurance" icon={<ShieldCheckIcon className="h-6 w-6 mr-2 text-blue-500"/>}><PolicyCard policy={customer.policies.life} type="Life"/></InfoCard>
                     <InfoCard 
                        title="Motor Insurance" 
                        icon={<TruckIcon className="h-6 w-6 mr-2 text-orange-500"/>}
                        action={<button onClick={() => setShowManageVehicles(true)} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center"><PencilSquareIcon className="h-4 w-4 mr-1"/> Add/Edit</button>}
                     >
                        <PolicyCard policy={customer.policies.motor} type="Motor"/>
                     </InfoCard>
                  </div>

                  <div className="lg:col-span-1 space-y-8">
                      {/* Family Members Card */}
                      <InfoCard 
                          title="Family Members" 
                          icon={<UsersIcon className="h-6 w-6 mr-2 text-teal-500"/>}
                          action={<button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center"><PencilSquareIcon className="h-4 w-4 mr-1"/> Add/Edit</button>}
                      >
                         <div className="space-y-4">
                             {customer.familyMembers.map(member => (
                                 <div key={member.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                                     <div>
                                         <p className="font-semibold">{member.name} ({member.relationship})</p>
                                         <p className="text-sm text-gray-500">DOB: {member.dob} (Age: {member.age})</p>
                                     </div>
                                 </div>
                             ))}
                             {customer.familyMembers.length === 0 && <p className="text-gray-500 text-center">No family members added.</p>}
                         </div>
                      </InfoCard>
                      
                      {/* Activity Log Card */}
                      <InfoCard title="Activity Log" icon={<ClipboardDocumentListIcon className="h-6 w-6 mr-2 text-purple-500"/>}>
                         <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                             {customer.activityLog.map(log => (
                                 <div key={log.id} className="relative pl-6">
                                     <div className="absolute left-0 top-1.5 h-full border-l-2 border-gray-200"></div>
                                     <div className="absolute left-[-5px] top-1.5 h-3 w-3 rounded-full bg-indigo-500"></div>
                                     <p className="text-sm text-gray-500">{log.date}</p>
                                     <p className="font-semibold text-gray-800">{log.activity} ({log.product})</p>
                                     <p className="text-sm text-gray-600">{log.remarks}</p>
                                 </div>
                             ))}
                         </div>
                      </InfoCard>
                  </div>
              </div>
          </div>
        </main>
      </div>
      {showManageVehicles && (
        <ManageVehiclesDialog
          initialVehicles={customer.policies.motor.vehicles || []}
          onDismiss={() => setShowManageVehicles(false)}
          onSave={handleSaveVehicles}
        />
      )}
    </>
  );
};

export default CustomerProfileScreen;