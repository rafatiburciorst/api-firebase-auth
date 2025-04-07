import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import { z } from 'zod'

export async function forgetPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/forget-password',
    {
      schema: {
        body: z.object({
          email: z.string().email(),
        }),
      },
    },
    async (request, reply) => {
      const { email } = request.body
      await sendPasswordResetEmail(getAuth(), email)
      return reply.status(204).send()
    }
  )
}
