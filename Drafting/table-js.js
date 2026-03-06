function buildSortableTable(tableId, csvUrl) {
  fetch(csvUrl)
    .then(r => r.text())
    .then(text => {
      const rows = text.trim().split(/\r?\n/).map(r => r.split(","));
      const table = document.getElementById(tableId);

      // Clear existing content
      table.innerHTML = "";

      // Create table sections
      const thead = document.createElement("thead");
      const tbody = document.createElement("tbody");
      table.appendChild(thead);
      table.appendChild(tbody);

      rows.forEach((row, i) => {
        const tr = document.createElement("tr");

        row.forEach(cell => {
          const el = document.createElement(i === 0 ? "th" : "td");
          el.textContent = cell;
          tr.appendChild(el);
        });

        if (i === 0) {
          thead.appendChild(tr);
        } else {
          tbody.appendChild(tr);
        }
      });

      
      enableSorting(table, tbody);
    });
}

function enableSorting(table, tbody) {
  const getCellValue = (tr, idx) => tr.children[idx].textContent;

  const comparer = (idx, asc) => (a, b) => {
    const v1 = getCellValue(a, idx);
    const v2 = getCellValue(b, idx);

    const n1 = parseFloat(v1);
    const n2 = parseFloat(v2);

    let result;

    if (!isNaN(n1) && !isNaN(n2)) {
      result = n1 - n2;
    } else {
      result = v1.localeCompare(v2);
    }

    return asc ? result : -result;
  };

  table.querySelectorAll("thead th").forEach((th, idx) => {
    let asc = true;

    th.addEventListener("click", () => {
      const rows = [...tbody.rows];

      rows.sort(comparer(idx, asc));

      const frag = document.createDocumentFragment();
      rows.forEach(tr => frag.appendChild(tr));

      tbody.appendChild(frag);

      /* force repaint */
      tbody.style.display = "none";
      tbody.offsetHeight;
      tbody.style.display = "";

      asc = !asc;
    });
  });
}
