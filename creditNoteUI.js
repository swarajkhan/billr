        document.getElementById('btn-issue-credit-note')?.addEventListener('click', () => {
          if (!appState.activeInvoice) return;
          
          document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
          
          let items = appState.activeInvoice.items;
          if (typeof items === 'string') {
            try { items = JSON.parse(items); } catch(e) { items = []; }
          }
          
          const tbody = document.getElementById('credit-note-items-table');
          tbody.innerHTML = '';
          
          items.forEach((item, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td style="padding: 0.75rem; border-bottom: 1px solid var(--clr-border);">${item.name}</td>
              <td style="padding: 0.75rem; border-bottom: 1px solid var(--clr-border); text-align: right;">${item.quantity}</td>
              <td style="padding: 0.75rem; border-bottom: 1px solid var(--clr-border); text-align: right;">
                <input type="number" class="input-field cn-return-qty" data-index="${index}" data-price="${item.sale_price}" data-max="${item.quantity}" min="0" max="${item.quantity}" value="0" style="width: 80px; padding: 0.25rem; height: 32px; text-align: center; margin-left: auto;">
              </td>
            `;
            tbody.appendChild(tr);
          });
          
          document.getElementById('credit-note-total-amount').textContent = appState.shopProfile.currency_symbol + '0.00';
          
          document.querySelectorAll('.cn-return-qty').forEach(input => {
            input.addEventListener('input', (e) => {
              let val = parseInt(e.target.value) || 0;
              const max = parseInt(e.target.dataset.max);
              if (val < 0) val = 0;
              if (val > max) val = max;
              e.target.value = val;
              
              let totalRefund = 0;
              document.querySelectorAll('.cn-return-qty').forEach(inp => {
                totalRefund += (parseInt(inp.value) || 0) * parseFloat(inp.dataset.price);
              });
              document.getElementById('credit-note-total-amount').textContent = appState.shopProfile.currency_symbol + totalRefund.toFixed(2);
            });
          });
          
          const modal = document.getElementById('modal-credit-note');
          if (modal) modal.classList.add('active');
        });

        document.getElementById('btn-confirm-credit-note')?.addEventListener('click', async () => {
          if (!appState.activeInvoice) return;
          
          const returnInputs = document.querySelectorAll('.cn-return-qty');
          let returnedItems = [];
          let totalRefund = 0;
          
          let items = appState.activeInvoice.items;
          if (typeof items === 'string') items = JSON.parse(items);
          
          returnInputs.forEach(inp => {
            const qty = parseInt(inp.value) || 0;
            if (qty > 0) {
              const idx = parseInt(inp.dataset.index);
              const originalItem = items[idx];
              returnedItems.push({
                ...originalItem,
                return_qty: qty
              });
              totalRefund += qty * originalItem.sale_price;
            }
          });
          
          if (returnedItems.length === 0) {
            showToast('No items selected for return.', 'error');
            return;
          }
          
          const creditNote = {
            id: crypto.randomUUID(),
            user_id: appState.session?.user?.id || null,
            credit_note_number: 'CN-' + Math.floor(100000 + Math.random() * 900000),
            invoice_id: appState.activeInvoice.id,
            invoice_number: appState.activeInvoice.invoice_number,
            customer_id: appState.activeInvoice.customer_id,
            customer_name: appState.activeInvoice.customer_name,
            customer_phone: appState.activeInvoice.customer_phone,
            return_reason: document.getElementById('credit-note-reason').value.trim() || 'General Return',
            refund_method: 'Store Credit',
            total_amount: totalRefund,
            items: JSON.stringify(returnedItems),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          try {
            await db.credit_notes.add(creditNote);
            syncToCloud('credit_notes', creditNote);
            
            for (const item of returnedItems) {
              const prod = await db.products.get(item.id);
              if (prod) {
                const updatedStock = prod.stock_quantity + item.return_qty;
                await db.products.update(prod.id, { stock_quantity: updatedStock });
                syncToCloud('products', { ...prod, stock_quantity: updatedStock });
                
                const adj = {
                  id: crypto.randomUUID(),
                  user_id: appState.session?.user?.id || null,
                  product_id: prod.id,
                  adjustment_type: 'return',
                  quantity_change: item.return_qty,
                  stock_before: prod.stock_quantity,
                  stock_after: updatedStock,
                  cost_per_unit: prod.cost_price,
                  reference_note: 'Credit Note ' + creditNote.credit_note_number,
                  created_at: new Date().toISOString()
                };
                await db.stock_adjustments.add(adj);
                syncToCloud('stock_adjustments', adj);
              }
            }
            
            document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
            showToast('Credit Note created successfully. Stock updated.', 'success');
            
            generateCreditNotePDF(creditNote);
            
          } catch(e) {
            console.error(e);
            showToast('Failed to issue Credit Note.', 'error');
          }
        });
