export interface TodoItem {
    id: number, // Id 
    descripcion: string, // Texto de nota
    finalizada: boolean, // Finalizada o no finalizada
    idLista: number; // A que lista corresponde
}