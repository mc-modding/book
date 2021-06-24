description: Обмен информацией между сервером и клиентом. Перенесено с форума.

# Пакетная система

Данная статья научит вас, как надо правильно создавать, отправлять и регистрировать пакеты. Для этого создадим класс:
```java

public class NetworkHandler
{
    /**
     * Первый параметр отвечает за название нашего канала. Соответственно: modid - уникальный идентификатор мода, channelName - название канала
     * Версия сетевого протокола, под которой будет работать наш канал. Если версия не будет совпадать с сервером/клиентом, пакеты не будут приниматься.
     * Проверка версии протокола на клиенте, если версия совпадает, то можем обработать пакет. Вместо `true` лучше выставить проверку `s.equals(...)` и т.п.
     * Проверка версии протокола на сервере, если версия совпадает, то можем обработать пакет. Вместо `true` лучше выставить проверку `s.equals(...)` и т.п.
     */
    private static final SimpleChannel CHANNEL = NetworkRegistry.newSimpleChannel(new ResourceLocation("modid", "channelName"), () -> "2.0", client -> true, server -> true);
    
    /**
     * Инстанция нашего класса, используется для отправки пакетов
     */
    @Nullable
    public static NetworkHandler instance = null;
    
    /**
     * Уникальный идентификатор пакета.
     */
    private short id = 0;

    /**
     * В конструкторе мы будем регистрировать пакеты.
     */
    
    public static void init()
    {
        instance = new NetworkHandler();
    }
    
    public NetworkHandler()
    {
        
    }

    /**
     * Данный метод позволяет отправить наш пакет игроку. Пакет отсылается на КЛИЕНТ!
     *
     * @param packet - наш пакет
     * @param player - игрок на сервере
     */
    public void sendTo(Packet packet, ServerPlayerEntity player)
    {
        CHANNEL.send(PacketDistributor.PLAYER.with(() -> player), packet);
    }

    /**
     * Данный метод позволяет отправить наш пакет всем. Пакет отсылается на КЛИЕНТ!
     *
     * @param packet - наш пакет
     */
    public void sendToAll(Packet packet)
    {
        CHANNEL.send(PacketDistributor.ALL.noArg(), packet);
    }

    /**
     * Данный метод позволяет отправить наш пакет ближайшим игрокам. Пакет отсылается на КЛИЕНТ!
     *
     * @param packet - наш пакет
     * @param point  - от которой начнётся отсылка пакетов до N радиуса
     */
    public void sendToNear(Packet packet, PacketDistributor.TargetPoint point)
    {
        CHANNEL.send(PacketDistributor.NEAR.with(() -> point), packet);
    }

    /**
     * Данный метод позволяет отправить наш пакет на сервер.
     *
     * @param packet - наш пакет
     */
    public void sendToServer(Packet packet)
    {
        CHANNEL.send(PacketDistributor.SERVER.noArg(), packet);
    }

    /**
     * Данный метод позволяет отправить наш пакет всем в измерении(dimension). Пакет отсылается на КЛИЕНТ!
     *
     * @param packet - наш пакет
     * @param type   - тип измерения. Доступные в mc: {OVERWORLD, NETHER, THE_END}
     */
    public void sendToDim(Packet packet, DimensionType type)
    {
        CHANNEL.send(PacketDistributor.DIMENSION.with(() -> type), packet);
    }

    /**
     * Данный метод позволяет отправить наш пакет всем отслеживающим сущность. Пакет отсылается на КЛИЕНТ!
     *
     * @param packet - наш пакет
     * @param entity - сущность, которую нужно отправить отслеживающим
     */
    public void sendToTracking(Packet packet, Entity entity)
    {
        CHANNEL.send(PacketDistributor.TRACKING_ENTITY.with(() -> entity), packet);
    }

    /**
     * Данный метод позволяет отправить наш пакет всем отслеживающим сущность и игрока. Пакет отсылается на КЛИЕНТ!
     *
     * @param packet - наш пакет
     * @param entity - сущность, которую нужно отправить отслеживающим
     */
    public void sendToTrackingAndSelf(Packet packet, Entity entity)
    {
        CHANNEL.send(PacketDistributor.TRACKING_ENTITY_AND_SELF.with(() -> entity), packet);
    }

    /**
     * Данный метод позволяет отправить наш пакет всем отслеживающим чанк. Пакет отсылается на КЛИЕНТ!
     *
     * @param packet - наш пакет
     * @param chunk  - чанк, который нужно отправить отслеживающим
     */
    public void sendToTrackingChunk(Packet packet, Chunk chunk)
    {
        CHANNEL.send(PacketDistributor.TRACKING_CHUNK.with(() -> chunk), packet);
    }

    /**
     * Данный метод позволяет отправить наш пакет всем `менеджерам`. Пакет отсылается на КЛИЕНТ!
     * Вы можете использовать данный метод для отправки пакетов ТОЛЬКО некоторым игрокам, а не всем или тем кто находится по близости.
     * Пример использования: Создайте список NetworkManager, а затем добавьте в него
     * `p.connection.netManager` (там где p это EntityPlayerMP!)
     *
     * @param packet   - наш пакет
     * @param managers - список менеджеров, которым нужно отправить пакет.
     */
    public void sendToSeveralPlayers(Packet packet, List<NetworkManager> managers)
    {
        CHANNEL.send(PacketDistributor.NMLIST.with(() -> managers), packet);
    }

    /**
     * Данный метод поможет нам с лёгкостью зарегистрировать пакет имплементированный от `SimplePacket`.
     * Так же хочу отметить то, что это не идеальная реализация, но вы всегда можете самостоятельно переписать её под свои нужды.
     * А ещё вы можете использовать вместо `registerMessage`, метод `messageBuilder` который позволит вам использовать к примеру
     * только `encode` или только `handle` своего пакета.
     *
     * @param clazz - класс пакета
     */
    private void registerPacket(Class<Packet> clazz)
    {
        try
        {
            final Packet packet = clazz.newInstance();
            CHANNEL.registerMessage(id++, clazz, packet::encode, packet::decode, packet::handlePacket);
        } catch (InstantiationException | IllegalAccessException e)
        {
            e.printStackTrace();
        }
    }

    public abstract static class Packet
    {
        abstract void encode(Packet packet, PacketBuffer buf);

        abstract Packet decode(PacketBuffer buf);

        void handlePacket(Packet packet, Supplier<NetworkEvent.Context> context)
        {
            final NetworkEvent.Context ctx = context.get();

            /*
             * Начиная с 1.8/1.9 всю обработку пакета надо выносить над основным потоком сервера,
             * добавив его в качестве запланированной задачи.
             */
            if (ctx.getDirection().getReceptionSide() == LogicalSide.SERVER)
            {
                ctx.enqueueWork(() -> packet.server(ctx.getSender()));
                ctx.setPacketHandled(true);
            } else
                Minecraft.getInstance().deferTask(() -> packet.client(clientPlayer()));
        }

        void client(ClientPlayerEntity player)
        {
        }

        void server(ServerPlayerEntity player)
        {
        }

        @OnlyIn(Dist.CLIENT)
        private ClientPlayerEntity clientPlayer()
        {
            return Minecraft.getInstance().player;
        }
    }
}
```
Данный класс позволит нам регистрировать пакеты. Для того чтоб это стало возможным, нужно инициализировать класс в `FMLCommonSetupEvent` и `FMLClientSetupEvent` соответственно:
```java
@SubscribeEvent
public static void serverInit(FMLCommonSetupEvent event)
{
    NetworkHandler.init();
    ...
}

@SubscribeEvent
public static void serverInit(FMLClientSetupEvent event)
{
    NetworkHandler.init();
    ...
}
```
## Пример пакета
Создадим пакет SPacketParticles, данный пакет будет отсылаться на сервер, а затем сервер будет отсылать всем ближайшим игрокам данные о позиции частиц, которые испускает игрок. Отправлять данный пакет мы будем через метод sendToServer, вот так: NETWORK.sendToServer(new SPacketParticles());
```java
public class SPacketParticles extends NetworkHandler.Packet
{
    @Override
    public void encode(NetworkHandler.Packet simplePacket, PacketBuffer buf) {}

    @Override
    public SPacketParticles decode(PacketBuffer buf) {
        return null;
    }

    @Override
    public void server(ServerPlayerEntity player) {
        NetworkHandler.instance.sendToNear(new SPacketParticles(), new PacketDistributor.TargetPoint(player.getPosition().getX(), player.getPosition().getY(), player.getPosition().getZ(), 64.0, player.dimension));
    }
}
```
