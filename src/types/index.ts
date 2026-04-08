export interface Candidate {
  id: string;
  adminId: string; // Link to the admin who created this candidate
  name: string;
  position: string;
  class: string;
  gender: string;
  hobbies: string;
  image: string;
  votes: number;
}

export interface Admin {
  id: string;
  username: string;
  password: string;
  question: string;
  answer: string;
}

export interface ElectionData {
  candidates: Candidate[];
  admins: Admin[];
}

export interface VoteSelection {
  [position: string]: string;
}

export type ToastType = "success" | "error" | "info";