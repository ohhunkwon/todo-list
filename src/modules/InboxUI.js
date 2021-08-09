import Task from './Task'
import Project from './Project'
import ProjectsUI from './ProjectsUI'

export default class InboxTab {
    static defaultProject = new Project('default')

    static initializeInboxTab() {

        InboxTab.createForm()
        InboxTab.formPopUp()
        InboxTab.submitToInbox()
        InboxTab.cancelForm()
    }

    static createForm() {
        const form = document.createElement('form')
        const inbox = document.getElementById('inbox')
        form.innerHTML = `
                <form action="#">
                    <input type="text" id="task-description" name="description" placeholder="task" />
                    <input type="date" id="dueDate" name="dueDate" placeholder="due date" />
                    <button type="submit" id="inbox-submit-btn">Submit</button>
                    <button type="button" id="inbox-cancel-btn">Cancel</button>
                </form>
            `
        form.classList.add('hidden')
        form.id = 'inbox-form'
        inbox.appendChild(form)
    }

    static formPopUp() {
        const addTaskBtn = document.getElementById('add-task')
        const form = document.getElementById('inbox-form')

        addTaskBtn.addEventListener('click', () => {
            addTaskBtn.classList.add('hidden')
            form.classList.remove('hidden')
        })
    }

    static submitToInbox() {
        const submitBtn = document.getElementById('inbox-submit-btn')
        const addTaskBtn = document.getElementById('add-task')
        const description = document.getElementById('task-description')
        const dueDate = document.getElementById('dueDate')
        const form = document.getElementById('inbox-form')
        const inbox = document.getElementById('inbox')

        submitBtn.addEventListener('click', (e) => {
            e.preventDefault()

            addTaskBtn.classList.remove('hidden')

            if (description.value === "" || dueDate.value === "") {
                InboxTab.checkFields(addTaskBtn, inbox)
            }
            else if (InboxTab.defaultProject.getTasks().some(task => task.getDescription() === description.value)) {
                alert("This todo already exists!")
                description.value = ""
                dueDate.value = ""
                form.classList.add('hidden')
            } 
            else {
                const task = new Task(description.value, dueDate.value)
                InboxTab.defaultProject.addTask(task)
                const taskDOMElement = document.createElement('div')
                taskDOMElement.id = task.getID()
                const isDone = `${task.getDescription()} ${task.getCompleted()}`

                taskDOMElement.innerHTML = `<input type="checkbox" id="${isDone}">
                                            <p>${task.getDescription()} | due: ${task.getDate()}</p>
                                            <button id='del-${task.getID()}'>delete</button>`

                
                const nodes = taskDOMElement.childNodes

                for (let i = 0; i < nodes.length; i++) {
                    if (nodes[i].style) {
                        nodes[i].style.setProperty('display', 'inline')
                    }
                }
                
                inbox.insertBefore(taskDOMElement, addTaskBtn)
                description.value = ""
                dueDate.value = ""
                form.classList.add('hidden')

                InboxTab.addToToday(task)
                InboxTab.addToWeek(task)
                InboxTab.deleteTask(task.getID())
                InboxTab.checkDone(isDone)
            }
        })
    }

    static addToToday(task) {
        const collection = ProjectsUI.collection
        const tabContent = document.getElementById('today-content')

        const taskClone = document.createElement('div')
        const isDone = `${task.getDescription()} ${task.getCompleted()}-clone`
        taskClone.id = `${task.getID()}-clone`
        taskClone.innerHTML =   `<input type="checkbox" id="${isDone}">
                                <p>${task.getDescription()} | due: ${task.getDate()}</p>
                                <button id='del-${task.getID()}-clone'>delete</button>`
        
        const nodes = taskClone.childNodes

        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].style) {
                nodes[i].style.setProperty('display', 'inline')
            }
        }

        collection.forEach(project => {
            const tasks = project.getTasks()
            tasks.forEach(task => {
                const day = Number(task.dueDate.slice(-2))
                const today = new Date()
                const dayToday = today.getDate()
                if (day === dayToday && !ProjectsUI.todayCollection.includes(task)) {
                    ProjectsUI.todayCollection.push(task)
                    tabContent.appendChild(taskClone)
                }
            })
        })
    }

    static addToWeek(task) {
        const collection = ProjectsUI.collection
        const tabContent = document.getElementById('this-week-content')

        const taskClone = document.createElement('div')
        const isDone = `${task.getDescription()} ${task.getCompleted()}-clone-week`
        taskClone.id = `${task.getID()}-clone-week`
        taskClone.innerHTML =   `<input type="checkbox" id="${isDone}">
                                <p>${task.getDescription()} | due: ${task.getDate()}</p>
                                <button id='del-${task.getID()}-clone-week'>delete</button>`
        
        const nodes = taskClone.childNodes

        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].style) {
                nodes[i].style.setProperty('display', 'inline')
            }
        }

        collection.forEach(project => {
            const tasks = project.getTasks()
            tasks.forEach(task => {
                const day = Number(task.dueDate.slice(-2))
                const today = new Date()
                const dayToday = today.getDate()
                if ((day - dayToday) <= 7 && !ProjectsUI.weekCollection.includes(task)) {
                    ProjectsUI.weekCollection.push(task)
                    tabContent.appendChild(taskClone)
                }
            })
        })
    }

    static checkDone(isDone) {
        const checkbox = document.getElementById(isDone)
        const checkboxClone = document.getElementById(`${isDone}-clone`)
        const checkboxCloneWeek = document.getElementById(`${isDone}-clone-week`)


        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                checkbox.parentElement.childNodes[2].style.setProperty('text-decoration', 'line-through')
                if (checkboxClone) {
                    checkboxClone.checked = true
                    checkboxClone.parentElement.childNodes[2].style.setProperty('text-decoration', 'line-through')
                }
                if (checkboxCloneWeek) {
                    checkboxCloneWeek.checked = true
                    checkboxCloneWeek.parentElement.childNodes[2].style.setProperty('text-decoration', 'line-through')
                }
            } else {
                checkbox.parentElement.childNodes[2].style.setProperty('text-decoration', 'none')
                if (checkboxClone) {
                    checkboxClone.checked = false
                    checkboxClone.parentElement.childNodes[2].style.setProperty('text-decoration', 'none')
                }
                if (checkboxCloneWeek) {
                    checkboxCloneWeek.checked = false
                    checkboxCloneWeek.parentElement.childNodes[2].style.setProperty('text-decoration', 'none')
                }
            }
        })

        if (checkboxClone) {
            checkboxClone.addEventListener('change', () => {
                if (checkboxClone.checked) {
                    checkboxClone.parentElement.childNodes[2].style.setProperty('text-decoration', 'line-through')
                    checkbox.checked = true
                    checkbox.parentElement.childNodes[2].style.setProperty('text-decoration', 'line-through')
                } else {
                    checkboxClone.parentElement.childNodes[2].style.setProperty('text-decoration', 'none')
                    checkbox.checked = false
                    checkbox.parentElement.childNodes[2].style.setProperty('text-decoration', 'none')
                }
            })
        }

        if (checkboxCloneWeek) {
            checkboxCloneWeek.addEventListener('change', () => {
                if (checkboxCloneWeek.checked) {
                    checkboxCloneWeek.parentElement.childNodes[2].style.setProperty('text-decoration', 'line-through')
                    checkbox.checked = true
                    checkbox.parentElement.childNodes[2].style.setProperty('text-decoration', 'line-through')
                    if (checkboxClone) {
                        checkboxClone.checked = true
                        checkboxClone.parentElement.childNodes[2].style.setProperty('text-decoration', 'line-through')
                    }
                } else {
                    checkboxCloneWeek.parentElement.childNodes[2].style.setProperty('text-decoration', 'none')
                    checkbox.checked = false
                    checkbox.parentElement.childNodes[2].style.setProperty('text-decoration', 'none')
                    if (checkboxClone) {
                        checkboxClone.checked = false
                        checkboxClone.parentElement.childNodes[2].style.setProperty('text-decoration', 'none')
                    }
                }
            })
        }
    }

    static deleteTask(id) {
        const btn = document.getElementById(`del-${id}`)
        const btnClone = document.getElementById(`del-${id}-clone`)
        const btnCloneWeek = document.getElementById(`del-${id}-clone-week`)

        btn.addEventListener('click', (e) => {
            e.target.parentElement.remove()
            if (btnClone) {
                btnClone.parentElement.remove()
            }
            if (btnCloneWeek) {
                btnCloneWeek.parentElement.remove()
            }
            InboxTab.defaultProject.getTasks()
                .splice(InboxTab.defaultProject.getTasks()
                    .findIndex(
                        task => task.getID() === id
                    ), 1)
        })
        if (btnClone) {
            btnClone.addEventListener('click', (e) => {
                e.target.parentElement.remove()
                btn.parentElement.remove()
                if (btnCloneWeek) {
                    btnCloneWeek.parentElement.remove()
                }
                InboxTab.defaultProject.getTasks()
                    .splice(InboxTab.defaultProject.getTasks()
                        .findIndex(
                            task => task.getID() === id
                        ), 1)
            })
        }
        if (btnCloneWeek) {
            btnCloneWeek.addEventListener('click', (e) => {
                e.target.parentElement.remove()
                btn.parentElement.remove()
                if (btnClone) {
                    btnClone.parentElement.remove()
                }
                InboxTab.defaultProject.getTasks()
                    .splice(InboxTab.defaultProject.getTasks()
                        .findIndex(
                            task => task.getID() === id
                        ), 1)
            })
        }
    }

    static checkFields(addTaskBtn, inbox) {
        const alertExists = document.querySelector(".empty-alert")

        addTaskBtn.classList.add("hidden")

        if (alertExists) {
            return
        }

        const notifyFields = document.createElement('p')
        notifyFields.textContent = "Please enter the description and due date of the task."
        notifyFields.classList.add('empty-alert')

        inbox.appendChild(notifyFields)

        setTimeout(function () {
            inbox.removeChild(notifyFields)
        }, 2000)
    }

    static cancelForm() {
        const cancelTaskBtn = document.getElementById('inbox-cancel-btn')
        const addTaskBtn = document.getElementById('add-task')
        const form = document.getElementById('inbox-form')

        cancelTaskBtn.addEventListener('click', () => {
            addTaskBtn.classList.remove('hidden')
            form.classList.add('hidden')
        })
    }
}