import base64
import os
import tempfile
from flask import Flask
from flask_socketio import SocketIO, emit                
from roboflow import Roboflow
from ultralytics import YOLO


model =YOLO('all2/weights/best.onnx')
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")
temp_image_paths=[]

dataSent = ''

@socketio.on('anomaly_data')
def handle_receive_anomaly(data):
    # Once processing is done, call emit_anomaly to send it to clients
    emit_anomaly(data)
    

def emit_anomaly(data):
    # This function emits the processed anomaly data to clients
    socketio.emit('anomaly', data)
    print("Anomaly data emitted:", data)


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
                        print(class_names[int(c)])
                        detected_class = class_names[int(c)]
                        if detected_class in class_names:
                            print(detected_class)
                            emit('predictions',detected_class)
    
        
                
        
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
    socketio.run(app, host='0.0.0.0', port=9000)


