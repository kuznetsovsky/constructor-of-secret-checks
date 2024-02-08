import { type JSONSchemaType } from 'ajv'

import {
  SubtaskTypes,
  type Template,
  type UpdateTemplate
} from './templates.interface'

export const createCompanyTemplateSchema: JSONSchemaType<Template> = {
  type: 'object',
  properties: {
    check_type_id: {
      type: 'number'
    },
    task_name: {
      type: 'string'
    },
    tasks: {
      type: 'array',
      items: {
        // =-=-=-=-=-=-=-=-=
        // TASKS
        // =-=-=-=-=-=-=-=-=
        type: 'object',
        properties: {
          category_name: {
            type: 'string'
          },
          subtasks: {
            type: 'array',
            items: {
              // =-=-=-=-=-=-=-=-=
              // SUBTASKS
              // =-=-=-=-=-=-=-=-=
              oneOf: [
                // ===== TEXT FIELD =====
                {
                  type: 'object',
                  properties: {
                    type: {
                      type: 'string',
                      const: SubtaskTypes.TextField
                    },
                    title: {
                      type: 'string'
                    },
                    subtitle: {
                      type: 'string'
                    },
                    points: {
                      type: 'number'
                    }
                  },
                  required: [
                    'type',
                    'title',
                    'subtitle',
                    'points'
                  ],
                  additionalProperties: false
                },
                // ===== MULTIPLE ANSWER OPTIONS =====
                {
                  type: 'object',
                  properties: {
                    type: {
                      type: 'string',
                      const: SubtaskTypes.MultipleAnswerOptions
                    },
                    title: {
                      type: 'string'
                    },
                    subtitle: {
                      type: 'string'
                    },
                    questions: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          answer: {
                            type: 'string'
                          },
                          points: {
                            type: 'number'
                          }
                        },
                        required: [
                          'answer',
                          'points'
                        ],
                        additionalProperties: false
                      }
                    }
                  },
                  required: [
                    'type',
                    'title',
                    'subtitle',
                    'questions'
                  ],
                  additionalProperties: false
                },
                // ===== ONE ANSWER OPTION =====
                {
                  type: 'object',
                  properties: {
                    type: {
                      type: 'string',
                      const: SubtaskTypes.OneAnswerOption
                    },
                    title: {
                      type: 'string'
                    },
                    subtitle: {
                      type: 'string'
                    },
                    questions: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          answer: {
                            type: 'string'
                          },
                          points: {
                            type: 'number'
                          }
                        },
                        required: [
                          'answer',
                          'points'
                        ],
                        additionalProperties: false
                      }
                    }
                  },
                  required: [
                    'type',
                    'title',
                    'subtitle',
                    'questions'
                  ],
                  additionalProperties: false
                },
                // ===== ATTACHING FILE =====
                {
                  type: 'object',
                  properties: {
                    type: {
                      type: 'string',
                      const: SubtaskTypes.AttachingFile
                    },
                    title: {
                      type: 'string'
                    },
                    subtitle: {
                      type: 'string'
                    },
                    multiple: {
                      type: 'boolean'
                    },
                    points: {
                      type: 'number'
                    }
                  },
                  required: [
                    'type',
                    'title',
                    'subtitle',
                    'multiple',
                    'points'
                  ],
                  additionalProperties: false
                },
                // ===== PHOTO WITH EXAMPLE =====
                {
                  type: 'object',
                  properties: {
                    type: {
                      type: 'string',
                      const: SubtaskTypes.PhotoWithExample
                    },
                    title: {
                      type: 'string'
                    },
                    photos: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          subtitle: {
                            type: 'string'
                          },
                          name: {
                            type: 'string'
                          },
                          points: {
                            type: 'number'
                          }
                        },
                        required: [
                          'subtitle',
                          'name',
                          'points'
                        ],
                        additionalProperties: false
                      }
                    }
                  },
                  required: [
                    'type',
                    'title',
                    'photos'
                  ],
                  additionalProperties: false
                },
                // ===== ONE PHOTO =====
                {
                  type: 'object',
                  properties: {
                    type: {
                      type: 'string',
                      const: SubtaskTypes.OnePhoto
                    },
                    title: {
                      type: 'string'
                    },
                    subtitle: {
                      type: 'string'
                    },
                    points: {
                      type: 'number'
                    }
                  },
                  required: [
                    'type',
                    'title',
                    'subtitle',
                    'points'
                  ],
                  additionalProperties: false
                }
              ]
            }
          }
        },
        required: [
          'category_name',
          'subtasks'
        ],
        additionalProperties: false
      }
    },
    instruction: {
      type: 'string'
    }
  },
  required: [
    'check_type_id',
    'task_name',
    'tasks',
    'instruction'
  ],
  additionalProperties: false
}

export const companyUpdateTemplatesSchema: JSONSchemaType<UpdateTemplate> = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      maxLength: 64
    }
  },
  required: [
    'name'
  ],
  additionalProperties: false
}

export const templatesParamsSchema: JSONSchemaType<{ template_id: string }> = {
  type: 'object',
  additionalProperties: true,
  required: ['template_id'],
  properties: {
    template_id: {
      type: 'string',
      transform: ['trim'],
      pattern: '^\\d+$'
    }
  }
}
