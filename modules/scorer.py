import json
import re
import os
from modules.extractor import TextExtractor

class CVScorer:
    """Moteur de scoring pour analyser et noter les CV
    
    Scoring par mots-clés:
    - 100% Keywords (rapide, fiable, gratuit)
    """
    
    def __init__(self, keywords_path='config/keywords.json', scoring_path='config/scoring.json', enable_rag=False):
        """Initialise le scorer avec les fichiers de configuration"""
        self.keywords = self._load_json(keywords_path)
        self.scoring = self._load_json(scoring_path)
        self.scores = {}
        self.details = {}
    
    @staticmethod
    def _load_json(path):
        """Charge un fichier JSON"""
        try:
            with open(path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            raise Exception(f"Erreur chargement {path}: {str(e)}")
    
    def find_keyword(self, text, keyword_list):
        """Cherche si l'un des mots-clés est dans le texte"""
        for keyword in keyword_list:
            if re.search(r'\b' + re.escape(keyword) + r'\b', text, re.IGNORECASE):
                return True
        return False
    
    def check_ko_filters(self, text, sections):
        """Vérifie les filtres éliminatoires"""
        ko_reasons = []
        
        # Filtre français insuffisant (compte les fautes)
        # Mots français valides 1-2 caractères (whitelist)
        french_valid_short = {
            'a', 'à', 'ai', 'an', 'as', 'au', 'ça', 'ce', 'ci', 'co', 'cv',
            'de', 'du', 'é', 'en', 'es', 'et', 'eu', 'ex', 'fa', 'fi', 'fr',
            'go', 'ha', 'ho', 'id', 'il', 'in', 'io', 'ir', 'is', 'it', 'ja',
            'je', 'kg', 'la', 'le', 'li', 'lo', 'lu', 'ma', 'me', 'mi', 'ml',
            'mo', 'ms', 'mu', 'my', 'na', 'ne', 'ni', 'no', 'nu', 'oe', 'on',
            'or', 'ou', 'pa', 'pc', 'pe', 'pi', 'pm', 'po', 'pr', 'ps', 'pt',
            'qa', 're', 'rh', 'ri', 'ro', 'ru', 'sa', 'se', 'si', 'so', 'su',
            'ta', 'te', 'ti', 'to', 'tv', 'tu', 'tx', 'ty', 'ua', 'ue', 'ui',
            'un', 'up', 'us', 'ut', 've', 'vi', 'vo', 'vs', 'vx', 'wa', 'we',
            'wi', 'wo', 'xa', 'xp', 'ya', 'ye', 'yi', 'yo', 'yu', 'za', 'ze',
            'zi', 'zo', 'ït'
        }
        
        # Trouve les mots courts et filtre la liste blanche
        short_words = re.findall(r'\b[a-z]{1,2}\b', text)
        invalid_short = [w for w in short_words if w not in french_valid_short]
        
        if len(invalid_short) > 20:  # Seuil plus réaliste
            ko_reasons.append(f"Français insuffisant ({len(invalid_short)} mots suspectes)")
        
        # Filtre niveau études trop bas
        bac2_keywords = self.keywords.get('formation', {}).get('niveau_bac2', {}).get('mots_cles', [])
        bac3_keywords = self.keywords.get('formation', {}).get('niveau_bac3', {}).get('mots_cles', [])
        bac4_keywords = self.keywords.get('formation', {}).get('niveau_bac4_5', {}).get('mots_cles', [])
        
        has_required_level = (self.find_keyword(sections.get('formation', ''), bac2_keywords) or
                             self.find_keyword(sections.get('formation', ''), bac3_keywords) or
                             self.find_keyword(sections.get('formation', ''), bac4_keywords))
        
        if not has_required_level:
            ko_reasons.append("Niveau d'études insuffisant (< Bac+2)")
        
        return ko_reasons
    
    def score_formation(self, text, sections):
        """Évalue la formation (15 pts max)"""
        points = 0
        details = []
        formation_text = sections.get('formation', '')
        
        # Niveau d'études
        niveau_points = {
            'niveau_bac3': (10, "Bac+3"),
            'niveau_bac4_5': (8, "Bac+4/5"),
            'niveau_bac2': (5, "Bac+2"),
        }
        
        for niveau_key, (pts, label) in niveau_points.items():
            if self.find_keyword(formation_text, self.keywords['formation'][niveau_key]['mots_cles']):
                points += pts
                details.append(f"{label}: {pts} pts")
                break
        
        # Domaine d'études
        dominane_points = {
            'domaine_rh': (5, "RH"),
            'domaine_gestion': (3, "Gestion"),
            'domaine_commerce': (2, "Commerce"),
        }
        
        for domain_key, (pts, label) in dominane_points.items():
            if self.find_keyword(formation_text, self.keywords['formation'][domain_key]['mots_cles']):
                points += pts
                details.append(f"Domaine {label}: {pts} pts")
                break
        
        return min(points, 15), details
    
    def score_experience(self, text, sections):
        """Évalue l'expérience (35 pts max)"""
        points = 0
        details = []
        experience_text = sections.get('experience', '')
        
        # === DURÉE D'EXPÉRIENCE : Calcul automatique des dates ===
        periods = TextExtractor.extract_dates(experience_text)
        total_years = TextExtractor.calculate_total_experience_years(periods)
        
        # Attribuer les points basé sur la durée calculée
        duree_detail = None
        if total_years >= 5:
            points += 15
            duree_detail = f"Durée calculée: {total_years} ans (Senior) : 15 pts"
        elif total_years >= 3:
            points += 12
            duree_detail = f"Durée calculée: {total_years} ans (Confirmé) : 12 pts"
        elif total_years >= 1:
            points += 8
            duree_detail = f"Durée calculée: {total_years} ans (Junior) : 8 pts"
        elif total_years > 0:
            points += 5
            duree_detail = f"Durée calculée: {total_years} ans (Débutant) : 5 pts"
        else:
            # Fallback : chercher les mots-clés si pas de dates trouvées
            duree_points = {
                'duree_senior': (15, "+5 ans (Senior)"),
                'duree_confirme': (12, "3-5 ans (Confirmé)"),
                'duree_junior': (8, "1-3 ans (Junior)"),
                'duree_debutant': (5, "Stage/Alternance"),
            }
            
            for duree_key, (pts, label) in duree_points.items():
                if self.find_keyword(experience_text, self.keywords['experience'][duree_key]['mots_cles']):
                    points += pts
                    duree_detail = f"Durée (mots-clés): {label} : {pts} pts"
                    break
        
        if duree_detail:
            details.append(duree_detail)
        
        # === TYPE DE POSTE ===
        fonction_points = {
            'fonction_recrutement_pur': (15, "Recrutement Pur"),
            'fonction_rh_generaliste': (8, "RH Généraliste"),
        }
        
        for fonction_key, (pts, label) in fonction_points.items():
            if self.find_keyword(experience_text, self.keywords['experience'][fonction_key]['mots_cles']):
                points += pts
                details.append(f"Fonction {label}: {pts} pts")
                break
        
        # === SECTEUR AUTOMOBILE (BONUS) ===
        if self.find_keyword(text, self.keywords['experience']['secteur_automobile']['mots_cles']):
            points += 5
            details.append("Secteur Automobile: +5 pts")
        
        return min(points, 35), details
    
    def score_competences_techniques(self, text, sections):
        """Évalue les compétences techniques (20 pts max)"""
        points = 0
        details = []
        
        # Sourcing
        sourcing_points = {
            'sourcing_expert': (8, "Expert Sourcing"),
            'sourcing_standard': (4, "Sourcing Standard"),
        }
        
        for sourcing_key, (pts, label) in sourcing_points.items():
            if self.find_keyword(text, self.keywords['competences_techniques'][sourcing_key]['mots_cles']):
                points += pts
                details.append(f"{label}: {pts} pts")
                break
        
        # Excel
        excel_points = {
            'excel_avance': (7, "Excel Avancé"),
            'office_standard': (4, "Pack Office"),
        }
        
        for excel_key, (pts, label) in excel_points.items():
            if self.find_keyword(text, self.keywords['competences_techniques'][excel_key]['mots_cles']):
                points += pts
                details.append(f"{label}: {pts} pts")
                break
        
        # Méthodes et ATS
        if self.find_keyword(text, self.keywords['competences_techniques']['ats_logiciel']['mots_cles']):
            points += 5
            details.append("ATS/Logiciel RH: 5 pts")
        elif self.find_keyword(text, self.keywords['competences_techniques']['methodes_entretien']['mots_cles']):
            points += 3
            details.append("Méthodes d'Entretien: 3 pts")
        
        return min(points, 20), details
    
    def score_soft_skills(self, text, sections):
        """Évalue les soft skills (15 pts max)"""
        points = 0
        details = []
        
        # Rigueur & Organisation
        if self.find_keyword(text, self.keywords['soft_skills']['rigueur_organisation']['mots_cles']):
            points += 5
            details.append("Rigueur & Organisation: 5 pts")
        elif self.find_keyword(text, self.keywords['soft_skills']['rigueur_moyen']['mots_cles']):
            points += 2
            details.append("Rigueur basique: 2 pts")
        
        # Relationnel
        if self.find_keyword(text, self.keywords['soft_skills']['relationnel_maximal']['mots_cles']):
            points += 5
            details.append("Relationnel & Équipe: 5 pts")
        elif self.find_keyword(text, self.keywords['soft_skills']['relationnel_moyen']['mots_cles']):
            points += 2
            details.append("Bon relationnel: 2 pts")
        
        # Éthique & Adaptabilité
        if self.find_keyword(text, self.keywords['soft_skills']['ethique_maximal']['mots_cles']):
            points += 5
            details.append("Éthique & Adaptabilité: 5 pts")
        elif self.find_keyword(text, self.keywords['soft_skills']['ethique_moyen']['mots_cles']):
            points += 2
            details.append("Adaptabilité: 2 pts")
        
        return min(points, 15), details
    
    def score_langues(self, text, sections):
        """Évalue les langues (10 pts max)"""
        points = 0
        details = []
        
        # Français
        if self.find_keyword(text, self.keywords['langues']['francais_expert']['mots_cles']):
            points += 5
            details.append("Français: Expert 5 pts")
        elif self.find_keyword(text, self.keywords['langues']['francais_avance']['mots_cles']):
            points += 4
            details.append("Français: Avancé 4 pts")
        else:
            points += 2
            details.append("Français: Intermédiaire 2 pts")
        
        # Anglais
        if self.find_keyword(text, self.keywords['langues']['anglais_avance']['mots_cles']):
            points += 4
            details.append("Anglais: B2-C2 4 pts")
        elif self.find_keyword(text, self.keywords['langues']['anglais_intermediaire']['mots_cles']):
            points += 2
            details.append("Anglais: B1 2 pts")
        
        # Langues bonus
        if self.find_keyword(text, self.keywords['langues']['langue_bonus']['mots_cles']):
            points += 1
            details.append("Langue bonus: +1 pt")
        
        return min(points, 10), details
    
    def score_culture_entreprise(self, text, sections):
        """Évalue l'adéquation culture d'entreprise (5 pts max)"""
        points = 0
        details = []
        
        # ADN Industriel
        if self.find_keyword(text, self.keywords['culture_entreprise']['adn_industriel']['mots_cles']):
            points += 2
            details.append("ADN Industriel: 2 pts")
        
        # Orientation Résultats
        if self.find_keyword(text, self.keywords['culture_entreprise']['orientation_resultats']['mots_cles']):
            points += 2
            details.append("Orientation Résultats: 2 pts")
        
        # Esprit de Service
        if self.find_keyword(text, self.keywords['culture_entreprise']['esprit_service']['mots_cles']):
            points += 1
            details.append("Esprit de Service: 1 pt")
        
        return min(points, 5), details
    
    def get_status(self, total_score):
        """Détermine le statut basé sur le score total"""
        seuils = self.scoring['seuils']
        
        if seuils['top_match']['min'] <= total_score <= seuils['top_match']['max']:
            return seuils['top_match']
        elif seuils['eligible']['min'] <= total_score <= seuils['eligible']['max']:
            return seuils['eligible']
        elif seuils['a_verifier']['min'] <= total_score <= seuils['a_verifier']['max']:
            return seuils['a_verifier']
        else:
            return seuils['refuse']
    
    def score_cv(self, text, sections):
        """Calcule le score total du CV par scoring mots-clés"""
        self.scores = {}
        self.details = {}
        
        # Calculer les scores par catégorie (Keywords uniquement)
        self.scores['formation'], self.details['formation'] = self.score_formation(text, sections)
        self.scores['experience'], self.details['experience'] = self.score_experience(text, sections)
        self.scores['competences_techniques'], self.details['competences_techniques'] = self.score_competences_techniques(text, sections)
        self.scores['soft_skills'], self.details['soft_skills'] = self.score_soft_skills(text, sections)
        self.scores['langues'], self.details['langues'] = self.score_langues(text, sections)
        self.scores['culture_entreprise'], self.details['culture_entreprise'] = self.score_culture_entreprise(text, sections)
        
        # Total
        total_score = sum(self.scores.values())
        total_max = sum([self.scoring['baremes'][cat]['max_points'] for cat in self.scores.keys()])
        total_percentage = int((total_score / total_max) * 100) if total_max > 0 else 0
        
        # Vérifier les filtres KO (après calcul des scores)
        ko_reasons = self.check_ko_filters(text, sections)
        if ko_reasons:
            return {
                'total': total_percentage,
                'status': '❌ REJETÉ',
                'ko': True,
                'ko_reasons': ko_reasons,
                'breakdown': {
                    'formation': {'points': self.scores['formation'], 'max': self.scoring['baremes']['formation']['max_points'], 'details': self.details['formation']},
                    'experience': {'points': self.scores['experience'], 'max': self.scoring['baremes']['experience']['max_points'], 'details': self.details['experience']},
                    'competences_techniques': {'points': self.scores['competences_techniques'], 'max': self.scoring['baremes']['competences_techniques']['max_points'], 'details': self.details['competences_techniques']},
                    'soft_skills': {'points': self.scores['soft_skills'], 'max': self.scoring['baremes']['soft_skills']['max_points'], 'details': self.details['soft_skills']},
                    'langues': {'points': self.scores['langues'], 'max': self.scoring['baremes']['langues']['max_points'], 'details': self.details['langues']},
                    'culture_entreprise': {'points': self.scores['culture_entreprise'], 'max': self.scoring['baremes']['culture_entreprise']['max_points'], 'details': self.details['culture_entreprise']},
                },
                'total_points': f"{total_score}/{total_max}",
                'rag_available': False
            }
        
        status = self.get_status(total_percentage)
        
        return {
            'total': total_percentage,
            'status': status['label'],
            'action': status['action'],
            'color': status['color'],
            'ko': False,
            'rag_available': False,
            'breakdown': {
                'formation': {'points': self.scores['formation'], 'max': self.scoring['baremes']['formation']['max_points'], 'details': self.details['formation']},
                'experience': {'points': self.scores['experience'], 'max': self.scoring['baremes']['experience']['max_points'], 'details': self.details['experience']},
                'competences_techniques': {'points': self.scores['competences_techniques'], 'max': self.scoring['baremes']['competences_techniques']['max_points'], 'details': self.details['competences_techniques']},
                'soft_skills': {'points': self.scores['soft_skills'], 'max': self.scoring['baremes']['soft_skills']['max_points'], 'details': self.details['soft_skills']},
                'langues': {'points': self.scores['langues'], 'max': self.scoring['baremes']['langues']['max_points'], 'details': self.details['langues']},
                'culture_entreprise': {'points': self.scores['culture_entreprise'], 'max': self.scoring['baremes']['culture_entreprise']['max_points'], 'details': self.details['culture_entreprise']},
            },
            'total_points': f"{total_score}/{total_max}"
        }
