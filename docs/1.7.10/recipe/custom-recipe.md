description: Добавление собственного рецепта.

# Собственный рецепт

Если стандартных рецептов вам мало, то вы можете создать собственный рецепт. Для создания собственного рецепта
необходимо реализовать интерфейс `IRecipe`.

Добавим новый предмет `Whetstone` или `точильный камень`, который мы будем использовать при крафте для накладывания и
удаления чар с предметов.

```java title="WhetstoneItem.java"
package ru.mcmodding.tutorial.common.item;

import cpw.mods.fml.relauncher.Side;
import cpw.mods.fml.relauncher.SideOnly;
import net.minecraft.client.renderer.texture.IIconRegister;
import net.minecraft.item.Item;
import net.minecraft.item.ItemStack;
import net.minecraft.util.IIcon;
import net.minecraft.util.MathHelper;
import ru.mcmodding.tutorial.McModding;
import ru.mcmodding.tutorial.common.handler.ModTab;

public class WhetstoneItem extends Item {
    private final String name;

    @SideOnly(Side.CLIENT)
    private IIcon[] damagedIcons;

    public WhetstoneItem(String name, int maxDamage) {
        this.name = name;
        setMaxStackSize(1);
        setUnlocalizedName(name);
        setTextureName(String.format("%s:%s/default", McModding.MOD_ID, name));
        setCreativeTab(ModTab.INSTANCE);
        setMaxDamage(maxDamage);
        setNoRepair();
    }

    /**
     * Разрешить или запретить определенную комбинацию книги/предмета в качестве заклинания наковальни.
     *
     * @param stack стек предмета для зачаривания.
     * @param book книга с чарами.
     *
     * @return Возвращает логическое значение.
     */
    @Override
    public boolean isBookEnchantable(ItemStack stack, ItemStack book) {
        return false;
    }

    /**
     * Возвращает true, если предмет содержит предмет-контейнер.
     *
     * @param stack текущий стек предмета.
     * @return Возвращает логическое значение.
     */
    @Override
    public boolean hasContainerItem(ItemStack stack) {
        return true;
    }

    /**
     * Возвращает стек с предметом-контейнером, который содержит в себе какую-либо информацию. Используется для получения
     * результата крафта.
     *
     * @param stack текущий стек предмета.
     *
     * @return Возвращает стек с предметом-контейнером.
     */
    @Override
    public ItemStack getContainerItem(ItemStack stack) {
        ItemStack stackCopy = stack.copy();
        stackCopy.setItemDamage(stackCopy.getItemDamage() + 1);
        return stackCopy.getItemDamage() >= stackCopy.getMaxDamage() ? null : stackCopy;
    }

    /**
     * Возвращает условие, что предмет должен покинуть сетку крафта, при получении результата (предмет будет удалён).
     *
     * @param stack стек предмета.
     *
     * @return Возвращает логическое значение.
     */
    @Override
    public boolean doesContainerItemLeaveCraftingGrid(ItemStack stack) {
        return false;
    }

    @Override
    @SideOnly(Side.CLIENT)
    public void registerIcons(IIconRegister register) {
        super.registerIcons(register);
        damagedIcons = new IIcon[5];
        for (int count = 0; count < 5; count++) {
            damagedIcons[count] = register.registerIcon(String.format("%s:%s/damage_%d", McModding.MOD_ID, name, count));
        }
    }

    @Override
    @SideOnly(Side.CLIENT)
    public IIcon getIconFromDamage(int itemDamage) {
        // На основе процента прочности, зададим "уровни" разрушаемости предмета через иконки.
        int segment = MathHelper.floor_float(((float) itemDamage / getMaxDamage()) * 10) / 2;
        return itemDamage == 0 ? itemIcon : damagedIcons[segment];
    }
}
```

В конструктор класса мы будем передавать название для нашего точильного камня и максимальную его прочность. Прочность
будет меняться после каждого получения результата крафта. Хотим обратить ваше внимание на то, что мы предусмотрели
некоторые возможные "хаки" и установили предмету не ремонтопригодность с помощью метода `Item#setNoRepair`, а также
мы запретили зачаровывать наш предмет книгами с чарами, переопределив метод `Item#isBookEnchantable` и вернув в нём `false`.

```java title="Регистрация двух точильных камней"
package ru.mcmodding.tutorial.common.handler;

import cpw.mods.fml.common.registry.GameRegistry;
import ru.mcmodding.tutorial.common.item.*;

public class ModItems {
    /* Другое */
    public static final WhetstoneItem WHETSTONE = new WhetstoneItem("whetstone", 50);
    public static final WhetstoneItem ANTI_ENCHANT_WHETSTONE = new WhetstoneItem("anti_enchant_whetstone", 70);

    public static void register() {
        GameRegistry.registerItem(WHETSTONE, "whetstone");
        GameRegistry.registerItem(ANTI_ENCHANT_WHETSTONE, "anti_enchant_whetstone");
    }
}
```

Создадим рецепт точильного камня, который будет позволять накладывать
и снимать чары с инструментов.

```java title="WhetstoneRecipe.java"
package ru.mcmodding.tutorial.common.handler.recipe;

import net.minecraft.enchantment.Enchantment;
import net.minecraft.inventory.InventoryCrafting;
import net.minecraft.item.ItemStack;
import net.minecraft.item.crafting.IRecipe;
import net.minecraft.world.World;
import ru.mcmodding.tutorial.common.handler.ModItems;
import ru.mcmodding.tutorial.common.item.WhetstoneItem;

import java.util.concurrent.ThreadLocalRandom;

public class WhetstoneRecipe implements IRecipe {
    private final ThreadLocalRandom random = ThreadLocalRandom.current();
    private final Enchantment[] availableEnchantments = {
        Enchantment.sharpness, Enchantment.smite, Enchantment.baneOfArthropods
    };

    /**
     * Используется для проверки соответствия рецепта текущему инвентарю для крафта.
     *
     * @param inventory инвентарь для крафта.
     * @param world текущий мир.
     *
     * @return Возвращает логическое значение соответствия рецепта.
     */
    @Override
    public boolean matches(InventoryCrafting inventory, World world) {
        ItemStack whetstone = null;
        ItemStack tool = null;

        for (int slotId = 0, size = inventory.getSizeInventory(), notEmpty = 0; slotId < size; slotId++) {
            ItemStack stackInSlot = inventory.getStackInSlot(slotId);

            if (stackInSlot == null) {
                continue;
            }
            if (++notEmpty > 2) {
                return false;
            }

            if (whetstone == null && stackInSlot.getItem() instanceof WhetstoneItem) {
                whetstone = stackInSlot;
            } else if (tool == null && (stackInSlot.isItemEnchanted() || stackInSlot.isItemEnchantable())) {
                tool = stackInSlot;
                if (!stackInSlot.getItem().doesContainerItemLeaveCraftingGrid(tool)) {
                    return false;
                }
            }
        }
        return whetstone != null && tool != null && whetstone.getItem() != tool.getItem();
    }

    /**
     * Данный метод вызывается для получения результата крафта по текущему инвентарю крафта.
     *
     * @return Возвращает стек предмета.
     */
    @Override
    public ItemStack getCraftingResult(InventoryCrafting inventory) {
        ItemStack whetstone = null;
        ItemStack tool = null;

        for (int slotId = 0, size = inventory.getSizeInventory(); slotId < size; slotId++) {
            ItemStack stackInSlot = inventory.getStackInSlot(slotId);

            if (stackInSlot == null) {
                continue;
            }

            if (whetstone == null && stackInSlot.getItem() instanceof WhetstoneItem) {
                whetstone = stackInSlot;
            } else if (stackInSlot.isItemEnchanted() || stackInSlot.isItemEnchantable()) {
                tool = stackInSlot;
                break;
            }
        }

        if (whetstone != null && tool != null && whetstone.getItem() != tool.getItem()) {
            if (!tool.getItem().doesContainerItemLeaveCraftingGrid(tool)) {
                return null;
            }

            if (whetstone.getItem() == ModItems.WHETSTONE && tool.isItemEnchantable()) {
                return handleDisenchantedTool(tool);
            } else if (whetstone.getItem() == ModItems.ANTI_ENCHANT_WHETSTONE && tool.isItemEnchanted()) {
                return handleEnchantedTool(tool);
            }
        }
        return null;
    }

    /**
     * Данный метод возвращает размер используемых слотов рецептом.
     *
     * @return Возвращает кол-во используемых слотов.
     */
    @Override
    public int getRecipeSize() {
        return 2;
    }

    /**
     * Данный метод возвращает стек предмета, который будет получен при крафте. Используется для заготовленного, выходящего
     * стека предмета, как в ShapedRecipe и т.п.
     *
     * @return Возвращает стек предмета.
     */
    @Override
    public ItemStack getRecipeOutput() {
        return null;
    }

    /**
     * Вызывается для удаления чар с инструмента.
     *
     * @param tool стек инструмента.
     * @return Возвращает копию стека инструмента без чар.
     */
    private ItemStack handleEnchantedTool(ItemStack tool) {
        ItemStack toolCopy = tool.copy();
        toolCopy.getTagCompound().removeTag("ench");
        return toolCopy;
    }

    /**
     * Вызывается для зачаривания инструмента по заготовленным чарам.
     *
     * @param tool стек инструмента.
     * @return Возвращает копию стека инструмента с чарами.
     */
    private ItemStack handleDisenchantedTool(ItemStack tool) {
        ItemStack toolCopy = tool.copy();
        Enchantment enchantment = availableEnchantments[random.nextInt(availableEnchantments.length)];
        toolCopy.addEnchantment(enchantment, random.nextInt(enchantment.getMinLevel(), enchantment.getMaxLevel()));
        return toolCopy;
    }
}
```

Обратите внимание, что наш рецепт использует всего два слота, один для точильного камня, второй для инструмента.
В случае, если предметов более трёх, то необходимо вернуть `false` для `IRecipe#matches`, иначе при крафте, лишние
предметы будут удалены.

При создании рецепта, если вы хотите изменять предмет используемый в сетке крафта, то всегда необходимо делать
его копию, прежде чем возвращать стек предмета, иначе вы можете столкнуться с багом, позволяющим бесплатно получать
те или иные свойства к предмету.

!!! danger "Важно!"
    В предметах существует такой метод как `Item#doesContainerItemLeaveCraftingGrid(ItemStack)`, который возвращает
    логическое значение. Обычно метод возвращает `true`, что говори о том, что предмет будет удалён после получения
    результата крафта, но авторы некоторых модов используют данный метод для создания пере используемых предметов.
    Это необходимо учитывать, чтобы избежать возможных дюпов или иных багов!

Регистрация осуществляется за счёт вызова метода `GameRegistry#addRecipe(IRecipe)`.

```java title="Регистрация рецепта"
package ru.mcmodding.tutorial.common.handler;

import cpw.mods.fml.common.registry.GameRegistry;
import net.minecraft.init.Blocks;
import net.minecraft.init.Items;
import net.minecraft.item.ItemStack;
import net.minecraftforge.oredict.OreDictionary;
import net.minecraftforge.oredict.ShapedOreRecipe;
import net.minecraftforge.oredict.ShapelessOreRecipe;
import ru.mcmodding.tutorial.common.handler.recipe.WhetstoneRecipe;

public class ModRecipes {
    public static void registerRecipes() {
        // ...
        
        GameRegistry.addRecipe(new WhetstoneRecipe());
    }
}
```
