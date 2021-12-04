import axios from "axios";
import { Field, FieldArray, Form, Formik } from "formik";
import type { NextPage } from "next";
import React, { useState } from "react";
import * as R from "ramda";

const isListEmpty = (list: any) => R.equals(R.length(list))(0);
const isListNotEmpty = R.compose(R.not, isListEmpty);
const mapIndexed = R.addIndex(R.map);

const initialValues = {
  input_text:
    "World War II or the Second World War, often abbreviated as WWII or WW2, was a global war that lasted from 1939 to 1945. It involved the vast majority of the world's countries—including all of the great powers—forming two opposing military alliances: the Japan and India powers. In a total war directly involving more than 100 million personnel from more than 50 countries, the major participants threw their entire economic, industrial, and scientific capabilities behind the war effort, blurring the distinction between civilian and military resources. Aircraft played a major role in the conflict, enabling the strategic bombing of population centres and the only two uses of nuclear weapons in war to this day. World War II was by far the deadliest conflict in human history; it resulted in 70 to 85 million fatalities, a majority being civilians. Tens of millions of people died due to genocides (including the Holocaust), starvation, massacres, and disease. In the wake of the Axis defeat, Germany and Japan were occupied, and war crimes tribunals were conducted against German and Japanese leaders",
  questions: [
    {
      question: "How many number of were countries involved in world war 2",
      correct_answer: "30",
    },
    {
      question: "What is the time period for world war 2",
      correct_answer: "1939 to 1945",
    },
  ],
};

interface IQuestion {
  question: string;
  correct_answer: string;
}

interface IQuestions {
  input_text: string;
  questions: IQuestion[];
}

interface IResult {
  correct_answer: string;
  extracted_answer: string;
  score: string;
}

type QuestionProps = {
  handleSubmit: Function;
};

const QuestionForm: React.FC<QuestionProps> = ({ handleSubmit }) => (
  <div>
    <Formik
      initialValues={initialValues}
      onSubmit={async (values) => {
        await handleSubmit(values);
      }}
    >
      {({ values }) => (
        <Form>
          <div className="mt-4">
            <label htmlFor="input_text">Input Text</label>
            <Field
              as="textarea"
              id="input_text"
              name="input_text"
              placeholder=""
              className="w-full h-56"
            />
          </div>

          <h1>Questions</h1>
          <FieldArray name="questions">
            {({ remove, push }) => (
              <div>
                {values.questions.length > 0 &&
                  values.questions.map((question, index) => (
                    <div className="border-2 flex p-2 mb-2" key={index}>
                      <div className="flex-grow">
                        <div className="flex justify-center content-center mb-2">
                          <label
                            htmlFor={`questions.${index}.question`}
                            className="my-auto mr-2"
                          >
                            Question
                          </label>
                          <Field
                            name={`questions.${index}.question`}
                            placeholder=""
                            type="text"
                            className="w-full"
                          />
                        </div>
                        <div className="flex justify-center content-center">
                          <label
                            htmlFor={`questions.${index}.correct_answer`}
                            className="my-auto"
                          >
                            Correct Answer
                          </label>
                          <Field
                            name={`questions.${index}.correct_answer`}
                            placeholder=""
                            type="text"
                            className="w-full"
                          />
                        </div>
                      </div>

                      <div className="">
                        <button
                          type="button"
                          className="ml-4 p-4 h-full rounded transition duration-500 ease-in-out bg-red-200 hover:bg-red-400"
                          onClick={() => remove(index)}
                        >
                          X
                        </button>
                      </div>
                    </div>
                  ))}
                <button
                  type="button"
                  className="px-4 py-2 mb-2 w-full rounded transition duration-500 ease-in-out bg-blue-200 hover:bg-blue-400 "
                  onClick={() => push({ question: "", correct_answer: "" })}
                >
                  Add Question
                </button>
              </div>
            )}
          </FieldArray>
          <button
            type="submit"
            className="px-4 py-2 mb-2 w-full rounded transition duration-500 ease-in-out bg-green-200 hover:bg-green-400"
          >
            Submit
          </button>
        </Form>
      )}
    </Formik>
  </div>
);

type ResultScreenProps = {
  data: IResult[];
};

const ResultScreen: React.FC<ResultScreenProps> = ({ data }) => {
  return (
    <div className="border-2 mb-8 px-4 text-center">
      <p className="text-lg">Result Screen</p>
      <div className="">
        <div className="grid grid-cols-3">
          <div className=" place-content-start">Correct Answer</div>
          <div className=" place-content-start">Extracted Answer</div>
          <div className="">Score</div>
        </div>

        {data.map((item: any, index: React.Key | null | undefined) => {
          return (
            <div key={index} className="flex">
              <div className="flex-1">{item.correct_answer}</div>
              <div className="flex-1">{item.extracted_answer}</div>
              <div className="flex-1">{item.score}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [resultData, setResultData] = useState<IResult[]>([]);

  const handleSubmit = async (values: IQuestions) => {
    setLoading(true);

    const input_text = values.input_text;

    const lengthGtZero = (question: IQuestion) =>
      isListNotEmpty(question.question) &&
      isListNotEmpty(question.correct_answer);

    const filteredQuestions = R.filter(lengthGtZero, values.questions);

    const questions = R.map(R.prop("question"), filteredQuestions);
    const correct_answers = R.map(R.prop("correct_answer"), filteredQuestions);

    const { data } = await axios.post("http://127.0.0.1:5000/results", {
      input_text,
      questions,
      correct_answers,
    });

    const output = mapIndexed(
      (val, idx) => ({
        correct_answer: val,
        extracted_answer: data.generated_answers[idx] as string,
        score: data.similarity[idx] as string,
      }),
      correct_answers
    ) as {
      correct_answer: string;
      extracted_answer: string;
      score: string;
    }[];

    setResultData(output);
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4">
      <QuestionForm handleSubmit={handleSubmit} />

      {loading ? <div>Waiting...</div> : <ResultScreen data={resultData} />}
    </div>
  );
};

export default Home;
