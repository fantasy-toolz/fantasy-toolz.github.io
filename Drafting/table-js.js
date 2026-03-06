function buildSortableTable(tableId, csvUrl) {
  fetch(csvUrl)
    .then(r => r.text())
    .then(text => {
      const rows = text.trim().split("\n").map(r => r.split(","));
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

  table.querySelectorAll("thead th").forEach((th, idx) => {
    let asc = true;

    th.addEventListener("click", () => {
      Array.from(tbody.querySelectorAll("tr"))
        .sort(comparer(idx, asc))
        .forEach(tr => tbody.appendChild(tr));

      asc = !asc;
    });
  });
}
