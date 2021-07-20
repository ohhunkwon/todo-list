import Task from './Task';
import Project from './Project';

export default class UI {
    static loadHomepage() {
        UI.switchCategory();

        UI.loadHiddenInboxForm()
        UI.inboxFormPopUp();
        UI.submitAddToInbox();

        UI.loadHiddenProjectForm();
        UI.projectsFormPopUp();
        UI.submitAddToProjects();
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
                    <input type="text" id="task-description" name="description" placeholder="task" />
                    <input type="date" id="dueDate" name="dueDate" placeholder="due date" />
                    <button type="submit" id="inbox-submit-btn">Submit</button>
                </form>
            `
        form.classList.add('hidden');
        form.id = 'inbox-form'
        inbox.appendChild(form);
    }

    static inboxFormPopUp() {
        const addTaskBtn = document.getElementById('add-task');
        const form = document.getElementById('inbox-form')

        addTaskBtn.addEventListener('click', () => {
            addTaskBtn.classList.add('hidden');
            form.classList.remove('hidden');
        })
    }

    static submitAddToInbox() {
        const submitBtn = document.getElementById('inbox-submit-btn');
        const addTaskBtn = document.getElementById('add-task');
        const description = document.getElementById('task-description');
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

    static loadHiddenProjectForm() {
        const form = document.createElement('form');
        const projects = document.getElementById('projects-tab')
        form.innerHTML = `
                <form action="#">
                    <input type="text" id="project-description" name="description" placeholder="project" />
                    <button type="submit" id="projects-submit-btn">Submit</button>
                    <button type="button" id="projects-cancel-btn">Cancel</button>
                </form>
            `
        form.classList.add('hidden');
        form.id = 'projects-form'
        projects.appendChild(form);
    }

    static projectsFormPopUp() {
        const addProjectBtn = document.getElementById('add-project');
        const form = document.getElementById('projects-form')

        addProjectBtn.addEventListener('click', () => {
            addProjectBtn.classList.add('hidden');
            form.classList.remove('hidden');
        })
    }

    static submitAddToProjects() {
        const submitBtn = document.getElementById('projects-submit-btn');
        const addProjectBtn = document.getElementById('add-project');
        const description = document.getElementById('project-description');
        const projectsTab = document.getElementById('projects-tab')
        const form = document.getElementById('projects-form')
        const todos = document.getElementById('todos')

        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();

            addProjectBtn.classList.remove('hidden');

            if (description.value === "") {
                UI.checkProjectFields();
            } else {
                const project = new Project(description.value);
                const projectDOMElement = document.createElement('li');

                projectDOMElement.setAttribute('data-tab-target', `${project.getName()}`)
                projectDOMElement.textContent = `${project.getName()}`;

                const tabContent = document.createElement('div')
                tabContent.id = `${project.getName()}`
                tabContent.setAttribute('data-tab-content', '')
                const projectTitle = document.createElement('h3')
                projectTitle.textContent = `${project.getName()}`
                tabContent.appendChild(projectTitle)
                todos.appendChild(tabContent)

                projectsTab.insertBefore(projectDOMElement, addProjectBtn);
                description.value = "";
                form.classList.add('hidden');

                UI.switchCategory()
            }
        })
    }

    static checkProjectFields() {
        const addProjectBtn = document.getElementById('add-project');
        const projects = document.getElementById('projects-tab');
        const alertExists = document.querySelector(".empty-alert");

        addProjectBtn.classList.add("hidden");

        if (alertExists) {
            return;
        }

        const notifyFields = document.createElement('p');
        notifyFields.textContent = "Please enter the description and due date of the task.";
        notifyFields.classList.add('empty-alert');

        projects.appendChild(notifyFields);

        setTimeout(function () {
            projects.removeChild(notifyFields);
        }, 2000);
    }
}