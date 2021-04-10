import './App.css';
// import { Button } from 'reactstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {useState} from 'react';

let allBlocks = [];
for (let i = 1; i <= 12; i++) {
  allBlocks.push({
    id: 'block' + i,
    name: 'Block ' + i
  });
}

function App() {
  const [blocks, updateBlocks] = useState(allBlocks);

  function handleOnDragEnd(result) {
    if (!result.destination) return;
    const items = Array.from(blocks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    updateBlocks(items);
  }

  return (
    <div className="App">
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="blocks" direction="horizontal">
          {(provided) => (
            <ul className="blocks" {...provided.droppableProps} ref={provided.innerRef}>
            {blocks.map(({id, name}, index) => {
              return (
                  <Draggable key={id} draggableId={id} index={index}>
                    {(provided) => (
                      <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <p> {name} </p>
                      </li>
                     )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default App;
