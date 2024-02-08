const table = document.querySelector('.wrapper > table');
const cells = table.querySelectorAll('tr > td > button');
const submit = document.querySelector('.wrapper > .submit');

let data = [];

cells.forEach(cell => {
    cell.addEventListener("click", () => {
        cell.querySelector('.checkmark').classList.toggle('hidden');
    })
})

// Async function to fetch data from Google Sheets API
function fetch_data(api_key, spreadsheet_id, [column, row]) {
    return new Promise((resolve, reject) => {
        const endpoint = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheet_id}/values/${column}${row}?key=${api_key}`;
        fetch(endpoint)
            .then(response => response.json())
            .then(data => {
                const current_value = parseInt(data.values[0]);
                resolve(current_value); 
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                reject(error); 
            });
    });
}

function update_data(api_key, spreadsheet_id, [column, row], new_value) {
    return new Promise((resolve, reject) => {
        const endpoint = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheet_id}/values/${column}${row}?valueInputOption=USER_ENTERED&key=${api_key}`;
        const data = {
            values: [[new_value]]
        };

        fetch(endpoint, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.ok) {
                resolve();
            } else {
                response.json().then(error => {
                    reject(error);
                });
            }
        })
        .catch(error => {
            console.error("Error updating data:", error);
            reject(error);
        });
    });
}

const API_KEY = "AIzaSyD4U5TnyKgo_0UNrUfbMZao4C4Q0HHJsXw";
const SPREADSHEET_ID = "1CLDEyGRnDnwPatNtwe7qLEyjXluG8lvpXENgetWOUB0";

const letter_range = ['B', 'C', 'D', 'E', 'F']
const day_range = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
const time_range = ['lunchtime', 'afterschool']
let data_arr = [
    {lunchtime: [
        {monday: 0},
        {tuesday: 0},
        {wednesday: 0},
        {thursday: 0},
        {friday: 0},
    ]},
    {afterschool: [
        {monday: 0},
        {tuesday: 0},
        {wednesday: 0},
        {thursday: 0},
        {friday: 0},
    ]}
]

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





