import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface IServerIdPage {
  params: {
    serverId: string;
  }
}

const ServerIdPage = async ({ params }: IServerIdPage) => {

  const profile = await currentProfile()

  if (!profile) {
    return redirectToSignIn()
  }

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        }
      }
    },
    include: {
      channels: {
        where: {
          name: "基础频道"
        },
        orderBy: {
          createdAt: "asc"
        }
      }
    }
  })
  const initialChannel = server?.channels[0]
  if (initialChannel?.name !== "基础频道") {
    return null
  }

  return redirect(`/servers/${params.serverId}/channels/${initialChannel?.id}`)
}

export default ServerIdPage