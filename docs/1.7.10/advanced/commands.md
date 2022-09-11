title: Создание собственной команды в Minecraft 1.7.10

# Команды

Помимо всего прочего, имеется возможность добавлять новые консольные команды.
Команды являются одним из способов взаимодействия с игрой.
Чаще всего команды используются для реализации чит-возможностей (например, мгновенное получение прогресса, ресурсов и др. что полезно при тестировании мода).
Также команды используются администраторами серверов.

Работать с командами предельно просто: необходимо всего-лишь создать класс, описывающий логику работы команды и зарегистрировать его в обработчике.
Класс команды должен реализовывать интерфейс `ICommand`.
В примере мы будем наследоваться от каркаса команды `CommandBase`, уже содержащего реализацию большинства методов интерфейса, что потребует меньшего написания кода.


## Создание команды

Для примеры мы создадим команду ping, которая будет отвечать сообщением «Pong!» в ответ.

```java title="CommandPing.java"
package ru.mcmodding.tutorial.common.handler.command;

import javax.annotation.Nullable;
import net.minecraft.command.CommandBase;
import net.minecraft.command.ICommandSender;
import net.minecraft.util.ChatComponentText;
import net.minecraft.util.EnumChatFormatting;

public class CommandPing extends CommandBase {

    @Override
    public String getCommandName() {
        return "ping"; // Имя команды
    }

    @Override
    public boolean canCommandSenderUseCommand(ICommandSender sender) {
        return true; // Разрешаем использовать абсолютно всем. Команда безобидная :)
    }

    @Nullable
    @Override
    public String getCommandUsage(ICommandSender sender) {
        return null;
    }

    @Override
    public void processCommand(ICommandSender sender, String[] args) {
        ChatComponentText message = new ChatComponentText("Pong!");
        message.getChatStyle().setColor(EnumChatFormatting.GREEN);
        sender.addChatMessage(message);
    }
}
```

!!! note ""
    Постарайтесь придумать для команды достаточно уникальное имя, в противном случае существует риск заменить одну из
    [команд игры](https://minecraft.fandom.com/ru/wiki/%D0%9A%D0%BE%D0%BC%D0%B0%D0%BD%D0%B4%D1%8B_%D0%BA%D0%BE%D0%BD%D1%81%D0%BE%D0%BB%D0%B8) или других модов.

### Интерфейс ICommand

| Метод                                               | Описание                                                                                                                                                                                                                               |
|-----------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `getCommandName()`                                  | Возвращает имя команды, которое будет вводиться в чате/консоли.                                                                                                                                                                        |
| `getCommandUsage(ICommandSender)`                   | Возвращает ключ [локализации](../basics/lang.md), представляющий собой шаблон использования команды (строка вида: `/command [args...]`).<br /> Используется командой **help**.                                                         |
| `getCommandAliases()`                               | Возвращает список `List<String>` дополнительных имён команды (синонимов).                                                                                                                                                              |
| `processCommand(ICommandSender, String[])`          | Основной метод, срабатывающий при вызове команды.                                                                                                                                                                                      |
| `canCommandSenderUseCommand(ICommandSender)`        | Отвечает за возможность использования команды указанным отправителем. В основном, это проверка прав доступа.                                                                                                                           |
| `addTabCompletionOptions(ICommandSender, String[])` | Возвращает список `List<String>` вариантов подстановки слов при нажатии клавиши ++tab++<br /> Рекомендуем использовать `CommandBase#getListOfStringsMatchingLastWord` для реализации автоматической фильтрации предлагаемых вариантов. |
| `isUsernameIndex(String[], int)`                    | Проверяет, является ли аргумент команды (по индексу) никнеймом игрока. Используется для автоматического исправления регистра и подстановки полного ника игрока при вызове команды.                                                     |

* Аргументы – это массив строк, разделённых пробелом, введённых после имени команды.
* `ICommandSender` – отправитель команды. Это может быть игрок, консоль, командный блок, RCON и любые другие объекты, реализующие данный интерфейс.

### Регистрация команды

Теперь нужно зарегистрировать команду.
Делается это во время специального события `FMLServerStartingEvent`, можно сказать, являющегося одним иэ [этапов инициализации](../basics/loading-stages.md) мода.
Данное событие вызывается только на стороне сервера, потому использование [Sided Proxy](../basics/proxy.md) здесь не требуется.

Добавим в главный класс мода новый метод:

```java hl_lines="13"
package ru.mcmodding.tutorial;

import cpw.mods.fml.common.Mod;
import cpw.mods.fml.common.event.FMLServerStartingEvent;
import ru.mcmodding.tutorial.common.handler.command.CommandPing;

@Mod(modid = McModding.MOD_ID)
public class McModding {
    // ...

    @Mod.EventHandler
    public void serverStarting(FMLServerStartingEvent event) {
        event.registerServerCommand(new CommandPing());
    }
}
```


## Клиентский обработчик команд

Помимо стандартной обработки команд сервером Minecraft, Forge представляет возможность обработки команд на стороне клиента.
Работает это методом перехвата сообщений, вводимых в чат: при обнаружении ввода имени команды, зарегистрированной на клиентской стороне, сообщение 
будет передано в клиентский обработчик команд, вместо отправки на сервер.
Потому важно уделить внимание придумыванию уникальных названий команд, так чтобы они не перекрывали серверные.

??? note "Ограничения обработки команд на клиентской стороне"
    * Такие команды можно вызвать исключительно из GUI игрового чата, потому отправителем команды всегда будет являться игрок.
      Или программно вызовом метода `ClientCommandHandler#executeCommand`
    * Следует понимать, что возможности взаимодействия с миром на стороне клиента сильно ограничены, поскольку мир управляется сервером.
      Не рекомендуется пробовать что-либо изменять, так как это будет приводить к багам рассинхронизации.

Сам процесс создания класса команды для клиента ничем не отличается от, рассмотренного выше, способа создания команды сервера,
отличие заключается только в способе регистрации: вместо `FMLServerStartingEvent`, надо использовать в `ClientCommandHandler#instance`.

Добавьте следующий код в `ClientProxy` чтобы зарегистрировать команду:

```java hl_lines="13"
package ru.mcmodding.tutorial.client;

import cpw.mods.fml.common.event.FMLInitializationEvent;
import net.minecraftforge.client.ClientCommandHandler;
import ru.mcmodding.tutorial.common.CommonProxy;
import ru.mcmodding.tutorial.common.handler.command.CommandPing;

public class ClientProxy extends CommonProxy {

    @Override
    public void init(FMLInitializationEvent event) {
        // ...
        ClientCommandHandler.instance.registerCommand(new CommandPing());
    }
}
```