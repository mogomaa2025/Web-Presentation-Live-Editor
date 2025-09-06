import json
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Load data from JSON file
def load_data():
    with open('database.json', 'r') as f:
        return json.load(f)

# Save data to JSON file
def save_data(data):
    with open('database.json', 'w') as f:
        json.dump(data, f, indent=2)

@app.route('/')
def index():
    # We will create this file in the next step
    return render_template('index.html')

@app.route('/api/data', methods=['GET'])
def get_data():
    data = load_data()
    return jsonify(data)

@app.route('/api/data', methods=['POST'])
def update_data():
    new_data = request.get_json()
    save_data(new_data)
    return jsonify({"message": "Data updated successfully"})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)
