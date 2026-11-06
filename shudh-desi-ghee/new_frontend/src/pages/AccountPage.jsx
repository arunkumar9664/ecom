import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { useShop } from '../context/ShopContext';
import { formatRupee } from '../components/shell/icons';

const TABS = [
  { id: 'profile', label: 'Profile' },
  { id: 'addresses', label: 'Addresses' },
  { id: 'orders', label: 'Orders' },
  { id: 'password', label: 'Change password' },
];

const STEPS = ['Pending', 'Processing', 'Delivered'];

export default function AccountPage({ initialTab = 'profile' }) {
  const { currentUser, replaceUser, orders, fetchUserOrders, ordersError, cancelUserOrder, useMockData } = useShop();
  const { id: orderId } = useParams();
  const [tab, setTab] = useState(orderId ? 'orders' : initialTab);
  const [profile, setProfile] = useState({ name: currentUser?.name || '', phone: currentUser?.phone || '' });
  const [profileError, setProfileError] = useState('');
  const [profileBusy, setProfileBusy] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [addressState, setAddressState] = useState('loading');
  const [addressError, setAddressError] = useState('');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ fullName: '', phone: '', street: '', city: '', state: '', pincode: '' });
  const [formError, setFormError] = useState('');
  const [orderDetail, setOrderDetail] = useState(null);
  const [detailError, setDetailError] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [password, setPassword] = useState({ current: '', next: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordNote, setPasswordNote] = useState('');

  useEffect(() => {
    if (!currentUser) return;
    fetchUserOrders?.();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return undefined;
    let cancelled = false;
    setAddressState('loading');
    api.get('/addresses').then((res) => {
      if (cancelled) return;
      setAddresses(res.data?.addresses || []);
      setAddressState('ready');
    }).catch((err) => {
      if (cancelled) return;
      setAddressError(err?.response?.data?.message || 'Could not load addresses');
      setAddressState('error');
    });
    return () => {
      cancelled = true;
    };
  }, [currentUser]);

  useEffect(() => {
    if (!orderId || !currentUser) return undefined;
    let cancelled = false;
    setDetailError('');
    api.get(`/orders/${orderId}`).then((res) => {
      if (!cancelled) setOrderDetail(res.data?.order || null);
    }).catch((err) => {
      if (!cancelled) setDetailError(err?.response?.data?.message || 'Could not load this order');
    });
    return () => {
      cancelled = true;
    };
  }, [orderId, currentUser]);

  if (!currentUser) return <Navigate to="/login" replace />;
  if (useMockData) {
    return <main className="mx-auto max-w-xl px-4 py-16 font-body text-sm text-terracotta">Mock mode: sign-in is disabled</main>;
  }

  const saveProfile = async (event) => {
    event.preventDefault();
    setProfileError('');
    if (!profile.name.trim()) {
      setProfileError('Enter your name.');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(profile.phone.trim())) {
      setProfileError('Enter a 10-digit mobile number starting with 6, 7, 8, or 9.');
      return;
    }
    setProfileBusy(true);
    try {
      const res = await api.put('/users/me', { name: profile.name.trim(), phone: profile.phone.trim() });
      if (res.data?.user) replaceUser(res.data.user);
    } catch (err) {
      setProfileError(err?.response?.data?.message || 'Could not save your profile.');
    } finally {
      setProfileBusy(false);
    }
  };

  const saveAddress = async (event) => {
    event.preventDefault();
    setFormError('');
    if (!form.fullName || !form.phone || !form.street || !form.city || !form.state || !form.pincode) {
      setFormError('Fill in every address field.');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
      setFormError('Enter a 10-digit mobile number starting with 6, 7, 8, or 9.');
      return;
    }
    try {
      if (editing?.id) await api.put(`/addresses/${editing.id}`, form);
      else await api.post('/addresses', form);
      const res = await api.get('/addresses');
      setAddresses(res.data?.addresses || []);
      setEditing(null);
      setForm({ fullName: '', phone: '', street: '', city: '', state: '', pincode: '' });
    } catch (err) {
      setFormError(err?.response?.data?.message || 'Could not save the address.');
    }
  };

  const removeAddress = async (id) => {
    setAddressError('');
    try {
      await api.delete(`/addresses/${id}`);
      setAddresses((list) => list.filter((entry) => entry.id !== id));
    } catch (err) {
      setAddressError(err?.response?.data?.message || 'Could not delete the address.');
    }
  };

  const cancel = async (id) => {
    if (!cancelReason.trim()) {
      setDetailError('Enter a reason to cancel.');
      return;
    }
    try {
      const updated = await cancelUserOrder(id, cancelReason.trim());
      setOrderDetail(updated || orderDetail);
      setCancelReason('');
    } catch (err) {
      setDetailError(err?.message || 'Could not cancel the order.');
    }
  };

  const savePassword = async (event) => {
    event.preventDefault();
    setPasswordError('');
    setPasswordNote('');
    if (password.next.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    try {
      await api.put('/users/change-password', { currentPassword: password.current, newPassword: password.next });
      setPasswordNote('Password changed.');
      setPassword({ current: '', next: '' });
    } catch (err) {
      setPasswordError(err?.response?.data?.message || 'Could not change the password.');
    }
  };

  const activeOrder = orderDetail || orders.find((order) => order.id === orderId);

  return (
    <main className="mx-auto max-w-[1100px] px-4 py-8 md:px-8">
      <h1 className="font-heading text-4xl text-ink">Account</h1>
      <div className="mt-6 flex flex-wrap gap-2" role="tablist">
        {TABS.map((entry) => (
          <button key={entry.id} type="button" role="tab" aria-selected={tab === entry.id} onClick={() => setTab(entry.id)} className={`h-10 px-4 font-body text-sm ${tab === entry.id ? 'bg-olive text-paper' : 'border border-line text-ink'}`}>
            {entry.label}
          </button>
        ))}
      </div>

      {tab === 'profile' ? (
        <form onSubmit={saveProfile} className="mt-8 max-w-lg bg-white p-6" noValidate>
          <label className="block font-body text-sm">Name
            <input value={profile.name} onChange={(event) => setProfile((c) => ({ ...c, name: event.target.value }))} className="mt-1 h-11 w-full border border-line px-3" />
          </label>
          <p className="mt-3 font-body text-sm text-muted">Email {currentUser.email}</p>
          <label className="mt-3 block font-body text-sm">Phone
            <input value={profile.phone} onChange={(event) => setProfile((c) => ({ ...c, phone: event.target.value }))} className="mt-1 h-11 w-full border border-line px-3" />
          </label>
          {profileError ? <p className="mt-3 font-body text-sm text-terracotta" role="alert">{profileError}</p> : null}
          <button type="submit" disabled={profileBusy} className="mt-4 h-11 bg-olive px-5 font-body text-xs tracking-[0.14em] text-paper uppercase disabled:bg-line">{profileBusy ? 'Saving' : 'Save profile'}</button>
        </form>
      ) : null}

      {tab === 'addresses' ? (
        <section className="mt-8">
          {addressState === 'loading' ? <p className="font-body text-sm">Loading addresses</p> : null}
          {addressError ? <p className="font-body text-sm text-terracotta" role="alert">{addressError}</p> : null}
          {addressState === 'ready' && addresses.length === 0 ? <p className="font-body text-sm text-muted">No saved addresses yet.</p> : null}
          <ul className="mt-4 space-y-3">
            {addresses.map((entry) => (
              <li key={entry.id} className="border border-line bg-white p-4 font-body text-sm">
                <p>{entry.fullName}, {entry.street}, {entry.city}, {entry.state} {entry.pincode}</p>
                <button type="button" className="mt-2 mr-4 underline" onClick={() => { setEditing(entry); setForm(entry); }}>Edit</button>
                <button type="button" className="underline" onClick={() => removeAddress(entry.id)}>Delete</button>
              </li>
            ))}
          </ul>
          <form onSubmit={saveAddress} className="mt-6 grid max-w-lg gap-3 bg-white p-6 sm:grid-cols-2" noValidate>
            <h2 className="font-heading text-2xl text-ink sm:col-span-2">{editing ? 'Edit address' : 'Add address'}</h2>
            {['fullName', 'phone', 'street', 'city', 'state', 'pincode'].map((key) => (
              <label key={key} className="font-body text-sm capitalize">{key}
                <input value={form[key] || ''} onChange={(event) => setForm((c) => ({ ...c, [key]: event.target.value }))} className="mt-1 h-11 w-full border border-line px-3" />
              </label>
            ))}
            {formError ? <p className="font-body text-sm text-terracotta sm:col-span-2" role="alert">{formError}</p> : null}
            <button type="submit" className="h-11 bg-olive font-body text-xs tracking-[0.14em] text-paper uppercase sm:col-span-2">Save address</button>
          </form>
        </section>
      ) : null}

      {tab === 'orders' ? (
        <section className="mt-8">
          {ordersError ? <p className="font-body text-sm text-terracotta" role="alert">{ordersError}</p> : null}
          {orderId ? (
            <div>
              {detailError ? <p className="font-body text-sm text-terracotta" role="alert">{detailError}</p> : null}
              {!activeOrder && !detailError ? <p className="font-body text-sm">Loading order</p> : null}
              {activeOrder ? (
                <article className="bg-white p-6">
                  <h2 className="font-heading text-2xl text-ink">{activeOrder.id}</h2>
                  <p className="mt-2 font-body text-sm">Total {formatRupee(activeOrder.total)} · {activeOrder.paymentMethod}</p>
                  <ol className="mt-4 flex flex-wrap gap-3">
                    {STEPS.map((step) => (
                      <li key={step} className={`font-body text-xs ${activeOrder.status === step || (step === 'Delivered' && activeOrder.status === 'Delivered') ? 'font-bold text-olive' : 'text-muted'}`}>{step}</li>
                    ))}
                    {activeOrder.status === 'Cancelled' ? <li className="font-body text-xs font-bold text-terracotta">Cancelled</li> : null}
                  </ol>
                  <ul className="mt-4 divide-y divide-line">
                    {(activeOrder.items || []).map((item, index) => (
                      <li key={`${item.id}-${index}`} className="py-2 font-body text-sm">{item.name || 'Item'} × {item.quantity}</li>
                    ))}
                  </ul>
                  {['Pending', 'Processing'].includes(activeOrder.status) ? (
                    <div className="mt-4">
                      <label className="font-body text-sm">Reason
                        <input value={cancelReason} onChange={(event) => setCancelReason(event.target.value)} className="mt-1 h-11 w-full border border-line px-3" />
                      </label>
                      <button type="button" onClick={() => cancel(activeOrder.id)} className="mt-3 h-10 border border-ink px-4 font-body text-sm">Cancel order</button>
                    </div>
                  ) : null}
                </article>
              ) : null}
            </div>
          ) : orders.length === 0 ? (
            <p className="font-body text-sm text-muted">No orders yet. <Link to="/shop" className="underline">Browse the shop</Link></p>
          ) : (
            <ul className="divide-y divide-line border-y border-line">
              {orders.map((order) => (
                <li key={order.id} className="flex items-center justify-between py-4 font-body text-sm">
                  <Link to={`/orders/${order.id}`} className="underline">{order.id}</Link>
                  <span>{order.status} · {formatRupee(order.total)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      {tab === 'password' ? (
        <form onSubmit={savePassword} className="mt-8 max-w-lg bg-white p-6" noValidate>
          <label className="block font-body text-sm">Current password
            <input type="password" value={password.current} onChange={(event) => setPassword((c) => ({ ...c, current: event.target.value }))} className="mt-1 h-11 w-full border border-line px-3" />
          </label>
          <label className="mt-3 block font-body text-sm">New password
            <input type="password" value={password.next} onChange={(event) => setPassword((c) => ({ ...c, next: event.target.value }))} className="mt-1 h-11 w-full border border-line px-3" />
          </label>
          {passwordError ? <p className="mt-3 font-body text-sm text-terracotta" role="alert">{passwordError}</p> : null}
          {passwordNote ? <p className="mt-3 font-body text-sm text-olive" role="status">{passwordNote}</p> : null}
          <button type="submit" className="mt-4 h-11 bg-olive px-5 font-body text-xs tracking-[0.14em] text-paper uppercase">Update password</button>
        </form>
      ) : null}
    </main>
  );
}
