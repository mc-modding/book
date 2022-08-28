description: Пакетная система.

# Пакетная система

В процессе разработки модификации рано или поздно встаёт вопрос синхронизации данных между сервером и клиентом.
Для этого используются пакеты. Пакет – это набольшая порция данных которой обмениваются сервер и клиент.
Minecraft уже решает большинство таких задач за нас, однако бывают случаи, когда возможностей штатного набора пакетов становится недостаточно.
Допустим, вы решили сделать кнопку в GUI механизма – вам понадобится отправить на сервер чтобы сообщить ему о нажатии кнопки.

Какой ещё сервер? – наверняка, спросите вы. Сетевой режим Minecraft довольно популярен, потому все модификации должны уметь работать с удалёнными серверами.
К счастью, разработчики игры уже решили это проблему за нас.
Для мода не будет иметь значения одиночная игра это или удалённый сервер, потому что даже одиночный мир выполняет роль сервера (интегрированного).
Таким образом, пакетная система функционирует даже в одиночном режиме через эмуляцию сетевого соединения.

!!! danger "Предостережение"
    Работает с пакетами требует ответственного отношения к безопасности, так как Вы будете работать с «сырыми» данными, полученными от клиента.
    **Злоумышленник может отправить всё что угодно на сервер**[^1], потому очень важно проверять полученные данные перед их обработкой.

    * В пакетах следует передавать минимально необходимый объём данных, необходимый для решения вашей задачи.
      Это сократит объём передаваемых данных по сети и усложнит эксплуатацию возможных уязвимостей.
    * Очень важно максимально ограничить возможности обработчика пакетов, добавив множество проверок данных, так чтобы он мог выполнять исключительно задуманные вами действия.

## SimpleNetworkWrapper

`SimpleNetworkWrapper` - это обёртка над [Netty](https://netty.io/), позволяющая создавать свои каналы без понимания мощностей библиотеки Netty.
Конструктор класса принимает лишь один аргумент `channelName`, который должен быть уникальным.
Мы рекомендуем ничего не выдумывать и использовать **ModId** в качестве название канала, чтобы избежать пересечения с каналами других модов.

### Создание канала

Начало работы с пакетами начинается с создания нового экземпляр класса `SimpleNetworkWrapper`.
Вокруг него будет строиться вся работа пакетной системы нашего мода.
Для большего удобства, добавим поле в главный класс мода, а регистрацию самих пакетов будем производить в `CommonProxy#preInit`.

```java
package ru.mcmodding.tutorial;

import cpw.mods.fml.common.Mod;
import cpw.mods.fml.common.network.simpleimpl.SimpleNetworkWrapper;

@Mod(modid = McModding.MOD_ID)
public class McModding {

    public static final SimpleNetworkWrapper NETWORK = new SimpleNetworkWrapper(McModding.MOD_ID);
}
```

**Пакеты** создаются с помощью реализации интерфейса `IMessage`, который содержит два метода, такие как: `IMessage#toBytes(ByteBuf)` и `IMessage#fromBytes(ByteBuf)` для записи/чтения данных.
Данные содержащиеся в `ByteBuf` передаются по сети.

!!! note ""
    Класс пакета **обязательно** должен иметь конструктор по-умолчанию (без параметров) чтобы SimpleNetworkWrapper смог создать объект когда получит пакет.

**Обработчик пакетов** создаётся с помощью реализации интерфейса `IMessageHandler<REQ, REPLY>` с двумя параметрами (REQ - тип получаемого пакета, REPLY - отправляемый в ответ),
содержащий метод `IMessageHandler#onMessage(IMessage, MessageContext)`.
Данный метод получает полученный от другой стороны пакет и должен вернуть пакет для отправки в ответ.
Так как данная функциональность нам не интересна, мы будет возвращать `null`, а REPLY-тип будет представлен базовым `IMessage`.

!!! note "Назначение интерфейсов"
    У вас наверняка может возникнуть соблазн реализовать `IMessage` и `IMessageHandler` в рамках одного класса и это будет работать.
    Так делать НЕ рекомендуется – этим Вы только запутаете себя и IDE.
    Данные интерфейсы имеют совершенно разное назначение и в рамках одного экземпляра объекта никогда не используются.

    * Объект `IMessage` создаётся каждый раз когда Вы отправляете или получаете входящий пакет.
    * `IMessageHandler` существует в единственном экземпляре, создаётся в момент регистрации пакета (см. «Регистрация пакета»).
      Получает объекты `IMessage` в качестве параметра.

    Поэтому обработку пакетов мы дегелировали статическому вложенному классу `Handler`.

### Создание пакета

Давайте создадим наш первый пакет. Назовём его `ServerMessagePacket`.
Этот пакет будет выводить отправленное клиентом сообщение на сервер.

??? tip "Про именование пакетов"
    Чтобы вам было проще ориентироваться по классам пакетов, рекомендуем их называть, придерживаясь следующей схемы:

    * **Client** или **Server** – в начале имени означает, какая из сторон обрабатывает принятый пакет.
    * **Message** – (одно-два слова) описывает действие которое выполняет пакет. На нашем случае - отправка сообщения игроку.
    * Суффикс **Packet** или **Message** – означает что данный класс представляет из себя пакет.

    Даже Mojang придерживается определённой схемы именования. Посмотрите на названия классов в пакете `net.minecraft.network`

```java title="ServerMessagePacket.java"
package ru.mcmodding.tutorial.common.handler.packet;

import cpw.mods.fml.common.network.ByteBufUtils;
import cpw.mods.fml.common.network.simpleimpl.*;
import io.netty.buffer.ByteBuf;
import net.minecraft.entity.player.EntityPlayerMP;
import net.minecraft.util.ChatComponentText;

public class ServerMessagePacket implements IMessage {

    // Набор полей данных пакета
    private String message;
    private int number;

    public ServerMessagePacket() {
    }

    /**
     * @param message Сообщения, которое будет выводиться на серверной стороне.
     * @param number Число, которое будет выводиться на серверной стороне.
     */
    public ServerMessagePacket(String message, int number) {
        this.message = message;
        this.number = number;
    }

    /**
     * Читает данные пакета из ByteBuf при получении.
     */
    @Override
    public void fromBytes(ByteBuf buf) {
        message = ByteBufUtils.readUTF8String(buf);
        number = buf.readInt();
    }

    /**
     * Записывает данные пакета в ByteBuf перед отправкой.
     */
    @Override
    public void toBytes(ByteBuf buf) {
        ByteBufUtils.writeUTF8String(buf, message);
        buf.writeInt(number);
    }

    public static class Handler implements IMessageHandler<ServerMessagePacket, IMessage> {

        /**
         * Данный метод вызывается для обработки входящих данных из пакета.
         */
        @Override
        public IMessage onMessage(ServerMessagePacket packet, MessageContext ctx) {
            String message = packet.message;
            int number = packet.number;
            // Получаем игрока, который прислал нам пакет.
            EntityPlayerMP player = ctx.getServerHandler().playerEntity;

            // Отправляем сообщение игроку
            player.addChatMessage(new ChatComponentText("Вывожу текст \"" + message + "\" с числом \"" + number + "\""));

            return null; // В ответ ничего не отправляем
        }
    }
}
```

!!! tip "Подсказка"
    * Вы можете использовать утилитарный класс `ByteBufUtils` для возможности записывать и читать такие данные как:
      `ItemStack`, `NBTTagCompound`, `String`, а также производить кодирование с помощью varInt и varShort.
    * `ctx.getServerHandler().playerEntity` – это единственные данные пакета, которым Вы можете полностью доверять при обработке пакета на сервер.
       Сервер точно знает, кем был отправлен пакет.
    * Чтобы получить игрока при обработке пакета на клиенте, воспользуйтесь `Minecraft.getMinecraft().thePlayer`.
    * При получении данных от сервера клиентским обработчиком, уделять большое внимание проверке данных нет никакой необходимости.
      Клиентский мир и так находится «во власти» сервера.

### Регистрация пакета & обработчика

Осталось только зарегистрировать пакет, чтобы это сделать, обратимся к методу `SimpleNetworkWrapper#registerMessage`.

```java
package ru.mcmodding.tutorial.common;

import cpw.mods.fml.common.event.FMLPreInitializationEvent;
import cpw.mods.fml.relauncher.Side;
import ru.mcmodding.tutorial.McModding;
import ru.mcmodding.tutorial.common.handler.packet.ServerMessagePacket;

public class CommonProxy {

    public void preInit(FMLPreInitializationEvent event) {
        McModding.NETWORK.registerMessage(new ServerMessagePacket.Handler(), ServerMessagePacket.class, 0, Side.SERVER);
    }
}
```

Рассмотрим метод `SimpleNetworkWrapper#registerMessage(IMessageHandler messageHandler, Class requestMessageType, int discriminator, Side side)` более подробно! Данный метод принимает четыре параметра, такие как:

* `messageHandler` – обработчик входящих пакетов (можно передать объект сразу или класс).
* `requestMessageType` – класс пакета.
* `discriminator` – уникальный ID (byte) пакета. Для каждого класса пакета нужно указывать свой ID.
* `side` – сторона на которой будет обрабатываться пакет. Предотвращает использование уязвимости двунаправленной обработки пакета[^2]

Теперь поговорим о том, как отправлять пакеты. Класс `SimpleNetworkWrapper` предоставляет нам такие методы для отправки пакетов:

| Название метода                          | Описание                                                                                                |
|------------------------------------------|---------------------------------------------------------------------------------------------------------|
| `sendToAll(IMessage)`                    | Отправляет пакет всем игрокам находящимся на сервере.<br /> SERVER → CLIENT                             |
| `sendTo(IMessage, EntityPlayerMP)`       | Отправляет пакет конкретному игроку.<br /> SERVER → CLIENT                                              |
| `sendToAllAround(IMessage, TargetPoint)` | Отправляет пакет всем игрокам находящимся определённом радиусе от заданной точки.<br /> SERVER → CLIENT |
| `sendToDimension(IMessage, int)`         | Отправляет пакет всем игрокам в измерении (DimId).<br /> SERVER → CLIENT                                |
| `sendToServer(IMessage)`                 | Отправляет пакет на сервер.<br /> CLIENT → SERVER                                                       |

В нашем случае пакет будет отсылаться на сервер, а значит нам походит метод `SimpleNetworkWrapper#sendToServer`. Вот
такой пример отправки пакета на сервер у нас получился.

```java
package ru.mcmodding.tutorial.common.handler;

import cpw.mods.fml.common.eventhandler.SubscribeEvent;
import cpw.mods.fml.common.gameevent.InputEvent;
import org.lwjgl.input.Keyboard;
import ru.mcmodding.tutorial.McModding;
import ru.mcmodding.tutorial.common.handler.packet.ServerMessagePacket;

public class FMLEventListener {

    @SubscribeEvent
    public void onKeyInput(InputEvent.KeyInputEvent event) {
        // Отправка на нажатие клавиши B
        if (Keyboard.isKeyDown(Keyboard.KEY_B)) {
            McModding.NETWORK.sendToServer(new ServerMessagePacket("Привет мир!", 1337));
        }
    }
}
```

Регистрируем слушателя событий и заходим в игру для проверки!

![Обработка данных пакета](images/packet_handle.png)

## Best practice

В прошлой части статьи мы поговорили о том, как создать, отправить и обработать пакет, но пора поговорить о том, как
делать не надо в случае получения пакет с клиентской стороны. Многие, кто писал хоть раз пакетную систему,
сталкивались с такой проблемой, как синхронизация данных для [TileEntity](../block/tileentity.md) (серверная сторона).
На своей практике мы замечали такого вида код:

```java
package com.author.bestmod;

public class MyPacketHandler implements IMessageHandler<MyPacket, IMessage> {
    @Override
    public IMessage onMessage(MyPacket packet, MessageContext ctx) {
        TileEntity tile = ctx.getServerHandler().playerEntity.worldObj.getTileEntity(packet.x, packet.y, packet.z);
        if (tile instanceof MyBestTile) {
            tile.readFromNBT(packet.nbtData);
        }
        return null;
    }
}
```

Минусом данного обработчика является то, что, во-первых, получение Tile Entity происходит с принудительной загрузкой чанков.
Чтобы исправить это, необходимо использовать `World#blockExists`, а затем уже получать Tile Entity. Во-вторых, получение
Tile Entity производится по данным из пакета, а это говорит о том, что практически любой желающий сможет заменить координаты
и получить чужой Tile Entity(например в регионе). В третьих, чтение данных NBT производится из пакета, а это равносильно
прошлому пункту. В случае с клиентом, данный подходи ещё будет уместен, но вы должны избегать такого кода на сервере.

При формировании обработчика пакета на серверной стороне, вы должны тщательно подходить к решению данного вопроса, чтобы
в дальнейшем не страдали обычные игроки и администраторы серверов.

[^1]:
    Злоумышленники, изучив код вашей модификации, создают свои специальные моды для эксплуатации обнаруженных уязвимостей.
    Наиболее часто уязвимость представлена возможностью создания любых предметов «из воздуха», когда переданный в пакете предмет игрок может получить сразу «на руки».
[^2]:
    Это уязвимость когда пакеты, предназначенные клиенту, можно отправить обратно на сервер и они будут обработаны.
    Например, пакет обновляющий состояние TileEntity в клиентском мире можно отправить на сервер чтобы изменить его там, допустим для наполнения инвентаря нужными предметами.