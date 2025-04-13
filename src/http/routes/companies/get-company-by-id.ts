import { Company } from '@/entities/company.js'
import { User } from '@/entities/users.js'
import { authentication } from '@/http/middleware/authentication.js'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { getFirestore } from 'firebase-admin/firestore'
import { z } from 'zod'

export async function getCompanyById(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .addHook('onRequest', authentication)
    .get(
      '/company/:companyId',
      {
        schema: {
          params: z.object({
            companyId: z.string(),
          }),
        },
      },
      async (request, reply) => {
        const { companyId } = request.params

        const doc = await getFirestore()
          .collection('companies')
          .doc(companyId)
          .get()
        const data = doc.data() as Company

        const company = new Company({
          id: data.id,
          ...data,
        })

        reply.status(200).send(company)
      }
    )
}
