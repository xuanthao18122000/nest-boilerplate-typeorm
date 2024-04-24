export interface IQADataSurvey {
  question: string;
  answers: any[];
  images: string[];
  type: number;
  isRequired: boolean;
  updatedAt: Date;
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
