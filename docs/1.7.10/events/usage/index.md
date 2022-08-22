description: Использование событий Forge API.

# Использование событий

События в Minecraft это то же, что и у нас. К примеру "Пошёл дождь", только в Minecraft событий не так много, как существует у нас в жизни. В данной статье вы научитесь использовать события.

Создадим класс EventsHandler.
```java
public class EventsHandler {
    @SubscribeEvent
    public void onJoin(EntityJoinWorldEvent e) {
        if (e.entity instanceof EntityPlayer) {
            EntityPlayer player = (EntityPlayer) e.entity;
            player.addChatMessage(new ChatComponentText("Hello, %p!".replace("%p", player.getCommandSenderName())));
        }
    }

    @SubscribeEvent
    public void onDeath(LivingDeathEvent e) {
        if (e.entity instanceof EntityPlayer) {
            EntityPlayer player = (EntityPlayer) e.entity;

            if (player.getCommandSenderName().equals("FoxySister"))
                player.dropItem(Items.golden_apple, 1);
        }
    }
}
```

В первом методе, при заходе сущности(Игрока) в мир, ему будет высвечиваться приветствие. А во втором методе, если игрок `FoxySister` погибает, то на его месте выбрасывается золотое яблоко. Вы так же можете отменить событие используя метод `e.setCanceled(true)`, но не все события можно отменять. Подробнее смотрите в статье `Таблица событий`

Приступим к регистрации, перейдём в CommonProxy и в метод preInit добавим шину регистрации. Подбронее какую шину именно использовать смотрите в статье `Таблица событий` 
```java
MinecraftForge.EVENT_BUS.register(new EventsHandler());

//или

FMLCommonHandler.instance().bus().register(new EventsHandler());
```

Переходим в игру и смотрим на получившийся результат!