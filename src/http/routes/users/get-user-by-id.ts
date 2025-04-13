import { User } from '@/entities/users.js'
import { authentication } from '@/http/middleware/authentication.js'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { getFirestore } from 'firebase-admin/firestore'
import { z } from 'zod'

export async function getUserProfile(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .addHook('onRequest', authentication)
    .get(
      '/me',
      {
        schema: {
          tags: ['Profile'],
          security: [{ bearerAuth: [] }],
          response: {
            200: z.object({
              id: z.string(),
              name: z.string(),
              email: z.string().email(),
            }),
          },
        },
      },
      async (request, reply) => {
        const doc = await getFirestore()
          .collection('users')
          .doc(request.user.id)
          .get()
        const data = doc.data() as Omit<User, 'id'>
        const user = new User({
          id: doc.id,
          name: data.name,
          email: data.email,
          password: null,
        })
        return reply.send(user)
      }
    )
}
