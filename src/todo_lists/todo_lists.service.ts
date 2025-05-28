import { Injectable } from '@nestjs/common';
import { CreateTodoListDto } from './dtos/create-todo_list';
import { UpdateTodoListDto } from './dtos/update-todo_list';
import { TodoList } from '../interfaces/todo_list.interface';

import { TodoItem } from 'src/interfaces/todo_item.interface';
import { CreateTodoItemDto } from './dtos/create-todo_item';
import { UpdateTodoItemDto } from './dtos/update-todo_item';

@Injectable()
export class TodoListsService {
  private readonly todolists: TodoList[];

  constructor(todoLists: TodoList[] = []) {
    this.todolists = todoLists;
  }

  all(): string[] {
    return this.todolists.map(list => list.name);
  }

  get(todoListName: string): TodoList | { error: string } {
    const todoList = this.todolists.find(list => list.name === String(todoListName));
    if (todoList){
      return todoList
    }

    return { "error" : "list-does-not-exist" }
  }

  create(dto: CreateTodoListDto): TodoList | { error: string } {
    const exists = this.todolists.find(list => list.name == dto.name)

    if (exists) { // ya existe una lista con el nombre dto.name
      return { "error": "list-already-exists" };
    }

    const todoList: TodoList = {
      id: this.nextId(),
      name: dto.name,
      items: [] // Las todoLists tienen una lista de Items
    };

    this.todolists.push(todoList);
    return todoList;
  }

  update(dto: UpdateTodoListDto): TodoList | { error: string } {
    const todolist = this.todolists.find(list => list.name == dto.name);
    if (!todolist) {
      return { "error" : "list-does-not-exist" }
    }

    todolist.name = dto.newName;
    return todolist;
  }

  setCompletionStateItem(nameList: string, idItem: number, state: boolean): TodoItem | { error: string } {
    const todoList = this.todolists.find(list => list.name == String(nameList));

    if (!todoList) {
      return { "error" : "list-does-not-exist" };
    }

    const item = todoList.items.find(i => i.id == idItem);

    if (!item){
      return { "error" : "list-does-not-exist" };
    }

    item.finalizada = state;
    return item;
  }

  setDescriptionStateItem(nameList: string, idItem: number, description: string): TodoItem | { error: string } {
    const todoList = this.todolists.find(list => list.name == String(nameList));

    if (!todoList) {
      return { "error" : "list-does-not-exist" };
    }

    const item = todoList.items.find(i => i.id == idItem);

    if (!item){
      return { "error" : "list-does-not-exist" };
    }
    
    item.descripcion = description;
    return item;
  }
 
  delete(todoListName: string): void | { error: string } {
    const todoListIndex = this.todolists.findIndex(list => list.name == String(todoListName));
    
    if (todoListIndex > -1) {
      this.todolists.splice(todoListIndex, 1);
    }else{
      return { "error" : "list-does-not-exist" }
    }
  }

  createTodoItem(nameList: string, dto: CreateTodoItemDto): TodoItem | { error: string } {
    const todoList = this.todolists.find(list => list.name == String(nameList))

    if (!todoList){
      return { "error" : "list-does-not-exist" };
    }
    const newItem: TodoItem = {
      id: this.nextItemId(todoList),
      descripcion: dto.descripcion,
      finalizada: false
    };
    todoList.items.push(newItem);
    return newItem;
  }

  deleteItemList(nameList: string, idItem: number): void | { error: string } {
    const todoList = this.todolists.find(list => list.name == nameList);

    if (!todoList) {
      return { "error" : "list-does-not-exist" };
    }

    const itemIndex = todoList.items.findIndex(item => item.id == Number(idItem));

    if (itemIndex > -1){
      todoList.items.splice(itemIndex, 1);
    }else{
      return { "error" : "item-does-not-exist" };
    }
  }



  private nextId(): number {
    const last = this.todolists
      .map((x) => x.id)
      .sort()
      .reverse()[0];

    return last ? last + 1 : 1;
  }

  private nextItemId(todoList: TodoList): number {
    const last = todoList.items
      .map((x) => x.id)
      .sort()
      .reverse()[0];

    return last ? last + 1 : 1
  }
}