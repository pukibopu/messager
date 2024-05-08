import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import {v4 as uuv4id} from "uuid"

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("UNAUTH", { status: 401 });
    }
    if (!params.serverId) {
      return new NextResponse("SERVER ID MISSING", { status: 400 });
    }

    const server=await db.server.update({
        where:{
            id:params.serverId,
            profileId:profile.id,
        },
        data:{
            inviteCode: uuv4id(),
        }
    })
    return NextResponse.json(server)
  } catch (error) {
    console.log("[SERVER_ID]", error);
    return new NextResponse("INTERNAL ERROR", { status: 500 });
  }
}
