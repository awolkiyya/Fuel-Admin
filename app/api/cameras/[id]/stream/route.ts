import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {

  const { id } = await context.params;


  const token = req.cookies.get("accessToken")?.value;


  if (!token) {
    return Response.json(
      {
        success:false,
        message:"Authorization token missing"
      },
      {
        status:401
      }
    );
  }


  const response = await fetch(
    `${process.env.API_BASE_URL}/api/cameras/${id}/stream`,
    {
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
  );


  return new Response(
    response.body,
    {
      status:response.status,
      headers:{
        "Content-Type":
          response.headers.get("Content-Type")
          ?? "multipart/x-mixed-replace"
      }
    }
  );

}