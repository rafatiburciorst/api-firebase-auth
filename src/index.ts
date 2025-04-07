import { fastify } from 'fastify'
import { initializeApp as initializeAppServer } from 'firebase-admin/app'
import { initializeApp as initializeAppWeb } from 'firebase/app'
import { getUsers } from './http/routes/get-users.js'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { saveUsers } from './http/routes/save-users.js'
import { getUserProfile } from './http/routes/get-user-by-id.js'
import { updateUser } from './http/routes/update-users.js'
import { deleteUser } from './http/routes/delete-users.js'
import { errorHandler } from './error-handler.js'
import { sigIn } from './http/routes/sign-in.js'
import fastifyCors from '@fastify/cors'
import fastifySwaggerUi from '@fastify/swagger-ui'
import fastifySwagger from '@fastify/swagger'
import { forgetPassword } from './http/routes/forget-password.js'

initializeAppServer()
initializeAppWeb({
  apiKey: process.env.FIRE_API_KEY,
})

const isProd = process.env.NODE_ENV === 'production'

const app = fastify({
  logger: isProd
    ? true
    : {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        },
      },
}).withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
  origin: '*',
})

app.setErrorHandler(errorHandler)
app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Ecommerce',
      description: 'Api Ecommerce',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  transform: jsonSchemaTransform,
})
app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(sigIn, { prefix: 'api/v1' })
app.register(getUsers, { prefix: 'api/v1' })
app.register(saveUsers, { prefix: 'api/v1' })
app.register(getUserProfile, { prefix: 'api/v1' })
app.register(updateUser, { prefix: 'api/v1' })
app.register(deleteUser, { prefix: 'api/v1' })
app.register(forgetPassword, { prefix: 'api/v1' })

app
  .listen({
    host: '0.0.0.0',
    port: 3333,
  })

  .then(() => app.log.info('Server is running'))
