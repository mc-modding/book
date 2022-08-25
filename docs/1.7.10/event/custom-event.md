description: Создание собственного события.

# Собственное событие

## Основная часть

Создавать своё событие также просто, как создать предмет или блок, всего лишь необходимо наследовать класс `Event`.

Создадим событие для нашей плавильни, чтобы можно было другим модам добавлять обработку других предметов, а не только
угольной и железной руды.

```java title="SmelterEvent.java"
package ru.mcmodding.tutorial.common.handler.event;

import cpw.mods.fml.common.eventhandler.Cancelable;
import cpw.mods.fml.common.eventhandler.Event;
import net.minecraft.item.Item;
import net.minecraft.item.ItemStack;

@Cancelable
public class SmelterEvent extends Event {
    private final Item ingredient;
    private ItemStack output;

    public SmelterEvent(Item ingredient) {
        this.ingredient = ingredient;
    }

    public Item getIngredient() {
        return ingredient;
    }

    public ItemStack getOutput() {
        return output;
    }

    public void setOutput(ItemStack output) {
        this.output = output;
    }
}
```

События можно сделать отменяемыми и/или с результатом. 

Для отменяемого события необходимо пометить класс аннотацией `@Cancelable`. Это позволит использовать методы `Event#isCanceled` и `Event#setCanceled(boolean)` для проверки отмены события и установки статуса отмены.

Для события с результатом используется аннотация `@Event.HasResult`. Получить результат можно с помощью метода `Event#getResult`,
а задать `Event#setResult(Result)`.

!!! note "Примечание"
    Minecraft Forge рекомендует использовать шину `MinecraftForge.EVENT_BUS` для регистрации своих событий, вместо устаревшей
    `FMLCommonHandler.instance().bus()`

Чтобы наше событие можно было прослушивать, необходимо вызвать `EventBus#post(Event)`. Данный метод отправляет событие всем слушателям и возвращает логическое 
значение по такой схеме:

![Схема условия](images/event_post.svg)

Таким образом, метод возвращает **true** только когда событие было отменено и **false** когда событие ничем не было заблокировано.

Добавим вызов слушателей при обновлении плавильни.

```java
package ru.mcmodding.tutorial.common.tile;

import net.minecraft.entity.item.EntityItem;
import net.minecraft.item.Item;
import net.minecraft.item.ItemStack;
import net.minecraft.tileentity.TileEntity;
import net.minecraftforge.common.MinecraftForge;
import ru.mcmodding.tutorial.common.handler.event.SmelterEvent;

public class SmelterTile extends TileEntity {
    private ItemStack stack;

    @Override
    public void updateEntity() {
        if (!worldObj.isRemote && hasStack() && worldObj.getTotalWorldTime() % 100 == 0) {
            // Передаём нашему событию стек который хранится в плавильне.
            SmelterEvent event = new SmelterEvent(stack.getItem());
            // Вызываем слушателей, чтобы они могли обработать данные из объекта события.
            if (MinecraftForge.EVENT_BUS.post(event)) {
                worldObj.spawnEntityInWorld(new EntityItem(worldObj, xCoord, yCoord + 1, zCoord, event.getOutput()));
                stack = null;
                markDirty();
            } else if (...) {
                // Остальная логика механизма из предыдущих статей...
            }
        }
    }
}
```

Попробуем добавить в плавильню такую логику, чтобы за одно яблоко, плавильня создавала 5 золотых яблок и сделаем мы это
с помощью события!

```java
package ru.mcmodding.tutorial.common.handler;

import cpw.mods.fml.common.eventhandler.SubscribeEvent;
import net.minecraft.init.Items;
import net.minecraft.item.Item;
import net.minecraft.item.ItemStack;
import ru.mcmodding.tutorial.common.handler.event.SmelterEvent;

public class ForgeEventListener {
    @SubscribeEvent
    public void onSmelter(SmelterEvent event) {
        // Если ингредиент яблоко, то выходящим стеком будет 5 золотых яблок
        if (event.getIngredient() == Items.apple) {
            event.setOutput(new ItemStack(Items.golden_apple, 5));
            // Отменяем событие, чтобы EventBus#post вернул true и выполнилось подмена логики
            event.setCanceled(true);
        }
    }
}
```

Зайдём в игру и положим яблоко в плавильню и о чудо! Плавильня выдала 5 золотых яблок.

## Своя шина событий

В теории, своя шина событий пригодится для разгрузки FML и Forge шин, но на практике мало кто создаёт свою шину.
По большей части своя шина событий будет полезна тем, кто создаёт свою библиотеку с кучей событий и т.п.

Чтобы создать свою шину, необходимо создать новый экземпляр класса `EventBus`.

```java
package ru.mcmodding.tutorial;

import cpw.mods.fml.common.Mod;
import cpw.mods.fml.common.eventhandler.EventBus;

@Mod(modid = McModding.MOD_ID)
public class McModding {
    public static final EventBus MODDING_BUS = new EventBus();
}
```

Весь остальной принцип работы `EventBus`, ни чем не отличается от работы `MinecraftForge.EVENT_BUS` и 
`FMLCommonHandler.instance().bus()`