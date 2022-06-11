function SemiOpenInterval(lower, upper) {
    this.lower = lower;
    this.upper = upper;
}


const wallCell = -1;
const emptyCell = 0;
const rectangleCell = 1;


function largest_rectangle_in_histogram(histogram_heights) {
    histogram_heights = histogram_heights.concat(-1);  // sentinel value
    let max_rectangle_size = 0;
    let interval = new SemiOpenInterval(0, 0);

    let stack = new Array(0);
    for (let i = 0; i < histogram_heights.length; i++) {
        let index = i;
        while (true) {
            if (stack.length == 0 || stack[stack.length - 1][0] <= histogram_heights[i]) {
                stack.push([histogram_heights[i], index])
                break;
            } else {
                let [height, leftmost] = stack.pop();
                let rectangle_size = height * (i - leftmost)
                if (rectangle_size >= max_rectangle_size) {
                    max_rectangle_size = rectangle_size;
                    interval = new SemiOpenInterval(leftmost, i);
                }
                index = leftmost;
            }
        }
    }
    return [max_rectangle_size, interval];
}


function largest_rectangle_in_grid() {
    let height = innerGrid.length;
    let width = innerGrid[0].length;
    let histograms = new Array(height);

    for (let i = 0; i < height; i++) {
        histograms[i] = new Array(width).fill(0);
    }
    for (let j = 0; j < width; j++) {
        if (innerGrid[0][j] != wallCell) {
            histograms[0][j] = 1;
        }
    }
    for (let i = 1; i < height; i++) {
        for (let j = 0; j < width; j++) {
            if (innerGrid[i][j] != wallCell) {
                histograms[i][j] = histograms[i - 1][j] + 1;
            }
        }
    }

    let max_rectangle_size = 0;
    let horizontal_interval = new SemiOpenInterval(0, 0);
    let vertical_interval = new SemiOpenInterval(0, 0);

    for (let i = 0; i < height; i++) {
        let [rectangle_size, interval] = largest_rectangle_in_histogram(histograms[i])
        if (rectangle_size > max_rectangle_size) {
            max_rectangle_size = rectangle_size;
            horizontal_interval = interval;
            vertical_interval = new SemiOpenInterval(i + 1 - rectangle_size / (horizontal_interval.upper - horizontal_interval.lower), i + 1);
        }
    }
    return [max_rectangle_size, vertical_interval, horizontal_interval];
}


function updateTable(){
    const table = document.createElement("table");
    table.id = "grid";
    
    for (let i = 0; i < innerGrid.length; i++){
        let row = table.insertRow();
        for(let j = 0; j < innerGrid[0].length; j++){
            let cell = row.insertCell();

            switch (innerGrid[i][j]) {
                case wallCell:
                    cell.style.backgroundColor = "#000000";
                    break;
                case emptyCell:
                    cell.style.backgroundColor = "#FFFFFF";
                    break;
                case rectangleCell:
                    cell.style.backgroundColor = "#9DCEFF";
                    break;
            }

            cell.addEventListener("click", () => {
                updateInnerGrid(i, j)
                updateTable()
            });
        }
    }

    if (document.getElementById("grid") !== null) {
        document.getElementById("grid").remove();
    }
    document.getElementById("table").appendChild(table);
}


const clearAllButton = document.querySelector("#clearAll");
const selectRandomButton = document.querySelector("#selectRandom");


clearAllButton.addEventListener('click', () => {
    clearAllInnerGrid();
    updateTable();
});


selectRandomButton.addEventListener('click', () => {
    selectRandomInnerGrid();
    updateTable();
});


function clearAllInnerGrid() {
    for (let i = 0; i < innerGrid.length; i++) {
        for (let j = 0; j < innerGrid[0].length; j++) {
            innerGrid[i][j] = emptyCell;
        }
    }
}


function selectRandomInnerGrid() {
    for (let i = 0; i < innerGrid.length; i++) {
        for (let j = 0; j < innerGrid[0].length; j++) {
            if (Math.random() < 0.15) {
                innerGrid[i][j] = wallCell;
            } else {
                innerGrid[i][j] = emptyCell;
            }
        }
    }
    let [, vertical_interval, horizontal_interval] = largest_rectangle_in_grid();
    for (let i = vertical_interval.lower; i < vertical_interval.upper; i++) {
        for (let j = horizontal_interval.lower; j < horizontal_interval.upper; j++) {
            innerGrid[i][j] = rectangleCell;
        }
    }
}


function updateInnerGrid(i2, j2) {
    if (innerGrid[i2][j2] == wallCell) {
        innerGrid[i2][j2] = emptyCell;
    } else {
        innerGrid[i2][j2] = wallCell;
    }
    for (let i = 0; i < innerGrid.length; i++) {
        for (let j = 0; j < innerGrid[0].length; j++) {
            if (innerGrid[i][j] == rectangleCell) {
                innerGrid[i][j] = emptyCell;
            }
        }
    }
    let [, vertical_interval, horizontal_interval] = largest_rectangle_in_grid();
    for (let i = vertical_interval.lower; i < vertical_interval.upper; i++) {
        for (let j = horizontal_interval.lower; j < horizontal_interval.upper; j++) {
            innerGrid[i][j] = rectangleCell;
        }
    }
}


let innerGrid = new Array(10);
for (let i = 0; i < innerGrid.length; i++) {
    innerGrid[i] = new Array(10).fill(emptyCell);
}
updateTable(innerGrid, "table");