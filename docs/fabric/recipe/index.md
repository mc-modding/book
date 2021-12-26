# Рецепты
## Свои рецепты
Создадим в папке `resources` директорию `data/<mod_id>/recipes`, где `<mod_id>` - ID мода.

В папке `recipes` создадим json файл с любым названием, но я рекомендую делать такие названия, чтобы было сразу понятно, что это за рецепт.

###Форменный рецепт
```json
{
  "type": "minecraft:crafting_shaped",
  "pattern": [
    "X",
    "X",
    "#"
  ],
  "key": {
    "#": {
      "item": "minecraft:stick"
    },
    "X": {
      "item": "minecraft:slime_ball"
    }
  },
  "result": {
    "item": "fabrictut:slime_sword"
  }
}
```
* `type` - тип рецепта (`minecraft:crafting_shaped` значит форменный)
* `pattern` - это сам рецепт. Каждая новая строка является следующим рядом в верстаке. На одном ряде может быть до трех символов
* `key` - это предметы. Как мы видим в примере, `#` означает `minecraft:stick`, а `X` означает `minecraft:slime_ball`
* `result` - это то, что мы получим в итоге (`fabrictut:slime_sword`)

###Бесформенный рецепт
```json
{
  "type": "minecraft:crafting_shapeless",
  "ingredients": [
    {
      "item": "minecraft:redstone"
    },
    {
      "item": "minecraft:red_dye"
    }
  ],
  "result": {
    "item": "fabrictut:ruby",
    "count": 4
	}
}
```
* `type` - тип рецепта (`minecraft:crafting_shapeless` - бесформенный)
* `ingredients` - предметы, необходимые для крафта. Мы можем добавить до 9 предметов сюда
* `result` - результат. `item` означает предмет, а `count` - количество

###Переплавка
```json
{
  "type": "minecraft:smelting",
  "ingredient": {
    "item": "minecraft:stone"
  },
  "result": "fabrictut:white_stone",
  "experience": 0.35,
  "cookingtime": 200
}
```
* `type` - тип рецепта (`mineraft:smelting` - переплавка в печи)
* `ingredient` - предмет, который мы будем переплавлять
* `result` - предмет, который мы получим в итоге
* `experience` - количество опыта за переплавку
* `cookingtime` - время переплавки в тиках (20 тиков = 1 секунда)

Также Вы можете использовать `minecraft:campfire_cooking` для создания рецепта на костре и `minecraft:smoking` для создания рецепта в коптильне вместо `minecrat:smelting`.
