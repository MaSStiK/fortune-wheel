from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
import random
import time


app = Flask(__name__)


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///statistic.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'product_star'


db = SQLAlchemy(app)


### База данных - таблица ###
class WheelSection(db.Model):
    section_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    gift = db.Column(db.String(255))
    probability = db.Column(db.Float)
    max_drops = db.Column(db.Integer, nullable=True)
    drops = db.Column(db.Integer, default=0)

    def __repr__(self):
        return f"WheelSection(section_id={self.section_id}, name={self.name}, gift={self.gift})"


### Создание таблицы ###
with app.app_context():
    db.create_all()

    existing_entries = WheelSection.query.all()

    if not existing_entries:
        sections_data = [
            {"section_id": 1, "name": "Промокод на 1 мини-курс ProductStar на выбор", "gift": "Промокод: PCAMP1MINI", "probability": 0.02, "max_drops": 2},
            {"section_id": 2, "name": "Промокод на 2 мини-курса ProductStar на выбор", "gift": "Промокод: PCAMP2MINI", "probability": 0.02, "max_drops": 2},
            {"section_id": 3, "name": "Гайд “Как не создать очередной бесполезный продукт” ", "gift": "https://new.productstar.ru/custdev-guide-productcamp2023", "probability": 0.05},
            {"section_id": 4, "name": "Скидка на покупку любого курса - 65%", "gift": "Промокод: PCAMP65", "probability": 0.6},
            {"section_id": 5, "name": "Скидка на покупку любого курса - 70%", "gift": "Промокод: PCAMP70", "probability": 0.2},
            {"section_id": 6, "name": "Скидка на покупку любого курса - 75%", "gift": "Промокод: PCAMP75", "probability": 0.01, "max_drops": 1},
            {"section_id": 7, "name": "Бесплатная карьерно-коучинговая консультация от Карьерного Центра ProductStar", "gift": "Консультация", "probability": 0.01, "max_drops": 1},
            {"section_id": 8, "name": "«Подписка РБК Pro» на 1 месяц", "gift": "Промокод: ...", "probability": 0.1, "max_drops": 10}
        ]

        sections = [
            WheelSection(
                section_id=section["section_id"],
                name=section["name"],
                gift=section["gift"],
                probability=section["probability"],
                max_drops=section.get("max_drops"),
                drops=0
            )
            for section in sections_data
        ]

        for section_data in sections_data:
            section = WheelSection.query.get(section_data['section_id'])
            if section is None:
                section = WheelSection(**section_data)
                db.session.add(section)

        db.session.commit()


#### Функция вращения ####
def spin_wheel(sections):
    available_sections = [section for section in sections if section.max_drops is None or (section.max_drops > 0)]

    if not available_sections:
        available_sections = [section for section in sections if section.section_id in [3, 4, 5]]

    total_probability = sum(section.probability for section in available_sections)
    random_number = random.uniform(0, total_probability)

    cumulative_probability = 0
    selected_section = None

    for section in available_sections:
        cumulative_probability += section.probability
        if random_number <= cumulative_probability:
            selected_section = section
            break

    if selected_section.max_drops is not None:
        selected_section.max_drops -= 1

    return selected_section


### Роут для вращения колеса ###
@app.route('/spin', methods=['POST'])
def spin():
    with app.app_context():
        sections = WheelSection.query.all()
        selected_section = spin_wheel(sections)
        update_statistics(selected_section)

        time.sleep(4)

    return jsonify({"result": f"Секция {selected_section.section_id}:{selected_section.name} - {selected_section.gift}"})


### Роут для получения статистики ###
@app.route('/statistics', methods=['GET'])
def get_statistics():
    with app.app_context():
        stats = WheelSection.query.all()
        statistics = {f"Секция {stat.section_id}": stat.drops for stat in stats}

    return jsonify(statistics)


### Функция обновления статистики ###
def update_statistics(selected_section):
    with app.app_context():
        stat_entry = WheelSection.query.filter_by(section_id=selected_section.section_id).first()

        if stat_entry:
            stat_entry.drops += 1

        db.session.commit()


admin = Admin(app, name='Fortune Wheel Admin', template_mode='bootstrap3')
admin.add_view(ModelView(WheelSection, db.session))


if __name__ == '__main__':
    app.run(debug=True)