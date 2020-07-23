description: Система лута в сундуках и т.п. хранилищах.

# Система лута

## Сундуки

Перейдём в наш класс EventsHandler и добавим такой метод:
```java
@SubscribeEvent
public void onLoot(LootTableLoadEvent e)
{
    if (LootTableList.CHESTS_SPAWN_BONUS_CHEST.equals(e.getName()))
    {
        ResourceLocation loc = new ResourceLocation("tut", "chests/tut_spawn_bonus_chest");
        LootTable customLootTable = e.getLootTableManager().getLootTableFromLocation(loc);
        e.setTable(customLootTable);
    }
}
```

Для сундуков существует множество таблица:
* `CHESTS_SPAWN_BONUS_CHEST` - эта таблица содержит предметы бонусного сундука.
* `CHESTS_END_CITY_TREASURE` - эта таблица содержит предметы сундуков в Городе Края. (Второе измерение в Крае)
* `CHESTS_SIMPLE_DUNGEON` - эта таблица содержит предметы сундуков расположенных в данже под землёй. (Данж - это подземное строение имеющие 2-3 сундука и по середине спавнер мобов)
* `CHESTS_VILLAGE_BLACKSMITH` - эта таблица содержит предметы сундука в кузнице, в деревни жителей.
* `CHESTS_ABANDONED_MINESHAFT` - эта таблица содержит предметы сундуков расположенных в заброшенных шахтах.
* `CHESTS_NETHER_BRIDGE` - эта таблица содержит предметы сундуков расположенных на мосту ада.
* `CHESTS_STRONGHOLD_LIBRARY` - эта таблица содержит предметы сундуков расположенных в библиотеке крепости. (Крепость - это подземное строение, где расположен портал в Край)
* `CHESTS_STRONGHOLD_CROSSING` - эта таблица содержит предметы сундуков расположенных на перекрёстках в крепости.
* `CHESTS_STRONGHOLD_CORRIDOR` - эта таблица содержит предметы сундуков расположенных в коридорах крепости.
* `CHESTS_DESERT_PYRAMID` - эта таблица содержит предметы сундуков в пирамиде.
* `CHESTS_JUNGLE_TEMPLE` - эта таблица содержит предметы сундуков в храме джунглей.
* `CHESTS_JUNGLE_TEMPLE_DISPENSER` - эта таблица содержит предметы раздатчиков в храме джунглей.
* `CHESTS_IGLOO_CHEST` - эта таблица содержит предметы сундука в иглу. (Снежный биом)
* `CHESTS_WOODLAND_MANSION` - эта таблица содержит предметы сундуков в особняке тёмного леса.

В условии мы получаем лист со всеми Loot таблицами, которые существуют в Minecraft. В данном случаи мы получаем LootTable бонусного сундука. (Это тот, что спавнится рядом с нами если при создании мира выбрана опция спавна бонусного сундуку)

Перейдём по пути:
```md
└── src    
    └── main
        └── resources
            └── assets
                └── tut
```
И создадим в папке `tut` папку `loot_tables` и в ней ещё одну папку `chests`. Создадим в папке `chests` файл с таким название `tut_spawn_bonus_chest` и форматом `.json`.

Содержание файла:
```Json
{
    "pools": [
        {
            "name": "chest_1",
            "rolls": 2,
            "entries": [
                {
                    "type": "item",
                    "name": "minecraft:dimond",
                    "weight": 24
                },
                {
                    "type": "item",
                    "name": "minecraft:golden_apple",
                    "weight": 15,
                    "functions": [
                        {
                            "function": "minecraft:set_data",
                            "data": 1
                        },
                        {
                            "function": "minecraft:set_count",
                            "count": {
                                "min": 1,
                                "max": 2
                            }
                        }
                    ]
                },
                {
                    "type": "block",
                    "name": "minecraft:wool",
                    "weight": 5,
                    "functions": [
                        {
                            "function": "minecraft:set_data",
                            "data": {
                                "min": 0,
                                "max": 5
                            }
                        }
                    ]
                }
            ]
        }
    ]
}
```

* `name` - это название нашего сундука/категории предметов.
* `rolls` - это то сколько предметов будет находится в сундуке. Если в `entries` будет указано больше, чем в `rolls`, то minecraft будет случайно доставать 2 вещи из списка.
* `type` - это тип нашего предмета, всего их два (`block` и `item`).
* `name` - это сам предмет, его обязательно нужно указывать с modid'ом!
* `weight` - это количество наших предметов. К примеру мы указали, что у `diamond`, `weight` равен 24, значит в сундуке у нас будет лежать 24 алмаза.
* `set_data` - это функция установки метадаты.
* `data` - это сама метадата. Пример: Золотое яблоко существует в двух версия (обычное = 0, зачарованное = 1). Чтобы получить зачарованное нужно прописать 1. Так же вы можете задать `min` и `max`, если минимум 2 и максимум 4, то метадата будет браться от 2 до 4.
* `set_count` - это функция количества.
* `count` - это диапазон от 0 до n. К примеру если мы укажем минимум 1 и максимум 4, то количество предметов будет от 1 до 4. Так же `weight` должен быть либо больше, либо равен count иначе будет ошибка.

Заходим в игру, создаём мир и в настройках ставим "Бонусный сундук". Открываем его и видим, что в нём присутствуют некоторые предметы, которые мы указали в json файле.

## Сущности

TODO

## Рыбалка

Перейдём в наш класс EventsHandler и добавим в метод onLoot, такой код:
```java
if (LootTableList.GAMEPLAY_FISHING_FISH.equals(e.getName()))
{
    ResourceLocation loc = new ResourceLocation("tut", "gameplay/fishing/tut_fish");
    LootTable customLootTable = e.getLootTableManager().getLootTableFromLocation(loc);
    e.setTable(customLootTable);
}
```

Для рыбалки существует несколько таблица:
* `GAMEPLAY_FISHING` - это главная таблица, в ней находятся `fish`, `treasure`, `junk`. Добавления других таблиц не рекомендуется!
* `GAMEPLAY_FISHING_FISH` - эта таблица отвечает за пойманную рыбу, т.е. ту которую мы будем ловить. (Можно добавить свою)
* `GAMEPLAY_FISHING_TREASURE` - эта таблица отвечает за сокровища, т.е. во время рыбалки мы можем поймать не только рыбу, но и сокровища на подобии алмаза.
* `GAMEPLAY_FISHING_JUNK` - эта таблица отвечает за мусор, т.е. то что будет нам не нужно, например поломанные кожаные ботинки или деревянный меч.

Перейдём по пути:
```md
└── src    
    └── main
        └── resources
            └── assets
                └── tut
                    └── loot_tables
```
И создадим в папке `loot_tables` папку `gameplay` и в ней папку `fishing`. Создадим файл `tut_fish` формата `.json`.

Содержание файла: