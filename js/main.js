/* ===========================
   БУРГЕР-МЕНЮ
   =========================== */

document.addEventListener('DOMContentLoaded', function () {
    var burgerBtn = document.getElementById('burgerBtn');
    var mainNav = document.getElementById('mainNav');

    if (burgerBtn && mainNav) {
        burgerBtn.addEventListener('click', function () {
            burgerBtn.classList.toggle('open');
            mainNav.classList.toggle('open');
        });

        /* Закрытие меню при клике на ссылку */
        var navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                burgerBtn.classList.remove('open');
                mainNav.classList.remove('open');
            });
        });
    }

    /* ===========================
       ПОДСВЕТКА ТЕКУЩЕГО ПУНКТА НАВИГАЦИИ
       =========================== */

    var currentPath = window.location.pathname;
    var allNavLinks = document.querySelectorAll('.main-nav a');
    allNavLinks.forEach(function (link) {
        /* Убираем активный класс, затем проставляем нужный */
        link.classList.remove('active');
        var href = link.getAttribute('href');
        if (href && currentPath.indexOf(href.replace('..', '').replace('//', '/')) !== -1) {
            /* Простая проверка совпадения */
        }
    });

    /* ===========================
       ЛОГИКА ТЕСТОВ ПО РУССКОМУ ЯЗЫКУ
       =========================== */

    /**
     * Функция инициализации теста.
     * Вызывается на странице темы, если на ней есть банк вопросов.
     *
     * @param {Array} questionBank — массив объектов вопросов:
     *   {
     *     question: "Текст вопроса",
     *     options: ["вариант 1", "вариант 2", "вариант 3", "вариант 4"],
     *     correct: 0  // индекс правильного ответа в массиве options
     *   }
     * @param {string} containerId — id элемента-контейнера для теста
     * @param {number} count — количество вопросов для выборки (по умолчанию 15)
     */
    window.initTest = function (questionBank, containerId, count) {
        count = count || 15;
        var container = document.getElementById(containerId);
        if (!container || !questionBank || questionBank.length === 0) return;

        /* Перемешивание массива (алгоритм Фишера-Йетса) */
        function shuffle(arr) {
            var a = arr.slice();
            for (var i = a.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var tmp = a[i];
                a[i] = a[j];
                a[j] = tmp;
            }
            return a;
        }

        /* Выбираем случайные вопросы */
        var shuffled = shuffle(questionBank);
        var selected = shuffled.slice(0, Math.min(count, shuffled.length));

        /* Для каждого вопроса перемешиваем варианты ответов */
        var testQuestions = selected.map(function (q, idx) {
            var correctText = q.options[q.correct];
            var shuffledOptions = shuffle(q.options);
            var newCorrectIndex = shuffledOptions.indexOf(correctText);
            return {
                question: q.question,
                options: shuffledOptions,
                correct: newCorrectIndex,
                id: 'q' + idx
            };
        });

        /* Генерируем HTML теста */
        var html = '<div class="test-container">';
        testQuestions.forEach(function (q) {
            html += '<div class="test-question" data-correct="' + q.correct + '" id="' + q.id + '">';
            html += '<p class="question-text">' + q.question + '</p>';
            q.options.forEach(function (opt, optIdx) {
                html += '<label>';
                html += '<input type="radio" name="' + q.id + '" value="' + optIdx + '"> ';
                html += opt;
                html += '</label>';
            });
            html += '</div>';
        });
        html += '</div>';
        html += '<button class="btn-submit-test" id="submitTest">Проверить ответы</button>';
        html += '<div id="testResult"></div>';

        container.innerHTML = html;

        /* Обработка отправки теста */
        document.getElementById('submitTest').addEventListener('click', function () {
            var correctCount = 0;
            var total = testQuestions.length;

            testQuestions.forEach(function (q) {
                var questionEl = document.getElementById(q.id);
                var selected = questionEl.querySelector('input[name="' + q.id + '"]:checked');
                var selectedValue = selected ? parseInt(selected.value) : -1;

                /* Убираем предыдущие классы */
                questionEl.classList.remove('correct', 'incorrect');

                if (selectedValue === q.correct) {
                    correctCount++;
                    questionEl.classList.add('correct');
                } else {
                    questionEl.classList.add('incorrect');
                }
            });

            var percentage = Math.round((correctCount / total) * 100);
            var resultEl = document.getElementById('testResult');
            resultEl.innerHTML = '<div class="test-result">' +
                '<p class="score">Результат: ' + correctCount + ' из ' + total + '</p>' +
                '<p class="percentage">' + percentage + '%</p>' +
                '</div>';

            /* Прокрутка к результатам */
            resultEl.scrollIntoView({ behavior: 'smooth' });
        });
    };
});