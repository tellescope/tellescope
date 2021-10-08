import {
  booleanValidator,
  dateValidator,
  emailValidator,
  fieldsValidator,
  journeysValidator,
  journeyStateValidator,
  journeyStatesValidator,
  phoneValidator,
  nameValidator,
  nonNegNumberValidator,
  mongoIdValidator,
  mongoIdStringValidator,
  listOfMongoIdStringValidator,
  preferenceValidator,
  objectAnyFieldsValidator,
  stringValidator,
  stringValidator100,
  listOfStringsValidator,
  listOfMongoIdValidator,
  emailEncodingValidator,
  numberToDateValidator,
  SMSMessageValidator,
  chatRoomTopicValidator,
  chatRoomTypeValidator,
  idStringToDateValidator,
  subdomainValidator,
  accountTypeValidator,
  messageTemplateTypeValidator,
  stringValidator250,
  stringValidator5000,
} from "@tellescope/validation"

import {
  CREATOR_ONLY_ACCESS,
  DEFAULT_OPERATIONS,
  PLACEHOLDER_ID,
} from "@tellescope/constants"

const sideEffects = {
  trackJourneyEngagement: {
    name: "trackJourneyEngagement",
    description: "Stores engagement events associated with a change in a user's journey"
  },
  sendEmails: {
    name: "sendEmails",
    description: "Sends emails if logOnly is not true"
  },
  sendSMSMessages: {
    name: "sendSMSMessages",
    description: "Sends emails if logOnly is not true"
  }
}
export type SideEffectNames = keyof typeof sideEffects

const BOOLEAN_EXAMPLES = [true, false]

const BuiltInFields = { 
  _id: {
    validator: mongoIdValidator, 
    readonly: true,
  },
  businessId: {
    validator: mongoIdStringValidator, 
    readonly: true,
  },
  creator: {
    validator: mongoIdStringValidator,
    readonly: true,
  },
  updatedAt: { 
    validator: dateValidator,
    readonly: true,
  },
}
export type BuiltInFields_T = typeof BuiltInFields 

export type CustomActions = {
  api_keys: {
    create: CustomAction<{}, { id: string, key: string}>,
  }
  journeys: {
    update_state: CustomAction<{ updates: JourneyState, id: string, name: string }, {}>,
  },
  endusers: {
    set_password: CustomAction<{ id: string, password: string }, { }>,
    login: CustomAction<{ id?: string, email?: string, phone?: string, password: string }, { authToken: string }>,
  }
}

export type SchemaV1 = Schema & { [K in keyof CustomActions]: { customActions: CustomActions[K] } }

export const schema: SchemaV1 = {
  endusers: {
    info: {
      sideEffects: {
        create: [sideEffects.trackJourneyEngagement],
        update: [sideEffects.trackJourneyEngagement],
      }
    },
    customActions: {
      set_password: {
        op: "custom", access: 'update', method: "post",
        name: 'Set enduser password',
        path: '/set-enduser-password',
        description: "Sets (or resets) an enduser's password. Minimum length 8 characters.",
        parameters: { 
          id: { validator: mongoIdStringValidator, required: true },
          password: { validator: stringValidator100, required: true },
        },
        returns: { } //authToken: { validator: stringValidator5000 } },
      },
      login: {
        op: "custom", access: 'read', method: "post",
        name: 'Login enduser',
        path: '/set-enduser-password',
        description: "Generates an authentication token for access to enduser-facing endpoints",
        parameters: { 
          id: { validator: mongoIdStringValidator },
          password: { validator: stringValidator100, required: true }, // required until optional challenge token available
          phone: { validator: phoneValidator },
          email: { validator: emailValidator },
        },
        returns: { authToken: { validator: stringValidator5000 } },
      },
    },
    fields: {
      ...BuiltInFields,   
      email: { 
        validator: emailValidator,
        examples: ['test@tellescope.com'],
      },
      emailConsent: { 
        validator: booleanValidator,
        examples: BOOLEAN_EXAMPLES,
        initializer: e => !!e.email // set by default on create when provided
      },
      phone: { 
        validator: phoneValidator,
        examples: ['+14155555555'],
      },
      phoneConsent: { 
        validator: booleanValidator,
        examples: BOOLEAN_EXAMPLES,
        initializer: e => !!e.phone // set by default on create when provided
      },
      hashedPassword: {
        validator: stringValidator100,
        readonly: true,
      },
      fname: { 
        validator: nameValidator,
      },
      lname: { 
        validator: nameValidator,
      },
      journeys: { 
        validator: journeysValidator,
        dependencies: [
          {
            dependsOn: ['journeys'],
            dependencyField: '_id',
            relationship: 'foreignKey',
            onDependencyDelete: 'unset',
            getDependentValues: t => Object.keys(t.journeys ?? {}),
            filterByDependency: journeyId => ({
              field: `journeys.${journeyId}`,
              value: 'any',
            }),
          },
        ]
      },
      tags: { 
        validator: listOfStringsValidator,
      },
      fields: {
        validator: fieldsValidator,
      },
      preference: { 
        validator: preferenceValidator,
      },
      assignedTo: { 
        validator: mongoIdStringValidator,
      },
      unread: { 
        validator: booleanValidator,
      },
      lastCommunication: { 
        validator: dateValidator,
      },
      // recentMessagePreview: { 
      //   validator: stringValidator,
      // },
    }, 
    constraints: {
      unique: ['email', 'phone'],
      relationship: [
        {
          explanation: 'One of email or phone is required',
          evaluate: ({ email, phone }) => {
          if (!(email || phone))
            return 'One of email or phone is required'
          } 
        }
      ],
    },
    defaultActions: DEFAULT_OPERATIONS,
  },
  api_keys: {
    info: {},
    fields: {
      ...BuiltInFields,
      hashedKey: {
        validator: stringValidator,
        readonly: true,
      },
    },
    constraints: { unique: [], relationship: [], access: [{ type: CREATOR_ONLY_ACCESS }] },
    defaultActions: { read: {}, readMany: {}, delete: {} },
    customActions: {
      create: {
        op: 'create', access: 'create',
        name: 'Generate ApiKey',
        description: "Generates and returns a new ApiKey. The returned key is not stored in Tellescope and cannot be retrieved later.",
        parameters: {},
        returns: { 
          id: {
            validator: mongoIdStringValidator,
          },
          key: {
            validator: stringValidator, // validate urlsafebase64 instead
          }
        }
      }
    }
  },
  engagement_events: {
    info: {},
    fields: {
      ...BuiltInFields,
      enduserId: {
        validator: mongoIdStringValidator,
        required: true,
        updatesDisabled: true,
        examples: [PLACEHOLDER_ID],
        dependencies: [{
          dependsOn: ['endusers'],
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'nop',
        }]
      },
      type: {
        validator: stringValidator100,
        required: true,
        examples: ['Test']
      },
      significance: {
        validator: nonNegNumberValidator,
        required: true,
        examples: [1]
      },
      timestamp: {
        validator: dateValidator,
        initializer: () => new Date(),
      },
      fields: {
        validator: objectAnyFieldsValidator,
      }
    },
    constraints: { unique: [], relationship: [] },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: {},
  },
  journeys: {
    info: {},
    fields: {
      ...BuiltInFields,
      title: {
        validator: stringValidator100,
        required: true,
        examples: ['Test']
      },
      defaultState: {
        validator: stringValidator100,
        initializer: j => (j.defaultState || j.states?.[0]?.name || 'New'),
      },
      description: {
        validator: stringValidator100,
      },
      states: {
        validator: journeyStatesValidator,
        initializer: j => j.defaultState 
                        ? [{ name: j.defaultState, priority: "N/A" }]
                        : [{ name: 'New', priority: "N/A" }]
      },
    },
    constraints: { 
      unique: ['title', { array: 'states', itemKey: 'name' }], 
      relationship: [{
        explanation: 'states must include defaultState',
        evaluate: ({ defaultState, states }) => {
          if (!(defaultState && states)) return

          if (states.find(s => s.name === defaultState) === undefined) {
            return "defaultState does not exist in states"
          }
        }
      }] 
    },
    defaultActions: {
      ...DEFAULT_OPERATIONS,
      create: {
        warnings: [
          "To update state names, use Update State to ensure that updates propagate to endusers",
        ],
      },
    },
    customActions: {
      update_state: {
        op: 'custom', access: 'update', method: "patch",
        name: 'Update State',
        path: '/journey/:id/state/:name',
        description: "Updates a state in a journey. Changes to state.name update endusers.journeys automatically.",
        parameters: { 
          id: { validator: mongoIdStringValidator },
          name: { validator: stringValidator100 },
          updates: { validator: journeyStateValidator },
        },
        returns: {},
      }
    },
  },
  tasks: {
    info: {},
    fields: {
      ...BuiltInFields,   
        text: {
          validator: stringValidator,
          required: true,
          examples: ["Task1", "Task2"]
        },
        completed: {
          validator: booleanValidator,
          examples: BOOLEAN_EXAMPLES,
        },
        description: {
          validator: stringValidator,
        },
        dueDate: {
          validator: dateValidator,
        },
        assignedTo: {
         validator: mongoIdStringValidator,
          dependencies: [{
            dependsOn: ['users'],
            dependencyField: '_id',
            relationship: 'foreignKey',
            onDependencyDelete: 'unset',
          }]
        },
        enduserId: {
          validator: mongoIdStringValidator,
          dependencies: [{
            dependsOn: ['endusers'],
            dependencyField: '_id',
            relationship: 'foreignKey',
            onDependencyDelete: 'unset',
          }]
        },
        subscribers: {
          validator: listOfMongoIdStringValidator,
        },
        subscriberRoles: {
          validator: listOfStringsValidator,
        },
    }, 
    constraints: {
      unique: [], relationship: [],
    },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: {},
  },
  emails: {
    info: {
      sideEffects: { create: [sideEffects.sendEmails] },
    },
    constraints: {
      unique: [], 
      relationship: [
        {
          explanation: "Email and email consent must be set for enduser",
          evaluate: ({ enduserId, logOnly }, deps) => {
            if (logOnly === true) return

            const e = deps[enduserId ?? ''] as Enduser
            if (!e?.email) return "Missing email"
            if (!e?.emailConsent) return "Missing email consent"
          }
        }
      ],
    },
    fields: {
      ...BuiltInFields,   
      logOnly: {
        validator: booleanValidator,
        examples: [true],
        initializer: () => false,
      },
      enduserId: {
        validator: mongoIdStringValidator,
        required: true,
        examples: [PLACEHOLDER_ID],
        dependencies: [{
          dependsOn: ['endusers'],
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'setNull',
        }]
      },
      businessUserId: {
        validator: mongoIdStringValidator,
        examples: [PLACEHOLDER_ID],
        readonly: true, 
        initializer: (a, s) => s.userId,
      },
      subject: {
        validator: stringValidator,
        required: true,
        examples: ["Email Subject"],
      },
      textContent: {
        validator: stringValidator,
        required: true,
        examples: ["Hi there, this is Sebastian"],
      },
      HTMLContent: {
        validator: stringValidator,
      },
      timestamp: {
        validator: dateValidator,
        initializer: () => new Date(),
      },
      delivered: {
        validator: booleanValidator,
        readonly: true,
        initializer: s => !!s.logOnly
      },
      replyTo: {
        validator: stringValidator,
        initializer: () => null,
      },
      threadId: {
        validator: stringValidator,
        readonly: true,
      },
      source: {
        validator: emailValidator,
        readonly: true,
      },
      openedAt: {
        validator: dateValidator,
        readonly: true,
      },
      linkOpens: {
        validator: numberToDateValidator,
        readonly: true,
        examples: [{ 0: new Date() }]
      },
      messageId: {
        validator: stringValidator,
        readonly: true,
      },
      inbound: {
        validator: booleanValidator,
        initializer: () => false,
      },
      textEncoding: {
        validator: emailEncodingValidator,
        readonly: true,
      },
      htmlEncoding: {
        validator: emailEncodingValidator,
        readonly: true
      },
    }, 
    defaultActions: { 
      create: {
        description: "Sends or logs an email"
      }, createMany: {
        description: "Sends or logs multiple emails"
      }, read: {}, readMany: {}, delete: {} 
    },
    customActions: {},
  },
  sms_messages: {
    info: {
      sideEffects: { create: [sideEffects.sendSMSMessages] },
    },
    constraints: {
      unique: [],
      relationship: [
        {
          explanation: "Phone number and phone consent must be set for enduser",
          evaluate: ({ enduserId, logOnly }, deps) => {
            if (logOnly === true) return

            const e = deps[enduserId ?? ''] as Enduser
            if (!e?.phone) return "Missing phone"
            if (!e?.phoneConsent) return "Missing phone consent"
          }
        }
      ]
    },
    fields: {
      ...BuiltInFields,   
      logOnly: {
        validator: booleanValidator,
        examples: [true],
        initializer: () => false,
      },
      message: {
        validator: SMSMessageValidator,
        required: true,
        examples: ["Test message"],
      },
      timestamp: {
        validator: dateValidator,
        initializer: () => new Date(),
      },
      enduserId: {
        validator: mongoIdStringValidator,
        required: true,
        examples: [PLACEHOLDER_ID],
        dependencies: [{
          dependsOn: ['endusers'],
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'setNull',
        }]
      },
      businessUserId: {
        validator: mongoIdStringValidator,
        readonly: true, // default to only self-sending, for now
        initializer: (_, s) => s.userId,
        dependencies: [{
          dependsOn: ['users'],
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'setNull',
        }]
      },
      inbound: {
        validator: booleanValidator,
        initializer: () => false,
      },
      newThread: {
        validator: booleanValidator,
      },
      delivered: {
        validator: booleanValidator,
        readonly:  true,
        initializer: s => !!s.logOnly
      },
      usingPublicNumber: {
        validator: booleanValidator,
      },
    }, 
    defaultActions: { 
      create: {
        description: "Sends or logs an SMS message"
      }, createMany: {
        description: "Sends or logs multiple SMS message"
      }, read: {}, readMany: {}, delete: {} 
    },
    customActions: {},
  },
  chat_rooms: {
    info: {},
    constraints: { 
      unique: [{ array: 'userIds' }], 
      relationship: [],
      access: [
        { type: 'filter', field: 'userIds' }, 
        { type: 'filter', field: 'enduserIds' }
      ]
    },
    fields: {
      ...BuiltInFields,
      type: {
        validator: chatRoomTypeValidator,
        initializer: () => 'internal'
      },
      topic: {
        validator: chatRoomTopicValidator,
      },
      topicId: { // this depends on a topic, dynamically based on the topic. How to best handle cleanup?
        validator: mongoIdStringValidator,
      },
      userIds: {
        validator: listOfMongoIdStringValidator,
        required: true,
        examples: [[PLACEHOLDER_ID]], 
        // add pull dependency for user deletion?
      },
      enduserIds: {
        validator: listOfMongoIdStringValidator,
        // add pull dependency for enduser deletion?
      }
    },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: {},
  },
  chats: {
    info: {},
    constraints: { 
      unique: [], 
      relationship: [],
      access: [{ type: 'dependency', foreignModel: 'chat_rooms', foreignField: '_id', accessField: 'roomId' }]
    },
    fields: {
      ...BuiltInFields,
      roomId: {
        validator: mongoIdStringValidator,
        required: true,
        updatesDisabled: true,
        examples: [PLACEHOLDER_ID],
        dependencies: [{
          dependsOn: ['chat_rooms'],
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'delete',
        }]
      },
      senderId: { 
        validator: mongoIdStringValidator,
        readonly: true, // create a separate endpoint for storing enduser chats
        initializer: (_, s) => s.userId,
        examples: [PLACEHOLDER_ID],
        dependencies: [{ // can be userId or enduserId
          dependsOn: ['users', 'endusers'],
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'setNull',
        }]
      },
      message: {
        validator: stringValidator,
        required: true,
        examples: ["Message"]
      },
      replyId: {
        validator: mongoIdStringValidator,
        updatesDisabled: true,
        dependencies: [{
          dependsOn: ['chats'],
          dependencyField: '_id',
          relationship: 'foreignKey',
          onDependencyDelete: 'setNull',
        }]
      },
      readBy:{
        validator: idStringToDateValidator,
      },
    },
    defaultActions: DEFAULT_OPERATIONS,
    readFilter: {
      roomId: { required: true },
    },
    customActions: {},
  },
  users: {
    info: {},
    constraints: { 
      unique: ['username'],
      globalUnique: ['email', 'phone'],
      relationship: [],
    },
    defaultActions: { read: {}, readMany: {} },
    customActions: {},
    fields: {
      ...BuiltInFields, 
      email: {
        validator: emailValidator,
        required: true,
        examples: ['test@tellescope.com']
      },
      phone: {
        validator: phoneValidator,
      },
      username: {
        validator: subdomainValidator,
      },
      fname: {
        validator: nameValidator,
      },
      lname: {
        validator: nameValidator,
      },
      organization: {
        validator: mongoIdStringValidator,
      },
      orgEmail: {
        validator: emailValidator,
        readonly: true,
      },
      accountType: {
        validator: accountTypeValidator,
      },
      roles: {
        validator: listOfStringsValidator,
      },
    }
  },
  templates: {
    info: {},
    constraints: { 
      unique: ['title'],
      relationship: [],
    },
    defaultActions: DEFAULT_OPERATIONS,
    customActions: {},
    fields: {
      ...BuiltInFields, 
      title: {
        validator: stringValidator100,
        required: true,
        examples: ["Template Name"],
      },
      subject: {
        validator: stringValidator250,
        required: true,
        examples: ["Template Subject"],
      },
      message: {
        validator: stringValidator5000,
        required: true,
        examples: ["This is the template message......"],
      },
      type: {
        validator: messageTemplateTypeValidator,
        initializer: () => 'enduser'
      },
    }
  }
}
