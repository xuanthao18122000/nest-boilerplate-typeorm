export interface IQADataSurvey {
  question: string;
  answers: (string | number)[];
  images: string[];
}

export interface IQAnswerSurvey {
  answer: string | number;
  images: string[];
}

export interface IQuestionsSurvey {
  type: number;
  question: string;
  isRequired: boolean;
  images: string[];
  answers: IQAnswerSurvey[];
}
