import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data?.text || !data.text.trim()) {
      return NextResponse.json(
        {
          error: "Memory text is required",
        },
        {
          status: 400,
        }
      );
    }

    const client = await clientPromise;

    const db = client.db("flerovium");
    const collection = db.collection("activities");

    const activity = {
      text: data.text.trim(),
      timestamp: new Date(),

      source: "user",
      type: "activity",

      location: null,
      activity: null,
      category: null,

      confidence: 1.0,
    };

    const result = await collection.insertOne(activity);

    return NextResponse.json(
      {
        message: "Memory saved",
        id: result.insertedId.toString(),
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("POST /api/activities error:", error);

    return NextResponse.json(
      {
        error: "Could not save memory",
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
    const collection = db.collection("activities");

    const activities = await collection
      .find({})
      .sort({ timestamp: -1 })
      .toArray();

    const result = activities.map((activity) => ({
      id: activity._id.toString(),
      text: activity.text,
      timestamp: activity.timestamp
        ? new Date(activity.timestamp).toISOString()
        : null,

      source: activity.source ?? null,
      type: activity.type ?? null,

      location: activity.location ?? null,
      activity: activity.activity ?? null,
      category: activity.category ?? null,

      confidence: activity.confidence ?? null,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/activities error:", error);

    return NextResponse.json(
      {
        error: "Could not load memories",
      },
      {
        status: 500,
      }
    );
  }
}