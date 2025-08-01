from flask import Flask, render_template, jsonify, request
import json

app = Flask(__name__)

DATA_FILE = 'data.json'

def load_data():
    with open(DATA_FILE, 'r') as f:
        return json.load(f)

def save_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=4)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/data', methods=['GET'])
def get_data():
    data = load_data()
    return jsonify(data)

@app.route('/api/book', methods=['POST'])
def book_event():
    data = load_data()
    booking = request.get_json()
    user_id = booking['userId']
    event_id = booking['eventId']

    # Prevent duplicate booking
    for b in data['bookings']:
        if b['userId'] == user_id and b['eventId'] == event_id:
            return jsonify({"status": "fail", "message": "User already booked this event."})

    # Check if seats available
    for event in data['events']:
        if event['id'] == event_id:
            if event['bookedSeats'] >= event['totalSeats']:
                return jsonify({"status": "fail", "message": "Event is Sold Out."})
            event['bookedSeats'] += 1
            break

    # Add booking
    new_booking_id = max([b['id'] for b in data['bookings']]+[500]) + 1
    data['bookings'].append({
        "id": new_booking_id,
        "userId": user_id,
        "eventId": event_id
    })

    save_data(data)
    return jsonify({"status": "success", "message": "Booking Confirmed!"})

# USERS API
@app.route('/api/users', methods=['POST'])
def add_user():
    data = load_data()
    new_user = request.get_json()
    new_id = max([u['id'] for u in data['users']] + [0]) + 1
    new_user['id'] = new_id
    data['users'].append(new_user)
    save_data(data)
    return jsonify({"status": "success", "user": new_user})

@app.route('/api/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = load_data()
    updated_name = request.get_json().get('name')
    for user in data['users']:
        if user['id'] == user_id:
            user['name'] = updated_name
            break
    save_data(data)
    return jsonify({"status": "success"})

@app.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    data = load_data()
    data['users'] = [u for u in data['users'] if u['id'] != user_id]
    data['bookings'] = [b for b in data['bookings'] if b['userId'] != user_id]
    save_data(data)
    return jsonify({"status": "success"})

# EVENTS API
@app.route('/api/events', methods=['POST'])
def add_event():
    data = load_data()
    new_event = request.get_json()
    new_id = max([e['id'] for e in data['events']] + [100]) + 1
    new_event['id'] = new_id
    new_event['bookedSeats'] = 0
    data['events'].append(new_event)
    save_data(data)
    return jsonify({"status": "success", "event": new_event})

@app.route('/api/events/<int:event_id>', methods=['PUT'])
def update_event(event_id):
    data = load_data()
    updates = request.get_json()
    for event in data['events']:
        if event['id'] == event_id:
            event.update(updates)
            break
    save_data(data)
    return jsonify({"status": "success"})

@app.route('/api/events/<int:event_id>', methods=['DELETE'])
def delete_event(event_id):
    data = load_data()
    data['events'] = [e for e in data['events'] if e['id'] != event_id]
    data['bookings'] = [b for b in data['bookings'] if b['eventId'] != event_id]
    save_data(data)
    return jsonify({"status": "success"})


if __name__ == '__main__':
    app.run(debug=True)
