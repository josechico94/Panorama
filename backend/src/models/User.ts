import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password?: string; // Opcional porque Google no envía contraseña
  name: string;
  provider?: string; // 'local' o 'google'
  providerId?: string; // ID único de Google
  avatar?: string; // Foto de perfil
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
  
  // Contraseña condicional a prueba de TypeScript
  password: { 
    type: String, 
    minlength: 6,
    required: function(this: any): boolean {
      // Solo es obligatoria si el registro es manual ('local') o si no tiene provider
      return this.provider === 'local' || !this.provider;
    }
  },
  
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  
  // Campos extra para manejar OAuth
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

// Middleware para encriptar la contraseña antes de guardar
UserSchema.pre('save', async function(next) {
  // Si no hay contraseña (es de Google) o si no fue modificada, saltamos la encriptación
  if (!this.password || !this.isModified('password')) {
    return next();
  }
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Método para comparar contraseñas en el Login
UserSchema.methods.comparePassword = async function(candidate: string) {
  // Si intenta loguearse de forma tradicional pero es un usuario de Google sin password
  if (!this.password) {
    return false; 
  }
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);