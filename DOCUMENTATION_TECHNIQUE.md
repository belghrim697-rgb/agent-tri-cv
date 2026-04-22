# 📋 Documentation Technique - Agent Tri CV

## Table des matières
1. [Choix Technologiques](#1-choix-technologiques)
2. [Prétraitement et Extraction des Features](#2-prétraitement-et-extraction-des-features)
3. [Critères de Sélection et Scoring](#3-critères-de-sélection-et-logique-de-scoring)
4. [Biais Potentiels et Limites Éthiques](#4-biais-potentiels-et-limites-éthiques)

---

## 1. Choix Technologiques

### 1.1 Stack Backend

- **Flask 3.0.0**: Framework web léger, API REST
- **PyPDF2 3.0.1**: Extraction texte PDF (pure Python)
- **python-docx 0.8.11**: Extraction DOCX (Word documents)
- **Python 3.11-slim**: Lightweight Docker image (~100MB)

### 1.2 Infrastructure

- **Docker Compose**: Déploiement reproductible
- **Port 5000**: Application web locale

---

## 2. Prétraitement et Extraction des Features

### 2.0 Pipeline de Traitement

Le système extrait et analyse les CVs en 4 étapes:

```
CV (PDF/DOCX) 
    ↓
[1] Extraction Texte → PyPDF2 | python-docx
    ↓
[2] Nettoyage & Normalisation → Regex | String operations
    ↓
[3] Segmentation → Détection sections (Formation, Expérience, etc.)
    ↓
[4] Feature Extraction → Mots-clés, dates, statistiques
```

### 2.1 Extraction du Texte

#### 📄 **Fichiers PDF** - Bibliothèque `PyPDF2 3.0.1`

```python
from PyPDF2 import PdfReader

reader = PdfReader(file)
text = ""
for page in reader.pages:
    text += page.extract_text()
```

**Caractéristiques PyPDF2**:
- ✅ Extraction texte pur (pas d'images)
- ✅ Support PDF complexes (multi-colonnes, tableaux)
- ✅ Aucune dépendance externe (pure Python)
- ⚠️ Limitation: PDFs scannés (images) non supportés
- ⚠️ Limitation: OCR absent (nécessite Tesseract externe)

#### 📋 **Fichiers DOCX** - Bibliothèque `python-docx 0.8.11`

```python
from docx import Document

doc = Document(file)
text = "\n".join([para.text for para in doc.paragraphs])
```

**Caractéristiques python-docx**:
- ✅ Extraction texte + styles (italique, gras)
- ✅ Accès aux tableaux intégrés
- ✅ Support des en-têtes/pieds de page
- ⚠️ Limitation: Macros VBA non exécutées
- ⚠️ Limitation: Images textualisées ignorées

### 2.2 Nettoyage et Normalisation du Texte

#### Regex & String Operations

```python
# 1. Suppression caractères spéciaux
text = re.sub(r'[^\w\s\-]', ' ', text)

# 2. Normalisation espaces multiples
text = re.sub(r'\s+', ' ', text).strip()

# 3. Conversion minuscules (insensibilité case)
text = text.lower()

# 4. Suppression accents (optionnel)
import unicodedata
text = ''.join(
    c for c in unicodedata.normalize('NFD', text)
    if unicodedata.category(c) != 'Mn'
)
```

**Objectifs de nettoyage**:
- Uniformiser la casse (match "PYTHON" = "python")
- Supprimer caractères HTML/PDF échappés
- Normaliser espaces (multi-espaces → 1 espace)
- Optionnellement dé-accenter pour matching robuste

### 2.3 Segmentation et Extraction de Sections

#### Détection des Sections

```python
# Patterns pour localiser sections
SECTIONS = {
    'formation': r'(formation|diplôme|études|bac|licence|master)',
    'experience': r'(expérience|emploi|poste|sociétés|travail)',
    'competences': r'(compétences|skills|savoir.*faire)',
    'langues': r'(langues|languages|français|anglais)',
}

# Extraction par regex multi-line
for section_name, pattern in SECTIONS.items():
    matches = re.finditer(pattern, text, re.IGNORECASE)
    # Extraction texte entre matches
```

**Limitations**:
- CVs sans en-têtes de section → Détection approximative
- Sections imbriquées → Peuvent se chevaucher
- Format libre → Impossible à 100% prédire structure

### 2.4 Extraction des Features (Features Engineering)

#### **Dates et Durée d'Expérience**

```python
import re
from datetime import datetime

# Pattern: mois/année (MM/YYYY ou Mois YYYY)
DATE_PATTERN = r'(\d{1,2}/\d{4}|janvier|février|...|décembre\s+\d{4})'

# Exemple extraction:
# "Développeur Senior - Jan 2020 à Mars 2024"
# → Début: 01/2020, Fin: 03/2024
# → Durée: 4 ans 2 mois

def calculate_years_from_dates(start_date, end_date):
    """Calcule années écoulées"""
    delta = end_date - start_date
    return round(delta.days / 365.25, 1)
```

**Fonctionnalités**:
- Parsing flexible (formats variés acceptés)
- Détection "Actuellement" / "Présent"
- Calcul automatique durée en années
- Gestion gaps (chômage, sabbatique)

#### **Extraction Mots-clés**

```python
# Approche simple: matching direct
KEYWORDS_DB = {
    'python': ['python', 'py3', 'django', 'flask'],
    'react': ['react', 'react.js', 'jsx'],
    'aws': ['aws', 'amazon web services', 'ec2', 's3'],
    # ... 100+ keywords
}

for skill_name, variants in KEYWORDS_DB.items():
    for variant in variants:
        if variant in text:
            keywords_found.append(skill_name)
            points += 1  # 1 point par keyword unique
```

**Fichier de configuration**: `config/keywords.json`

```json
{
  "python": {
    "mots_cles": ["python", "py3", "django", "flask", "fastapi"],
    "points": 1
  },
  "react": {
    "mots_cles": ["react", "react.js", "jsx", "next.js"],
    "points": 1
  }
}
```

#### **Calcul Statistiques**

```python
# Extraits automatiquement du texte nettoyé:
stats = {
    'word_count': len(text.split()),
    'sentence_count': len(re.split(r'[.!?]', text)),
    'avg_words_per_sentence': word_count / sentence_count,
    'vocabulary_richness': len(set(text.split())) / word_count,
    'has_numbers': bool(re.search(r'\d+', text)),
    'has_emails': bool(re.search(r'\S+@\S+', text)),
    'has_phone': bool(re.search(r'\d{10}', text)),
}
```

**Utilité**: Détection anomalies (CV trop court, absence contact, etc.)

### 2.5 Limitations & Considérations

| Limitation | Impact | Mitigation |
|-----------|--------|-----------|
| PDFs scannés (images) | Texte vide → Score 0 | Message utilisateur clair |
| Texte mal encodé | Caractères corrompus | Tentative multiple encodages |
| Formats exotiques (.ODT, .RTF) | Non supportés | Liste formats explicite |
| Texte en minuscules | Détection difficile "PYTHON" | Normalisation case-insensitive |
| Caractères spéciaux (€, ñ, ü) | Écrasés par regex | Unicodedata.normalize() |

---

## 3. Critères de Sélection et Logique de Scoring

### 3.1 Filtres KO (Élimination automatique)

Si TOUS ces critères sont vrais → Candidat **REJETÉ**:

- Expérience < 1 an
- Aucune formation détectée
- Aucun français/anglais
- Inactivité > 5 ans

### 3.2 Scoring par Mots-clés: 100 points max

| Catégorie | Points | Critères |
|-----------|--------|----------|
| Formation | 20 | Bachelor(8), Master(10), Écoles(12), Certs(2) |
| Expérience | 25 | 1-3ans(8), 3-5ans(15), 5-10ans(20), 10+(25) |
| Compétences | 20 | 1 mot-clé = 1pt (Python, React, AWS, etc.) |
| Soft Skills | 15 | Leadership(3), Comm(2), Team(2), Proj(3), Adatp(2), Problem(3) |
| Langues | 10 | FR native(4), EN courant(4), Autre(2) |
| Culture | 10 | Startup(3), Scale-up(3), Grand groupe(2), Service(1) |

### 3.3 Seuils de Décision

| Plage | Statut | Action |
|-------|--------|--------|
| 80-100% | 💎 TOP MATCH | Interview immédiate |
| 60-79% | ✅ ÉLIGIBLE | Vérifier + entretien |
| 40-59% | 🔍 À VÉRIFIER | Sélection manuelle |
| 0-39% | ❌ REFUSÉ | Non retenus |

---

## 4. Biais Potentiels et Limites Éthiques

### 4.1 Biais Identifiés

1. **Biais de Langage**: CVs mal écrits perdent des points → Défavorise dyslexiques/non-natifs
2. **Biais de Format**: PDFs complexes mal parsés → Défavorise CV graphique
3. **Biais de Pedigree**: Grandes écoles surpondérées → Défavorise autodidactes
4. **Biais de Récence**: Inactifs > 5 ans rejetés → Défavorise carrière atypique
5. **Biais Technologique**: Tech-stack listing incomplet → Défavorise tech obscure
6. **Biais d'Expérience**: Exigence années → Défavorise jeunes talents

### 4.2 Recommandations Éthiques

**Immédiatement**:
- ✅ Logs exhaustifs des décisions (traçabilité)
- ✅ Permettre override manuel des filtres KO
- ✅ Afficher breakdown au recruiter (transparence)

**À étudier**:
- 🔄 Anonymisation CVs (Candidat #123)
- 🔄 Blind review par lots
- 🔄 Audit biais mensuel

### 4.3 Limitations

- Keywords configurés manuellement → Potentiellement biaisés
- Config actuelle: Tech/DevOps/Data (autres métiers mal supportés)
- Pas de calibration aux résultats réels (feedback loop manquante)
- Pas de détection "1 an répété 3 fois" vs "3 ans continus"

### 4.4 Conformité

- ✅ **RGPD**: Données locales, suppression possible
- ✅ **Discriminations**: Pas de profiling age/origine/sexe
- ⚠️ **Responsabilité**: À l'utilisateur de faire évaluation humaine finale

---

**Créateurs**: Iman El Baraka, Rim Belghiti, Zainab Serroukh  
**Université**: Université Abdelmalek Essaidi, FSJEST (Tanger)  
**Année**: 2026  
**Développement assisté par IA**: Claude Haiku 4.5 (Anthropic)
