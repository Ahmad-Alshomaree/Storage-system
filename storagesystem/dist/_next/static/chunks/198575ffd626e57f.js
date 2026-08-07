(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,68451,t=>{"use strict";function e(t,e,o){let d=t=>{if(null==t)return'""';let e=String(t).replace(/"/g,'""');return`"${e}"`},i=new Blob(["\uFEFF"+[e.map(d).join(","),...o.map(t=>t.map(d).join(","))].join("\n")],{type:"text/csv;charset=utf-8;"}),r=URL.createObjectURL(i),n=document.createElement("a");n.setAttribute("href",r),n.setAttribute("download",`${t}_${new Date().toISOString().slice(0,10)}.csv`),document.body.appendChild(n),n.click(),document.body.removeChild(n)}function o(t){let e=window.open("","_blank","width=800,height=900");if(!e)return;let o=t.products&&t.products.length>0?t.products.map((t,e)=>`
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${e+1}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${t.product_name||t.box_code}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${t.box_code}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${t.number_of_boxes}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${t.size_of_box}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">$${t.selling_price}</td>
      </tr>
    `).join(""):'<tr><td colspan="6" style="padding: 12px; text-align: center; color: #888;">No products attached</td></tr>';e.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Shipping Receipt #${t.id}</title>
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
          <p>Receipt ID: #${t.id} | Date: ${new Date(t.shipping_date).toLocaleDateString()}</p>
        </div>

        <div class="grid">
          <div class="box">
            <strong>Receiver:</strong> ${t.receiver?.client_name||"N/A"}<br>
            <strong>Phone:</strong> ${t.receiver?.phone_number||"N/A"}
          </div>
          <div class="box">
            <strong>Sender:</strong> ${t.sender?.client_name||"N/A"}<br>
            <strong>Type:</strong> ${t.type}
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
            ${o}
          </tbody>
        </table>

        <div class="grid" style="margin-top: 20px;">
          <div class="box">
            <strong>Ship Price:</strong> $${t.ship_price||0}<br>
            <strong>Paid:</strong> $${t.paid||0}
          </div>
          <div class="box">
            <strong>Note:</strong> ${t.note||"None"}
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
  `),e.document.close()}t.s(["exportToCSV",()=>e,"printShippingReceipt",()=>o])}]);