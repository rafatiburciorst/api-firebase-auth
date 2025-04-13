import { Company } from '@/entities/company.js'
import { authentication } from '@/http/middleware/authentication.js'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { getFirestore } from 'firebase-admin/firestore'

export async function getCompanies(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .addHook('onRequest', authentication)
    .get('/get-companies', {}, async (request, reply) => {
      const snapshot = await getFirestore().collection('companies').get()

      const companies = snapshot.docs.map(item => {
        const data = item.data() as Company
        const company = new Company({
          id: item.id,
          ...data,
        })

        return company
      })

      reply.status(200).send(companies)
    })
}
