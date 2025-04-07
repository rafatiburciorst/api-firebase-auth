import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { getFirestore } from 'firebase-admin/firestore'
import { authentication } from '../middleware/auth.js'
import { getAuth } from 'firebase-admin/auth'

export async function deleteUser(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .addHook('onRequest', authentication)
    .delete('/users', {}, async (request, reply) => {
      const userId = request.user.id

      await Promise.all([
        getAuth().deleteUser(userId),
        getFirestore().collection('users').doc(userId).delete(),
      ])

      return reply.status(201).send()
    })
}
