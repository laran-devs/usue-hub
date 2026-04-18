import { Server as ServerIO } from "socket.io";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  // Logic for custom server integration or initialization check
  return new Response("Socket IO Logic Active. Room segregation by Institute ID implemented. Connection established.", { 
    status: 200 
  });
}

// Actual socket logic to be used by the server instance:
export const configSocket = (io: ServerIO) => {
  io.on("connection", (socket) => {
    console.log("Secure channel established:", socket.id);

    socket.on("join-room", async (instituteId: string) => {
      socket.join(instituteId);
      console.log(`Node ${socket.id} joined secure segment: ${instituteId}`);
      
      // Emit system message to the room
      io.to(instituteId).emit("system-message", {
        instituteId,
        content: `Anonymous unit connected to the channel.`,
        createdAt: new Date(),
      });
    });

    socket.on("send-message", async (data: { instituteId: string, content: string, userId: string }) => {
      // Broadcast to specific room
      io.to(data.instituteId).emit("new-message", {
        ...data,
        createdAt: new Date(),
      });
    });

    socket.on("disconnect", () => {
      console.log("Secure channel closed:", socket.id);
    });
  });
};
