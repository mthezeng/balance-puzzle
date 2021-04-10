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
  const [leftBlocks, updateLeftBlocks] = useState([]);
  const [rightBlocks, updateRightBlocks] = useState([]);

  const id2List = {
    'blocks': blocks,
    'leftBlocks': leftBlocks,
    'rightBlocks': rightBlocks
  };

  const id2Update = {
    'blocks': updateBlocks,
    'leftBlocks': updateLeftBlocks,
    'rightBlocks': updateRightBlocks
  };

  function reorder(list, startIndex, endIndex) {
    const items = Array.from(list);
    const [reorderedItem] = items.splice(startIndex, 1);
    items.splice(endIndex, 0, reorderedItem);
    return items;
  }

  function handleOnDragEnd(result) {
    const { source, destination } = result;
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const result = reorder(id2List[source.droppableId], source.index, destination.index);
      id2Update[source.droppableId](result);
    } else {
      const result = move(id2List[source.droppableId], id2List[destination.droppableId], source, destination);
      id2Update[source.droppableId](result[source.droppableId]);
      id2Update[destination.droppableId](result[destination.droppableId]);
    }
  }

  function move(source, destination, droppableSource, droppableDestination) {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
  }

  return (
    <div className="App">
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="leftBlocks" direction="horizontal">
          {(provided) => (
            <ul className="blocks" {...provided.droppableProps} ref={provided.innerRef}>
            {leftBlocks.map(({id, name}, index) => {
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
        <Droppable droppableId="rightBlocks" direction="horizontal">
          {(provided) => (
            <ul className="blocks" {...provided.droppableProps} ref={provided.innerRef}>
            {rightBlocks.map(({id, name}, index) => {
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
