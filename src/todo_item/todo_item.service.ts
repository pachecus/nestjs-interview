import { Injectable } from '@nestjs/common';
import { CreateTodoItemDto } from './dtos/create-todo_item';
import { UpdateTodoItemDto } from './dtos/update-todo_item';
import { TodoItem } from '../interfaces/todo_item.interface';

@Injectable()
export class TodoItemService {
  private readonly todoItems: TodoItem[] = [];

  constructor() {}

  all(): TodoItem[] {
    return this.todoItems;
  }

  get(id: number): TodoItem {
    return this.todoItems.find((item) => item.id == id)
  }

  create(item: CreateTodoItemDto):  TodoItem{
    const todoItem: TodoItem = {
      id: this.nextId(),
      descripcion: item.descripcion,
      finalizada: false, // Todo todoItem comienza no finalizado
      idLista: item.idLista
    }

    this.todoItems.push(todoItem);

    return todoItem;
  };

  update(id: number, dto: UpdateTodoItemDto): TodoItem {
    const item = this.get(id);
    if (!item){
      return undefined;
    }

    item.descripcion = dto.descripcion;
    item.finalizada = dto.finalizada;
    item.idLista = dto.idLista;

    return item
  }

  delete(id: number): void {
    const i = this.todoItems.findIndex((item) => item.id == id)
    if (i !== -1) {
      this.todoItems.splice(i, 1)
    }
  }

  private nextId(): number {
    const last = this.todoItems
      .map((x) => x.id)
      .sort()
      .reverse()[0];

    return last ? last + 1 : 1;
  }
}
