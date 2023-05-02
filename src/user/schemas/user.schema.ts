import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Todo } from '../../todos/schemas/todo.schema';

export type UserDocument = User & Document;

interface Friend {
  id: string;
  email: string;
}

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  surName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Todo' }] })
  todos: Todo[];

  @Prop({ type: [Object], default: [] })
  friends: Friend[];
}

export const UserSchema = SchemaFactory.createForClass(User);
