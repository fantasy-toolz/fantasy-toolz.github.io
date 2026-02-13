function buildSortableTable(tableId, csvUrl) {
  fetch(csvUrl)
    .then(r => r.text())
    .then(text => {
      const rows = text.trim().split("\n").map(r => r.split(","));
      const table = document.getElementById(tableId);

      // Build table
      rows.forEach((row, i) => {
        const tr = document.createElement("tr");
        row.forEach(cell => {
          const el = document.createElement(i === 0 ? "th" : "td");
          el.textContent = cell;
          tr.appendChild(el);
        });
        table.appendChild(tr);
      });

      enableSorting(table);
    });
}

function enableSorting(table) {
  const getCellValue = (tr, idx) =>
    tr.children[idx].innerText || tr.children[idx].textContent;

  const comparer = (idx, asc) => (a, b) => {
    const v1 = getCellValue(asc ? a : b, idx);
    const v2 = getCellValue(asc ? b : a, idx);

    if (v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2)) {
      return v1 - v2;
    }

    return v1.toString().localeCompare(v2);
  };

  table.querySelectorAll("th").forEach((th, idx) => {
    let asc = true;

    th.addEventListener("click", () => {
      Array.from(table.querySelectorAll("tr:nth-child(n+2)"))
        .sort(comparer(idx, asc))
        .forEach(tr => table.appendChild(tr));

      asc = !asc;
    });
  });
}
