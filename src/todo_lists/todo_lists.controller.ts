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

  @Get('/:idList')
  show(
    @Param() param: { idList: number }
  ): TodoList | { error: string } {
    return this.todoListsService.get(param.idList);
  }


  @Post()
  create(
    @Body() dto: CreateTodoListDto
  ): TodoList | {error: string} {
    return this.todoListsService.create(dto);
  }

  @Post('/:idList')
  addItemList(
    @Param() param: { idList: number },
    @Body() dto: CreateTodoItemDto
  ): TodoItem | { error: string } {
    return this.todoListsService.createTodoItem(param.idList, dto);
  }

  @Put()
  update(
    @Body() dto: UpdateTodoListDto,
  ): TodoList | { error: string } {
    return this.todoListsService.update(dto);
  }

  @Put('/completion-state/:idList')
  updateCompletionState(
    @Param() param: { idList: number },
    @Body() bdy: { idItem: number, state: boolean } 
  ): TodoItem | { error:string } {
    return this.todoListsService.setCompletionStateItem(param.idList, bdy.idItem, bdy.state)
  }

  @Put('/description/:idList')
  updateDescription(
    @Param() param: { idList: number },
    @Body() bdy: { idItem: number, description: string } 
  ): TodoItem | { error:string } {
    return this.todoListsService.setDescriptionStateItem(param.idList, bdy.idItem, bdy.description)
  }

  @Put('/list/:idList')
  updateItemList(
    @Param() param: { idList: number },
    @Body() bdy: { idNewList: number, idItem: number }
  ): TodoItem | { error: string } {
    return this.todoListsService.setItemList(param.idList, bdy.idNewList, bdy.idItem);
  }

  @Delete()
  delete(
    @Body() body: { idList: number }
  ): void |  { error: string } {
    const deleteRes = this.todoListsService.delete(body.idList);
    if (deleteRes) {
      return deleteRes;
    }
  }

  @Delete('/:idList')
  deleteItemList(
    @Param() param: { idList: number },
    @Body() bdy: { idItem: number }
  ): void |  { error: string } {
    const deleteItemRes = this.todoListsService.deleteItemList(param.idList, bdy.idItem)
    if (deleteItemRes) {
      return deleteItemRes;
    }
  }
}
