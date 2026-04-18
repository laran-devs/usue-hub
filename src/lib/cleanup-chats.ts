import { prisma } from "./prisma"

/**
 * Chat Cleanup Service
 * Logic to clear messages periodically to maintain anonymity and basement feel.
 */
export async function cleanupDailyMessages() {
  console.log("Initializing secure wipe of chat logs...")
  
  try {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    const result = await prisma.chatMessage.deleteMany({
      where: {
        createdAt: {
          lt: yesterday
        }
      }
    })

    console.log(`Wipe complete. Purged ${result.count} logs from the system.`)
    return result.count
  } catch (error) {
    console.error("Secure wipe failed:", error)
    throw error
  }
}
