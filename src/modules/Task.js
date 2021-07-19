export default class Task {
    constructor(description, dueDate, completed) {
        this.description = description;
        this.dueDate = dueDate;
        this.completed = false;
    }

    setDescription(description) {
        this.description = description;
    }

    getDescription() {
        return this.description;
    }

    setDate() {
        this.dueDate = dueDate;
    }

    getDate() {
        return this.dueDate;
    }

    setCompleted() {
        this.completed ? this.completed = false : this.completed = true
    }

    getCompleted() {
        return this.completed
    }
}