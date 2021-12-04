import * as R from "ramda";

export const initialValues = {
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

export const getGrade = (val: number) => {
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

export const isListEmpty = <T extends unknown>(list: ArrayLike<T>) =>
  R.equals(R.length(list))(0);

export const isListNotEmpty = R.compose(R.not, isListEmpty);
export const mapIndexed = R.addIndex(R.map);
