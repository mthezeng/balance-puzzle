import './App.css';
import { Button } from 'reactstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useState } from 'react';

let allBlocks = [];
for (let i = 1; i <= 12; i++) {
  allBlocks.push({
    id: 'block' + i,
    name: 'Block ' + i,
    weight: 5
  });
}

function resetAllBlocks() {
  for (let i = 0; i < allBlocks.length; i++) {
    allBlocks[i].weight = 5;
  }
}

function generateBadBlock() {
  resetAllBlocks();
  const badBlockId = Math.floor(Math.random() * 12);
  if (Math.random() < 0.5) {
    allBlocks[badBlockId].weight = 0;
  } else {
    allBlocks[badBlockId].weight = 10;
  }
  return allBlocks[badBlockId].name;
}

let badBlock = generateBadBlock();

function updateLog(message) {
  let node = document.createElement("LI");
  let textNode = document.createTextNode(message);
  node.appendChild(textNode);
  document.getElementById("log").appendChild(node);
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

  function weigh() {
    let leftWeight = 0;
    for (let i = 0; i < leftBlocks.length; i++) {
      leftWeight += leftBlocks[i].weight;
    }
    let rightWeight = 0;
    for (let i = 0; i < rightBlocks.length; i++) {
      rightWeight += rightBlocks[i].weight;
    }
    if (leftWeight > rightWeight) {
      updateLog("The left side is heavier than the right side.");
    } else if (rightWeight > leftWeight) {
      updateLog("The right side is heavier than the left side.");
    } else {
      updateLog("The two sides are balanced.")
    }
  }

  function reset() {
    updateBlocks(allBlocks);
    updateLeftBlocks([]);
    updateRightBlocks([]);
  }

  function exposeAnswer() {
    updateLog("The block with a different weight is " + badBlock + ".");
  }

  return (
    <div className="App">
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <div className="balanceScale">
          <Droppable droppableId="leftBlocks" direction="horizontal">
            {(provided) => (
              <ul className="scaleBlocks" {...provided.droppableProps} ref={provided.innerRef}>
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
              <ul className="scaleBlocks" {...provided.droppableProps} ref={provided.innerRef}>
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
        </div>

        <Button color="primary" onClick={weigh}>Weigh</Button>
        <Button color="secondary" onClick={reset}>Reset</Button>
        <Button color="warning" onClick={exposeAnswer}>Solution</Button>

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
