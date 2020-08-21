description: Использование событий Forge API.

# Использование событий

События в Minecraft это то же, что и у нас. К примеру "Пошёл дождь", только в Minecraft событий не так много, как существует у нас в жизни. В данной статье вы научитесь использовать события.

Создадим класс EventsHandler.
```java
public class EventsHandler {
    @SubscribeEvent
    public void onJoin(EntityJoinWorldEvent e) {
        if (e.getEntity() instanceof EntityPlayer) {
            EntityPlayer player = (EntityPlayer) e.getEntity();
            player.sendMessage(new TextComponentString("Hello, %p!".replace("%p", player.getName())));
        }
    }

    @SubscribeEvent
    public void onDeath(LivingDeathEvent e) {
        if (e.getEntity() instanceof EntityPlayer) {
            EntityPlayer player = (EntityPlayer) e.getEntity();

            if (player.getName().equals("_Ivasik_"))
                player.dropItem(new ItemStack(Items.GOLDEN_APPLE, 1, 1), false);
        }
    }
}
```

В первом методе, при заходе сущности(Игрока) в мир, ему будет высвечиваться приветствие. А во втором методе, если игрок `_Ivasik_` погибает, то на его месте выбрасывается золотое яблоко. Вы так же можете отменить событие используя метод `e.setCanceled(true)`, но не все события можно отменять. Подробнее смотрите в статье `Таблица событий`

Приступим к регистрации, перейдём в CommonProxy и в метод preInit добавим шину регистрации. Рекомендуется использовать именно эту шину, а не FMLCommonHandler, который устарела и используется только на 1.7 и ниже версиях!
```java
MinecraftForge.EVENT_BUS.register(new EventsHandler());
```

Так же с приходом 1.12 версии события можно регистрировать автоматически, без добавления `MinecraftForge.EVENT_BUS`, для этого нужно:
1. В начале класса добавить аннотацию `@Mod.EventBusSubscriber`, должно получиться так:
```java
@Mod.EventBusSubscriber
public class EventsHandler {
    //что-то делаем
}
```
2. Методы должны быть статичными, пример:
```java
@SubscribeEvent
public static void onJoin(EntityJoinWorldEvent e) {
    //Что-то делаем
}
```
В аннотации `@Mod.EventBusSubscriber`, так же есть параметры:
* `side` - сторона на которой будет зарегистрировано событие. Доступные стороны: Client, Server
* `modid` - modId мода, этот параметр нужен лишь для того, чтобы избежать ошибки в регистрации, если используется несколько модов.
Пример использования:
```java
@Mod.EventBusSubscriber(Side.SERVER, modid = "myModid")
```
Данный способ работает не со всеми событиями!

Переходим в игру и смотрим на получившийся результат!