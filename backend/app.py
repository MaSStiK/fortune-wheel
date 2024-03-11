from flask import Flask, request, abort, url_for, redirect, render_template, session
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from wheel_function import spin_wheel, update_statistics
from models import WheelSection, PeopleStatistic, db
import time

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///statistic.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'product_star'

db.init_app(app)

# Создание БД
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
            {"section_id": 8.1, "name": "«Подписка РБК Pro» на 1 месяц", "gift": "Промокод: PRODUCTCAMP-lpa", "probability": 0.1, "max_drops": 1},
            {"section_id": 8.2, "name": "«Подписка РБК Pro» на 1 месяц", "gift": "Промокод: PRODUCTCAMP-rbj", "probability": 0.1, "max_drops": 1},
            {"section_id": 8.3, "name": "«Подписка РБК Pro» на 1 месяц", "gift": "Промокод: PRODUCTCAMP-apx", "probability": 0.1, "max_drops": 1},
            {"section_id": 8.4, "name": "«Подписка РБК Pro» на 1 месяц", "gift": "Промокод: PRODUCTCAMP-yjw", "probability": 0.1, "max_drops": 1},
            {"section_id": 8.5, "name": "«Подписка РБК Pro» на 1 месяц", "gift": "Промокод: PRODUCTCAMP-liz", "probability": 0.1, "max_drops": 1},
            {"section_id": 8.6, "name": "«Подписка РБК Pro» на 1 месяц", "gift": "Промокод: PRODUCTCAMP-cxk", "probability": 0.1, "max_drops": 1},
            {"section_id": 8.7, "name": "«Подписка РБК Pro» на 1 месяц", "gift": "Промокод: PRODUCTCAMP-mfk", "probability": 0.1, "max_drops": 1},
            {"section_id": 8.8, "name": "«Подписка РБК Pro» на 1 месяц", "gift": "Промокод: PRODUCTCAMP-cbi", "probability": 0.1, "max_drops": 1},
            {"section_id": 8.9, "name": "«Подписка РБК Pro» на 1 месяц", "gift": "Промокод: PRODUCTCAMP-kvd", "probability": 0.1, "max_drops": 1},
            {"section_id": 8.10, "name": "«Подписка РБК Pro» на 1 месяц", "gift": "Промокод: PRODUCTCAMP-ihv", "probability": 0.1, "max_drops": 1}

        ]

        for section_data in sections_data:
            section = WheelSection.query.get(section_data['section_id'])
            if section is None:
                section = WheelSection(**section_data)
                db.session.add(section)

        db.session.commit()


# Роут для регистрации
@app.route('/register', methods=['GET', 'POST'])
def register():
    with app.app_context():
        if request.method == 'POST':
            user_name = request.form.get('user_name')
            user_email = request.form.get('email')
            user_phone = request.form.get('phone')

            if PeopleStatistic.query.filter_by(email=user_email).first() or PeopleStatistic.query.filter_by(phone=user_phone).first():
                abort(400, "Пользователь с таким email или phone уже существует")

            new_user = PeopleStatistic(
                user_name=user_name,
                email=user_email,
                phone=user_phone,
                section_id=None,
                spin_date=None
            )
            db.session.add(new_user)
            db.session.commit()

            session['user'] = {
                'email': user_email,
                'phone': user_phone
            }

            return redirect(url_for('spin', _external=True))

        return render_template('register.html')


# Роут для вращения колеса
@app.route('/spin', methods=['GET', 'POST'])
def spin():
    with app.app_context():
        if request.method == 'POST':
            email = session['user']['email']
            phone = session['user']['phone']
    
            print(f"User email: {email}, User phone: {phone}")

            user = PeopleStatistic.query.filter_by(email=email, phone=phone).first()

            print(f"User: {user}")
            if not user:
                abort(400, "Пользователь не зарегистрирован")
            if user.section_id is not None:
                abort(400, "Пользователь уже прокручивал колесо")

            sections = WheelSection.query.all()
            
            selected_section = spin_wheel(user, sections)
            update_statistics(selected_section, email, phone)

            time.sleep(4)

            spin_result = f"Section {selected_section.section_id}: {selected_section.name} - {selected_section.gift}"

            return render_template('spin.html', spin_result=spin_result, user=user)

        return render_template('spin.html')
    

admin = Admin(app, name='Fortune Wheel Admin', template_mode='bootstrap3')
admin.add_view(ModelView(WheelSection, db.session))


if __name__ == '__main__':
    app.run(debug=True)
