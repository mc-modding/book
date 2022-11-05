# Создание предмета

## Подготовка класса предметов

Создадим класс ModItems в папке item.

```java
public class ModItems {
    public static DeferredRegister<Item> ITEMS =
        DeferredRegister.create(ForgeRegistries>ITEMS, mod_id);
    
    public static void register(IEventBus eventBus) {
        ITEMS.register(eventBus)
    }
}
```

* `mod_id` - идентификатор вашего мода

Также добавим в главный класс в главный метод такой код:

```java
ModItems.register(eventBus);
```

* `register(eventBus)` - регистрирует предметы в главном классе

## Добавление предмета

Перед `public static void register(IEventBus eventBus) { ITEMS.register(eventBus) }` пишем: 

```java
public static final RegistryObject<Item> ITEM_ID = ITEMS.register("item_id", () -> new Item(new Item.Properties()));
```

* `item_id` - идентификатор вашего предмета
* `() -> new Item` - класс предмета (можно класс `Item` заменить на свой класс предмета)

Теперь можно запустить Minecraft и прописать команду `/give @s mod_id:item_id`

Фото нет (не доступна загрузка файлов)

## Текстура и модель

Перейдём по пути: `src/main/resources/assets/mod_id/models/item`, здесь создадим файл `item_id.json`, а в него добавим такой код:

```json
{
    "parent": "item/generated",
    "textures": {
        "layer0": "mod_id:item/item_id"
    }
}
```
Меняем `mod_id` и `item_id` на ваши значения

Теперь надо добавить текстуру с названием item_id в формате `.png` по пути `src/resources/assets/mod_id/textures/item`
Вместо 
`item_id` вводим идентификатор вашего предмета.

## Объёмная модель

Создаём 3д модель в удобном вам редакторе (в формате .json и лучше в программе Blockbench) и добавляем модель по пути `src/main/resources/assets/mod_id/models/item`
(с названием как у идентификатора вашего предмета) и не забываем про текстуру (см. предыдущий раздел Текстура и модель)
Поздравляем! Предмет готов
