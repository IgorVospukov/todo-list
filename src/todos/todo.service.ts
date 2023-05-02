import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo, TodoDocument } from './schemas/todo.schema';

@Injectable()
export class TodoService {
  constructor(
    @InjectModel(Todo.name) private readonly model: Model<TodoDocument>,
  ) {}

  async findAllTodo(): Promise<Todo[]> {
    return await this.model.find().exec();
  }

  async findOneTodo(user: any): Promise<Todo> {
    const id = user.id;
    return await this.model.findOne({ id }).exec();
  }

  async createTodo(createTodoDto: CreateTodoDto, user: any): Promise<Todo> {
    return await new this.model({
      ...createTodoDto,
      createdAt: new Date(),
      user: user._id,
    }).save();
  }

  async updateTodo(id: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    return await this.model.findByIdAndUpdate(id, updateTodoDto).exec();
  }

  async deleteTodo(id: string): Promise<Todo> {
    return await this.model.findByIdAndDelete(id).exec();
  }

  async getTodoByUserId(user: any): Promise<Todo[]> {
    const id = user._id;
    return await this.model.find({ id }).exec();
  }
}
