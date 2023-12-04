const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thrusday", "Friday", "Saturday"]
const elTime = document.querySelector('.js-time');
const date = new Date();
const elForm = document.querySelector('.js-form');
const elInput = document.querySelector('.js-input');
const elList = document.querySelector('.js-list');
const all = document.querySelector('.js-all-badge');
const completed = document.querySelector('.js-completed-badge');
const uncompleted = document.querySelector('.js-uncompleted-badge');
const starred = document.querySelector('.js-starred-badge');
const allBtn = document.querySelector('.js-all-btn');
const completedBtn = document.querySelector('.js-completed-btn');
const uncompletedBtn = document.querySelector('.js-uncompleted-btn');
const starredBtn = document.querySelector('.js-starred-btn');
const btns = [allBtn, completedBtn, uncompletedBtn, starredBtn];
const template = document.querySelector('.js-template');
const fragment = new DocumentFragment(); 
const audio = new Audio('../audio/ding.mp3');
let counter = 0;
let todos = JSON.parse(localStorage.getItem('todos') || "[]");
elTime.textContent = `${String(date).slice(0, 15)} year`;
render(todos, elList);
elForm.addEventListener('submit', evt => {
    evt.preventDefault();
    todos.push({
        id: todos.length ? todos.sort((a,b) => b.id - a.id)[0].id + 1 : 1,
        title: elInput.value.trim(),
        isCompleted: false,
        isStarred: false
    });
    elInput.value = '';
    todos = todos.sort((a, b) => b.isStarred - a.isStarred);
    saveAndRenderTodos();
    btns.forEach(btn => btn.classList.remove('active'));
});


elList.addEventListener('click', (evt) => {
    removeActiveBtnClass();
    if(evt.target.matches('.js-complete')) {
        const todo = todos.find(item => item?.id == evt.target.dataset.id);
        if(todo) todo.isCompleted = !todo.isCompleted;
        saveAndRenderTodos();
    }

    if(evt.target.matches('.js-edit-btn')) {
        const el = evt.target.closest('.js-btn-wrapper').previousElementSibling;
        el.classList.add('edit');
        el.setAttribute('contenteditable', true);
    }

    if(evt.target.matches('.js-text')) {
        if(evt.target?.getAttributeNames().includes('contenteditable')) {
           counter++;

           if(counter > 1) {
                const todo = todos.find(item => item?.id == evt.target.dataset.id);
                if(!evt.target.textContent.trim().length) {
                    todos = todos.filter(item => item.id != evt.target.dataset.id);
                    saveAndRenderTodos();
                }
                todo.title = evt.target.textContent.trim();
                evt.target.removeAttribute('contenteditable');
                saveAndRenderTodos();
                counter = 0;
           }
        }
    }

    if(evt.target.matches('.js-delete-btn')) {
        evt.target.closest('.app__item').style.transform = 'scale(0)';

        setTimeout(() => {
            todos = todos.filter(item => item.id != evt.target.dataset.id);
            saveAndRenderTodos();
        }, 300);
    }

    if(evt.target.matches('.js-starred-btn')) {
        const todo = todos.find(item => item?.id == evt.target.dataset.id);

        if(todo) {
            if(!todo.isStarred) audio.play();
            todo.isStarred = !todo.isStarred
        }
        todos = todos.sort((a, b) => b.isStarred - a.isStarred);
        saveAndRenderTodos();
    }
})


function render(arr, node) {
    node.innerHTML = '';

    arr.forEach(item => {
        const temp = template.content.cloneNode(true);
        temp.querySelector('.js')
        temp.querySelector('.js-text').textContent = item?.title;
        temp.querySelector('.js-text').title = item?.title;
        temp.querySelector('.js-complete').id = `complete-${item?.id}`;
        temp.querySelector('.js-label').setAttribute('for', `complete-${item?.id}`);
        temp.querySelector('.js-complete').dataset.id = item?.id;
        temp.querySelector('.js-complete').checked = item?.isCompleted;
        temp.querySelector('.js-complete').checked === true ? 
        temp.querySelector('.js-text').classList.add('line-through') : 
        temp.querySelector('.js-text').classList.remove('line-through') 
        temp.querySelector('.js-text').dataset.id = item?.id; 
        temp.querySelector('.js-edit-btn').dataset.id = item?.id;
        temp.querySelector('.js-delete-btn').dataset.id = item?.id;
        item?.isStarred ? 
        temp.querySelector('.js-starred-btn').classList.add('starred') :
        temp.querySelector('.js-starred-btn').classList.remove('starred')
        temp.querySelector('.js-starred-btn').dataset.id = item?.id;

        fragment.appendChild(temp);
    });

    node.appendChild(fragment);
    refreshBadge();
}

function saveAndRenderTodos() {
    render(todos, elList);
    localStorage.setItem("todos", JSON.stringify(todos));
}


allBtn.addEventListener('click', (evt) => {
    removeActiveBtnClass();
    allBtn.classList.add('active');
    render(todos, elList);
});


completedBtn.addEventListener('click', (evt) => {
    removeActiveBtnClass();
    completedBtn.classList.add('active');
    const filteredTodos = todos.filter(todo => todo?.isCompleted);
    render(filteredTodos, elList);
});

uncompletedBtn.addEventListener('click', (evt) => {
    removeActiveBtnClass();
    uncompletedBtn.classList.add('active');
    const filteredTodos = todos.filter(todo => !todo?.isCompleted);
    render(filteredTodos, elList);
});

starredBtn.addEventListener('click', (evt) => {
    removeActiveBtnClass();
    starredBtn.classList.add('active');
    const filteredTodos = todos.filter(todo => todo?.isStarred);
    render(filteredTodos, elList);
});

function refreshBadge() {
    if(todos.length) {
        all.style.display = 'inline-flex';
        all.textContent = todos.length
    }
    else all.style.display = 'none';
    const completedLength = todos.filter(todo => todo?.isCompleted).length;
    if(completedLength) {
        completed.style.display = 'inline-flex';
        completed.textContent = completedLength
    }
    else completed.style.display = 'none';
    const unCompletedLength = todos.filter(todo => !todo?.isCompleted).length;
    if(unCompletedLength) {
        uncompleted.style.display = 'inline-flex';
        uncompleted.textContent = unCompletedLength
    }
    else uncompleted.style.display = 'none';
    const starredLength = todos.filter(todo => todo?.isStarred).length;
    if(starredLength) {
        starred.style.display = 'inline-flex';
        starred.textContent = starredLength;
    }
    else starred.style.display = 'none';
}

function removeActiveBtnClass() {
    btns.forEach(btn => btn.classList.remove('active'));
}