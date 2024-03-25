from flask import Flask, request, abort, url_for, redirect, render_template, session, make_response, jsonify
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from wheel_function import spin_wheel, update_statistics, generate_confirmation_code, send_confirmation_code
from models import WheelSection, PeopleStatistic, db
import time
from flask_mail import Mail
import csv
import io
from datetime import datetime, timedelta

app = Flask(__name__)
mail = Mail(app)


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///statistic.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'product_star'
app.config['MAIL_SERVER'] = 'smtp.yandex.ru'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_USERNAME'] = 'fortuna@productstar.ru'
app.config['MAIL_PASSWORD'] = 'wsLBTJ1f'
app.config['MAIL_DEFAULT_SENDER'] = 'fortuna@productstar.ru'


mail.init_app(app)
db.init_app(app)

# Создание таблицы
with app.app_context():
    db.create_all()

    existing_entries = WheelSection.query.all()

    if not existing_entries:
        sections_data = [
            {"section_id": 1, "name": "Промокод на 1 мини-курс ProductStar на выбор", "gift": "Промокод: PCAMP1MINI", "promo_code": "PCAMP1MINI", "probability": 0.02, "max_drops": 2, "color": "#A2FF76", "image_url": "./web/assets/gifts/1.png"},
            {"section_id": 2, "name": "Скидка на покупку любого курса - 75%", "gift": "Промокод: PCAMP75", "promo_code": "PCAMP75", "probability": 0.01, "max_drops": 1, "color": "#BBFF75", "image_url": "./web/assets/gifts/2.png"},
            {"section_id": 3, "name": "Скидка на покупку любого курса - 70%", "gift": "Промокод: PCAMP70", "promo_code": "PCAMP70", "probability": 0.2, "color": "#CFFF74", "image_url": "./web/assets/gifts/3.png"},
            {"section_id": 4, "name": "Промокод на 2 мини-курса ProductStar на выбор", "gift": "Промокод: PCAMP2MINI", "promo_code": "PCAMP2MINI", "probability": 0.02, "max_drops": 2, "color": "#DDFF73", "image_url": "./web/assets/gifts/4.png"},
            {"section_id": 5.1, "name": "«Подписка РБК Pro» на 1 месяц", "gift": "Промокод: PRODUCTCAMP-lpa", "promo_code": "PRODUCTCAMP-lpa", "probability": 0.1, "max_drops": 1, "color": "#C2EEA3", "image_url": "./web/assets/gifts/5.png"},
            {"section_id": 5.2, "name": "«Подписка РБК Pro» на 1 месяц", "gift": "Промокод: PRODUCTCAMP-rbj", "promo_code": "PRODUCTCAMP-rbj", "probability": 0.1, "max_drops": 1, "color": "#C2EEA3", "image_url": "./web/assets/gifts/5.png"},
            {"section_id": 5.3, "name": "«Подписка РБК Pro» на 1 месяц", "gift": "Промокод: PRODUCTCAMP-apx", "promo_code": "PRODUCTCAMP-apx", "probability": 0.1, "max_drops": 1, "color": "#C2EEA3", "image_url": "./web/assets/gifts/5.png"},
            {"section_id": 5.4, "name": "«Подписка РБК Pro» на 1 месяц", "gift": "Промокод: PRODUCTCAMP-yjw", "promo_code": "PRODUCTCAMP-yjw", "probability": 0.1, "max_drops": 1, "color": "#C2EEA3", "image_url": "./web/assets/gifts/5.png"},
            {"section_id": 5.5, "name": "«Подписка РБК Pro» на 1 месяц", "gift": "Промокод: PRODUCTCAMP-liz", "promo_code": "PRODUCTCAMP-liz", "probability": 0.1, "max_drops": 1, "color": "#C2EEA3", "image_url": "./web/assets/gifts/5.png"},
            {"section_id": 5.6, "name": "«Подписка РБК Pro» на 1 месяц", "gift": "Промокод: PRODUCTCAMP-cxk", "promo_code": "PRODUCTCAMP-cxk", "probability": 0.1, "max_drops": 1, "color": "#C2EEA3", "image_url": "./web/assets/gifts/5.png"},
            {"section_id": 5.7, "name": "«Подписка РБК Pro» на 1 месяц", "gift": "Промокод: PRODUCTCAMP-mfk", "promo_code": "PRODUCTCAMP-mfk", "probability": 0.1, "max_drops": 1, "color": "#C2EEA3", "image_url": "./web/assets/gifts/5.png"},
            {"section_id": 5.8, "name": "«Подписка РБК Pro» на 1 месяц", "gift": "Промокод: PRODUCTCAMP-cbi", "promo_code": "PRODUCTCAMP-cbi", "probability": 0.1, "max_drops": 1, "color": "#C2EEA3", "image_url": "./web/assets/gifts/5.png"},
            {"section_id": 5.9, "name": "«Подписка РБК Pro» на 1 месяц", "gift": "Промокод: PRODUCTCAMP-kvd", "promo_code": "PRODUCTCAMP-kvd", "probability": 0.1, "max_drops": 1, "color": "#C2EEA3", "image_url": "./web/assets/gifts/5.png"},
            {"section_id": 5.10, "name": "«Подписка РБК Pro» на 1 месяц", "gift": "Промокод: PRODUCTCAMP-ihv", "promo_code": "PRODUCTCAMP-ihv", "probability": 0.1, "max_drops": 1, "color": "#C2EEA3", "image_url": "./web/assets/gifts/5.png"},
            {"section_id": 6, "name": "Скидка на покупку любого курса - 65%", "gift": "Промокод: PCAMP65", "promo_code": "PCAMP65", "probability": 0.6, "color": "#B0E9B1", "image_url": "./web/assets/gifts/6.png"}, 
            {"section_id": 7, "name": "Бесплатная карьерно-коучинговая консультация", "gift": "Промокод: Консультация", "promo_code": "Консультация", "probability": 0.01, "max_drops": 1, "color": "#8ADFD2", "image_url": "./web/assets/gifts/7.png"},
            {"section_id": 8, "name": "Гайд “Как не создать очередной бесполезный продукт” ", "gift": "https://new.productstar.ru/custdev-guide-productcamp2023", "promo_code": "https://new.productstar.ru/custdev-guide-productcamp2023", "probability": 0.05, "color": "#63D4F3", "image_url": "./web/assets/gifts/8.png"}
        ]


        for section_data in sections_data:
            section = WheelSection.query.get(section_data['section_id'])
            if section is None:
                section = WheelSection(**section_data)
                db.session.add(section)

        db.session.commit()


# Роут для главной страницы
@app.route('/')
def index():
    return render_template('fortune_wheel.html', register=True, spin=False)


# Роут для регистрации
@app.route('/register', methods=['POST'])
def register():
    user_name = request.form.get('user_name')
    user_email = request.form.get('email')
    user_phone = request.form.get('phone')

    existing_user_email = PeopleStatistic.query.filter_by(email=user_email).first()
    existing_user_phone = PeopleStatistic.query.filter_by(phone=user_phone).first()

    if existing_user_email:
        if existing_user_email.confirmed:
            return jsonify(success=False, error="Почта уже занята")
        else:
            existing_user_email.user_name = user_name
            existing_user_email.phone = user_phone
            confirmation_code = generate_confirmation_code()
            existing_user_email.confirmation_code = confirmation_code
            db.session.commit()
            session['user_email'] = user_email
            send_confirmation_code(user_email, confirmation_code)
            app.logger.info("Регистрация прошла успешно, отправлен код подтверждения на почту")
            return jsonify(success=True)
    elif existing_user_phone:
        return jsonify(success=False, error="Номер телефона уже занят")
    else:
        confirmation_code = generate_confirmation_code()
        new_user = PeopleStatistic(
            user_name=user_name,
            email=user_email,
            phone=user_phone,
            confirmation_code=confirmation_code
        )
        db.session.add(new_user)
        db.session.commit()
        session['user_email'] = user_email
        send_confirmation_code(user_email, confirmation_code)
        app.logger.info("Регистрация прошла успешно, отправлен код подтверждения на почту")
        return jsonify(success=True)


# Роут для подтверждения email
@app.route('/confirm_email', methods=['POST'])
def confirm_email():
    user_email = session.get('user_email')
    if not user_email:
        app.logger.error("Адрес электронной почты отсутствует в сессии")
        return jsonify(success=False, error="Адрес электронной почты отсутствует в сессии")

    user = PeopleStatistic.query.filter_by(email=user_email).first()
    if not user:
        app.logger.error("Пользователь с указанным адресом электронной почты не найден")
        return jsonify(success=False, error="Пользователь с указанным адресом электронной почты не найден")

    confirmation_code = request.form.get('confirmation_code')
    if confirmation_code != user.confirmation_code:
        app.logger.error("Неверный код подтверждения")
        return jsonify(success=False, error="Неверный код подтверждения")

    user.confirmed = True
    db.session.commit()

    session['user_email'] = user_email
    app.logger.info(f"Данные пользователя: {user}")

    return jsonify(success=True)


# Роут вращения колеса
@app.route('/spin', methods=['POST'])
def spin():
    user_email = session.get('user_email')
    if not user_email:
        return jsonify(success=False, error="Unauthorized access. Please register to spin the wheel.")

    user = PeopleStatistic.query.filter_by(email=user_email).first()
    if not user or not user.confirmed:
        return jsonify(success=False, error="Unauthorized access. Please register to spin the wheel.")

    email = user.email
    phone = user.phone
    print(f"User email: {email}, User phone: {phone}")

    if user.section_id is not None:
        return jsonify(success=False, error="Пользователь уже прокручивал колесо")

    sections = WheelSection.query.all()

    selected_section = spin_wheel(user, sections)
    update_statistics(selected_section, email, phone)

    time.sleep(4)

    spin_result = f"{selected_section.name}: {selected_section.gift}"

    return jsonify(success=True, spin_result=spin_result)
   

# Роут для экспорта данных пользователей и секций в формате CSV
@app.route('/export_data_csv')
def export_data_csv():
    from models import PeopleStatistic, WheelSection
    
    people = PeopleStatistic.query.all()
    sections = WheelSection.query.all()
    
    csv_data = io.StringIO()
    csv_writer = csv.writer(csv_data, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
    csv_writer.writerow(['ID', 'User Name', 'Email', 'Phone', 'Section ID', 'Spin Date'])
    for person in people:
        csv_writer.writerow([person.id, person.user_name, person.email, person.phone, person.section_id, person.spin_date])

    csv_writer.writerow([])
    csv_writer.writerow(['Section ID', 'Name', 'Gift', 'Probability', 'Max Drops', 'Drops'])
    for section in sections:
        csv_writer.writerow([section.section_id, section.name, section.gift, section.probability, section.max_drops, section.drops])
    
    csv_data.seek(0)
    
    response = make_response(csv_data.getvalue().encode('utf-8-sig'))
    response.headers['Content-Disposition'] = 'attachment; filename=data.csv'
    response.mimetype = 'text/csv'
    
    return response

# Возвращает массив с информацией о всех секций, а именно name, color и image_url
@app.route('/wheel_data')
def get_wheel_data():
    wheel_data = []
    for section_id in range(1, 9):
        section = WheelSection.query.filter_by(section_id=section_id).first()
        if section:
            section_info = {
                "name": section.name,
                "color": section.color,
                "image_url": section.image_url
            }
            wheel_data.append(section_info)
        
        elif section == None:
            section = WheelSection.query.filter(WheelSection.section_id >= section_id, WheelSection.section_id < section_id + 1).first()
            section_info = {
                "name": section.name,
                "color": section.color,
                "image_url": section.image_url
            }
            wheel_data.append(section_info)

    return jsonify(wheel_data)


last_code_sent = {}

# Роут для отправки кода 
@app.route('/send_code', methods=['POST'])
def send_code():
    email = request.form.get('email')

    if email in last_code_sent:
        time_difference = datetime.now() - last_code_sent[email]
        if time_difference < timedelta(minutes=1):
            return jsonify(success=False, error="Вы уже запросили код в течение последней минуты")

    confirmation_code = generate_confirmation_code()
    send_confirmation_code(email, confirmation_code)
    last_code_sent[email] = datetime.now()

    return jsonify(success=True, message="Новый код подтверждения отправлен на указанный адрес электронной почты")


admin = Admin(app, name='Fortune Wheel Admin', template_mode='bootstrap3')
admin.add_view(ModelView(WheelSection, db.session))


if __name__ == '__main__':
    app.run(debug=True)