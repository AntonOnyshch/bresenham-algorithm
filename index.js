window.bresenhamsAlgorithm = {
    main: HTMLElement,
    scrWidth: 0,
    scrHeight: 0,
    cellsByW: 0,
    cellsByH: 0,
    allCells: 0,
    x0: 0,
    y0: 0,
    x1: 0,
    y1: 0,
    backLayerArray: Array,
    init() {
        this.main = document.getElementById('wrapper');
        this.onresize();
        this.setCoords(0, Math.round(this.cellsByH * 0.7), this.cellsByW, Math.round(this.cellsByH * 0.3));
        this.drawBackLayer();
    },
    onresize() {
        this.scrWidth = document.body.offsetWidth - document.getElementById('header').offsetWidth;
        this.scrHeight = document.body.offsetHeight;
        const cellsByW = this.getCountOfCells(this.scrWidth);
        const cellsByH = this.getCountOfCells(this.scrHeight);

        this.recountOfCells(cellsByW, cellsByH);

        this.cellsByW = cellsByW;
        this.cellsByH = cellsByH;
        this.allCells = cellsByW * cellsByH;
    },
    getCountOfCells(by = 0, cellWidth = 40) {
        const withoutGap = by / cellWidth;
        return Math.floor((by  - (withoutGap - 1)) / cellWidth);
    },
    setCells() {
        for (let i = 0; i < 1; i++) {
            for (let j = 0; j < this.cellsByW; j++) {
                this.main.appendChild(document.createElement("div"));
            }
        }
    },
    recountOfCells(newCountW, newCountH) {
        const allNewCells = newCountW * newCountH;
        if(allNewCells > this.allCells) {
            for (let i = 0; i < allNewCells - this.allCells; i++) {
                this.main.appendChild(document.createElement("div"));
            }
        } else {
            for (let i = 0; i < this.allCells - allNewCells; i++) {
                this.main.removeChild(this.main.children.item(i));
            }
        }
    },
    setCoords(x0, y0, x1, y1) {
        this.x0 = x0;
        this.y0 = y0;
        this.x1 = x1;
        this.y1 = y1;
    },
    drawBackLayer() {
        this.backLayerArray = this.getLine(this.x0, this.y0, this.x1, this.y1);
        let index = 0;
        let el;
        const backgroundColor = 'lightgray';
        for (let i = 0; i < this.backLayerArray.length; i++) {
            index = this.cellsByW * this.backLayerArray[i].y + this.backLayerArray[i].x;
            el = this.main.children[index];
            el.style.backgroundColor = backgroundColor;
            el.setAttribute('data-index', i);
            el.addEventListener('mouseover', this.onElMouseOver.bind(this));
            el.addEventListener('mouseout', this.onElMouseOut.bind(this));
        }
    },
    getLine(x0 = 0, y0 = 0, x1 = 0, y1 = 0) {
        const lineArray = new Array();
        let steep = false;

        //#region Swap Coordinates and set "steep"

        // if the line is steep, we transpose the coordinates
        if (Math.abs(x0 - x1) < Math.abs(y0 - y1)) {
            x0 = x0 ^ y0;
            y0 = x0 ^ y0;
            x0 = x0 ^ y0;
    
            x1 = x1 ^ y1;
            y1 = x1 ^ y1;
            x1 = x1 ^ y1;

            steep = true;
        }
        // make it left-to-right if x0 > x1
        if (x0 > x1) {
            x0 = x0 ^ x1;
            x1 = x0 ^ x1;
            x0 = x0 ^ x1;
    
            y0 = y0 ^ y1;
            y1 = y0 ^ y1;
            y0 = y0 ^ y1;
        }

        //#endregion

        const dx          = x1-x0;
        const dxMulBy2    = dx*2;
        const dy          = y1-y0;
        const derror      = Math.abs(dy)*2;
        const y_direction = y1>y0?1:-1;

        let error = 0;
        let y     = y0;
        let x     = x0;
        
        for (let i = 0; x < x1; x++, i++) {
            if(steep) {
                lineArray.push({x: x, y: y, error: error});
            } else {
                lineArray.push({x: x, y: y, error: error});
            }

            //setting error
            error += derror;
            if(error > dx) {
                y     += y_direction;
                error -= dxMulBy2;
            }
        }

        //Set static information:
        document.getElementById('steep').textContent = steep;
        document.getElementById('dx').textContent = dx;
        document.getElementById('dxMulBy2').textContent = dxMulBy2;
        document.getElementById('dy').textContent = dy;
        document.getElementById('derror').textContent = derror;
        document.getElementById('y_direction').textContent = y_direction;

        

        return lineArray;
    },
    clearLine() {
        let el;
        for (let i = 0; i < this.backLayerArray.length; i++) {
            el = this.main.children[this.cellsByW * this.backLayerArray[i].y + this.backLayerArray[i].x];
            el.style.backgroundColor = 'whitesmoke';
            el.removeAttribute('data-index');
            el.removeEventListener('mosueover', this.onDivHover);
        }
    },
    setNewCoords(x0, y0, x1, y1) {
        this.setCoords(parseInt(x0), parseInt(y0), parseInt(x1), parseInt(y1));
        this.clearLine();
        this.drawBackLayer();
    },
    onElMouseOver(e) {
        const index = parseInt(e.target.getAttribute('data-index'));
        const value = this.backLayerArray[index];
        
        e.target.style.backgroundColor = 'orange';

        document.getElementById('error').textContent = value.error;
        document.getElementById('x').textContent = value.x;
        document.getElementById('y').textContent = value.y;
    },
    onElMouseOut(e) {
        e.target.style.backgroundColor = 'lightgray';
    }
}

window.bresenhamsAlgorithm.init();