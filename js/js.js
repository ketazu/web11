document.addEventListener('DOMContentLoaded', function () {
    const preloader = document.querySelector(".preloader");
    const content = document.querySelector(".content");

    if (preloader && content) {
        setTimeout(() => {
            preloader.style.opacity = "0";
            preloader.style.visibility = "hidden";
            content.style.display = "block";
            setTimeout(() => {
                preloader.remove();
            }, 500);
        }, 3000);
    }
});

document.querySelector('.feedback__form').addEventListener('submit', function (e) {
    e.preventDefault();
    const feedbackText = this.querySelector('textarea').value;
    console.log('Отправлен отзыв:', feedbackText);
});
// 1. Начало процесса.
//
// 2. Пользователь вводит текст отзыва в текстовое поле.
//
// 3. Пользователь нажимает кнопку "Отправить отзыв".
//
// 4. Система проверяет валидность введённого текста:
//
//     4.1. Если текст пустой, система показывает сообщение об ошибке и процесс прерывается.
//
//     4.2. Если текст не пустой, процесс продолжается.
//
// 5. Система отправляет отзыв на сервер.
//
// 6. После успешной отправки система показывает уведомление об успешной отправке отзыва.
//
// 7. Текстовое поле очищается.
//
//8. Процесс завершён.

// Инициализация слайдера блюд
document.addEventListener('DOMContentLoaded', function () {
    const dishesSwiper = new Swiper('.dishes-swiper', {
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },

        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },

        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

        effect: 'slide',
        speed: 800,
    });
});

// Модальное окно
document.addEventListener('DOMContentLoaded', function () {
    const addRecipeButton = document.querySelector('.header__button');
    const addRecipeModal = document.querySelector('.add-recipe-modal');
    const closeModalButton = document.querySelector('.add-recipe-modal__close');

    if (!addRecipeButton || !addRecipeModal || !closeModalButton) {
        console.log('Не найдены необходимые элементы для модального окна');
        return;
    } else {
        addRecipeModal.setAttribute('hidden', 'true');
        addRecipeModal.style.display = 'none';
        document.body.style.overflow = '';
    }

    function openModal() {
        addRecipeModal.removeAttribute('hidden');
        addRecipeModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        addRecipeModal.setAttribute('hidden', 'true');
        addRecipeModal.style.display = 'none';
        document.body.style.overflow = '';
    }

    addRecipeButton.addEventListener('click', openModal);
    closeModalButton.addEventListener('click', closeModal);

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            initRecipes(data.recipes);
            initMenu(data.menu);
        })
        .catch(error => {
            console.error('Ошибка загрузки данных:', error);
        });
});

// Функция для инициализации рецептов
function initRecipes(recipesData) {
    const recipesContainer = document.querySelector(".recipes");
    if (!recipesContainer) return;
    const recipeNameElements = recipesContainer.querySelectorAll(".recipes__name");
    const recipeCards = recipesContainer.querySelectorAll(".recipes__card");
    recipeNameElements.forEach((item, index) => {
        if (recipesData[index]) {
            item.textContent = recipesData[index].name;
        }
    });
    recipeCards.forEach((card, index) => {
        if (recipesData[index]) {
            const descriptionElement = document.createElement('div');
            descriptionElement.className = 'recipes__description';
            descriptionElement.textContent = recipesData[index].description;
            descriptionElement.setAttribute('hidden', true);
            card.appendChild(descriptionElement);
        }
    });

    const recipeItems = document.querySelectorAll('.recipes__item');
    recipeItems.forEach(item => {
        const recipeImage = item.querySelector('.recipes__image');
        const recipeDescription = item.querySelector('.recipes__description');

        if (recipeImage && recipeDescription) {
            item.addEventListener('mouseenter', () => {
                recipeImage.style.opacity = 0.7;
                recipeDescription.removeAttribute('hidden');
            });

            item.addEventListener('mouseleave', () => {
                recipeImage.style.opacity = 1;
                recipeDescription.setAttribute('hidden', true);
            });
        }
    });
}

function initMenu(menuData) {
    const headerMenu = document.querySelector('.header__nav');
    if (!headerMenu) return;
    const headerList = headerMenu.querySelector('.header__list');
    if (!headerList) return;
    headerList.innerHTML = '';
    const createLink = (url, title, isActive = false) => {
        const activeClass = isActive ? 'header__link--active' : '';
        return `
            <li class="header__item">
                <a href="${url}" class="header__link ${activeClass}">${title}</a>
            </li>
        `;
    };

    for (const linkItem in menuData) {
        const link = menuData[linkItem];
        headerList.insertAdjacentHTML('beforeend', createLink(link.link, link.title, link.active));
    }

    console.log('Навигационное меню создано с использованием данных из data.json');
}

// Обработчик формы добавления рецепта
document.addEventListener('DOMContentLoaded', function () {
    const recipeForm = document.getElementById('recipeForm');
    const recipeMessage = document.getElementById('recipeMessage');
    const addRecipeModal = document.querySelector('.add-recipe-modal');

    if (recipeForm) {
        document.querySelector('.header__button').addEventListener('click', function () {
            const savedRecipe = JSON.parse(localStorage.getItem('draftRecipe'));
            if (savedRecipe) {
                document.getElementById('recipeName').value = savedRecipe.name || '';
                document.getElementById('recipeImage').value = savedRecipe.image || '';
                document.getElementById('recipeDescription').value = savedRecipe.description || '';
            }
        });

        recipeForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('recipeName').value.trim();
            const image = document.getElementById('recipeImage').value.trim();
            const description = document.getElementById('recipeDescription').value.trim();

            if (name.length < 3) {
                showMessage('Название рецепта должно содержать не менее 3 символов', 'error');
                return;
            }

            if (description.length < 10) {
                showMessage('Описание рецепта должно содержать не менее 10 символов', 'error');
                return;
            }

            const ingredients = [];
            const ingredientInputs = document.querySelectorAll('.add-recipe-modal__input[name^="ingredient-"]');
            ingredientInputs.forEach(input => {
                if (input.value.trim()) {
                    ingredients.push(input.value.trim());
                }
            });

            const steps = [];
            const stepTextareas = document.querySelectorAll('.add-recipe-modal__textarea[name^="step-"]');
            stepTextareas.forEach(textarea => {
                if (textarea.value.trim()) {
                    steps.push(textarea.value.trim());
                }
            });

            const recipe = {
                name,
                image,
                description,
                ingredients,
                steps,
                date: new Date().toISOString()
            };

            saveRecipe(recipe);
            showMessage('Рецепт сохранен.', 'success');
            setTimeout(() => {
                recipeForm.reset();
                recipeMessage.textContent = '';
                addRecipeModal.setAttribute('hidden', 'true');
                addRecipeModal.style.display = 'none';
                document.body.style.overflow = '';
            }, 2000);
        });

        recipeForm.addEventListener('input', function () {
            const draft = {
                name: document.getElementById('recipeName').value.trim(),
                image: document.getElementById('recipeImage').value.trim(),
                description: document.getElementById('recipeDescription').value.trim()
            };
            localStorage.setItem('draftRecipe', JSON.stringify(draft));
        });
    }

    function showMessage(text, type) {
        recipeMessage.textContent = text;
        recipeMessage.className = 'add-recipe-modal__message ' + type;
    }

    function saveRecipe(recipe) {
        // Получаем текущие рецепты из LocalStorage или создаем новый массив
        const recipes = JSON.parse(localStorage.getItem('recipes')) || [];

        recipes.push(recipe);

        localStorage.setItem('recipes', JSON.stringify(recipes));
    }

    function loadRecipes() {
        return JSON.parse(localStorage.getItem('recipes')) || [];
    }
});