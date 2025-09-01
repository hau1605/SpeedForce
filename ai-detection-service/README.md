# AI Detection Service

This project is a backend service that simulates AI detection results for interview questions. It provides an endpoint to determine whether an answer is AI-generated or human, based on calls to three simulated models.

---

## Features

- **Simulated AI Models**:
  - Three models (`ModelA`, `ModelB`, `ModelC`) are used to simulate AI detection.
  - Each model has a specific delay and success rate.
  - Models return a confidence score and a result (`Human` or `AI`).

- **Endpoints**:
  - `/results`: Returns whether an answer is AI-generated or human for a list of predefined interview questions or a single question.

- **Error Handling**:
  - If all models fail for a question, the response includes an error message.

---

## How It Works

1. **Predefined Questions**:
   - The service uses a set of predefined interview questions:
     - "Tell me about yourself"
     - "Why this company?"
     - "Greatest weakness?"
     - "Describe a challenge you solved"
     - "Where do you see yourself in 5 years?"

2. **Simulated Models**:
   - Each model (`ModelA`, `ModelB`, `ModelC`) is called sequentially for each question.
   - If a model succeeds, the result is returned immediately.
   - If all models fail, an error is recorded for the question.

3. **Endpoint**:
   - `GET /results`: Returns detection results for all predefined questions.
   - `GET /results?question=<question>`: Returns detection results for a specific question.

---

## API Endpoints

### 1. **GET /results**
Returns detection results for all predefined questions.

#### Example Request:
```bash
curl http://localhost:3000/results
```

#### Example Response:
```json
{
  "Tell me about yourself": {
    "model": "ModelA",
    "confidence": 0.78,
    "result": "Human",
    "timeTaken": 1023
  },
  "Why this company?": {
    "error": "All models failed"
  }
}
```

---

### 2. **GET /results?question=<question>**
Returns detection results for a specific question.

#### Example Request:
```bash
curl "http://localhost:3000/results?question=Why%20this%20company?"
```

#### Example Response:
```json
{
  "Why this company?": {
    "model": "ModelB",
    "confidence": 0.85,
    "result": "AI",
    "timeTaken": 2045
  }
}
```

---

## Installation and Usage

### Prerequisites
- **Node.js** (v14 or higher)

### Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/hau1605/SpeedForce.git
   cd SpeedForce/ai-detection-service
   ```

2. **Run the Service**:
   ```bash
   node index.js
   ```

3. **Access the Service**:
   - Open your browser or use a tool like `curl` or Postman to access `http://localhost:3000/results`.

---

## Notes

- The service uses a flag (`isRequestActive`) to handle concurrent requests and prevent unnecessary processing after a request is completed.
- The models are simulated and do not perform real AI detection.

---

## Future Improvements

- Add real AI detection models.
- Add unit tests for better reliability.
