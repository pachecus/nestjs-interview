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

  get(idList: number): TodoList | { error: string } {
    const todoList = this.todolists.find(list => list.id == Number(idList));
    if (todoList){
      return todoList
    }

    return { "error" : "list-does-not-exist" }
  }

  getAllLists(): TodoList[] {
    return this.todolists;
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
    const todolist = this.todolists.find(list => list.id == dto.idList);
    if (!todolist) {
      return { "error" : "list-does-not-exist" }
    }

    todolist.name = dto.newName;
    return todolist;
  }

  setCompletionStateItem(idList: number, idItem: number, state: boolean): TodoItem | { error: string } {
    const todoList = this.todolists.find(list => list.id == Number(idList));

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

  setDescriptionStateItem(idList: number, idItem: number, description: string): TodoItem | { error: string } {
    const todoList = this.todolists.find(list => list.id == Number(idList));

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

  setItemList(idList: number, idNewList: number, idItem: number): TodoItem | { error: string } {
    const todoList = this.todolists.find(list => list.id == Number(idList))
    if (!todoList) {
      return { "error" : "list-does-not-exist" };
    }
    const newTodoList = this.todolists.find(list => list.id == Number(idNewList))
    if (!newTodoList) {
      return { "error" : "list-does-not-exist" };
    }
    const item = todoList.items.find(item => item.id == Number(idItem))
    if(!item){
      return { "error" : "item-does-not-exist" };
    }

    const newItem = this.createTodoItem(idNewList, { descripcion: item.descripcion });
    if ("error" in newItem){
      return newItem;
    }

    const itemCompletionState = item.finalizada;

    const deletedItem = this.deleteItemList(idList, idItem);
    if(deletedItem && "error" in deletedItem){
      return deletedItem
    }

    if (itemCompletionState) {
      this.setCompletionStateItem(idNewList, newItem.id, true);
    }

    return newItem
  } 
 
  delete(idList: number): void | { error: string } {
    // chequeo para verificar que el indice de lista efectivamente existe
    const todoListIndex = this.todolists.findIndex(list => list.id == Number(idList));
    
    if (todoListIndex > -1) {
      this.todolists.splice(todoListIndex, 1);
    }else{
      return { "error" : "list-does-not-exist" }
    }
  }

  createTodoItem(idList: number, dto: CreateTodoItemDto): TodoItem | { error: string } {
    const todoList = this.todolists.find(list => list.id == Number(idList))

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

  deleteItemList(idList: number, idItem: number): void | { error: string } {
    const todoList = this.todolists.find(list => list.id == Number(idList));

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