import { BadRequestError } from './_errors/bad-request-error.js'
import { UnauthorizedError } from './/_errors/unauthorized-error.js'
import type { FastifyInstance } from 'fastify'
import { ZodError } from 'zod'
import { FirebaseAuthError } from 'firebase-admin/auth'
import { FirebaseError } from 'firebase/app'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error',
      errors: error,
    })
  }

  if (error instanceof BadRequestError) {
    return reply.status(400).send({
      message: error.message,
    })
  }

  if (error instanceof UnauthorizedError) {
    return reply.status(401).send({
      message: error.message,
    })
  }

  if (error instanceof FirebaseAuthError) {
    return reply.status(409).send({
      message: error.message,
    })
  }

  if (error instanceof FirebaseError) {
    return reply.status(401).send({
      message: error.message,
    })
  }

  console.error(error)

  return reply.status(500).send({
    message: 'Internal server error',
  })
}
