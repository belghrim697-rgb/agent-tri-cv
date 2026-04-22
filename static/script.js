// ==================== CONFIGURATION ====================
const API_BASE = window.location.origin;

// ==================== DOM ELEMENTS ====================
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const filePreview = document.getElementById('filePreview');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const uploadBtn = document.getElementById('uploadBtn');
const progressContainer = document.getElementById('progressContainer');
const progressFill = document.getElementById('progressFill');
const progressFilename = document.getElementById('progressFilename');
const progressCounter = document.getElementById('progressCounter');
const errorMessage = document.getElementById('errorMessage');
const resultsSection = document.getElementById('resultsSection');

let selectedFiles = [];

// ==================== DRAG AND DROP ====================
dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('active');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('active');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('active');
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
        handleFilesSelect(files);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFilesSelect(Array.from(e.target.files));
    }
});

// ==================== FILE HANDLING ====================
function handleFilesSelect(files) {
    // Vérifier et filtrer les fichiers
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const validFiles = [];
    
    for (const file of files) {
        if (!allowedTypes.includes(file.type)) {
            showError(`${file.name}: Format non supporté (PDF ou DOCX uniquement)`);
            continue;
        }
        
        if (file.size > 16 * 1024 * 1024) {
            showError(`${file.name}: Fichier trop volumineux (Max 16 MB)`);
            continue;
        }
        
        validFiles.push(file);
    }
    
    if (validFiles.length === 0) {
        return;
    }
    
    selectedFiles = validFiles;
    displayFilesInfo(validFiles);
}

function displayFilesInfo(files) {
    const filesList = document.getElementById('filesList');
    filesList.innerHTML = '';
    
    files.forEach((file, index) => {
        const item = document.createElement('div');
        item.className = 'file-item';
        item.innerHTML = `
            <span class="file-num">${index + 1}.</span>
            <span class="file-name">${file.name}</span>
            <span class="file-size">${(file.size / 1024).toFixed(2)} KB</span>
        `;
        filesList.appendChild(item);
    });
    
    filePreview.classList.remove('hidden');
    dropZone.style.display = 'none';
}

function resetAnalysis() {
    selectedFiles = [];
    fileInput.value = '';
    filePreview.classList.add('hidden');
    dropZone.style.display = 'block';
    progressContainer.classList.add('hidden');
    resultsSection.classList.add('hidden');
    errorMessage.classList.add('hidden');
    document.getElementById('filesList').innerHTML = '';
}

// ==================== FILE UPLOAD & ANALYSIS ====================
uploadBtn.addEventListener('click', uploadAndAnalyzeBatch);

async function uploadAndAnalyzeBatch() {
    if (selectedFiles.length === 0) {
        showError('Aucun fichier sélectionné');
        return;
    }
    
    // Masquer les messages d'erreur précédents
    errorMessage.classList.add('hidden');
    
    // Montrer la barre de progression
    filePreview.classList.add('hidden');
    progressContainer.classList.remove('hidden');
    resultsSection.classList.add('hidden');
    
    const formData = new FormData();
    selectedFiles.forEach((file, index) => {
        formData.append('files[]', file);
    });
    
    try {
        // Mettre à jour la progression initial
        progressCounter.textContent = `1 / ${selectedFiles.length}`;
        progressFilename.textContent = `📄 ${selectedFiles[0].name}`;
        progressFill.style.width = '0%';
        
        const response = await fetch(`${API_BASE}/upload-batch`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erreur lors de l\'analyse');
        }
        
        const results = await response.json();
        
        // Simuler la progression pour chaque fichier
        for (let i = 0; i < results.length; i++) {
            const progress = ((i + 1) / results.length) * 100;
            progressCounter.textContent = `${i + 1} / ${results.length}`;
            progressFilename.textContent = `📄 ${results[i].filename}`;
            progressFill.style.width = progress + '%';
            
            // Attendre un peu entre chaque icône
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        // Attendre 500ms puis rediriger
        await new Promise(resolve => setTimeout(resolve, 500));
        progressContainer.classList.add('hidden');
        
        // Rediriger vers la page des résultats
        window.location.href = '/results';
        
    } catch (error) {
        progressContainer.classList.add('hidden');
        filePreview.classList.remove('hidden');
        showError(error.message);
    }
}

// ==================== ERROR HANDLING ====================
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

// ==================== RESULTS DISPLAY ====================
function displayResults(result) {
    resultsSection.classList.remove('hidden');
    
    // Afficher le badge de statut
    const statusBadge = document.getElementById('statusBadge');
    statusBadge.textContent = result.status;
    statusBadge.style.backgroundColor = result.color || '#f0f0f0';
    
    // Afficher le score
    const scoreCircle = document.getElementById('scoreCircle');
    const scoreValue = document.getElementById('scoreValue');
    const scoreTitle = document.getElementById('scoreTitle');
    const scoreAction = document.getElementById('scoreAction');
    const scoreTotal = document.getElementById('scoreTotal');
    
    if (result.ko) {
        scoreValue.textContent = 'KO';
        scoreAction.textContent = 'Profil rejeté';
        scoreTotal.textContent = '';
        scoreCircle.style.background = 'linear-gradient(135deg, #ef4444, #f87171)';
        
        // Afficher les raisons du rejet
        const koReasons = document.getElementById('koReasons');
        const koList = document.getElementById('koList');
        koReasons.classList.remove('hidden');
        koList.innerHTML = result.ko_reasons.map(r => `<li>${r}</li>`).join('');
        
        // Masquer le breakdown
        document.getElementById('breakdownSection').classList.add('hidden');
    } else {
        scoreValue.textContent = result.total;
        scoreAction.textContent = result.action;
        scoreTotal.textContent = `Points: ${result.total_points}`;
        
        // Colorer le cercle basé sur le score
        if (result.total >= 85) {
            scoreCircle.style.background = 'linear-gradient(135deg, #FFD700, #FFA500)';
        } else if (result.total >= 70) {
            scoreCircle.style.background = 'linear-gradient(135deg, #90EE90, #32CD32)';
        } else if (result.total >= 50) {
            scoreCircle.style.background = 'linear-gradient(135deg, #87CEEB, #4169E1)';
        } else {
            scoreCircle.style.background = 'linear-gradient(135deg, #FFB6C6, #FF69B4)';
        }
        
        // Masquer les raisons du rejet
        document.getElementById('koReasons').classList.add('hidden');
        
        // Afficher le breakdown
        displayBreakdown(result.breakdown);
        document.getElementById('breakdownSection').classList.remove('hidden');
    }
}

function displayBreakdown(breakdown) {
    const breakdownItems = document.getElementById('breakdownItems');
    breakdownItems.innerHTML = '';
    
    const labels = {
        'formation': 'Formation',
        'experience': 'Expérience',
        'competences_techniques': 'Compétences Techniques',
        'soft_skills': 'Soft Skills',
        'langues': 'Langues',
        'culture_entreprise': 'Culture d\'Entreprise'
    };
    
    for (const [category, data] of Object.entries(breakdown)) {
        const item = document.createElement('div');
        item.className = 'breakdown-item';
        
        const categoryLabel = labels[category] || category;
        const percentage = data.max > 0 ? Math.round((data.points / data.max) * 100) : 0;
        
        let html = `
            <div class="category-name">${categoryLabel}</div>
            <div class="category-score">${data.points}/${data.max} pts (${percentage}%)</div>
        `;
        
        if (data.details && data.details.length > 0) {
            html += '<ul>';
            data.details.forEach(detail => {
                html += `<li>${detail}</li>`;
            });
            html += '</ul>';
        }
        
        item.innerHTML = html;
        breakdownItems.appendChild(item);
    }
}

// ==================== PAGE INITIALIZATION ====================
window.addEventListener('DOMContentLoaded', () => {
    // Vérifier la santé de l'application
    fetch(`${API_BASE}/health`)
        .then(response => response.json())
        .then(data => console.log('Agent Tri CV: Prêt ✓', data))
        .catch(() => console.warn('Agent Tri CV: Impossible de vérifier la connexion'));
});
