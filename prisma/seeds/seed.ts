import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const compassAdm = await prisma.user.upsert({
    where: { email: 'compass.adm@email.io' },
    update: {},
    create: {
      email: 'compass.adm@email.io',
      name: 'CompassAdm',
      password: '123abc456',
      posts: {
        create: {
          title: 'Check out Prisma with Next.js',
          content: 'https://www.prisma.io/nextjs',
          published: true,
        },
      },
    },
  })
  const compassUser = await prisma.user.upsert({
    where: { email: 'compass.user@email.io' },
    update: {},
    create: {
      email: 'compass.user@email.io',
      name: 'CompassUser',
      password: '123abc456',
      posts: {
        create: {
          title: 'Check out Prisma with Next.js',
          content: 'https://www.prisma.io/nextjs',
          published: true,
        },
      },
    },
  })
  console.log({ compassAdm, compassUser })
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