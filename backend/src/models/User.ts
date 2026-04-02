import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password?: string;
  name: string;
  provider?: string;
  providerId?: string;
  avatar?: string;
  createdAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true 
  },
  
  // SOLUCIÓN DEFINITIVA: Apagamos el guardia de la base de datos
  password: { 
    type: String, 
    required: false 
  },
  
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  
  provider: { 
    type: String, 
    default: 'local' 
  },
  
  providerId: { 
    type: String 
  },
  
  avatar: { 
    type: String 
  },
  
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

UserSchema.pre('save', async function(next) {
  if (!this.password || !this.isModified('password')) {
    return next();
  }
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.comparePassword = async function(candidate: string) {
  if (!this.password) {
    return false; 
  }
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);