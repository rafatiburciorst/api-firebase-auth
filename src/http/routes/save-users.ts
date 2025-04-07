import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { z } from 'zod'

export async function saveUsers(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users',
    {
      schema: {
        body: z.object({
          name: z.string(),
          email: z.string(),
          password: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { email, name, password } = request.body

      const record = await getAuth().createUser({
        email: email,
        displayName: name,
        password: password,
      })

      await getFirestore().collection('users').doc(record.uid).set({
        name,
        email,
      })

      return reply.status(201).send()
    }
  )
}
