import { Company } from '@/entities/company.js'
import { User } from '@/entities/users.js'
import { authentication } from '@/http/middleware/authentication.js'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { getFirestore } from 'firebase-admin/firestore'
import { z } from 'zod'

export async function updateCompany(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .addHook('onRequest', authentication)
    .put(
      '/update-companies/:companyId',
      {
        schema: {
          body: z.object({
            logo: z.string(),
            cpfCnpj: z.string(),
            razaoSocial: z.string(),
            nomeFanasia: z.string(),
            telefone: z.string(),
            horarioDeFuncionamento: z.string(),
            endereco: z.string(),
            localizacao: z.string(),
            taxaDeEntrega: z.string(),
            ativa: z.boolean().optional(),
          }),
          params: z.object({
            companyId: z.string(),
          }),
        },
      },
      async (request, reply) => {
        const { companyId } = request.params

        const user = new User({
          id: request.user.id,
          name: request.user.name,
          email: request.user.email,
        })

        const company = new Company({
          user,
          ...request.body,
        })

        await getFirestore().collection('companies').doc(companyId).set(company)

        reply.status(201).send()
      }
    )
}
