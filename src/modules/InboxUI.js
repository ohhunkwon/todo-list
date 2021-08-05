import Task from './Task'

export default class InboxTab {
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
            } else {
                const task = new Task(description.value, dueDate.value)
                const taskDOMElement = document.createElement('p')

                taskDOMElement.innerHTML = `- ${task.getDescription()}, due: ${task.getDate()}
                                            <button id='del-${task.getID()}'>delete</button>`

                inbox.insertBefore(taskDOMElement, addTaskBtn)
                description.value = ""
                dueDate.value = ""
                form.classList.add('hidden')

                InboxTab.deleteTask(task.getID())
            }
        })
    }

    static deleteTask(id) {
        const btn = document.getElementById(`del-${id}`)

        btn.addEventListener('click', (e) => {
            e.target.parentElement.remove()
        })
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