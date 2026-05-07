export type PracticeQuestion = {
  id: string;
  text: string;
  imageUrl: string | null;
  options: string[];
  correctOption: number;
  correctWritten: string;
  isStarred?: boolean;
};

