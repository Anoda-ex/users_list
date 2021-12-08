let users = {
    1: { name: "Steve", number: "+380980838471" },
    2: { name: "Ann", number: "+380980148582" },
    3: { name: "Aleksandr", number: "+380982394271" },
    4: { name: "Vladislav", number: "+380980928471" },
    5: { name: "Kate", number: "+380980842126" },
}

let editList = [3, 4]
let inputErrors={}
function renderList() {
    if(Object.keys(users).length<1){
        document.querySelector(".users").style.display="none"
        return
    }
    let usersList = document.querySelector(".users__list")
    usersList.innerHTML = null
    Object.entries(users).forEach(([userId, user]) => {
        let entry = document.createElement("li")
        let name, number;
        entry.classList=["users__list-item"]
        if (editList.indexOf(userId) > -1) {
            name = document.createElement("input")
            number = document.createElement("input")
            name.value = user.name
            number.value = user.number
            let saveButton = document.createElement("button")
            let clearButton = document.createElement("button")
            saveButton.innerText = "save"
            clearButton.innerText = "clear"
            saveButton.addEventListener("click", () => {
                if(name.value.length>=2 && number.value.match(/\+\d+/) ){
                    editList.splice(editList.indexOf(userId), 1)
                    changeUsers(userId, { name: name.value, number: number.value })
                    delete inputErrors[userId]
                }else{
                    inputErrors[userId]={}
                    if(name.value.length<2){
                        inputErrors[userId].name=true
                    }
                    if(!number.value.match(/^\+[0-9]+$/) ){
                        inputErrors[userId].number=true
                    }
                    renderList()
                }
            })
            clearButton.addEventListener("click", () => {
                name.value = ""
                number.value = ""
            })
            name.classList=["users__name-edit"]
            number.classList=["users__number-edit"]
            if(inputErrors[userId]?.name){
                name.classList.add("users__name-edit--error")
            }
            if(inputErrors[userId]?.number){
                number.classList.add("users__number-edit--error")
            }
           
            entry.append(name)
            entry.append(number)
            let buttonsWrapper=document.createElement("div")
            buttonsWrapper.classList=["users__buttons-wrapper"]
            saveButton.classList=["users__button-save"]
            clearButton.classList=["users__button-clear"]
            buttonsWrapper.append(saveButton)
            buttonsWrapper.append(clearButton)
            entry.append(buttonsWrapper)
        } else {
            name = document.createElement("div")
            number = document.createElement("div")
            name.innerText = user.name
            number.innerText = user.number
            let editButton = document.createElement("button")
            let deleteButton = document.createElement("button")
            editButton.innerText = "Edit"
            deleteButton.innerText = "Delete"
            editButton.addEventListener("click", () => {
                editList.push(userId)
                renderList()
            })
            deleteButton.addEventListener("click", () => {
                changeUsers(userId)
            })
            name.classList=["users__name-view"]
            number.classList=["users__number-view"]
            entry.append(name)
            entry.append(number)
            let buttonsWrapper=document.createElement("div")
            buttonsWrapper.classList=["users__buttons-wrapper"]
            editButton.classList=["users__button-edit"]
            deleteButton.classList=["users__button-delete"]
            buttonsWrapper.append(editButton)
            buttonsWrapper.append(deleteButton)
            entry.append(buttonsWrapper)
        }
        usersList.append(entry)
    })
}

function changeUsers(id, data) {
    //update
    if (id && data) {
        fetch('https://jsonplaceholder.typicode.com/posts/'+id, {
            method: 'PATCH',
            body: JSON.stringify({
                data:data,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
        .then((response) => response.json())
        .then((json) =>{
            let newUser = data
            users[json.id] = newUser
            renderList()
        });
    }
    //post
    if (!id && data) {
        fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify({
                name: data.name,
                number: data.number
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
        .then((response) => response.json())
        .then((json) => {
            let newUser = json
            delete newUser.id
            users[json.id] = newUser
            renderList()
        });
    }
    //delete
    if (id && !data) {

        fetch('https://jsonplaceholder.typicode.com/posts/1', {
            method: 'DELETE',
        }).then(() => {
            delete users[id]
            renderList()

        })
    }
}

let form = document.querySelector(".form")
let formNameInput = document.querySelector(".form__name-input")
let formNumberInput = document.querySelector(".form__number-input")

form.addEventListener("submit", (event) => {
    event.preventDefault()
    fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify({
            name: formNameInput.value,
            number: formNumberInput.value
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then((response) => response.json())
        .then((json) => {
            let newUser = json
            delete newUser.id
            changeUsers(json.id, newUser)
        });
})

renderList()