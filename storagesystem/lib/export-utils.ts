import type { Shipping, Client, Debit, Product } from "./types"

/**
 * Trigger browser download of CSV data
 */
export function exportToCSV(filename: string, headers: string[], rows: (string | number | boolean | null | undefined)[][]) {
  const sanitize = (cell: string | number | boolean | null | undefined) => {
    if (cell === null || cell === undefined) return '""'
    const str = String(cell).replace(/"/g, '""')
    return `"${str}"`
  }

  const csvContent = [
    headers.map(sanitize).join(","),
    ...rows.map(row => row.map(sanitize).join(","))
  ].join("\n")

  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Print styled shipping receipt via print window
 */
export function printShippingReceipt(shipping: Shipping) {
  const printWin = window.open("", "_blank", "width=800,height=900")
  if (!printWin) return

  const productsHtml = shipping.products && shipping.products.length > 0
    ? shipping.products.map((p: Product, i: number) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${i + 1}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${p.product_name || p.box_code}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${p.box_code}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${p.number_of_boxes}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${p.size_of_box}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">$${p.selling_price}</td>
      </tr>
    `).join("")
    : `<tr><td colspan="6" style="padding: 12px; text-align: center; color: #888;">No products attached</td></tr>`

  printWin.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Shipping Receipt #${shipping.id}</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; margin: 30px; color: #111; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 15px; margin-bottom: 20px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
          .box { background: #f9f9f9; padding: 12px; border-radius: 6px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th { background: #f0f0f0; text-align: left; padding: 8px; border-bottom: 2px solid #ccc; }
          .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 15px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>STORAGE SYSTEM - SHIPPING RECEIPT</h2>
          <p>Receipt ID: #${shipping.id} | Date: ${new Date(shipping.shipping_date).toLocaleDateString()}</p>
        </div>

        <div class="grid">
          <div class="box">
            <strong>Receiver:</strong> ${shipping.receiver?.client_name || 'N/A'}<br>
            <strong>Phone:</strong> ${shipping.receiver?.phone_number || 'N/A'}
          </div>
          <div class="box">
            <strong>Sender:</strong> ${shipping.sender?.client_name || 'N/A'}<br>
            <strong>Type:</strong> ${shipping.type}
          </div>
        </div>

        <h3>Products in Shipment</h3>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Product Name</th>
              <th>Box Code</th>
              <th>Boxes</th>
              <th>Size</th>
              <th>Selling Price</th>
            </tr>
          </thead>
          <tbody>
            ${productsHtml}
          </tbody>
        </table>

        <div class="grid" style="margin-top: 20px;">
          <div class="box">
            <strong>Ship Price:</strong> $${shipping.ship_price || 0}<br>
            <strong>Paid:</strong> $${shipping.paid || 0}
          </div>
          <div class="box">
            <strong>Note:</strong> ${shipping.note || 'None'}
          </div>
        </div>

        <div class="footer">
          <p>Generated automatically by Product Storage System</p>
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
    </html>
  `)
  printWin.document.close()
}
