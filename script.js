let doing = [];
let isMobile = false;
let activity = 'all';
let allDoing=[]
const allToDo = document.querySelector('.all-to-do');
const last = document.querySelector('.flex');
let mouseDownHandler = null;
getDoingFromLocalStorage()
init();
window.addEventListener("resize", () => {
  window.location.reload();
});
function init() {
  allToDo.innerHTML = ''
  doing.forEach(item => {
    const blackLine = document.createElement('div');
    blackLine.setAttribute('class', 'black-line');

    const span = document.createElement('span');
    item.do ? span.setAttribute('class', 'delete') : span.classList.remove('delete');

    blackLine.setAttribute('data-content', item.toDo);
    const circle = document.createElement('div');
    item.do ? circle.setAttribute('class', 'purple') : circle.classList.remove('purple');

    circle.classList.add('circle');
    circle.classList.add('pointer');
    circle.addEventListener('click', () => {
      item.do = !item.do
      item.do ? span.setAttribute('class', 'delete') : span.classList.remove('delete');
      item.do ? circle.classList.add('purple') : circle.classList.remove('purple');
      setDoingToLocalStorage()
      lastArea()
    })
    span.innerHTML = item.toDo;
    span.setAttribute('class', 'toDo');
    const trash = document.createElement('div')
    const trashImg = document.createElement('div')
    trash.classList.add('trash')
    trashImg.classList.add('trash-img')
    trashImg.addEventListener('click', () => {
      doing.splice(doing.indexOf(item), 1);
      allToDo.removeChild(blackLine);
      setDoingToLocalStorage();
    })
    blackLine.appendChild(circle)
    blackLine.appendChild(span)
    trash.appendChild(trashImg)
    blackLine.appendChild(trash)
    allToDo.appendChild(blackLine)
  })

  lastArea();
  initDraggable();
}
function addTodo(e) {
  if (e.key === 'Enter') {
    const text = document.querySelector('.text').value
    doing = [...doing, { toDo: text, do: false }]
    init();
    setDoingToLocalStorage();
    document.querySelector('.text').value = ''
  }
}
function lastArea() {

  last.innerHTML = ''
  const left = document.createElement('div');
  left.innerHTML = `${allDoing.filter(item => !item.do).length} items left`;
  const filter = document.createElement('div');
  filter.setAttribute('class', 'filter');
  const all = document.createElement('span');
  all.innerHTML = 'All';
  all.addEventListener('click', () => {
    activity = 'all'
    getDoingFromLocalStorage()
    init();
  })
  const active = document.createElement('span');
  active.innerHTML = 'Active';
  active.addEventListener('click', () => {
    activity = 'active';
    getDoingFromLocalStorage();
    doing = doing.filter(item => !item.do);
    init();
  })
  const completed = document.createElement('span')
  completed.addEventListener('click', () => {
    getDoingFromLocalStorage()
    doing = doing.filter(item => !!item.do)
    activity = 'completed';
    init();
  })
  completed.innerHTML = 'Completed';
  const clearCompleted = document.createElement('span');

  clearCompleted.innerHTML = 'Clear Completed';
  clearCompleted.addEventListener('click', () => {
    doing.filter(item => !!item.do).forEach(item => {
      doing.splice(doing.indexOf(item), 1);
      const clear = document.querySelector(`div[data-content="${item.toDo}"]`);
      allToDo.removeChild(clear);
      setDoingToLocalStorage()
    })
  })
  switch (activity) {
    case 'all': 4
      all.classList.add('active')
      break;
    case 'completed':
      completed.classList.add('active')
      break;
    case 'active':
      active.classList.add('active');
      break;
    default:
      break;
  }
  filter.appendChild(all);
  filter.appendChild(active);
  filter.appendChild(completed);
  if (window.innerWidth < 400) {
    isMobile = true
    const blackLine = document.createElement('div')
    blackLine.classList.add('black-line')
    last.classList.remove('flex')
    filter.classList.add('black-line')
    blackLine.appendChild(left);
    blackLine.appendChild(clearCompleted);
    last.appendChild(blackLine);
    last.appendChild(filter);

  }
  else {
    isMobile = false;
    last.appendChild(left);
    last.appendChild(filter);
    last.appendChild(clearCompleted);
  }

}
// Query the table
document.addEventListener('DOMContentLoaded', function () {
  const table = document.querySelector('.all-to-do');

  let draggingEle;
  let draggingRowIndex;
  let placeholder;
  let list;
  let isDraggingStarted = false;

  // The current position of mouse relative to the dragging element
  let x = 0;
  let y = 0;

  // Swap two nodes
  const swap = function (nodeA, nodeB) {
    const parentA = nodeA.parentNode;
    const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;

    // Move `nodeA` to before the `nodeB`
    nodeB.parentNode.insertBefore(nodeA, nodeB);

    // Move `nodeB` to before the sibling of `nodeA`
    parentA.insertBefore(nodeB, siblingA);
  };

  // Check if `nodeA` is above `nodeB`
  const isAbove = function (nodeA, nodeB) {
    // Get the bounding rectangle of nodes
    const rectA = nodeA.getBoundingClientRect();
    const rectB = nodeB.getBoundingClientRect();

    return rectA.top + rectA.height / 2 < rectB.top + rectB.height / 2;
  };

  const cloneTable = function () {
    const rect = table.getBoundingClientRect();
    const width = parseInt(window.getComputedStyle(table).width);

    list = document.createElement('div');
    list.classList.add('clone-list');
    list.style.position = 'absolute';
    list.style.left = `${rect.left}px`;
    list.style.top = `${rect.top}px`;
    table.parentNode.insertBefore(list, table);

    // Hide the original table
    table.style.visibility = 'hidden';

    table.querySelectorAll('.black-line').forEach(function (row) {
      // Create a new table from given row
      const item = document.createElement('div');
      item.classList.add('draggable');

      const newTable = document.createElement('table');
      newTable.setAttribute('class', 'clone-table');
      newTable.style.width = `${width}px`;

      const newRow = document.createElement('div');
      newRow.classList.add('black-line')
      const cells = [].slice.call(row.children);
      cells.forEach(function (cell) {
        const newCell = cell.cloneNode(true);
        newCell.style.width = `${parseInt(window.getComputedStyle(cell).width)}px`;
        newRow.appendChild(newCell);
      });

      newTable.appendChild(newRow);
      item.appendChild(newTable);
      list.appendChild(item);
    });
  };

  mouseDownHandler = function (e) {
    // Get the original row
    const originalRow = e.target.parentNode;
    draggingRowIndex = [].slice.call(table.querySelectorAll('.black-line')).indexOf(originalRow);

    // Determine the mouse position
    if (isMobile) {
      var touchLocation = e.targetTouches[0];
      x = touchLocation.clientX;
      y = touchLocation.clientY;
    }
    else {
      x = e.clientX;
      y = e.clientY;

    }

    // Attach the listeners to `document`
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('touchmove', mouseMoveHandler);

    document.addEventListener('mouseup', mouseUpHandler);
    document.addEventListener('touchend', mouseUpHandler);
  }

  const mouseMoveHandler = function (e) {
    if (!isDraggingStarted) {
      isDraggingStarted = true;

      cloneTable();

      draggingEle = [].slice.call(list.children)[draggingRowIndex];
      draggingEle.classList.add('dragging');

      // Let the placeholder take the height of dragging element
      // So the next element won't move up
      placeholder = document.createElement('div');
      placeholder.classList.add('placeholder');
      draggingEle.parentNode.insertBefore(placeholder, draggingEle.nextSibling);
      placeholder.style.height = `${draggingEle.offsetHeight}px`;
    }

    if (isMobile) {
      var touchLocation = e.targetTouches[0];
      draggingEle.style.top = `${draggingEle.offsetTop + touchLocation.pageY - y}px`;
      draggingEle.style.left = `${draggingEle.offsetLeft + touchLocation.pageX - x}px`;
      x = touchLocation.clientX;
      y = touchLocation.clientY;
    }
    else {
      // Reassign the position of mouse

      draggingEle.style.top = `${draggingEle.offsetTop + e.clientY - y}px`;
      draggingEle.style.left = `${draggingEle.offsetLeft + e.clientX - x}px`;
      x = e.clientX;
      y = e.clientY;
    }
    // Set position for dragging element
    draggingEle.style.position = 'absolute';


    // The current order
    // prevEle
    // draggingEle
    // placeholder
    // nextEle
    const prevEle = draggingEle.previousElementSibling;
    const nextEle = placeholder.nextElementSibling;
    // The dragging element is above the previous element
    // User moves the dragging element to the top
    // We don't allow to drop above the header
    // (which doesn't have `previousElementSibling`)
    if (prevEle && prevEle.previousElementSibling && isAbove(draggingEle, prevEle)) {
      // The current order    -> The new order
      // prevEle              -> placeholder
      // draggingEle          -> draggingEle
      // placeholder          -> prevEle
      swap(placeholder, draggingEle);
      swap(placeholder, prevEle);

      return;
    }

    // The dragging element is below the next element
    // User moves the dragging element to the bottom
    if (nextEle && isAbove(nextEle, draggingEle)) {
      // The current order    -> The new order
      // draggingEle          -> nextEle
      // placeholder          -> placeholder
      // nextEle              -> draggingEle
      swap(nextEle, placeholder);
      swap(nextEle, draggingEle);
    }
  };


  const mouseUpHandler = function () {
    // Remove the placeholder
    placeholder && placeholder.parentNode && placeholder.parentNode.removeChild(placeholder);

    draggingEle.classList.remove('dragging');
    draggingEle.style.removeProperty('top');
    draggingEle.style.removeProperty('left');
    draggingEle.style.removeProperty('position');

    // Get the end index
    const endRowIndex = [].slice.call(list.children).indexOf(draggingEle);

    isDraggingStarted = false;

    // Remove the `list` element
    list.parentNode.removeChild(list);

    // Move the dragged row to `endRowIndex`
    let rows = [].slice.call(table.querySelectorAll('.black-line'));
    draggingRowIndex > endRowIndex
      ? rows[endRowIndex].parentNode.insertBefore(rows[draggingRowIndex], rows[endRowIndex])
      : rows[endRowIndex].parentNode.insertBefore(
        rows[draggingRowIndex],
        rows[endRowIndex].nextSibling
      );


    // Bring back the table
    table.style.removeProperty('visibility');

    // Remove the handlers of `mousemove` and `mouseup`
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
    document.removeEventListener('touchmove', mouseMoveHandler);
    document.removeEventListener('touchend', mouseUpHandler);
    const item = doing[draggingRowIndex];
    doing.splice(draggingRowIndex, 1);
    doing.splice(endRowIndex, 0, item);
    setDoingToLocalStorage();
  };
  table.querySelectorAll('.black-line').forEach(function (row, index) {
    // Ignore the header
    // We don't want user to change the order of header
    if (index === 0) {
      return;
    }
    initDraggable();

  });
});

function initDraggable() {
  document.querySelectorAll('.toDo').forEach(element => {
    element.classList.add('draggable');
    element.addEventListener('mousedown', mouseDownHandler);
    element.addEventListener('touchstart', mouseDownHandler);
  });
}

function getDoingFromLocalStorage() {
  let storage = localStorage.getItem('toDo')
  if (storage) {
    doing = JSON.parse(storage)
    allDoing=doing;
  }
}
function setDoingToLocalStorage() {
  if (doing) {
    localStorage.setItem('toDo', JSON.stringify(doing))

  }
}
function dark() {
  const dark = document.querySelector('.dark')
  const body = document.querySelector('body');
  dark ? body.classList.remove('dark') : body.setAttribute('class', 'dark');
}

