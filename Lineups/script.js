document.addEventListener('DOMContentLoaded', () => {
    const table = document.getElementById('lineupTable');
    const teamFilter = document.getElementById('teamFilter');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const filterButton = document.getElementById('filterButton');

    const csvOptions = {
        option1: 'https://raw.githubusercontent.com/fantasy-toolz/batting-order/refs/heads/main/data/Aggregate/2025-all-lineups.csv',
        option2: 'https://raw.githubusercontent.com/fantasy-toolz/batting-order/refs/heads/main/data/Preseason/Aggregate/2026-all-lineups.csv'
    };

    const toggleButtons = document.querySelectorAll('[data-csv-toggle]');
    let currentCsv = 'option1';
    let csvUrl = csvOptions[currentCsv];
    let parsedData = [];

    toggleButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentCsv = e.target.dataset.csvToggle;
            csvUrl = csvOptions[currentCsv];
            fetchCSV();
        });
    });

    const fetchCSV = async () => {
        try {
            const response = await fetch(csvUrl);
            if (!response.ok) throw new Error('Failed to load CSV');

            const csvText = await response.text();
            parsedData = parseCSV(csvText);

            resetFilters();          // clear old filters
            populateFilters();
            populateTable(parsedData);

        } catch (error) {
            console.error('Error fetching or parsing the CSV:', error);
        }
    };

    const parseCSV = (csvText) => {
        const rows = csvText.trim().split('\n');
        rows.shift(); // remove header
        
        return rows.map(row => {
            const [date, leadoff, second, third, cleanup, fifth, sixth, seventh, eighth, ninth, team] = row.split(',');
            return { date, team, leadoff, second, third, cleanup, fifth, sixth, seventh, eighth, ninth };
        });
    };

    const resetFilters = () => {
        teamFilter.innerHTML = '<option value="All">All</option>';
        startDateInput.value = '';
        endDateInput.value = '';
    };

    const populateFilters = () => {
        const teams = [...new Set(parsedData.map(row => row.team))];
        teams.forEach(team => {
            const option = document.createElement('option');
            option.value = team;
            option.textContent = team;
            teamFilter.appendChild(option);
        });
    };

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

    fetchCSV(); // initial load
});