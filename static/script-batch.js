// ==================== CONFIGURATION ====================
const API_BASE = window.location.origin;

// ==================== DOM ELEMENTS ====================
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const filePreview = document.getElementById('filePreview');
const uploadBtn = document.getElementById('uploadBtn');
const progressContainer = document.getElementById('progressContainer');
const progressFill = document.getElementById('progressFill');
const progressCounter = document.getElementById('progressCounter');
const errorMessage = document.getElementById('errorMessage');
const resultsSection = document.getElementById('resultsSection');
const batchResultsSection = document.getElementById('batchResultsSection');

let selectedFiles = [];
let allResults = [];
let currentFilter = 'all';

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
    handleFilesSelect(files);
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFilesSelect(Array.from(e.target.files));
    }
});

// ==================== FILE HANDLING ====================
function handleFilesSelect(files) {
    const allowedTypes = [
        'application/pdf', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    selectedFiles = [];
    
    for (const file of files) {
        // Vérifier le type de fichier
        if (!allowedTypes.includes(file.type)) {
            console.warn(`Format non supporté: ${file.name}`);
            continue;
        }
        
        // Vérifier la taille
        if (file.size > 16 * 1024 * 1024) {
            console.warn(`Fichier trop volumineux: ${file.name}`);
            continue;
        }
        
        selectedFiles.push(file);
    }
    
    if (selectedFiles.length === 0) {
        showError('Aucun fichier valide sélectionné');
        return;
    }
    
    displayFilesInfo();
}

function displayFilesInfo() {
    const filesList = document.getElementById('filesList');
    filesList.innerHTML = '';
    
    selectedFiles.forEach((file, index) => {
        const item = document.createElement('div');
        item.className = 'file-item';
        item.innerHTML = `
            <div class="file-item-info">
                <span class="file-item-icon">📄</span>
                <span class="file-item-name">${file.name}</span>
                <span class="file-item-size">${(file.size / 1024).toFixed(2)} KB</span>
            </div>
            <button class="file-item-remove" onclick="removeFile(${index})">✕</button>
        `;
        filesList.appendChild(item);
    });
    
    filePreview.classList.remove('hidden');
    dropZone.style.display = 'none';
}

function removeFile(index) {
    selectedFiles.splice(index, 1);
    if (selectedFiles.length === 0) {
        resetAnalysis();
    } else {
        displayFilesInfo();
    }
}

function resetAnalysis() {
    selectedFiles = [];
    allResults = [];
    fileInput.value = '';
    filePreview.classList.add('hidden');
    dropZone.style.display = 'block';
    progressContainer.classList.add('hidden');
    resultsSection.classList.add('hidden');
    batchResultsSection.classList.add('hidden');
    errorMessage.classList.add('hidden');
}

// ==================== FILE UPLOAD & ANALYSIS ====================
uploadBtn.addEventListener('click', uploadAndAnalyze);

async function uploadAndAnalyze() {
    if (selectedFiles.length === 0) {
        showError('Aucun fichier sélectionné');
        return;
    }
    
    // Masquer les messages d'erreur précédents
    errorMessage.classList.add('hidden');
    
    // Montrer la barre de progression
    filePreview.classList.add('hidden');
    progressContainer.classList.remove('hidden');
    batchResultsSection.classList.add('hidden');
    resultsSection.classList.add('hidden');
    
    allResults = [];
    const totalFiles = selectedFiles.length;
    
    try {
        // Traiter les fichiers un par un
        for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];
            const currentIndex = i + 1;
            
            // Mettre à jour la progression
            updateProgress(currentIndex, totalFiles, file.name);
            
            // Créer un FormData pour ce fichier
            const formData = new FormData();
            formData.append('file', file);
            
            // Analyser le fichier
            const response = await fetch(`${API_BASE}/upload`, {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                const error = await response.json();
                allResults.push({
                    filename: file.name,
                    error: error.error || 'Erreur lors de l\'analyse'
                });
            } else {
                const result = await response.json();
                allResults.push(result);
            }
        }
        
        // Afficher les résultats
        progressContainer.classList.add('hidden');
        
        // Trier par score décroissant
        allResults = allResults.sort((a, b) => {
            if (a.error) return 1;
            if (b.error) return -1;
            return (b.total || 0) - (a.total || 0);
        });
        
        displayBatchResults({
            total: totalFiles,
            processed: allResults.filter(r => !r.error).length,
            errors: allResults.filter(r => r.error).length,
            results: allResults
        });
        
    } catch (error) {
        progressContainer.classList.add('hidden');
        filePreview.classList.remove('hidden');
        showError(error.message);
    }
}

// Mettre à jour la barre de progression
function updateProgress(current, total, filename) {
    const percentage = (current / total) * 100;
    const progressFill = document.getElementById('progressFill');
    const progressCounter = document.getElementById('progressCounter');
    const progressFilename = document.getElementById('progressFilename');
    
    progressFill.style.width = percentage + '%';
    progressCounter.textContent = `CV ${current} / ${total}`;
    progressFilename.textContent = `📄 ${filename}`;
}

// ==================== BATCH RESULTS DISPLAY ====================
function displayBatchResults(batchResult) {
    // Mettre à jour les stats
    document.getElementById('totalCount').textContent = batchResult.total;
    document.getElementById('processedCount').textContent = batchResult.processed;
    document.getElementById('errorCount').textContent = batchResult.errors;
    
    // Afficher le tableau
    displayResultsTable(allResults);
    
    batchResultsSection.classList.remove('hidden');
}

function displayResultsTable(results) {
    const tbody = document.getElementById('resultsTableBody');
    tbody.innerHTML = '';
    
    const filteredResults = filterResultsList(results);
    
    filteredResults.forEach(result => {
        const row = document.createElement('tr');
        
        // Normaliser le status pour la classe CSS
        let statusClass = 'unknown';
        if (result.status) {
            statusClass = result.status.toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/é/g, 'e')
                .replace(/è/g, 'e')
                .replace(/ê/g, 'e');
        }
        
        row.className = `result-row status-${statusClass}`;
        
        if (result.error) {
            row.innerHTML = `
                <td colspan="7" class="error-cell">
                    <strong>${result.filename}</strong>
                    <p style="color: #ef4444;">❌ Erreur: ${result.error}</p>
                </td>
            `;
        } else {
            const formation = result.breakdown?.formation?.points || 0;
            const experience = result.breakdown?.experience?.points || 0;
            const competences = result.breakdown?.competences_techniques?.points || 0;
            
            // Normaliser le status pour la classe CSS
            let statusClass = 'unknown';
            let scoreClass = 'score-refuse';
            
            if (result.status) {
                statusClass = result.status.toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/é/g, 'e')
                    .replace(/è/g, 'e')
                    .replace(/ê/g, 'e');
                
                // La couleur du score dépend du statut
                if (result.status === 'TOP MATCH') {
                    scoreClass = 'score-top-match';
                } else if (result.status === 'ÉLIGIBLE') {
                    scoreClass = 'score-eligible';
                } else if (result.status === 'À VÉRIFIER') {
                    scoreClass = 'score-a-verifier';
                } else if (result.status === 'REFUSÉ') {
                    scoreClass = 'score-refuse';
                }
            }
            
            row.innerHTML = `
                <td>
                    <div class="filename-cell">
                        <span class="filename">${result.filename}</span>
                    </div>
                </td>
                <td class="score-cell">
                    <div class="score-badge ${scoreClass}">
                        ${result.total}%
                    </div>
                </td>
                <td>
                    <span class="status-badge status-${statusClass}">
                        ${result.status}
                    </span>
                </td>
                <td>${formation}</td>
                <td>${experience}</td>
                <td>${competences}</td>
                <td>
                    <button class="btn-small" onclick="viewDetails('${result.filename}')">📋 Détails</button>
                    <button class="btn-small" onclick="downloadCV('${result.filename}')">📄 Ouvrir</button>
                </td>
            `;
        }
        
        tbody.appendChild(row);
    });
}

function filterResultsList(results) {
    if (currentFilter === 'all') {
        return results;
    }
    
    return results.filter(r => !r.error && r.status === currentFilter);
}

function filterResults(status) {
    currentFilter = status;
    
    // Mettre à jour les boutons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Rafraîchir le tableau
    displayResultsTable(allResults);
}

function sortResults(field) {
    allResults.sort((a, b) => {
        if (field === 'filename') {
            return a.filename.localeCompare(b.filename);
        } else if (field === 'score') {
            return (b.total || 0) - (a.total || 0);
        } else if (field === 'status') {
            return (a.status || '').localeCompare(b.status || '');
        }
        return 0;
    });
    
    displayResultsTable(allResults);
}

function viewDetails(filename) {
    const result = allResults.find(r => r.filename === filename);
    if (!result) return;
    
    // Créer le contenu du modal
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
    
    // Calculer les détails
    const breakdown = result.breakdown || {};
    const formation = breakdown.formation || {};
    const experience = breakdown.experience || {};
    const competences = breakdown.competences_techniques || {};
    const softSkills = breakdown.soft_skills || {};
    const langues = breakdown.langues || {};
    const culture = breakdown.culture_entreprise || {};
    
    const koReasons = result.ko_reasons || [];
    const statusColors = {
        'TOP MATCH': '#FFD700',
        'ÉLIGIBLE': '#90EE90',
        'À VÉRIFIER': '#87CEEB',
        'REFUSÉ': '#FFB6C6'
    };
    
    const statusColor = statusColors[result.status] || '#e5e7eb';
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header" style="background-color: ${statusColor}; color: #000;">
                <h2>${result.filename}</h2>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">✕</button>
            </div>
            
            <div class="modal-body">
                <!-- Score Global -->
                <div class="score-section">
                    <div class="score-display-modal">
                        <div class="score-circle-modal">${result.total}%</div>
                        <div class="score-info-modal">
                            <p class="score-status">${result.status}</p>
                            <p class="score-subtitle">Score Global</p>
                        </div>
                    </div>
                </div>
                
                <!-- KO Reasons -->
                ${koReasons.length > 0 ? `
                    <div class="ko-section">
                        <h3>❌ Motifs de rejet</h3>
                        <ul>
                            ${koReasons.map(r => `<li>${r}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                <!-- Breakdown -->
                <div class="breakdown-section">
                    <h3>📊 Détail du Scoring</h3>
                    
                    <div class="breakdown-item">
                        <div class="breakdown-header">
                            <span>🎓 Formation</span>
                            <span class="score-text">${formation.points || 0} / ${formation.max || 0}</span>
                        </div>
                        <div class="breakdown-bar">
                            <div class="progress-bar-fill" style="width: ${((formation.points || 0) / (formation.max || 1)) * 100}%"></div>
                        </div>
                        ${formation.details ? `<p class="breakdown-details">${formation.details}</p>` : ''}
                    </div>
                    
                    <div class="breakdown-item">
                        <div class="breakdown-header">
                            <span>💼 Expérience</span>
                            <span class="score-text">${experience.points || 0} / ${experience.max || 0}</span>
                        </div>
                        <div class="breakdown-bar">
                            <div class="progress-bar-fill" style="width: ${((experience.points || 0) / (experience.max || 1)) * 100}%"></div>
                        </div>
                        ${experience.details ? `<p class="breakdown-details">${experience.details}</p>` : ''}
                    </div>
                    
                    <div class="breakdown-item">
                        <div class="breakdown-header">
                            <span>💻 Compétences</span>
                            <span class="score-text">${competences.points || 0} / ${competences.max || 0}</span>
                        </div>
                        <div class="breakdown-bar">
                            <div class="progress-bar-fill" style="width: ${((competences.points || 0) / (competences.max || 1)) * 100}%"></div>
                        </div>
                        ${competences.details ? `<p class="breakdown-details">${competences.details}</p>` : ''}
                    </div>
                    
                    <div class="breakdown-item">
                        <div class="breakdown-header">
                            <span>🎯 Soft Skills</span>
                            <span class="score-text">${softSkills.points || 0} / ${softSkills.max || 0}</span>
                        </div>
                        <div class="breakdown-bar">
                            <div class="progress-bar-fill" style="width: ${((softSkills.points || 0) / (softSkills.max || 1)) * 100}%"></div>
                        </div>
                        ${softSkills.details ? `<p class="breakdown-details">${softSkills.details}</p>` : ''}
                    </div>
                    
                    <div class="breakdown-item">
                        <div class="breakdown-header">
                            <span>🌍 Langues</span>
                            <span class="score-text">${langues.points || 0} / ${langues.max || 0}</span>
                        </div>
                        <div class="breakdown-bar">
                            <div class="progress-bar-fill" style="width: ${((langues.points || 0) / (langues.max || 1)) * 100}%"></div>
                        </div>
                        ${langues.details ? `<p class="breakdown-details">${langues.details}</p>` : ''}
                    </div>
                    
                    <div class="breakdown-item">
                        <div class="breakdown-header">
                            <span>🏢 Culture Entreprise</span>
                            <span class="score-text">${culture.points || 0} / ${culture.max || 0}</span>
                        </div>
                        <div class="breakdown-bar">
                            <div class="progress-bar-fill" style="width: ${((culture.points || 0) / (culture.max || 1)) * 100}%"></div>
                        </div>
                        ${culture.details ? `<p class="breakdown-details">${culture.details}</p>` : ''}
                    </div>
                </div>
            </div>
            
            <div class="modal-footer">
                <button class="btn btn-primary" onclick="downloadCV('${result.filename}')">📄 Ouvrir le CV</button>
                <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Fermer</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function downloadCV(filename) {
    const encodedFilename = encodeURIComponent(filename);
    window.location.href = `${API_BASE}/download-cv?filename=${encodedFilename}`;
}

// ==================== ERROR HANDLING ====================
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

// ==================== PAGE INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('Script batch chargé');
});
