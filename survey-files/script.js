const table = document.querySelector('.wrapper > table');
const cells = table.querySelectorAll('tr > td > button');
const submit = document.querySelector('.wrapper > .submit');

cells.forEach(cell => {
    cell.addEventListener("click", () => {
        cell.querySelector('.checkmark').classList.toggle('hidden');
    })
})

const letter_range = ['B', 'C', 'D', 'E', 'F']
const day_range = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
const time_range = ['lunchtime', 'afterschool']

function main() {
    for(let n = 0; n<2; n++) {
        for(let i = 0; i<5; i++) {
            fetch_data(API_KEY, SPREADSHEET_ID, [letter_range[i], n+2])
            .then(data => {
                if(n === 0) {
                    let change_val = data_arr[0].lunchtime;
                    change_val[i] = data;
                } else if (n === 1) {
                    let change_val = data_arr[1].afterschool;
                    change_val[i] = data;
                }
                if(n === 1 && i === 4) {
                    // Here you have the fully updated array
                    submit.addEventListener("click", () => {
                        cells.forEach(cell => {
                            if(cell.querySelector('.checkmark').classList.contains('hidden') == false) {
                                const class_name = String(cell.className).split('-');
                                for(let x = 0; x<2; x++) {
                                    let object = data_arr[x]
                                    let editable_arr = [];
                                    if(x === 0) {
                                        editable_arr = object.lunchtime
                                    } else if(x === 1) {
                                        editable_arr = object.afterschool
                                    }
                                    day_range.forEach(function(day, index) {
                                        if(day === class_name[0] && class_name[1] === time_range[x]) {
                                            editable_arr[index] += 1;
                                        }
                                    })
                                    if(x === 1) {
                                        for(let k = 0; k<2; k++) {
                                            let container = data_arr[k];
                                            let object = null;
                                            if(k === 0) {
                                                object = container.lunchtime
                                            } else if (k === 1) {
                                                object = container.afterschool
                                            }
                                            object.forEach( function(value, index) {
                                                letter = letter_range[index];
                                                update_data(API_KEY, SPREADSHEET_ID, [letter, k+2], value)
                                            })
                                        }
                                    }
                                }
                            }
                        })
                    })
                }
            })
        }
    }
}



function update_data(data_arr) {
    let lunchtime_values = [];
    let afterschool_values = [];
    cells.forEach(function(cell, index) {
        let determiner = cell.querySelector('.checkmark')
        if(index <= 4) {
            if(determiner.classList.contains('hidden') === false) {
                lunchtime_values.push(1)
            } else {
                lunchtime_values.push(0);
            }
        } else {
            if(determiner.classList.contains('hidden') === false) {
                afterschool_values.push(1)
            } else {
                afterschool_values.push(0);
            }
        }
    });

    // Skip the first element in each object
    let lunch_index = 0;
    let after_index = 0;
    for(let i = 0; i < 2; i++) {
        Object.keys(data_arr[i]).forEach((el, index) => {
            if (index !== 0) {
                if (i === 0) {
                    data_arr[i][el] = String(parseInt(data_arr[i][el]) + lunchtime_values[lunch_index]);
                    lunch_index++;
                } else {
                    data_arr[i][el] = String(parseInt(data_arr[i][el]) + afterschool_values[after_index]);
                    after_index++;
                }
            }
    });}
    return data_arr;
}

submit.addEventListener("click", () => {
fetch('https://sheetdb.io/api/v1/uw8piiyloc6lr')
    .then((response) => response.json())
    .then((data) => {
        const new_data = update_data(data);

        fetch('https://sheetdb.io/api/v1/uw8piiyloc6lr/all', {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        
        fetch('https://sheetdb.io/api/v1/uw8piiyloc6lr', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: new_data
            })
        })
        .then((response) => response.json())
        .then((data) => console.log(data));

    });
});



  



