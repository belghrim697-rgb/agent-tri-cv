# Script d'installation Docker et Docker Compose pour Windows
# Exécution : PowerShell -ExecutionPolicy Bypass -File .\install-windows.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Installation Docker Desktop pour Windows" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier si Docker est déjà installé
if (Get-Command docker -ErrorAction SilentlyContinue) {
    Write-Host "✓ Docker est déjà installé" -ForegroundColor Green
    docker --version
} else {
    Write-Host "❌ Docker n'est pas installé" -ForegroundColor Red
    Write-Host ""
    Write-Host "Pour installer Docker Desktop :" -ForegroundColor Yellow
    Write-Host "1. Visitez : https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    Write-Host "2. Téléchargez 'Docker Desktop for Windows'" -ForegroundColor Yellow
    Write-Host "3. Exécutez l'installateur" -ForegroundColor Yellow
    Write-Host "4. Redémarrez votre ordinateur" -ForegroundColor Yellow
    Write-Host "5. Relancez ce script" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Vérification de Docker Compose" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier si Docker Compose est disponible
if (Get-Command docker-compose -ErrorAction SilentlyContinue) {
    Write-Host "✓ Docker Compose est disponible" -ForegroundColor Green
    docker-compose --version
} else {
    Write-Host "✓ Docker Compose V2 détecté (intégré à Docker Desktop)" -ForegroundColor Green
    docker compose version
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Démarrage de l'application Agent Tri CV" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Avant de démarrer, demander où se trouve le projet
$projectPath = Get-Location
Write-Host "Chemin du projet : $projectPath" -ForegroundColor Yellow
Write-Host ""

# Vérifier que docker-compose.yml existe
if (-Not (Test-Path "docker-compose.yml")) {
    Write-Host "❌ Erreur : docker-compose.yml non trouvé dans $projectPath" -ForegroundColor Red
    Write-Host "Assurez-vous d'être dans le dossier du projet agent-tri-cv" -ForegroundColor Yellow
    exit 1
}

# Vérifier que Dockerfile existe
if (-Not (Test-Path "Dockerfile")) {
    Write-Host "❌ Erreur : Dockerfile non trouvé dans $projectPath" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Fichiers de configuration trouvés" -ForegroundColor Green
Write-Host ""

# Nettoyer les anciens conteneurs (optionnel)
Write-Host "Arrêt des conteneurs existants..." -ForegroundColor Yellow
docker compose down 2>$null

Write-Host ""
Write-Host "Construction et démarrage de l'application..." -ForegroundColor Cyan
Write-Host "(Première fois : cela peut prendre 2-3 minutes)" -ForegroundColor Yellow
Write-Host ""

# Démarrer les conteneurs
docker compose up --build

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Application démarrée !" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 L'application est accessible sur :" -ForegroundColor Green
Write-Host "   http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Appuyez sur Ctrl+C pour arrêter l'application" -ForegroundColor Yellow
