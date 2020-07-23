description: Создание собственных инструментов и меча.

# Создание инструментов и меча

## Основа

Для начала создадим четыре класс: ItemToolAxe, ItemToolHoe, ItemToolPickaxe, ItemToolSpade, ItemBestSword

Топор
```java
public class ItemToolAxe extends ItemAxe
{
    public ItemToolAxe(String name, ToolMaterial material)
    {
        //То что указано как 2, 2 это урон и скорость рубки. Можете задать свои значения, но лучше не оставлять данные поля пустыми.
        super(material, 2, 2);
        this.setRegistryName(name);
        this.setUnlocalizedName(name);
    }
}
```

Мотыга
```java
public class ItemToolHoe extends ItemHoe
{
    public ItemToolHoe(String name, ToolMaterial material)
    {
        super(material);
        this.setRegistryName(name);
        this.setUnlocalizedName(name);
    }
}
```

Кирка
```java
public class ItemToolPickaxe extends ItemPickaxe
{
    public ItemToolPickaxe(String name, ToolMaterial material)
    {
        super(material);
        this.setRegistryName(name);
        this.setUnlocalizedName(name);
    }
}
```

Лопата
```java
public class ItemToolSpade extends ItemSpade
{
    public ItemToolSpade(String name, ToolMaterial material)
    {
        super(material);
        this.setRegistryName(name);
        this.setUnlocalizedName(name);
    }
}
```

Меч
```java
public class ItemBestSword extends ItemSword
{
    public ItemBestSword(String name, ToolMaterial material)
    {
        super(material);
        this.setRegistryName(name);
        this.setUnlocalizedName(name);
    }
}
```

Теперь создадим материал.
```java
public static Item.ToolMaterial toolMaterial = EnumHelper.addToolMaterial("tut:tool", 2, 256, 50.0F, 2.0F, 12);
```

* `tut:tool` - это название нашего материала, лучше указывать ещё modid, чтобы не возникало конфликтов с Minecraft.
* `2` - это уровень инструмента для уничтожения того или иного блока.
* `256` - это максимальное число использований(дерево = 59, камень = 131, железо = 250, алмаз = 1561, золото = 32).
* `50.0F` - это эффективность, чем больше значение, тем быстрее ломается блок.
* `2.0F` - это урон, который будет наносится сущностям при ударе нашем инструментом(Для топора мы установили своё значение урона).
* `12` - это уровень который требуется для получения более лучших чар для инструментов.

Регистрируем наши инструменты и меч! Заходим в игру и выдаём себе инструменты и меч, пробуем убить или добыть что либо.