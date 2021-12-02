import axios from "axios";
import { Field, FieldArray, Form, Formik } from "formik";
import type { NextPage } from "next";
import React from "react";

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
          <h1>Input Text</h1>
          <label htmlFor="input_text">Input Text</label>
          <Field
            as="textarea"
            id="input_text"
            name="input_text"
            placeholder=""
          />

          <h1>Questions</h1>
          <FieldArray name="questions">
            {({ insert, remove, push }) => (
              <div>
                {values.questions.length > 0 &&
                  values.questions.map((question, index) => (
                    <div className="row" key={index}>
                      <div className="">
                        <label htmlFor={`questions.${index}.question`}>
                          Question
                        </label>
                        <Field
                          name={`questions.${index}.question`}
                          placeholder=""
                          type="text"
                        />
                      </div>
                      <div className="">
                        <label htmlFor={`questions.${index}.correct_answer`}>
                          Correct Answer
                        </label>
                        <Field
                          name={`questions.${index}.correct_answer`}
                          placeholder=""
                          type="text"
                        />
                      </div>
                      <div className="">
                        <button
                          type="button"
                          className=""
                          onClick={() => remove(index)}
                        >
                          X
                        </button>
                      </div>
                    </div>
                  ))}
                <button
                  type="button"
                  className="secondary"
                  onClick={() => push({ question: "", correct_answer: "" })}
                >
                  Add Question
                </button>
              </div>
            )}
          </FieldArray>
          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>
  </div>
);

const Home: NextPage = () => {
  const handleSubmit = async (values: IQuestions) => {
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
    });

    console.log(res.data);
  };

  return (
    <>
      <QuestionForm handleSubmit={handleSubmit} />
    </>
    // <div className="grid grid-cols-3 gap-4 mt-4 mx-4">
    //   <div className="bg-blue-200">asd</div>
    //   <div className="bg-blue-400">123</div>
    //   <div className="bg-blue-600">456</div>
    // </div>
  );
};

export default Home;
