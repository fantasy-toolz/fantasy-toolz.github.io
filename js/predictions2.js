document.addEventListener("DOMContentLoaded", function() {
    const gameGrid = document.getElementById("gameGrid");
  
    // Array to store fetched game data
    let games = [];
  
    // Function to fetch and process CSV data
    function fetchCSV() {
      const url = 'https://raw.githubusercontent.com/fantasy-toolz/mlb-predictions/main/predictions/latest.csv'; // Replace with your CSV URL
  
      fetch(url)
        .then(response => response.text())
        .then(data => {
          const rows = data.trim().split('\n');
          const headers = rows[0].split(',');
  
          for (let i = 1; i < rows.length; i++) {
            const columns = rows[i].split(',');
            
  
            if (columns.length === headers.length) {
              let game = {};
              for (let j = 0; j < headers.length; j++) {
                game[headers[j].trim()] = columns[j].trim();
              }
              games.push(game);
            }
          }
  
          createGridItems(); // Call function to create grid items
        })
        .catch(error => console.error('Error fetching CSV:', error));
    }
  
    // Function to create grid items for each game
    function createGridItems() {
      // Group games by date
      const groupedGames = {};
      games.forEach(game => {
        if (!groupedGames[game.date]) {
          groupedGames[game.date] = [];
        }
        groupedGames[game.date].push(game);
      });
  
      // Iterate through grouped games and create grid items
      for (const date in groupedGames) {
        if (groupedGames.hasOwnProperty(date)) {
          const gamesForDate = groupedGames[date];
          const dateClass = `date${Object.keys(groupedGames).indexOf(date) + 1}`;


         // Create a div for each date
         const dateDiv = document.createElement('div');
         dateDiv.classList.add('date-div');
         dateDiv.innerHTML = `<h2>${date}</h2>`;
                  
          gamesForDate.forEach(game => {
            const gridItem = document.createElement('div');
            gridItem.classList.add('grid-item', dateClass);
            const awaywinProbability = (parseFloat(game['awayteamodds']) * 100).toFixed(1);
            const homewinProbability = (parseFloat(game['hometeamodds']) * 100).toFixed(1);
            gridItem.innerHTML = `
              <div><strong>Date:</strong> ${game.date}</div>
              <div><strong>Away Team:</strong> ${game.awayteamfull} (${awaywinProbability}%)</div>
              <div><strong>Home Team:</strong> ${game.hometeamfull} (${homewinProbability}%)</div>
              <div><strong>Quality:</strong> ${game.meanrundiff}</div>
            `;
            dateDiv.appendChild(gridItem);
          });

        gameGrid.appendChild(dateDiv);

        }
      }
    }

    // Call fetchCSV function when the page loads
    fetchCSV();
  });
  