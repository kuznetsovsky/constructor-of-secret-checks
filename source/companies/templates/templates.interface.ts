export const enum SubtaskTypes {
  OneAnswerOption = 'one_answer_option',
  TextField = 'text_field',
  MultipleAnswerOptions = 'multiple_answer_options',
  AttachingFile = 'attaching_file',
  PhotoWithExample = 'photo_with_example',
  OnePhoto = 'one_photo'
}

export type Subtask =
  | OneAnswer
  | MultipleAnswer
  | TextAnswer
  | PhotoAnswer
  | PhotoAnswerWithExample
  | AttachAnswer

export interface Task {
  category_name: string
  subtasks: Subtask[]
}

export interface Template {
  check_type_id: number
  task_name: string
  tasks: Task[]
  instruction: string
}

export interface UpdateTemplate {
  name: string
}

interface Question {
  answer: string
  points: number
}

export interface OneAnswer {
  type: SubtaskTypes.OneAnswerOption
  title: string
  subtitle: string
  questions: Question[]
}

export interface MultipleAnswer {
  type: SubtaskTypes.MultipleAnswerOptions
  title: string
  subtitle: string
  questions: Question[]
}

export interface TextAnswer {
  type: SubtaskTypes.TextField
  title: string
  subtitle: string
  points: number
}

interface PhotoAnswer {
  type: SubtaskTypes.OnePhoto
  title: string
  subtitle: string
  points: number
}

interface Photo {
  subtitle: string
  name: string
  points: number
}

interface PhotoAnswerWithExample {
  type: SubtaskTypes.PhotoWithExample
  title: string
  photos: Photo[]
}

interface AttachAnswer {
  type: SubtaskTypes.AttachingFile
  title: string
  subtitle: string
  multiple: boolean
  points: number
}
