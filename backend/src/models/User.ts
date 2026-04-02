import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password?: string; // Ahora es opcional (Google no envía password)
  name: string;
  provider?: string; // Agregamos provider ('local' o 'google')
  providerId?: string; // El ID de Google
  avatar?: string; // La foto de perfil
  createdAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  
  // 1. LA MAGIA: Contraseña condicional
  password: { 
    type: String, 
    minlength: 6,
    required: function() {
      // Solo es obligatoria si el provider es 'local' o no hay provider
      return this.provider === 'local' || !this.provider;
    }
  },
  
  name:  { type: String, required: true, trim: true },
  
  // 2. Agregamos los campos de Google que estabas mandando desde auth.ts
  provider: { type: String, default: 'local' },
  providerId: { type: String },
  avatar: { type: String },
  
  createdAt: { type: Date, default: Date.now },
});

// 3. Protegemos el encriptado
UserSchema.pre('save', async function(next) {
  // Si no hay contraseña (es de Google) o no fue modificada, saltamos este paso
  if (!this.password || !this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.comparePassword = async function(c: string) {
  if (!this.password) return false; // Si intenta loguearse normal pero es user de Google
  return bcrypt.compare(c, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);