export const enum SubtaskTypes {
  OneAnswerOption = 'one_answer_option',
  TextField = 'text_field',
  MultipleAnswerOptions = 'multiple_answer_options',
  AttachingFile = 'attaching_file',
  PhotoWithExample = 'photo_with_example',
  OnePhoto = 'one_photo'
}

interface Questions {
  name: string
  points: number
}

interface OneAnswerOptionTask {
  type: SubtaskTypes.OneAnswerOption
  name: string
  description: string
  questions: Questions[]
}

interface TextFieldTask {
  type: SubtaskTypes.TextField
  name: string
  description: string
  points: number
}

interface MultipleAnswerOptionsTask {
  type: SubtaskTypes.MultipleAnswerOptions
  name: string
  description: string
  questions: Questions[]
}

interface AttachingFileTask {
  type: SubtaskTypes.AttachingFile
  name: string
  description: string
  points: number
}

interface Images {
  example_image_url: string
  points: number
}

interface PhotoWithExampleTask {
  type_name: SubtaskTypes.PhotoWithExample
  images: Images[]
}

interface OnePhotoTask {
  type: SubtaskTypes.OnePhoto
  name: string
  description: string
  multiple: boolean
  points: number
}

export type Subtasks =
  | OneAnswerOptionTask
  | TextFieldTask
  | MultipleAnswerOptionsTask
  | AttachingFileTask
  | PhotoWithExampleTask
  | OnePhotoTask

export interface Tasks {
  category_name: string
  subtasks: Subtasks[]
}

export interface Template {
  check_type_id: number
  task_name: string
  tasks: Tasks[]
  instruction: string
}

export interface UpdateTemplate {
  name: string
}
