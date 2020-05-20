from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()

def connect_db(app):
    db.app = app
    db.init_app(app)
    
class Cupcake(db.Model):
    '''Cupcake Model made with SQLAlchemy'''
    
    __tablename__ = 'cupcakes'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    flavor = db.Column(db.String(), nullable=False)
    size = db.Column(db.String(), nullable=False)
    rating = db.Column(db.Float, nullable=False)
    image = db.Column(db.String(), nullable=False, default='https://tinyurl.com/demo-cupcake')
    
    def serailize(self):
        '''Returns a JSON object'''
        return {
            'id': self.id,
            'flavor': self.flavor,
            'size': self.size,
            'rating': self.rating,
            'image': self.image
        }
        
    def __repr__(self):
        return f'<Cupcake id:{self.id}, flavor:{self.flavor}, size: {self.size}, rating:{self.rating}>'
    
    @classmethod
    def get_all(cls):
        '''Gets all cupcakes in database.'''
        return cls.query.all()
    
    @classmethod
    def get_by_id(cls, id):
        '''Gets a cupcake by its ID.'''
        return cls.query.get(id)
        