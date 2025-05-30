import { Injectable } from '@nestjs/common';
import { CreateTodoListDto } from './dtos/create-todo_list';
import { UpdateTodoListDto } from './dtos/update-todo_list';
import { TodoList } from '../interfaces/todo_list.interface';

import { TodoItem } from 'src/interfaces/todo_item.interface';
import { CreateTodoItemDto } from './dtos/create-todo_item';
import { UpdateCompletionStateTodoItemDto } from './dtos/update_completion_state-todo_item';
import { UpdateDescriptionTodoItemDto } from './dtos/update_description-todo_item';
import { UpdateItemTodoListDto } from './dtos/update_item-todo_list';

@Injectable()
export class TodoListsService {
  private readonly todolists: TodoList[];

  constructor(todoLists: TodoList[] = []) {
    this.todolists = todoLists;
  }

  // Service to retrieve all the todoLists
  all(): TodoList[] {
    return this.todolists;
  }

  // Service to get a todoList
  get(todoListId: number): TodoList | { error: string } {
    const todoList = this.todolists.find(list => list.id == Number(todoListId));
    if (todoList){
      return todoList;
    }
    return { "error" : "todolist-does-not-exist" } // If a todoList with 'todoListId' does not exist
  }

  // Service to Create a new todoList
  create(dto: CreateTodoListDto): TodoList | { error: string } {
    const todoListExists = this.todolists.find(list => list.name == dto.name)

    if (todoListExists) { 
      return { "error": "todolist-already-exists" }; // If a todoList with 'todoListId' already exists
    }

    const todoList: TodoList = {
      id: this.nextId(),
      name: dto.name,
      items: [] // TodoLists have a list of TodoItems
    };

    this.todolists.push(todoList);
    return todoList;
  }

  // Service to change the name of a todoList
  update(todoListId: number, dto: UpdateTodoListDto): TodoList | { error: string } {
    const todolist = this.todolists.find(list => list.id == Number(todoListId));
    if (!todolist) {
      return { "error" : "todolist-does-not-exist" } // If a todoList with 'todoListId' does not exist
    }

    todolist.name = dto.name;
    return todolist;
  }

  // Service to set the state of a todoItem to Completed or Incompleted
  setCompletionStateItem(dto: UpdateCompletionStateTodoItemDto): TodoItem | { error: string } {
    const todoList = this.todolists.find(list => list.id == Number(dto.todoListId));

    if (!todoList) {
      return { "error" : "todolist-does-not-exist" }; // If a todoList with 'dto.todoListId' does not exist
    }

    const item = todoList.items.find(i => i.itemId == dto.todoItemId);

    if (!item){
      return { "error" : "todoitem-does-not-exist" }; // If a todoItem with 'dto.todoItemId' does not exist
    }

    item.completed = dto.state;
    return item;
  }

  // Service to update the description of a todoItem
  setDescriptionStateItem(dto: UpdateDescriptionTodoItemDto): TodoItem | { error: string } {
    const todoList = this.todolists.find(list => list.id == Number(dto.todoListId));

    if (!todoList) {
      return { "error" : "todolist-does-not-exist" }; // If a todoList with 'dto.todoListId' does not exist
    }

    const item = todoList.items.find(i => i.itemId == Number(dto.todoItemId));

    if (!item){
      return { "error" : "todoitem-does-not-exist" }; // If a todoItem with 'dto.todoItemId' does not exist
    }
    
    item.description = dto.description;
    return item;
  }

  // Service to move a todoItem from one todoList to another
  setItemList(dto: UpdateItemTodoListDto): TodoItem | { error: string } {
    const todoList = this.todolists.find(list => list.id == Number(dto.todoListId))
    if (!todoList) {
      return { "error" : "todolist-does-not-exist" }; // If a todoList with 'dto.todoListId' does not exist
    }
    const newTodoList = this.todolists.find(list => list.id == Number(dto.newTodoListId))
    if (!newTodoList) {
      return { "error" : "todolist-does-not-exist" }; // If a todoList with 'dto.newTodoListId' does not exist
    }
    const item = todoList.items.find(item => item.itemId == Number(dto.todoItemId))
    if(!item){
      return { "error" : "todoitem-does-not-exist" }; // If a todoItem with 'dto.todoItemId' does not exist
    }

    // Create the item in the new todoList
    const dtoItem  = new CreateTodoItemDto();
    dtoItem.todoListId = dto.newTodoListId;
    dtoItem.description = item.description
    const newItem = this.createTodoItem(dtoItem);

    if ("error" in newItem){
      return newItem;
    }

    const itemCompletionState = item.completed;

    // Delete de item from the current list
    const deletedItem = this.deleteItemList(dto.todoListId, dto.todoItemId);
    if(deletedItem && "error" in deletedItem){
      return deletedItem
    }
    
    // Set the completion state of the item if it was completed
    const stateDto = new UpdateCompletionStateTodoItemDto();
    stateDto.todoListId = dto.newTodoListId
    stateDto.todoItemId = newItem.itemId;
    stateDto.state = true;
    if (itemCompletionState) {
      this.setCompletionStateItem(stateDto);
    }

    return newItem
  } 
 
  // Service to delete a todoList
  delete(todoListId: number): void | { error: string } {
    const todoListIndex = this.todolists.findIndex(list => list.id == Number(todoListId));
    
    if (todoListIndex > -1) {
      this.todolists.splice(todoListIndex, 1);
    }else{
      return { "error" : "todolist-does-not-exist" } // If a todoList with 'todoListId' does not exist
    }
  }

  // Service to create a new todoItem and add it into a todoList
  createTodoItem(dto: CreateTodoItemDto): TodoItem | { error: string } {
    const todoList = this.todolists.find(list => list.id == Number(dto.todoListId))

    if (!todoList){
      return { "error" : "todolist-does-not-exist" }; // If a todoList with 'dto.todoListId' does not exist
    }
    const newItem: TodoItem = {
      itemId: this.nextItemId(todoList),
      description: dto.description,
      completed: false
    };
    todoList.items.push(newItem);
    return newItem;
  }

  // Service to delete a todoItem from a todoList
  deleteItemList(todoListId: number, todoItemId: number): void | { error: string } {
    const todoList = this.todolists.find(list => list.id == Number(todoListId));

    if (!todoList) {
      return { "error" : "todolist-does-not-exist" }; // If a todoList with 'todoListId' does not exist
    }

    const itemIndex = todoList.items.findIndex(item => item.itemId == Number(todoItemId));

    if (itemIndex > -1){
      todoList.items.splice(itemIndex, 1);
    }else{
      return { "error" : "todoitem-does-not-exist" }; // If a todoItem with 'todoItemId' does not exist
    }
  }

  private nextId(): number {
    const last = this.todolists
      .map((x) => x.id)
      .sort()
      .reverse()[0];

    return last ? last + 1 : 1;
  }

  // Creates a new id for a TodoItem depending on how many elements the TodoList has (the TodoItem ids are not global across all TodoLists)
  private nextItemId(todoList: TodoList): number {
    const last = todoList.items
      .map((x) => x.itemId)
      .sort()
      .reverse()[0];

    return last ? last + 1 : 1
  }
}