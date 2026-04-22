@echo off
REM Script batch pour démarrer Agent Tri CV sur Windows
REM Double-cliquez sur ce fichier pour démarrer l'application

setlocal enabledelayedexpansion

cls
echo.
echo ========================================
echo Agent Tri CV - Démarrage
echo ========================================
echo.

REM Vérifier si Docker est installé
docker --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Erreur : Docker n'est pas installé ou n'est pas dans le PATH
    echo.
    echo Pour installer Docker Desktop :
    echo 1. Visitez : https://www.docker.com/products/docker-desktop
    echo 2. Téléchargez "Docker Desktop for Windows"
    echo 3. Installez-le et redémarrez votre ordinateur
    echo 4. Relancez ce script
    echo.
    pause
    exit /B 1
)

echo ✓ Docker trouvé
docker --version
echo.

REM Vérifier que le Dockerfile existe
if not exist "Dockerfile" (
    echo ❌ Erreur : Dockerfile non trouvé
    echo Assurez-vous d'être dans le dossier agent-tri-cv
    echo.
    pause
    exit /B 1
)

REM Vérifier que docker-compose.yml existe
if not exist "docker-compose.yml" (
    echo ❌ Erreur : docker-compose.yml non trouvé
    echo.
    pause
    exit /B 1
)

echo ✓ Fichiers de configuration trouvés
echo.

REM Arrêter les conteneurs existants
echo Arrêt des conteneurs existants...
docker-compose down 2>nul

echo.
echo Démarrage de l'application...
echo (Première fois : cela peut prendre 2-3 minutes)
echo.

REM Démarrer l'application
docker-compose up --build

REM Si on arrive ici, l'application a arrêté
echo.
echo ========================================
echo Application arrêtée
echo ========================================
echo.
pause
