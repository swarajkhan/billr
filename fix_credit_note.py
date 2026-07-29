import sys

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

marker_start = "getElementById('btn-issue-credit-note')?.addEventListener"
marker_end = "function checkTokenValidity"

start = html.find(marker_start)
end = html.find(marker_end)

if start < 0 or end < 0:
    print("Markers not found! start:", start, "end:", end)
    sys.exit(1)

# Trim back to start of line
line_start = html.rfind('\n', 0, start) + 1
print("Old block from", line_start, "to", end)

with open('creditNoteUI.js', 'r', encoding='utf-8') as f:
    new_js = f.read()

# Replace old block
html = html[:line_start] + new_js + '\n\n        ' + html[end:]

print("Old unit_price remaining:", html.count('originalItem.unit_price'))
print("Item.id (correct) count:", html.count('item.id'))

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Done!")
