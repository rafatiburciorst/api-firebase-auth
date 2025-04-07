import { User } from '@/entities/users.js'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { getFirestore } from 'firebase-admin/firestore'
import { authentication } from '../middleware/auth.js'

export async function getUsers(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .addHook('onRequest', authentication)
    .get('/users', async (request, reply) => {
      const snapshot = await getFirestore().collection('users').get()
      const users = snapshot.docs.map(item => {
        const data = item.data() as User
        return new User({
          id: item.id,
          name: data.name,
          email: data.email,
        })
      })
      return reply.send(users)
    })
}
