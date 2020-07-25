description: Создание собственных инструментов и меча.

# Создание инструментов и меча

## Основа

Для начала создадим четыре класса: ItemToolAxe, ItemToolHoe, ItemToolPickaxe, ItemToolSpade, ItemBestSword

Топор
```java
public class ItemToolAxe extends AxeItem
{
    public ItemToolAxe()
    {
        super(ItemTier.IRON, 6.0F, 1.1F, new Properties());
    }
}
```

Мотыга
```java
public class ItemToolHoe extends HoeItem
{
    public ItemToolHoe()
    {
		super(ItemTier.IRON, 1.1F, new Properties());
    }
}
```

Кирка
```java
public class ItemToolPickaxe extends PickaxeItem
{
    public ItemToolPickaxe()
    {
        super(ItemTier.IRON,  6,1.1F, new Properties());
    }
}
```

Лопата
```java
public class ItemToolShovel extends ShovelItem
{
    public ItemToolSpade()
    {
        super(ItemTier.IRON,  6,1.1F, new Properties());
    }
}
```

Меч
```java
public class ItemBestSword extends SwordItem
{
    public ItemBestSword()
    {
        super(ItemTier.IRON,  12,2F, new Properties());
    }
}
```

Регистрируем наши инструменты и меч! Заходим в игру и выдаём себе инструменты и меч, пробуем убить или добыть что либо. Для корректного положения в руке игрока наследуйте модель от `item/handheld` вместо `item/generated`.