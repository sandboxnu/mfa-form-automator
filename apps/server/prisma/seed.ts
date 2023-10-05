import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const formTemplate1 =  await prisma.formTemplate.upsert({
    where: {id: '1', name: 'Form Template 1'},
    update: {},
    create: {
      id: '1',
      name: 'Form Template 1',
      formDocLink: 'https://www.mfa.org/'
    },
  })
  const signaturefield1 = await prisma.signatureField.upsert({
    where: {name: 'John Smith', id: '1234'},
    update: {},
    create: {
      id: '1234',
      name: 'John Smith',
      order: 1,
      formTemplate: {
        connect: { id: formTemplate1.id }
      }
    },
  })
  console.log({ formTemplate1, signaturefield1 })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })