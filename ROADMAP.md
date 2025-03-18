# Roadmap

This file exists in two versions: Ukrainian and English. In case of discrepancies between the versions, the Ukrainian version is the primary one.

Цей файл існує в двох версіях: українській та англійській. У випадку розбіжностей між версіями основною є українська версія.

## Table of contents

-   [Українська версія](#українська-версія)
-   [English version](#english-version)

# Дорожня карта (Українська версія)

## Зміст

-   [Рушій](#рушій)
-   [Тема](#тема)
-   [Сітка](#сітка)
-   [Рядок](#рядок)
-   [Комірка](#комірка)
-   [Палітра проєкту](#палітра-проєкту)
-   [Збережена палітра](#збережена-палітра)
-   [Піпетка](#піпетка)
-   [Зображення](#зображення)
-   [Символи](#символи)
-   [Лінійка](#лінійка)
-   [Історія](#історія)
-   [Експорт](#експорт)
-   [Імпорт](#імпорт)
-   [Інтерфейс користувача](#інтерфейс-користувача)

## Рушій

Основою рушія є **один** &lt;canvas&gt; елемент.

Відображення має відбуватися в контексті **2d**.

Сцена це безкінечне поле для малювання з гарантованою роботоздатністю в межах 1,000,000 пікселів від центру у всі сторони (загалом це квадрат розміром 2,000,000 x 2,000,000).

Оновлення сцени має відбуватися при ініціалізації події. Рушій має працювати економно та не витрачати зайві ресурси при простої.

Якщо це повторювана подія (наприклад довгий клік, або перетягування), то оновлення сцени має відбуватися з постійним 60FPS. В жодному разі швидкість оновлення сцени може падати нижче 30FPS. Рушій має працювати швидко.

Ноди, об'єкти (node) це елементарні рендерні одиниці на сцені. Об'єкти поділяються на базові та загальні. Загальні об'єкти мають наслідуватися як мінімум від одного базового об'єкту.

Камера це інструмент для динамічного рендеру об'єктів на сцені. Об'єкти що знаходяться поза камерою не мають відмальовуватися.

Переміщення по сцені відбувається за допомогою зміни розмірів та позиції камери та проєкції об'єктів на &lt;canvas&gt;.

Рушій має бути інкапсульованим для та надавати API для інтеграції з популярними фреймворками, такими як angular, react, vue, svelte, solid та інші.
Але в якості proof of concept цей проєкт буде використовувати react щоб поєднати рушій з UI елементами на сторінці.

## Тема

(#heading-ids) Рушій має підтримку світлої та темної теми.

Змінити тему можна підставивши об'єкт Theme (Тема) в рушій.

## Сітка

Для того щоб малювати на сцені необхідно спочатку створити об'єкт Grid (Сітка). Сітка складається з (Row) рядків та (Cell) комірок. Для спрощення функціоналу, сітка не може мати колонок.

За замовчуванням всі рядки сітки мають одну форму. Але користувач може змінити форму рядка, розміри та кількість комірок, відступи тощо.

Користувач може змінювати розміри сітки та її поворот на сцені. Розміри сітки не масштабують її, а додають чи видаляють рядки та комірчини на сітці.

## Рядок

(Row) Рядок це одиниця (Grid) сітки та контейнер для (Cell) комірок.

Рядок може мати форму:

-   Квадратної сітки (grid)
-   Цегляного плетіння (brick)
-   Бісерного ткацтва (loom)
-   Мозаїчного плетіння (peyote)

Зміна форми рядка також змінює форму комірок, їх розташування в рядку та відступи.

## Комірка

(Cell) Комірка це елементарна одиниця (Row) рядка та (Grid) сітки.

Комірка може бути квадратною, чи видовженою горизонтально або вертикально.

За замовчуванням комірка має прозорий (не зафарбований) колір та може бути зафарбований в будь-якй колір.
Комірка має зберігати посилання на колір, а не саме значення, щоб рефлекторно оновлювати колір при зміні кольору на палітрі.

## Палітра проєкту

Палітра це список кольорів що мають унікальний ідентифікатор, назву та значення кольору.

Для зафарбовування комірок спочатку необхідно додати відповідний колір на палітру. Комірки можуть працювати лише з палітрою проєкту.

## Збережена палітра

Користувач може зберегти палітру та використовувати її між проєктами.

При використанні збереженої палітри вибраний колір переноситься на палітру проєкту і лише потім застосовуються до комірки.

## Піпетка

Користувач може використати піпетку зі збільшуваним склом для того щоб вибрати існуючий колір палітри з зафарбованих комірок, або вибрати будь-який новий колір зі сцени.

## Зображення

Користувач може завантажити та розмістити будь-яке зображення на сцені. Зображення функціонує як референс для рисування та може бути розміщено безпосередньо сіткою.

## Символи

Для використаних кольорів може використовуватись число або символ для позначення на комірках. Символ або число має бути не довшим за дві літери або дві цифри. Число має бути в межах від 1 до 99, що обмежує кількість використаних кольорів на сцені до 99 кольорів.

## Лінійка

Кожна сітка мусить мати лінійку для полегшення рисування. Лінійку можна вмикати та вимикати на сцені.

## Історія

Користувач має можливість скасувати останню дію на сцені за допомогою комбінації Ctrl+Z або натиснувши кнопку на UI. А також він може повторити останню скасовану дію за допомогою комбінації Ctrl+Shift+Z, або Ctrl+Y, або натиснувши відповідну кнопку на UI.

Глибина історії має бути щонайменше 30 дій.

В дії не враховуються:

-   Зміна теми
-   Додавання та видалення кольорів з палітри
-   Зміна позиції чи масштабу камери.

## Експорт

Сцену можна експортувати як png зображення. Також сцену можна експортувати у текстовому форматі (JSON).

## Імпорт

Сцену можна завантажити з текстового (JSON) файлу. Також на сцену можна додати окремі об'єкти (node) з текстового файлу.

## Інтерфейс користувача

До інтерфейсу мусить входити:

-   Меню проєкту (імпорт, експорт, налаштування теми тощо)
-   Список інструментів
-   Палітра проєкту (сцени) та збережена палітра
-   Кнопки керування масштабом
-   Кнопки керування історією (скасувати дію та повторити)
-   Список дій збережених в історії
-   Піпетка
-   Кропер для завантажуваних зображень
-   Ситуативні плаваючі кнопки при взаємодії елементів на сцені

# Roadmap (English version)

## Table of contents

-   [Engine](#engine)
-   [Theme](#theme)
-   [Grid](#grid)
-   [Row](#row)
-   [Cell](#cell)
-   [Project Palette](#project-palette)
-   [Saved Palette](#saved-palette)
-   [Eyedropper](#eyedropper)
-   [Images](#images)
-   [Symbols](#symbols)
-   [Ruler](#ruler)
-   [History](#history)
-   [Export](#export)
-   [Import](#import)
-   [User Interface (UI)](#user-interface-ui)

## Engine

The core of the engine is a single &lt;canvas&gt; element.

Rendering should occur in the **2d** context.

The scene is an infinite drawing field with guaranteed functionality within 1,000,000 pixels from the center in all directions (overall, this is a square of 2,000,000 x 2,000,000 pixels).

Scene updates should occur upon event initialization. The engine should operate efficiently and avoid unnecessary resource usage during idling.

If an event is repetitive (for instance a long press or drag), the scene should update consistently at 60 FPS. Under no circumstances should the update rate drop below 30 FPS. The engine must run fast and smoothly.

Nodes or objects are the fundamental rendering units on the scene. Objects are divided into basic and general categories. General objects must inherit from at least one basic object.

The camera is a tool for dynamically rendering objects on the scene. Objects outside the camera’s view should not be rendered.

Movement within the scene is achieved by adjusting the camera’s size and position, as well as projecting objects onto the &lt;canvas&gt;.

The engine should be encapsulated and provide an API for integration with popular frameworks such as Angular, React, Vue, Svelte, Solid, and others. However, as a proof of concept, this project will use React to combine the engine with UI elements on the page.

## Theme

The engine should support both light and dark themes.

The theme can be changed by passing a Theme object into the engine.

## Grid

To draw on the scene, a Grid object must be created first. The grid consists of Rows and Cells. To simplify functionality, the grid does not support columns.

By default, all rows in the grid have the same shape. However, the user can modify the row shape, size, number of cells, spacing, and other properties.

The user can resize and rotate the grid on the scene. Resizing does not scale the grid; instead, it adds or removes rows and cells.

## Row

A Row is a unit of the Grid and a container for Cells.

A row can take different forms, such as:

-   Grid (square-based layout)
-   Brick (brick-like weaving)
-   Loom (bead weaving)
-   Peyote (mosaic weaving)

Changing a row’s form also affects the shape of its cells, their arrangement, and spacing.

## Cell

A Cell is the fundamental unit of both a Row and the Grid.

A cell can be square, horizontally elongated, or vertically elongated.

By default, a cell has a transparent (unfilled) color but can be filled with any color.

A cell should store a reference to a color, rather than a direct color value, to ensure it updates dynamically when the color in the palette changes.

## Project Palette

The palette is a list of colors, each with a unique identifier, name, and color value.

To fill cells, a color must first be added to the project’s palette. Cells can only work with the project palette.

## Saved Palette

The user can save a palette and reuse it across projects.

When using a saved palette, the selected color is first transferred to the project palette before being applied to a cell.

## Eyedropper

The user can use an eyedropper tool with a magnifying glass to pick an existing color from painted cells or select any new color from the scene.

## Images

The user can upload and place images on the scene. Images serve as references for drawing and can be positioned directly within the grid.

## Symbols

Used colors can be represented by a number or a symbol within cells. Symbols or numbers must not exceed two letters or two digits.

Numbers must be between 1 and 99, limiting the number of colors used on the scene to 99.

## Ruler

Each grid must have a ruler to assist with drawing. The ruler can be toggled on or off.

## History

The user can undo the last action on the scene using Ctrl+Z or a UI button. Additionally, they can redo the last undone action using Ctrl+Shift+Z, Ctrl+Y, or a UI button.

The history depth must be at least 30 actions.

The following actions should not be recorded in history:

-   Theme changes
-   Adding or removing colors from the palette
-   Changing the camera’s position or zoom level

## Export

The scene can be exported as a PNG image. It can also be exported in text format (JSON).

## Import

The scene can be loaded from a JSON file. Additionally, individual nodes (objects) can be imported from a text file onto the scene.

## User Interface (UI)

The interface must include:

-   Project menu (import, export, theme settings, etc.)
-   Tool list
-   Project (scene) palette and saved palette
-   Zoom control buttons
-   History control buttons (undo and redo)
-   List of actions stored in history
-   Eyedropper tool
-   Cropper for uploaded images
-   Contextual floating buttons for interactions with scene elements
