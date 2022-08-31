description: Tile Entity

# Tile Entity

Tile Entity - это своего рода "ячейка" памяти хранящая NBT данные на позиции блока. С помощью Tile Entity создаются
механизмы такие как: печка, сундук, выбрасыватель, воронка и др. Данный вариант хранения данных блока более эффективен
для большого кол-ва информации, но у него есть свои недостатки, которые решаются по мере написания кода.

В данной статье вы научитесь хранить данные в Tile Entity, а также создадите свой первый механизм, который будет выполнять
минимальные действия для получения какого-либо результата.

Создадим класс и унаследуемся от `BlockContainer`.

!!! info "Информация"
    В большинстве случаев `BlockContainer` будет использоваться вами постоянно, но для достижения лучшего масштабирования
    кода вашего мода, мы рекомендуем реализовывать интерфейс `ITileEntityProvider`(пример реализации можно посмотреть в `BlockContainer`)

```java
package ru.mcmodding.tutorial.common.block;

import net.minecraft.block.BlockContainer;
import net.minecraft.block.material.Material;
import net.minecraft.tileentity.TileEntity;
import net.minecraft.world.World;
import ru.mcmodding.tutorial.McModding;
import ru.mcmodding.tutorial.common.handler.ModTab;

public class StorageBlock extends BlockContainer {
    public StorageBlock() {
        super(Material.wood);
        setBlockName("storage");
        setBlockTextureName(McModding.MOD_ID + ":storage");
        setCreativeTab(ModTab.INSTANCE);
    }

    /**
     * Данный метод отвечает за создание Tile Entity.
     *
     * @param world     мир в котором расположен блок.
     * @param metadata  метаданные блока
     * @return Возвращает новый экземпляр Tile Entity
     */
    @Override
    public TileEntity createNewTileEntity(World world, int metadata) {
        return null;
    }
}
```

Далее необходимо создать класс `StorageTile` и наследовать в нём от `TileEntity`.

```java
package ru.mcmodding.tutorial.common.tile;

import net.minecraft.tileentity.TileEntity;

public class StorageTile extends TileEntity {

}
```

Вернём в методе `BlockContainer#createNewTileEntity` объект класса `StorageTile`.

```java
package ru.mcmodding.tutorial.common.block;

import net.minecraft.block.BlockContainer;
import net.minecraft.tileentity.TileEntity;
import net.minecraft.world.World;
import ru.mcmodding.tutorial.common.tile.StorageTile;

public class StorageBlock extends BlockContainer {
    @Override
    public TileEntity createNewTileEntity(World world, int metadata) {
        return new StorageTile();
    }
}
```

Регистрация Tile Entity происходит аналогично с блоками и предметами.

```java
package ru.mcmodding.tutorial.common.handler;

import cpw.mods.fml.common.registry.GameRegistry;
import ru.mcmodding.tutorial.McModding;
import ru.mcmodding.tutorial.common.tile.StorageTile;

public class ModBlocks {
    public static void register() {
        GameRegistry.registerTileEntity(StorageTile.class, McModding.MOD_ID + ":storage");
    }
}
```

!!! info "Информация"
    Мы рекомендуем указывать `ModId` во время регистрации Tile Entity, так как MinecraftForge не продумали момент регистрации
    и следовательно, если не использовать `ModId`, то есть высокая вероятность, что название вашего Tile Entity может пересечься
    с Tile Entity из других модов.

Теперь мы можем добавить какую-нибудь логику для работы нашего хранилища. Давайте добавим возможность класть и забирать
предмет из хранилища. Для этого переопределим метод `Block#`

```java
package ru.mcmodding.tutorial.common.block;

import net.minecraft.block.BlockContainer;
import net.minecraft.entity.player.EntityPlayer;
import net.minecraft.tileentity.TileEntity;
import net.minecraft.world.World;
import ru.mcmodding.tutorial.common.tile.StorageTile;

public class StorageBlock extends BlockContainer {
    /**
     * Вызывается когда игрок, нажимает по блоку правой кнопкой мыши.
     *
     * @param world         мир в котором установлен блок.
     * @param x             позиция блока по X координате.
     * @param y             позиция блока по Y координате.
     * @param z             позиция блока по Z координате.
     * @param activator     игрок, который взаимодействует с блоком.
     * @param side          сторона блока по которой было произведён клик.
     * @param hitX          позицию на блоке, на которой производилось нажатие по X координате.
     * @param hitY          позицию на блоке, на которой производилось нажатие по Y координате.
     * @param hitZ          позицию на блоке, на которой производилось нажатие по Z координате.
     * @return Возвращает true/false если блок был активирован. Если блок не был активирован(false), то если в руке находился блок, он будет установлен в мире.
     */
    @Override
    public boolean onBlockActivated(World world, int x, int y, int z, EntityPlayer activator, int side, float hitX, float hitY, float hitZ) {
        // Все логические операции должны выполняться на серверной стороне, иначе могут возникнуть ошибки с обработкой и хранением данных.
        if (!world.isRemote) {
            // Получаем Tile Entity по координатам блока
            TileEntity tile = world.getTileEntity(x, y, z);

            // Проверяем, что полученный Tile Entity является StorageTile
            if (tile instanceof StorageTile) {
                StorageTile storage = (StorageTile) tile;
                // Передаём объект игрока и предмет из его руки в метод обработки стека.
                storage.handleInputStack(activator, activator.getHeldItem());
            }
        }
        return true;
    }
}
```

Код `StorageTile`:

```java
package ru.mcmodding.tutorial.common.tile;

import net.minecraft.entity.player.EntityPlayer;
import net.minecraft.item.ItemStack;
import net.minecraft.nbt.NBTTagCompound;
import net.minecraft.tileentity.TileEntity;
import net.minecraftforge.common.util.Constants;

public class StorageTile extends TileEntity {
    private ItemStack stack;

    // Чтобы избежать ошибок в названии тега, рекомендуется создавать константы
    private static final String INV_TAG = "Inventory";

    /**
     * Данный метод вызывается при записи данных Tile Entity в чанк. Мы не рекомендуем удалять вызов родительского метода,
     * так как это может привести к ошибке загрузки данных Tile Entity.
     *
     * @param nbt данные NBT в которых будет храниться информация о Tile Entity.
     */
    @Override
    public void writeToNBT(NBTTagCompound nbt) {
        super.writeToNBT(nbt);

        if (stack != null) {
            NBTTagCompound inventoryTag = new NBTTagCompound();
            stack.writeToNBT(inventoryTag);
            nbt.setTag(INV_TAG, inventoryTag);
        }
    }

    /**
     * Данный метод вызывается при чтении данных Tile Entity из чанка. Мы не рекомендуем удалять вызов родительского метода,
     * так как это может привести к потере информации о Tile Entity во время загрузки Tile Entity.
     *
     * @param nbt данные NBT которые содержат информацию о Tile Entity.
     */
    @Override
    public void readFromNBT(NBTTagCompound nbt) {
        super.readFromNBT(nbt);

        if (nbt.hasKey(INV_TAG, Constants.NBT.TAG_COMPOUND)) {
            NBTTagCompound inventoryTag = nbt.getCompoundTag(INV_TAG);
            stack = ItemStack.loadItemStackFromNBT(inventoryTag);
        }
    }

    /**
     * Будет ли Tile Entity обновляться. В нашем случае Tile Entity не имеет метода {@link TileEntity#updateEntity}, а значит обновлять
     * Tile Entity не нужно.
     *
     * @return Возвращает логическое значение.
     */
    @Override
    public boolean canUpdate() {
        return false;
    }

    /**
     * Вспомогательный метод, проверяющий наличие стека в Tile Entity.
     * @return Возвращает логическое значение.
     */
    public boolean hasStack() {
        return stack != null;
    }

    /**
     * Данный метод вызывается при активации блока и в зависимости от переданных данных, производит действие.
     *
     * @param player    игрок взаимодействующий с блоком
     * @param stack     стек предмета игрока в руке
     */
    public void handleInputStack(EntityPlayer player, ItemStack stack) {
        // Если в StorageTile есть стек, то выполнится действия со взятием предмета из StorageTile
        if (hasStack()) {
            // Если инвентарь заполнен, то предмет будет выброшен, в ином случае будет добавлен игроку в инвентарь.
            if (!player.inventory.addItemStackToInventory(this.stack)) {
                player.dropPlayerItemWithRandomChoice(this.stack, false);
            } else {
                // Иногда бывает, что предмет не отображается в инвентаре после активации блока, данный код исправляет это.
                player.inventoryContainer.detectAndSendChanges();
            }
            // Очищаем стек из StorageTile
            this.stack = null;
        }
        // Если стек в руке не равен null, то он будет положен в кол-ве 1 шт., в StorageTile
        else if (stack != null) {
            // Создаём копию стека и устанавливаем ей размер в 1 шт.
            ItemStack copy = stack.copy();
            copy.stackSize = 1;
            this.stack = copy;
            // Убираем один предмет из инвентаря игрока.
            --stack.stackSize;
        }
        // Не забываем пометить Tile Entity как "грязный", чтобы игра сохранила наши данные.
        markDirty();
    }
}
```

Разберём немного принцип работы NBT. NBTTagCompound своего рода `Map`, т.е. вместо метода `Map#put` вы будете использовать
геттеры и сеттеры для большего удобства. На данный момент NBT поддерживает запись все типов данных. Настоятельно
рекомендуется при проверке ключа NBT передавать вторым параметром идентификатор NBT, чтобы убедиться, что данные
при чтении будут верными. Подробнее почитать про NBT можно в [этой статье](../storage/nbt.md).

## Механизм

В предыдущей части статьи мы рассмотрели базовый принцип создания Tile Entity, в этой части мы рассмотрим создание
механизма способного обработать входящий предмет и выдать результат. Создадим `SmelterBlock` и `SmelterTile`, по
предыдущей части статьи и уберём в `SmelterTile` переопределение метода `TileEntity#canUpdate`(в родительском классе он возвращает всегда `true`).
Переопределим метод `TileEntity#updateEntity` и пропишем в нём логику работы нашего механизма.

```java
package ru.mcmodding.tutorial.common.tile;

import net.minecraft.entity.item.EntityItem;
import net.minecraft.entity.player.EntityPlayer;
import net.minecraft.init.Blocks;
import net.minecraft.init.Items;
import net.minecraft.item.Item;
import net.minecraft.item.ItemStack;
import net.minecraft.nbt.NBTTagCompound;
import net.minecraft.tileentity.TileEntity;
import net.minecraftforge.common.util.Constants;

public class SmelterTile extends TileEntity {
    private ItemStack stack;

    private static final String INV_TAG = "Inventory";

    @Override
    public void writeToNBT(NBTTagCompound nbt) {
        super.writeToNBT(nbt);

        // Аналогично тому, как мы делали в StorageTile
    }

    @Override
    public void readFromNBT(NBTTagCompound nbt) {
        super.readFromNBT(nbt);

        // Аналогично тому, как мы делали в StorageTile
    }

    /**
     * Данный метод вызывается каждый игровой тик. 20 тиков = 1 секунда
     */
    @Override
    public void updateEntity() {
        /*
         * Обязательно проверяем, что действия производятся на серверной стороне, затем проверяем, что имеется стек предмета.
         * Если игровое время в результате деления 100(5 сек) с остатком возвращает 0, то выполняется проверка на стек внутри плавильни.
         */
        if (!worldObj.isRemote && hasStack() && worldObj.getTotalWorldTime() % 100 == 0) {
            // Если предмет является блоком угольной руды, то создаём сущность предмета, которая содержит в себе стек с предметом "уголь"
            if (stack.getItem() == Item.getItemFromBlock(Blocks.coal_ore)) {
                worldObj.spawnEntityInWorld(new EntityItem(worldObj, xCoord, yCoord + 1, zCoord, new ItemStack(Items.coal)));
                // Не забываем удалить стек
                stack = null;
                // А также не забывает сохранить данные
                markDirty();
            }
            // Если предмет является блоком железной руды, то создаём сущность предмета, которая содержит в себе стек с предметом "железный слиток"
            else if (stack.getItem() == Item.getItemFromBlock(Blocks.iron_ore)) {
                worldObj.spawnEntityInWorld(new EntityItem(worldObj, xCoord, yCoord + 1, zCoord, new ItemStack(Items.iron_ingot)));
                stack = null;
                markDirty();
            }
        }
    }

    public boolean hasStack() {
        return stack != null;
    }

    public void handleInputStack(EntityPlayer player, ItemStack stack) {
        // Аналогично тому, как мы делали в StorageTile
    }
}
```

Вот таким нехитрым способом можно сделать механизм, который будет обрабатывать данные находящиеся в Tile Entity.
Дальше всё ограничивается лишь вашей фантазией и возможностями ПК.

## TileEntitySpecialRenderer

Ранее мы уже рассказывали вам о том, как добавить собственную отрисовку блока по средствам запечённого рендера. В данной
части статьи вы научитесь добавлять модели к своему блоку с использованием `TileEntitySpecialRenderer`. Минусом данного
подхода является то, что на каждый `TileEntitySpecialRenderer` будет производиться вызов отрисовки, что в реалиях
игры является плохим тоном.

Переопределим три метода в классе блока плавильни:

```java
package ru.mcmodding.tutorial.common.block;

import net.minecraft.block.BlockContainer;

public class SmelterBlock extends BlockContainer {
    /**
     * Указывает Minecraft, что блок является нормальным блоком для отрисовки(обычным кубом).
     *
     * @return Возвращает логическое значение.
     */
    @Override
    public boolean renderAsNormalBlock() {
        return false;
    }

    /**
     * Указывает Minecraft, что блок является непрозрачным. Если указать true, то пространство внутри блока будет создавать
     * x-ray эффект.
     *
     * @return Возвращает логическое значение.
     */
    @Override
    public boolean isOpaqueCube() {
        return false;
    }

    @Override
    public int getRenderType() {
        return -1;
    }
}
```

Создадим класс с отрисовкой для Tile Entity:

```java
package ru.mcmodding.tutorial.client.render.tile;

import net.minecraft.client.renderer.tileentity.TileEntitySpecialRenderer;
import net.minecraft.tileentity.TileEntity;
import net.minecraft.util.ResourceLocation;
import net.minecraftforge.client.model.AdvancedModelLoader;
import net.minecraftforge.client.model.IModelCustom;
import net.minecraftforge.client.model.obj.WavefrontObject;
import ru.mcmodding.tutorial.McModding;
import ru.mcmodding.tutorial.client.render.ModelWrapperDisplayList;

import static org.lwjgl.opengl.GL11.*;

public class SmelterTesr extends TileEntitySpecialRenderer {
    private final ResourceLocation modelPath = new ResourceLocation(McModding.MOD_ID, "models/smelter.obj");
    private final IModelCustom smelterModel = new ModelWrapperDisplayList((WavefrontObject) AdvancedModelLoader.loadModel(modelPath));

    /**
     * Данный метод вызывается для отрисовки Tile Entity. Отрисовка происходит каждый кадр.
     *
     * @param tile текущий Tile Entity к которому прикреплён Tesr.
     * @param x позиция блока по X координате.
     * @param y позиция блока по Y координате.
     * @param z позиция блока по Z координате.
     * @param delta Разница во времени с момента последнего тика. Диапазон между 0 и 1.
     */
    @Override
    public void renderTileEntityAt(TileEntity tile, double x, double y, double z, float delta) {
        glPushMatrix();
        glDisable(GL_TEXTURE_2D);
        glTranslated(x + 0.5, y, z + 0.5);
        smelterModel.renderAll();
        glEnable(GL_TEXTURE_2D);
        glPopMatrix();
    }
}
```

Как вы могли заметить, все действия аналогичны тому, как мы добавляли отрисовку .obj модели для предмета, за исключением
того, что для Tile Entity необходимо сдвигать модель в центр блока.

!!! tip "Подсказка"
    Вы можете объединять отрисовку блока и Tile Entity, для этого достаточно выбрать тип отрисовки в самом блоке `Block#getRenderType`.

Теперь необходимо прикрепить `SmelterTesr` к `SmelterTile`, делается это с помощью метода `ClientRegistry#bindTileEntitySpecialRenderer(Class<TileEntity>, TileEntitySpecialRenderer)`

```java
package ru.mcmodding.tutorial.common.handler;

import cpw.mods.fml.client.registry.ClientRegistry;
import cpw.mods.fml.relauncher.Side;
import cpw.mods.fml.relauncher.SideOnly;
import ru.mcmodding.tutorial.client.render.tile.SmelterTesr;
import ru.mcmodding.tutorial.common.tile.SmelterTile;

public class ModBlocks {
    @SideOnly(Side.CLIENT)
    public static void registerRender() {
        ClientRegistry.bindTileEntitySpecialRenderer(SmelterTile.class, new SmelterTesr());
    }
}
```

![Плавильня в мире с моделью](images/smelter_world.png)

## Синхронизация с клиентом

Мы разобрали основные моменты создания Tile Entity, прикрепления к нему отрисовки и даже сделали свой первый, пусть и
простой механизм, но чтобы завершить статью, необходимо ещё рассказать про синхронизацию NBT данных Tile Entity.

Синхронизация с клиентом нужна для того, чтобы клиентская часть игры знала о каких-то данных, например о том какой предмет
содержится или свои, определённые данные в Tile Entity. Стоит ещё учитывать тот факт, что размер отправляемых данных в NBT формате
ограничен `Short#MAX_VALUE`. Так что мы настоятельно рекомендуем оптимизировать отправляемые, а также хранимые в Tile Entity
данные, в противном случае, вы получите исключение.

Для начала, чтобы уменьшить размер отправляемых данных, разделим запись и чтение на два метода, такие как:
`writeExtendedData(NBTTagCompound)` и `readExtendedData(NBTTagCompound)`, так мы сможем записывать наши данные, отсекая
родительские данные самого Tile Entity(позиция и прочее).

Переопределим два метода `TileEntity#getDescriptionPacket` и `TileEntity#onDataPacket`.

```java
package ru.mcmodding.tutorial.common.tile;

import net.minecraft.item.ItemStack;
import net.minecraft.nbt.NBTTagCompound;
import net.minecraft.network.NetworkManager;
import net.minecraft.network.Packet;
import net.minecraft.network.play.server.S35PacketUpdateTileEntity;
import net.minecraft.tileentity.TileEntity;
import net.minecraftforge.common.util.Constants;

public class SmelterTile extends TileEntity {
    private ItemStack stack;

    private static final String INV_TAG = "Inventory";

    @Override
    public void writeToNBT(NBTTagCompound nbt) {
        super.writeToNBT(nbt);
        writeExtendedData(nbt);
    }

    @Override
    public void readFromNBT(NBTTagCompound nbt) {
        super.readFromNBT(nbt);
        readExtendedData(nbt);
    }

    /**
     * Данный метод вызывается для отправки пакета с информацией о Tile Entity на клиент.
     *
     * @return Возвращает пакет с информацией о Tile Entity.
     */
    @Override
    public Packet getDescriptionPacket() {
        // Создаём объект NBTTagCompound, чтобы записать в него данные для отправки
        NBTTagCompound nbt = new NBTTagCompound();
        // Записываем изолированные от родительских данные
        writeExtendedData(nbt);
        return new S35PacketUpdateTileEntity(xCoord, yCoord, zCoord, 0, nbt);
    }

    /**
     * Данный метод вызывается на клиенте при получении пакета с информацией о Tile Entity с сервера.
     *
     * @param net NetworkManager от которого исходил пакет
     * @param packet пакет данных
     */
    @Override
    public void onDataPacket(NetworkManager net, S35PacketUpdateTileEntity packet) {
        // Получаем Tile Entity по координатам из пакета
        TileEntity tile = worldObj.getTileEntity(packet.func_148856_c(), packet.func_148855_d(), packet.func_148854_e());
        if (tile instanceof SmelterTile) {
            // Читаем изолированные данные
            ((SmelterTile) tile).readExtendedData(packet.func_148857_g());
        }
    }

    private void writeExtendedData(NBTTagCompound nbt) {
        if (stack != null) {
            NBTTagCompound inventoryTag = new NBTTagCompound();
            stack.writeToNBT(inventoryTag);
            nbt.setTag(INV_TAG, inventoryTag);
        }
    }

    private void readExtendedData(NBTTagCompound nbt) {
        if (nbt.hasKey(INV_TAG, Constants.NBT.TAG_COMPOUND)) {
            NBTTagCompound inventoryTag = nbt.getCompoundTag(INV_TAG);
            stack = ItemStack.loadItemStackFromNBT(inventoryTag);
        }
    }
}
```

Разберём `S35PacketUpdateTileEntity(Integer, Integer, Integer, Integer, NBTTagCompound)`:

* x(field_148863_a) - позиция блока по X координате.
* y(field_148861_b) - позиция блока по Y координате.
* z(field_148862_c) - позиция блока по Z координате.
* id(field_148859_d) - идентификатор Tile Entity(должен быть уникальным, но можно использовать 0, но не пересекаться с 1-5!)
* nbt(field_148860_e) - NBT данные

И наконец разберём метод `TileEntity#onDataPacket`. Во избежание каких-либо ошибок, рекомендуется получать Tile Entity
по входящим данным из пакета, а также проверять, что Tile Entity на текущих координатах тот, который нам нужен.
Затем производится чтение на клиенте и следовательно, данные синхронизированы от сервера на клиенте. В большинстве
случаев, вы можете не прибегать к проверкам, которые были сделаны в `TileEntity#onDataPacket`, но это не является хорошей
практикой, а значит в дальнейшем может вызвать проблемы.