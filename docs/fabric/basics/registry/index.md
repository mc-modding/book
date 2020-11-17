# Реестры
В игре существуют классы-реестры. Они необходимы для регистрации всего, что возможно: блоки, предметы, существа, зачарования, жидкости и так далее.

## Использование реестров
Класс `Registry` содержит множество реестров для самых разных игровых объектов. 
Создадим свой класс-утилиту для упрощения работы с реестром.

Для начала, я рекомендую создать в нашем главном классе (FabricTutorial) финальную публичную статичную переменную (проще говоря константу) типа `String`. 
Назовем её `MOD_ID` и присваиваем ей наш ID мода (в моём случае это "fabrictut"):
```java
package ru.mcmodding.fabrictut;

import net.fabricmc.api.ModInitializer;

public class FabricTutorial implements ModInitializer {
    public static final String MOD_ID = "fabrictut";
    @Override
    public void onInitialize() {

    }
}

```
Затем создаём где-нибудь класс с названием FabricTutorialRegistry и сразу импортируем нашу статичную переменную:
```java
package ru.mcmodding.fabrictut.util;

import static ru.mcmodding.fabrictut.FabricTutorial.MOD_ID;

public class FabricTutRegistry {

}
```
Я создал для класса отдельный пакет `util`, в котором у меня будут все классы-утилиты.

Добавим в тело нашего класса несколько основных статичных методов, с помощью которых мы будем регистрировать наши блоки и предметы:
```java
public static Item registerItem(String id, Item item) {
     if (item instanceof BlockItem) {
        ((BlockItem)item).appendBlocks(Item.BLOCK_ITEMS, item);
     }
     return Registry.register(Registry.ITEM, new Identifier(MOD_ID, id), item);
}

public static Block registerBlock(String id, Block block) {
     return Registry.register(Registry.BLOCK, new Identifier(MOD_ID, id), block);
}
```
Эти методы используются самой игрой, но мы переделали их, передавая в аргумент строку, а не `Identifier` т.к. это не очень удобно и короче,
а еще позволяет сразу использовать наш MOD_ID, не указывая его каждый раз.

Наиболее часто использующиеся реестры:
| Реестр | Предназначение|
|--------|---------------|
| Registry.ITEM | Реестр предметов |
| Registry.BLOCK | Реестр блоков |
| Registry.ENTITY_TYPE | Реестр типов существ |
| Registry.SOUND_EVENT | Реестр звуков |
| Registry.ENCHANTMENT | Реестр зачарований |
| Registry.FLUID | Реестр жидкостей |

Помимо тех реестров, что есть в таблице, игра содержит еще десятки других, которые Вы можете посмотреть ![тут](https://fabricmc.net/wiki/tutorial:registry_types)
Вы можете попробовать создать свои методы для работы с этими реестрами, основываясь на нашем готовом классе-утилите.
