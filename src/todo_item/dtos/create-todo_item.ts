export class CreateTodoItemDto {
    descripcion: string;
    // finalizada: boolean; // No es necesario ya que no voy a permitir crear items de listas finalizados
    idLista: number;
}