description: Создание хранилища для жидкости.

# Хранение жидкости

В предыдущих статьях мы рассмотрели основные принципы создания блока, а также хранения в нём данных. В этой статье мы
поговорим про создание своего хранилища для жидкости. Вы можете наследоваться от `TileFluidHandler`, чтобы упростить
себе создание хранилища жидкости, но у `TileFluidHandler` есть ограничение в виде 1000 mB(1 ведро) хранимой жидкости.
Мы же создадим хранилище, которое будет вмещать в себя гораздо больше.

!!! danger "Важно!"
    Статья была написана основываясь на предыдущем, раннее рассмотренном материале статей из серии "Блок". Если у вас
    возникнут какие-либо проблемы, то вы всегда можете посмотреть пример мода в нашем репозитории.

Создадим резервуар для жидкости повторяя предыдущие уроки, реализуя интерфейс `IFluidHandler`.

```java title="Пример TileEntity жидкостного резервуара"
package ru.mcmodding.tutorial.common.tile;

import net.minecraft.nbt.NBTTagCompound;
import net.minecraft.network.NetworkManager;
import net.minecraft.network.Packet;
import net.minecraft.network.play.server.S35PacketUpdateTileEntity;
import net.minecraft.tileentity.TileEntity;
import net.minecraftforge.common.util.ForgeDirection;
import net.minecraftforge.fluids.*;

public class TankFluidTile extends TileEntity implements IFluidHandler {
    // Внутреннее хранилище жидкости
    private final FluidTank fluidTank = new FluidTank(10_000);

    /**
     * Заполняет жидкость во внутренние резервуары, распределение полностью остается за IFluidHandler.
     *
     * @param from ориентация, из которой закачивается жидкость.
     * @param resource FluidStack, представляющий собой жидкость и максимальное количество жидкости, подлежащее заполнению.
     * @param doFill если значение false, заливка будет только имитироваться.
     * @return Кол-во жидкости, на которое был (или был бы, если бы было имитировано) заполнен резервуар.
     */
    @Override
    public int fill(ForgeDirection from, FluidStack resource, boolean doFill) {
        return fluidTank.fill(resource, doFill);
    }

    /**
     * Сливает жидкость из внутренних резервуаров, распределение полностью остается за IFluidHandler.
     *
     * @param from ориентация, в которую будет сливаться жидкость.
     * @param resource FluidStack, представляющий жидкость и максимальное количество жидкости, подлежащее сливу.
     * @param doDrain если значение false, то слив будет только имитироваться.
     * @return FluidStack, представляющий жидкость и кол-во, которое было (или было бы, если бы было имитировано) слито из резервуара.
     */
    @Override
    public FluidStack drain(ForgeDirection from, FluidStack resource, boolean doDrain) {
        if (resource == null || !resource.isFluidEqual(fluidTank.getFluid())) {
            return null;
        }
        return fluidTank.drain(resource.amount, doDrain);
    }

    /**
     * Сливает жидкость из внутренних резервуаров, распределение полностью остается за IFluidHandler.
     * Этот метод не чувствителен к жидкости.
     *
     * @param from ориентация, в которую будет сливаться жидкость.
     * @param maxDrain максимальное количество жидкости для слива.
     * @param doDrain если значение false, то слив будет только имитироваться.
     * @return FluidStack, представляющий жидкость и кол-во, которое было (или было бы, если бы было имитировано) слито.
     */
    @Override
    public FluidStack drain(ForgeDirection from, int maxDrain, boolean doDrain) {
        return fluidTank.drain(maxDrain, doDrain);
    }

    /**
     * Возвращает значение true, если данная жидкость может быть введена в заданном направлении.
     * Более формально, это должно возвращать значение true, если жидкость может поступать с заданного направления.
     *
     * @param from ориентация, в которую будет закачиваться жидкость.
     * @param fluid жидкость, которая будет поступать.
     * @return Возвращает логическое значение.
     */
    @Override
    public boolean canFill(ForgeDirection from, Fluid fluid) {
        return true;
    }

    /**
     * Возвращает значение true, если данная жидкость может быть извлечена из заданного направления.
     * Более формально, это должно возвращать значение true, если жидкость может выходить из заданного направления.
     *
     * @param from ориентация, в которую будет сливаться жидкость.
     * @param fluid жидкость, которая будет сливаться.
     * @return Возвращает логическое значение.
     */
    @Override
    public boolean canDrain(ForgeDirection from, Fluid fluid) {
        return true;
    }

    /**
     * Возвращает массив внутренних резервуаров. Эти объекты нельзя использовать
     * для манипулирования внутренними резервуарами. Смотрите {@link FluidTankInfo}.
     *
     * @param from ориентация, определяющая, какие резервуары следует запрашивать.
     * @return Информация для соответствующих внутренних резервуаров.
     */
    @Override
    public FluidTankInfo[] getTankInfo(ForgeDirection from) {
        return new FluidTankInfo[] { fluidTank.getInfo() };
    }

    /**
     * Кол-во жидкости находящееся в резервуаре.
     *
     * @return Возвращает кол-во жидкости.
     */
    public int getAmount() {
        return fluidTank.getFluidAmount();
    }

    /**
     * Вместимость резервуара.
     *
     * @return Возвращает кол-во вмещаемой жидкости в резервуаре.
     */
    public int getCapacity() {
        return fluidTank.getCapacity();
    }

    private void writeExtendedData(NBTTagCompound nbt) {
        // Записываем данные резервуара в NBT
        fluidTank.writeToNBT(nbt);
    }

    private void readExtendedData(NBTTagCompound nbt) {
        // Читает данные резервуара из NBT
        fluidTank.readFromNBT(nbt);
    }
}
```

Разберём подробнее, что такое `FluidTank`. Данный класс реализует интерфейс `IFluidTank` и является своего рода "основой",
которую вы можете использовать, передавая в конструктор такие данные как: стек жидкости, кол-во жидкости для хранения или же
кол-во уже хранящийся жидкости.

Доступные конструкторы для `FluidTank`:

* `FluidTank(Integer)` - создаёт пустой резервуар с заданной вместимостью.
* `FluidTank(FluidStack, Integer)` - создаёт резервуар с заданной вместимостью и заполненный жидкостью из `FluidStack`.
* `FluidTank(Fluid, Integer, Integer)` - создаёт резервуар с заданной вместимостью и заполненный жидкость `Fluid` в кол-ве `amount`.

!!! info "Информация"
    В большинстве случаев мы рекомендуем использовать уже готовый `FluidTank` от MinecraftForge, чтобы избежать проблем
    возникших при реализации `IFluidTank`.

Создадим предмет, который будет хранить в себе жидкость, а также зарегистрируем его!

```java title="Пример жидкостной ячейки"
package ru.mcmodding.tutorial.common.item.tool;

import cpw.mods.fml.relauncher.Side;
import cpw.mods.fml.relauncher.SideOnly;
import net.minecraft.entity.player.EntityPlayer;
import net.minecraft.item.ItemStack;
import net.minecraftforge.fluids.FluidStack;
import net.minecraftforge.fluids.ItemFluidContainer;
import ru.mcmodding.tutorial.common.handler.ModTab;

import java.util.List;

public class FluidCellItem extends ItemFluidContainer {
    public FluidCellItem() {
        // Первое значение ни на что не влияет, вторым значением является кол-во вмещаемой жидкости.
        super(0, 5_000);
        setUnlocalizedName("fluid_cell");
        setTextureName("fluid_cell");
        setCreativeTab(ModTab.INSTANCE);
    }
    
    @Override
    @SideOnly(Side.CLIENT)
    public void addInformation(ItemStack stack, EntityPlayer holder, List tooltip, boolean isAdv) {
        // Воспользуемся уже готовым методом для получения стека жидкости.
        FluidStack fluidStack = getFluid(stack);
        if (fluidStack != null) {
            tooltip.add(fluidStack.amount + " / " + capacity + " mB (" + fluidStack.getLocalizedName() + ")");
        } else {
            tooltip.add("<empty>");
        }
    }
}
```

Осталось создать блок, в котором будет обрабатываться логика заполнения резервуара, а также отрисовку для отображения
кол-ва вмещаемой и хранящейся жидкости.

```java title="Пример блока-резервуара"
package ru.mcmodding.tutorial.common.block.fluid;

import net.minecraft.block.BlockContainer;
import net.minecraft.block.material.Material;
import net.minecraft.entity.player.EntityPlayer;
import net.minecraft.init.Items;
import net.minecraft.item.ItemStack;
import net.minecraft.tileentity.TileEntity;
import net.minecraft.world.World;
import net.minecraftforge.common.util.ForgeDirection;
import net.minecraftforge.fluids.FluidContainerRegistry;
import net.minecraftforge.fluids.FluidStack;
import ru.mcmodding.tutorial.McModding;
import ru.mcmodding.tutorial.common.handler.ModItems;
import ru.mcmodding.tutorial.common.handler.ModTab;
import ru.mcmodding.tutorial.common.item.tool.FluidCellItem;
import ru.mcmodding.tutorial.common.tile.TankFluidTile;

public class TankFluidBlock extends BlockContainer {
    public TankFluidBlock() {
        super(Material.iron);
        setBlockName("tank_fluid");
        setBlockTextureName(McModding.MOD_ID + ":tank_fluid");
        setCreativeTab(ModTab.INSTANCE);
    }

    @Override
    public boolean onBlockActivated(World world, int x, int y, int z, EntityPlayer activator, int side, float hitX, float hitY, float hitZ) {
        if (world.isRemote) {
            return true;
        }

        TileEntity tile = world.getTileEntity(x, y, z);

        if (tile instanceof TankFluidTile) {
            ItemStack held = activator.getHeldItem();

            if (held == null) {
                return false;
            }

            if (held.getItem() == ModItems.FLUID_CELL) {
                handleFillCell((TankFluidTile) tile, held);
            } else if (held.getItem() == Items.bucket) {
                handleFillBucket((TankFluidTile) tile, activator, held);
            } else {
                handleFillFluidTank((TankFluidTile) tile, activator, held);
            }
        }
        return true;
    }

    @Override
    public TileEntity createNewTileEntity(World world, int metadata) {
        return new TankFluidTile();
    }

    /**
     * Данный метод будет вызываться для заполнения {@link ModItems#FLUID_CELL}
     *
     * @param tank резервуар с жидкостью.
     * @param held стек предмета находящийся в руке.
     */
    private void handleFillCell(TankFluidTile tank, ItemStack held) {
        // Пробуем выкачать жидкость из резервуара без явного уменьшения кол-ва жидкости
        FluidStack fluidStack = tank.drain(ForgeDirection.UP, FluidContainerRegistry.BUCKET_VOLUME, false);
        // Если стек не равен null и кол-во жидкости больше 0, то заливаем жидкость в жидкостную ячейку
        // Прежде чем заполнить, необходимо проверить, можем ли мы заполнить ячейку, без явного заполнения оной
        if (fluidStack != null && fluidStack.amount > 0 && ((FluidCellItem) held.getItem()).fill(held, fluidStack, false) > 0) {
            // Если всё прошло успешно, то необходимо явно выкачать из резервуара жидкость и заполнить ячейку
            fluidStack = tank.drain(ForgeDirection.UP, FluidContainerRegistry.BUCKET_VOLUME, true);
            // Заполняем явно ячейку для жидкости
            ((FluidCellItem) held.getItem()).fill(held, fluidStack, true);
            // Сохраняем и синхронизируем данные с клиентом
            tank.markDirty();
            tank.getWorldObj().markBlockForUpdate(tank.xCoord, tank.yCoord, tank.zCoord);
        }
    }

    /**
     * Данный метод будет вызываться для заполнения пустого ведра.
     *
     * @param tank резервуар с жидкостью.
     * @param player игрок взаимодействующий с блоком.
     * @param held стек предмета находящийся в руке.
     */
    private void handleFillBucket(TankFluidTile tank, EntityPlayer player, ItemStack held) {
        FluidStack fluidStack = tank.drain(ForgeDirection.UP, FluidContainerRegistry.BUCKET_VOLUME, false);
        if (fluidStack != null && fluidStack.amount > 0) {
            fluidStack = tank.drain(ForgeDirection.UP, FluidContainerRegistry.BUCKET_VOLUME, true);

            if (!player.capabilities.isCreativeMode) {
                addItemStackOrDrop(player, FluidContainerRegistry.fillFluidContainer(fluidStack, held));
                --held.stackSize;
            }

            tank.markDirty();
            tank.getWorldObj().markBlockForUpdate(tank.xCoord, tank.yCoord, tank.zCoord);
        }
    }

    /**
     * Данный метод будет вызываться для заполнения резервуара жидкостью из ведра/жидкостной ячейки.
     *
     * @param tile резервуар с жидкостью.
     * @param player игрок взаимодействующий с блоком.
     * @param held стек предмета находящийся в руке.
     */
    private void handleFillFluidTank(TankFluidTile tile, EntityPlayer player, ItemStack held) {
        // Получаем жидкость из контейнера по стеку предмета
        FluidStack fluidStack = FluidContainerRegistry.getFluidForFilledItem(held);
        // Проверяем, что мы можем заполнить резервуар жидкостью, без явного заполнения
        if (tile.fill(ForgeDirection.UP, fluidStack, false) > 0) {
            // Заполняем резервуар явно
            tile.fill(ForgeDirection.UP, fluidStack, true);

            if (!player.capabilities.isCreativeMode) {
                addItemStackOrDrop(player, FluidContainerRegistry.drainFluidContainer(held));
                --held.stackSize;
            }

            tile.markDirty();
            tile.getWorldObj().markBlockForUpdate(tile.xCoord, tile.yCoord, tile.zCoord);
        }
    }

    /**
     * Данный метод служит для выдачи стека предмета в инвентарь с синхронизацией, если стек не удалось выдать, то предмет
     * будет выброшен на землю.
     *
     * @param player игрок, которому будет выдан стек предмета.
     * @param stack стек, который будет выдан.
     */
    private void addItemStackOrDrop(EntityPlayer player, ItemStack stack) {
        if (!player.inventory.addItemStackToInventory(stack)) {
            player.dropPlayerItemWithRandomChoice(stack, false);
        } else {
            player.openContainer.detectAndSendChanges();
        }
    }
}
```

Небольшой бонус того, как мы будем выводить кол-во хранящейся жидкости и вместимость резервуара.

```java title="Пример отрисовки жидкостного резервуара"
package ru.mcmodding.tutorial.client.render.tile;

import net.minecraft.client.Minecraft;
import net.minecraft.client.renderer.tileentity.TileEntitySpecialRenderer;
import net.minecraft.tileentity.TileEntity;
import ru.mcmodding.tutorial.common.tile.TankFluidTile;

import static org.lwjgl.opengl.GL11.*;

public class TankFluidTesr extends TileEntitySpecialRenderer {
    @Override
    public void renderTileEntityAt(TileEntity tile, double x, double y, double z, float delta) {
        TankFluidTile tankFluid = (TankFluidTile) tile;

        glPushMatrix();
        glTranslated(x + 1, y + 1, z - 0.001);
        // Необходимая "инверсия", чтобы правильно отображался текст
        glScalef(-0.01F, -0.01F, 1F);
        Minecraft.getMinecraft().fontRenderer.drawString(tankFluid.getAmount() + " / " + tankFluid.getCapacity() + " mB", 0, 0, 0xFFFFFF);
        glPopMatrix();
    }
}
```

Регистрируем наш `TankFluidTile`, `TankFluidBlock` и отрисовку `TankFluidTile`, как мы делали ранее. Зайдя в игру, вы
можете взять вёдра с ранее созданными нами жидкостями и попробовать заполнить резервуар для жидкости, а также можете
попробовать выкачать жидкость с помощью пустого ведра или же жидкостной ячейки.

![Жидкостный резервуар в мире](images/fluid_tank_world.png)