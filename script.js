let names = [];
let rounds = [];
let currentRound = 1;
let recommendedNames = JSON.parse(localStorage.getItem('recommendedNames')) || [
    '(مالك التطبيق) السيد ممدوح', 'احمد صبحي ', 'محمد محمود',
    'احمد محمود', 'خالد ', 'حمصه ',
    ' عبده سامي', ' مرسي ', ' حازم',
    'محمد بدر', 'مروان'

];
// Update the current year in the footer
document.getElementById('currentYear').textContent = new Date().getFullYear();
// Show Name Input Screen
function showNameInputScreen() {
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('nameInputScreen').classList.remove('hidden');
    renderRecommendedNames();
    renderChosenNames();
}

// Add Name
function addName() {
    const nameInput = document.getElementById('nameInput');
    const name = nameInput.value.trim();
    if (name && !names.includes(name)) {
        names.push(name);
        nameInput.value = '';
        showSweetAlert(`تمت إضافة الاسم "${name}" بنجاح!`);
        renderRecommendedNames();
        renderChosenNames();
    }
}

// Add Recommended Name
function addRecommendedName() {
    const recommendedInput = document.getElementById('recommendedInput');
    const name = recommendedInput.value.trim();
    if (name && !recommendedNames.includes(name)) {
        recommendedNames.push(name);
        localStorage.setItem('recommendedNames', JSON.stringify(recommendedNames));
        showSweetAlert(`تمت إضافة الاسم المقترح "${name}" بنجاح!`);
        renderRecommendedNames();
        recommendedInput.value = '';
    }
}

// Show SweetAlert
function showSweetAlert(message) {
    Swal.fire({
        title: 'تم بنجاح!',
        text: message,
        icon: 'success',
        confirmButtonText: 'حسنًا',
    });
}

// Render Recommended Names
function renderRecommendedNames() {
    const recommendedNamesList = document.getElementById('recommendedNames');
    recommendedNamesList.innerHTML = '';
    recommendedNames.forEach(name => {
        const li = document.createElement('li');
        li.textContent = name;
        li.onclick = () => addNameFromRecommended(name);
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'حذف';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            deleteRecommendedName(name);
        };
        li.appendChild(deleteBtn);
        recommendedNamesList.appendChild(li);
    });
}

// Add Name from Recommended List
function addNameFromRecommended(name) {
    if (!names.includes(name)) {
        names.push(name);
        showSweetAlert(`تمت إضافة الاسم "${name}" بنجاح!`);
        renderRecommendedNames();
        renderChosenNames();
    }
}

// Delete Recommended Name
function deleteRecommendedName(name) {
    recommendedNames = recommendedNames.filter(n => n !== name);
    localStorage.setItem('recommendedNames', JSON.stringify(recommendedNames));
    renderRecommendedNames();
}

// Render Chosen Names
function renderChosenNames() {
    const chosenNamesList = document.getElementById('chosenNames');
    chosenNamesList.innerHTML = '';
    names.forEach(name => {
        const li = document.createElement('li');
        li.textContent = name;
        chosenNamesList.appendChild(li);
    });
}

// Start First Round
function startFirstRound() {
    if (names.length > 0) {
        document.getElementById('nameInputScreen').classList.add('hidden');
        document.getElementById('roundScreen').classList.remove('hidden');
        renderRound();
    }
}

// Render Round
function renderRound() {
    const tableBody = document.querySelector('#namesTable tbody');
    tableBody.innerHTML = '';
    names.forEach((name, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${name}</td><td><input type="number" value="${rounds[index]?.[currentRound - 1] || 0}" onchange="updateScore(${index}, this.value)"></td>`;
        tableBody.appendChild(row);
    });
    document.getElementById('roundNumber').textContent = currentRound;
}

// Update Score
function updateScore(index, value) {
    if (!rounds[index]) rounds[index] = [];
    rounds[index][currentRound - 1] = parseInt(value) || 0;
}

// Add New Round
function addNewRound() {
    currentRound++;
    renderRound();
}

// Finish Now
// Finish Now
function finishNow() {
    // Calculate total scores for each player
    const totalScores = names.map((name, index) => {
        const playerRounds = rounds[index] || []; // Get rounds for the player (or empty array if undefined)
        const total = playerRounds.reduce((sum, score) => sum + (Number(score) || 0), 0); // Sum valid scores
        return total;
    });

    // Find the minimum score
    const minScore = Math.min(...totalScores);

    // Find all players with the minimum score (in case of a tie)
    const winnerIndices = totalScores.reduce((indices, score, index) => {
        if (score === minScore) indices.push(index);
        return indices;
    }, []);

    // Get the winner(s) names
    const winnerNames = winnerIndices.map(index => names[index]).join(" و "); // Join names with "و" for multiple winners

    // Show winner screen
    document.getElementById('roundScreen').classList.add('hidden');
    document.getElementById('winnerScreen').classList.remove('hidden');
    document.getElementById('winnerName').textContent = winnerNames;
}
// Reset App
function resetApp() {
    names = [];
    rounds = [];
    currentRound = 1;
    document.getElementById('winnerScreen').classList.add('hidden');
    document.getElementById('startScreen').classList.remove('hidden');
}

// Initial Render
renderRecommendedNames();
