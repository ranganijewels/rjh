"use client";

// Client-side luxury invoice generator for storefront orders.
// Uses @react-pdf/renderer's built-in fonts (Times/Helvetica) so there is no
// async web-font fetch to fail — the download "just works".
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";

const TEAL = "#162640";
const DARK = "#222223";
const GOLD = "#b08d57";
const MUTED = "#6b7280";
const LINE = "#e5e7eb";

const money = (n, symbol = "$") =>
  `${symbol}${(Number(n) || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const fmtDate = (d) => {
  try {
    return new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "—";
  }
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 44,
    paddingBottom: 56,
    paddingHorizontal: 44,
    fontFamily: "Helvetica",
    fontSize: 9.5,
    color: DARK,
  },
  // Header
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  brand: { fontFamily: "Times-Roman", fontSize: 26, letterSpacing: 3, color: DARK },
  brandTag: { fontSize: 7.5, letterSpacing: 2.5, color: GOLD, marginTop: 3 },
  invoiceTitle: { fontFamily: "Times-Roman", fontSize: 22, letterSpacing: 4, color: TEAL, textAlign: "right" },
  metaLine: { fontSize: 9, color: MUTED, textAlign: "right", marginTop: 3 },
  metaStrong: { fontSize: 9, color: DARK, textAlign: "right", marginTop: 3 },
  rule: { height: 2, backgroundColor: GOLD, marginTop: 14, marginBottom: 18 },

  // Parties
  partiesRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 22 },
  partyCol: { width: "48%" },
  label: { fontSize: 7.5, letterSpacing: 1.5, color: GOLD, fontFamily: "Helvetica-Bold", marginBottom: 5 },
  partyName: { fontSize: 11, fontFamily: "Helvetica-Bold", color: DARK, marginBottom: 2 },
  partyText: { fontSize: 9, color: MUTED, lineHeight: 1.5 },

  // Table
  tHead: { flexDirection: "row", backgroundColor: TEAL, paddingVertical: 7, paddingHorizontal: 8, borderRadius: 2 },
  tHeadCell: { color: "#ffffff", fontFamily: "Helvetica-Bold", fontSize: 8, letterSpacing: 0.5 },
  tRow: { flexDirection: "row", paddingVertical: 9, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: LINE },
  cDesc: { width: "38%", paddingRight: 6 },
  cMeta: { width: "30%", paddingRight: 6 },
  cQty: { width: "8%", textAlign: "center" },
  cUnit: { width: "12%", textAlign: "right" },
  cAmt: { width: "12%", textAlign: "right" },
  itemTitle: { fontFamily: "Helvetica-Bold", fontSize: 9.5, color: DARK, marginBottom: 2 },
  itemSub: { fontSize: 8, color: MUTED, lineHeight: 1.4 },

  // Totals
  totalsWrap: { flexDirection: "row", justifyContent: "flex-end", marginTop: 16 },
  totalsBox: { width: "44%" },
  totalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
  totalLabel: { fontSize: 9.5, color: MUTED },
  totalValue: { fontSize: 9.5, color: DARK },
  grandRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: DARK,
  },
  grandLabel: { fontSize: 12, fontFamily: "Helvetica-Bold", color: DARK },
  grandValue: { fontSize: 12, fontFamily: "Helvetica-Bold", color: TEAL },

  // Footer
  footer: { position: "absolute", bottom: 30, left: 44, right: 44 },
  footerRule: { height: 1, backgroundColor: LINE, marginBottom: 10 },
  thanks: { fontFamily: "Times-Italic", fontSize: 11, color: TEAL, marginBottom: 6 },
  footerText: { fontSize: 7.5, color: MUTED, lineHeight: 1.5 },
  badge: {
    alignSelf: "flex-start",
    marginTop: 6,
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 8,
    backgroundColor: "#eef4f5",
    color: TEAL,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
  },
});

function InvoiceDocument({ order, account = {}, symbol = "$" }) {
  const items = Array.isArray(order?.items) ? order.items : [];
  const subtotal = items.reduce(
    (s, it) => s + (Number(it.price) || 0) * (Number(it.quantity) || 1),
    0,
  );
  const discount = Number(order?.coupon?.discount) || 0;
  const shipping = Number(order?.shipping_cost) || 0;
  const grandTotal = subtotal - discount + shipping;

  const invoiceNo =
    order?.order_number ||
    `INV-${String(order?.id || "").slice(0, 8).toUpperCase()}`;

  const custName = order?.customer_name || account?.name || "Valued Customer";
  const custEmail = order?.customer_email || account?.email || "";
  const custPhone = order?.customer_phone || "";
  const custAddr = order?.customer_address || "";

  const detailLine = (it) => {
    const parts = [];
    const shape = it?.diamond_shape || it?.product?.occasion?.custom_title;
    const metal = [it?.metal_color, it?.metal_type, it?.product?.quality?.value]
      .filter(Boolean)
      .join(" ");
    if (shape) parts.push(`Shape: ${shape}`);
    if (metal) parts.push(`Metal: ${metal}`);
    if (Number(it?.center_diamond_weight) > 0)
      parts.push(`Diamond: ${parseFloat(it.center_diamond_weight)} ct`);
    if (it?.ring_size && it.ring_size !== "-") parts.push(`Size: ${it.ring_size}`);
    if (it?.product_code) parts.push(`SKU: ${it.product_code}`);
    return parts.join("\n");
  };

  return (
    <Document title={`Invoice ${invoiceNo}`} author="RJ House">
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.brand}>RJ HOUSE</Text>
            <Text style={styles.brandTag}>FINE JEWELLERY</Text>
          </View>
          <View>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.metaStrong}>{invoiceNo}</Text>
            <Text style={styles.metaLine}>{fmtDate(order?.created_at)}</Text>
          </View>
        </View>
        <View style={styles.rule} />

        {/* Parties */}
        <View style={styles.partiesRow}>
          <View style={styles.partyCol}>
            <Text style={styles.label}>BILLED TO</Text>
            <Text style={styles.partyName}>{custName}</Text>
            {!!custEmail && <Text style={styles.partyText}>{custEmail}</Text>}
            {!!custPhone && <Text style={styles.partyText}>{custPhone}</Text>}
            {!!custAddr && <Text style={styles.partyText}>{custAddr}</Text>}
          </View>
          <View style={[styles.partyCol, { alignItems: "flex-end" }]}>
            <Text style={styles.label}>DETAILS</Text>
            <Text style={styles.partyText}>Order: {order?.order_number || order?.id}</Text>
            <Text style={styles.partyText}>Date: {fmtDate(order?.created_at)}</Text>
            <Text style={styles.partyText}>
              Payment: {order?.payment_status || "Pending"}
            </Text>
            <Text style={styles.badge}>{(order?.status || "Confirmed").toUpperCase()}</Text>
          </View>
        </View>

        {/* Items table */}
        <View style={styles.tHead}>
          <Text style={[styles.tHeadCell, styles.cDesc]}>ITEM</Text>
          <Text style={[styles.tHeadCell, styles.cMeta]}>SPECIFICATION</Text>
          <Text style={[styles.tHeadCell, styles.cQty]}>QTY</Text>
          <Text style={[styles.tHeadCell, styles.cUnit]}>UNIT</Text>
          <Text style={[styles.tHeadCell, styles.cAmt]}>AMOUNT</Text>
        </View>
        {items.map((it, i) => {
          const qty = Number(it.quantity) || 1;
          const unit = Number(it.price) || 0;
          return (
            <View style={styles.tRow} key={i} wrap={false}>
              <View style={styles.cDesc}>
                <Text style={styles.itemTitle}>{it?.product?.title || "Jewelry"}</Text>
                {!!it?.product?.description && (
                  <Text style={styles.itemSub}>{it.product.description}</Text>
                )}
              </View>
              <Text style={[styles.itemSub, styles.cMeta]}>{detailLine(it)}</Text>
              <Text style={[styles.totalValue, styles.cQty]}>{qty}</Text>
              <Text style={[styles.totalValue, styles.cUnit]}>{money(unit, symbol)}</Text>
              <Text style={[styles.itemTitle, styles.cAmt]}>{money(unit * qty, symbol)}</Text>
            </View>
          );
        })}

        {/* Totals */}
        <View style={styles.totalsWrap}>
          <View style={styles.totalsBox}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>{money(subtotal, symbol)}</Text>
            </View>
            {discount > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>
                  Discount{order?.coupon?.code ? ` (${order.coupon.code})` : ""}
                </Text>
                <Text style={[styles.totalValue, { color: TEAL }]}>
                  -{money(discount, symbol)}
                </Text>
              </View>
            )}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Shipping</Text>
              <Text style={styles.totalValue}>
                {shipping > 0 ? money(shipping, symbol) : "Complimentary"}
              </Text>
            </View>
            <View style={styles.grandRow}>
              <Text style={styles.grandLabel}>Total</Text>
              <Text style={styles.grandValue}>{money(grandTotal, symbol)}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <View style={styles.footerRule} />
          <Text style={styles.thanks}>Thank you for choosing RJ House.</Text>
          <Text style={styles.footerText}>
            Each RJ House piece is crafted to order and accompanied by a certificate of
            authenticity. For resizing, repair, or returns, contact our concierge within 30
            days of delivery.
          </Text>
          <Text style={[styles.footerText, { marginTop: 4 }]}>
            care@rjhouse.com  ·  www.rjhouse.com  ·  This invoice was generated electronically and is valid without signature.
          </Text>
        </View>
      </Page>
    </Document>
  );
}

async function buildBlob(order, opts = {}) {
  return pdf(<InvoiceDocument order={order} {...opts} />).toBlob();
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export async function downloadOrderInvoice(order, opts = {}) {
  const blob = await buildBlob(order, opts);
  const invoiceNo =
    order?.order_number ||
    `INV-${String(order?.id || "order").slice(0, 8).toUpperCase()}`;
  triggerDownload(blob, `RJHouse-${invoiceNo}.pdf`);
}

export async function openOrderInvoice(order, opts = {}) {
  const blob = await buildBlob(order, opts);
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}
