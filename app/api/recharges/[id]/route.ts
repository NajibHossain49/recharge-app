import { NextRequest, NextResponse } from 'next/server';
import { RechargeModel, connectDB, type Recharge } from '../../db';

// Define the context type explicitly
interface Context {
  params: Promise<{ id: string }>;
}

// Retrieve a specific recharge by ID
export async function GET(req: NextRequest, context: Context) {
  try {
    await connectDB();
    const { params } = context; // Destructure params directly
    const recharge = await RechargeModel.findOne({ id: (await params).id }).exec();

    if (!recharge) {
      return NextResponse.json(
        { success: false, data: null, message: 'Recharge not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: recharge,
      message: 'Recharge retrieved successfully',
    });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { success: false, data: null, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update a specific recharge by ID
export async function PUT(req: NextRequest, context: Context) {
  try {
    await connectDB();
    const { params } = context; // Destructure params directly
    const body = await req.json();
    const { username, amount, status } = body;

    // Validate input if provided
    if ((amount && typeof amount !== 'number') || (status && !['pending', 'completed', 'failed'].includes(status))) {
      return NextResponse.json(
        { success: false, data: null, message: 'Invalid input: amount must be a number, status must be valid' },
        { status: 400 }
      );
    }

    const updateData: Partial<Recharge> = {};
    if (username) updateData.username = username;
    if (typeof amount === 'number') updateData.amount = amount;
    if (status) updateData.status = status;

    const updatedRecharge = await RechargeModel.findOneAndUpdate(
      { id: (await params).id },
      { $set: updateData },
      { new: true }
    ).exec();

    if (!updatedRecharge) {
      return NextResponse.json(
        { success: false, data: null, message: 'Recharge not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedRecharge,
      message: 'Recharge updated successfully',
    });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { success: false, data: null, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete a specific recharge by ID
export async function DELETE(req: NextRequest, context: Context) {
  try {
    await connectDB();
    const { params } = context; // Destructure params directly
    const result = await RechargeModel.findOneAndDelete({ id: (await params).id }).exec();

    if (!result) {
      return NextResponse.json(
        { success: false, data: null, message: 'Recharge not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: null,
      message: 'Recharge deleted successfully',
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { success: false, data: null, message: 'Internal server error' },
      { status: 500 }
    );
  }
}