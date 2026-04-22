# 🚀 Démarrage Rapide - Agent Tri CV

## 🪟 Windows

### Étape 1️⃣ : Installer Docker Desktop (5 min)

1. **Téléchargez Docker Desktop** :
   - Visitez : https://www.docker.com/products/docker-desktop
   - Cliquez sur **"Docker Desktop for Windows"**

2. **Installez-le** : Exécutez l'installateur téléchargé

3. **Redémarrez votre ordinateur** ⚠️ (important !)

4. **Vérifiez l'installation** : Ouvrez PowerShell et tapez :
   ```powershell
   docker --version
   ```
   Vous devriez voir une version (ex: "Docker version 24.0.0")

### Étape 2️⃣ : Télécharger le Projet (2 min)

1. **Téléchargez le projet** :
   - GitHub : https://github.com/ans-med/agent-tri-cv
   - Cliquez sur **"<> Code"** → **"Download ZIP"**
   - Dézippez le fichier

2. **Ouvrez PowerShell depuis le dossier** :
   - Clic droit dans le dossier → **"Open PowerShell window here"**

### Étape 3️⃣ : Démarrer l'Application (1 min)

```powershell
PowerShell -ExecutionPolicy Bypass -File .\install-windows.ps1
```

Le script va :
- ✓ Vérifier Docker
- ✓ Construire l'image
- ✓ Démarrer l'application
- ✓ Afficher le lien d'accès

### ✅ Vérification

Vous verrez :
```
✓ Application démarrée !
🌐 L'application est accessible sur :
   http://localhost:5000
```

**Ouvrez votre navigateur sur : http://localhost:5000** 🎉

---

## 🐧 Linux / Mac

### Étape 1️⃣ : Installer Docker (5 min)

Consultez : https://docs.docker.com/get-docker/

### Étape 2️⃣ : Télécharger et Lancer (2 min)

```bash
# Cloner le projet
git clone https://github.com/ans-med/agent-tri-cv.git
cd agent-tri-cv

# Démarrer l'application
docker-compose up
```

### ✅ Vérification

Vous verrez :
```
web_1  | Running on http://0.0.0.0:5000
```

**Ouvrez votre navigateur sur : http://localhost:5000** 🎉

---

## 📖 Pré-requis (2 min)

Vous devez avoir Docker installé sur votre ordinateur.

### ✅ Installer Docker

1. Visitez : https://docs.docker.com/get-docker/
2. Téléchargez **Docker Desktop** pour votre système (Windows, Mac, Linux)
3. Installez-le comme n'importe quel logiciel
4. Redémarrez votre ordinateur

**Vérification** : Ouvrez un terminal et tapez :
```bash
docker --version
```
Vous devriez voir une version (ex: "Docker version 24.0.0")

## 🎬 Lancer l'application (2 étapes)

### Étape 1️⃣ : Télécharger le projet

```bash
git clone https://github.com/ans-med/agent-tri-cv.git
cd agent-tri-cv
```

Ou téléchargez le ZIP depuis GitHub et dézippez-le.

### Étape 2️⃣ : Démarrer avec Docker

**Sur Windows** :
- Utilisez le script PowerShell : `install-windows.ps1`
- Ou ouvrez PowerShell et tapez :

```powershell
docker-compose up
```

**Sur Mac/Linux** :
```bash
cd agent-tri-cv
docker-compose up
```

### ✅ Vérification

Si vous voyez ceci, c'est bon :

```
agent-tri-cv  | * Running on http://0.0.0.0:5000
```

## 🌐 Accéder à l'Application

Ouvrez votre navigateur et allez à :

```
http://localhost:5000
```

Vous devriez voir l'interface d'upload ! 🎉

## 📝 Utiliser l'Application

### Analyser un CV

1. Cliquez sur la zone de dépôt ou sélectionnez un fichier
2. Uploadez un CV au format PDF ou DOCX
3. Cliquez sur **"Analyser"**
4. Consultez le résultat avec le score et le détail

### Voir l'Historique

1. Cliquez sur l'onglet **"Résultats"** en haut
2. Consultez tous les CV analysés
3. Filtrez par statut si vous voulez
4. Cliquez sur "Détails" pour voir le scoring complet

## 🔧 Personnaliser les Critères

**Fichier** : `config/keywords.json`

Vous pouvez éditer ce fichier avec un éditeur de texte pour ajouter/retirer des mots-clés :

```json
"sourcing_expert": {
  "mots_cles": [
    "linkedin recruiter",
    "chasse de tête",
    "votre_mot_cle"  // ← Ajouter ici
  ],
  "points": 8
}
```

**Important** : Après modification, redémarrez l'application :
1. Appuyez sur `Ctrl+C` dans le terminal
2. Relancez `docker-compose up`

## 🛑 Arrêter l'Application

1. Appuyez sur `Ctrl+C` dans le terminal où elle tourne
2. Attendez l'arrêt complet

## 📊 Où Trouver les Résultats ?

Les résultats sont sauvegardés automatiquement dans le dossier `results/` en format JSON.

Vous pouvez :
- Les consulter en ligne via l'onglet "Résultats"
- Les télécharger manuellement du dossier `results/`
- Les importer dans Excel

## ❓ Dépannage

### "Port 5000 already in use"

Un autre programme utilise le port 5000. Solution :
1. Éditez le fichier `docker-compose.yml`
2. Changez `5000:5000` en `5001:5000`
3. Relancez avec `docker-compose up`
4. Accédez à `http://localhost:5001`

### L'application ne démarre pas

```bash
# Reconstruisez l'image
docker-compose build --no-cache
docker-compose up
```

### Problèmes de fichiers téléchargés

Les fichiers sont stockés dans `uploads/` (temporaire) et `results/` (permanent).

```bash
# Nettoyer les fichiers temporaires
rm -rf uploads/*

# Garder les résultats
ls results/
```

## 💡 Conseil

- Gardez le terminal ouvert pendant l'utilisation de l'application
- Les données sont sauvegardées localement (aucun envoi à l'extérieur)
- Vous pouvez fermer et rouvrir le navigateur sans perdre les données

## ✨ Suivant ?

1. Consultez le [README.md](README.md) pour la documentation complète
2. Personnalisez les critères dans `config/keywords.json`
3. Exportez les résultats pour vos analyses !

---

**Besoin d'aide ?** Consultez la section "Dépannage" du README.md
