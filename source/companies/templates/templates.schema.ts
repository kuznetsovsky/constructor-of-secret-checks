import { type JSONSchemaType } from 'ajv'
import { type Template, SubtaskTypes, type UpdateTemplate } from './templates.interface'

export const companyTemplatesSchema: JSONSchemaType<Template> = {
  type: 'object',
  properties: {
    check_type_id: {
      type: 'number',
      minimum: 1
    },
    task_name: {
      type: 'string',
      maxLength: 64
    },
    tasks: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          category_name: {
            type: 'string',
            maxLength: 128
          },
          subtasks: {
            type: 'array',
            items: {
              anyOf: [
                {
                  type: 'object',
                  properties: {
                    type: {
                      type: 'string',
                      const: SubtaskTypes.OneAnswerOption
                    },
                    name: {
                      type: 'string'
                    },
                    description: {
                      type: 'string'
                    },
                    questions: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          name: {
                            type: 'string'
                          },
                          points: {
                            type: 'number'
                          }
                        },
                        required: [
                          'name',
                          'points'
                        ],
                        additionalProperties: false
                      }
                    }
                  },
                  required: [
                    'type',
                    'name',
                    'description',
                    'questions'
                  ],
                  additionalProperties: false
                },
                {
                  type: 'object',
                  properties: {
                    type: {
                      type: 'string',
                      const: SubtaskTypes.TextField
                    },
                    name: {
                      type: 'string'
                    },
                    description: {
                      type: 'string'
                    },
                    points: {
                      type: 'number'
                    }
                  },
                  required: [
                    'type',
                    'name',
                    'description',
                    'points'
                  ],
                  additionalProperties: false
                },
                {
                  type: 'object',
                  properties: {
                    type: {
                      type: 'string',
                      const: SubtaskTypes.MultipleAnswerOptions
                    },
                    name: {
                      type: 'string'
                    },
                    description: {
                      type: 'string'
                    },
                    questions: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          name: {
                            type: 'string'
                          },
                          points: {
                            type: 'number'
                          }
                        },
                        required: [
                          'name',
                          'points'
                        ],
                        additionalProperties: false
                      }
                    }
                  },
                  required: [
                    'type',
                    'name',
                    'description',
                    'questions'
                  ],
                  additionalProperties: false
                },
                {
                  type: 'object',
                  properties: {
                    type: {
                      type: 'string',
                      const: SubtaskTypes.AttachingFile
                    },
                    name: {
                      type: 'string'
                    },
                    description: {
                      type: 'string'
                    },
                    points: {
                      type: 'number'
                    }
                  },
                  required: [
                    'type',
                    'name',
                    'description',
                    'points'
                  ],
                  additionalProperties: false
                },
                {
                  type: 'object',
                  properties: {
                    type_name: {
                      type: 'string',
                      const: SubtaskTypes.PhotoWithExample
                    },
                    images: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          example_image_url: {
                            type: 'string'
                          },
                          points: {
                            type: 'number'
                          }
                        },
                        required: [
                          'example_image_url',
                          'points'
                        ],
                        additionalProperties: false
                      }
                    }
                  },
                  required: [
                    'type_name',
                    'images'
                  ],
                  additionalProperties: false
                },
                {
                  type: 'object',
                  properties: {
                    type: {
                      type: 'string',
                      // const: 'one_photo'
                      const: SubtaskTypes.OnePhoto
                    },
                    name: {
                      type: 'string'
                    },
                    description: {
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
                    'name',
                    'description',
                    'multiple',
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
    check_type_id: {
      type: 'number',
      minimum: 1
    },
    task_name: {
      type: 'string',
      maxLength: 64
    }
  },
  required: [
    'check_type_id',
    'task_name'
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
