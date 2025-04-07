import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth'
import { z } from 'zod'

export async function sigIn(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sigin',
    {
      schema: {
        tags: ['Auth'],
        body: z.object({
          email: z.string().email(),
          password: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { email, password } = request.body
      const credentials = await signInWithEmailAndPassword(
        getAuth(),
        email,
        password
      )

      const token = await credentials.user.getIdToken(true)

      return reply.send({
        access_token: token,
      })
    }
  )
}
