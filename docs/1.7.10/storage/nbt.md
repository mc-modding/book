# NBT

Формат NBT (Named Binary Tag) широко используется Minecraft в различных файлах для хранения данных.
Представляет собой древовидную структуру данных, состоящую из различных тегов.
Каждый тег имеет идентификатор и название.

## Список тегов

| ID  | Тип        | Описание                                                                                                    |
|-----|------------|-------------------------------------------------------------------------------------------------------------|
| 0   | END        | Используется для обозначения конда данных в файле. **Это технический тег** и вам он никогда не понадобится. |
| 1   | BYTE       | Целое число со знаком.                                                                                      |
| 2   | SHORT      | Целое число со знаком.                                                                                      |
| 3   | INT        | Целое число со знаком.                                                                                      |
| 4   | LONG       | Целое число со знаком.                                                                                      |
| 5   | FLOAT      | Число с плавающей точкой со знаком.                                                                         |
| 6   | DOUBLE     | Число с плавающей точкой со знаком.                                                                         |
| 7   | BYTE_ARRAY | Массив `byte[]`                                                                                             |
| 8   | STRING     | Строка в кодировке UTF-8.                                                                                   |
| 9   | LIST       | Последовательный список тегов **одного типа**.                                                              |
| 10  | COMPOUND   | Карта именованных тегов NBT различных типов (`Map<String, NBTBase>`). Является корневым тегом любого древа. |
| 11  | INT_ARRAY  | Массив `int[]`                                                                                              |

!!! note ""
    * Подробное описание всех тегов NBT с техническими деталями есть в [Minecraft Wiki](https://minecraft.fandom.com/ru/wiki/NBT).   
      В **Minecraft 1.7.10** отсутствует тег `LONG_ARRAY` – он появился в более поздних версиях игры.
    * Приведённая таблица типов в основном пригодится при использовании метода `NBTTagCompound#hasKey(String, int)` для передачи ID тега вторым параметром.
    * Актуальный ID тега всегда можно подсмотреть прямо в коде игры в методе `getId()` нужного тега.
    * Forge предоставляет вспомогательный класс `net.minecraftforge.common.util.Constants.NBT` с перечислением всех ID тегов.
      Используйте его для улучшения читаемости вашего кода (используется в примерах здесь).

??? danger "Чего делать с NBT категорически нельзя"
    * Список `NBTTagList` может содержать только теги одного типа. При попытке добавить тег другого типа, игра выдаст предупреждение.
    * Не допускайте зацикливания ссылок на теги – это когда дочерние элементы тега могут являться ссылкой на родительский элемент выше.
      Может вызвать ошибку `ConcurrentModificationException`.
    * В `NBTTagCompound` не допускается передавать в качестве значения тега `null` – это приведёт к ошибке `NullPointerException`.

    Допущенные опшлошности проявятся не сразу, а в момент записи данных. 
    Возникновение ошибки прервёт запись данных файл, что приведёт к **повреждению файлов игрового мира**!


## Чтение и запись данных

Первым местом, где потребуется работать с NBT, будет реализация сохранения состояния [Entity](../entity/basics.md) и [TileEntity](../block/tileentity.md).
Сохранение состояния (данных) необходимо чтобы свойства объекта не сбрасывались при выгрузке чанка или выходе из игры.
У приведённых ранее двух объектов это реализуется путём переопределения методов `writeToNBT(NBTTagCompound)` и `readFromNBT(NBTTagCompound)`.
Оба метода получают в качестве аргумента `NBTTagCompound` в который требуется произвести запись или прочитать данные.

!!! note "Примечание"
    Во время сохранения чанка игра всегда формирует полностью новое древо тегов с нуля[^1]. Поэтому теги, которые НЕ были добавлены в момент вызова `writeToNBT()` пропадут.
    Аналогичное произойдёт с тегами, добавленными вручную (например, с помощью редакторов NBT).

Всё же, из данного правила существуют исключения.
`ItemStack#stackTagCompound` и `Entity#getEntityData()` хранят в себе ветвь древа `NBTTagCompound` вместо полного распределения её элементов по полям объекта.
При сохранении данных эта ветвь целиком добавляется к новому древу.
Любые добавленные туда пользовательские данные, будут сохраняться ровно до тех пока вы их оттуда не удалите.
Далее мы будем называть это **тегом свободной формы**.

!!! warning ""
    Не рекомендуется использовать такой приём в своих наработках, поскольку структура NBT имеет не самую высокую скорость доступа к данным.
    Старайтесь распределить все данные тега по полям своих объектов (тайлы, ентити и прочие.).


## Примеры работы с NBT

Ниже приведены примеры записи и чтения различных объектов в NBT, которые могут пригодиться в процессе разработки модификации.


### Работа с тегами

Во избежание краша `ClassCastException`, перед осуществлением доступа к тегам рекомендуется проверять их существование и соответствие нужному типу.
Это касается работы с `NBTTagCompound` и `NBTTagList`.
Особенно это важно при работе **тегом свободной формы** (напр. у `ItemStack`), где можно ожидать всё что угодно.

``` { .java .annotate }
import net.minecraft.item.ItemStack;
import net.minecraft.nbt.NBTTagCompound;
import net.minecraft.nbt.NBTTagList;
import net.minecraftforge.common.util.Constants.NBT;

public void readFromNBT(NBTTagCompound compound) {
  if (compound.hasKey("Items", NBT.TAG_LIST)) { // (1)
    NBTTagList tagList = compound.getTagList("Items", NBT.TAG_COMPOUND); // (2)

    ItemStack[] items = new ItemStack[tagList.tagCount()];
    for (int i = 0; i < items.length; i++) {
      items[i] = ItemStack.loadItemStackFromNBT(tagList.getCompoundTagAt(i));
    }
    // ...
  }
}
```

1. Здесь осуществляется проверка наличия ключа **Items** c типом **LIST**.
2. Получаем `NBTTagList`, содержащий элементы **COMPOUND**. Если элементы будут другого типа, вернёт пустой список.


### ItemStack

Этот пример кода будет использоваться наиболее для сохранения содержимого инвентаря блока и других объектов.

```java
import net.minecraft.init.Items;
import net.minecraft.item.ItemStack;
import net.minecraft.nbt.NBTTagCompound;

ItemStack apple = new ItemStack(Items.apple);

// Запись
NBTTagCompound compound = new NBTTagCompound();
apple.writeToNBT(compound); // Передаём ссылку на тег в который будет осуществлена запись

// Чтение
ItemStack restored = ItemStack.loadItemStackFromNBT(compound); // Может вернуть null если предмет не существует
```


### TileEntity

Обычно сохранением тайлов занимается игра, данный код может пригодиться для сохранения и перемещения тайла в другое место. 

```java
import net.minecraft.nbt.NBTTagCompound;
import net.minecraft.tileentity.TileEntity;

TileEntity tile = new TileEntity();

// Запись
NBTTagCompound compound = new NBTTagCompound();
tile.writeToNBT(compound);

// Чтение
// ПРИМЕЧАНИЕ: При перемещении на другое место, не забудьте изменить значения ключей x,y,z тега на новые координаты
TileEntity restored = TileEntity.createAndLoadEntity(compound);
```


### Entity

Сохранением существ обычно занимается игра. Данный пример может пригодиться, например для консервации моба в банку, чтобы позже заспавнить его в другом месте.

```java
import net.minecraft.entity.Entity;
import net.minecraft.entity.EntityList;
import net.minecraft.nbt.NBTTagCompound;

Entity entity = new Entity(world);

// Запись
NBTTagCompound compound = new NBTTagCompound();
boolean saved = entity.writeToNBTOptional(compound); // Метод вернёт boolean значение в зависимости от того была произведена запись или нет

// Чтение
if (!compound.hasNoTags()) {
    Entity restored = EntityList.createEntityFromNBT(compound, world);
}
```

## Хранение данных в ItemStack

Ранее уже была упомянута возможность хранения пользовательских данных в `ItemStack#stackTagCompound`.
Его можно использовать для хранения уровня заряда предмета, сведений о владельце и других вещей.

Следует упомянуть о зарезервированных универсальных ключах, которые использует Minecraft.
**Вы не должны их использовать** для хранения своих данных в `ItemStack`.

| Ключ      | Тип      | Описание                                                                      |
|-----------|:---------|-------------------------------------------------------------------------------|
| `display` | COMPOUND | Пользовательское имя предмета[^2] и описание.                                 |
| `ench`    | LIST     | Наложенные на предмет чары. Для работы с ними используйте `EnchantmentHelper` |

[^1]: 
    Как осуществляется чтение и запись данных чанка целиком смотрите в исходном коде `AnvilChunkLoader`.
[^2]: 
    Задаётся путём переименования предмета на наковальне.
