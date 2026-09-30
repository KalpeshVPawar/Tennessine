import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data?.text || !data.text.trim()) {
      return NextResponse.json(
        {
          error: "Journal text is required",
        },
        {
          status: 400,
        }
      );
    }

    const client = await clientPromise;

    const db = client.db("flerovium");
    const collection = db.collection("journals");

    const journal = {
      text: data.text.trim(),
      timestamp: new Date(),

      source: "user",
      type: "journal",

      processed: false,
    };

    const result = await collection.insertOne(journal);

    return NextResponse.json(
      {
        message: "Journal saved",
        id: result.insertedId.toString(),
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("POST /api/journals error:", error);

    return NextResponse.json(
      {
        error: "Could not save journal",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET() {
  try {
    const client = await clientPromise;

    const db = client.db("flerovium");
    const collection = db.collection("journals");

    const journals = await collection
      .find({})
      .sort({ timestamp: -1 })
      .toArray();

    const result = journals.map((journal) => ({
      id: journal._id.toString(),
      text: journal.text,
      timestamp: journal.timestamp
        ? new Date(journal.timestamp).toISOString()
        : null,

      source: journal.source ?? null,
      type: journal.type ?? null,

      processed: journal.processed ?? false,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/journals error:", error);

    return NextResponse.json(
      {
        error: "Could not load journals",
      },
      {
        status: 500,
      }
    );
  }
}
