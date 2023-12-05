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

# rf = Roboflow(api_key="7Hl9FLL5IgTbW6A70Nue")
# project = rf.workspace("mindcue").project("combo-dataset")
# model = project.version(3).model
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")
model =YOLO('all2/weights/best.onnx')
# results = model.predict(source='C:/Users/mega/Documents/GitHub/MindCue_train2/download.jpeg')

temp_image_paths=[]
# print(temp_image_paths)


@app.route('/')
def index():
    return render_template('index.html')  # Make sure 'index.html' exists in your templates folder

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('send_frame')
def handle_frame(data):
    print("Frame received")
    image_data = base64.b64decode(data.split(',')[1])
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpeg') as temp_file:
            temp_file.write(image_data)
            temp_file.seek(0)
            image_path = temp_file.name
            temp_image_paths.append(image_path)
            temp_file.close()
            try:
                results = model.predict(source=image_path)
                class_names = ['accident', 'gun', 'soldier','spider','cockroach','wound']
                for r in results:
                    for c in r.boxes.cls:
                        detected_class = class_names[int(c)]
                        if detected_class in class_names:
                            print(detected_class)
                            # emit('predictions',detected_class)
                            

                # p = results.json()
                # if p['predictions']:
                #     emit('predictions',p['predictions'][0])
                #     print(p['predictions'][0])
            except Exception as e:
                print(f"Error during prediction: {e}")

    finally:
        # Clean up the file immediately after processing
        try:
            os.remove(image_path)
            print(f"Deleted: {image_path}")
        except Exception as e:
            print(f"Error deleting {image_path}: {e}")

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=8080)


