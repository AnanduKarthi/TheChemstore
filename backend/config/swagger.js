const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const definition = {
  openapi: '3.0.0',
  info: {
    title: 'TheChemStore API',
    version: '1.0.0',
    description:
      'REST API for TheChemStore — user authentication and chemistry job listings.\n\n' +
      'Jobs are fetched daily from LinkedIn, Indeed, Naukri, and Google Jobs via JSearch (RapidAPI) ' +
      'and enriched with Google Gemini AI for chemistry field classification, experience level, and skills extraction.',
    contact: { name: 'TheChemStore Team' },
  },
  servers: [
    { url: 'http://localhost:5000/api', description: 'Local development' },
  ],
  tags: [
    { name: 'Authentication', description: 'User registration, login, and email verification' },
    { name: 'Jobs', description: 'Chemistry job listings with AI-enriched metadata' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT obtained from `POST /auth/login` or `GET /auth/verify-email/:token`',
      },
    },
    schemas: {
      // ── Shared ──────────────────────────────────────────────────────────────
      Address: {
        type: 'object',
        properties: {
          street: { type: 'string', example: '123 Main St' },
          city: { type: 'string', example: 'Mumbai' },
          state: { type: 'string', example: 'Maharashtra' },
          postalCode: { type: 'string', example: '400001' },
          country: { type: 'string', example: 'India' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Something went wrong' },
        },
      },
      ValidationErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Validation failed' },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: { type: 'string', example: 'email' },
                message: { type: 'string', example: 'Valid email is required' },
              },
            },
          },
        },
      },
      Pagination: {
        type: 'object',
        properties: {
          total: { type: 'integer', example: 240 },
          page: { type: 'integer', example: 1 },
          limit: { type: 'integer', example: 20 },
          totalPages: { type: 'integer', example: 12 },
          hasNextPage: { type: 'boolean', example: true },
        },
      },

      // ── Auth ────────────────────────────────────────────────────────────────
      SignupRequest: {
        type: 'object',
        required: ['firstName', 'lastName', 'email', 'phoneNumber', 'password'],
        properties: {
          firstName: { type: 'string', maxLength: 50, example: 'John' },
          lastName: { type: 'string', maxLength: 50, example: 'Doe' },
          email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
          phoneNumber: { type: 'string', example: '+919876543210' },
          password: {
            type: 'string',
            minLength: 8,
            description: 'Must contain at least one uppercase letter, one lowercase letter, and one digit',
            example: 'SecurePass1',
          },
          dateOfBirth: { type: 'string', format: 'date', example: '1995-06-15' },
          gender: {
            type: 'string',
            enum: ['male', 'female', 'other', 'prefer_not_to_say'],
            example: 'male',
          },
          address: { $ref: '#/components/schemas/Address' },
        },
      },
      SignupResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: {
            type: 'string',
            example: 'Account created. Please check your email to verify your account.',
          },
          data: {
            type: 'object',
            properties: {
              id: { type: 'string', example: '664a1f2e3b7c4d0012345678' },
              firstName: { type: 'string', example: 'John' },
              lastName: { type: 'string', example: 'Doe' },
              email: { type: 'string', example: 'john.doe@example.com' },
            },
          },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
          password: { type: 'string', example: 'SecurePass1' },
        },
      },
      LoginResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          token: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
          data: {
            type: 'object',
            properties: {
              id: { type: 'string', example: '664a1f2e3b7c4d0012345678' },
              firstName: { type: 'string', example: 'John' },
              lastName: { type: 'string', example: 'Doe' },
              email: { type: 'string', example: 'john.doe@example.com' },
              role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
            },
          },
        },
      },
      ResendVerificationRequest: {
        type: 'object',
        required: ['email'],
        properties: {
          email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
        },
      },
      UserProfile: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '664a1f2e3b7c4d0012345678' },
          firstName: { type: 'string', example: 'John' },
          lastName: { type: 'string', example: 'Doe' },
          email: { type: 'string', example: 'john.doe@example.com' },
          phoneNumber: { type: 'string', example: '+919876543210' },
          dateOfBirth: { type: 'string', format: 'date-time', nullable: true },
          gender: {
            type: 'string',
            enum: ['male', 'female', 'other', 'prefer_not_to_say'],
            nullable: true,
          },
          address: { $ref: '#/components/schemas/Address' },
          role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
          isEmailVerified: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },

      // ── Jobs ────────────────────────────────────────────────────────────────
      JobLocation: {
        type: 'object',
        properties: {
          city: { type: 'string', example: 'Hyderabad' },
          state: { type: 'string', example: 'Telangana' },
          country: { type: 'string', example: 'India' },
          remote: { type: 'boolean', example: false },
          formatted: { type: 'string', example: 'Hyderabad, Telangana, India' },
        },
      },
      JobSalary: {
        type: 'object',
        properties: {
          min: { type: 'number', nullable: true, example: 60000 },
          max: { type: 'number', nullable: true, example: 90000 },
          currency: { type: 'string', nullable: true, example: 'USD' },
          period: { type: 'string', nullable: true, example: 'YEAR' },
        },
      },
      JobHighlights: {
        type: 'object',
        properties: {
          qualifications: {
            type: 'array',
            items: { type: 'string' },
            example: ["PhD in Chemistry required", "3+ years industry experience"],
          },
          responsibilities: {
            type: 'array',
            items: { type: 'string' },
            example: ["Conduct organic synthesis experiments"],
          },
          benefits: {
            type: 'array',
            items: { type: 'string' },
            example: ["Health insurance", "Flexible hours"],
          },
        },
      },
      Job: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '664a1f2e3b7c4d0012345679' },
          externalId: { type: 'string', example: 'job_abc123xyz' },
          title: { type: 'string', example: 'Senior Analytical Chemist' },
          company: { type: 'string', example: 'Pfizer India Pvt Ltd' },
          description: { type: 'string', example: 'We are looking for an experienced analytical chemist...' },
          applyUrl: { type: 'string', format: 'uri', example: 'https://www.linkedin.com/jobs/view/12345' },
          source: {
            type: 'string',
            enum: ['linkedin', 'indeed', 'naukri', 'glassdoor', 'google_jobs', 'other'],
            example: 'linkedin',
          },
          publisher: { type: 'string', example: 'LinkedIn' },
          employmentType: {
            type: 'string',
            enum: ['full_time', 'part_time', 'contract', 'internship', 'temporary', 'other'],
            example: 'full_time',
          },
          location: { $ref: '#/components/schemas/JobLocation' },
          salary: { $ref: '#/components/schemas/JobSalary' },
          postedAt: { type: 'string', format: 'date-time' },
          lastSeenAt: { type: 'string', format: 'date-time' },
          chemistryField: {
            type: 'string',
            description: 'AI-classified chemistry sub-discipline',
            enum: [
              'organic', 'inorganic', 'analytical', 'physical',
              'biochemistry', 'polymer', 'medicinal', 'environmental',
              'industrial', 'food', 'materials', 'computational', 'other',
            ],
            example: 'analytical',
          },
          experienceLevel: {
            type: 'string',
            description: 'AI-classified seniority level',
            enum: ['intern', 'entry', 'mid', 'senior', 'lead', 'manager', 'other'],
            example: 'senior',
          },
          skills: {
            type: 'array',
            description: 'AI-extracted technical skills',
            items: { type: 'string' },
            example: ['HPLC', 'GC-MS', 'NMR', 'method development'],
          },
          highlights: { $ref: '#/components/schemas/JobHighlights' },
          isActive: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      JobListResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'array',
            items: { $ref: '#/components/schemas/Job' },
          },
          pagination: { $ref: '#/components/schemas/Pagination' },
        },
      },
      FilterMetaResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'object',
            properties: {
              sources: {
                type: 'array',
                items: { type: 'string' },
                example: ['linkedin', 'indeed', 'naukri'],
              },
              chemistryFields: {
                type: 'array',
                items: { type: 'string' },
                example: ['analytical', 'organic', 'biochemistry'],
              },
              experienceLevels: {
                type: 'array',
                items: { type: 'string' },
                example: ['entry', 'mid', 'senior'],
              },
              employmentTypes: {
                type: 'array',
                items: { type: 'string' },
                example: ['full_time', 'contract'],
              },
              countries: {
                type: 'array',
                items: { type: 'string' },
                example: ['India', 'United States', 'United Kingdom'],
              },
            },
          },
        },
      },
      SyncRequest: {
        type: 'object',
        required: ['secret'],
        properties: {
          secret: {
            type: 'string',
            description: 'Must match the SYNC_SECRET environment variable',
            example: 'your_sync_secret',
          },
        },
      },
    },
    responses: {
      Unauthorized: {
        description: 'Missing or invalid JWT token',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
            example: { success: false, message: 'Not authenticated' },
          },
        },
      },
      ValidationError: {
        description: 'Request body or query parameter validation failed',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ValidationErrorResponse' },
          },
        },
      },
      NotFound: {
        description: 'Resource not found',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
            example: { success: false, message: 'Job not found' },
          },
        },
      },
    },
  },
};

module.exports = swaggerJsdoc({
  definition,
  apis: [path.join(__dirname, '../routes/*.js')],
});
