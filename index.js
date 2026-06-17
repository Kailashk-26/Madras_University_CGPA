
let semesterCount = 0;

// Add initial semester on load
window.onload = function() {
    addSemester();
};

function addSemester() {
    semesterCount++;
    const container = document.getElementById('semesters-container');
    
    const semCard = document.createElement('div');
    semCard.className = 'semester-card';
    semCard.id = `sem-${semesterCount}`;
    
    semCard.innerHTML = `
        <div class="semester-header">
            <span class="semester-title">Semester ${semesterCount}</span>
            <button class="btn-delete" onclick="removeSemester(${semesterCount})" style="margin:0; padding: 5px 10px;">Remove Sem</button>
        </div>
        <div class="parts-list" id="parts-list-${semesterCount}">
            </div>
        <button class="btn-add-part" onclick="addPartRow(${semesterCount})">+ Add Part / Course</button>
    `;
    
    container.appendChild(semCard);
    // Add two default rows for convenience
    addPartRow(semesterCount);
    addPartRow(semesterCount);
}

function removeSemester(semId) {
    const semCard = document.getElementById(`sem-${semId}`);
    if (semCard) {
        semCard.remove();
    }
}

function addPartRow(semId) {
    const partsList = document.getElementById(`parts-list-${semId}`);
    const row = document.createElement('div');
    row.className = 'part-row';
    
    row.innerHTML = `
        <div class="input-group">
            <label>Grade Points (Float)</label>
            <input type="number" class="grade-point" min="0" step="1" required placeholder="e.g. 8.5">
        </div>
        <div class="input-group">
            <label>Credits (Integer)</label>
            <input type="number" class="credit" min="1" step="1" required placeholder="e.g. 4">
        </div>
        <button class="btn-delete" onclick="this.parentElement.remove()">X</button>
    `;
    partsList.appendChild(row);
}

function calculateCGPA() {
    const semesterCards = document.querySelectorAll('.semester-card');
    
    let totalProgramPoints = 0;
    let totalProgramCredits = 0;
    let breakdownHTML = '';

    if (semesterCards.length === 0) {
        alert("Please add at least one semester.");
        return;
    }

    let dynamicSemIndex = 1;

    for (let card of semesterCards) {
        const gradeInputs = card.querySelectorAll('.grade-point');
        const creditInputs = card.querySelectorAll('.credit');
        
        let semPoints = 0;
        let semCredits = 0;
        let hasValidData = false;

        for (let i = 0; i < gradeInputs.length; i++) {
            const grade = parseFloat(gradeInputs[i].value);
            const credit = parseInt(creditInputs[i].value);

            if (!isNaN(grade) && !isNaN(credit)) {
                semPoints += (grade * credit);
                semCredits += credit;
                hasValidData = true;
            }
        }

        if (hasValidData) {
            if (semCredits === 0) {
                alert(`Credits cannot sum up to 0 in Semester ${dynamicSemIndex}`);
                return;
            }
            
            const sgpa = semPoints / semCredits;
            breakdownHTML += `<div class="sem-summary"><strong>Semester ${dynamicSemIndex}:</strong> SGPA = ${sgpa.toFixed(2)} (Credits: ${semCredits})</div>`;
            
            totalProgramPoints += semPoints;
            totalProgramCredits += semCredits;
        }
        dynamicSemIndex++;
    }

    if (totalProgramCredits === 0) {
        alert("Please enter valid Grade Points and Credits values.");
        return;
    }

    const finalCGPA = totalProgramPoints / totalProgramCredits;

    // Display results
    const resultBox = document.getElementById('result-box');
    const cgpaOutput = document.getElementById('cgpa-output');
    const breakdownOutput = document.getElementById('sem-breakdown');

    cgpaOutput.innerHTML = `Overall Program CGPA: <span style="color:#2ecc71;">${finalCGPA.toFixed(2)}</span>`;
    breakdownOutput.innerHTML = breakdownHTML;
    resultBox.style.display = 'block';
    
    // Scroll to results smoothly
    resultBox.scrollIntoView({ behavior: 'smooth' });
}