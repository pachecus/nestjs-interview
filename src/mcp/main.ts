import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from 'zod'
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new McpServer ({
  name: 'Server mcp Crunchloop',
  version: '1.0.0'
})

server.tool(
  'create-todoList',
  'Tool para crear una nueva todoList',
  { 
      nombre: z.string().describe('Nombre de todoList nueva')
  },
  async ({ nombre }) => {
      try {
          // llamada a api
          const crearResp = await fetch('http://localhost:3000/api/todolists', {
              method: 'POST',
              headers: {'Content-Type': 'application/json',},
              body: JSON.stringify({ name: nombre })
          });

          // fallar si la respuesta no es valida
          if (!crearResp.ok) {
              throw new Error(`Error ${crearResp.status}: ${await crearResp.text()}`);
          }

          // extraer y retornar la informacion
          const crearData = await crearResp.json();

          // Ya exsite una lista con el nombre nombreLista
          if('error' in crearData) {
            return {
              content: [
                {
                  type:'text',
                  text: `Ya existe una lista con el nombre ${nombre}`
                }
              ]
            }
          }

          return {
              content: [
                  {
                      type: 'text',
                      text: JSON.stringify(crearData, null, 2)
                  }
              ]
          };
      } catch (error) {
          return {
              content: [
                  {
                      type: 'text',
                      text: `No se pudo crear la todoList: ${error.message}`
                  }
              ]
          };
      }
  }
)

server.tool(
  'update-todoList',
  'Tool para cambiar el nombre de una todoList',
  {
    idLista: z.number().describe('Id de la lista a la que se le desea cambiar el nombre'),
    nuevoNombre: z.string().describe('Nuevo nombre que tendra la lista')
  },
  async ({idLista, nuevoNombre}) => {
    try{
      const cambiarNomListaResp = await fetch('http://localhost:3000/api/todolists', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json',},
        body: JSON.stringify({ idList: idLista, newName: nuevoNombre })
      })

      if (!cambiarNomListaResp.ok) {
        throw new Error(`Error ${cambiarNomListaResp.status}: ${await cambiarNomListaResp.text()}`);
      }

      // extraer y retornar la informacion
      const cambiarNomData = await cambiarNomListaResp.json();

      // Ya exsite una lista con el nombre nombreLista
      if('error' in cambiarNomData) {
        return {
          content: [
            {
              type:'text',
              text: `La lista no existe`
            }
          ]
        }
      }

      return {
          content: [
              {
                  type: 'text',
                  text: JSON.stringify(cambiarNomData, null, 2)
              }
          ]
      };

    }catch(error){
      return {
          content: [
            {
              type: 'text',
              text: `No se pudo cambiar el nombre de la lista: ${error.message}`
            }
          ]
      };
    }

  }
)

server.tool(
  'delete-todoList', 
  'Tool que permite eliminar una lista en su totalidad, incluyendo todos los items que pertenecen a ella',
  {
    idLista: z.number().describe('Id de la lista que se desea eliminar')
  },
  async ({ idLista }) => {
      try{
        const eliminarListaResp = await fetch('http://localhost:3000/api/todolists', {
          method: 'DELETE', 
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ idList: idLista })
        });
      
      // fallar si la llamada a la api no fue valida
      if (!eliminarListaResp.ok) {
        throw Error(`Error al eliminar la lista`)
      }
      
      const textResp = await eliminarListaResp.text()
      if (textResp) {
        const eliminarListaDatos = JSON.parse(textResp);

        if ("error" in eliminarListaDatos) {
          return {
            content: [
              {
                type: 'text',
                text: `Error, la lista no existe`
              }
            ]
          }
        }
      }

      
      
      return {
        content: [
          {
            type:'text',
            text: `La lista se elimino correctamente`
          }
        ]
      };
    } catch(error) {
      return {
            content: [
              {
                type: 'text',
                text: `No se pudo eliminar a la Lista: ${error.message}`
              }
            ]
        };
    } 
  }
);

server.tool(
  'get-todoListsNames',
  'Tool para obtener todos los nombres de las Listas existentes',
  {}, 
  async () => {
    try {
      //llamada a api
      const obtenerNomListasResp = await fetch('http://localhost:3000/api/todolists', {
        method: 'GET'
      });

      // fallar si respuesta no es valida
      if (!obtenerNomListasResp.ok) {
        throw new Error(`Error al obtener todos los nombres de las Listas: ${obtenerNomListasResp.statusText}`);
      }

      // extraer y retornar informacion
      const obtenerNomListasData = await obtenerNomListasResp.json();

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(obtenerNomListasData, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `No se pudieron obtener las todoLists: ${(error as Error).message}`
          }
        ]
      };
    }
  }
);

server.tool(
  'add-todoItem-todoList',
  'Agrega un Item a una Lista existente usando el id de la lista',
  {
    idLista: z.number().describe('Id de la Lista a la que se quiere agregar el item'),
    descripcion: z.string().describe('Descripcion del Item que se quiere agregar'),
  },
  async ({ idLista, descripcion }) => {

    try {
      const crearItemListaResp = await fetch(`http://localhost:3000/api/todolists/${idLista}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descripcion: descripcion })
      });
  
      //  fallar si la respuesta no es calida
      if (!crearItemListaResp.ok) {
        throw new Error(`Error al crear el item en la lista`);
      }
  
        // extraer y retornar la informacion
      const crearItemListaData = await crearItemListaResp.json();

      if ("error" in crearItemListaData) {
        return {
          content: [
            {
              type: 'text',
              text: `Error, no existe la lista`
            }
          ]
        }
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(crearItemListaData, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `No se puedo agregar un item a la lista: ${(error as Error).message}`
          }
        ]
      };
    }
  }
);

server.tool(
  'delete-todoItem-todoList', 
  'Tool que permite eliminar un Item de una Lista utilizando el id de la Lista y el id en esa lista del Item',
  {
    idLista: z.number().describe('Es el id de la Lista de la que se quiere eliminar el item'),
    idItem: z.number().describe('Es el id en la lista del item que se quiere eliminar')
  },
  async ({ idLista, idItem}) => {
    try {
      const eliminarItemRes = await fetch(`http://localhost:3000/api/todolists/${idLista}`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ idItem: idItem })
      });
  
      // si la llamada del borrado falla
      if (!eliminarItemRes.ok) {
        throw new Error(`Error al eliminar el item de la lista`);
      }

      const textEliminarItem = await eliminarItemRes.text()
      if (textEliminarItem) {
        const eliminarItemDatos = JSON.parse(textEliminarItem);

        if ("error" in eliminarItemDatos) {
          return {
            content: [
              {
                type: 'text',
                text: `No existe la lista o no existe el item`
              }
            ]
          }
        }
      }

      return {
        content: [
          {
            type:'text',
            text: "Se elimino correctamente el item"
          }
        ]
      };
    } catch (error) {
      return {
          content: [
            {
              type: 'text',
              text: `No se puedo eliminar el item de la Lista: ${(error as Error).message}`
            }
          ]
        };
    }   
  }
);


server.tool(
  'get-todoItems-todoList',
  'Tool que permite obtener toda la informacion de todos los Items de una Lista',
  {
    idLista: z.number().describe('Id de la lista de la cual se quiere obtener los Items'),
  },
  async ({ idLista }) => {
    try {
      const obtenerItemsResp = await fetch(`http://localhost:3000/api/todolists/${idLista}`, {
        method: 'GET'
      });
  
      // fallar si la llamada a la api no retorno resultados correctos
      if (!obtenerItemsResp.ok) {
        throw new Error(`Error obtener los items de la lista con id: ${idLista}`);
      }

      
      // extraer la informacion y retornar 
      const obtenerItemsData = await obtenerItemsResp.json();
      if ("error" in obtenerItemsData) {
        return {
          content: [
            {
              type: 'text',
              text: `No existe una lista con el id ${idLista}`
            }
          ]
        }
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(obtenerItemsData, null, 2)
          }
        ]
      };

    } catch (error) {
      return {
          content: [
            {
              type: 'text',
              text: `No se pudieron obtener los items de la Lista: ${(error as Error).message}`
            }
          ]
        };
    }
  }
);

server.tool(
  'markDone-todoItem',
  'Tool que permite actualizar el estado de finalizacion de un todoItem a finalizado',
  {
    idLista: z.number().describe('Id de la lista donde se encuentra el item al que se le desea marcar como finalizado'),
    idItem: z.number().describe('Id dentro de la lista del item al que se que se desea marcar como finzalidazo'),

  },
  async ({ idLista, idItem }) => {
    try {
      const finalizarItemRes = await fetch(`http://localhost:3000/api/todolists/completion-state/${idLista}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idItem: idItem, state: true }),
      });
  
      // si la llamada a la api falla
      if (!finalizarItemRes.ok) {
        throw new Error(`No se pudo como finalizado al item con id: ${idItem} de la lista con id: ${idLista}`);
      }
  
      // extraer y retornar la informacion
      const finalizarItemData = await finalizarItemRes.json();
  
      if ("error" in finalizarItemData) {
        return {
          content: [
            {
              type: 'text',
              text: `No se pudo finalizar el item con id ${idItem} porque o bien no existe el item, o no existe la lista con id ${idLista}`
            }
          ]
        }
      }
  
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(finalizarItemData, null, 2)
          }
        ]
      }

    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `No se pudo finalizar el item de la Lista: ${(error as Error).message}`
          }
        ]
      };
    }
  }
);

server.tool(
  'markUndone-todoItem',
  'Tool que permite actualizar el estado de finalizacion de un todoItem a no finalizado',
  {
    idLista: z.number().describe('Id de la lista donde se encuentra el item al que se le desea marcar como no finalizado'),
    idItem: z.number().describe('Id dentro de la lista del item al que se que se desea marcar como no finzalidazo'),

  },
  async ({ idLista, idItem }) => {
    try {
      const desfinalizarItemRes = await fetch(`http://localhost:3000/api/todolists/completion-state/${idLista}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idItem: idItem, state: false }),
      });
  
      // si la llamada a la api falla
      if (!desfinalizarItemRes.ok) {
        throw new Error(`No se pudo marcar como no finalizado al item con id: ${idItem} de la lista con id: ${idLista}`);
      }
  
      // extraer y retornar la informacion
      const desfinalizarItemData = await desfinalizarItemRes.json();
  
      if ("error" in desfinalizarItemData) {
        return {
          content: [
            {
              type: 'text',
              text: `No se pudo no finalizar al item con id ${idItem} porque o bien no existe el item, o no existe la lista con id: ${idLista}`
            }
          ]
        }
      }
  
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(desfinalizarItemData, null, 2)
          }
        ]
      }

    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `No se pudo no finalizar el item de la todoList: ${(error as Error).message}`
          }
        ]
      };
    }
  }
);

server.tool(
  'updateDecription-todoItem',
  'Tool que permite actualizar la descripcion de un Item',
  {
    idLista: z.number().describe('Id de la lista donde se encuentra el item al que se le desea cambiar la descripcion'),
    idItem: z.number().describe('Id dentro de la lista del item al que se que se desea cambiar la descripcion'),
    nuevaDescripcion: z.string().describe('Nueva descripcion que tendra el Item')

  },
  async ({ idLista, idItem, nuevaDescripcion }) => {
    try {
      const modificarDescItemRes = await fetch(`http://localhost:3000/api/todolists/description/${idLista}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idItem: idItem, description: nuevaDescripcion }),
      });
  
      // si la llamada a la api falla
      if (!modificarDescItemRes.ok) {
        throw new Error(`No se pudo cambiar la descripcion al item con id: ${idItem} de la lista con id: ${idLista}`);
      }
  
      // extraer y retornar la informacion
      const modificarDescItemData = await modificarDescItemRes.json();
  
      if ("error" in modificarDescItemData) {
        return {
          content: [
            {
              type: 'text',
              text: `No se pudo cambiar la descripcion item con id ${idItem} porque o bien no existe el item, o no existe la lista con id ${idLista}`
            }
          ]
        }
      }
  
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(modificarDescItemData, null, 2)
          }
        ]
      }

    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `No se pudo cambiar la descripcion del item de la Lista: ${(error as Error).message}`
          }
        ]
      };
    }
  }
);


server.tool(
  'changeList-todoItem',
  'Tool que permite cambiar la lista a la que pertenece un todoItem',
  {
    idLista: z.number().describe('Id de la lista a la que pertenece actualmente el item'),
    idNuevaLista: z.number().describe('Id de la nueva lista a la que se desea asignar el todoItem'),
    idItem: z.number().describe('Id dentro de la lista, del item al que se le desea modificar la lista a la que pertenece')
  },
  async ({ idLista, idNuevaLista, idItem}) => {
    try{
      const cambiarItemListRes = await fetch(`http://localhost:3000/api/todolists/list/${idLista}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idNewList: idNuevaLista, idItem: idItem }),
      });
  
      // fallar si la llamada a la api no es valida
      if (!cambiarItemListRes.ok) {
        throw new Error(`No se pudo cambiar el item con id: ${idItem} desde la lista con id ${idLista} a la lista con id ${idNuevaLista}`);
      }

      const cambiarItemListData = await cambiarItemListRes.json();

      if ("error" in cambiarItemListData) {
        return {
          content: [
            {
              type: 'text',
              text: `No se pudo cambiar el item de la lista, o bien porque alguna de las listas no existe o porque el item no existe`
            }
          ]
        }
      }

      return {
        content: [
          {
            type:'text',
            text: "El item de cambio de lista correctamente"
          }
        ]
      };

    } catch (error) {
      return {
              content: [
                {
                  type: 'text',
                  text: `No se pudo cambiar de lista el item: ${(error as Error).message}`
                }
              ]
            };
    }
    
  }
);

server.tool(
  'get-all-todoLists',
  'Tool todas las listas existentes, incluyendo todos los items que pertencen a ellas',
  {}, 
  async () => {
    try {
      //llamada a api
      const obtenerAllListsResp = await fetch('http://localhost:3000/api/todolists/all', {
        method: 'GET'
      });

      // fallar si respuesta no es valida
      if (!obtenerAllListsResp.ok) {
        throw new Error(`Error al obtener todas las Listas: ${obtenerAllListsResp.statusText}`);
      }

      // extraer y retornar informacion
      const obtenerAllListsData = await obtenerAllListsResp.json();

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(obtenerAllListsData, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `No se pudieron obtener todas las todoList: ${(error as Error).message}`
          }
        ]
      };
    }
  }
);


const transport = new StdioServerTransport();
async function main() {
  await server.connect(transport);
}

main();