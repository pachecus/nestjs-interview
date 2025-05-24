export class UpdateTodoItemDto {
  descripcion: string;
  finalizada: boolean;
  idLista: number; // Permitir que cambie de lista un item
}
