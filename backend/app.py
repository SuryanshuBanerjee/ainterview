from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
import jwt
import hashlib
import json
import random

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SECRET_KEY'] = 'your-secret-key-here'

# Mock data storage
users = {
    "testuser": {
        "id": 1,
        "username": "testuser",
        "email": "test@example.com",
        "password": hashlib.sha256("password123".encode()).hexdigest(),
        "profile": {
            "name": "John Doe",
            "skills": ["Python", "JavaScript", "React", "Flask"],
            "experience": "3 years",
            "education": "Computer Science, MIT",
            "resume_score": 85
        }
    },
    "admin": {
        "id": 2,
        "username": "admin",
        "email": "admin@example.com",
        "password": hashlib.sha256("admin123".encode()).hexdigest(),
        "profile": {
            "name": "Admin User",
            "skills": ["Management", "Leadership"],
            "experience": "5 years",
            "education": "MBA, Harvard",
            "resume_score": 95
        }
    }
}

# Mock interview questions
interview_questions = [
    {
        "id": 1,
        "category": "Technical",
        "question": "Explain the concept of closures in JavaScript",
        "difficulty": "Medium",
        "answer": "A closure is a feature where an inner function has access to the outer function's variables."
    },
    {
        "id": 2,
        "category": "Behavioral",
        "question": "Tell me about a time you solved a difficult problem",
        "difficulty": "Easy",
        "answer": "Use the STAR method to structure your response."
    },
    {
        "id": 3,
        "category": "Technical",
        "question": "What is the difference between SQL and NoSQL databases?",
        "difficulty": "Medium",
        "answer": "SQL databases are relational with structured data, NoSQL are non-relational and more flexible."
    }
]

# Mock DSA quiz questions
dsa_questions = [
    {
        "id": 1,
        "question": "What is the time complexity of binary search?",
        "options": ["O(n)", "O(log n)", "O(n^2)", "O(1)"],
        "correct_answer": 1,
        "explanation": "Binary search eliminates half the search space in each iteration."
    },
    {
        "id": 2,
        "question": "Which data structure uses LIFO principle?",
        "options": ["Queue", "Stack", "Array", "Linked List"],
        "correct_answer": 1,
        "explanation": "Stack follows Last In First Out principle."
    },
    {
        "id": 3,
        "question": "What is the worst-case time complexity of quicksort?",
        "options": ["O(n log n)", "O(n)", "O(n^2)", "O(log n)"],
        "correct_answer": 2,
        "explanation": "Quicksort has O(n^2) worst-case when pivot is always smallest/largest."
    }
]

# Mock placement positions
placement_positions = [
    {
        "id": 1,
        "company": "Google",
        "position": "Software Engineer",
        "package": "₹45 LPA",
        "status": "Open",
        "deadline": "2024-10-15"
    },
    {
        "id": 2,
        "company": "Microsoft",
        "position": "Frontend Developer",
        "package": "₹38 LPA",
        "status": "Applied",
        "deadline": "2024-10-20"
    },
    {
        "id": 3,
        "company": "Amazon",
        "position": "Backend Developer",
        "package": "₹42 LPA",
        "status": "Open",
        "deadline": "2024-11-01"
    }
]

# Utility functions
def generate_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(hours=24)
    }
    return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')

def verify_token(token):
    try:
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

# Authentication routes
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400

    hashed_password = hashlib.sha256(password.encode()).hexdigest()
    user = users.get(username)

    if user and user['password'] == hashed_password:
        token = generate_token(user['id'])
        return jsonify({
            'token': token,
            'user': {
                'id': user['id'],
                'username': user['username'],
                'email': user['email'],
                'profile': user['profile']
            }
        })

    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({'error': 'All fields required'}), 400

    if username in users:
        return jsonify({'error': 'Username already exists'}), 400

    hashed_password = hashlib.sha256(password.encode()).hexdigest()
    user_id = len(users) + 1

    users[username] = {
        'id': user_id,
        'username': username,
        'email': email,
        'password': hashed_password,
        'profile': {
            'name': '',
            'skills': [],
            'experience': '',
            'education': '',
            'resume_score': 0
        }
    }

    token = generate_token(user_id)
    return jsonify({
        'token': token,
        'user': {
            'id': user_id,
            'username': username,
            'email': email,
            'profile': users[username]['profile']
        }
    }), 201

# Profile routes
@app.route('/api/profile', methods=['GET'])
def get_profile():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'Token required'}), 401

    token = token.replace('Bearer ', '')
    user_id = verify_token(token)

    if not user_id:
        return jsonify({'error': 'Invalid token'}), 401

    user = next((u for u in users.values() if u['id'] == user_id), None)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    return jsonify(user['profile'])

@app.route('/api/profile', methods=['PUT'])
def update_profile():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'Token required'}), 401

    token = token.replace('Bearer ', '')
    user_id = verify_token(token)

    if not user_id:
        return jsonify({'error': 'Invalid token'}), 401

    user = next((u for u in users.values() if u['id'] == user_id), None)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    data = request.get_json()
    user['profile'].update(data)

    return jsonify(user['profile'])

# Resume ATS rating
@app.route('/api/resume/analyze', methods=['POST'])
def analyze_resume():
    data = request.get_json()
    resume_text = data.get('resume_text', '')

    # Mock ATS analysis
    keywords = ['python', 'javascript', 'react', 'sql', 'git', 'agile', 'teamwork']
    found_keywords = [kw for kw in keywords if kw.lower() in resume_text.lower()]

    score = min(100, len(found_keywords) * 12 + random.randint(10, 25))

    feedback = []
    if score < 60:
        feedback.append("Add more relevant technical keywords")
        feedback.append("Include quantifiable achievements")
    elif score < 80:
        feedback.append("Good keyword usage, consider adding more specific skills")
    else:
        feedback.append("Excellent ATS compatibility!")

    return jsonify({
        'score': score,
        'found_keywords': found_keywords,
        'feedback': feedback,
        'suggestions': [
            "Use action verbs to start bullet points",
            "Quantify your achievements with numbers",
            "Tailor keywords to the job description"
        ]
    })

# Interview questions
@app.route('/api/interviews/questions', methods=['GET'])
def get_interview_questions():
    category = request.args.get('category', 'all')
    difficulty = request.args.get('difficulty', 'all')

    filtered_questions = interview_questions

    if category != 'all':
        filtered_questions = [q for q in filtered_questions if q['category'].lower() == category.lower()]

    if difficulty != 'all':
        filtered_questions = [q for q in filtered_questions if q['difficulty'].lower() == difficulty.lower()]

    return jsonify(filtered_questions)

# DSA Quiz
@app.route('/api/quiz/dsa', methods=['GET'])
def get_dsa_quiz():
    return jsonify(dsa_questions)

@app.route('/api/quiz/submit', methods=['POST'])
def submit_quiz():
    data = request.get_json()
    answers = data.get('answers', [])

    score = 0
    total = len(dsa_questions)
    results = []

    for i, answer in enumerate(answers):
        if i < len(dsa_questions):
            correct = dsa_questions[i]['correct_answer'] == answer
            if correct:
                score += 1

            results.append({
                'question_id': dsa_questions[i]['id'],
                'correct': correct,
                'user_answer': answer,
                'correct_answer': dsa_questions[i]['correct_answer'],
                'explanation': dsa_questions[i]['explanation']
            })

    percentage = (score / total) * 100 if total > 0 else 0

    return jsonify({
        'score': score,
        'total': total,
        'percentage': percentage,
        'results': results
    })

# Placement positions
@app.route('/api/placements', methods=['GET'])
def get_placements():
    return jsonify(placement_positions)

@app.route('/api/placements/<int:position_id>/apply', methods=['POST'])
def apply_position(position_id):
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'Token required'}), 401

    token = token.replace('Bearer ', '')
    user_id = verify_token(token)

    if not user_id:
        return jsonify({'error': 'Invalid token'}), 401

    position = next((p for p in placement_positions if p['id'] == position_id), None)
    if not position:
        return jsonify({'error': 'Position not found'}), 404

    # Mock application success
    return jsonify({
        'message': 'Application submitted successfully',
        'position': position,
        'application_id': random.randint(1000, 9999)
    })

# Dashboard stats
@app.route('/api/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'Token required'}), 401

    token = token.replace('Bearer ', '')
    user_id = verify_token(token)

    if not user_id:
        return jsonify({'error': 'Invalid token'}), 401

    return jsonify({
        'resume_score': random.randint(70, 95),
        'interviews_completed': random.randint(5, 20),
        'quiz_scores': {
            'average': random.randint(70, 90),
            'best': random.randint(85, 100)
        },
        'applications_sent': random.randint(3, 15),
        'recent_activity': [
            {'action': 'Completed DSA Quiz', 'score': '85%', 'date': '2024-01-15'},
            {'action': 'Updated Resume', 'score': 'ATS Score: 78', 'date': '2024-01-14'},
            {'action': 'Practice Interview', 'score': 'Technical Round', 'date': '2024-01-13'}
        ]
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)