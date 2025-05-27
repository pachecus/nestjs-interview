import { Module } from '@nestjs/common';
import { TodoItemController } from './todo_item.controller';
import { TodoItemService } from './todo_item.service';

@Module({
  imports: [],
  controllers: [TodoItemController],
  providers: [
    { provide: TodoItemService, useValue: new TodoItemService([]) },
  ],
})
export class TodoItemModule {}
