import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data?.journalId) {
      return NextResponse.json(
        {
          error: "journalId is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!ObjectId.isValid(data.journalId)) {
      return NextResponse.json(
        {
          error: "Invalid journalId",
        },
        {
          status: 400,
        }
      );
    }

    const client = await clientPromise;

    const db = client.db("flerovium");

    const journals = db.collection("journals");
    const activities = db.collection("activities");

    // Find the journal
    const journal = await journals.findOne({
      _id: new ObjectId(data.journalId),
    });

    if (!journal) {
      return NextResponse.json(
        {
          error: "Journal not found",
        },
        {
          status: 404,
        }
      );
    }

    // --------------------------------------------------
    // TEMPORARY EVENT PARSER
    //
    // This is only to test the journal → activities
    // pipeline.
    //
    // The actual AI parser will replace this section.
    // --------------------------------------------------

    const events = [
      {
        journalId: journal._id,

        text: journal.text,

        timestamp: journal.timestamp,

        activity: null,

        location: null,

        category: null,

        people: [],

        confidence: null,

        source: "journal",

        createdAt: new Date(),
      },
    ];

    // Save extracted events
    if (events.length > 0) {
      await activities.insertMany(events);
    }

    // Mark journal as processed
    await journals.updateOne(
      {
        _id: journal._id,
      },
      {
        $set: {
          processed: true,
        },
      }
    );

    return NextResponse.json(
      {
        success: true,

        journalId: data.journalId,

        eventsCreated: events.length,
      },
      {
        status: 200,
      }
    );

  } catch (error) {
    console.error(
      "POST /api/process-journal error:",
      error
    );

    return NextResponse.json(
      {
        error: "Could not process journal",
      },
      {
        status: 500,
      }
    );
  }
}
