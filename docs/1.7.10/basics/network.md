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
Конструктор класса принимает лишь один аргумент `channelName`, который должен быть уникальным и не превышать длину в 16 символов.
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

### Отправка пакетов

Теперь поговорим о том, как отправлять пакеты. Класс `SimpleNetworkWrapper` предоставляет нам такие методы для отправки пакетов:

| Название метода                          | Описание                                                                                                |
|------------------------------------------|---------------------------------------------------------------------------------------------------------|
| `sendToAll(IMessage)`                    | Отправляет пакет всем игрокам находящимся на сервере.<br /> SERVER → CLIENT                             |
| `sendTo(IMessage, EntityPlayerMP)`       | Отправляет пакет конкретному игроку.<br /> SERVER → CLIENT                                              |
| `sendToAllAround(IMessage, TargetPoint)` | Отправляет пакет всем игрокам находящимся определённом радиусе от заданной точки.<br /> SERVER → CLIENT |
| `sendToDimension(IMessage, int)`         | Отправляет пакет всем игрокам в измерении (DimId).<br /> SERVER → CLIENT                                |
| `sendToServer(IMessage)`                 | Отправляет пакет на сервер.<br /> CLIENT → SERVER                                                       |

В нашем случае пакет будет отсылаться на сервер по нажатии ++b++ , а значит нам походит метод `SimpleNetworkWrapper#sendToServer`. Вот
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
        if (Keyboard.isKeyDown(Keyboard.KEY_B)) {
            McModding.NETWORK.sendToServer(new ServerMessagePacket("Привет мир!", 1337));
        }
    }
}
```

Регистрируем слушателя событий и заходим в игру для проверки!

![Обработка данных пакета](images/packet_handle.png)

## FMLProxyPacket

Класс `FMLProxyPacket` представляет собой обёртку над стандартными `C17PacketCustomPayload` и `S3FPacketCustomPayload`.
Это достаточно старый метод обработки пакетов, активно использовавшийся в предыдущих версиях Minecraft до появления **SimpleNetworkWrapper**.
Данный метод не предусматривает создание отдельных классов пакетов и обработчиков (вам придётся реализовывать их самостоятельно),
предполагая работу с «сырыми данными» через единственный глобальный обработчик пакетов канала.

### Создание канала

В приведённом ниже примере используется событийная модель работы с пакетами.
Часть кода вам уже должна быть знакома, если вы уже читали про [работу с событиями](../event/basics.md), только здесь обработчик событий регистрируется в специальной шине.

Создаём новый класс `PacketHandler` нашего обработчика пакетов:

```java title="PacketHandler.java"
package ru.mcmodding.tutorial.common.handler;

import java.util.function.Consumer;
import cpw.mods.fml.common.eventhandler.SubscribeEvent;
import cpw.mods.fml.common.network.*;
import cpw.mods.fml.common.network.internal.FMLProxyPacket;
import cpw.mods.fml.relauncher.Side;
import cpw.mods.fml.relauncher.SideOnly;
import io.netty.buffer.*;
import net.minecraft.entity.player.EntityPlayerMP;
import net.minecraft.network.NetHandlerPlayServer;
import net.minecraft.util.ChatComponentText;
import ru.mcmodding.tutorial.McModding;

public class PacketHandler {

    private final FMLEventChannel channel;

    public PacketHandler() {
        channel = NetworkRegistry.INSTANCE.newEventDrivenChannel(McModding.MOD_ID); // Имя канала
        channel.register(this); // Регистрируемся в шине событий
    }

    public FMLEventChannel getChannel() {
        return channel;
    }

    /**
     * Обработчик пакетов, полученных клиентом.
     */
    @SubscribeEvent
    @SideOnly(Side.CLIENT)
    public void handleClient(FMLNetworkEvent.ClientCustomPacketEvent event) {
        ByteBuf buf = event.packet.payload();
        byte id = buf.readByte();

        switch (id) {
            // У нас пока ничего не обрабатывается на клиенте.
        }
    }

    /**
     * Обработчик пакетов, полученных сервером.
     */
    @SubscribeEvent
    public void handleServer(FMLNetworkEvent.ServerCustomPacketEvent event) {
        ByteBuf buf = event.packet.payload();
        EntityPlayerMP player = ((NetHandlerPlayServer)event.handler).playerEntity; // Определяем отправителя
        byte id = buf.readByte();

        switch (id) {
            case 0: {
                // Читаем данные в том же порядке
                String message = ByteBufUtils.readUTF8String(buf);
                int number = buf.readInt();
                // Отправляем сообщение игроку
                player.addChatMessage(new ChatComponentText("Вывожу текст \"" + message + "\" с числом \"" + number + "\""));
            }
            break;
        }
    }

    /**
     * Вспомогательный метод для быстрого создания пакета
     */
    public static FMLProxyPacket makePacket(int id, Consumer<ByteBuf> consumer) {
        ByteBuf buf = Unpooled.buffer();
        buf.writeByte(id);
        consumer.accept(buf);
        return new FMLProxyPacket(buf, McModding.MOD_ID); // Второй параметр - имя канала
    }
}
```

Теперь разберём написанный код:

1. `NetworkRegistry#newEventDrivenChannel(String)` создаёт новый канал `FMLEventChannel` с указанным именем.
   Так мы сообщаем Forge о существовании канала с таким именем.
2. `FMLEventChannel#register(Object)` регистрирует наш обработчик в выделенной шине событий.
   С этого момента мы будет получать события `CustomPacketEvent` когда на наш канал приходит пакет (пакеты из других каналов мы получать не будем).
3. Событийные методы `handleClient` или `handleServer` принимают полученный пакет на клиенте и сервере соответственно.
4. Метод `getChannel()` – это getter для получения доступа к каналу мода. Он приходится для отправки пакетов.
5. С помощью записи `byte` в начало пакета реализована простенькая система работы с ID пакетов, позволяя передавать через один канал различные события.
6. `makePacket(int, Consumer)` – это вспомогательный метод для быстрого создания `FMLProxyPacket` с нужными данными.
   Принимает в качестве аргументов ID пакета и Callback-функцию записывающую данные в пакет (пример кода будет ниже).

Перейдём к регистрации обработчика пакетов. Добавляем поле **NETWORK** в главный класс нашего мода чтобы иметь к нему удобный доступ:

```java hl_lines="9"
package ru.mcmodding.tutorial;

import cpw.mods.fml.common.Mod;
import ru.mcmodding.tutorial.common.handler.PacketHandler;

@Mod(modid = McModding.MOD_ID)
public class McModding {

    public static PacketHandler NETWORK; // Значение присвоено будет позже
}
```

Инициализацию осуществляем в `CommonProxy#preInit` чтобы избежать создания обработчика до этапа инициализации мода.

```java hl_lines="10-11"
package ru.mcmodding.tutorial.common;

import cpw.mods.fml.common.event.FMLInitializationEvent;
import ru.mcmodding.tutorial.McModding;
import ru.mcmodding.tutorial.common.handler.PacketHandler;

public class CommonProxy {

    public void preInit(FMLPreInitializationEvent event) {
        // Создание объекта зарегистрирует обработчик в Forge
        McModding.NETWORK = new PacketHandler();
    }
}
```

### Отправка пакетов

Для того чтобы отправлять пакеты, понадобится получить доступ к ранее созданному экземпляру `FMLEventChannel`, получим его через getter `McModding.NETWORK.getChannel()`.
`FMLEventChannel` предлагает нам следующие методы для отправки пакетов:

| Название метода                                | Описание                                                                                                |
|------------------------------------------------|---------------------------------------------------------------------------------------------------------|
| `sendTo(FMLProxyPacket, EntityPlayerMP)`       | Отправляет пакет указанному игроку.<br /> SERVER → CLIENT                                               |
| `sendToAll(FMLProxyPacket)`                    | Отправляет пакет всем игрокам находящимся на сервере.<br /> SERVER → CLIENT                             |
| `sendToAllAround(FMLProxyPacket, TargetPoint)` | Отправляет пакет всем игрокам находящимся определённом радиусе от заданной точки.<br /> SERVER → CLIENT |
| `sendToDimension(FMLProxyPacket, int)`         | Отправляет пакет всем игрокам в измерении (DimId).<br /> SERVER → CLIENT                                |
| `sendToServer(FMLProxyPacket)`                 | Отправляет пакет на сервер.<br /> CLIENT → SERVER                                                       |

В нашем примере мы будем отправлять сообщение на сервер по нажатии ++b++ .
Сервер в ответ будет выводить сообщение в чат (см. код `PacketHandler#handleServer` приведённый ранее).

```java
package ru.mcmodding.tutorial.common.handler;

import cpw.mods.fml.common.eventhandler.SubscribeEvent;
import cpw.mods.fml.common.gameevent.InputEvent;
import cpw.mods.fml.common.network.ByteBufUtils;
import cpw.mods.fml.common.network.internal.FMLProxyPacket;
import org.lwjgl.input.Keyboard;
import ru.mcmodding.tutorial.McModding;

public class FMLEventListener {

    @SubscribeEvent
    public void onKeyInput(InputEvent.KeyInputEvent event) {
        if (Keyboard.isKeyDown(Keyboard.KEY_B)) {
            // Формируем пакет
            FMLProxyPacket packet = PacketHandler.makePacket(0, buf -> {
                ByteBufUtils.writeUTF8String(buf, "Привет мир!");
                buf.writeInt(1234);
            });

            // Отправляем на сервер
            McModding.NETWORK.getChannel().sendToServer(packet);
        }
    }
}
```

## ElegantNetworking

Ещё одним из вариантов работы с пакетами является использование сторонней библиотеки [ElegantNetworking](https://forum.mcmodding.ru/resources/elegantnetworking-maksimalno-izjaschnaja-paketnaja-sistema.225/).
Данная библиотека избавит вас от необходимости читать/записывать данные пакета в `ByteBuf`, делая это автоматически.
Правда, для работы с библиотекой потребуется определённая настройка среды разработки...

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

Минусом данного обработчика является то, что, во-первых, получение TileEntity происходит с принудительной загрузкой чанков.
Во-вторых, получение TileEntity производится по данным из пакета, а это говорит о том, что практически любой желающий сможет изменить любые свой-ва TileEntity.
В случае с клиентом, данный подходи ещё будет уместен, но вы должны избегать такого кода на сервере.

!!! warning "Обращение к блокам и тайлам по координатам"
    Обращение к блокам и TileEntity по координатам может вызывать загрузку чанков. Этим могут воспользоваться злоумышленники с целью создания лагов на сервере[^3].
    Потому сперва вы должны проверить загруженность чанка `World#blockExists`, а только затем обращаться к блокам, если чанк загружен (например, игроком).

При формировании обработчика пакета на серверной стороне, вы должны тщательно подходить к решению данного вопроса, чтобы
в дальнейшем не страдали обычные игроки и администраторы серверов.

[^1]:
    Злоумышленники, изучив код вашей модификации, создают свои специальные моды для эксплуатации обнаруженных уязвимостей.
    Наиболее часто уязвимость представлена возможностью создания любых предметов «из воздуха», когда переданный в пакете предмет игрок может получить сразу «на руки».
[^2]:
    Это уязвимость когда пакеты, предназначенные клиенту, можно отправить обратно на сервер и они будут обработаны.
    Например, пакет обновляющий состояние TileEntity в клиентском мире можно отправить на сервер чтобы изменить его там, допустим для наполнения инвентаря нужными предметами.
[^3]:
    Осуществляется отправка большого числа пакетов (флуд) с указанием случайных координат, что может привести к загрузке большого кол-ва чанков и большому расходу памяти.