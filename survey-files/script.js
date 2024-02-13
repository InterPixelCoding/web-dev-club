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
    console.log(data_arr);
    return data_arr;
}

// Function to set a cookie
function set_cookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Function to get a cookie
function get_cookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function create_pop_up(main_text_content) {
    const pop_up_container = document.createElement("div");
    pop_up_container.classList.add('pop-up-container');
    pop_up_container.classList.add('inactive');
    const main_text = document.createElement("span");
    main_text.textContent = main_text_content;
    main_text.classList.add("main-text");
    const understood = document.createElement("button");
    understood.textContent = 'I understand';

    understood.addEventListener("click", () => {
        pop_up_container.classList.add('inactive');
    })

    pop_up_container.appendChild(main_text);
    pop_up_container.appendChild(understood);
    return pop_up_container;
}

function change_pop_up_text(text) {
    const pop_up_text = document.querySelector('.pop-up-container > span');
    pop_up_text.textContent = text;
}

const pop_up = create_pop_up('Sorry, you can only submit this response once');

document.body.appendChild(pop_up);

submit.addEventListener("click", () => {
    // Check if the submission flag exists
    if (localStorage.getItem('submission_flag') || get_cookie('submission_flag')) {
        pop_up.classList.remove('inactive');
    } else {
        localStorage.setItem('submission_flag', 'true');
        set_cookie('submission_flag', 'true', 1);

        // Continue to submit request
        fetch('https://sheetdb.io/api/v1/uw8piiyloc6lr')
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
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
            .then((data) => {
                change_pop_up_text('Thanks for submitting which days you can do!');
                pop_up.classList.remove('inactive')
                console.log(data)
                }
            );

        });
    }
});





  



