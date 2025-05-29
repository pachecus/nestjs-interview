import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateTodoListDto } from './dtos/create-todo_list';
import { UpdateTodoListDto } from './dtos/update-todo_list';
import { TodoList } from '../interfaces/todo_list.interface';
import { TodoListsService } from './todo_lists.service';

import { TodoItem } from 'src/interfaces/todo_item.interface';
import { CreateTodoItemDto } from './dtos/create-todo_item';

@Controller('api/todolists')
export class TodoListsController {
  constructor(private todoListsService: TodoListsService) {}

  @Get()
  index(): string[] {
    return this.todoListsService.all();
  }
  
  @Get('/all')
  getAllLists(): TodoList[] {
    return this.todoListsService.getAllLists()
  }

  @Get('/:todoListName')
  show(
    @Param() param: { todoListName: string }
  ): TodoList | { error: string } {
    return this.todoListsService.get(param.todoListName);
  }


  @Post()
  create(
    @Body() dto: CreateTodoListDto
  ): TodoList | {error: string} {
    return this.todoListsService.create(dto);
  }

  @Post('/:todoListName')
  addItemList(
    @Param() param: { todoListName: string },
    @Body() dto: CreateTodoItemDto
  ): TodoItem | { error: string } {
    return this.todoListsService.createTodoItem(param.todoListName, dto);
  }

  @Put()
  update(
    @Body() dto: UpdateTodoListDto,
  ): TodoList | { error: string } {
    return this.todoListsService.update(dto);
  }

  @Put('/completion-state/:todoListName')
  updateCompletionState(
    @Param() param: { todoListName: string },
    @Body() bdy: { idItem: number, state: boolean } 
  ): TodoItem | { error:string } {
    return this.todoListsService.setCompletionStateItem(param.todoListName, bdy.idItem, bdy.state)
  }

  @Put('/description/:todoListName')
  updateDescription(
    @Param() param: { todoListName: string },
    @Body() bdy: { idItem: number, description: string } 
  ): TodoItem | { error:string } {
    return this.todoListsService.setDescriptionStateItem(param.todoListName, bdy.idItem, bdy.description)
  }

  @Put('/list/:todoListName')
  updateItemList(
    @Param() param: { todoListName: string },
    @Body() bdy: { newTodoListName: string, idItem: number }
  ): TodoItem | { error: string } {
    return this.todoListsService.setItemList(param.todoListName, bdy.newTodoListName, bdy.idItem);
  }

  @Delete()
  delete(
    @Body() body: { todoListName: string }
  ): void |  { error: string } {
    console.log(body.todoListName);
    const deleteRes = this.todoListsService.delete(body.todoListName);
    if (deleteRes) {
      return deleteRes;
    }
  }

  @Delete('/:todoListName')
  deleteItemList(
    @Param() param: { todoListName: string },
    @Body() bdy: { idItem: number }
  ): void |  { error: string } {
    const deleteItemRes = this.todoListsService.deleteItemList(param.todoListName, bdy.idItem)
    if (deleteItemRes) {
      return deleteItemRes;
    }
  }
}
