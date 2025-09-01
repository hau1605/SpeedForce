class GptZeroService {
  async analyzeSentences(transcript) {

    const sentences = transcript.text
      .split(/[.!?]/)
      .map((s) => s.trim())
      .filter(Boolean);

      const analyzed = [];
      let wordIndex = 0;
    
    for (const sentence of sentences) {
      const wordsInSentence = [];
      while (
        wordIndex < transcript.words.length &&
        wordsInSentence.map(w => w.text).join(" ").length < sentence.length
      ) {
        const w = transcript.words[wordIndex];
        wordIndex++;
        if (w.type === "word") {
          wordsInSentence.push(w);
        }
      }

      if (wordsInSentence.length === 0) continue;

      const analysis = await this.getAiProbability(sentence);

      const aiProbability = analysis.documents[0].sentences[0].generated_prob;

      analyzed.push({
        text: sentence,
        ai_probability: aiProbability,
        startTime: wordsInSentence[0].start,
        endTime: wordsInSentence[wordsInSentence.length - 1].end,
        wordTimestamps: wordsInSentence.map(w => ({
          word: w.text,
          start: w.start,
          end: w.end
        })),
      });
    }

    return analyzed;
  }

  async getAiProbability(sentence) {
    return {
      version: "1.0",
      scanId: "fake-scan-id-" + Date.now(),
      documents: [
        {
          average_generated_prob: Math.random(), // random xác suất trung bình
          class_probabilities: {
            ai: Math.random(),
            human: Math.random(),
            mixed: Math.random(),
          },
          completely_generated_prob: Math.random(),
          confidence_category: "high",
          confidence_score: Math.random(),
          confidence_scores_raw: {
            softmax: {
              ai: Math.random(),
              human: Math.random(),
              mixed: Math.random(),
            },
          },
          confidence_thresholds_raw: {
            softmax: {
              ai: { low: 0.2, medium: 0.5, reject: 0.8 },
              human: { low: 0.2, medium: 0.5, reject: 0.8 },
              mixed: { low: 0.2, medium: 0.5, reject: 0.8 },
            },
          },
          overall_burstiness: Math.random(),
          paragraphs: [
            {
              completely_generated_prob: Math.random(),
              num_sentences: 1,
              start_sentence_index: 0,
            },
          ],
          predicted_class: ["ai", "human", "mixed"][Math.floor(Math.random() * 3)],
          sentences: [
            {
              generated_prob: Math.random(),
              perplexity: Math.random() * 100,
              sentence: sentence,
              highlight_sentence_for_ai: Math.random() > 0.5,
            },
          ],
          writing_stats: {
            categorized_scores: {
              "Average Sentence Length": "medium",
              "Burstiness": "low",
              "Percent SAT": "high",
              "Perplexity": "medium",
              "Readability": "high",
              "Simplicity": "medium",
            },
            norm_scores: {
              "Average Sentence Length": Math.random(),
              "Burstiness": Math.random(),
              "Percent SAT": Math.random(),
              "Perplexity": Math.random(),
              "Readability": Math.random(),
              "Simplicity": Math.random(),
            },
            raw_scores: {
              "Average Sentence Length": Math.floor(Math.random() * 20),
              "Burstiness": Math.floor(Math.random() * 10),
              "Percent SAT": Math.floor(Math.random() * 100),
              "Perplexity": Math.floor(Math.random() * 200),
              "Readability": Math.floor(Math.random() * 100),
              "Simplicity": Math.floor(Math.random() * 100),
            },
          },
          result_message: "Fake analysis complete.",
          result_sub_message: "This is a mocked GPTZero response.",
          document_classification: "mock",
          version: "1.0",
          document_id: "fake-doc-" + Date.now(),
        },
      ],
    };
  }


  // async getAiProbability(text) {
  //   const response = await fetch("https://api.gptzero.me/v2/predict/text", {
  //     method: "POST",
  //     headers: { 
  //       "Content-Type": "application/json",
  //       "xi-api-key": process.env.GPTZERO_API_KEY
  //     },
  //     body: JSON.stringify({ text }),
  //   });

  //   const raw = await response.text();

  //   try {
  //     const data = JSON.parse(raw);
  //     return data.ai_probability ?? 0;
  //   } catch (err) {
  //     throw new Error(
  //       `Invalid JSON from GPTZero API: ${raw.substring(0, 200)}`
  //     );
  //   }
  // }
}

export default GptZeroService;
