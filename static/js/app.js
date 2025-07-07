class BusinessNameGenerator {
    constructor() {
        this.favorites = JSON.parse(localStorage.getItem('businessNameFavorites')) || [];
        this.currentNames = [];
        this.currentCategories = {};
        this.activeFilter = 'all';
        this.aiAvailable = false;
        
        this.initializeElements();
        this.bindEvents();
        this.loadFavorites();
        this.checkAIAvailability();
    }

    initializeElements() {
        // Input elements
        this.businessInput = document.getElementById('business-input');
        this.toneSelect = document.getElementById('tone-select');
        this.countSelect = document.getElementById('count-select');
        this.generateBtn = document.getElementById('generate-btn');
        this.aiToggle = document.getElementById('ai-toggle');
        this.aiStatus = document.getElementById('ai-status');

        // Display elements
        this.loading = document.getElementById('loading');
        this.errorMessage = document.getElementById('error-message');
        this.errorText = document.getElementById('error-text');
        this.resultsSection = document.getElementById('results-section');
        
        // Results elements
        this.keywordsExtracted = document.getElementById('keywords-extracted');
        this.industryDetected = document.getElementById('industry-detected');
        this.totalGenerated = document.getElementById('total-generated');
        this.generationMethod = document.getElementById('generation-method');
        this.categoryFilters = document.getElementById('category-filters');
        this.namesGrid = document.getElementById('names-grid');
        this.favoritesGrid = document.getElementById('favorites-grid');
    }

    bindEvents() {
        this.generateBtn.addEventListener('click', () => this.generateNames());
        
        // Allow Enter key to generate names
        this.businessInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.generateNames();
            }
        });

        // Auto-resize textarea
        this.businessInput.addEventListener('input', () => {
            this.businessInput.style.height = 'auto';
            this.businessInput.style.height = this.businessInput.scrollHeight + 'px';
        });
    }

    async checkAIAvailability() {
        try {
            const response = await fetch('/features');
            const features = await response.json();
            
            this.aiAvailable = features.ai_generation;
            const hasOpenAI = features.openai_available;
            const hasHuggingFace = features.huggingface_available;
            
            if (this.aiAvailable) {
                if (hasOpenAI && hasHuggingFace) {
                    this.aiStatus.textContent = '(OpenAI + HuggingFace)';
                    this.aiStatus.className = 'available';
                } else if (hasOpenAI) {
                    this.aiStatus.textContent = '(OpenAI Available)';
                    this.aiStatus.className = 'available';
                } else if (hasHuggingFace) {
                    this.aiStatus.textContent = '(HuggingFace Available)';
                    this.aiStatus.className = 'available';
                } else {
                    this.aiStatus.textContent = '(Available)';
                    this.aiStatus.className = 'available';
                }
                this.aiToggle.disabled = false;
            } else {
                this.aiStatus.textContent = '(Not Available)';
                this.aiStatus.className = 'unavailable';
                this.aiToggle.disabled = true;
                this.aiToggle.checked = false;
                document.querySelector('.ai-toggle-section').classList.add('disabled');
            }
        } catch (error) {
            console.error('Failed to check AI availability:', error);
            this.aiStatus.textContent = '(Check Failed)';
            this.aiStatus.className = 'unavailable';
            this.aiToggle.disabled = true;
        }
    }

    async generateNames() {
        const inputText = this.businessInput.value.trim();
        
        if (!inputText) {
            this.showError('Please enter a business description');
            return;
        }

        const tone = this.toneSelect.value;
        const count = parseInt(this.countSelect.value);
        const useAI = this.aiToggle.checked && this.aiAvailable;

        this.showLoading();
        this.hideError();

        try {
            const response = await fetch('/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    input_text: inputText,
                    tone: tone,
                    count: count,
                    use_ai: useAI
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate names');
            }

            this.hideLoading();
            this.displayResults(data);

        } catch (error) {
            this.hideLoading();
            this.showError(error.message || 'An error occurred while generating names');
        }
    }

    displayResults(data) {
        this.currentNames = data.names;
        this.currentCategories = data.categories || {};
        
        // Update insights
        this.keywordsExtracted.textContent = data.keywords_extracted.slice(0, 5).join(', ');
        this.industryDetected.textContent = data.industry_detected || 'General';
        this.totalGenerated.textContent = data.total_generated;
        this.generationMethod.textContent = data.generation_method || 'Rule-based';

        // Update category filters
        this.updateCategoryFilters();
        
        // Display names
        this.displayNames(this.currentNames);
        
        // Show results section with animation
        this.resultsSection.classList.remove('hidden');
        this.resultsSection.classList.add('fade-in');
        
        // Scroll to results
        this.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    updateCategoryFilters() {
        this.categoryFilters.innerHTML = '<button class="filter-btn active" data-category="all">All Names</button>';
        
        Object.keys(this.currentCategories).forEach(category => {
            const button = document.createElement('button');
            button.className = 'filter-btn';
            button.dataset.category = category;
            button.textContent = `${category} (${this.currentCategories[category].length})`;
            
            button.addEventListener('click', () => this.filterByCategory(category, button));
            this.categoryFilters.appendChild(button);
        });

        // Bind all names filter
        const allButton = this.categoryFilters.querySelector('[data-category="all"]');
        allButton.addEventListener('click', () => this.filterByCategory('all', allButton));
    }

    filterByCategory(category, buttonElement) {
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        buttonElement.classList.add('active');
        
        this.activeFilter = category;
        
        // Filter and display names
        let namesToShow = this.currentNames;
        if (category !== 'all' && this.currentCategories[category]) {
            namesToShow = this.currentNames.filter(nameData => 
                this.currentCategories[category].includes(nameData.name)
            );
        }
        
        this.displayNames(namesToShow);
    }

    displayNames(names) {
        this.namesGrid.innerHTML = '';
        
        names.forEach((nameData, index) => {
            const nameCard = this.createNameCard(nameData, index);
            this.namesGrid.appendChild(nameCard);
        });
    }

    createNameCard(nameData, index) {
        const card = document.createElement('div');
        card.className = 'name-card';
        
        const isFavorite = this.favorites.some(fav => fav.name === nameData.name);
        
        card.innerHTML = `
            <div class="name-header">
                <div class="business-name">${nameData.name}</div>
                <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-name="${nameData.name}" data-tagline="${nameData.tagline}">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
            <div class="business-tagline">${nameData.tagline}</div>
            <div class="name-actions">
                <button class="copy-btn" data-name="${nameData.name}">
                    <i class="fas fa-copy"></i>
                    Copy Name
                </button>
            </div>
        `;

        // Bind favorite button
        const favoriteBtn = card.querySelector('.favorite-btn');
        favoriteBtn.addEventListener('click', (e) => this.toggleFavorite(e, nameData));

        // Bind copy button
        const copyBtn = card.querySelector('.copy-btn');
        copyBtn.addEventListener('click', (e) => this.copyToClipboard(e, nameData.name));

        return card;
    }

    toggleFavorite(event, nameData) {
        const button = event.currentTarget;
        const isCurrentlyFavorite = button.classList.contains('active');
        
        if (isCurrentlyFavorite) {
            this.removeFavorite(nameData.name);
            button.classList.remove('active');
        } else {
            this.addFavorite(nameData);
            button.classList.add('active');
        }
    }

    addFavorite(nameData) {
        if (!this.favorites.some(fav => fav.name === nameData.name)) {
            this.favorites.push({
                name: nameData.name,
                tagline: nameData.tagline,
                timestamp: new Date().toISOString()
            });
            this.saveFavorites();
            this.loadFavorites();
        }
    }

    removeFavorite(name) {
        this.favorites = this.favorites.filter(fav => fav.name !== name);
        this.saveFavorites();
        this.loadFavorites();
    }

    saveFavorites() {
        localStorage.setItem('businessNameFavorites', JSON.stringify(this.favorites));
    }

    loadFavorites() {
        const favoritesContainer = this.favoritesGrid;
        
        if (this.favorites.length === 0) {
            favoritesContainer.innerHTML = '<p class="no-favorites">No favorites yet. Click the heart icon to save names you like!</p>';
            return;
        }

        favoritesContainer.innerHTML = '';
        
        this.favorites.reverse().forEach(favorite => {
            const favoriteItem = document.createElement('div');
            favoriteItem.className = 'favorite-item';
            
            favoriteItem.innerHTML = `
                <div class="favorite-name">${favorite.name}</div>
                <div class="favorite-tagline">${favorite.tagline}</div>
                <button class="remove-favorite" data-name="${favorite.name}">
                    <i class="fas fa-times"></i>
                </button>
            `;

            // Bind remove button
            const removeBtn = favoriteItem.querySelector('.remove-favorite');
            removeBtn.addEventListener('click', () => {
                this.removeFavorite(favorite.name);
                // Update favorite buttons in current results
                document.querySelectorAll(`.favorite-btn[data-name="${favorite.name}"]`)
                    .forEach(btn => btn.classList.remove('active'));
            });

            favoritesContainer.appendChild(favoriteItem);
        });
        
        this.favorites.reverse(); // Restore original order
    }

    async copyToClipboard(event, text) {
        const button = event.currentTarget;
        const originalText = button.innerHTML;
        
        try {
            await navigator.clipboard.writeText(text);
            
            button.innerHTML = '<i class="fas fa-check"></i> Copied!';
            button.classList.add('copied');
            
            setTimeout(() => {
                button.innerHTML = originalText;
                button.classList.remove('copied');
            }, 2000);
            
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            
            try {
                document.execCommand('copy');
                button.innerHTML = '<i class="fas fa-check"></i> Copied!';
                button.classList.add('copied');
                
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.classList.remove('copied');
                }, 2000);
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
            
            document.body.removeChild(textArea);
        }
    }

    showLoading() {
        this.loading.classList.remove('hidden');
        this.resultsSection.classList.add('hidden');
        this.generateBtn.disabled = true;
        this.generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    }

    hideLoading() {
        this.loading.classList.add('hidden');
        this.generateBtn.disabled = false;
        this.generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generate Names';
    }

    showError(message) {
        this.errorText.textContent = message;
        this.errorMessage.classList.remove('hidden');
        
        // Auto-hide error after 5 seconds
        setTimeout(() => {
            this.hideError();
        }, 5000);
    }

    hideError() {
        this.errorMessage.classList.add('hidden');
    }
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add some sample prompts for better UX
function addSamplePrompts() {
    const samples = [
        "eco-friendly skincare products",
        "AI startup for healthcare",
        "pet grooming services",
        "organic coffee roastery",
        "tech consulting firm",
        "yoga and wellness studio",
        "artisan jewelry maker",
        "mobile app development",
        "sustainable fashion brand",
        "virtual reality gaming"
    ];
    
    const businessInput = document.getElementById('business-input');
    let sampleIndex = 0;
    
    function cycleSample() {
        if (businessInput.value === '' && document.activeElement !== businessInput) {
            businessInput.placeholder = `e.g., ${samples[sampleIndex]}...`;
            sampleIndex = (sampleIndex + 1) % samples.length;
        }
    }
    
    // Cycle through samples every 3 seconds
    setInterval(cycleSample, 3000);
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BusinessNameGenerator();
    addSamplePrompts();
    
    // Add smooth scrolling for the entire page
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add a subtle parallax effect to the header
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', debounce(() => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            header.style.transform = `translateY(${rate}px)`;
        }, 10));
    }
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Enter to generate
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('generate-btn').click();
        }
        
        // Escape to clear input
        if (e.key === 'Escape') {
            const input = document.getElementById('business-input');
            if (document.activeElement === input) {
                input.blur();
            }
        }
    });
    
    console.log('🚀 Business Name Generator initialized successfully!');
});