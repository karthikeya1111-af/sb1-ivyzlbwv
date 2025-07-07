from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import nltk
import re
import random
import json
from collections import defaultdict
import os
from dotenv import load_dotenv

# Optional AI generator import (disabled for now due to dependency issues)
AI_AVAILABLE = False
ai_generator = None
print("AI features temporarily disabled - install spacy and transformers to enable")

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

try:
    nltk.data.find('corpora/wordnet')
except LookupError:
    nltk.download('wordnet')

from nltk.corpus import stopwords, wordnet
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer

load_dotenv()

app = Flask(__name__)
CORS(app)

class BusinessNameGenerator:
    def __init__(self):
        self.stop_words = set(stopwords.words('english'))
        self.lemmatizer = WordNetLemmatizer()
        
        # Predefined word lists for name generation
        self.prefixes = [
            'Meta', 'Neo', 'Pro', 'Ultra', 'Super', 'Smart', 'Tech', 'Digital',
            'Cyber', 'Cloud', 'Quantum', 'Alpha', 'Beta', 'Prime', 'Elite',
            'Global', 'Rapid', 'Swift', 'Pure', 'Fresh', 'Green', 'Blue',
            'Crystal', 'Golden', 'Silver', 'Star', 'Moon', 'Sun', 'Fire'
        ]
        
        self.suffixes = [
            'Labs', 'Works', 'Studio', 'Solutions', 'Systems', 'Technologies',
            'Innovations', 'Ventures', 'Enterprises', 'Group', 'Corp', 'Inc',
            'Hub', 'Spot', 'Zone', 'Base', 'Center', 'Point', 'Space',
            'ify', 'ly', 'wise', 'flow', 'sync', 'mind', 'wave', 'sphere'
        ]
        
        self.connectors = ['&', 'and', '+', 'x', 'meets', 'plus']
        
        # Industry-specific keywords
        self.industry_keywords = {
            'tech': ['tech', 'digital', 'cyber', 'smart', 'ai', 'data', 'cloud', 'app'],
            'food': ['fresh', 'tasty', 'bite', 'flavor', 'kitchen', 'chef', 'gourmet'],
            'health': ['wellness', 'care', 'health', 'fit', 'pure', 'vital', 'life'],
            'fashion': ['style', 'chic', 'trend', 'mode', 'elite', 'luxury', 'boutique'],
            'eco': ['green', 'eco', 'natural', 'earth', 'pure', 'clean', 'sustainable'],
            'pet': ['pet', 'paw', 'tail', 'furry', 'companion', 'animal', 'care'],
            'beauty': ['beauty', 'glow', 'radiant', 'luxe', 'elegant', 'charm', 'allure']
        }
        
        # Tone-based modifiers
        self.tone_modifiers = {
            'professional': {
                'prefixes': ['Pro', 'Elite', 'Prime', 'Global', 'Alpha', 'Strategic'],
                'suffixes': ['Solutions', 'Enterprises', 'Group', 'Corp', 'Systems', 'Consulting']
            },
            'playful': {
                'prefixes': ['Bubble', 'Happy', 'Jolly', 'Funky', 'Crazy', 'Wild'],
                'suffixes': ['Zone', 'Spot', 'Hub', 'Corner', 'Place', 'World']
            },
            'elegant': {
                'prefixes': ['Luxe', 'Elite', 'Royal', 'Golden', 'Crystal', 'Pearl'],
                'suffixes': ['Collection', 'Studio', 'Boutique', 'Gallery', 'House', 'Atelier']
            },
            'minimal': {
                'prefixes': ['Pure', 'Simple', 'Clean', 'Clear', 'Bare', 'Core'],
                'suffixes': ['Co', 'Lab', 'Studio', 'Works', 'Space', 'House']
            }
        }

    def extract_keywords(self, text):
        """Extract and process keywords from input text using NLP"""
        # Tokenize and clean
        tokens = word_tokenize(text.lower())
        
        # Remove stopwords and non-alphabetic tokens
        keywords = [word for word in tokens if word.isalpha() and word not in self.stop_words]
        
        # Lemmatize words
        keywords = [self.lemmatizer.lemmatize(word) for word in keywords]
        
        # Get synonyms for each keyword
        expanded_keywords = set(keywords)
        for keyword in keywords:
            synonyms = self.get_synonyms(keyword)
            expanded_keywords.update(synonyms[:3])  # Add up to 3 synonyms
        
        return list(expanded_keywords)

    def get_synonyms(self, word):
        """Get synonyms for a word using WordNet"""
        synonyms = set()
        for syn in wordnet.synsets(word):
            for lemma in syn.lemmas():
                synonym = lemma.name().replace('_', ' ')
                if synonym != word and len(synonym) <= 12:  # Avoid very long synonyms
                    synonyms.add(synonym)
        return list(synonyms)

    def detect_industry(self, keywords):
        """Detect industry based on keywords"""
        industry_scores = defaultdict(int)
        
        for keyword in keywords:
            for industry, terms in self.industry_keywords.items():
                if any(term in keyword.lower() for term in terms):
                    industry_scores[industry] += 1
        
        if industry_scores:
            return max(industry_scores, key=industry_scores.get)
        return 'general'

    def generate_rule_based_names(self, keywords, tone='professional', count=10):
        """Generate business names using rule-based logic"""
        names = []
        industry = self.detect_industry(keywords)
        
        # Get tone-specific modifiers
        tone_data = self.tone_modifiers.get(tone, self.tone_modifiers['professional'])
        available_prefixes = self.prefixes + tone_data['prefixes']
        available_suffixes = self.suffixes + tone_data['suffixes']
        
        # Add industry-specific keywords if detected
        if industry in self.industry_keywords:
            available_prefixes.extend(self.industry_keywords[industry])
        
        # Generate different types of names
        main_keywords = keywords[:5]  # Use top 5 keywords
        
        for _ in range(count):
            name_type = random.choice(['prefix_keyword', 'keyword_suffix', 'compound', 'modified'])
            
            if name_type == 'prefix_keyword':
                prefix = random.choice(available_prefixes)
                keyword = random.choice(main_keywords)
                name = f"{prefix.title()}{keyword.title()}"
                
            elif name_type == 'keyword_suffix':
                keyword = random.choice(main_keywords)
                suffix = random.choice(available_suffixes)
                name = f"{keyword.title()}{suffix.title()}"
                
            elif name_type == 'compound':
                if len(main_keywords) >= 2:
                    k1, k2 = random.sample(main_keywords, 2)
                    connector = random.choice(['', ' & ', ' + ', ''])
                    name = f"{k1.title()}{connector}{k2.title()}"
                else:
                    keyword = random.choice(main_keywords)
                    suffix = random.choice(available_suffixes)
                    name = f"{keyword.title()}{suffix}"
                    
            else:  # modified
                keyword = random.choice(main_keywords)
                # Add creative modifications
                if random.choice([True, False]):
                    name = keyword.title() + random.choice(['ify', 'ly', 'wise', 'hub', 'lab'])
                else:
                    name = random.choice(['The ', '']) + keyword.title() + random.choice([' Co', ' Lab', ' Works'])
            
            if name not in names and len(name) <= 25:
                names.append(name)
        
        return names[:count]

    def generate_taglines(self, business_names, industry='general'):
        """Generate simple taglines for business names"""
        tagline_templates = {
            'general': [
                "Innovating the future",
                "Excellence delivered",
                "Your success, our mission",
                "Where quality meets innovation",
                "Leading the way forward"
            ],
            'tech': [
                "Powering digital transformation",
                "Code the future",
                "Where innovation meets technology",
                "Building tomorrow's solutions",
                "Smart technology, smarter results"
            ],
            'food': [
                "Taste the difference",
                "Fresh flavors, every time",
                "Crafted with passion",
                "Where taste meets quality",
                "Bringing flavor to life"
            ],
            'health': [
                "Your wellness journey starts here",
                "Healthy living, better life",
                "Care that counts",
                "Wellness redefined",
                "Your health, our priority"
            ]
        }
        
        templates = tagline_templates.get(industry, tagline_templates['general'])
        
        taglines = []
        for name in business_names:
            tagline = random.choice(templates)
            taglines.append(tagline)
        
        return taglines

    def categorize_names(self, names):
        """Categorize names by theme"""
        categories = {
            'Tech & Innovation': [],
            'Professional': [],
            'Creative': [],
            'Elegant': []
        }
        
        tech_keywords = ['tech', 'digital', 'cyber', 'smart', 'cloud', 'lab', 'system']
        professional_keywords = ['corp', 'group', 'enterprise', 'solution', 'consulting', 'global']
        elegant_keywords = ['luxe', 'elite', 'royal', 'golden', 'crystal', 'boutique', 'studio']
        
        for name in names:
            name_lower = name.lower()
            
            if any(keyword in name_lower for keyword in tech_keywords):
                categories['Tech & Innovation'].append(name)
            elif any(keyword in name_lower for keyword in professional_keywords):
                categories['Professional'].append(name)
            elif any(keyword in name_lower for keyword in elegant_keywords):
                categories['Elegant'].append(name)
            else:
                categories['Creative'].append(name)
        
        # Remove empty categories
        return {k: v for k, v in categories.items() if v}

# Initialize the generators
generator = BusinessNameGenerator()
# AI generator disabled for now
# ai_generator = AINameGenerator() if AI_AVAILABLE else None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate_names():
    try:
        data = request.get_json()
        input_text = data.get('input_text', '')
        tone = data.get('tone', 'professional')
        count = min(int(data.get('count', 15)), 50)  # Limit to 50 names max
        use_ai = data.get('use_ai', False) and AI_AVAILABLE
        
        if not input_text.strip():
            return jsonify({'error': 'Please provide input text'}), 400
        
        # Extract keywords using NLP
        keywords = generator.extract_keywords(input_text)
        
        if not keywords:
            return jsonify({'error': 'No valid keywords found in input'}), 400
        
        # Detect industry for better taglines
        industry = generator.detect_industry(keywords)
        
        # Generate business names
        if use_ai and ai_generator:
            # Mix AI and rule-based names
            ai_count = min(count // 2, 15)  # Limit AI calls
            rule_count = count - ai_count
            
            ai_names = ai_generator.generate_creative_names(keywords, tone, ai_count)
            rule_names = generator.generate_rule_based_names(keywords, tone, rule_count)
            
            # Combine and shuffle
            all_names = ai_names + rule_names
            random.shuffle(all_names)
            names = all_names[:count]
            
            # Try to generate AI taglines for AI names
            if ai_generator.openai_api_key:
                ai_taglines = ai_generator.generate_ai_taglines(ai_names, industry)
                rule_taglines = generator.generate_taglines(rule_names, industry)
                
                # Combine taglines in the same order as names
                taglines = []
                ai_tagline_dict = dict(zip(ai_names, ai_taglines))
                rule_tagline_dict = dict(zip(rule_names, rule_taglines))
                
                for name in names:
                    if name in ai_tagline_dict:
                        taglines.append(ai_tagline_dict[name])
                    elif name in rule_tagline_dict:
                        taglines.append(rule_tagline_dict[name])
                    else:
                        taglines.append(generator.generate_taglines([name], industry)[0])
            else:
                taglines = generator.generate_taglines(names, industry)
                
            generation_method = "AI + Rule-based"
        else:
            # Use only rule-based generation
            names = generator.generate_rule_based_names(keywords, tone, count)
            taglines = generator.generate_taglines(names, industry)
            generation_method = "Rule-based"
        
        # Categorize names
        categories = generator.categorize_names(names)
        
        # Combine names with taglines
        name_data = [
            {
                'name': name,
                'tagline': tagline,
                'id': i
            }
            for i, (name, tagline) in enumerate(zip(names, taglines))
        ]
        
        return jsonify({
            'names': name_data,
            'categories': categories,
            'keywords_extracted': keywords[:10],  # Show top 10 keywords
            'industry_detected': industry,
            'total_generated': len(names),
            'generation_method': generation_method,
            'ai_available': AI_AVAILABLE
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/save_favorite', methods=['POST'])
def save_favorite():
    """Save favorite name to local storage (backend endpoint for future use)"""
    try:
        data = request.get_json()
        name = data.get('name')
        tagline = data.get('tagline')
        
        # For now, just return success (frontend handles local storage)
        return jsonify({'success': True, 'message': 'Favorite saved!'})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health')
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Business Name Generator API is running!'})

@app.route('/features')
def get_features():
    """Get available features and capabilities"""
    features = {
        'ai_generation': AI_AVAILABLE,
        'openai_available': ai_generator.openai_api_key is not None if AI_AVAILABLE else False,
        'huggingface_available': ai_generator.hf_model is not None if AI_AVAILABLE else False,
        'rule_based_generation': True,
        'nlp_processing': True,
        'category_filtering': True,
        'favorites_storage': True,
        'tagline_generation': True
    }
    
    return jsonify(features)

@app.route('/check-domain', methods=['POST'])
def check_domain_availability():
    """Placeholder for domain availability checking"""
    try:
        data = request.get_json()
        business_name = data.get('business_name', '')
        
        if not business_name:
            return jsonify({'error': 'Business name is required'}), 400
        
        # Placeholder response - in a real implementation, you'd use a domain API
        domain_suggestions = [
            f"{business_name.lower().replace(' ', '')}.com",
            f"{business_name.lower().replace(' ', '')}.net",
            f"{business_name.lower().replace(' ', '')}.org",
            f"{business_name.lower().replace(' ', '')}.io"
        ]
        
        # Simulate some domains being taken
        availability = {
            domain: random.choice([True, False]) 
            for domain in domain_suggestions
        }
        
        return jsonify({
            'business_name': business_name,
            'domain_suggestions': domain_suggestions,
            'availability': availability,
            'note': 'This is a demo. Real domain checking requires a domain API service.'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)