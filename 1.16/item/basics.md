description: Создание собственного предмета

# Создание предмета

## Основа

Создадим класс для предмета.
```java
package ru.mcmodding.tutorial.item;

import net.minecraft.item.Item;

public class MinecoinItem extends Item {
    public MinecoinItem(Properties properties) {
        super(properties);
    }
}
```
Параметры предмета (вводить в формате this.названиеПараметра(описаниеПараметра));

| Параметр      | Описание                                                               |
|---------------|------------------------------------------------------------------------|
 | tab           | Группа предметов в креативе.                                           | 
 | rarity        | Редкость предмета.                                                     |
 | stacksTo      | Максимальный размер в стаке.                                           |
 | durability    | Устанавливает максимальную прочность.                                  |
 | setNoRepair   | Запрещает чинить предмет, если он сломан.                              |
 | food          | Делает предмет едой (Подробнее см. [Создание еды](https://mcmodding.ru/1.16/item/food.md)). |
 | addToolType   | Делает инструмент какого-то типа.                                      |
 | fireResistant | Делает инструмент какого-то типа.                                      |
 | setISTER      | Задаёт кастомный рендер предмету.                                      |

Все эти параметры можно прописать в классе ModItems (см. следующий раздел)
в формате `(new Item.Properties().названиеПараметра())`

## Регистрация

Создадим класс ModItems

```java
public class ModItems {
 public static final DeferredRegister<Item> ITEMS = DeferredRegister.create(ForgeRegistries.ITEMS, TutorialMod.MOD_ID);
 
 //Предмет
 public static final RegistryObject<Item> MINECOIN = ITEMS.register("minecoin",
         () -> new MinecoinItem(new Item.Properties()));
 
 //Метод для регистрации класса в моде
 public static void register(IEventBus eventBus) {
     ITEMS.register(eventBus);
 }
}
```
`MinecoinItem` можно заменить на `Item`, если вы хотите создать классический предмет.
Всё! Наш предмет создан. Чтобы использовать предмет в моде нужно написать `ModItems.MINECOIN.get()`.
Теперь добавим `ModItems.register(eventBus)` в конструктор главного класса мода.

Теперь можно запустить Minecraft и посмотреть на предмет. Пропишите `/give @s tut:minecoin`,
Вместо `tut` у вас досжен быть `modId`, вместо `minecoin` - регистрируемое имя предмета.

[![Предмет без модели](images/non_model.png)](images/non_model.png)

## Текстура и модель
Теперь надо создать файл с именем `reg_name.json`. У нас это `minecoin.json`
Создадим файл `minecoin.json` в `assets/tut/models/item`.

Для плоской модели напишем в нём:
```json
{
 "parent": "item/generated",
 "textures": {
  "layer0": "tut:item/minecoin"
 }
}
```

`tut` - modId мода.
`minecoin` - регистрируемое имя предмета.

Текстуру добавим по пути:
```md
src/main/resources/assets/tut/textures/item
```

При запуске игры мы увидим это:
[![Предмет с текстурой](images/simple_model.png)](images/simple_model.png)

[![Предмет с текстурой от третьего лица](images/simple_model_2.png)](images/simple_model_2.png)

## Объёмная модель
Модель добавить легко. Нужно создать саму модель (лучше всего в Blockbench), затем добавить её вместо файла `minecoin.json`
Всё, модель добавлена!
