document.addEventListener("DOMContentLoaded", function() {
    const gameGrid = document.getElementById("gameGrid");
  
    // Function to fetch and process CSV data
    function fetchCSV() {
      fetch('https://raw.githubusercontent.com/fantasy-toolz/mlb-predictions/main/predictions/latest.csv')
        .then(response => response.text())
        .then(data => {
          const rows = data.trim().split('\n');
  
          // Skip the first row (header row)
          const dataRows = rows.slice(1);

          dataRows.forEach(row => {
            const columns = row.split(',');

            const homewinProbability = parseFloat(columns[3]) * 100;
            const awaywinProbability = parseFloat(columns[6]) * 100;

            // Create a grid item for each game
            const gridItem = document.createElement('div');
            gridItem.classList.add('grid-item');
            gridItem.innerHTML = `
              <div><strong>Date:</strong> ${columns[0]}</div>
              <div><strong>Away Team:</strong> ${columns[4]} (${awaywinProbability.toFixed(1)}%)</div>
              <div><strong>Home Team:</strong> ${columns[1]} (${homewinProbability.toFixed(1)}%)</div>
              <div><strong>Game Quality:</strong> ${columns[7]}</div>
            `;
  
            gameGrid.appendChild(gridItem);
          });
        })
        .catch(error => console.error('Error fetching CSV:', error));
    }
  
    // Call fetchCSV function when the page loads
    fetchCSV();
  });
  