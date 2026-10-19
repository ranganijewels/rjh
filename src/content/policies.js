// Customer-facing policy terms in one place. The CMS "Static Pages" records
// (returns-policy, shipping, certification, lifetime-warranty) are seeded with
// the same HTML and win when published; these are the fallback and the source
// for short claims elsewhere (PDP badges, cart, FAQ). Change terms here and in
// the CMS together — never in individual components.

export const CONTACT_EMAIL = "info@ranganijewelry.com";

export const RETURN_WINDOW_DAYS = 14;

export const DELIVERY = {
  production: "5–6 business days",
  transitUsCa: "4–5 business days",
};

export const CLAIMS = {
  returns: `${RETURN_WINDOW_DAYS}-day returns on eligible items`,
  returnsShort: `${RETURN_WINDOW_DAYS}-day easy returns`,
  shipping: "Free insured shipping",
  certification: "Certified lab-grown diamonds",
  warranty: "Lifetime manufacturing warranty",
};

export const SHIPPING_BULLETS = [
  "Complimentary insured, tracked shipping on every order.",
  `Orders are made, certified and dispatched within ${DELIVERY.production} of order confirmation; custom designs get a confirmed timeline before production starts.`,
  `Delivery to the US and Canada typically takes a further ${DELIVERY.transitUsCa} after dispatch. Tracking is emailed when your order ships.`,
  `${RETURN_WINDOW_DAYS}-day returns on eligible items — custom, personalised and resized pieces are excluded.`,
];

// Owner guidance: individual-stone reports (IGI/GIA) for solitaire centre
// stones; an SGL jewellery certificate for pieces set with small diamonds.
export const SOLITAIRE_MIN_CT = 0.5;

export function certificateFor(product = {}) {
  const lab = String(product.diamondCertLab || product.diamond_cert_lab || "").toUpperCase().trim();
  const centre = Number(product.centerStoneWeightCt ?? product.center_stone_weight_ct ?? 0);
  const isSolitaire = centre >= SOLITAIRE_MIN_CT;
  if (lab === "SGL") {
    return { lab: "SGL", kind: "jewellery", text: "Supplied with an SGL jewellery certificate describing the diamonds and metal in this piece." };
  }
  if (lab === "IGI" || lab === "GIA") {
    return { lab, kind: "stone", text: `The centre diamond comes with an individual ${lab} grading report.` };
  }
  if (isSolitaire) {
    return { lab: "IGI/GIA", kind: "stone", text: "The centre diamond comes with an individual IGI or GIA grading report; the lab is confirmed on your order before dispatch." };
  }
  return { lab: "SGL", kind: "jewellery", text: "Supplied with an SGL jewellery certificate describing the diamonds and metal in this piece." };
}

export const POLICY_PAGES = {
  "privacy-policy": {
    title: "Privacy Policy",
    html: `<h2>Privacy Policy</h2>
<p>Rangani Jewelry House (“we”, “us”) respects your privacy. This policy explains what we collect when you use ranganijewelry.com, why, and the choices you have. Questions: <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>.</p>
<h3>What we collect</h3>
<ul>
<li><strong>Information you give us:</strong> name, email, phone, shipping address, order details, custom-design and enquiry messages, appointment bookings, and messages sent through our contact forms or live chat.</li>
<li><strong>Payment:</strong> online payments are processed by our payment provider; we do not store card numbers.</li>
<li><strong>Technical data:</strong> IP address, browser and device type, pages viewed, and how you arrived at our site.</li>
</ul>
<h3>Cookies and similar technologies</h3>
<p><strong>Essential</strong> cookies keep your bag, sign-in and preferences working and always run.</p>
<p><strong>Analytics and advertising</strong> technologies run <em>only if you choose “Accept”</em> in the cookie notice. If you accept, we use the Meta Pixel and Meta Conversions API (Meta Platforms) to measure the performance of our advertising and show relevant ads, and Google Analytics / Google Tag Manager to understand site usage. These tools may receive page and product views, add-to-bag, checkout and purchase events, your browser identifiers (such as the Meta _fbp and _fbc cookies), your IP address and user agent. For some events we also send your email address or phone number to Meta in hashed (one-way encrypted) form to match events to your account, and the campaign details (such as UTM parameters) of the link that brought you here, which we also store with your order or enquiry.</p>
<p>If you choose “Reject”, none of these run and no advertising identifiers are stored. You can change your choice at any time with the “Cookie settings” link in the footer.</p>
<h3>How we use information</h3>
<ul>
<li>To fulfil and support your orders, enquiries, appointments and warranty requests.</li>
<li>To send order and service messages, and marketing emails you have not unsubscribed from.</li>
<li>To measure and improve our website and advertising, if you accepted analytics and advertising cookies.</li>
<li>To prevent fraud and meet legal obligations.</li>
</ul>
<h3>Who we share it with</h3>
<p>Service providers who help us run the business — payment processing, couriers and insurers, email delivery, hosting, and (with your consent) Meta and Google for the measurement described above. We do not sell your personal information.</p>
<h3>Your choices and rights</h3>
<p>You may ask to access, correct or delete your personal information, or object to marketing, by emailing <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>. Unsubscribe links are included in marketing emails. You can also manage advertising preferences in your Meta and Google account settings.</p>
<h3>Retention and security</h3>
<p>We keep order records for as long as needed for accounting, warranty and legal reasons, and other data only as long as necessary for the purposes above. We protect data with access controls and encrypted connections.</p>
<h3>Changes</h3>
<p>We may update this policy; the latest version is always on this page.</p>`,
  },
  "returns-policy": {
    title: "Returns & Exchanges",
    html: `<h2>Returns &amp; Exchanges</h2>
<p>If a piece isn't right for you, you can request a return or exchange within <strong>${RETURN_WINDOW_DAYS} days of delivery</strong>. The ${RETURN_WINDOW_DAYS} days start on the delivery date shown by the carrier.</p>
<h3>Eligible items</h3>
<ul>
<li>Items in new, unworn condition with tags intact.</li>
<li>Returned with all original packaging, documents and any diamond or jewellery certificate.</li>
</ul>
<h3>Not eligible</h3>
<ul>
<li>Custom, personalised or made-to-order designs that differ from the design listed on our website.</li>
<li>Engraved items and pieces resized or modified at your request.</li>
<li>Items that have already been returned or exchanged once, and items worn, damaged or altered by another jeweller.</li>
<li>Fancy-coloured diamonds and men's wedding bands.</li>
</ul>
<h3>How to return</h3>
<ol>
<li>Email <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a> with your order number within ${RETURN_WINDOW_DAYS} days of delivery. We'll reply with a return authorization and instructions.</li>
<li>Pack the item with its original packaging, documents and certificates.</li>
<li>Ship it within 14 days of receiving the authorization, using a tracked, insured, signature-on-delivery service. Return shipping and insurance are paid by the customer unless the item arrived damaged or was not what you ordered.</li>
</ol>
<h3>Refunds</h3>
<p>Our jewellers inspect each return, usually within 7 business days of receiving it. Approved refunds are made to the original payment method; card refunds can take up to one billing cycle to appear. Express-shipping fees, appraisals and grading cards are not refundable.</p>
<p>Exchanges follow the same steps; any price difference is charged or refunded once the new piece is confirmed.</p>`,
  },
  shipping: {
    title: "Shipping & Delivery",
    html: `<h2>Shipping &amp; Delivery</h2>
<p>Every order ships free, fully insured and tracked, with a signature required on delivery.</p>
<h3>How long it takes</h3>
<ul>
<li><strong>Dispatch:</strong> your piece is made, certified, inspected and dispatched within ${DELIVERY.production} of order confirmation. For custom designs we confirm the timeline with you before production starts. We email tracking details as soon as it ships.</li>
<li><strong>Transit to the US and Canada:</strong> typically ${DELIVERY.transitUsCa} after dispatch. For other destinations we confirm the estimate when you order.</li>
</ul>
<h3>Duties and taxes</h3>
<p>Prices are shown in your selected currency. Import duties and taxes charged by the destination country are not included in the order total and are paid by the customer.</p>
<p>Questions about an order? Email <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a> or <a href="/track-order">track your order</a>.</p>`,
  },
  certification: {
    title: "Certification",
    html: `<h2>Certification</h2>
<p>The document that comes with your jewellery depends on the diamonds in it, and each product page states which applies.</p>
<h3>Solitaire centre diamonds</h3>
<p>Centre diamonds of ${SOLITAIRE_MIN_CT.toFixed(2)} ct and above come with an individual grading report from IGI or GIA covering that stone's carat, colour, clarity and cut. The report number can be checked on the issuing laboratory's website.</p>
<h3>Jewellery set with smaller diamonds</h3>
<p>Pieces set with smaller diamonds — bands, earrings, pendants and side stones — come with an SGL jewellery certificate describing the diamonds and metal in the finished piece. It is a certificate for the jewellery, not an individual report for each stone.</p>
<p>All our diamonds are lab-grown. If you need a specific laboratory for a centre stone, email <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a> before ordering.</p>`,
  },
  "lifetime-warranty": {
    title: "Lifetime Warranty",
    html: `<h2>Lifetime Manufacturing Warranty</h2>
<p>Every Rangani piece is covered for its lifetime against manufacturing defects — faults in materials or workmanship, such as a casting flaw or a stone that works loose under normal wear. We repair the piece, or replace it if a repair isn't possible.</p>
<h3>Not covered</h3>
<ul>
<li>Accidental damage, loss or theft, and normal wear such as surface scratches or rhodium plating wearing on white gold.</li>
<li>Damage caused by resizing, repair or other work carried out by another jeweller.</li>
<li>Resizing, polishing and other alterations are chargeable services, quoted on request.</li>
</ul>
<h3>Arranging a repair</h3>
<p>Email <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a> or use <a href="/resize-repair-request">Resize &amp; Repair</a> before sending anything. We'll confirm whether the work is covered and the shipping arrangements and any costs in writing before you post the piece.</p>`,
  },
};
