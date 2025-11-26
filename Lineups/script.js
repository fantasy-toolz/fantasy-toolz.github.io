document.addEventListener('DOMContentLoaded', () => {
    const table = document.getElementById('lineupTable');
    const teamFilter = document.getElementById('teamFilter');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const filterButton = document.getElementById('filterButton');

    const csvUrl = 'https://raw.githubusercontent.com/fantasy-toolz/batting-order/refs/heads/main/data/Aggregate/2025-all-lineups.csv'; // Replace with your CSV URL
    let parsedData = [];

    // Fetch and parse the CSV
    const fetchCSV = async () => {
        try {
            const response = await fetch(csvUrl);
            if (!response.ok) throw new Error('Failed to load CSV');

            const csvText = await response.text();
            parsedData = parseCSV(csvText);

            populateFilters();
            populateTable(parsedData);
        } catch (error) {
            console.error('Error fetching or parsing the CSV:', error);
        }
    };

    // Parse CSV data
    const parseCSV = (csvText) => {
        const rows = csvText.trim().split('\n');
        const header = rows.shift(); // Remove and store the header row if needed
        
        return rows.map(row => {
            const [date, leadoff, second, third, cleanup, fifth, sixth, seventh, eighth, ninth, team] = row.split(',');
            return { date, team, leadoff, second, third, cleanup, fifth, sixth, seventh, eighth, ninth };
        });
    };
    
    // Populate the team filter
    const populateFilters = () => {
        const teams = [...new Set(parsedData.map(row => row.team))];
        teams.forEach(team => {
            const option = document.createElement('option');
            option.value = team;
            option.textContent = team;
            teamFilter.appendChild(option);
        });
    };

    // Populate the table
    const populateTable = (filteredData) => {
        const tbody = table.querySelector('tbody');
        tbody.innerHTML = '';

        filteredData.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.date}</td>
                <td>${row.team}</td>
                <td>${row.leadoff}</td>
                <td>${row.second}</td>
                <td>${row.third}</td>
                <td>${row.cleanup}</td>
                <td>${row.fifth}</td>
                <td>${row.sixth}</td>
                <td>${row.seventh}</td>
                <td>${row.eighth}</td>
                <td>${row.ninth}</td>
            `;
            tbody.appendChild(tr);
        });
    };

    // Apply filters
    const applyFilters = () => {
        const selectedTeam = teamFilter.value;
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;

        const filteredData = parsedData.filter(row => {
            const withinTeam = selectedTeam === 'All' || row.team === selectedTeam;
            const withinDate = (!startDate || row.date >= startDate) && (!endDate || row.date <= endDate);
            return withinTeam && withinDate;
        });

        populateTable(filteredData);
    };

    filterButton.addEventListener('click', applyFilters);

    // Fetch and populate the data on load
    fetchCSV();
});
