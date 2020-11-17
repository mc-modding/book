# Инструменты и меч
## Подготовка
У инструментов существуют свои классы, конструктор которых, к сожалению, помечен как `protected`. Поэтому нам придется создать наследников с публичными конструкторами:

**Кирка**
```java
package ru.mcmodding.fabrictut.item;

import net.minecraft.item.PickaxeItem;
import net.minecraft.item.ToolMaterial;

public class CustomPickaxeItem extends PickaxeItem {
    public CustomPickaxeItem(ToolMaterial material, int attackDamage, float attackSpeed, Settings settings) {
        super(material, attackDamage, attackSpeed, settings);
    }
}

```
**Топор**
```java
package ru.mcmodding.fabrictut.item;

import net.minecraft.item.AxeItem;
import net.minecraft.item.ToolMaterial;

public class CustomAxeItem extends AxeItem {
    public CustomAxeItem(ToolMaterial material, float attackDamage, float attackSpeed, Settings settings) {
        super(material, attackDamage, attackSpeed, settings);
    }
}
```
**Лопата**
```java
package ru.mcmodding.fabrictut.item;

import net.minecraft.item.ShovelItem;
import net.minecraft.item.ToolMaterial;

public class CustomShovelItem extends ShovelItem {
    public CustomShovelItem(ToolMaterial material, float attackDamage, float attackSpeed, Settings settings) {
        super(material, attackDamage, attackSpeed, settings);
    }
}

```
**Мотыга**
```java
package ru.mcmodding.fabrictut.item;

import net.minecraft.item.HoeItem;
import net.minecraft.item.ToolMaterial;

public class CustomHoeItem extends HoeItem {
    public CustomHoeItem(ToolMaterial material, int attackDamage, float attackSpeed, Settings settings) {
        super(material, attackDamage, attackSpeed, settings);
    }
}

```
## Создание материала
Вместо обычных материалов создадим перечисление. Это удобно, поскольку мы сможем добавлять новые материалы в дальнейшем быстро и просто:
```java
package ru.mcmodding.fabrictut.item;

import net.minecraft.item.ItemStack;
import net.minecraft.item.Items;
import net.minecraft.item.ToolMaterial;
import net.minecraft.recipe.Ingredient;
import net.minecraft.util.Lazy;

import java.util.function.Supplier;

public enum FTutToolMaterials implements ToolMaterial {
    SLIME(2, 256, 0.5F, 3.5F, 15, () -> {
        return Ingredient.ofStacks(new ItemStack(Items.SLIME_BALL));
    });
    // уровень копания, прочность, скорость добычи, урон, зачароваываемость

    private final int miningLevel;
    private final int itemDurability;
    private final float miningSpeed;
    private final float attackDamage;
    private final int enchantability;
    private final Lazy<Ingredient> repairIngredient;

    FTutToolMaterials(int miningLevel, int itemDurability, float miningSpeed, float attackDamage, int enchantability, Supplier<Ingredient> repairIngredient) {
        this.miningLevel = miningLevel;
        this.itemDurability = itemDurability;
        this.miningSpeed = miningSpeed;
        this.attackDamage = attackDamage;
        this.enchantability = enchantability;
        this.repairIngredient = new Lazy<>(repairIngredient);
    }

    // прочность
    public int getDurability() {
        return this.itemDurability;
    }

    // скорость копания
    public float getMiningSpeedMultiplier() {
        return this.miningSpeed;
    }

    // урон
    public float getAttackDamage() {
        return this.attackDamage;
    }

    // уровень копания
    public int getMiningLevel() {
        return this.miningLevel;
    }

    // уровень, который требуется для получения более высокого уровня чар
    public int getEnchantability() {
        return this.enchantability;
    }

    // предмет для починки
    public Ingredient getRepairIngredient() {
        return this.repairIngredient.get();
    }
}
```

* `2` - это уровень инструмента для уничтожения того или иного блока.
* `256` - это максимальное число использований(дерево = 59, камень = 131, железо = 250, алмаз = 1561, золото = 32).
* `0.5F` - это эффективность, чем больше значение, тем быстрее ломается блок.
* `3.5F` - это урон, который будет наноситься сущностям при ударе нашим инструментом(Для топора мы установили своё значение урона).
* `15` - это уровень, который требуется для получения более высокого уровня чар.

## Регистрация
В классе с предметами регистрируем наши инструменты:
```java
    public static final Item SLIME_SWORD = registerItem("slime_sword", new SwordItem(FTutToolMaterials.SLIME, 3, 2.5F, new FabricItemSettings().group(FabricTutorial.TUTORIAL_GROUP)));
    public static final Item SLIME_AXE = registerItem("slime_axe", new CustomAxeItem(FTutToolMaterials.SLIME, 6.5F, 0.5F, new FabricItemSettings().group(FabricTutorial.TUTORIAL_GROUP)));
    public static final Item SLIME_PICKAXE = registerItem("slime_pickaxe", new CustomPickaxeItem(FTutToolMaterials.SLIME, 1, 0.9F, new FabricItemSettings().group(FabricTutorial.TUTORIAL_GROUP)));
    public static final Item SLIME_SHOVEL = registerItem("slime_shovel", new CustomShovelItem(FTutToolMaterials.SLIME, 2, 0.8F, new FabricItemSettings().group(FabricTutorial.TUTORIAL_GROUP)));
    public static final Item SLIME_HOE = registerItem("slime_hoe", new CustomHoeItem(FTutToolMaterials.SLIME, 2, 0.8F, new FabricItemSettings().group(FabricTutorial.TUTORIAL_GROUP)));
```
На примере меча: `FTutToolMaterials.SLIME, 3, 2.5F, new FabricItemSettings().group(FabricTutorial.TUTORIAL_GROUP)`
* FTutToolMaterials.SLIME - наш материал
* 3 - урон
* 2.5F - скорость атаки
* FabricItemSettings - настройки предмета

## Модель
От модели обычного предмета модель инструментов отличается тем, что `parent` у неё не `item/generated`, а `item/handheld`
```json
{
  "parent": "minecraft:item/handheld",
  "textures": {
    "layer0": "fabrictut:item/slime_sword"
  }
}
```