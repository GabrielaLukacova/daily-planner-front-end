
export type User = {
  id: string,
  name: string,
  email: string,
  password: string,
  registerDate: string
}

export enum repeatingType {
  None = "None",
  Daily = "Daily",
  Weekly = "Weekly",
  Monthly = "Monthly",
}

export interface Activity {
  _id?: string;
  title: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  place: string;
  isRepeating: boolean;
  repeating?: repeatingType;
  _createdBy: string;
}

export interface Note {
  text: string;
  date: Date;
  _createdBy: string;
  }

  export interface Task{
    title: string;
    isCompleted: boolean;
    highPriority: boolean;
    _createdBy: User["id"];
}