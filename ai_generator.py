import os
import random
import logging
from typing import List, Dict, Optional
import requests
from transformers import GPT2LMHeadModel, GPT2Tokenizer
import torch

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AINameGenerator:
    def __init__(self):
        self.openai_api_key = os.getenv('OPENAI_API_KEY')
        self.hf_model = None
        self.hf_tokenizer = None
        self.load_huggingface_model()
    
    def load_huggingface_model(self):
        """Load HuggingFace GPT-2 model for name generation"""
        try:
            model_name = "gpt2"
            self.hf_tokenizer = GPT2Tokenizer.from_pretrained(model_name)
            self.hf_model = GPT2LMHeadModel.from_pretrained(model_name)
            
            # Add padding token
            if self.hf_tokenizer.pad_token is None:
                self.hf_tokenizer.pad_token = self.hf_tokenizer.eos_token
            
            logger.info("HuggingFace GPT-2 model loaded successfully")
        except Exception as e:
            logger.warning(f"Failed to load HuggingFace model: {e}")
            self.hf_model = None
            self.hf_tokenizer = None

    def generate_openai_names(self, keywords: List[str], tone: str, count: int = 10) -> List[str]:
        """Generate business names using OpenAI API"""
        if not self.openai_api_key:
            logger.warning("OpenAI API key not found")
            return []
        
        try:
            # Create prompt based on keywords and tone
            keywords_str = ", ".join(keywords[:5])
            
            tone_descriptions = {
                'professional': 'professional, corporate, and trustworthy',
                'playful': 'fun, creative, and memorable',
                'elegant': 'sophisticated, luxurious, and premium',
                'minimal': 'simple, clean, and modern'
            }
            
            tone_desc = tone_descriptions.get(tone, 'creative and memorable')
            
            prompt = f"""Generate {count} creative business names for a company related to: {keywords_str}
            
The names should be {tone_desc}. Each name should be:
- Short and memorable (1-3 words)
- Easy to pronounce
- Professional and brandable
- Unique and creative

Business names:
1."""

            headers = {
                'Authorization': f'Bearer {self.openai_api_key}',
                'Content-Type': 'application/json',
            }
            
            data = {
                'model': 'gpt-3.5-turbo',
                'messages': [
                    {
                        'role': 'system', 
                        'content': 'You are a creative business naming expert. Generate only business names, one per line, numbered.'
                    },
                    {'role': 'user', 'content': prompt}
                ],
                'max_tokens': 300,
                'temperature': 0.8,
                'top_p': 0.9
            }
            
            response = requests.post(
                'https://api.openai.com/v1/chat/completions',
                headers=headers,
                json=data,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                content = result['choices'][0]['message']['content']
                
                # Parse the generated names
                names = []
                lines = content.strip().split('\n')
                for line in lines:
                    # Remove numbering and clean up
                    clean_line = line.strip()
                    if clean_line:
                        # Remove common numbering patterns
                        import re
                        clean_line = re.sub(r'^\d+\.?\s*', '', clean_line)
                        clean_line = re.sub(r'^[•\-\*]\s*', '', clean_line)
                        
                        if clean_line and len(clean_line.split()) <= 4:
                            names.append(clean_line.strip())
                
                logger.info(f"Generated {len(names)} names using OpenAI")
                return names[:count]
            else:
                logger.error(f"OpenAI API error: {response.status_code}")
                return []
                
        except Exception as e:
            logger.error(f"Error generating OpenAI names: {e}")
            return []

    def generate_huggingface_names(self, keywords: List[str], tone: str, count: int = 10) -> List[str]:
        """Generate business names using HuggingFace GPT-2"""
        if not self.hf_model or not self.hf_tokenizer:
            logger.warning("HuggingFace model not available")
            return []
        
        try:
            names = []
            keywords_sample = keywords[:3]  # Use top 3 keywords
            
            # Generate multiple attempts
            for _ in range(count * 2):  # Generate more to filter better ones
                # Create varied prompts
                keyword = random.choice(keywords_sample)
                
                prompts = [
                    f"Business name for {keyword} company:",
                    f"{keyword.title()} company called",
                    f"Creative name for {keyword} business:",
                    f"Brand name: {keyword.title()}"
                ]
                
                prompt = random.choice(prompts)
                
                # Tokenize and generate
                inputs = self.hf_tokenizer.encode(prompt, return_tensors='pt')
                
                with torch.no_grad():
                    outputs = self.hf_model.generate(
                        inputs,
                        max_length=inputs.shape[1] + 15,  # Short generation
                        num_return_sequences=1,
                        temperature=0.8,
                        do_sample=True,
                        pad_token_id=self.hf_tokenizer.eos_token_id,
                        no_repeat_ngram_size=2
                    )
                
                # Decode and clean
                generated_text = self.hf_tokenizer.decode(outputs[0], skip_special_tokens=True)
                
                # Extract the generated part (after the prompt)
                generated_part = generated_text[len(prompt):].strip()
                
                # Clean and validate the name
                name = self.clean_generated_name(generated_part)
                
                if name and len(name.split()) <= 3 and name not in names:
                    names.append(name)
                    
                if len(names) >= count:
                    break
            
            logger.info(f"Generated {len(names)} names using HuggingFace")
            return names[:count]
            
        except Exception as e:
            logger.error(f"Error generating HuggingFace names: {e}")
            return []

    def clean_generated_name(self, text: str) -> Optional[str]:
        """Clean and validate generated business name"""
        import re
        
        # Split into lines and take the first meaningful line
        lines = text.split('\n')
        for line in lines:
            line = line.strip()
            if line:
                # Remove common unwanted patterns
                line = re.sub(r'^["\'\-\.\,\:\;]*', '', line)
                line = re.sub(r'["\'\-\.\,\:\;]*$', '', line)
                
                # Remove sentences and keep only potential names
                sentences = re.split(r'[\.!?]', line)
                for sentence in sentences:
                    sentence = sentence.strip()
                    
                    # Basic validation
                    if (2 <= len(sentence) <= 30 and  # Reasonable length
                        not sentence.lower().startswith('the ') and  # Avoid "the company"
                        not any(word in sentence.lower() for word in ['company', 'business', 'enterprise', 'corporation', 'inc', 'llc']) and
                        sentence.replace(' ', '').replace('-', '').isalnum()):  # Only alphanumeric and spaces/hyphens
                        
                        return sentence.title()
        
        return None

    def generate_creative_names(self, keywords: List[str], tone: str, count: int = 10) -> List[str]:
        """Generate names using both OpenAI and HuggingFace, falling back to rule-based"""
        all_names = []
        
        # Try OpenAI first
        if self.openai_api_key:
            openai_names = self.generate_openai_names(keywords, tone, count // 2)
            all_names.extend(openai_names)
        
        # Try HuggingFace if we need more names
        remaining_count = count - len(all_names)
        if remaining_count > 0 and self.hf_model:
            hf_names = self.generate_huggingface_names(keywords, tone, remaining_count)
            all_names.extend(hf_names)
        
        # Remove duplicates while preserving order
        seen = set()
        unique_names = []
        for name in all_names:
            if name.lower() not in seen:
                seen.add(name.lower())
                unique_names.append(name)
        
        return unique_names[:count]

    def generate_ai_taglines(self, business_names: List[str], industry: str) -> List[str]:
        """Generate AI-powered taglines for business names"""
        if not self.openai_api_key:
            return [f"Innovation in {industry}" for _ in business_names]
        
        try:
            taglines = []
            
            for name in business_names:
                prompt = f"Create a short, catchy tagline for a {industry} business called '{name}'. The tagline should be 2-5 words, memorable, and professional."
                
                headers = {
                    'Authorization': f'Bearer {self.openai_api_key}',
                    'Content-Type': 'application/json',
                }
                
                data = {
                    'model': 'gpt-3.5-turbo',
                    'messages': [
                        {'role': 'system', 'content': 'You are a marketing expert. Create only short, catchy taglines.'},
                        {'role': 'user', 'content': prompt}
                    ],
                    'max_tokens': 50,
                    'temperature': 0.7
                }
                
                response = requests.post(
                    'https://api.openai.com/v1/chat/completions',
                    headers=headers,
                    json=data,
                    timeout=15
                )
                
                if response.status_code == 200:
                    result = response.json()
                    tagline = result['choices'][0]['message']['content'].strip()
                    # Clean up quotes
                    tagline = tagline.strip('"\'')
                    taglines.append(tagline)
                else:
                    taglines.append(f"Excellence in {industry}")
            
            return taglines
            
        except Exception as e:
            logger.error(f"Error generating AI taglines: {e}")
            return [f"Innovation in {industry}" for _ in business_names]

# Test function
if __name__ == "__main__":
    # Simple test
    generator = AINameGenerator()
    keywords = ["eco", "sustainable", "green", "clean"]
    names = generator.generate_creative_names(keywords, "professional", 5)
    print("Generated names:", names)