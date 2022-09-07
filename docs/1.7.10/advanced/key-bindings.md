title: Привязка клавиш в Minecraft 1.7.10

# Привязка клавиш

Иногда в процессе разработки возникает необходимость добавления новых клавиш управления.
Иногда – потому что клавиши должны использоваться только для часто используемых действий игроком, дабы не перегружать экран настроек управления.
Все остальные действия лучше реализовывать с помощью [GUI](../gui/basics.md) и [команд](commands.md).

Работа с клавишами управления состоит из двух частей: регистрация клавиш в настройках игры и создание обработчика, отслеживающего нажатия.
Первая часть является необязательной, поскольку нужна только для возможности переназначения клавиши пользователем.

## Простой обработчик клавиш

Создаём новый класс `KeyHandler` в котором у нас будет храниться список всех клавиш и обработчик события.

```java title="KeyHandler.java"
package ru.mcmodding.tutorial.client.handler;

import cpw.mods.fml.client.registry.ClientRegistry;
import cpw.mods.fml.common.FMLCommonHandler;
import cpw.mods.fml.common.eventhandler.SubscribeEvent;
import cpw.mods.fml.common.gameevent.InputEvent;
import cpw.mods.fml.common.network.ByteBufUtils;
import cpw.mods.fml.common.network.internal.FMLProxyPacket;
import net.minecraft.client.settings.KeyBinding;
import org.lwjgl.input.Keyboard;
import ru.mcmodding.tutorial.common.CommonProxy;
import ru.mcmodding.tutorial.common.handler.PacketHandler;
import ru.mcmodding.tutorial.common.handler.packet.ServerMessagePacket;

public final class KeyHandler {

    // Клавиши мода
    private final KeyBinding binding = new KeyBinding("mcmodding.key.test", Keyboard.KEY_N, "mcmodding.key.category");

    public void register() {
        // Регистрируем клавиши в игре
        ClientRegistry.registerKeyBinding(binding);

        // Регистрируем обработчик события
        FMLCommonHandler.instance().bus().register(this);
    }

    /**
     * Обработчик события нажатия клавиши в игре
     */
    @SubscribeEvent
    public void onKeyInput(InputEvent.KeyInputEvent event) {
        if (binding.isPressed()) {
            // Выводит сообщение в чат с названием нажатой клавиши
            EntityClientPlayerMP player = Minecraft.getMinecraft().thePlayer;
            player.addChatMessage(new ChatComponentText("Была нажата клавиша " + Keyboard.getKeyName(binding.getKeyCode())));
        }
    }
}
```

И регистрируем его в `ClientProxy`:

```java hl_lines="13-14"
package ru.mcmodding.tutorial.client;

import cpw.mods.fml.common.event.FMLInitializationEvent;
import ru.mcmodding.tutorial.client.handler.KeyHandler;
import ru.mcmodding.tutorial.common.CommonProxy;

public class ClientProxy extends CommonProxy {

    @Override
    public void init(FMLInitializationEvent event) {
        // ...
        
        KeyHandler keyHandler = new KeyHandler();
        keyHandler.register();
    }

}
```

Разберём, как это всё работает:

1. Создаётся экземпляр `KeyBinding` с нужными параметрами (имя, клавиша, категория).
    * Имя и категория являются ключами [локализации](../basics/lang.md).
    * Имя клавиши также используется в качестве ключ для хранения параметра в **options.txt**, поэтому его не рекомендуется менять в дальнейшем.
    * Параметр «клавиша» представляет собой числовой код клавиши, это значение по-умолчанию. Для удобства используются константы класса `org.lwjgl.input.Keyboard`.
    * Категорию можно назвать как угодно или использовать существующие, указав соответствующий ключ.
2. Регистрация бинда клавиши в игре осуществляется с помощью `ClientRegistry.registerKeyBinding(KeyBinding)` чтобы она появилась на экране настроек управления.
3. Регистрируем обработчик события `InputEvent.KeyInputEvent` (нажатие клавиши в игре).
4. С помощью метода `KeyBinding#isPressed()` проверяется, нажата ли нужная клавиша в момент получения события.

## Продвинутый уровень

В приведённом ранее примере был рассмотрен самый простой способ отслеживания клавиши.
Нам необязательно отслеживать событие `InputEvent.KeyInputEvent`, с клавишами можно работать как угодно и где угодно,
но с пониманием дела. Обработчик, срабатывающий на любые действия игрока, ничего не вызовет, кроме раздражения.

### Возможности KeyBinding

Использование класса `KeyBinding` нужно только для предоставления пользователю возможности переопределить клавишу по-умолчанию.
Рассмотрим методы данного класса:

| Метод                 | Описание                                                                                                                              |
|-----------------------|---------------------------------------------------------------------------------------------------------------------------------------|
| `getIsKeyPressed()`   | Нажата ли клавиша в данный момент.                                                                                                    |
| `getKeyCode()`        | Возвращает числовой код клавиши (это значение может быть переопределено пользователем).<br /> **0** – если никакая клавиша не задана. |
| `getKeyCodeDefault()` | Возвращает код клавиши по-умолчанию (тот, что был передан в конструктор).                                                             |
| `isPressed()`         | Нажата ли клавиша в данный момент. Имеет таймер нажатия, поэтому не подходит для проверки удержания клавиши нажатой.                  |

### Отслеживание нажатия клавиш

Без использования класса `KeyBinding`, проверка удержания клавиши осуществляется «сырым» методом с помощью `org.lwjgl.input.Keyboard#isKeyDown(int)`, принимающего код клавиши в качестве аргумента.

!!! warning ""
    Код клавиши должен быть больше нуля, иначе метод всегда будет возвращать положительное значение. Это следует учитывать, особенно при работе с `KeyBinding`. 

Проверка должна осуществляться в момент события «Client Tick».
Например, логику обработки клавиш можно реализовать в [GUI](../gui/basics.md), переопределив метод `GuiScreen#keyTyped(char, int)`.
Такой обработчик будет активен только пока GUI активен.