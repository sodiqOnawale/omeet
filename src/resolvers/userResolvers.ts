import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user'
import { uploadToS3 } from '../services/uploadService';

const generateToken = (user: any) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: '24h'}
  )
}

export const userResolvers = {
  Query: {
    me: async (_: any, __: any, context: any) => {
      if (!context.user) {
        throw new Error('Not Authenticated')
      }
      return await User.findById(context.user.id);
    }
  },

  Mutation: {
    register: async (_: any, { input }: any) => {
      const { email, password, username, profile } = input;

      const existingUser = await User.findOne({
        $or: [{ email }, { username }]
      });

      if(existingUser) {
        throw new Error('User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 12)

      const user = new User({
        email,
        username,
        password : hashedPassword,
        profile,
      })

      const savedUser = await user.save();
      const token = generateToken(savedUser);

      return {
        token,
        user: savedUser,
      }
    },

    login: async (_:any, { input }: any) => {
      const { email, password } = input;

      const user = await User.findOne({ email })
      if(!user) {
        throw new Error('User not found')
      }

      const validPassword = await bcrypt.compare(password, user.password)
      if(!validPassword) {
        throw new Error('Invalid Password')
      }

      const token = generateToken(user)

      return {
        token,
        user
      }
    },

    uploadProfileImage: async (_: any, { file }: any, context: any) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
 
      const { createReadStream, filename, mimetype } = await file;
      const stream = createReadStream();
 
      // Convert stream to buffer
      const chunks = [];
      for await (const chunk of stream) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);
 
      // Upload to S3
      const fileUrl = await uploadToS3({
        buffer,
        originalname: filename,
        mimetype,
      } as Express.Multer.File);
 
      // Update user's profile photos
      await User.findByIdAndUpdate(
        context.user.id,
        { $push: { 'profile.photos': fileUrl } }
      );
 
      return fileUrl;
    },
  }
}