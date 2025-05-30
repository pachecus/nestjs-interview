// MCP Server
// Juan Manuel Pacheco

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from 'zod'
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Inicialize MCP Server
const server = new McpServer ({
  name: 'Server MCP Crunchloop',
  version: '1.0.0'
})

// Create TodoList Tool
server.tool(
  'create-todoList',
  'Tool that creates a new todoList',
  { 
      todoListName: z.string().describe('Name of the new todoList')
  },
  async ({ todoListName }) => {
      try {
          // API call to create a new todoList
          const createTodoListResp = await fetch('http://localhost:3000/api/todolists', {
              method: 'POST',
              headers: {'Content-Type': 'application/json',},
              body: JSON.stringify({ name: todoListName })
          });

          // API call failed
          if (!createTodoListResp.ok) {
              throw new Error(`Error ${createTodoListResp.status}: ${await createTodoListResp.text()}`);
          }

          // Extract Data
          const createTodoListData = await createTodoListResp.json();

          // If a list with the name 'todoListName' already exists return error
          if('error' in createTodoListData) {
            return {
              content: [
                {
                  type:'text',
                  text: `Error, a todoList with the name "${createTodoListData}" already exists`
                }
              ]
            }
          }

          // If everything went correctly return the new todoList
          return {
              content: [
                  {
                      type: 'text',
                      text: JSON.stringify(createTodoListData, null, 2)
                  }
              ]
          };
      } catch (error) {
        // Handle other errors
          return {
              content: [
                  {
                      type: 'text',
                      text: `Unable to create the todoList: ${error.message}`
                  }
              ]
          };
      }
  }
)

// Change todoList's name Tool
server.tool(
  'changeName-todoList',
  'Tool to change the name of a todoList',
  {
    todoListId: z.number().describe('Id of the todoList whose name should be changed'),
    todoListNewName: z.string().describe('New name for the todoList')
  },
  async ({todoListId, todoListNewName}) => {
    try{
      // API call to change the name of a todoList
      const changeNameTodoListResp = await fetch(`http://localhost:3000/api/todolists/${todoListId}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json',},
        body: JSON.stringify({ name: todoListNewName })
      })

      // API call failed
      if (!changeNameTodoListResp.ok) {
        throw new Error(`Error ${changeNameTodoListResp.status}: ${await changeNameTodoListResp.text()}`);
      }

      // Extract Data
      const changeNameTodoListData = await changeNameTodoListResp.json();
      if('error' in changeNameTodoListData) {
        return {
          content: [
            {
              type:'text',
              text: `Error, a todoList with the id ${todoListId} does not exist`
            }
          ]
        }
      }

      // If everthing went correctly return the updated todoList
      return {
          content: [
              {
                  type: 'text',
                  text: JSON.stringify(changeNameTodoListData, null, 2)
              }
          ]
      };

    }catch(error){
      // Handle other errors
      return {
          content: [
            {
              type: 'text',
              text: `Unable to change the name of the todoList: ${error.message}`
            }
          ]
      };
    }

  }
)

// Delete todoList Tool
server.tool(
  'delete-todoList', 
  'Tool that deletes a todoList, including all the items that belong to it',
  {
    todoListId: z.number().describe('Id of the todoList that wants to be deleted')
  },
  async ({ todoListId }) => {
      try{
        // API call to delete a todoList
        const deleteTodoListResp = await fetch(`http://localhost:3000/api/todolists/${todoListId}`, {
          method: 'DELETE'
        });
      
      // API call failed
      if (!deleteTodoListResp.ok) {
        throw new Error(`Error, the todoList could not be deleted`);
      }
      
      // Extract Data
      const textResp = await deleteTodoListResp.text()
      if (textResp) {
        const deleteTodoListData = JSON.parse(textResp);
        
        // If the todoList does not exist
        if ("error" in deleteTodoListData) {
          return {
            content: [
              {
                type: 'text',
                text: `Error, the todoList that wants to be deleted does not exist`
              }
            ]
          }
        }
      }

      // If everything went correctly return success
      return {
        content: [
          {
            type:'text',
            text: `The todoList was successfully deleted`
          }
        ]
      };
    } catch(error) {
      // Handle other errors
      return {
            content: [
              {
                type: 'text',
                text: `Unable to delete de todoList: ${error.message}`
              }
            ]
        };
    } 
  }
);

// Get a todoList Tool (gets one todoList with all its items)
server.tool(
  'get-a-todoList',
  'Tool to get the information of a todoList',
  {
    todoListId: z.number().describe('Id of the todoList that wants to be retrieved')
  }, 
  async ({ todoListId }) => {
    try {
      // API call to get all the todoLists
      const getTodoListResp = await fetch(`http://localhost:3000/api/todolists/${todoListId}`, {
        method: 'GET'
      });

      // API call failed
      if (!getTodoListResp.ok) {
        throw new Error(`Error when retriveing the todoList: ${getTodoListResp.statusText}`);
      }

      // Extract Data
      console.log("textTodoListResp");

      const textTodoListResp = await getTodoListResp.text()
      console.log(textTodoListResp);
      if (textTodoListResp) {
        const getTodoListData = JSON.parse(textTodoListResp);
        
        // If the todoList does not exist
        if ("error" in getTodoListData) {
          return {
            content: [
              {
                type: 'text',
                text: `Error, the todoList that wants to be retrieved does not exist`
              }
            ]
          }
        }
        
        // If everything went correctly return the todoList
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(getTodoListData)
            }
          ]
        }
      };
    } catch (error) {
      // Handle other errors
      return {
        content: [
          {
            type: 'text',
            text: `Unable to retrieve the todoList: ${(error as Error).message}`
          }
        ]
      };
    }
  }
);


// Get todoLists Tool (gets all the todoLists with all their items)
server.tool(
  'getAll-todoLists',
  'Tool to get all the todoLists, including all their items',
  {}, 
  async () => {
    try {
      // API call to get all the todoLists
      const getTodoListsResp = await fetch('http://localhost:3000/api/todolists', {
        method: 'GET'
      });

      // API call failed
      if (!getTodoListsResp.ok) {
        throw new Error(`Error when retriveing all the todoLists: ${getTodoListsResp.statusText}`);
      }

      // Extract Data
      const getTodoListsData = await getTodoListsResp.json();
      // Return the extracted data, if there are no lists it returns an empty array ([])
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(getTodoListsData, null, 2)
          }
        ]
      };
    } catch (error) {
      // Handle other errors
      return {
        content: [
          {
            type: 'text',
            text: `Unable to retrieve all the todoLists: ${(error as Error).message}`
          }
        ]
      };
    }
  }
);


// Add todoItem to a todoList
server.tool(
  'create-todoItem-todoList',
  'Tool that creates a new todoItem and adds it into a todoList',
  {
    todoListId: z.number().describe('Id of the todoList where the new todoItem has to be added'),
    description: z.string().describe('Description of the new todoItem'),
  },
  async ({ todoListId, description }) => {
    try {
      // API call to create a new todoItem
      const createTodoItemResp = await fetch(`http://localhost:3000/api/todolists/add-todoitem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ todoListId: todoListId, description: description })
      });
  
      // API call failed
      if (!createTodoItemResp.ok) {
        throw new Error(`Error when creating a new todoItem`);
      }
  
      // Extract Data
      const createTodoItemData = await createTodoItemResp.json();
      if ("error" in createTodoItemData) {
        // If the todoList in which the todoItem wants to be added does not exist
        return {
          content: [
            {
              type: 'text',
              text: `Error, the todoList with id ${todoListId} does not exist`
            }
          ]
        }
      }

      // If everything went correctly return the todoItem
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(createTodoItemData, null, 2)
          }
        ]
      };
    } catch (error) {
      // Handle other errors
      return {
        content: [
          {
            type: 'text',
            text: `Unable to create the todoItem: ${(error as Error).message}`
          }
        ]
      };
    }
  }
);

// Delete todoItem from a todoList Tool
server.tool(
  'delete-todoItem-todoList', 
  'Tool that deletes a todoItem from a todoList',
  {
    todoListId: z.number().describe('Id of the todoList that has the todoItem that has to be deleted'),
    todoItemId: z.number().describe('Id of the todoItem within the todoList to which it belongs')
  },
  async ({ todoListId, todoItemId}) => {
    try {
      // API call to delete a todoItem
      const deleteTodoItemRes = await fetch(`http://localhost:3000/api/todolists/delete-todoitem`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ todoListId: todoListId, todoItemId: todoItemId })
      });

      // API call failed
      if (!deleteTodoItemRes.ok) {
        throw new Error(`Error when deleting the todoList`);
      }

      // Extract Data
      const textDeleteItemResp = await deleteTodoItemRes.text()
      if (textDeleteItemResp) {
        const deleteTodoItemData = JSON.parse(textDeleteItemResp);
        // If todoList or todoItem do not exist
        if ("error" in deleteTodoItemData) {
          return {
            content: [
              {
                type: 'text',
                text: `Error, a todoList with id ${todoListId} does not exist or a todoItem with id ${todoItemId} does not exist`
              }
            ]
          }
        }
      }

      // If everything went correctly return success
      return {
        content: [
          {
            type:'text',
            text: "The todoItem was successfully deleted"
          }
        ]
      };
    } catch (error) {
      // Handle other errors
      return {
          content: [
            {
              type: 'text',
              text: `Unable to delete todoItem from todoList: ${(error as Error).message}`
            }
          ]
        };
    }   
  }
);

// Mark todoItem as Completed Tool
server.tool(
  'setCompleted-todoItem',
  'Tool that sets the state of a todoItem to completed',
  {
    todoListId: z.number().describe('Id of the todoList that has the todoItem whose state has to be set to completed'),
    todoItemId: z.number().describe('Id of the todoItem within the todoList whose state has to be set to completed'),

  },
  async ({ todoListId, todoItemId }) => {
    try {
      // API call to set a todoItem as completed
      const setCompletedTodoItemRes = await fetch(`http://localhost:3000/api/todolists/completion-state`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ todoListId: todoListId, todoItemId: todoItemId, state: true }),
      });
  
      // API call failed
      if (!setCompletedTodoItemRes.ok) {
        throw new Error(`Error, could not set todoItem with: ${todoItemId} from todoList with id: ${todoListId} as completed`);
      }
  
      // Extract Data
      const setCompletedTodoItemData = await setCompletedTodoItemRes.json();
      if ("error" in setCompletedTodoItemData) {
        // If todoList or todoItem do not exist
        return {
          content: [
            {
              type: 'text',
              text: `Unable to set as completed todoItem with id ${todoItemId} from todoList with id ${todoListId} because either the todoList or todoItem do not exist`
            }
          ]
        }
      }
  
      // If everything went correctly return the updated todoItem
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(setCompletedTodoItemData, null, 2)
          }
        ]
      }

    } catch (error) {
      // Handle other errors
      return {
        content: [
          {
            type: 'text',
            text: `Unable to set todoItem as completed: ${(error as Error).message}`
          }
        ]
      };
    }
  }
);

server.tool(
  'setIncompleted-todoItem',
  'Tool that sets the state of a todoItem to incompleted',
  {
    todoListId: z.number().describe('Id of the todoList that has the todoItem whose state has to be set to incompleted'),
    todoItemId: z.number().describe('Id of the todoItem within the todoList whose state has to be set to incompleted'),

  },
  async ({ todoListId, todoItemId }) => {
    try {
      // API call to set a todoItem as incompleted
      const setIncompletedTodoItemRes = await fetch(`http://localhost:3000/api/todolists/completion-state`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ todoListId: todoListId, todoItemId: todoItemId, state: false }),
      });
      
      // API call failed
      if (!setIncompletedTodoItemRes.ok) {
        throw new Error(`Error, could not set todoItem with: ${todoItemId} from todoList with id: ${todoListId} as completed`);
      }
  
      // Extract Data
      const setIncompletedTodoItemData = await setIncompletedTodoItemRes.json();
      if ("error" in setIncompletedTodoItemData) {
        // If todoItem or todoList do not exist
        return {
          content: [
            {
              type: 'text',
              text: `Unable to set as incompleted todoItem with id ${todoItemId} from todoList with id ${todoListId} because either the todoList or todoItem do not exist`
            }
          ]
        }
      }
  
      // If everything went correctly return the updated todoItem
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(setIncompletedTodoItemData, null, 2)
          }
        ]
      }

    } catch (error) {
      // Handle other errors
      return {
        content: [
          {
            type: 'text',
            text: `Unable to set todoItem as incompleted: ${(error as Error).message}`
          }
        ]
      };
    }
  }
);

// Change todoItem description Tool
server.tool(
  'changeDecription-todoItem',
  'Tool to change the description of a todoItem',
  {
    todoListId: z.number().describe('Id of the todoList that has the todoItem whose description has to be changed'),
    todoItemId: z.number().describe('Id of the todoItem within the todoList whose description has to be changed'),
    description: z.string().describe('New description of the todoItem')

  },
  async ({ todoListId, todoItemId, description }) => {
    try {
      // API call to change the description of a todoItem
      const updateDescTodoItemRes = await fetch(`http://localhost:3000/api/todolists/update-description`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ todoListId: todoListId, todoItemId: todoItemId, description: description }),
      });

      // API call failed
      if (!updateDescTodoItemRes.ok) {
        throw new Error(`Error, could not change the description of the todoItem with id: ${todoItemId} that belongs to the todoList with id: ${todoListId}`);
      }
  
      // Extract Data
      const updateDescTodoItemData = await updateDescTodoItemRes.json();
      if ("error" in updateDescTodoItemData) {
        // If the todoItem or the todoList do not exist
        return {
          content: [
            {
              type: 'text',
              text: `Unable to change the description of the todoItem with ${todoItemId} either because the todoItem does not exist or a todoList with id ${todoListId} does not exist`
            }
          ]
        }
      }
      
      // If everything went correctly return the updated todoItem
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(updateDescTodoItemData, null, 2)
          }
        ]
      }

    } catch (error) {
      // Handle other errors
      return {
        content: [
          {
            type: 'text',
            text: `Unable to change the description of the todoItem: ${(error as Error).message}`
          }
        ]
      };
    }
  }
);

// Move todoItem from one todoList to another
server.tool(
  'move-todoItem-todoList',
  'Tool to move a todoItem from one todoList to another todoList',
  {
    todoListId: z.number().describe('Id of the todoList to which the todoItem belongs to currently'),
    newTodoListId: z.number().describe('Id of the new todoList to which the todoItem will belong from now on'),
    todoItemId: z.number().describe('Id of the todoItem within the todoList to which it currently belongs')
  },
  async ({ todoListId, newTodoListId, todoItemId}) => {
    try{
      // API call to move a todoItem from one todoList to another
      const moveTodoItemRes = await fetch(`http://localhost:3000/api/todolists/move-item`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ todoListId: todoListId, newTodoListId: newTodoListId, todoItemId: todoItemId }),
      });
  
      // API call failed
      if (!moveTodoItemRes.ok) {
        throw new Error(`Error, could not move todoItem with id ${todoItemId} from todoList with id ${todoListId} to the todoList with id ${newTodoListId}`);
      }

      // Extract Data
      const moveTodoItemListData = await moveTodoItemRes.json();
      if ("error" in moveTodoItemListData) {
        // If either both of the todoLists or the todoItem do not exist
        return {
          content: [
            {
              type: 'text',
              text: `Unable to move the todoItem either because a todoItem with id ${todoItemId} does not exist in the todoList witth id ${todoListId} or because one or both of the todoLists with ids ${todoListId}, ${newTodoListId} do not exist`
            }
          ]
        }
      }

      // If everything went correctly return the upodated todoItem
      return {
        content: [
          {
            type:'text',
            text: JSON.stringify(moveTodoItemListData, null, 2)
          }
        ]
      };

    } catch (error) {
      // Handle other errors
      return {
              content: [
                {
                  type: 'text',
                  text: `Unable to move the todoItem: ${(error as Error).message}`
                }
              ]
            };
    }
    
  }
);

const transport = new StdioServerTransport(); // Standard Input/Ouptut

// Connect server
async function main() {
  await server.connect(transport);
}

main();