import axios from "axios";
import { Field, FieldArray, Form, Formik } from "formik";
import type { NextPage } from "next";
import React, { useState } from "react";

const initialValues = {
  input_text: "",
  questions: [{ question: "", correct_answer: "" }],
};

interface IQuestions {
  input_text: string;
  questions: {
    question: string;
    correct_answer: string;
  }[];
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
              style={{ width: "100%" }}
            />
          </div>

          <h1>Questions</h1>
          <FieldArray name="questions">
            {({ insert, remove, push }) => (
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
  data: any;
};

const ResultScreen: React.FC<ResultScreenProps> = ({ data }) => {
  return (
    <div className="border-2">
      Result Screen
      <div className="flex">
        <div className="flex-grow">Correct Answer</div>
        <div className="flex-grow">Extracted Answer</div>
        <div className="flex-grow">Score</div>
      </div>
      <div>
        {data.map((item: any, index: React.Key | null | undefined) => {
          return (
            <div key={index} className="flex">
              <div className="flex-grow">{item.correct_answer}</div>
              <div className="flex-grow">{item.extracted_answer}</div>
              <div className="flex-grow">{item.score}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [resultData, setResultData] = useState<any>([]);

  const handleSubmit = async (values: IQuestions) => {
    setLoading(true);
    const input_text = values.input_text;
    const filteredQuestions = values.questions.filter((question) => {
      if (question.question.length > 0 && question.correct_answer.length > 0) {
        return true;
      }
      return false;
    });

    const questions = filteredQuestions.map((question) => question.question);
    const correct_answers = filteredQuestions.map(
      (question) => question.correct_answer
    );

    const res = await axios.post("http://127.0.0.1:5000/results", {
      input_text,
      questions,
      correct_answers,
    });

    const actualOutput = correct_answers.map((answer, index) => {
      return {
        correct_answer: answer,
        extracted_answer: res.data.generated_answers[index],
        score: res.data.similarity[index],
      };
    });

    console.log("output => ", actualOutput);
    setResultData(actualOutput);
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
