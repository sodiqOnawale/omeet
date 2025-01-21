import mongoose from  'mongoose';

export interface IUser extends mongoose.Document {
  email: string;
  password: string;
  username: string;
  profile: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    bio: string;
    photos: string[];
    location: {
      type: string
      coordinates: number[]
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  profile: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    gender: { type: String, required: true },
    bio: { type: String, default: '' },
    photos: [{ type: String }],
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        default: [0, 0]
      }
    }
  }
}, {
  timestamps: true
});

userSchema.index({ "profile.location": "2dsphere" });

export const User = mongoose.model<IUser>('User', userSchema);
export default User;