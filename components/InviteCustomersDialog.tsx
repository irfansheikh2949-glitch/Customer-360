import React, { useState } from 'react';
import { ArrowLeftIcon, CheckCircleIcon, UserPlusIcon, PaperAirplaneIcon, UsersIcon } from '@heroicons/react/24/solid';
import { Agent } from '../data/mockData';

interface InviteCustomersDialogProps {
  agent: Agent;
  onDismiss: () => void;
}

const mockContacts = [
  { id: 'c1', name: 'Aarav Gupta', phone: '+91 91234 56780' },
  { id: 'c2', name: 'Isha Reddy', phone: '+91 91234 56781' },
  { id: 'c3', name: 'Kabir Khan', phone: '+91 91234 56782' },
  { id: 'c4', name: 'Zoya Singh', phone: '+91 91234 56783' },
  { id: 'c5', name: 'Rohan Mehra', phone: '+91 91234 56784' },
];

const InviteCustomersDialog: React.FC<InviteCustomersDialogProps> = ({ agent, onDismiss }) => {
  const [step, setStep] = useState(1);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

  const handleSelectContact = (id: string) => {
    setSelectedContacts(prev =>
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };
  
  const handleSendInvites = () => {
    const vCardLink = `https://my-insurance-hub.com/advisor/${agent.name.replace(/\s/g, '-')}`;
    const selected = mockContacts.filter(contact => selectedContacts.includes(contact.id));
    
    selected.forEach(contact => {
        const customerName = contact.name.split(' ')[0]; // Just use first name
        const message = `Hello ${customerName},

I hope you are doing well! 🌸

As your trusted insurance advisor, I am here to provide you with complete protection solutions for you and your family. I deal in all types of insurance products to secure your health, wealth, and future:

✅ Health Insurance – Covers hospital bills & medical emergencies. Protects your family’s health and reduces financial stress.
✅ Life Term Insurance – Ensures your loved ones are financially secure, even in your absence.
✅ Investment Plans – Helps you build wealth with guaranteed returns while protecting your financial goals.
✅ Motor Insurance – Safeguards your vehicles against accidents, damage, and third-party liabilities.

You can view my digital card and contact me here: ${vCardLink}`;

        const whatsappUrl = `https://wa.me/${contact.phone.replace(/\s|\+/g, '')}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    });

    setStep(3);
  };

  const Step1 = () => (
    <div className="text-center">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
        <UserPlusIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
      </div>
      <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">Invite New Customers</h3>
      <p className="mt-2 text-sm text-gray-500">
        Grow your portfolio by inviting potential customers from your phone contacts.
      </p>
      <button
        type="button"
        className="mt-6 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none"
        onClick={() => setStep(2)}
      >
        Import from Contacts
      </button>
    </div>
  );

  const Step2 = () => (
    <div>
        <div className="flex items-center mb-4">
            <button onClick={() => setStep(1)} className="p-1 rounded-full hover:bg-gray-100"><ArrowLeftIcon className="h-5 w-5"/></button>
            <h3 className="text-lg leading-6 font-medium text-gray-900 ml-2">Select Contacts to Invite</h3>
        </div>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
        {mockContacts.map(contact => (
            <div 
                key={contact.id} 
                onClick={() => handleSelectContact(contact.id)}
                className={`flex items-center p-3 rounded-lg cursor-pointer ${selectedContacts.includes(contact.id) ? 'bg-indigo-100' : 'bg-gray-50 hover:bg-gray-100'}`}
            >
                <input
                    type="checkbox"
                    checked={selectedContacts.includes(contact.id)}
                    readOnly
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <div className="ml-3">
                    <p className="font-semibold">{contact.name}</p>
                    <p className="text-sm text-gray-500">{contact.phone}</p>
                </div>
            </div>
        ))}
        </div>
        <button
            type="button"
            disabled={selectedContacts.length === 0}
            className="mt-6 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none disabled:bg-indigo-300"
            onClick={handleSendInvites}
        >
            <PaperAirplaneIcon className="h-5 w-5 mr-2" />
            Send WhatsApp Invite ({selectedContacts.length})
        </button>
    </div>
  );
  
  const Step3 = () => (
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <CheckCircleIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
        </div>
        <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">Invites Sent!</h3>
        <p className="mt-2 text-sm text-gray-500">
            Your invitation has been successfully sent to {selectedContacts.length} contact(s).
        </p>
        <button
            type="button"
            className="mt-6 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
            onClick={onDismiss}
        >
            Done
        </button>
      </div>
  );
  
  const renderStep = () => {
      switch(step) {
          case 1: return <Step1 />;
          case 2: return <Step2 />;
          case 3: return <Step3 />;
          default: return <Step1 />;
      }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onDismiss}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
        {renderStep()}
      </div>
    </div>
  );
};

export default InviteCustomersDialog;