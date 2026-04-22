# 📚 Guide d'Installation Détaillé - Pour Tous

Bienvenue! Ce guide vous aidera à installer et lancer **Agent Tri CV** même si vous n'êtes pas informaticien(ne).

---

## 🎯 Vue d'ensemble: Qu'allez-vous installer?

**Agent Tri CV** est une application web qui:
- ✅ Accepte des CV (fichiers PDF ou Word)
- ✨ Analyse automatiquement les CV
- 📊 Affiche un score et des recommandations
- 💾 Sauvegarde les résultats

**L'installation en 3 étapes simples:**
1. Télécharger Docker
2. Télécharger Agent Tri CV
3. Cliquer sur un bouton pour démarrer

**Durée**: 30-45 minutes (surtout le temps de téléchargement)

---

## Étape 1️⃣: Vérifier votre système

### Pour Windows 🪟

1. Cliquez sur le **Logo Windows** (en bas à gauche)
2. Tapez: `Paramètres Système`
3. Cliquez sur l'option qui apparaît
4. Notez le **Nom du système** en haut (ex: "Windows 11 Pro", "Windows 10 Home")

✅ **OK si**: Windows 10 ou Windows 11

❌ **Problème si**: Windows 7 ou Windows 8
- Contactez un informaticien pour alternatives

### Pour Mac 🍎

1. Cliquez sur le **Logo Apple** (en haut à gauche)
2. Sélectionnez **"À propos de ce Mac"**
3. Regardez la version macOS (ex: "macOS 13.5")

✅ **OK si**: macOS 10.15 ou plus récent

### Pour Linux 🐧

✅ **OK** si vous êtes sur Linux, vous savez probablement déjà ce que vous faites!

---

## Étape 2️⃣: Installer Docker (Le "moteur")

### Qu'est-ce que Docker?

**En termes simples**: Docker est comme une "boîte" qui contient toute l'application. Cela garantit que tout fonctionne partout (Windows, Mac, Linux) sans problèmes d'installation complexes.

**Analogue**: C'est comme mettre l'application dans un conteneur qui voyage avec vous.

### Installation sur Windows

#### 2a. Télécharger Docker Desktop

1. Ouvrez votre navigateur (Chrome, Edge, Firefox)
2. Allez sur: **https://www.docker.com/products/docker-desktop**
3. Cliquez sur le bouton **"Download for Windows"** (bleu)
4. Attendez que le fichier télécharge (~500 MB)

#### 2b. Installer Docker Desktop

1. Ouvrez votre dossier **"Téléchargements"** (icône dossier)
2. Cherchez le fichier **"Docker Desktop Installer.exe"**
3. **Double-cliquez** dessus
4. Cliquez sur **"Oui"** si demandé (autoriser les changements)
5. Attendez l'installation (~5-10 minutes)
6. **Redémarrez votre ordinateur** quand proposé

#### 2c. Vérifier Docker est installé

1. Appuyez sur **Windows + R** (pour ouvrir la commande)
2. Tapez: `powershell`
3. Appuyez sur **Entrée**
4. Dans la fenêtre noire, tapez: `docker --version`
5. Appuyez sur **Entrée**

✅ **Si vous voyez**: `Docker version 20.x...` → Succès!
❌ **Si vous voyez**: `Commande not found` → Essayez de redémarrer l'ordinateur

---

### Installation sur Mac 🍎

#### 2a. Télécharger Docker Desktop

1. Ouvrez votre navigateur
2. Allez sur: **https://www.docker.com/products/docker-desktop**
3. Cliquez sur **"Download for Mac"**
4. Cherchez votre processeur:
   - **Apple Silicon** (M1, M2, M3): Cliquez "Apple Silicon"
   - **Intel Mac**: Cliquez "Intel Chip"
   
   *(Si vous ne savez pas: Menu Apple > À propos de ce Mac > regardez "Processeur")*

5. Attendez le téléchargement (~500 MB)

#### 2b. Installer Docker Desktop

1. Ouvrez **Finder** (icône visage amusant)
2. Allez dans **Téléchargements**
3. Cherchez **"Docker.dmg"**
4. Double-cliquez pour ouvrir
5. **Glissez** l'icône Docker vers le dossier Applications
6. Attendez la copie (~2-3 minutes)

#### 2c. Lancer Docker

1. Ouvrez **Launchpad** (grille d'icônes)
2. Cherchez **"Docker"**
3. Cliquez pour lancer
4. Entrez votre mot de passe Mac si demandé
5. Attendez que l'icône baleine apparaisse en haut à droite ✓

#### 2d. Vérifier Docker

1. Ouvrez **Terminal** (Applications > Utilitaires > Terminal)
2. Tapez: `docker --version`
3. Appuyez sur **Entrée**

✅ **Si vous voyez**: `Docker version 20.x...` → Succès!

---

### Installation sur Linux 🐧

Pour Ubuntu/Debian:
```bash
sudo apt-get update
sudo apt-get install docker.io
sudo usermod -aG docker $USER
```

Redémarrez puis vérifiez:
```bash
docker --version
```

---

## Étape 3️⃣: Télécharger Agent Tri CV

### Option A: Télécharger le fichier ZIP (Plus facile pour débutants) ⭐

1. Allez sur: **https://github.com/ans-med/agent-tri-cv**
2. Cliquez sur le bouton **"Code"** (vert, en haut à droite)
3. Cliquez sur **"Download ZIP"**
4. Attendez le téléchargement
5. **Extrayez** le dossier (clic droit > Extraire/Unzip)
6. Placez le dossier `agent-tri-cv-main` quelque part facile (ex: Bureau)

### Option B: Utiliser Git (Pour plus avancés)

```bash
git clone https://github.com/ans-med/agent-tri-cv.git
cd agent-tri-cv
```

---

## Étape 4️⃣: Lancer l'application

### Sur Windows 🪟

#### Première fois:

1. **Ouvrez PowerShell**:
   - Clic droit sur le Bureau
   - Sélectionnez **"Ouvrir Terminal PowerShell ici"**
   (Si pas disponible: Appuyez Windows + R, tapez `powershell`, Entrée)

2. **Naviguez au dossier**:
   - Tapez: `cd "C:\Users\VotreNom\Desktop\agent-tri-cv-main"`
   - *(Remplacez "VotreNom" par votre nom utilisateur)*
   - Appuyez sur **Entrée**

3. **Lancez l'application**:
   - Tapez: `docker compose up --build`
   - Appuyez sur **Entrée**
   - Attendez 2-3 minutes...

4. **Voyez ce message**? ✓
   ```
   agent-tri-cv Started
   ollama Started
   ```
   → **Succès!** Allez à l'étape 5

#### Les fois suivantes:

1. Ouvrez PowerShell dans le dossier `agent-tri-cv-main`
2. Tapez: `docker compose up`
3. Attendez le démarrage

---

### Sur Mac 🍎

#### Première fois:

1. **Ouvrez Terminal**:
   - Applications > Utilitaires > Terminal

2. **Naviguez au dossier**:
   ```bash
   cd ~/Desktop/agent-tri-cv-main
   ```
   (Si le dossier est ailleurs, faites glisser le dossier dans le Terminal)

3. **Lancez l'application**:
   ```bash
   docker compose up --build
   ```
   - Appuyez sur **Entrée**
   - Attendez 2-3 minutes...

4. **Voyez ce message**? ✓
   ```
   agent-tri-cv Started
   ollama Started
   ```
   → **Succès!**

#### Les fois suivantes:
```bash
docker compose up
```

---

### Sur Linux 🐧

Dans le terminal:
```bash
cd ~/agent-tri-cv
docker compose up --build  # Première fois
docker compose up          # Les fois suivantes
```

---

## Étape 5️⃣: Accéder à l'application

### Ouvrir Agent Tri CV dans votre navigateur

1. **Ouvrez un navigateur** (Chrome, Firefox, Edge, Safari)
2. Dans la barre d'adresse, tapez: `http://localhost:5000`
3. Appuyez sur **Entrée**

**Vous devriez voir une page avec**:
- Zone pour **Upload de CV**
- Bouton **"Analyser"**
- Onglet **"Résultats"**

✅ **Succès!** L'application est en marche!

---

## 🎯 Première Utilisation

### Analyser un CV

1. Cliquez sur **"Choisir un fichier"**
2. Sélectionnez un CV (fichier .PDF ou .DOCX)
3. Cliquez sur **"Analyser"**
4. Attendez 2-10 secondes ⏳
5. Voyez le **score** et les **détails** 📊

### Comprendre le Score

```
💎 TOP MATCH (85-100)      → Excellent! Appel immédiat
✅ ÉLIGIBLE (70-84)         → Très bon, à entretenir
🔍 À VÉRIFIER (50-69)       → À étudier plus
❌ REFUSÉ (<50)             → Profil insuffisant
```

### Voir l'Historique

1. Cliquez sur **"Résultats"**
2. Voyez tous les CVs analysés (tableau)
3. Cliquez sur **"Détails"** pour plus d'infos

---

## ❌ Dépannage Simple

### Problème: "Application ne répond pas"

**Solution**:
1. Ouvrez PowerShell/Terminal (même dossier)
2. Appuyez sur **Ctrl + C** (arrêter l'application)
3. Tapez: `docker compose restart`
4. Attendez 10 secondes
5. Réessayez: `http://localhost:5000`

### Problème: "Port 5000 already in use"

**Signifie**: Une autre application utilise le même port

**Solution**:
1. Ouvrez le fichier `docker-compose.yml`
2. Cherchez la ligne: `"5000:5000"`
3. Changez en: `"5001:5000"`
4. Sauvegardez (Ctrl + S)
5. Relancez: `docker compose up`
6. Accédez à: `http://localhost:5001`

### Problème: Docker ne démarre pas

**Solution**:
1. **Redémarrez votre ordinateur** (souvent résout 90% des problèmes!)
2. Ouvrez Docker Desktop (icône)
3. Attendez que l'icône baleine soit verte
4. Réessayez: `docker compose up`

### Problème: Permission denied (Linux/Mac)

**Solution**:
```bash
sudo chmod +x start-docker.sh
./start-docker.sh
```

---

## 🚀 Commandes Utiles (Résumé)

| Action | Commande |
|--------|----------|
| Démarrer | `docker compose up` |
| Arrêter | `Ctrl + C` (puis tapez) `docker compose down` |
| Redémarrer | `docker compose restart` |
| Reconstruire | `docker compose up --build` |
| Voir les logs | `docker compose logs -f` |

---

## 📞 Besoin d'aide?

**Avant de contacter support:**

1. ✅ Docker est-il installé? (`docker --version`)
2. ✅ Êtes-vous dans le bon dossier? (contient `docker-compose.yml`)
3. ✅ Y a-t-il assez d'espace disque? (20 GB minimum)
4. ✅ Avez-vous essayé de redémarrer?

**Si toujours pas d'aide:**
- 📄 Consultez: [`README.md`](./README.md) - Section "Dépannage"
- 📚 Consultez: [`DOCUMENTATION_TECHNIQUE.md`](./DOCUMENTATION_TECHNIQUE.md)
- 🐳 Consultez: [`OLLAMA_SETUP.md`](./OLLAMA_SETUP.md) - Configuration LLM

---

## ✅ Checklist d'Installation

- [ ] Windows/Mac/Linux identifié
- [ ] Docker Desktop téléchargé
- [ ] Docker Desktop installé
- [ ] `docker --version` fonctionne
- [ ] Agent Tri CV téléchargé
- [ ] `docker compose up` lancé
- [ ] `http://localhost:5000` ouvert ✓
- [ ] Un CV analysé avec succès ✓

**Félicitations! 🎉 Agent Tri CV est prêt à l'emploi!**

---

**Questions fréquentes:**

**Q: Combien de storage nécessaire?**
R: ~20 GB (Docker + modèles LLM)

**Q: Fonctionne hors-ligne?**
R: Oui! 100% local, aucune connexion internet requise

**Q: Combien de temps pour analyser un CV?**
R: 2-10 secondes (dépend du modèle LLM)

**Q: Combien de CVs puis-je analyser?**
R: Illimité! Les résultats sont sauvegardés localement

**Q: Comment partager les résultats?**
R: Les résultats sont en JSON (dossier `results/`), faciles à partager

---

**Version**: 1.0  
**Dernière mise à jour**: 19 avril 2026  
**Pour**: Utilisateurs non-informatiques  
