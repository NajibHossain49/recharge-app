import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { RechargeModel, connectDB, type Recharge } from "../db";

// Retrieve all recharges
export async function GET() {
  try {
    await connectDB(); // Ensure DB connection
    const recharges = await RechargeModel.find().exec();

    return NextResponse.json({
      success: true,
      data: recharges,
      message: "Recharges retrieved successfully",
    });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { success: false, data: null, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Create a new recharge
export async function POST(req: NextRequest) {
  try {
    await connectDB(); // Ensure DB connection
    const body = await req.json();
    const { username, amount, status } = body;

    if (
      !username ||
      typeof amount !== "number" ||
      !["pending", "completed", "failed"].includes(status)
    ) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message:
            "Invalid input: username, amount, and valid status are required",
        },
        { status: 400 }
      );
    }

    const newRecharge: Recharge = {
      id: uuidv4(),
      username,
      amount,
      date: new Date().toISOString(),
      status,
    };

    const savedRecharge = await RechargeModel.create(newRecharge);

    return NextResponse.json(
      {
        success: true,
        data: savedRecharge,
        message: "Recharge created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { success: false, data: null, message: "Internal server error" },
      { status: 500 }
    );
  }
}
