document.addEventListener("DOMContentLoaded", function() {
    const PredictionGameGrid = document.getElementById("PredictionGameGrid");
    const ValidationGameGrid = document.getElementById("ValidationGameGrid");

    // Array to store fetched game data
    let games = [];
    let scores = [];

    // Function to fetch and process CSV data
    function fetchPredictionCSV() {
      const url = 'https://raw.githubusercontent.com/fantasy-toolz/mlb-predictions/main/predictions/latest.csv'; 

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
  
          createPredictionGridItems(); // Call function to create grid items
        })
        .catch(error => console.error('Error fetching CSV:', error));
    }

    function fetchValidationCSV() {
        const validationurl = 'https://raw.githubusercontent.com/fantasy-toolz/mlb-predictions/main/predictions/latestvalidation.csv'; 

        fetch(validationurl)
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
                scores.push(game);
              }
            }
    
            console.log(scores);
            createValidationGridItems(); // Call function to create grid items
          })
          .catch(error => console.error('Error fetching CSV:', error));
      }
  
    // Function to create grid items for each game
    function createPredictionGridItems() {
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
              <div><strong>Away Team:</strong> ${game.awayteamfull} (${awaywinProbability}%)</div>
              <div><strong>Home Team:</strong> ${game.hometeamfull} (${homewinProbability}%)</div>
              <div><strong>Quality:</strong> ${game.meanrundiff}</div>
            `;
            dateDiv.appendChild(gridItem);
          }); //               <div><strong>Date:</strong> ${game.date}</div>


        PredictionGameGrid.appendChild(dateDiv);

        }
      }
    }

  // Function to convert "True" and "False" strings to actual boolean values
  function convertToBoolean(value) {
    if (value === "True") {
      return true;
    } else if (value === "False") {
      return false;
    } else {
      return value; // Return as is if not "True" or "False"
    }
  }


    // Function to create grid items for each game
    function createValidationGridItems() {
        const dateClass = `date1`;

        // Create a div for each date
        const dateDiv = document.createElement('div');
        dateDiv.classList.add('date-div');
        dateDiv.innerHTML = `<h2>${scores[0].date}</h2>`;
                 
         scores.forEach(game => {
           const gridItem = document.createElement('div');
           const homehighlightedTeam = convertToBoolean(game.hometeamwin);
           const homehighlightClass = homehighlightedTeam ? 'highlighted-team' : '';

           const awayhighlightedTeam = convertToBoolean(game.awayteamwin);
           const awayhighlightClass = awayhighlightedTeam ? 'highlighted-team' : '';

           console.log(homehighlightClass);

           gridItem.classList.add('grid-item', dateClass);
           const awaywinProbability = (parseFloat(game['awayteamodds']) * 100).toFixed(1);
           const homewinProbability = (parseFloat(game['hometeamodds']) * 100).toFixed(1);

           gridItem.innerHTML = `
             <div class="${awayhighlightClass}"><strong>Away Team:</strong> <span>${game.awayteamfull}</span> <strong>${game.awayteamscore}</strong> (${awaywinProbability}%)</div>
             <div class="${homehighlightClass}"><strong>Home Team:</strong> <span>${game.hometeamfull}</span> <strong>${game.hometeamscore}</strong> (${homewinProbability}%)</div>
           `;
           dateDiv.appendChild(gridItem);
         });


       ValidationGameGrid.appendChild(dateDiv);

       }
     
   



    // Call fetchCSV function when the page loads
    fetchPredictionCSV();
    fetchValidationCSV();

  });
  