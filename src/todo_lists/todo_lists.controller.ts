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
import { UpdateCompletionStateTodoItemDto } from './dtos/update_completion_state-todo_item';
import { UpdateDescriptionTodoItemDto } from './dtos/update_description-todo_item';
import { UpdateItemTodoListDto } from './dtos/update_item-todo_list';

@Controller('api/todolists')
export class TodoListsController {
  constructor(private todoListsService: TodoListsService) {}

  // Get all the todoLists with all their items
  @Get()
  index(): TodoList[] {
    return this.todoListsService.all();
  }

  // Get a todoList
  @Get('/:todoListId')
  show(
    @Param() param: { todoListId: number }
  ): TodoList | { error: string } {
    return this.todoListsService.get(param.todoListId);
  }

  // Create a new todoList
  @Post()
  create(
    @Body() dto: CreateTodoListDto
  ): TodoList | {error: string} { // returns error if list already exists
    return this.todoListsService.create(dto);
  }

  // Create a todoItem and add it into a todoList
  @Post('/add-todoitem')
  createTodoItem(
    @Body() dto: CreateTodoItemDto
  ): TodoItem | { error: string } {
    return this.todoListsService.createTodoItem(dto);
  }

  // Update the state of a todoItem to Completed (true), Incompleted (false)
  @Put('/completion-state/')
  updateCompletionState(
    @Body() dto: UpdateCompletionStateTodoItemDto
  ): TodoItem | { error:string } {
    return this.todoListsService.setCompletionStateItem(dto)
  }

  // Update the description of a todoItem
  @Put('/update-description')
  updateDescription(
    @Body() dto: UpdateDescriptionTodoItemDto
  ): TodoItem | { error:string } {
    return this.todoListsService.setDescriptionStateItem(dto)
  }

  // Move a todoItem from one todoList to another
  @Put('/move-item')
  updateItemList(
    @Body() dto: UpdateItemTodoListDto
  ): TodoItem | { error: string } {
    return this.todoListsService.setItemList(dto);
  }

  // Change the name of a todoList
  @Put('/:todoListId')
  update(
    @Param() param: { todoListId: number },
    @Body() dto: UpdateTodoListDto,
  ): TodoList | { error: string } {
    return this.todoListsService.update(param.todoListId, dto);
  }

  // Delete a todoItem from a todoList
  @Delete('/delete-todoitem')
  deleteItemList(
    @Body() body: { todoListId: number, todoItemId: number }
  ): void |  { error: string } {
    console.log("LLEGUE");
    const deleteItemRes = this.todoListsService.deleteItemList(body.todoListId, body.todoItemId)
    if (deleteItemRes) {
      return deleteItemRes;
    }
  }

  // Delete a todoList
  @Delete('/:todoListId')
  delete(
    @Param() param: { todoListId: number }
  ): void |  { error: string } {
    const deleteRes = this.todoListsService.delete(param.todoListId);
    if (deleteRes) {
      return deleteRes;
    }
  }

}
