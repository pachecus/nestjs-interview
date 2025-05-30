# Entrega Proyecto TodoList - Juan Manuel Pacheco

## Descripción del Proyecto

Este proyecto implementa una API REST junto con un servidor MCP para gestionar todoLists. Cada lista puede contener ítems que pueden marcarse como finalizados o no, editarse o moverse entre listas.

## Requisitos Previos

- Node.js (versión >= 18)
- npm (versión >= 9)
- Typescript
- NestJS
- tsx
- SDK de Model Context Protocol (MCP)

## Instalación de Dependencias

```bash
npm install
```

## Ejecución

### 1) Ejecutar la API:

```bash
npm run start
```

### 2.a) Ejecutar el MCP Server con Inspector:
Primero se debe navegar hasta el directorio raiz del proyecto: `/nestjs-interview` y ejecutar el siguiente comando:
```bash
npx -y @modelcontextprotocol/inspector npx -y tsx src/mcp/main.ts
```

Luego ir a [http://127.0.0.1:6274](http://127.0.0.1:6274) y presionar:
1. "Connect"
2. "List Tools"
3. Seleccionar y usar cualquier herramienta

### 2.b)Ejecutar con Claude Desktop

Activar el modo Developer y agregar lo siguiente en `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "todoList": {
      "command": "npx",
      "args": ["-y", "tsx", "/ruta/absoluta/a/src/mcp/main.ts"]
    }
  }
}
```
Modifique la ruta absoluta por la que corresponda.
Reiniciar Claude y ya estaran las tools disponibles.

## Prompts de Ejemplo (Testeadas en Claude Desktop)

### `1) create-todoList` 
> Crea una nueva todoList
- "Hola, me podés crear una todoList con el nombre 'Mi Empresa'?"
- "Me podés crear una todoLista de nombre 'Compras'?"
- "Crea una todoList de nombre 'Facultad'"

### `2) changeName-todoList`
> Cambia el nombre de una todoList
- "Cambiá el nombre a la todoList 'Mi Empresa' por 'Trabajo'"

### `3) delete-todoList`
> Elimina una todoList y todos los todoItem que pertencen a ella
- "¿Podés eliminar la todoList 'Compras'?"

### `4) get-a-todoList`
> Obtiene la informacion de una todoList, incluyendo todos los todoItems que contiene.
- "¿Me podes mostrar unicamente la todoList "Facultad"?"

### `5) getAll-todoLists`
> Obtiene todas las todoList con todos los todoItems que pertenecen a ellas
- "Mostrame todas las todoLists con sus todoItems"

### `6) create-todoItem-todoList`
> Agrega un todoItem a una todoList
- "Agregá un todoItem a la todoList de Facultad que se llame 'Entrega de Programación Lógica Lunes 20/04'"
- "Agrega un todoItem a la todoList de Trabajo que tenga de descripcion 'Entregar informe diario'"
- "Coloca un todoItem en la todoList de Trabajo con la siguiente descripcion: 'Clase de Consulta FuO 22/04'"

### `7) delete-todoItem-TodoList`
> Elimina un todoItem de una todoList
- "Eliminá el todoItem que dice 'Entregar informe diario' de la Lista de Trabajo"

### `8) setCompleted-todoItem`
> Marca como finalizado un todoItem
- "Marcá como finalizado 'Entrega de Programación Lógica' de la Lista de Facultad"

### `9) setIncompleted-todoItem`
> Marca como no finalizado un todoItem
- "Marcá como no finalizada 'Entrega de Programación Lógica' de la Lista de Facultad"

### `10) changeDecription-todoItem`
> Cambia la descripcion de un todoItem
- "Cambiá la descripción de 'Entrega de Programación Lógica' para que la entrega sea el 16/04"

### `11) move-todoItem-todoList`
> Mueve un todoItem de una todoLista a otra
- "Cambiá el item 'Clase de Consulta FuO 22/04' de la Lista de Trabajo a la Lista de Facultad"



## Notas Técnicas
- La API Rest responde con estructuras tipo `TodoList`, `TodoItem` y errores de tipo `{ error: string }`. Decidi devolver errores para que Claude y Copilot comprendan mejor los casos borde (realmente no se si era necesario pero lo hice por las dudas).
- `TodoList` fue modificado y tiene una lista de Items (`items: TodoItem[]`)
- `TodoItem` tiene itemId: number, description: string, completed: boolean.

## Reflexión Personal

Este proyecto fue muy interesante de desarrollar. Ya tenía experiencia creando APIs REST usando JavaScript y Python, por lo que trabajar con TypeScript fue bastante directo.
Pero, el concepto de servidor MCP fue algo completamente nuevo para mi. No tenia idea de que se trataba, asi que me puse a hacer mucha investigación. Uno de los videos que mas me ayudo a entenderlo fue este (https://www.youtube.com/watch?v=wnHczxwukYY&t=0).
Alli se explica que es un Servidor MCP, como crear uno de cero, como usar el MCP Inspector, como conectarlo con Claude Desktop y con Visual Studio Copilot.
Tambien tuve que buscar en muchos lados como activar el modo Developer para Claude en Windows, y termine encontrando en comentario en un foro de Reddit mi respuesta (), estaba increiblemente escondido por alguna razon.

En un principio intente no modificar tanto el codigo base que me pasaron, eso me llevo a manejar los Items en una estructura completamente seprada de las Listas. Con el pasar de los dias me di cuenta que no me convencia, especialmente porque llego un punto que para eliminar un Item no era necesario indicar a que lista pertenecia.
Entonces, en el tercer o cuarto dia, decidi reahacer la arquitectura y hacer hacer que las listas tuvieran una lista de items.

Una vez que entendi como funcionaban los Servidores MCP me "copé" (perdon, pero es la expresion que mejor lo describe), realmente me intereso muchisimo lo que se puede hacer, el potencial que tiene y realmente fue un proyecto muy muy interesante.
Al final hice 11 herramientas para manejar Listas e Items y me quede durante varias noches haciendo este proyecto por el disfrute que tuve.

Realmente espero que me consideren para el puesto de Jr AI Full Stack Developer. Mi interés por la IA es muy grande y este proyecto, repito, fue muy entretenido, muy interesantre y definitivamente es una tecnologia que voy a seguir explorando por mi cuenta. 
En la facultad ya tengo planificadas 2 materias relacionadas con la IA para el semestre que viene: Intoduccion al Procesamiento del Lenguaje Natural y Aprendizaje Automatico. Además, hace algunos años curse la materia de Algoritmos Evolutivos la cual disfrute mucho.

### Referencias

Estos son los principales recursos a de los cuales extraje informacion para hacer el proyecto:

- **¡Aprende MCP! Para principiantes + Crear nuestro primer MCP DESDE CERO** (Midudev)  
  https://www.youtube.com/watch?v=wnHczxwukYY&t=0

- **Repositorio oficial de servidores MCP**  
  https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem

- **Ejemplos oficiales de Model Context Protocol**  
  https://modelcontextprotocol.io/examples

- **Crunchloop - MCP para Teamtailor**  
  https://github.com/crunchloop/mcp-teamtailor/tree/main

- **SDK TypeScript de Model Context Protocol**  
  https://github.com/modelcontextprotocol/typescript-sdk?tab=readme-ov-file#proxy-authorization-requests-upstream




---

Autor: **Juan Manuel Pacheco**
