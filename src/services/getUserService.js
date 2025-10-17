const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const getDbUsers = async () => {
    const users = await prisma.user.findMany()
    return users
}

module.exports = {getDbUsers}