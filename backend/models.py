from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class WheelSection(db.Model):
    section_id = db.Column(db.Float, primary_key=True)
    name = db.Column(db.String(255))
    gift = db.Column(db.String(255))
    promo_code = db.Column(db.String(255))
    probability = db.Column(db.Float)
    max_drops = db.Column(db.Integer, nullable=True)
    drops = db.Column(db.Integer, default=0)

    def __repr__(self):
        return f"WheelSection(section_id={self.section_id}, name={self.name}, gift={self.gift})"


class PeopleStatistic(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(255))
    email = db.Column(db.String(255), unique=True, nullable=False)
    phone = db.Column(db.Integer, unique=True, nullable=False)
    promo_code = db.Column(db.String(255), nullable=True)
    section_id = db.Column(db.Integer, db.ForeignKey('wheel_section.section_id'))
    spin_date = db.Column(db.DateTime)

    section = db.relationship('WheelSection', backref=db.backref('people_statistic', lazy=True))

    def __repr__(self):
        return f"PeopleStatistic(id={self.id}, user_name={self.user_name}, email={self.email}, phone={self.phone}, section_id={self.section_id}, spin_date={self.spin_date})"