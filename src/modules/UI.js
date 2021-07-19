import Task from './Task';
import Project from './Project';

export default class UI {
    static loadHomepage() {
        UI.switchCategory();
        UI.loadHiddenInboxForm()
        UI.inboxPopUp();
        UI.submitAddToInbox();
    }

    static switchCategory() {
        const tabs = document.querySelectorAll('[data-tab-target]');
        const tabContents = document.querySelectorAll('[data-tab-content]');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = document.getElementById(tab.dataset.tabTarget);
                tabContents.forEach(tabContent => {
                    tabContent.classList.remove('active');
                })
                target.classList.add('active');
            })
        })
    }

    static loadHiddenInboxForm() {
        const form = document.createElement('form');
        const inbox = document.getElementById('inbox')
        form.innerHTML = `
                <form action="#">
                    <input type="text" id="description" name="description" placeholder="task" />
                    <input type="date" id="dueDate" name="dueDate" placeholder="due date" />
                    <button type="submit" id="submit-btn">Submit</button>
                </form>
            `
        form.classList.add('hidden');
        form.id = 'inbox-form'
        inbox.appendChild(form);
    }

    static inboxPopUp() {
        const addTaskBtn = document.getElementById('add-task');
        const form = document.getElementById('inbox-form')

        addTaskBtn.addEventListener('click', () => {
            addTaskBtn.classList.add('hidden');
            form.classList.remove('hidden');
        })
    }

    static submitAddToInbox() {
        const submitBtn = document.getElementById('submit-btn');
        const addTaskBtn = document.getElementById('add-task');
        const description = document.getElementById('description');
        const dueDate = document.getElementById('dueDate');
        const form = document.getElementById('inbox-form')

        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();

            addTaskBtn.classList.remove('hidden');

            if (description.value === "" || dueDate.value === "") {
                UI.checkInboxFields();
            } else {
                const task = new Task(description.value, dueDate.value);
                const taskDOMElement = document.createElement('p');
    
                taskDOMElement.textContent = `- ${task.getDescription()} || Due: ${task.getDate()}`;
    
                inbox.insertBefore(taskDOMElement, addTaskBtn);
                description.value = "";
                dueDate.value = "";
                form.classList.add('hidden');
            }
        })
    }

    static checkInboxFields() {
        const addTaskBtn = document.getElementById('add-task');
        const inbox = document.getElementById('inbox');
        const alertExists = document.querySelector(".empty-alert");

        addTaskBtn.classList.add("hidden");

        if (alertExists) {
            return;
        }

        const notifyFields = document.createElement('p');
        notifyFields.textContent = "Please enter the description and due date of the task.";
        notifyFields.classList.add('empty-alert');

        inbox.appendChild(notifyFields);

        setTimeout(function () {
            inbox.removeChild(notifyFields);
        }, 2000);
    }
}