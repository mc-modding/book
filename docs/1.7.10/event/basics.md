description: Использование событий Forge.

# Использование событий

События(Events) - это определённые действия происходящие в игре, которые можно в большинстве случаев отследить и
перехватить. Примером события может быть банальный дождь, который начался, а также возможность "отмены" дождя, чтобы
на каком-либо мероприятии была ясная погода.

Создадим класс `FMLEventListener`.

```java
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

Разберём код подробнее! Чтобы MinecraftForge смог передать экземпляр события в наш метод, необходимо на метод повесить
аннотацию `@SubscribeEvent`, которая включает в себя два параметра: 

* `priority` приоритет срабатывания события.
* `receiveCanceled` получать экземпляр события, даже если событие было отменено.

Приоритетов срабатывания события всего пять: "HIGHEST"(раннее выполнение события), "HIGH", "NORMAL", "LOW", 
"LOWEST"(позднее выполнение события, т.е. после всех). Чем выше приоритет, тем раньше ваш метод с событием будет
вызван, а значит вы сможете получить не модифицированные данные другими модами или ещё не отменённое событие другим модом.
Но если даже произошла отмена события каким-либо модом, вы всё равно можете получить это событие передав параметру
`receiveCanceled` значение `true`.

Осталось зарегистрировать слушателя событий. Перейдём в `CommonProxy#preInit` и в зависимости от используемых событий,
выберем шину и зарегистрируем слушателя. Подробнее какую шину использовать для регистрации событий, вы сможете найти
в [таблице событий](./events-table.md).

В нашем случае, мы использовали FML события, об этом говорит адрес пакета `cpw.mods.fml`, а значит нам подойдёт `FMLCommonHandler.instance().bus().register`. В случае
с MinecraftForge шиной, необходимо использовать `MinecraftForge.EVENT_BUS.register`

```java
package ru.mcmodding.tutorial.common;

import cpw.mods.fml.common.FMLCommonHandler;
import cpw.mods.fml.common.event.FMLPreInitializationEvent;
import ru.mcmodding.tutorial.common.handler.*;

public class CommonProxy {
    public void preInit(FMLPreInitializationEvent event) {
        FMLCommonHandler.instance().bus().register(new FMLEventListener());
    }
}
```

!!! tip "Подсказка"
    Вы можете воспользоваться методом `EventBus#unregister`, чтобы разрегистрировать слушателя событий.