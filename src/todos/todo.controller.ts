import {
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
  Get,
  Put,
  Delete,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoService } from './todo.service';
import { Todo } from './schemas/todo.schema';
import { UserService } from 'src/user/user.service';

@Controller('todos')
export class TodoController {
  constructor(
    private readonly todoService: TodoService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async allTodo(): Promise<Todo[]> {
    return await this.todoService.findAllTodo();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findTodo(@Req() req): Promise<Todo> {
    const email = req.user.email;
    const user = await this.userService.getUserByEmail(email);
    return await this.todoService.findOneTodo(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('mytodos')
  async getTodosByUserId(@Req() req): Promise<Todo[]> {
    const email = req.user.email;
    const user = await this.userService.getUserByEmail(email);
    return await this.todoService.getTodoByUserId(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  async createTodo(
    @Req() req,
    @Body() createTodoDto: CreateTodoDto,
  ): Promise<Todo> {
    const email = req.user.email;
    const user = await this.userService.getUserByEmail(email);
    return await this.todoService.createTodo(createTodoDto, user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async updateTodo(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<Todo> {
    return await this.todoService.updateTodo(id, updateTodoDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteTodo(@Param('id') id: string): Promise<Todo> {
    return await this.todoService.deleteTodo(id);
  }
}
