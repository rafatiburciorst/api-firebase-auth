import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { getFirestore } from 'firebase-admin/firestore'
import { z } from 'zod'

import { getAuth } from 'firebase-admin/auth'
import { authentication } from '@/http/middleware/authentication.js'

export async function updateUser(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .addHook('onRequest', authentication)
    .put(
      '/users',
      {
        schema: {
          body: z.object({
            name: z.string(),
            email: z.string(),
            password: z.string().optional(),
          }),
        },
      },
      async (request, reply) => {
        const user = request.body
        const userId = request.user.id

        await Promise.all([
          getAuth().updateUser(userId, {
            displayName: user.name,
            email: user.email,
            password: user.password,
          }),
          getFirestore().collection('users').doc(userId).set(user),
        ])

        return reply.status(204).send()
      }
    )
}
