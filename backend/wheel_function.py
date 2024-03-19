from datetime import datetime
import random

# Функция вращения
def spin_wheel(user, sections):
    if user.section_id is not None:
        return None

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


# Функция обновления статистики
def update_statistics(selected_section, user_email, user_phone):
    from app import app
    from models import PeopleStatistic, WheelSection, db
    with app.app_context():
        
        user = PeopleStatistic.query.filter_by(email=user_email, phone=user_phone).first()
        stat_entry = WheelSection.query.filter_by(section_id=selected_section.section_id).first()

        if stat_entry:
            stat_entry.drops += 1


        if user:
            if selected_section.max_drops is not None:
                selected_section.max_drops -= 1
            user.section_id = selected_section.section_id
            user.spin_date = datetime.now()
            user.promo_code = selected_section.promo_code

            db.session.commit()
            
            send_promo_code(user_email, selected_section.promo_code)


# Функция отправки промокода на почту зарегистрированного пользователя
def send_promo_code(recipient_email, promo_code):
    from app import mail
    from flask_mail import Message
    msg = Message('Ваш промокод', recipients=[recipient_email])
    msg.body = f'Ваш промокод: {promo_code}\n\n\
    Активировать промокод можно по ссылке: https://pro.rbc.ru/activate_gift\n\
    Промокодом можно воспользоваться до 31.05'
    
    try:
        mail.send(msg)
        print('Email sent successfully!')
    except Exception as e:
        print('Failed to send email:', str(e))