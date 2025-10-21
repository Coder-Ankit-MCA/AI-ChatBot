from flask import Flask, render_template, request, jsonify
from openai import OpenAI
import os

app = Flask(__name__)

client = OpenAI(api_key="Your_API_KEY")  # <-- Replace with your actual API key

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/get", methods=["POST"])
def chatbot_response():
    user_input = request.json["message"]

    try:
        response = client.chat.completions.create(
            model="gpt-4.1-nano",
            messages=[
                {"role": "system", "content": "You are a helpful AI assistant."},
                {"role": "user", "content": user_input}
            ]
        )

        return jsonify({"reply": response.choices[0].message.content})

    except Exception as e:
        print(f"Error during OpenAI API call: {e}")
        return jsonify({"reply": "Sorry, I ran into an error communicating with the AI model."}), 500

if __name__ == "__main__":
    app.run(debug=True)
