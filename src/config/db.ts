import { PrismaClient } from "../../prisma/output"

const db = new PrismaClient({
  errorFormat: "pretty",
})

export default db
