export interface IQuestion {
  question: string;
  correct_answer: string;
}

export interface IQuestions {
  input_text: string;
  questions: IQuestion[];
}

export interface IResult {
  correct_answer: string;
  extracted_answer: string;
  score: string;
}

export type QuestionProps = {
  handleSubmit: Function;
};

export type ResultScreenProps = {
  data: IResult[];
};

export type RowProps = {
  val: IResult;
  idx: number;
};
