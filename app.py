from flask import Flask, request, jsonify, render_template
import pandas as pd

app = Flask(__name__)

# Define base and additional prices for subscription calculations
BASE_PRICE = 10
PRICE_PER_CREDIT_LINE = 5
PRICE_PER_CREDIT_SCORE_POINT = 0.1

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return jsonify({'message': 'No file part'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400

    if file and file.filename.endswith('.csv'):
        df = pd.read_csv(file)

        # Calculate subscription price for each user
        df['SubscriptionPrice'] = BASE_PRICE + (PRICE_PER_CREDIT_LINE * df['CreditLines']) + (PRICE_PER_CREDIT_SCORE_POINT * df['CreditScore'])

        # Save the processed data to a new CSV file
        df.to_csv('processed_data.csv', index=False)

        return jsonify({'message': 'File processed successfully', 'data': df.to_dict(orient='records')}), 200

    return jsonify({'message': 'Invalid file format'}), 400

if __name__ == '__main__':
    app.run(debug=True)
