import Task from './Task'
import Project from './Project'
import InboxUI from './InboxUI'

export default class ProjectsTab {
    static collection = []
    static todayCollection = []
    static weekCollection = []

    static initializeProjectsTab() {

        ProjectsTab.createForm()
        ProjectsTab.formPopUp()
        ProjectsTab.submitToProjects()
        ProjectsTab.cancelSubmission()
        ProjectsTab.addDefaultProject()

    }

    static renderTasks(task, project, projectDiv, description, dueDate, form, addTaskBtn) {
        const taskDOMElement = document.createElement('p')
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

        projectDiv.insertBefore(taskDOMElement, addTaskBtn)
        description.value = ""
        dueDate.value = ""
        form.classList.add('hidden')

        ProjectsTab.addToToday(task)
        ProjectsTab.addToWeek(task)
        ProjectsTab.deleteTask(task.getID(), project)
        ProjectsTab.checkDone(isDone)
    }

    static addDefaultProject() {
        ProjectsTab.collection.push(InboxUI.defaultProject)
    }

    static createForm() {
        const form = document.createElement('form')
        const projects = document.getElementById('projects-tab')
        form.innerHTML = `
                <form action="#">
                    <input type="text" id="project-description" name="description" placeholder="project" />
                    <button type="submit" id="projects-submit-btn">Submit</button>
                    <button type="button" id="projects-cancel-btn">Cancel</button>
                </form>
            `
        form.classList.add('hidden')
        form.id = 'projects-form'
        projects.appendChild(form)
    }

    static formPopUp() {
        const addProjectBtn = document.getElementById('add-project')
        const form = document.getElementById('projects-form')

        addProjectBtn.addEventListener('click', () => {
            addProjectBtn.classList.add('hidden')
            form.classList.remove('hidden')
        })
    }

    static submitToProjects() {
        const submitBtn = document.getElementById('projects-submit-btn')
        const addProjectBtn = document.getElementById('add-project')
        const description = document.getElementById('project-description')
        const projectsTab = document.getElementById('projects-tab')
        const form = document.getElementById('projects-form')
        const todos = document.getElementById('todos')

        submitBtn.addEventListener('click', (e) => {
            e.preventDefault()

            addProjectBtn.classList.remove('hidden')

            if (description.value === "") {
                ProjectsTab.checkFields()
            }
            else if (ProjectsTab.collection.some(project => project.getName() === description.value)) {
                alert("This project already exists!")
            }
            else {
                const project = new Project(description.value)
                ProjectsTab.collection.push(project)
                const projectDOMElement = document.createElement('li')

                projectDOMElement.setAttribute('data-tab-target', `${project.getName()}`)
                projectDOMElement.textContent = `${project.getName()}`

                const tabContent = document.createElement('div')
                tabContent.id = `${project.getName()}`
                tabContent.setAttribute('data-tab-content', '')
                const projectTitle = document.createElement('h3')
                projectTitle.textContent = `${project.getName()}`
                const addTaskToProject = document.createElement('p')
                addTaskToProject.textContent = '+ Add Task'
                addTaskToProject.id = `add-task-to-${project.getName()}`
                tabContent.appendChild(projectTitle)
                tabContent.appendChild(addTaskToProject)
                todos.appendChild(tabContent)

                projectsTab.insertBefore(projectDOMElement, addProjectBtn)
                description.value = ""
                form.classList.add('hidden')

                const projectForm = document.createElement('form')
                const projectDiv = document.getElementById(`${project.getName()}`)

                ProjectsTab.addFormToProject(project, projectForm, projectDiv)
                ProjectsTab.projectFormPopUp(addTaskToProject, projectForm)
                ProjectsTab.submitTaskToProject(project, projectDiv)
                ProjectsTab.switchCategory()
            }
        })
    }

    static checkFields() {
        const addProjectBtn = document.getElementById('add-project')
        const projects = document.getElementById('projects-tab')
        const alertExists = document.querySelector(".empty-alert")

        addProjectBtn.classList.add("hidden")

        if (alertExists) {
            return
        }

        const notifyFields = document.createElement('p')
        notifyFields.textContent = "Please enter the title of the project."
        notifyFields.classList.add('empty-alert')

        projects.appendChild(notifyFields)

        setTimeout(function () {
            projects.removeChild(notifyFields)
        }, 2000)
    }

    static checkInboxFields(addTaskBtn, inbox) {
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

    static cancelSubmission() {
        const cancelProjectBtn = document.getElementById('projects-cancel-btn')
        const addProjectBtn = document.getElementById('add-project')
        const form = document.getElementById('projects-form')

        cancelProjectBtn.addEventListener('click', () => {
            addProjectBtn.classList.remove('hidden')
            form.classList.add('hidden')
        })
    }

    static cancelForm(project) {
        const cancelTaskBtn = document.getElementById(`${project}-cancel-btn`)
        const addTaskBtn = document.getElementById(`add-task-to-${project}`)
        const form = document.getElementById(`${project}-form`)

        cancelTaskBtn.addEventListener('click', () => {
            addTaskBtn.classList.remove('hidden')
            form.classList.add('hidden')
        })
    }

    static addFormToProject(project, projectForm, projectDiv) {
        projectForm.innerHTML = `
        <form action="#">
            <input type="text" id="task-description-${project.getName()}" name="description" placeholder="task" />
            <input type="date" id="dueDate-${project.getName()}" name="dueDate" placeholder="due date" />
            <button type="submit" id="${project.getName()}-submit-btn">Submit</button>
            <button type="button" id="${project.getName()}-cancel-btn">Cancel</button>
        </form>`

        projectForm.classList.add('hidden')
        projectForm.id = `${project.getName()}-form`
        projectDiv.appendChild(projectForm)

        ProjectsTab.cancelForm(project.getName())
    }

    static projectFormPopUp(addTaskToProject, projectForm) {
        addTaskToProject.addEventListener('click', () => {
            addTaskToProject.classList.add('hidden')
            projectForm.classList.remove('hidden')
        })
    }

    static submitTaskToProject(project, projectDiv) {
        const submitBtn = document.getElementById(`${project.getName()}-submit-btn`)
        const addTaskBtn = document.getElementById(`add-task-to-${project.getName()}`)
        const description = document.getElementById(`task-description-${project.getName()}`)
        const dueDate = document.getElementById(`dueDate-${project.getName()}`)
        const form = document.getElementById(`${project.getName()}-form`)

        submitBtn.addEventListener('click', (e) => {
            e.preventDefault()

            addTaskBtn.classList.remove('hidden')

            if (description.value === "" || dueDate.value === "") {
                ProjectsTab.checkInboxFields(addTaskBtn, projectDiv)
            }
            else if (project.getTasks().some(task => task.getDescription() === description.value)) {
                alert("This todo already exists!")
                description.value = ""
                dueDate.value = ""
                form.classList.add('hidden')
            }
            else {
                const task = new Task(description.value, dueDate.value)
                project.addTask(task)

                ProjectsTab.renderTasks(task, project, projectDiv, description, dueDate, form, addTaskBtn)
            }
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

    static deleteTask(id, project) {
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
            project.getTasks()
                .splice(project.getTasks()
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
                project.getTasks()
                    .splice(project.getTasks()
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
                project.getTasks()
                    .splice(project.getTasks()
                        .findIndex(
                            task => task.getID() === id
                        ), 1)
            })
        }
    }

    static addToToday(task) {
        const collection = ProjectsTab.collection
        const tabContent = document.getElementById('today-content')

        const taskClone = document.createElement('div')
        const isDone = `${task.getDescription()} ${task.getCompleted()}-clone`
        taskClone.id = `${task.getID()}-clone`
        taskClone.innerHTML = `<input type="checkbox" id="${isDone}">
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
                if (day === dayToday && !ProjectsTab.todayCollection.includes(task)) {
                    ProjectsTab.todayCollection.push(task)
                    tabContent.appendChild(taskClone)
                }
            })
        })
    }

    static addToWeek(task) {
        const collection = ProjectsTab.collection
        const tabContent = document.getElementById('this-week-content')

        const taskClone = document.createElement('div')
        const isDone = `${task.getDescription()} ${task.getCompleted()}-clone-week`
        taskClone.id = `${task.getID()}-clone-week`
        taskClone.innerHTML = `<input type="checkbox" id="${isDone}">
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
                if ((day - dayToday) <= 7 && !ProjectsTab.weekCollection.includes(task)) {
                    ProjectsTab.weekCollection.push(task)
                    tabContent.appendChild(taskClone)
                }
            })
        })
    }

    static switchCategory() {
        const tabs = document.querySelectorAll('[data-tab-target]')
        const tabContents = document.querySelectorAll('[data-tab-content]')

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = document.getElementById(tab.dataset.tabTarget)
                tabContents.forEach(tabContent => {
                    tabContent.classList.remove('active')
                })
                target.classList.add('active')
            })
        })
    }
}