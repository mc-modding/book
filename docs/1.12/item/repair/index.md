description: Починка инструментов.

# Починка инструментов

В прошлой статье мы создали материал, но так до конца с ним и не разобрались.

Материал из прошлой статьи.
```java
public static Item.ToolMaterial toolMaterial = EnumHelper.addToolMaterial("tut:tool", 2, 256, 50.0F, 2.0F, 12);
```

Казалось бы, инструменты и меч есть, но всё равно чего-то не хватает? Как раз починки, нам и не хватает!
Возьмём нашу переменную и добавим к ней метод "setRepairItem()".

```java
public static Item.ToolMaterial toolMaterial = EnumHelper.addToolMaterial("tut:tool", 2, 256, 50.0F, 2.0F, 12).setRepairItem(new ItemStack(Item.getItemFromBlock(Blocks.GOLD_BLOCK)));
```

Данный код создаёт новый стак предметов в котором имеется блок золота.
```java
new ItemStack(Item.getItemFromBlock(Blocks.GOLD_BLOCK));
```

Таким образом мы добавили к нашему материалу предмет, который будет необходим для починки инструментов и меча. Так же вы можете проделать данное действие с ArmorMaterial, задать предмет для починки.

Теперь нам остаётся зайти в игру, изрядно потрепать наши инструменты и меч, и попробовать починить их через наковальню используя блок золота.