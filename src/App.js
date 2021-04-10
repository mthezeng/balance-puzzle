import './App.css';
import { Button } from 'reactstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useState } from 'react';

let attemptsRemaining = 3;
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
  const node = document.createElement("LI");
  const textNode = document.createTextNode(message);
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
    if (attemptsRemaining >= 0) {
      attemptsRemaining--;
    }
    let attemptString;
    if (attemptsRemaining === 1) {
      attemptString = "You have 1 weighing remaining.";
    } else if (attemptsRemaining < 0) {
      attemptString = "You have exceeded the amount of times you can use the balance scale."
    } else {
      attemptString = "You have " + attemptsRemaining + " weighings remaining."
    }

    let leftWeight = 0;
    for (let i = 0; i < leftBlocks.length; i++) {
      leftWeight += leftBlocks[i].weight;
    }
    let rightWeight = 0;
    for (let i = 0; i < rightBlocks.length; i++) {
      rightWeight += rightBlocks[i].weight;
    }
    if (leftWeight > rightWeight) {
      updateLog("The left side is heavier than the right side. " + attemptString);
    } else if (rightWeight > leftWeight) {
      updateLog("The right side is heavier than the left side. " + attemptString);
    } else {
      updateLog("The two sides are balanced. " + attemptString);
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

  function startOver() {
    resetAllBlocks();
    badBlock = generateBadBlock();
    reset();
    attemptsRemaining = 3;

    // clear the log
    const logNode = document.getElementById("log");
    while (logNode.lastElementChild) {
      logNode.removeChild(logNode.lastElementChild);
    }
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
        <Button color="secondary" onClick={reset}>Remove Blocks</Button>
        <Button color="warning" onClick={exposeAnswer}>Reveal Block</Button>
        <Button color="danger" onClick={startOver}>Start Over</Button>

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
