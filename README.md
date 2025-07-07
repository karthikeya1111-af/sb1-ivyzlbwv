# 🚀 Business Name Generator

A powerful, AI-enhanced web application for generating creative business names using Python Flask, advanced NLP techniques, and optional AI integration.

![Business Name Generator](https://img.shields.io/badge/Python-3.8%2B-blue) ![Flask](https://img.shields.io/badge/Flask-2.3.3-green) ![License](https://img.shields.io/badge/License-MIT-yellow)

## 📋 Table of Contents

- [Features](#-features)
- [Demo](#-demo)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Endpoints](#-api-endpoints)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### Core Functionality
- 🤖 **AI-Powered Generation**: Optional integration with OpenAI GPT and HuggingFace transformers
- 🧠 **NLP Processing**: Advanced keyword extraction using NLTK with synonym expansion
- 🎨 **Multiple Tones**: Professional, Playful, Elegant, and Minimal name styles
- 🏷️ **Smart Taglines**: Auto-generated taglines matching business names
- 🔍 **Industry Detection**: Automatic industry classification for better context
- 📂 **Categorization**: Names grouped by theme (Tech, Professional, Creative, Elegant)

### User Experience
- 💖 **Favorites System**: Save and manage favorite business names locally
- 🎛️ **Advanced Filtering**: Filter names by category and tone
- 📋 **One-Click Copy**: Easy clipboard copying with visual feedback
- 📱 **Responsive Design**: Beautiful UI that works on all devices
- ⚡ **Real-time Generation**: Fast name generation with loading animations

### Technical Features
- 🔗 **RESTful API**: Clean API endpoints for integration
- 🌐 **CORS Support**: Frontend/backend separation ready
- 🛡️ **Error Handling**: Robust error handling and user feedback
- 📊 **Generation Insights**: Detailed statistics about name generation
- 🔄 **Fallback Systems**: Graceful degradation when AI services are unavailable

## 🎯 Demo

Try these example inputs:
- "eco-friendly skincare products"
- "AI startup for healthcare"
- "pet grooming services"
- "organic coffee roastery"
- "tech consulting firm"

## 🛠 Tech Stack

### Backend
- **Python 3.8+**
- **Flask 2.3.3** - Web framework
- **NLTK** - Natural language processing
- **Transformers** - HuggingFace models (optional)
- **Spacy** - Advanced NLP features (optional)

### Frontend
- **HTML5/CSS3** - Modern semantic markup
- **Vanilla JavaScript** - No framework dependencies
- **Font Awesome** - Icons
- **Google Fonts** - Typography

### Optional Integrations
- **OpenAI GPT-3.5/4** - Enhanced AI name generation
- **HuggingFace GPT-2** - Local AI model fallback

## 🚀 Installation

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/business-name-generator.git
   cd business-name-generator
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Download NLTK data**
   ```bash
   python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('wordnet')"
   ```

5. **Set up environment variables**
   ```bash
   cp .env.template .env
   # Edit .env file with your API keys (optional)
   ```

6. **Run the application**
   ```bash
   python app.py
   ```

7. **Open your browser**
   ```
   http://localhost:5000
   ```

## ⚙️ Configuration

### Environment Variables

Copy `.env.template` to `.env` and configure:

```env
# Optional: OpenAI API for enhanced generation
OPENAI_API_KEY=your_openai_api_key_here

# Flask settings
FLASK_ENV=development
FLASK_DEBUG=True
```

### AI Features Setup

#### OpenAI Integration (Optional)
1. Get API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Add to `.env` file
3. Enhanced name generation will be automatically enabled

#### HuggingFace Models (Optional)
- Models download automatically on first use
- Requires ~1GB disk space for GPT-2 model
- No API key required

## 📖 Usage

### Basic Usage

1. **Enter Business Description**: Describe your business idea or type
2. **Select Tone**: Choose from Professional, Playful, Elegant, or Minimal
3. **Set Count**: Choose how many names to generate (10-30)
4. **Generate**: Click generate or press Ctrl+Enter
5. **Explore Results**: Filter by category, save favorites, copy names

### Advanced Features

#### Keyword Enhancement
The app automatically:
- Extracts key terms from your input
- Finds synonyms to expand vocabulary
- Detects industry context
- Applies tone-specific modifiers

#### AI Generation
When enabled:
- Combines rule-based and AI methods
- Uses OpenAI for creative variations
- Falls back to HuggingFace if needed
- Generates contextual taglines

#### Favorites Management
- Click ❤️ to save names
- View saved names in Favorites section
- Remove with ✕ button
- Stored locally in browser

## 🔌 API Endpoints

### Generate Names
```http
POST /generate
Content-Type: application/json

{
    "input_text": "eco-friendly skincare",
    "tone": "professional",
    "count": 15,
    "use_ai": true
}
```

### Check Features
```http
GET /features
```

### Health Check
```http
GET /health
```

### Save Favorite
```http
POST /save_favorite
Content-Type: application/json

{
    "name": "EcoGlow",
    "tagline": "Natural beauty redefined"
}
```

## 🌐 Deployment

### Render (Recommended)

1. **Create `render.yaml`**:
   ```yaml
   services:
     - type: web
       name: business-name-generator
       env: python
       buildCommand: pip install -r requirements.txt
       startCommand: gunicorn app:app
       plan: free
   ```

2. **Deploy**:
   - Connect GitHub repository
   - Add environment variables in Render dashboard
   - Deploy automatically

### Heroku

1. **Install Heroku CLI**
2. **Create Procfile**:
   ```
   web: gunicorn app:app
   ```
3. **Deploy**:
   ```bash
   heroku create your-app-name
   heroku config:set OPENAI_API_KEY=your_key_here
   git push heroku main
   ```

### Docker

1. **Create Dockerfile**:
   ```dockerfile
   FROM python:3.9-slim
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install -r requirements.txt
   COPY . .
   EXPOSE 5000
   CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
   ```

2. **Build and run**:
   ```bash
   docker build -t business-name-generator .
   docker run -p 5000:5000 business-name-generator
   ```

### Local Production

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## 🎨 Customization

### Adding New Tones

Edit `app.py` - `tone_modifiers` section:

```python
'modern': {
    'prefixes': ['Neo', 'Sync', 'Flow', 'Wave'],
    'suffixes': ['Lab', 'Hub', 'Works', 'Studio']
}
```

### Custom Industries

Add to `industry_keywords` in `app.py`:

```python
'fintech': ['finance', 'money', 'payment', 'banking', 'crypto']
```

### UI Themes

Modify CSS variables in `static/css/style.css`:

```css
:root {
    --primary-color: #your-color;
    --secondary-color: #your-secondary;
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup

```bash
# Install dev dependencies
pip install -r requirements-dev.txt

# Run tests
python -m pytest tests/

# Code formatting
black app.py
flake8 app.py
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔮 Future Enhancements

- [ ] Real domain availability checking
- [ ] Social media handle verification
- [ ] Trademark screening
- [ ] Logo generation integration
- [ ] Multi-language support
- [ ] Export to PDF/CSV
- [ ] Team collaboration features
- [ ] Advanced AI fine-tuning

## 📞 Support

- 🐛 [Report Bug](https://github.com/yourusername/business-name-generator/issues)
- 💡 [Request Feature](https://github.com/yourusername/business-name-generator/issues)
- 📧 [Contact](mailto:your-email@example.com)

## 🙏 Acknowledgments

- [NLTK](https://www.nltk.org/) for natural language processing
- [OpenAI](https://openai.com/) for GPT models
- [HuggingFace](https://huggingface.co/) for transformer models
- [Font Awesome](https://fontawesome.com/) for icons
- [Flask](https://flask.palletsprojects.com/) for the web framework

---

**Made with ❤️ for entrepreneurs and creative minds**