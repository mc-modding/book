# NBT

Формат NBT (Named Binary Tag) широко используется Minecraft в различных файлах для хранения данных.
Представляет из себя древовидную структуру данных, состоящую из различных тегов.
Каждый тег имеет идентификатор и название.
Вы регулярно будете сталкиваться с NBT, когда будете реализовывать сохранение и восстановление состояния различных объектов.

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

??? danger "Чего делать с NBT категорически нельзя"
    * Список `NBTTagList` может содержать только теги одного типа. При попытке добавить тег другого типа, игра выдаст предупреждение.
    * Не допускайте зацикливания ссылок на теги – это когда дочерние элементы тега могут являться ссылкой на родительский элемент выше.
      Может вызвать ошибку `ConcurrentModificationException`.
    * В `NBTTagCompound` не допускается передавать в качестве значения тега `null` – это приведёт к ошибке `NullPointerException`.

    Допущенные опшлошности проявятся не сразу, а в момент записи данных. 
    Возникновение ошибки прервёт запись данных файл, что приведёт к **повреждению файлов игрового мира**!

## Примеры работы с NBT

Ниже приведены примеры записи и чтения различных объектов в NBT, которые могут пригодиться в процессе разработки модификации.

### ItemStack

Этот пример кода будет использоваться наиболее для для сохранения содержимого инвентаря блока и других объектов.

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