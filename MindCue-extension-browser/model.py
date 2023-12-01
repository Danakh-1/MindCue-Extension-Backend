from ultralytics import YOLO
import onnxruntime as ort
model = YOLO("yolov8n.pt")
# model.export(format="onnx")
model.predict('download (2).jpeg')

