#!/usr/bin/env python3
"""
Simple test script for Business Name Generator API
"""

import requests
import json
import time

BASE_URL = "http://localhost:5000"

def test_health_check():
    """Test health check endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            print("✅ Health check: PASSED")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ Health check: FAILED (Status: {response.status_code})")
    except Exception as e:
        print(f"❌ Health check: ERROR - {e}")

def test_features():
    """Test features endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/features")
        if response.status_code == 200:
            features = response.json()
            print("✅ Features check: PASSED")
            print(f"   AI Available: {features.get('ai_generation', False)}")
            print(f"   OpenAI: {features.get('openai_available', False)}")
            print(f"   HuggingFace: {features.get('huggingface_available', False)}")
            return features
        else:
            print(f"❌ Features check: FAILED (Status: {response.status_code})")
    except Exception as e:
        print(f"❌ Features check: ERROR - {e}")
    return {}

def test_name_generation():
    """Test name generation endpoint"""
    test_cases = [
        {
            "input_text": "eco-friendly skincare products",
            "tone": "professional",
            "count": 10,
            "use_ai": False
        },
        {
            "input_text": "AI startup for healthcare",
            "tone": "playful",
            "count": 5,
            "use_ai": False
        },
        {
            "input_text": "pet grooming services",
            "tone": "elegant",
            "count": 8,
            "use_ai": False
        }
    ]
    
    for i, test_case in enumerate(test_cases, 1):
        try:
            print(f"\n🧪 Test Case {i}: {test_case['input_text']}")
            response = requests.post(
                f"{BASE_URL}/generate",
                headers={"Content-Type": "application/json"},
                json=test_case
            )
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Generation test {i}: PASSED")
                print(f"   Names generated: {data.get('total_generated', 0)}")
                print(f"   Industry detected: {data.get('industry_detected', 'Unknown')}")
                print(f"   Generation method: {data.get('generation_method', 'Unknown')}")
                print(f"   Sample names: {[name['name'] for name in data.get('names', [])[:3]]}")
            else:
                print(f"❌ Generation test {i}: FAILED (Status: {response.status_code})")
                print(f"   Error: {response.text}")
                
        except Exception as e:
            print(f"❌ Generation test {i}: ERROR - {e}")

def test_ai_generation(features):
    """Test AI generation if available"""
    if not features.get('ai_generation', False):
        print("\n🤖 AI generation not available - skipping AI tests")
        return
    
    print("\n🤖 Testing AI Generation...")
    test_case = {
        "input_text": "sustainable tech startup",
        "tone": "minimal",
        "count": 5,
        "use_ai": True
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/generate",
            headers={"Content-Type": "application/json"},
            json=test_case
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ AI generation test: PASSED")
            print(f"   Generation method: {data.get('generation_method', 'Unknown')}")
            print(f"   Sample AI names: {[name['name'] for name in data.get('names', [])[:3]]}")
        else:
            print(f"❌ AI generation test: FAILED (Status: {response.status_code})")
            
    except Exception as e:
        print(f"❌ AI generation test: ERROR - {e}")

def main():
    print("🚀 Business Name Generator API Tests")
    print("=" * 50)
    
    # Wait a moment for server to start
    print("⏳ Waiting for server to start...")
    time.sleep(2)
    
    # Run tests
    test_health_check()
    features = test_features()
    test_name_generation()
    test_ai_generation(features)
    
    print("\n" + "=" * 50)
    print("🎉 Tests completed!")

if __name__ == "__main__":
    main()