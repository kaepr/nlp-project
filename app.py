# Import Section
from flask import Flask, request, jsonify
from flask_cors import CORS
# from transformers import AutoTokenizer, TFAutoModelForQuestionAnswering
# import tensorflow as tf
# from sentence_transformers import SentenceTransformer
# from sklearn.metrics.pairwise import cosine_similarity

# Initializing Models
# tokenizer = AutoTokenizer.from_pretrained("bert-large-uncased-whole-word-masking-finetuned-squad")
# model = TFAutoModelForQuestionAnswering.from_pretrained("bert-large-uncased-whole-word-masking-finetuned-squad")
# model_sim = SentenceTransformer('bert-base-nli-mean-tokens')

# Sample Text
text = r"""
World War II or the Second World War, often abbreviated as WWII or WW2, starting from 1939 to 1945.It involved the vast majority of the world's countries—including all of the great powers—forming two opposing military alliances: the Allies and the Axis powers. In a total war directly involving more than 100 million personnel from more than 30 countries, the major participants threw their entire economic, industrial, and scientific capabilities behind the war effort, blurring the distinction between civilian and military resources. Aircraft played a major role in the conflict, enabling the strategic bombing of population centres and the only two uses of nuclear weapons in war to this day. World War II was by far the deadliest conflict in human history; it resulted in seventy million fatalities, a majority being civilians. Tens of millions of people died due to genocides (including the Holocaust), starvation, massacres, and disease. In the wake of the Axis defeat, Germany and Japan were occupied, and war crimes tribunals were conducted against German and Japanese leaders.
"""

questions = [
    "Time period of world war 2?",
    "Which alliances were a part of world war 2"
]

correct_answers = [
    "1939 to 1945",
    "Axis and Allies"
]

generated_answers = []

# def generate_answer(question):
#     inputs = tokenizer(question, text, add_special_tokens=True, return_tensors="tf")
#     input_ids = inputs["input_ids"].numpy()[0]
#     outputs = model(inputs)
#     answer_start_scores = outputs.start_logits
#     answer_end_scores = outputs.end_logits
#     answer_start = tf.argmax(answer_start_scores, axis=1).numpy()[0]
#     answer_end = tf.argmax(answer_end_scores, axis=1).numpy()[0] + 1
#     answer = tokenizer.convert_tokens_to_string(tokenizer.convert_ids_to_tokens(input_ids[answer_start:answer_end]))
#     return answer

# for question in questions:
#     generated_answers.append(generate_answer(question))

# def get_similarity(gen_answer, correct_answer):
#     sentences = []
#     sentences.append(correct_answer)
#     sentences.append(gen_answer)
#     sentence_embeddings = model_sim.encode(sentences)
#     arr = cosine_similarity([sentence_embeddings[0]],sentence_embeddings[1:])
#     return arr[0]


# for i in range(0,len(correct_answers)):
#     cur = get_similarity(correct_answers[i], generated_answers[i])
#     print("correct => ", correct_answers[i]," generated => ", generated_answers[i])
#     print(cur)

app = Flask(__name__)
CORS(app)


# NLP Tasks



# Flask Routes

@app.route('/')
def hello_world():
    return 'Works !'


@app.route('/results', methods=["POST"])
def get_results():
    req_body = request.get_json(force=True)
    print(req_body)
    return jsonify(req_body)
