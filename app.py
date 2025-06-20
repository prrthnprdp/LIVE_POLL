from flask import Flask, render_template, request, jsonify
import json
import os

app = Flask(__name__)

questions = {
    "Q1": {
        "question": "Which social media platform do you use the most?",
        "options": {"A": "Instagram", "B": "WhatsApp", "C": "Snapchat", "D": "YouTube"}
    },
    "Q2": {
        "question": "What's your hidden talent?",
        "options": {"A": "Sleeping anywhere, anytime", "B": "Laughing at own jokes", "C": "Forgetting why entered the room", "D": "Overthinking everytime"}
    },
    "Q3": {
        "question": "Which genre of movies do you enjoy the most?",
        "options": {"A": "Action", "B": "Horror", "C": "Romance", "D": "Sci-Fi"}
    },
    "Q4": {
        "question": "What's your favorite way to relax after a long day?",
        "options": {"A": "Watching movies", "B": "Reading a book", "C": "Scrolling social media", "D": "Sleeping"}
    },
    "Q5": {
        "question": "How do you prefer your coffee?",
        "options": {"A": "Hot and Strong", "B": "Cold and sweet", "C": "I don't drink coffee", "D": "I prefer tea"}
    }
}

def load_votes():
    if os.path.exists("votes.json"):
        with open("votes.json", "r") as f:
            return json.load(f)
    else:
        return {qid: {opt: 0 for opt in questions[qid]["options"]} for qid in questions}

def save_votes(votes_data):
    with open("votes.json", "w") as f:
        json.dump(votes_data, f)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/get_poll")
def get_poll():
    qid = request.args.get("qid", "Q1")
    return jsonify({"id": qid, **questions[qid]})

@app.route("/vote", methods=["POST"])
def vote():
    data = request.get_json()
    qid = data.get("id")
    option = data.get("option")
    votes = load_votes()
    if qid in votes and option in votes[qid]:
        votes[qid][option] += 1
        save_votes(votes)
    return jsonify({"votes": votes[qid]})

if __name__ == "__main__":
    app.run(debug=True)
