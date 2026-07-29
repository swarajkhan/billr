      function generateCreditNotePDF(creditNote) {
        if (!creditNote) return;
        showToast('Generating Credit Note PDF...', 'info');
        
        try {
          const doc = new window.jspdf.jsPDF();
          const p = appState.shopProfile;
          const pageWidth = doc.internal.pageSize.getWidth();
          
          let y = 15;
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(22);
          doc.text(p.shop_name, pageWidth / 2, y, { align: 'center' });
          
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10);
          if (p.address && p.show_address) { y += 6; doc.text(p.address, pageWidth / 2, y, { align: 'center' }); }
          if (p.phone && p.show_phone) { y += 5; doc.text(`Phone: ${p.phone}`, pageWidth / 2, y, { align: 'center' }); }
          if (p.email && p.show_email) { y += 5; doc.text(`Email: ${p.email}`, pageWidth / 2, y, { align: 'center' }); }
          if (p.gstin && p.show_gstin) { y += 5; doc.text(`GSTIN: ${p.gstin}`, pageWidth / 2, y, { align: 'center' }); }

          y += 10;
          doc.setDrawColor(200);
          doc.line(15, y, pageWidth - 15, y);
          y += 8;

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(16);
          doc.setTextColor(220, 38, 38); // Red for credit note
          doc.text('CREDIT NOTE / RETURN', pageWidth / 2, y, { align: 'center' });
          doc.setTextColor(0, 0, 0);

          y += 10;
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10);
          
          doc.text(`Credit Note #: ${creditNote.credit_note_number}`, 15, y);
          doc.text(`Date: ${new Date(creditNote.created_at).toLocaleDateString()}`, pageWidth - 15, y, { align: 'right' });
          y += 6;
          doc.text(`Ref Invoice #: ${creditNote.invoice_number}`, 15, y);
          doc.text(`Customer: ${creditNote.customer_name || 'Walk-in'}`, pageWidth - 15, y, { align: 'right' });
          if (creditNote.customer_phone) {
            y += 6;
            doc.text(`Phone: ${creditNote.customer_phone}`, pageWidth - 15, y, { align: 'right' });
          }

          y += 10;
          doc.setDrawColor(0);
          doc.setFillColor(240, 240, 240);
          doc.rect(15, y, pageWidth - 30, 8, 'F');
          
          doc.setFont('helvetica', 'bold');
          doc.text('Item', 17, y + 5.5);
          doc.text('Return Qty', 105, y + 5.5, { align: 'center' });
          doc.text('Price', 145, y + 5.5, { align: 'right' });
          doc.text('Refund', pageWidth - 17, y + 5.5, { align: 'right' });
          
          y += 10;
          doc.setFont('helvetica', 'normal');
          
          let items = creditNote.items;
          if (typeof items === 'string') items = JSON.parse(items);
          
          items.forEach(item => {
            const name = item.name || 'Unknown Item';
            const maxChars = 45;
            let nameLines = [];
            for (let i = 0; i < name.length; i += maxChars) {
              nameLines.push(name.substring(i, i + maxChars));
            }
            
            let itemY = y;
            nameLines.forEach(line => {
              doc.text(line, 17, itemY);
              itemY += 5;
            });
            
            doc.text(item.return_qty.toString(), 105, y, { align: 'center' });
            doc.text(`${p.currency_symbol}${item.sale_price.toFixed(2)}`, 145, y, { align: 'right' });
            doc.text(`${p.currency_symbol}${(item.return_qty * item.sale_price).toFixed(2)}`, pageWidth - 17, y, { align: 'right' });
            
            y = Math.max(itemY, y + 6);
            
            if (y > 270) {
              doc.addPage();
              y = 20;
            }
          });

          y += 5;
          doc.setDrawColor(200);
          doc.line(15, y, pageWidth - 15, y);
          y += 8;

          doc.setFont('helvetica', 'bold');
          doc.text('Reason:', 15, y);
          doc.setFont('helvetica', 'normal');
          doc.text(creditNote.return_reason || 'General Return', 35, y);

          y += 10;
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.text('Total Refunded:', 130, y, { align: 'right' });
          doc.setTextColor(220, 38, 38);
          doc.text(`${p.currency_symbol}${parseFloat(creditNote.total_amount).toFixed(2)}`, pageWidth - 17, y, { align: 'right' });
          doc.setTextColor(0, 0, 0);

          doc.save(`Credit_Note_${creditNote.credit_note_number}.pdf`);
          showToast('Credit Note PDF downloaded successfully!', 'success');
        } catch (err) {
          console.error(err);
          showToast('Failed to generate Credit Note PDF.', 'error');
        }
      }
