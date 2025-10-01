import React, { useState, useRef, ChangeEvent } from 'react';
import { Agent } from '../data/mockData';
import { PhoneIcon, ChatBubbleBottomCenterTextIcon, EnvelopeIcon, ShareIcon, ArrowDownTrayIcon, ShieldCheckIcon, HeartIcon, TruckIcon, BuildingOffice2Icon, CameraIcon, PencilIcon } from '@heroicons/react/24/solid';

interface DigitalVCardDialogProps {
  agent: Agent;
  onDismiss: () => void;
  onPhotoChange: (newPhotoUrl: string) => void;
  onAgentDataChange: (updatedData: Partial<Agent>) => void;
}

const DigitalVCardDialog: React.FC<DigitalVCardDialogProps> = ({ agent, onDismiss, onPhotoChange, onAgentDataChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableAgent, setEditableAgent] = useState(agent);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleShare = () => {
    const link = `https://my-insurance-hub.com/advisor/${agent.name.replace(/ /g, '-')}`;
    const message = `Hello! I'm sharing my digital visiting card with you. Feel free to reach out for any insurance needs.\n\n*${agent.name}*\n${agent.title}\n\nView my card: ${link}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handlePhotoUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          onPhotoChange(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditableAgent(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = () => {
    onAgentDataChange(editableAgent);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditableAgent(agent);
    setIsEditing(false);
  };

  const ProductIcon: React.FC<{icon: React.ReactNode, label: string, color: string}> = ({icon, label, color}) => (
      <div className="flex flex-col items-center space-y-1">
          <div className={`p-3 rounded-full bg-${color}-100`}>{icon}</div>
          <p className={`text-sm font-semibold text-${color}-700`}>{label}</p>
      </div>
  );
  
  const ContactButton: React.FC<{icon: React.ReactNode, label: string, subLabel: string, href: string}> = ({ icon, label, subLabel, href }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="w-full flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
        <div className="bg-gray-200 p-2 rounded-full">{icon}</div>
        <div>
            <p className="font-semibold text-gray-800">{label}</p>
            <p className="text-sm text-gray-500">{subLabel}</p>
        </div>
    </a>
  );
  
  const EditableField: React.FC<{name: keyof Agent, value: string, placeholder: string}> = ({name, value, placeholder}) => (
    <input
        type={name === 'email' ? 'email' : name === 'phone' ? 'tel' : 'text'}
        name={name}
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="w-full text-center px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
    />
  );


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onDismiss}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="relative">
            <div className="h-40 bg-gradient-to-r from-blue-800 to-indigo-700 p-4 flex items-start space-x-2">
                <BuildingOffice2Icon className="h-6 w-6 text-white opacity-80" />
                <p className="text-white opacity-80 font-bold">PBPartners</p>
            </div>
            <div className="absolute top-24 left-1/2 -translate-x-1/2 group">
                <img src={agent.photoUrl} alt={agent.name} className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover" />
                <button 
                  onClick={handlePhotoUploadClick}
                  className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center rounded-full transition-opacity duration-300"
                  aria-label="Change profile picture"
                >
                  <CameraIcon className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
            </div>
             {!isEditing && (
                <button onClick={() => setIsEditing(true)} className="absolute top-4 right-4 bg-white/20 p-2 rounded-full text-white hover:bg-white/30">
                    <PencilIcon className="h-5 w-5"/>
                </button>
            )}
        </div>
        
        <div className="pt-20 pb-6 px-6 text-center">
            {isEditing ? (
              <div className="space-y-2">
                <EditableField name="name" value={editableAgent.name} placeholder="Full Name" />
                <EditableField name="title" value={editableAgent.title} placeholder="Your Title" />
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900">{agent.name}</h2>
                <p className="text-indigo-600 font-semibold">{agent.title}</p>
              </>
            )}
            
            <div className="my-6 p-3 bg-gray-100 rounded-lg text-sm text-gray-700">
              Your one-stop solution for free, expert advice on all insurance products from all major companies.
            </div>

            <div className="flex justify-around mb-6">
                <ProductIcon icon={<HeartIcon className="h-6 w-6 text-red-500"/>} label="Health" color="red"/>
                <ProductIcon icon={<ShieldCheckIcon className="h-6 w-6 text-green-500"/>} label="Life" color="green"/>
                <ProductIcon icon={<TruckIcon className="h-6 w-6 text-blue-500"/>} label="Motor" color="blue"/>
            </div>
            
            {isEditing ? (
                 <div className="space-y-3 mb-6">
                    <EditableField name="phone" value={editableAgent.phone} placeholder="Phone Number" />
                    <EditableField name="email" value={editableAgent.email} placeholder="Email Address" />
                 </div>
            ) : (
                <div className="space-y-3 mb-6">
                    <ContactButton icon={<PhoneIcon className="h-5 w-5 text-gray-600"/>} label={agent.phone} subLabel="Call Me" href={`tel:${agent.phone}`} />
                    <ContactButton icon={<ChatBubbleBottomCenterTextIcon className="h-5 w-5 text-gray-600"/>} label="Chat for free advice" subLabel="WhatsApp" href={`https://wa.me/${agent.phone.replace(/\s/g, '')}`} />
                    <ContactButton icon={<EnvelopeIcon className="h-5 w-5 text-gray-600"/>} label={agent.email} subLabel="Email" href={`mailto:${agent.email}`} />
                </div>
            )}

            {isEditing ? (
              <div className="flex space-x-3">
                  <button onClick={handleSaveChanges} className="w-full flex items-center justify-center py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors">
                      Save Changes
                  </button>
                   <button onClick={handleCancelEdit} className="w-full flex items-center justify-center py-3 px-4 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                      Cancel
                  </button>
              </div>
            ) : (
              <div className="flex space-x-3">
                  <button onClick={handleShare} className="w-full flex items-center justify-center py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors">
                      <ShareIcon className="h-5 w-5 mr-2" />
                      Share on WhatsApp
                  </button>
                   <button className="w-full flex items-center justify-center py-3 px-4 bg-white text-indigo-600 font-semibold rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-colors">
                      <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                      Save
                  </button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default DigitalVCardDialog;