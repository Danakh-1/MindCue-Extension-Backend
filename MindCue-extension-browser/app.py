import base64
from io import BytesIO
import os
import tempfile
from PIL import Image
from flask import Flask, render_template
from flask_socketio import SocketIO, emit                
from ultralytics import YOLO
import signal
from roboflow import Roboflow

rf = Roboflow(api_key="7Hl9FLL5IgTbW6A70Nue")
project = rf.workspace("mindcue").project("combo-dataset")
model = project.version(3).model
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")
temp_image_paths=[]
print(temp_image_paths)

@socketio.on('anomaly_data')
def handle_anomaly_data(data):
    print("Anomaly data received:", data)
    # send to the client the either -1 or 1
    emit(data)

# @app.route('/')
# def index():
#     return render_template('index.html')  # Make sure 'index.html' exists in your templates folder

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('send_frame')
def handle_frame(data):
    image_data = base64.b64decode(data.split(',')[1])
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpeg') as temp_file:
            temp_file.write(image_data)
            temp_file.seek(0)
            image_path = temp_file.name
            temp_image_paths.append(image_path)
            temp_file.close()
            try:
                results = model.predict(image_path)
                p = results.json()

                if p['predictions']:
                    prediction_class = p['predictions'][0]['class']
                    print('predictions', prediction_class)
                    emit('predictions', prediction_class)
                else:
                    # If there are no predictions, emit None
                    print('none')
                    emit('predictions', "none")

            except Exception as e:
                print(f"Error during prediction: {e}")

    finally:
        # Clean up the file immediately after processing
        try:
            os.remove(image_path)
            temp_image_paths.remove(image_path)
            print(f"Deleted: {image_path}")
        except Exception as e:
            print(f"Error deleting {image_path}: {e}")


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=9000)


