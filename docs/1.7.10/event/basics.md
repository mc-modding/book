description: Использование событий Forge.

# Использование событий

События (Events) - это определённые действия происходящие в игре, которые можно в большинстве случаев отследить и
перехватить. Примером события может быть банальный дождь, который начался, а также возможность «отмены» дождя, чтобы
на каком-либо мероприятии была ясная погода.

Создадим класс нашего обработчика событий:

```java title="FMLEventListener.java"
package ru.mcmodding.tutorial.common.handler;

import cpw.mods.fml.common.eventhandler.SubscribeEvent;
import cpw.mods.fml.common.gameevent.PlayerEvent;
import net.minecraft.util.ChatComponentText;

public class FMLEventListener {
    @SubscribeEvent
    public void onPlayerLoggedIn(PlayerEvent.PlayerLoggedInEvent event) {
        // Если игрока зовут "PlayerName", то отправляем ему сообщение с приветствием
        if (event.player.getCommandSenderName().equals("PlayerName")) {
            event.player.addChatMessage(new ChatComponentText(String.format("Привет, %s!", event.player.getCommandSenderName())));
        }
    }
}
```

Разберём код подробнее. Чтобы Minecraft Forge смог обнаружить наш обработчик события, необходимо пометить метод
аннотацией `@SubscribeEvent`. Также метод обязательно должен быть `public void` и иметь один единственный аргумент с типом события.

**Аннотация @SubscribeEvent имеет следующие параметры:**

* `priority` – приоритет обработчика события
* `receiveCanceled` – получать отменённые события

Приоритеты работают следующим образом (в порядке от первого к последнему): **HIGHEST → HIGH → NORMAL → LOW → LOWEST**  
Чем выше приоритет, тем раньше ваш обработчик события будет вызван, а значит вы сможете получить не модифицированные данные другими модами или ещё не отменённое событие другим модом.
Но если даже произошла отмена события каким-либо модом, вы всё равно можете получить это событие передав параметру
`receiveCanceled` значение `true`.

Осталось зарегистрировать слушателя событий. Перейдём в `CommonProxy#preInit` и в зависимости от используемых событий,
выберем шину и зарегистрируем слушателя. Подробнее какую шину использовать для регистрации событий, вы сможете найти
в [таблице событий](./events-table.md).

!!! help "Как выбрать подходящую шину событий?"
    Исторически сложилось так, что в Minecraft используются две шины событий. 
    Выбирать, где регистрировать свой обработчик следует исходя из пакета в котором расположены отслеживаемые события:

    * `MinecraftForge.EVENT_BUS` – для событий из пакета `net.minecraftforge.event.*` также большинство модов использует эту шину для отправки кастомных событий.
    * `FMLCommonHandler.instance().bus()` – для событий из пакета `cpw.mods.fml.*`

```java title="Пример регистрации обработчика событий"
package ru.mcmodding.tutorial.common;

import cpw.mods.fml.common.FMLCommonHandler;
import cpw.mods.fml.common.event.FMLPreInitializationEvent;
import net.minecraftforge.common.MinecraftForge;
import ru.mcmodding.tutorial.common.handler.*;

public class CommonProxy {
    public void preInit(FMLPreInitializationEvent event) {
        FMLCommonHandler.instance().bus().register(new FMLEventListener());
    }
}
```

!!! tip "Подсказка"
    Вы можете воспользоваться методом `EventBus#unregister`, чтобы разрегистрировать слушателя событий.