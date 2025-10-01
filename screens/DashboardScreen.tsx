
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockAgentData, mockCustomers, Customer, Policies, Agent } from '../data/mockData';
import DigitalVCardDialog from '../components/DigitalVCardDialog';
import InviteCustomersDialog from '../components/InviteCustomersDialog';
import CreateCustomerDialog from '../components/CreateCustomerDialog';
import {
  UserGroupIcon,
  CalendarDaysIcon,
  PhoneArrowUpRightIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  ChevronRightIcon,
  HomeIcon,
  PhoneIcon,
  ChatBubbleBottomCenterTextIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';
// Fix: Replaced non-existent `UserCardIcon` with `UserIcon` as suggested by the error.
import { PlusIcon, UserIcon, UserPlusIcon, CurrencyRupeeIcon } from '@heroicons/react/24/solid';

type ActiveFilter = 'ALL' | 'OPPORTUNITIES' | 'RENEWALS' | 'FOLLOWUPS';

interface DashboardScreenProps {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ customers, setCustomers }) => {
  const [agentData, setAgentData] = useState(mockAgentData);
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [areaFilter, setAreaFilter] = useState('all');
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [showVCard, setShowVCard] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [showCreateCustomer, setShowCreateCustomer] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Customer Portfolio";
  }, []);
  
  const handleCreateCustomer = (formData: any) => {
    const newCustomer: Customer = {
        id: Math.max(0, ...customers.map(c => c.id)) + 1,
        name: formData.fullName,
        contact: formData.mobileNumber,
        alternateContact: formData.alternateNumber || null,
        email: null,
        city: 'Unknown',
        area: 'Unknown',
        fullAddress: null,
        dob: formData.dob || null,
        occupation: null,
        leadSource: formData.reference || 'Manual Entry',
        vehicleCount: formData.vehicles.length,
        familyMembers: formData.familyMembers.map((fm: any, index: number) => ({
            id: Date.now() + index,
            name: fm.name,
            relationship: fm.relation,
            dob: fm.dob,
            age: fm.dob ? new Date().getFullYear() - new Date(fm.dob).getFullYear() : 0,
        })),
        activityLog: [
            { id: 1, date: new Date().toISOString().split('T')[0], product: 'General', activity: 'Customer Created', remarks: 'Manually added to CRM.' }
        ],
        policies: {
            health: {
                status: formData.policyInterest.health ? 'Opportunity' : 'OutOfScope',
                reason: formData.policyInterest.health ? 'New customer interest.' : 'Not specified at creation.',
            },
            life: {
                status: formData.policyInterest.life ? 'Opportunity' : 'OutOfScope',
                reason: formData.policyInterest.life ? 'New customer interest.' : 'Not specified at creation.',
            },
            motor: {
                status: formData.vehicles.length > 0 ? 'Opportunity' : 'OutOfScope',
                reason: formData.vehicles.length > 0 ? 'Vehicle details provided.' : 'No vehicle details.',
                vehicles: formData.vehicles.map((v: any, index: number) => ({
                    id: `v-${Date.now() + index}`,
                    regNo: v.regNo,
                    mmv: v.mmv,
                    premium: 0,
                    idv: 0,
                    expiryDate: '',
                    insurer: '',
                }))
            }
        }
    };
    setCustomers(prev => [newCustomer, ...prev]);
    setShowCreateCustomer(false);
  };
  
  const handlePhotoChange = (newPhotoUrl: string) => {
    setAgentData(prev => ({
      ...prev,
      photoUrl: newPhotoUrl
    }));
  };
  
  const handleAgentDataChange = (updatedData: Partial<Agent>) => {
    setAgentData(prev => ({ ...prev, ...updatedData }));
  };


  const getCustomerTotalPayout = (customer: Customer): number => {
    const healthPayout = (customer.policies.health.status === "Opportunity" && !customer.policies.health.isDeclined) ? customer.policies.health.potentialPayout || 0 : 0;
    const lifePayout = (customer.policies.life.status === "Opportunity" && !customer.policies.life.isDeclined) ? customer.policies.life.potentialPayout || 0 : 0;
    const motorPayout = (customer.policies.motor.status === "Opportunity" && !customer.policies.motor.isDeclined) ? customer.policies.motor.potentialPayout || 0 : 0;
    return healthPayout + lifePayout + motorPayout;
  };

  const isRenewalDue = (customer: Customer): boolean => {
      const now = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(now.getDate() + 30);
      const checkDate = (dateStr: string | undefined) => {
          if(!dateStr) return false;
          const renewalDate = new Date(dateStr);
          return renewalDate > now && renewalDate <= thirtyDaysFromNow;
      };

      const healthRenewal = customer.policies.health.policies?.some(p => checkDate(p.renewalDate)) ?? false;
      const lifeRenewal = customer.policies.life.policies?.some(p => checkDate(p.renewalDate)) ?? false;
      const motorRenewal = customer.policies.motor.vehicles?.some(v => checkDate(v.expiryDate)) ?? false;
      return healthRenewal || lifeRenewal || motorRenewal;
  };

  const isFollowUpDue = (customer: Customer): boolean => {
      const now = new Date();
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(now.getDate() + 7);
      const checkDate = (dateStr: string | undefined) => {
        if(!dateStr) return false;
        const followupDate = new Date(dateStr);
        return followupDate > now && followupDate <= sevenDaysFromNow;
      };
      
      return checkDate(customer.policies.health.followUpDate) || checkDate(customer.policies.life.followUpDate);
  };
  
  const opportunitiesCount = useMemo(() => customers.filter(c => getCustomerTotalPayout(c) > 0).length, [customers]);
  const renewalsCount = useMemo(() => customers.filter(isRenewalDue).length, [customers]);
  const followupsCount = useMemo(() => customers.filter(isFollowUpDue).length, [customers]);

  const uniqueCities = useMemo(() => ['all', ...Array.from(new Set(customers.map(c => c.city)))], [customers]);
  const uniqueAreas = useMemo(() => {
    if (cityFilter === 'all') return ['all'];
    return ['all', ...Array.from(new Set(customers.filter(c => c.city === cityFilter).map(c => c.area)))];
  }, [customers, cityFilter]);

  const filteredCustomers = useMemo(() => {
    let filtered = customers.filter(c => {
      const searchTermMatch = (term: string) => c.name.toLowerCase().includes(term) || c.contact.toLowerCase().includes(term);
      const cityMatch = cityFilter === 'all' || c.city === cityFilter;
      const areaMatch = areaFilter === 'all' || c.area === areaFilter;
      return searchTermMatch(searchTerm.toLowerCase()) && cityMatch && areaMatch;
    });

    switch (activeFilter) {
      case 'OPPORTUNITIES':
        filtered = filtered.filter(c => getCustomerTotalPayout(c) > 0);
        break;
      case 'RENEWALS':
        filtered = filtered.filter(isRenewalDue);
        break;
      case 'FOLLOWUPS':
        filtered = filtered.filter(isFollowUpDue);
        break;
      default:
        break;
    }
    
    if (activeFilter === 'OPPORTUNITIES') {
        return filtered.sort((a, b) => getCustomerTotalPayout(b) - getCustomerTotalPayout(a));
    }

    return filtered;
  }, [customers, searchTerm, activeFilter, cityFilter, areaFilter]);

  const filteredPayout = useMemo(() => {
    return filteredCustomers.reduce((acc, c) => {
        if (c.policies.health.status === "Opportunity" && !c.policies.health.isDeclined) acc.health += c.policies.health.potentialPayout || 0;
        if (c.policies.life.status === "Opportunity" && !c.policies.life.isDeclined) acc.life += c.policies.life.potentialPayout || 0;
        if (c.policies.motor.status === "Opportunity" && !c.policies.motor.isDeclined) acc.motor += c.policies.motor.potentialPayout || 0;
        acc.total = acc.health + acc.life + acc.motor;
        return acc;
    }, { health: 0, life: 0, motor: 0, total: 0 });
  }, [filteredCustomers]);

  const clearFilters = () => {
    setSearchTerm('');
    setActiveFilter('ALL');
    setCityFilter('all');
    setAreaFilter('all');
    setFiltersExpanded(false);
  };

  const HeaderDashboard = () => (
    <div className="hidden md:grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-3">
        <div className="bg-blue-100 p-3 rounded-full"><UserGroupIcon className="h-6 w-6 text-blue-600"/></div>
        <div>
          <p className="text-gray-500 text-sm">Total Customers</p>
          <p className="text-2xl font-bold">{customers.length}</p>
        </div>
      </div>
      <DashboardCard type="OPPORTUNITIES" count={opportunitiesCount} label="Opportunities" icon={<CurrencyRupeeIcon className="h-6 w-6 text-green-600"/>} color="green" />
      <DashboardCard type="RENEWALS" count={renewalsCount} label="Renewals Due" icon={<CalendarDaysIcon className="h-6 w-6 text-orange-600"/>} color="orange" />
      <DashboardCard type="FOLLOWUPS" count={followupsCount} label="Follow-ups" icon={<PhoneArrowUpRightIcon className="h-6 w-6 text-purple-600"/>} color="purple" />
    </div>
  );

  // Fix: Changed `JSX.Element` to `React.ReactNode` to resolve JSX namespace error.
  const DashboardCard = ({ type, count, label, icon, color }: { type: ActiveFilter, count: number, label: string, icon: React.ReactNode, color: string }) => {
    const isActive = activeFilter === type;
    const baseClasses = "p-4 rounded-lg shadow flex items-center space-x-3 cursor-pointer transition-all duration-200";
    const colorClasses = {
      green: { bg: 'bg-green-100', text: 'text-green-600', active: 'ring-2 ring-green-500 bg-green-50' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-600', active: 'ring-2 ring-orange-500 bg-orange-50' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600', active: 'ring-2 ring-purple-500 bg-purple-50' },
    };
    const currentColors = colorClasses[color as keyof typeof colorClasses];
    
    return (
      <div className={`${baseClasses} ${isActive ? currentColors.active : 'bg-white'}`} onClick={() => setActiveFilter(prev => prev === type ? 'ALL' : type)}>
        <div className={`${currentColors.bg} p-3 rounded-full`}>{icon}</div>
        <div>
          <p className="text-gray-500 text-sm">{label}</p>
          <p className="text-2xl font-bold">{count}</p>
        </div>
      </div>
    );
  };

  const BottomNavBar = () => {
    const navItems = [
      { filter: 'ALL', label: 'Home', icon: <HomeIcon className="h-6 w-6 mx-auto mb-1" /> },
      { filter: 'OPPORTUNITIES', label: 'Opportunity', icon: <CurrencyRupeeIcon className="h-6 w-6 mx-auto mb-1" /> },
      { filter: 'RENEWALS', label: 'Renewal Due', icon: <CalendarDaysIcon className="h-6 w-6 mx-auto mb-1" /> },
      { filter: 'FOLLOWUPS', label: 'Follow-up', icon: <PhoneArrowUpRightIcon className="h-6 w-6 mx-auto mb-1" /> },
    ] as const;

    return (
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-1px_3px_rgba(0,0,0,0.1)] z-40">
        <div className="flex justify-around">
          {navItems.map(item => (
            <button
              key={item.filter}
              onClick={() => setActiveFilter(item.filter)}
              className={`flex-1 text-center py-2 px-1 text-xs transition-colors ${
                activeFilter === item.filter
                  ? 'text-indigo-600'
                  : 'text-gray-500 hover:text-indigo-600'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const CompactStatusChip: React.FC<{policy: any; type: 'H' | 'L' | 'M'}> = ({ policy, type }) => {
    let bgColor, textColor, text;
    const prefix = `${type}`;

    switch(policy.status) {
        case 'Opportunity':
            bgColor = 'bg-green-100'; textColor = 'text-green-800'; text = 'Opp'; break;
        case 'Active':
            bgColor = 'bg-blue-100'; textColor = 'text-blue-800'; text = 'Active'; break;
        case 'Declined':
            bgColor = 'bg-red-100'; textColor = 'text-red-800'; text = 'Declined'; break;
        case 'OutOfScope':
            bgColor = 'bg-gray-200'; textColor = 'text-gray-700'; text = 'N/A'; break;
        default: return null;
    }
    return (
        <span className={`text-xs font-semibold inline-flex items-center px-2 py-0.5 rounded-full ${bgColor} ${textColor}`}>
            {prefix}
        </span>
    );
  };


  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-bold leading-tight text-gray-900">
                    Customer Portfolio
                </h1>
            </div>
        </header>
        <main className="py-6 pb-24 md:pb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <HeaderDashboard />
                
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
                    <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Cross/Upsell Opportunities</h2>
                        <div className="flex items-center space-x-2">
                           <button onClick={() => setShowVCard(true)} className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-100 px-3 py-2 rounded-md">
                                <UserIcon className="h-5 w-5 mr-1" />
                                My Card
                            </button>
                            <button onClick={() => setShowCreateCustomer(true)} className="flex items-center text-sm font-medium text-white bg-gray-700 hover:bg-gray-800 px-3 py-2 rounded-md shadow">
                                <UserPlusIcon className="h-5 w-5 mr-1" />
                                Create
                            </button>
                            <button onClick={() => setShowInvite(true)} className="flex items-center text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-2 rounded-md shadow">
                                <PlusIcon className="h-5 w-5 mr-1" />
                                Invite & Earn
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                        <div className="relative flex-grow">
                             <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" />
                             <input 
                                type="text" 
                                placeholder="Search by name or contact..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" 
                            />
                        </div>
                        <button onClick={() => setFiltersExpanded(!filtersExpanded)} className="flex items-center justify-center sm:w-auto w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                            <FunnelIcon className="h-5 w-5 mr-2" />
                            Filters
                            <ChevronDownIcon className={`h-5 w-5 ml-2 transition-transform ${filtersExpanded ? 'rotate-180' : ''}`} />
                        </button>
                    </div>

                    {filtersExpanded && (
                        <div className="p-4 bg-gray-50 rounded-md mb-4 border border-gray-200">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                               <div>
                                   <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                                   <select id="city" value={cityFilter} onChange={e => {setCityFilter(e.target.value); setAreaFilter('all');}} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                        {uniqueCities.map(city => <option key={city} value={city}>{city === 'all' ? 'All Cities' : city}</option>)}
                                   </select>
                               </div>
                               <div>
                                   <label htmlFor="area" className="block text-sm font-medium text-gray-700">Area</label>
                                   <select id="area" value={areaFilter} onChange={e => setAreaFilter(e.target.value)} disabled={cityFilter === 'all'} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md disabled:bg-gray-100">
                                        {uniqueAreas.map(area => <option key={area} value={area}>{area === 'all' ? 'All Areas' : area}</option>)}
                                   </select>
                               </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button onClick={clearFilters} className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800">
                                    <XMarkIcon className="h-4 w-4 mr-1" />
                                    Clear All Filters
                                </button>
                            </div>
                        </div>
                    )}
                    
                    <div className="bg-gray-100 p-3 rounded-md mb-4 flex flex-wrap justify-between items-center gap-x-6 gap-y-2 text-sm">
                        <p className="font-semibold text-gray-700">{filteredCustomers.length} Customers Found</p>
                        <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-gray-600">
                            <span className="font-semibold">Potential Payout:</span>
                            <span>Health: <span className="font-bold text-green-700">₹{filteredPayout.health.toLocaleString('en-IN')}</span></span>
                            <span>Life: <span className="font-bold text-blue-700">₹{filteredPayout.life.toLocaleString('en-IN')}</span></span>
                            <span>Motor: <span className="font-bold text-orange-700">₹{filteredPayout.motor.toLocaleString('en-IN')}</span></span>
                            <span className="font-bold text-gray-800">Total: ₹{filteredPayout.total.toLocaleString('en-IN')}</span>
                        </div>
                    </div>

                    <div className="divide-y divide-gray-200">
                      {filteredCustomers.map(customer => {
                        const opportunityAmount = getCustomerTotalPayout(customer);
                        return (
                          <div key={customer.id} onClick={() => navigate(`/customer/${customer.id}`)} className="py-3 px-2 hover:bg-gray-50 cursor-pointer">
                              <div className="flex flex-col gap-1.5">
                                  {/* Line 1 */}
                                  <div className="flex justify-between items-center gap-2">
                                      <p className="font-bold text-gray-800 text-base truncate pr-2">{customer.name}</p>
                                      <div className="flex items-center shrink-0 space-x-1">
                                          {opportunityAmount > 0 && (
                                              <div className="flex items-center text-sm font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                                  <CurrencyRupeeIcon className="h-4 w-4 mr-0.5" />
                                                  <span>{opportunityAmount.toLocaleString('en-IN')}</span>
                                              </div>
                                          )}
                                          <a href={`tel:${customer.contact}`} onClick={(e) => e.stopPropagation()} className="p-2 text-gray-500 hover:text-green-600 rounded-full"><PhoneIcon className="h-5 w-5"/></a>
                                          <a href={`https://wa.me/${customer.contact.replace(/\s/g, '')}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="p-2 text-gray-500 hover:text-teal-600 rounded-full"><ChatBubbleBottomCenterTextIcon className="h-5 w-5"/></a>
                                          <ChevronRightIcon className="h-6 w-6 text-gray-400" />
                                      </div>
                                  </div>
                                  {/* Line 2 */}
                                  <div className="flex items-center flex-wrap gap-x-3 gap-y-2 text-sm text-gray-500">
                                      <span>{customer.contact}</span>
                                      <span className="text-gray-300 hidden sm:inline">|</span>
                                      <span className="hidden sm:inline">{customer.city}, {customer.area}</span>
                                      <div className="flex items-center gap-2 flex-wrap">
                                          <CompactStatusChip policy={customer.policies.health} type="H" />
                                          <CompactStatusChip policy={customer.policies.life} type="L" />
                                          <CompactStatusChip policy={customer.policies.motor} type="M" />
                                      </div>
                                  </div>
                              </div>
                          </div>
                        )
                      })}
                    </div>

                </div>
            </div>
        </main>
      </div>
      <BottomNavBar />
      {showVCard && <DigitalVCardDialog agent={agentData} onDismiss={() => setShowVCard(false)} onPhotoChange={handlePhotoChange} onAgentDataChange={handleAgentDataChange} />}
      {showInvite && <InviteCustomersDialog agent={agentData} onDismiss={() => setShowInvite(false)} />}
      {showCreateCustomer && <CreateCustomerDialog onDismiss={() => setShowCreateCustomer(false)} onSave={handleCreateCustomer} />}
    </>
  );
};

export default DashboardScreen;