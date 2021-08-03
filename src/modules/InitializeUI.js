import InboxUI from './InboxUI'
import ProjectsUI from './ProjectsUI'

export default class UI {
    static loadHomepage() {
        UI.switchCategory()

        InboxUI.initializeInboxTab()
        ProjectsUI.initializeProjectsTab()
    }

    static switchCategory() {
        const tabs = document.querySelectorAll('[data-tab-target]')
        const tabContents = document.querySelectorAll('[data-tab-content]')

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = document.getElementById(tab.dataset.tabTarget);
                tabContents.forEach(tabContent => {
                    tabContent.classList.remove('active')
                })
                target.classList.add('active')
            })
        })
    }
}