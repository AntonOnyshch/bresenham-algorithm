let gap = 1.2;
let cellSize = 40;
let resolutionWidth = 0;
let resolutionHeight = 0;

let x1 = -1;
let y1 = -1;
let x2 = -1;
let y2 = -1;

const wrapper = document.getElementById('wrapper');

function init() {
    initGrid();
    new ResizeObserver((e) => e.forEach(() => initGrid())).observe(wrapper);
}

function initGrid() {

    wrapper.style.gap = `${gap}px`;
    wrapper.replaceChildren();

    const resWidth = Math.floor(wrapper.offsetWidth / (40 + gap));
    const resHeight = Math.floor(wrapper.offsetHeight / (40 + gap));

    if(x1 === -1 || resWidth !== resolutionWidth || resHeight !== resolutionHeight) {
        x1 = 0;
        y1 = resHeight - 1;
        x2 = resWidth - 1;
        y2 = 0;
    }

    resolutionWidth = resWidth;
    resolutionHeight = resHeight;

    const x1Input = document.getElementById('x1Input');
    const y1Input = document.getElementById('y1Input');
    const x2Input = document.getElementById('x2Input');
    const y2Input = document.getElementById('y2Input');

    x1Input.max = resolutionWidth - 1;
    x1Input.setAttribute('value', x1);
    y1Input.max = resolutionHeight - 1;
    y1Input.setAttribute('value', y1);

    x2Input.max = resolutionWidth - 1;
    x2Input.setAttribute('value', x2);
    y2Input.max = resolutionHeight - 1;
    y2Input.setAttribute('value', y2);

    wrapper.style.gridTemplateColumns = `repeat(${resolutionWidth}, ${cellSize}px)`;
    wrapper.style.gridTemplateRows = `repeat(${resolutionHeight}, ${cellSize}px)`;

    for (let i = 0; i < resolutionWidth * resolutionHeight; i++) {
        const div = document.createElement("div");
        div.setAttribute('data-index', i);
        wrapper.appendChild(div);
    }

    
    
    drawLine(x1, y1, x2, y2);;
}

function drawLine(x1, y1, x2, y2) {

    let steep = false;

    // if the line is steep, we transpose the coordinates
    if (Math.abs(x1 - x2) < Math.abs(y1 - y2)) {
        x1 = x1 ^ y1;
        y1 = x1 ^ y1;
        x1 = x1 ^ y1;
        x2 = x2 ^ y2;
        y2 = x2 ^ y2;
        x2 = x2 ^ y2;

        steep = true;
    }
    // make it left-to-right if x1 > x2
    if (x1 > x2) {
        x1 = x1 ^ x2;
        x2 = x1 ^ x2;
        x1 = x1 ^ x2;
        y1 = y1 ^ y2;
        y2 = y1 ^ y2;
        y1 = y1 ^ y2;
    }

    let childrenIndex = 0;
    const dx = x2-x1;
    const dx2 = dx + dx;
    const dy = y2-y1;
    const derror = Math.abs(dy);
    let error = 0;
    let y = y1;
    const yDirection = y2 > y1 ? 1 : -1;
    
    if(steep) {
        for (let x=x1; x<=x2; x++) {

            error += derror;
            if (error > dx) {
                y += yDirection;
                error -= dx;
            }

            childrenIndex = (x * resolutionWidth) + y;
            
            wrapper.children[childrenIndex].style.backgroundColor = 'lightgray';

            setHandlers(wrapper.children[childrenIndex]);
            setDynamicInfo(wrapper.children[childrenIndex], y, x, error);
    

        }
    } else {
        for (let x=x1; x<=x2; x++) {

            error += derror;
            if (error > dx) {
                y += yDirection;
                error -= dx;
            }

            childrenIndex = (y * resolutionWidth) + x;

            wrapper.children[childrenIndex].style.backgroundColor = 'lightgray';

            setHandlers(wrapper.children[childrenIndex]);
            setDynamicInfo(wrapper.children[childrenIndex], x, y, error);
    

        }
    }

    setStaticInfo(steep, dx, dy, yDirection);
}

/**
 * 
 * @param {HTMLDivElement} cell 
 */
function setHandlers(cell) {
    cell.onmouseover = e => {
        e.currentTarget.style.backgroundColor = 'orange';
        document.getElementById('error').textContent = e.currentTarget.getAttribute('data-error');
        document.getElementById('x').textContent = e.currentTarget.getAttribute('data-x');
        document.getElementById('y').textContent = e.currentTarget.getAttribute('data-y');
    }

    cell.onmouseleave = e => {
        e.currentTarget.style.backgroundColor = 'lightgray';
    }
}

/**
 * 
 * @param {HTMLDivElement} cell 
 * @param {number} x 
 * @param {number} y 
 * @param {number} error 
 */
function setDynamicInfo(cell, x, y, error) {

    cell.style.backgroundColor = 'lightgray';
    cell.setAttribute('data-error', error.toPrecision(3));
    cell.setAttribute('data-x', x + 1);
    cell.setAttribute('data-y', y + 1);
}

/**
 * 
 * @param {boolean} steep 
 * @param {number} dX 
 * @param {number} dY 
 * @param {number} yDirection 
 */
function setStaticInfo(steep, dX, dY, yDirection) {
    document.getElementById('steep').textContent = steep;
    document.getElementById('dx').textContent = dX;
    document.getElementById('dy').textContent = dY;
    document.getElementById('y_direction').textContent = yDirection;
}

document.getElementById('x1Input').oninput = e => {
    x1 = +e.currentTarget.value;
    initGrid();
}

document.getElementById('y1Input').oninput = e => {
    y1 = +e.currentTarget.value;
    initGrid();
}

document.getElementById('x2Input').oninput = e => {
    x2 = +e.currentTarget.value;
    initGrid();
}

document.getElementById('y2Input').oninput = e => {
    y2 = +e.currentTarget.value;
    initGrid();
}

init();