# dependencies
from flask import Flask, render_template, jsonify, redirect
import pymongo
from pymongo import MongoClient


# create instance of Flask app
app = Flask(__name__)

conn = 'mongodb://localhost:27017'
client = MongoClient("mongodb://localhost:27017")
db = client.StockX_DB
bubble = db.sneaker_bubble
bar = db.Sneaker_bar



@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")

@app.route("/bubble")
def bubble_chart():
    """Go to bubble chart page"""
    return render_template("bubble.html")

@app.route("/bubbledata")
def getbubbledata():
    # sneakers = list()
    # index = 1
    # inventory = bubble.find()
    # for r in inventory:
    #     r.pop('_id')
    #     r['No.'] = str(index);
    #     index += 1
    #     sneakers.append(r)
    # return jsonify({'sneakers': sneakers})
    sneakers = bubble.find()

    sneakerList = []
    for sneaker in sneakers:
        print(sneaker)
        sneakerItem = {
            'brand':sneaker['Brand'],
            'color':sneaker['Color'],
            'retailPrice':sneaker['Retail_Price ($)'],
            'avgSalePrice':sneaker['Avg_Sale_Price ($)'],
            'noSales':sneaker['Number_of_Sales']
        }
        sneakerList.append(sneakerItem)
    return jsonify({'sneakerList': sneakerList})   



    



if __name__ == "__main__":
    app.run(debug=True)