import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  User,
  Package,
  MapPin,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Truck,
  ArrowLeft,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  Lock,
  ExternalLink,
  ChevronRight,
  XCircle
} from 'lucide-react';

export default function AccountPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    currentUser,
    setCurrentUser,
    logoutUser,
    openAuthModal,
    orders,
    fetchUserOrders,
    cancelUserOrder
  } = useShop();

  // Active Tab state: 'profile' | 'orders' | 'addresses'
  const activeTabParam = searchParams.get('tab') || 'orders';
  const [activeTab, setActiveTab] = useState(activeTabParam);

  // Selected Order for detail & tracking view
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [cancelReasonOption, setCancelReasonOption] = useState('Ordered by mistake');
  const [cancelReasonCustom, setCancelReasonCustom] = useState('');
  const [isCancellingOrder, setIsCancellingOrder] = useState(false);

  // Profile Form state
  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [profilePhoneError, setProfilePhoneError] = useState('');
  const [addressPhoneError, setAddressPhoneError] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Change Password state
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmNewPasswordInput, setConfirmNewPasswordInput] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Saved Addresses state
  const [addresses, setAddresses] = useState([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });

  // Sync inputs when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setNameInput(currentUser.name || '');
      setPhoneInput(currentUser.phone || '');
      if (typeof fetchUserOrders === 'function') {
        fetchUserOrders();
      }
      fetchAddresses();
    }
  }, [currentUser]);

  // Sync URL query params with tabs
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedOrder(null);
    setSearchParams({ tab });
  };

  const fetchAddresses = async () => {
    if (!currentUser) return;
    setIsLoadingAddresses(true);
    try {
      const res = await api.get('/addresses');
      if (res.data?.addresses) {
        setAddresses(res.data.addresses);
      }
    } catch (err) {
      console.error('Error fetching addresses:', err);
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  // Handle Profile Update
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    const cleanPhone = phoneInput.trim().replace(/\D/g, '');
    if (!phoneInput.trim() || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      setProfilePhoneError('Enter a valid 10-digit mobile number');
      toast.error('Enter a valid 10-digit mobile number');
      return;
    } else {
      setProfilePhoneError('');
    }

    setIsSavingProfile(true);
    try {
      const res = await api.put('/users/me', {
        name: nameInput.trim(),
        phone: cleanPhone
      });

      if (res.data?.user) {
        setCurrentUser(res.data.user);
        toast.success('Profile details updated successfully');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Address CRUD Handlers
  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddressPhoneError('');
    setAddressForm({
      fullName: currentUser?.name || '',
      phone: currentUser?.phone || '',
      street: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: addresses.length === 0
    });
    setIsAddressModalOpen(true);
  };

  const handleOpenEditAddress = (addr) => {
    setEditingAddressId(addr.id);
    setAddressPhoneError('');
    setAddressForm({
      fullName: addr.fullName || '',
      phone: addr.phone || '',
      street: addr.street || '',
      city: addr.city || '',
      state: addr.state || '',
      pincode: addr.pincode || '',
      isDefault: !!addr.isDefault
    });
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!addressForm.fullName || !addressForm.phone || !addressForm.street || !addressForm.city || !addressForm.state || !addressForm.pincode) {
      toast.error('Please fill in all required address fields');
      return;
    }

    const cleanPhone = (addressForm.phone || '').trim().replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setAddressPhoneError('Enter a valid 10-digit mobile number');
      toast.error('Enter a valid 10-digit mobile number');
      return;
    } else {
      setAddressPhoneError('');
    }

    try {
      const payload = { ...addressForm, phone: cleanPhone };
      if (editingAddressId) {
        const res = await api.put(`/addresses/${editingAddressId}`, payload);
        if (res.data?.address) {
          toast.success('Address updated');
        }
      } else {
        const res = await api.post('/addresses', payload);
        if (res.data?.address) {
          toast.success('New address added');
        }
      }
      setIsAddressModalOpen(false);
      fetchAddresses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save address');
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Are you sure you want to delete this saved address?')) return;
    try {
      await api.delete(`/addresses/${id}`);
      toast.success('Address deleted');
      fetchAddresses();
    } catch (err) {
      toast.error('Failed to delete address');
    }
  };

  const handleConfirmCancel = async () => {
    if (!orderToCancel) return;
    const finalReason = cancelReasonOption === 'Other' 
      ? (cancelReasonCustom.trim() || 'Other reason') 
      : cancelReasonOption;

    setIsCancellingOrder(true);
    try {
      const updated = await cancelUserOrder(orderToCancel.id, finalReason);
      if (selectedOrder && selectedOrder.id === orderToCancel.id) {
        setSelectedOrder(updated);
      }
      setOrderToCancel(null);
      setCancelReasonOption('Ordered by mistake');
      setCancelReasonCustom('');
    } catch (err) {
      // Toast error handled in ShopContext
    } finally {
      setIsCancellingOrder(false);
    }
  };

  // If not logged in, show auth prompt card
  if (!currentUser) {
    return (
      <div className="min-h-[70vh] bg-[#f7f3ee] py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-[#fcfbfa] p-8 rounded-3xl border border-[#e8e2d9] shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-[#d4a373]/15 text-[#d4a373] rounded-full flex items-center justify-center mx-auto">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#39322f]">Customer Account</h2>
            <p className="text-xs text-[#39322f]/70 mt-2 font-sans">
              Please sign in to view your profile, track your orders, and manage saved addresses.
            </p>
          </div>
          <button
            onClick={() => openAuthModal('login')}
            className="w-full py-3 px-6 bg-[#39322f] text-white rounded-full font-sans text-xs uppercase font-bold tracking-widest hover:bg-[#d4a373] transition-colors cursor-pointer"
          >
            Sign In to Account
          </button>
        </div>
      </div>
    );
  }

  // Order Timeline helper status index
  const getStatusStepIndex = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'cancelled') return -1;
    if (s === 'delivered') return 3;
    if (s === 'shipped') return 2;
    if (s === 'processing') return 1;
    return 0; // Pending
  };

  return (
    <div className="min-h-screen bg-[#f7f3ee] py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-[#e8e2d9]">
          <div>
            <span className="text-xs font-sans uppercase tracking-[0.25em] text-[#d4a373] font-semibold">
              Customer Portal
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#39322f] mt-1">
              My Account
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { logoutUser(); navigate('/'); }}
              className="px-4 py-2 rounded-full border border-rose-300 text-rose-700 bg-rose-50 hover:bg-rose-600 hover:text-white transition-all text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Dashboard Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Sidebar Navigation */}
          <div className="lg:col-span-3 space-y-3">
            {/* User Profile Card Header */}
            <div className="p-5 bg-[#fcfbfa] rounded-2xl border border-[#e8e2d9] shadow-sm flex items-center gap-3">
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-12 h-12 rounded-full object-cover border border-[#d4a373]"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#39322f] text-[#f7f3ee] flex items-center justify-center font-serif text-base font-bold uppercase shrink-0 border border-white">
                  {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                </div>
              )}
              <div className="truncate">
                <h3 className="font-serif text-sm font-bold text-[#39322f] truncate">{currentUser.name}</h3>
                <p className="text-[11px] text-[#39322f]/60 truncate font-sans">{currentUser.email}</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-[#fcfbfa] rounded-2xl border border-[#e8e2d9] p-2 space-y-1 shadow-sm">
              <button
                onClick={() => handleTabChange('orders')}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-[#39322f] text-white shadow-sm'
                    : 'text-[#39322f] hover:bg-[#f7f3ee]'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Package className="w-4 h-4 text-[#d4a373]" />
                  Order History
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'orders' ? 'bg-[#d4a373] text-white' : 'bg-[#e8e2d9] text-[#39322f]'
                }`}>
                  {orders.length}
                </span>
              </button>

              <button
                onClick={() => handleTabChange('addresses')}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'addresses'
                    ? 'bg-[#39322f] text-white shadow-sm'
                    : 'text-[#39322f] hover:bg-[#f7f3ee]'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-[#d4a373]" />
                  Saved Addresses
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'addresses' ? 'bg-[#d4a373] text-white' : 'bg-[#e8e2d9] text-[#39322f]'
                }`}>
                  {addresses.length}
                </span>
              </button>

              <button
                onClick={() => handleTabChange('profile')}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-[#39322f] text-white shadow-sm'
                    : 'text-[#39322f] hover:bg-[#f7f3ee]'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-[#d4a373]" />
                  Profile Details
                </span>
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">

            {/* --- VIEW: ORDER DETAIL & TRACKING --- */}
            {selectedOrder ? (
              <div className="bg-[#fcfbfa] rounded-3xl border border-[#e8e2d9] p-6 sm:p-8 shadow-md space-y-8 animate-in fade-in duration-200">
                
                {/* Back Link */}
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="inline-flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-wider text-[#b58349] hover:underline cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Order History
                </button>

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e8e2d9]">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="font-serif text-2xl font-bold text-[#39322f]">
                        Order #{selectedOrder.id}
                      </h2>
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full ${
                        selectedOrder.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                        selectedOrder.status === 'Shipped' ? 'bg-purple-100 text-purple-800 border border-purple-300' :
                        selectedOrder.status === 'Processing' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                        selectedOrder.status === 'Cancelled' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                        'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        {selectedOrder.status || 'Pending'}
                      </span>
                    </div>
                    <p className="text-xs text-[#39322f]/60 font-sans mt-1">
                      Placed on {new Date(selectedOrder.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="text-left sm:text-right flex flex-col items-start sm:items-end gap-2">
                    <div>
                      <span className="text-xs uppercase text-[#39322f]/60 font-semibold block">Total Amount</span>
                      <span className="font-serif text-2xl font-bold text-[#b58349]">
                        ₹{selectedOrder.total?.toLocaleString()}
                      </span>
                    </div>

                    {(selectedOrder.status === 'Pending' || selectedOrder.status === 'Processing') && (
                      <button
                        onClick={() => setOrderToCancel(selectedOrder)}
                        className="px-4 py-2 rounded-full border border-rose-300 text-rose-700 bg-rose-50 hover:bg-rose-600 hover:text-white transition-all text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>

                {/* VISUAL ORDER STATUS TIMELINE */}
                <div className="p-6 bg-[#f7f3ee] rounded-2xl border border-[#e8e2d9] space-y-6">
                  <h3 className="font-serif text-base font-bold text-[#39322f] flex items-center gap-2">
                    <Truck className="w-5 h-5 text-[#d4a373]" />
                    Order Status & Tracking Progress
                  </h3>

                  {selectedOrder.status === 'Cancelled' ? (
                    <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold flex items-center gap-2">
                      <span>This order was cancelled. Please contact customer support for further assistance.</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
                      {['Pending', 'Processing', 'Shipped', 'Delivered'].map((stage, idx) => {
                        const currentIndex = getStatusStepIndex(selectedOrder.status);
                        const isPassed = idx <= currentIndex;
                        const isCurrent = idx === currentIndex;

                        // Find status history timestamp for stage
                        const historyItem = Array.isArray(selectedOrder.statusHistory)
                          ? selectedOrder.statusHistory.find(h => h.status?.toLowerCase() === stage.toLowerCase())
                          : null;

                        return (
                          <div key={stage} className="flex flex-col items-center text-center space-y-2 relative z-10">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                              isCurrent
                                ? 'bg-[#d4a373] text-white ring-4 ring-[#d4a373]/30 shadow-md scale-110'
                                : isPassed
                                ? 'bg-[#39322f] text-white'
                                : 'bg-[#e8e2d9] text-[#39322f]/50'
                            }`}>
                              {isPassed ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                            </div>
                            <div>
                              <span className={`text-xs font-bold block uppercase tracking-wider ${
                                isPassed ? 'text-[#39322f]' : 'text-[#39322f]/40'
                              }`}>
                                {stage}
                              </span>
                              {historyItem?.timestamp && (
                                <span className="text-[10px] text-[#39322f]/60 font-sans block mt-0.5">
                                  {new Date(historyItem.timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* CARRIER & TRACKING NUMBER NOTICE */}
                  {(selectedOrder.trackingNumber || selectedOrder.carrier) && (
                    <div className="mt-4 p-4 bg-[#39322f] text-white rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[#d4a373]/40 shadow-sm">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#d4a373]">
                          <Truck className="w-4 h-4" />
                          <span>Shipment Tracking Details</span>
                        </div>
                        <p className="text-xs text-gray-200">
                          Carrier: <strong className="text-white font-bold">{selectedOrder.carrier || 'Standard Courier'}</strong>
                        </p>
                        <p className="text-xs text-gray-200">
                          Tracking AWB: <strong className="text-[#d4a373] font-mono font-bold tracking-wider">{selectedOrder.trackingNumber}</strong>
                        </p>
                      </div>
                      <div className="bg-[#fcfbfa]/10 px-4 py-2 rounded-lg border border-white/20 text-xs font-semibold text-[#f8f4ee] flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#d4a373]" />
                        <span>Track with {selectedOrder.carrier || 'Courier'}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Items Ordered List */}
                <div className="space-y-4">
                  <h3 className="font-serif text-lg font-bold text-[#39322f]">Items Ordered</h3>
                  <div className="divide-y divide-[#e8e2d9] border border-[#e8e2d9] rounded-2xl overflow-hidden bg-[#fcfbfa]">
                    {selectedOrder.items?.map((item, idx) => (
                      <div key={idx} className="p-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-20 rounded-xl bg-[#f7f3ee] overflow-hidden border border-[#e8e2d9] shrink-0">
                            <img
                              src={item.image || '/logo.jpg'}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = '/logo.jpg';
                              }}
                            />
                          </div>
                          <div>
                            <h4 className="font-serif text-sm font-bold text-[#39322f]">{item.name}</h4>
                            <div className="flex items-center gap-3 text-xs text-[#39322f]/70 font-sans mt-1">
                              <span>Size: <strong className="text-[#39322f]">{item.size || 'M'}</strong></span>
                              {item.color && <span>Color: <strong className="text-[#39322f]">{item.color.name || item.color}</strong></span>}
                              <span>Qty: <strong className="text-[#39322f]">{item.quantity}</strong></span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-serif text-sm font-bold text-[#b58349]">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address Details */}
                <div className="p-5 bg-[#f7f3ee] rounded-2xl border border-[#e8e2d9] space-y-2">
                  <h4 className="font-serif text-sm font-bold text-[#39322f] uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#d4a373]" />
                    Delivery Shipping Address
                  </h4>
                  <p className="text-xs text-[#39322f] font-semibold">{selectedOrder.customerName} ({selectedOrder.customerPhone})</p>
                  <p className="text-xs text-[#39322f]/80 font-sans leading-relaxed">{selectedOrder.customerAddress}</p>
                </div>

              </div>
            ) : null}

            {/* --- TAB: ORDERS HISTORY --- */}
            {activeTab === 'orders' && !selectedOrder && (
              <div className="bg-[#fcfbfa] rounded-3xl border border-[#e8e2d9] p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-[#39322f]">Order History</h2>
                    <p className="text-xs text-[#39322f]/60 font-sans mt-0.5">Track package status and view past purchases</p>
                  </div>
                  <span className="text-xs font-semibold text-[#b58349] bg-[#d4a373]/15 px-3 py-1 rounded-full border border-[#d4a373]/30">
                    {orders.length} Total Orders
                  </span>
                </div>

                {orders.length === 0 ? (
                  <div className="py-16 text-center space-y-4 border-2 border-dashed border-[#e8e2d9] rounded-2xl">
                    <Package className="w-12 h-12 text-[#d4a373]/60 mx-auto" />
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#39322f]">No Orders Yet</h3>
                      <p className="text-xs text-[#39322f]/60 font-sans mt-1">You haven't placed any orders with Suranghi Naar yet.</p>
                    </div>
                    <button
                      onClick={() => navigate('/shop')}
                      className="px-6 py-2.5 bg-[#39322f] text-white rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#d4a373] transition-colors cursor-pointer"
                    >
                      Explore Collections
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className="p-5 rounded-2xl border border-[#e8e2d9] bg-[#fcfbfa] hover:border-[#d4a373] hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="font-serif text-base font-bold text-[#39322f] group-hover:text-[#d4a373] transition-colors">
                              Order #{order.id}
                            </span>
                            <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full ${
                              order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                              order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                              order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'Cancelled' ? 'bg-rose-100 text-rose-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {order.status || 'Pending'}
                            </span>
                          </div>
                          <p className="text-xs text-[#39322f]/60 font-sans">
                            {new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} • {order.items?.length || 1} Item(s)
                          </p>
                          {order.trackingNumber && (
                            <p className="text-[11px] text-[#b58349] font-semibold flex items-center gap-1 pt-1">
                              <Truck className="w-3.5 h-3.5" /> AWB: {order.trackingNumber} ({order.carrier || 'Courier'})
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#e8e2d9]">
                          {(order.status === 'Pending' || order.status === 'Processing') && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOrderToCancel(order);
                              }}
                              className="px-3 py-1.5 rounded-full border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-600 hover:text-white text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                          )}
                          <div className="text-left sm:text-right">
                            <span className="text-[10px] text-[#39322f]/60 uppercase font-semibold block">Total</span>
                            <span className="font-serif text-base font-bold text-[#b58349]">₹{order.total?.toLocaleString()}</span>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-[#f7f3ee] group-hover:bg-[#d4a373] group-hover:text-white text-[#39322f] flex items-center justify-center transition-colors">
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* --- TAB: SAVED ADDRESSES --- */}
            {activeTab === 'addresses' && (
              <div className="bg-[#fcfbfa] rounded-3xl border border-[#e8e2d9] p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-[#39322f]">Saved Addresses</h2>
                    <p className="text-xs text-[#39322f]/60 font-sans mt-0.5">Manage delivery locations for quick 1-click checkout</p>
                  </div>
                  <button
                    onClick={handleOpenAddAddress}
                    className="px-4 py-2 bg-[#39322f] text-white rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#d4a373] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Add Address
                  </button>
                </div>

                {isLoadingAddresses ? (
                  <div className="py-12 text-center text-xs text-[#39322f]/60">Loading saved addresses...</div>
                ) : addresses.length === 0 ? (
                  <div className="py-16 text-center space-y-4 border-2 border-dashed border-[#e8e2d9] rounded-2xl">
                    <MapPin className="w-12 h-12 text-[#d4a373]/60 mx-auto" />
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#39322f]">No Saved Addresses</h3>
                      <p className="text-xs text-[#39322f]/60 font-sans mt-1">Add an address to speed up checkout on your future orders.</p>
                    </div>
                    <button
                      onClick={handleOpenAddAddress}
                      className="px-6 py-2.5 bg-[#39322f] text-white rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#d4a373] transition-colors cursor-pointer"
                    >
                      Add First Address
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`p-5 rounded-2xl border ${
                          addr.isDefault ? 'border-[#d4a373] bg-[#d4a373]/5' : 'border-[#e8e2d9] bg-[#fcfbfa]'
                        } space-y-3 relative`}
                      >
                        {addr.isDefault && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-[#d4a373] text-white px-2.5 py-0.5 rounded-full inline-block">
                            Default Address
                          </span>
                        )}
                        <div>
                          <h4 className="font-serif text-sm font-bold text-[#39322f]">{addr.fullName}</h4>
                          <p className="text-xs text-[#39322f]/70 font-sans">{addr.phone}</p>
                          <p className="text-xs text-[#39322f]/90 font-sans leading-relaxed mt-2">
                            {addr.street}, {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                          </p>
                        </div>

                        <div className="pt-3 border-t border-[#e8e2d9] flex items-center justify-end gap-3">
                          <button
                            onClick={() => handleOpenEditAddress(addr)}
                            className="text-xs font-semibold text-[#b58349] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* --- TAB: PROFILE DETAILS --- */}
            {activeTab === 'profile' && (
              <div className="bg-[#fcfbfa] rounded-3xl border border-[#e8e2d9] p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#39322f]">Profile Details</h2>
                  <p className="text-xs text-[#39322f]/60 font-sans mt-0.5">Manage your personal information and preferences</p>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-5 max-w-lg">
                  <div>
                    <label className="block text-xs uppercase font-sans font-semibold text-[#39322f] mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#f7f3ee] border border-[#e8e2d9] rounded-xl text-sm font-sans text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-sans font-semibold text-[#39322f] mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phoneInput}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPhoneInput(val);
                        const clean = val.trim().replace(/\D/g, '');
                        if (clean && !/^[6-9]\d{9}$/.test(clean)) {
                          setProfilePhoneError('Enter a valid 10-digit mobile number');
                        } else {
                          setProfilePhoneError('');
                        }
                      }}
                      className={`w-full px-4 py-2.5 bg-[#f7f3ee] border rounded-xl text-sm font-sans text-[#39322f] focus:outline-none ${
                        profilePhoneError ? 'border-rose-500' : 'border-[#e8e2d9] focus:border-[#d4a373]'
                      }`}
                      placeholder="98765 43210"
                    />
                    {profilePhoneError && (
                      <p className="text-[11px] text-rose-600 font-semibold mt-1">
                        {profilePhoneError}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-sans font-semibold text-[#39322f] mb-1.5 flex items-center justify-between">
                      <span>Email Address (Primary Account)</span>
                      <span className="text-[10px] text-gray-400 flex items-center gap-1 font-normal">
                        <Lock className="w-3 h-3" /> Cannot be changed
                      </span>
                    </label>
                    <input
                      type="email"
                      value={currentUser.email}
                      disabled
                      className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm font-sans text-gray-500 cursor-not-allowed"
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSavingProfile}
                      className="px-8 py-3 bg-[#39322f] text-white rounded-full text-xs uppercase font-bold tracking-widest hover:bg-[#d4a373] transition-colors shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      {isSavingProfile ? 'Saving...' : 'Save Profile Changes'}
                    </button>
                  </div>
                </form>

                {/* --- Change Password Section (Email Provider Users Only) --- */}
                {(currentUser?.provider === 'email' || !currentUser?.provider) && (
                  <div className="pt-8 border-t border-[#e8e2d9] space-y-5 max-w-lg">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-[#39322f]">Change Password</h3>
                      <p className="text-xs text-[#39322f]/60 font-sans mt-0.5">Update your account password for added security</p>
                    </div>

                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (!currentPasswordInput || !newPasswordInput || !confirmNewPasswordInput) {
                          toast.error('Please fill in all password fields');
                          return;
                        }
                        if (newPasswordInput.length < 6) {
                          toast.error('New password must be at least 6 characters long');
                          return;
                        }
                        if (newPasswordInput !== confirmNewPasswordInput) {
                          toast.error('New passwords do not match');
                          return;
                        }

                        setIsChangingPassword(true);
                        try {
                          const res = await api.put('/users/change-password', {
                            currentPassword: currentPasswordInput,
                            newPassword: newPasswordInput,
                          });
                          toast.success(res.data?.message || 'Password changed successfully');
                          setCurrentPasswordInput('');
                          setNewPasswordInput('');
                          setConfirmNewPasswordInput('');
                        } catch (err) {
                          toast.error(err.response?.data?.message || 'Failed to change password');
                        } finally {
                          setIsChangingPassword(false);
                        }
                      }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-xs uppercase font-sans font-semibold text-[#39322f] mb-1.5">
                          Current Password
                        </label>
                        <input
                          type="password"
                          required
                          value={currentPasswordInput}
                          onChange={(e) => setCurrentPasswordInput(e.target.value)}
                          className="w-full px-4 py-2.5 bg-[#f7f3ee] border border-[#e8e2d9] rounded-xl text-sm font-sans text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                          placeholder="••••••••"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase font-sans font-semibold text-[#39322f] mb-1.5">
                          New Password
                        </label>
                        <input
                          type="password"
                          required
                          value={newPasswordInput}
                          onChange={(e) => setNewPasswordInput(e.target.value)}
                          className="w-full px-4 py-2.5 bg-[#f7f3ee] border border-[#e8e2d9] rounded-xl text-sm font-sans text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                          placeholder="Min 6 characters"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase font-sans font-semibold text-[#39322f] mb-1.5">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          required
                          value={confirmNewPasswordInput}
                          onChange={(e) => setConfirmNewPasswordInput(e.target.value)}
                          className="w-full px-4 py-2.5 bg-[#f7f3ee] border border-[#e8e2d9] rounded-xl text-sm font-sans text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                          placeholder="Confirm new password"
                        />
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isChangingPassword}
                          className="px-6 py-2.5 bg-[#39322f] text-white rounded-full text-xs uppercase font-bold tracking-widest hover:bg-[#d4a373] transition-colors shadow-sm cursor-pointer disabled:opacity-50"
                        >
                          {isChangingPassword ? 'Updating Password...' : 'Update Password'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* --- ADD / EDIT ADDRESS MODAL --- */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#fcfbfa] w-full max-w-md rounded-3xl border border-[#e8e2d9] shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#e8e2d9] pb-4">
              <h3 className="font-serif text-xl font-bold text-[#39322f]">
                {editingAddressId ? 'Edit Saved Address' : 'Add New Address'}
              </h3>
              <button
                onClick={() => setIsAddressModalOpen(false)}
                className="text-gray-400 hover:text-[#39322f] text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-semibold text-[#39322f] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={addressForm.fullName}
                  onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#f7f3ee] border border-[#e8e2d9] rounded-xl text-xs text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                  placeholder="Recipient Name"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-[#39322f] mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={addressForm.phone}
                  onChange={(e) => {
                    const val = e.target.value;
                    setAddressForm({ ...addressForm, phone: val });
                    const clean = val.trim().replace(/\D/g, '');
                    if (clean && !/^[6-9]\d{9}$/.test(clean)) {
                      setAddressPhoneError('Enter a valid 10-digit mobile number');
                    } else {
                      setAddressPhoneError('');
                    }
                  }}
                  className={`w-full px-3.5 py-2 bg-[#f7f3ee] border rounded-xl text-xs text-[#39322f] focus:outline-none ${
                    addressPhoneError ? 'border-rose-500' : 'border-[#e8e2d9] focus:border-[#d4a373]'
                  }`}
                  placeholder="98765 43210"
                />
                {addressPhoneError && (
                  <p className="text-[11px] text-rose-600 font-semibold mt-1">
                    {addressPhoneError}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-[#39322f] mb-1">Street Address</label>
                <textarea
                  required
                  rows={2}
                  value={addressForm.street}
                  onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#f7f3ee] border border-[#e8e2d9] rounded-xl text-xs text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                  placeholder="House / Flat No., Building, Street Name, Area"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase font-semibold text-[#39322f] mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#f7f3ee] border border-[#e8e2d9] rounded-xl text-xs text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                    placeholder="Jaipur"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-semibold text-[#39322f] mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#f7f3ee] border border-[#e8e2d9] rounded-xl text-xs text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                    placeholder="Rajasthan"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-[#39322f] mb-1">Pincode</label>
                <input
                  type="text"
                  required
                  value={addressForm.pincode}
                  onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#f7f3ee] border border-[#e8e2d9] rounded-xl text-xs text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                  placeholder="302020"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isDefaultCheck"
                  checked={addressForm.isDefault}
                  onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                  className="accent-[#d4a373] w-4 h-4 cursor-pointer"
                />
                <label htmlFor="isDefaultCheck" className="text-xs text-[#39322f] font-semibold cursor-pointer">
                  Set as default delivery address
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-gray-300 text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-[#39322f] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#d4a373] transition-colors cursor-pointer"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Cancellation Confirmation Modal with Reason Selection */}
      {orderToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#fcfbfa] rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#e8e2d9] shadow-2xl space-y-5 text-left">
            <div className="flex items-center gap-3 border-b border-[#e8e2d9] pb-4">
              <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center shrink-0">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#39322f]">Cancel Order #{orderToCancel.id}</h3>
                <p className="text-xs text-[#39322f]/60 font-sans">Please let us know the reason for cancellation</p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs uppercase font-bold text-[#39322f] tracking-wider">
                Select Cancellation Reason:
              </label>
              
              <div className="space-y-2 text-xs font-sans">
                {[
                  "Ordered by mistake",
                  "Found a better price elsewhere",
                  "Delivery time is too long",
                  "Want to change size / color / variant",
                  "Incorrect delivery address",
                  "Other"
                ].map((reasonOpt) => (
                  <label key={reasonOpt} className="flex items-center gap-2.5 p-2.5 rounded-xl border border-[#e8e2d9] bg-white hover:border-[#d4a373] cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="cancelReason"
                      value={reasonOpt}
                      checked={cancelReasonOption === reasonOpt}
                      onChange={(e) => setCancelReasonOption(e.target.value)}
                      className="accent-[#d4a373]"
                    />
                    <span className="font-medium text-[#39322f]">{reasonOpt}</span>
                  </label>
                ))}
              </div>

              {cancelReasonOption === 'Other' && (
                <div className="pt-2">
                  <textarea
                    rows={2}
                    placeholder="Please specify your cancellation reason..."
                    value={cancelReasonCustom}
                    onChange={(e) => setCancelReasonCustom(e.target.value)}
                    className="w-full bg-white border border-[#e8e2d9] rounded-xl p-3 text-xs text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e8e2d9]">
              <button
                type="button"
                onClick={() => {
                  setOrderToCancel(null);
                  setCancelReasonOption('Ordered by mistake');
                  setCancelReasonCustom('');
                }}
                disabled={isCancellingOrder}
                className="px-5 py-2.5 rounded-full border border-[#e8e2d9] text-xs font-semibold text-[#39322f] hover:bg-[#f7f3ee] uppercase tracking-wider cursor-pointer"
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={isCancellingOrder}
                className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold uppercase tracking-wider cursor-pointer shadow-md disabled:opacity-50"
              >
                {isCancellingOrder ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
