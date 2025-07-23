from flask import Flask, render_template, request, jsonify
from crispr.guide_design import find_guides
from crispr.scoring import score_guides
from crispr.offtarget import analyze_offtarget

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/find-guides', methods=['POST'])
def api_find_guides():
    data = request.json
    sequence = data.get('sequence')
    cas_type = data.get('cas_type')
    pam = data.get('pam')
    
    try:
        guides = find_guides(sequence, cas_type, pam)
        return jsonify({'success': True, 'guides': guides})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/score-guides', methods=['POST'])
def api_score_guides():
    data = request.json
    guides = data.get('guides')
    
    try:
        scored_guides = score_guides(guides)
        return jsonify({'success': True, 'guides': scored_guides})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/analyze-offtarget', methods=['POST'])
def api_analyze_offtarget():
    data = request.json
    guide = data.get('guide')
    genome = data.get('genome')
    
    try:
        results = analyze_offtarget(guide, genome)
        return jsonify({'success': True, 'results': results})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)