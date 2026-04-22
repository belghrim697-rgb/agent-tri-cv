from flask import Flask, render_template, request, jsonify, send_file
import os
from werkzeug.utils import secure_filename
from modules.extractor import TextExtractor
from modules.scorer import CVScorer
import json
from datetime import datetime

app = Flask(__name__)

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'docx'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max

# Créer les dossiers s'ils n'existent pas
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs('results', exist_ok=True)

def allowed_file(filename):
    """Vérifie si le fichier est autorisé"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def clear_results():
    """Efface tous les résultats antérieurs"""
    try:
        results_folder = 'results'
        if os.path.exists(results_folder):
            for file in os.listdir(results_folder):
                file_path = os.path.join(results_folder, file)
                if os.path.isfile(file_path):
                    os.remove(file_path)
        return True
    except Exception as e:
        print(f"Erreur lors du nettoyage: {e}")
        return False

@app.route('/')
def index():
    """Page d'accueil avec upload"""
    return render_template('index.html')

def analyze_cv_file(filepath, filename):
    """Analyse un CV et retourne le résultat (avec RAG si disponible)"""
    try:
        # Extraire le texte
        text = TextExtractor.extract_text(filepath)
        
        # Nettoyer le texte
        text_clean = TextExtractor.clean_text(text)
        
        # Extraire les sections
        sections = TextExtractor.extract_sections(text_clean)
        
        # Scorer le CV (scoring par mots-clés uniquement, RAG désactivé)
        scorer = CVScorer(enable_rag=False)  # RAG désactivé
        result = scorer.score_cv(text_clean, sections)
        
        # Ajouter les informations de fichier
        result['filename'] = filename
        result['filepath'] = filepath
        result['timestamp'] = datetime.now().isoformat()
        result['rag_available'] = False  # RAG désactivé
        
        return result
    except Exception as e:
        return {
            'filename': filename,
            'error': str(e),
            'timestamp': datetime.now().isoformat(),
            'rag_status': 'Erreur lors de l\'analyse'
        }

@app.route('/upload', methods=['POST'])
def upload_file():
    """Traite l'upload et l'analyse du CV (single)"""
    try:
        # Nettoyer les résultats antérieurs
        clear_results()
        
        # Vérifier que le fichier est présent
        if 'file' not in request.files:
            return jsonify({'error': 'Aucun fichier trouvé'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'Fichier vide'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Format non supporté. Utilisez PDF ou DOCX'}), 400
        
        # Sauvegarder le fichier
        filename = secure_filename(file.filename)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S_')
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], timestamp + filename)
        file.save(filepath)
        
        # Analyser le CV
        result = analyze_cv_file(filepath, filename)
        
        # Sauvegarder le résultat
        save_result(result, filename)
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/upload-batch', methods=['POST'])
def upload_batch():
    """Traite l'upload et l'analyse de plusieurs CVs"""
    try:
        # Nettoyer les résultats antérieurs
        clear_results()
        
        # Vérifier que des fichiers sont présents
        if 'files[]' not in request.files:
            return jsonify({'error': 'Aucun fichier trouvé'}), 400
        
        files = request.files.getlist('files[]')
        
        if not files or len(files) == 0:
            return jsonify({'error': 'Aucun fichier sélectionné'}), 400
        
        results = []
        
        for file in files:
            if file.filename == '':
                continue
            
            if not allowed_file(file.filename):
                results.append({
                    'filename': file.filename,
                    'error': 'Format non supporté. Utilisez PDF ou DOCX'
                })
                continue
            
            # Sauvegarder le fichier
            filename = secure_filename(file.filename)
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S_')
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], timestamp + filename)
            file.save(filepath)
            
            # Analyser le CV
            result = analyze_cv_file(filepath, filename)
            
            # Sauvegarder le résultat
            save_result(result, filename)
            
            results.append(result)
        
        # Trier les résultats par score (décroissant)
        results_sorted = sorted(
            [r for r in results if 'score' in r],
            key=lambda x: x.get('score', 0),
            reverse=True
        )
        # Ajouter les erreurs à la fin
        results_with_errors = results_sorted + [r for r in results if 'error' in r]
        
        return jsonify({
            'total': len(results),
            'processed': len(results_sorted),
            'errors': len([r for r in results if 'error' in r]),
            'results': results_with_errors
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def save_result(result, filename):
    """Sauvegarde le résultat dans un fichier JSON"""
    try:
        result_file = os.path.join('results', f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{filename}.json")
        with open(result_file, 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"Erreur sauvegarde résultat: {e}")

@app.route('/results')
def results_page():
    """Affiche la page des résultats"""
    return render_template('results.html')

@app.route('/get-results')
def get_results():
    """Récupère les résultats sauvegardés"""
    try:
        results = []
        results_dir = 'results'
        
        if os.path.exists(results_dir):
            files = sorted(os.listdir(results_dir), reverse=True)[:50]  # Derniers 50
            
            for file in files:
                if file.endswith('.json'):
                    with open(os.path.join(results_dir, file), 'r', encoding='utf-8') as f:
                        data = json.load(f)
                        results.append(data)
        
        return jsonify(results)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health')
def health():
    """Endpoint de santé"""
    return jsonify({'status': 'ok', 'message': 'Agent Tri CV est actif'})

@app.route('/download-cv')
def download_cv():
    """Télécharge le fichier CV"""
    try:
        filename = request.args.get('filename')
        
        if not filename:
            return jsonify({'error': 'Fichier non spécifié'}), 400
        
        # Chercher le fichier dans le dossier uploads
        # Les fichiers sont nommés avec un timestamp: YYYYMMDD_HHMMSS_filename
        upload_folder = app.config['UPLOAD_FOLDER']
        
        # Chercher le fichier correspondant
        for file in os.listdir(upload_folder):
            if file.endswith(filename):
                file_path = os.path.join(upload_folder, file)
                
                # Vérifier que le fichier existe
                if not os.path.exists(file_path):
                    return jsonify({'error': 'Fichier non trouvé'}), 404
                
                # Télécharger le fichier
                return send_file(file_path, as_attachment=True, download_name=filename)
        
        return jsonify({'error': 'Fichier non trouvé'}), 404
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
