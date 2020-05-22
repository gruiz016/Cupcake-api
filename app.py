from flask import Flask, request, render_template, redirect, flash, session, jsonify
import requests
from secrets import SECRET_KEY
from models.cupcake import db, connect_db, Cupcake
import os

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'postgresql:///cupcake_db')
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')

connect_db(app)

@app.route('/')
def index():
    '''Renders index.html'''
    return render_template('index.html')

@app.route('/api/cupcakes')
def get_all_cupcakes():
    '''Gets all cupcakes in database.'''
    cupcakes = Cupcake.get_all()
    serailize = [cupcake.serailize() for cupcake in cupcakes]
    return jsonify(results=serailize)

@app.route('/api/cupcakes/<int:id>')
def get_cupcake_by_id(id):
    '''Gets cupcake by id'''
    cupcake = Cupcake.get_by_id(id)
    serailize = cupcake.serailize()
    return jsonify(results=serailize)

@app.route('/api/cupcakes', methods=['POST'])
def create_cupcake():
    '''Creates a new cupcake'''
    flavor = request.json['flavor']
    size = request.json['size']
    rating = request.json['rating']
    image = request.json.get('image')
    if image == None:
        cupcake = Cupcake(flavor=flavor, size=size, rating=rating)
    else:
        cupcake = Cupcake(flavor=flavor, size=size, rating=rating, image=image)
    db.session.add(cupcake)
    db.session.commit()
    serialize = cupcake.serailize()
    return (jsonify(result=serialize), 201)

@app.route('/api/cupcakes/<int:id>', methods=['PATCH'])
def update_cupcake(id):
    '''Edit cupcake'''
    cupcake = Cupcake.get_by_id(id)
    if cupcake == None:
        return (jsonify(message={'error': 'Id not found'}), 404)
    else:
        cupcake.flavor = request.json.get('flavor', cupcake.flavor)
        cupcake.size = request.json.get('size', cupcake.size)
        cupcake.rating = request.json.get('rating', cupcake.rating)
        cupcake.image = request.json.get('image', cupcake.image)
        serialized = cupcake.serailize()
        db.session.commit()
        return jsonify(results=serialized)

@app.route('/api/cupcakes/<int:id>', methods=['DELETE'])
def delete_cupcake(id):
    '''Delete cupcake'''
    cupcake = Cupcake.get_by_id(id)
    if cupcake == None:
        return (jsonify(message={'error': 'Id not found'}), 404)
    else:
        db.session.delete(cupcake)
        db.session.commit()
        return jsonify(message={"Success": "Item was deleted"})

