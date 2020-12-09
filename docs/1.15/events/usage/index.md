description: Использование событий Forge API.

# Использование событий

События в Minecraft это тоже, что и у нас. К примеру "Пошёл дождь", только в Minecraft событий не так много, как существует у нас в жизни. В данной статье вы научитесь использовать события.

Создадим класс EventsHandler.
```java
public class EventsHandler
{
    @SubscribeEvent
    public void onJoin(EntityJoinWorldEvent event)
    {
        if (event.getEntity() instanceof PlayerEntity)
        {
            PlayerEntity player = (PlayerEntity) event.getEntity();
            player.sendMessage(new StringTextComponent("Hello, %p!".replace("%p", player.getName().getFormattedText())));
        }
    }

    @SubscribeEvent
    public void onDeath(LivingDeathEvent event)
    {
        if (event.getEntity() instanceof PlayerEntity)
        {
            PlayerEntity player = (PlayerEntity) event.getEntity();

            if (player.getName().equals("_Ivasik_"))
            {
                player.dropItem(new ItemStack(Items.GOLDEN_APPLE, 1), false);
            }
        }
    }
}
```

В первом методе, при заходе сущности(Игрока) в мир, ему будет высвечиваться приветствие. А во втором методе, если игрок `_Ivasik_` погибает, то на его месте дропается золотое яблоко. Вы так же можете отменить событие используя метод `e.setCanceled(true)`, но не все события можно отменять. Подробнее смотрите в статье `Таблица событий`

Приступим к регистрации, для этого нужно:
1. В начале класса добавить аннотацию `@Mod.EventBusSubscriber`, должно получиться так:
```java
@Mod.EventBusSubscriber
public class EventsHandler
{
    //что-то делаем
}
```
2. Методы должны быть статичными, пример:
```java
@SubscribeEvent
public static void onJoin(EntityJoinWorldEvent event)
{
    //Что-то делаем
}
```
В аннотации `@Mod.EventBusSubscriber`, так же есть параметры:
* `value` - сторона на которой будет зарегистрировано событие. Доступные стороны: Client, Server
* `modid` - modid вашего мода, этот параметр нужен лишь для того, чтобы избежать ошибки в регистрации, если используется несколько модов.
* `bus`   - Шина, через которую ббудет происходить регистрация, при использовании событий регистрации.
Пример использования:
```java
@Mod.EventBusSubscriber(modid = Main.MOD_ID, bus = Mod.EventBusSubscriber.Bus.MOD, value = Dist.CLIENT)
```
Переходим в игру и смотрим на получившийся результат!
