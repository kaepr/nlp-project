import axios from "axios";
import { Field, FieldArray, Form, Formik } from "formik";
import type { NextPage } from "next";
import React, { useState, useEffect } from "react";
import * as R from "ramda";
import Slider from "react-input-slider";

const isListEmpty = (list: any) => R.equals(R.length(list))(0);
const isListNotEmpty = R.compose(R.not, isListEmpty);
const mapIndexed = R.addIndex(R.map);

const getGrade = (val: number) => {
  if (val >= 0.9) {
    return "A+";
  } else if (val >= 0.75) {
    return "A-";
  } else if (val >= 0.6) {
    return "B";
  } else if (val >= 0.5) {
    return "C";
  } else {
    return "D";
  }
};

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
            <Field
              as="textarea"
              id="input_text"
              name="input_text"
              placeholder=""
              className="w-full h-56"
            />
          </div>

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
    <div className="border-2 mb-8 px-4 pb-4 text-center">
      <p className="text-xl m-4">Result Screen</p>

      <div className="grid grid-cols-3 p-2 text-white bg-gray-600 rounded-md">
        <div className=" place-content-start">Correct Answer</div>
        <div className=" place-content-start">Extracted Answer</div>
        <div className="">Score</div>
      </div>

      {data.map((item: IResult, index: React.Key | null | undefined) => {
        return <Row key={index} val={item} idx={index as number} />;
      })}
    </div>
  );
};

type RowProps = {
  val: IResult;
  idx: number;
};

const Row: React.FC<RowProps> = ({ val, idx }) => {
  const [num, setNum] = useState(parseFloat(val.score));
  const [grade, setGrade] = useState(getGrade(parseFloat(val.score)));

  useEffect(() => {
    setGrade(getGrade(num));
  }, [num]);

  const bgColorNumber = idx % 2 == 0 ? "100" : "200";

  return (
    <div className={`flex p-2 px-2 bg-gray-${bgColorNumber}`}>
      <div className="flex-1 ">{val.correct_answer}</div>
      <div className="flex-1">{val.extracted_answer}</div>
      <div className="flex-1 flex px-2">
        <div className="flex-1">{num.toFixed(4)}</div>
        <div className="flex-1 font-semibold text-center">{grade}</div>
        <div className="flex-1">
          <Slider
            axis="x"
            xmin={0}
            xmax={1}
            x={num}
            onChange={({ x }) => setNum((state) => x)}
            xstep={0.01}
          />
        </div>
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

    const {
      data,
    }: {
      data: {
        similarity: string[];
        generated_answers: string[];
      };
    } = await axios.post("http://127.0.0.1:5000/results", {
      input_text,
      questions,
      correct_answers,
    });

    const output = mapIndexed(
      (val, idx) => ({
        correct_answer: val,
        extracted_answer: data.generated_answers[idx],
        score: data.similarity[idx],
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

      {loading ? (
        <div className="mb-4">Waiting...</div>
      ) : (
        <ResultScreen data={resultData} />
      )}
    </div>
  );
};

export default Home;
