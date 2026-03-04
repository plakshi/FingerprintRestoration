from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import numpy as np
import tensorflow as tf
from PIL import Image
import io
import base64

app = Flask(__name__)
CORS(app)

# Load model once at startup
model = tf.keras.models.load_model("generator__model.h5")

def preprocess(img: Image.Image) -> np.ndarray:
    img = img.convert("L").resize((128, 128))  # grayscale + resize to match training
    arr = np.array(img, dtype=np.float32) / 255.0
    return arr.reshape(1, 128, 128, 1)

def postprocess(arr: np.ndarray) -> Image.Image:
    out = (arr.squeeze() * 255).clip(0, 255).astype(np.uint8)
    return Image.fromarray(out, mode="L")

@app.route("/restore", methods=["POST"])
def restore():
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No file"}), 400

    img = Image.open(file.stream)
    
    # Convert original to PNG for browser display
    original_buf = io.BytesIO()
    img.convert("L").save(original_buf, format="PNG")
    original_buf.seek(0)
    original_encoded = base64.b64encode(original_buf.read()).decode()
    
    # Process and restore
    inp = preprocess(img)
    out = model.predict(inp)
    result_img = postprocess(out)

    restored_buf = io.BytesIO()
    result_img.save(restored_buf, format="PNG")
    restored_buf.seek(0)
    restored_encoded = base64.b64encode(restored_buf.read()).decode()
    
    return jsonify({
        "original": f"data:image/png;base64,{original_encoded}",
        "restored": f"data:image/png;base64,{restored_encoded}"
    })

if __name__ == "__main__":
    app.run(port=5000)