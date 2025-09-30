import mongoose, { Schema, model, Model } from 'mongoose';

// Define the Recharge interface
export interface Recharge {
  id: string;
  username: string; 
  amount: number;
  date: string; 
  status: 'pending' | 'completed' | 'failed';
}

// Define the Mongoose schema
const rechargeSchema = new Schema<Recharge>({
  id: { type: String, required: true, unique: true },
  username: { type: String, required: true }, 
  amount: { type: Number, required: true },
  date: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], required: true },
});

// Create the Mongoose model
const RechargeModel: Model<Recharge> = mongoose.models.Recharge || model<Recharge>('Recharge', rechargeSchema);

// MongoDB connection function
async function connectDB() {
  if (mongoose.connection.readyState === 0) { 
    try {
      await mongoose.connect(process.env.MONGODB_URI as string, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw new Error('Failed to connect to MongoDB');
    }
  }
}

export { RechargeModel, connectDB };