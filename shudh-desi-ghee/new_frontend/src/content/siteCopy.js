/** Original placeholder copy. TODO(client): replace before launch. */

export const highlights = [
  {
    icon: 'batch',
    title: 'Short runs',
    text: 'A piece is made when the bench has room, not to fill a shelf.',
  },
  {
    icon: 'leaf',
    title: 'Named materials',
    text: 'What went in is written in plain words on the piece.',
  },
  {
    icon: 'box',
    title: 'Packed simply',
    text: 'Paper and cloth, with a note if the piece needs a few quiet days.',
  },
];

export const trustNotes = [
  { icon: 'hands', title: 'Handmade in small batches', text: 'Mixed, poured, or stitched in short runs.' },
  { icon: 'leaf', title: 'Gentle ingredients', text: 'Named on the piece, nothing hidden in the list.' },
  { icon: 'lock', title: 'Secure payment', text: 'Prepaid or cash on delivery.' },
];

export const aboutStory = {
  // TODO(client): replace this placeholder with the workshop story.
  headline: 'A small bench, still',
  lede: 'Soap, candles, linen, bags, and alcohol-free attars, made in short runs.',
  sections: [
    {
      title: 'How the bench started',
      body: 'The work began as one bench for soap and linen. A new piece was added only when the same hands could make it, and only when the materials could be named.',
    },
    {
      title: 'What leaves the workshop',
      body: 'Bars cure before they are wrapped. Linen is cut from cloth that is already in the room. Attars are bottled without alcohol, in small glass.',
    },
  ],
  steps: [
    { title: 'Choose', text: 'Materials we can name and hold.' },
    { title: 'Make', text: 'A short run, not a standing line.' },
    { title: 'Wait', text: 'Cure, dry, or press before packing.' },
    { title: 'Send', text: 'Plain paper, and a note if it needs one.' },
  ],
  values: [
    { title: 'Few things', text: 'The list stays short on purpose.' },
    { title: 'Plain words', text: 'A label should be readable without a glossary.' },
    { title: 'Repair first', text: 'If a parcel arrives damaged, write to us before you reorder.' },
    { title: 'No rush scent', text: 'Oils sit on skin. They are not sprayed to fill a room.' },
  ],
  quote: 'We would rather wait for the next batch than send a substitute.',
  quoteBy: 'The workshop bench',
};

export const contactNotes = [
  { q: 'Orders and changes', a: 'If you are signed in, open My Account and the order. Guest orders are confirmed by email and cannot be looked up later.' },
  { q: 'A damaged parcel', a: 'Write with the order id and a photo. We sort it with you. We do not ask for a one-time password.' },
  { q: 'What we do not sell', a: 'The attars are alcohol-free. There is no store finder and no loyalty balance.' },
];

export const faqGroups = [
  {
    id: 'orders',
    title: 'Orders',
    items: [
      { q: 'Can I change an order after it is placed?', a: 'Pending and Processing orders can be cancelled from your account. After that, write to the workshop.' },
      { q: 'Can a guest look up an order later?', a: 'No. A guest receives an email confirmation. Tracking needs an account, and the order has to be placed while signed in.' },
    ],
  },
  {
    id: 'shipping',
    title: 'Shipping',
    items: [
      { q: 'When is shipping free?', a: 'The fee and the free-shipping threshold come from the shop settings and are shown in the bag when those settings load.' },
      { q: 'Do you promise a delivery date by pin code?', a: 'No. City and state are typed at checkout. There is no pin-code lookup.' },
    ],
  },
  {
    id: 'returns',
    title: 'Returns',
    items: [
      { q: 'What can be sent back?', a: 'This is placeholder policy. Opened soap, candles, and attars are not returned. Unused linen and bags can be discussed with the workshop.' },
    ],
  },
  {
    id: 'products',
    title: 'Products',
    items: [
      { q: 'Why does a bar wait?', a: 'Soap stays to cure before it is cut and wrapped. The wait is part of the piece.' },
      { q: 'Are the attars sprays?', a: 'They are alcohol-free oils in small bottles, not room sprays.' },
    ],
  },
];

export const policies = {
  privacy: {
    title: 'Privacy policy',
    updated: '7 November 2026',
    sections: [
      { id: 'what-we-keep', title: 'What we keep', body: 'Name, email, phone, and the address you give us, so an order can be packed and a confirmation can be sent.' },
      { id: 'what-we-do-not', title: 'What we do not do', body: 'We do not sell that information, and we do not ask for bank details or one-time passwords.' },
      { id: 'placeholder', title: 'Before launch', body: 'This is placeholder copy and is not legal advice. The client must replace it.' },
    ],
  },
  terms: {
    title: 'Terms of use',
    updated: '7 November 2026',
    sections: [
      { id: 'orders', title: 'Orders', body: 'An order is for the piece described on its page. The amount charged is the total the server returns, not a figure typed in the browser.' },
      { id: 'accounts', title: 'Accounts', body: 'A signed-in order can be seen later in My Account. A guest order cannot.' },
      { id: 'placeholder', title: 'Before launch', body: 'This is placeholder copy for the client to replace.' },
    ],
  },
  refund: {
    title: 'Refund and exchange',
    updated: '7 November 2026',
    sections: [
      { id: 'opened', title: 'Opened pieces', body: 'Opened soap, candles, and attars are not returned.' },
      { id: 'unused', title: 'Unused linen and bags', body: 'Write within a few days of delivery if a piece is unused and you would like to talk about an exchange.' },
      { id: 'placeholder', title: 'Before launch', body: 'This is placeholder copy until the client confirms the policy.' },
    ],
  },
  delivery: {
    title: 'Delivery and returns',
    updated: '7 November 2026',
    sections: [
      { id: 'dispatch', title: 'Dispatch', body: 'Parcels leave in plain packing. The shipping fee and free-shipping threshold come from shop settings.' },
      { id: 'damage', title: 'If something arrives damaged', body: 'Write with the order id and a photo. We will sort it with you.' },
      { id: 'placeholder', title: 'Before launch', body: 'This is placeholder copy until the client supplies the full policy.' },
    ],
  },
};
