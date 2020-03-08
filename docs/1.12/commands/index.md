description: Создание собственной команды.

# Создание команды

## Основа

В этой статье мы научимся писать собственные команды на примере телепортации к последней точке смерти. Давайте зайдем в класс [EventsHandler](https://mcmodding.ru/1.12/events/usage/).

Добавим в него статическое поле DeathPositions.

```Java
public static Map<String, BlockPos> DeathPositions = new HashMap<String, BlockPos>();
```

Данное поле использует HashMap, т.е. мы сможем получать значение по его ключу. Хочу вас предупредить, что создавать данное поле в этом классе было неверным решением с точки зрения проектирования мода. Но т.к. это пример, то мы простим это себе.

Теперь давайте подпишемся на событие смерти игрока.

```Java
@SubscribeEvent
public void onDeath(LivingDeathEvent event)
{
  // Проверяем, является ли сущность игроком
  if (event.getEntity() instanceof EntityPlayer)
  {
    // Приводим тип `LivingDeathEvent` к типу `EntityPlayer`.
    EntityPlayer player = (EntityPlayer) event.getEntity();
    // Получаем имя игрока
    String playerName = player.getName();

    // Если игрок отсутствует в HashMap
    // То помещаем его в HashMap.
    if (DeathPositions.get(playerName) == null)
    {
      DeathPositions.put(playerName, player.getPosition());
      return;
    }

    // Если игрок все же присутствует, то мы заменяем уже существующее значение на более новое.
    DeathPositions.replace(playerName, player.getPosition());
  }
}
```

Полный код класса EventsHandler.

```Java
public class EventsHandler
{
	public static Map<String, BlockPos> DeathPositions = new HashMap<String, BlockPos>();

  public void onDeath(LivingDeathEvent event)
  {
    if (event.getEntity() instanceof EntityPlayer)
    {
      EntityPlayer player = (EntityPlayer) event.getEntity();
      String playerName = player.getName();

      if (DeathPositions.get(playerName) == null)
      {
        DeathPositions.put(playerName, player.getPosition());
        return;
      }

      DeathPositions.replace(playerName, player.getPosition());
    }
  }
```

Создадим класс команды ReturnDeath

```Java
public class ReturnDeath implements ICommand
{
  @Override
	public String getName()
  {
		return null;
	}

	@Override
	public String getUsage(ICommandSender sender)
  {
		return null;
	}

	@Override
	public void execute(MinecraftServer server, ICommandSender sender, String[] args) throws CommandException
  {
    return;
  }
}
```

- `getName` - возвращает название команды.
- `getUsage` - возвращает подсказки по использованию команды.
- `execute` - метод, который выполняется когда команда введена.

```Java
@Override
public String getName()
{
  // Название нашей команды.
  // Например /tpds
  return "tpds";
}
```

Назовем нашу команду tpds. Это значит, что когда игрок введет /tpds, то он телепортируется на последнюю точку смерти.

```Java
@Override
	public String getUsage(ICommandSender sender)
  {
		return "tpds";
	}
```

У нашей команды не будет аргументов, поэтому мы просто выведем команду.

```Java
@Override
public void execute(MinecraftServer server, ICommandSender sender, String[] args) throws CommandException
{
  World world = sender.getEntityWorld();

  // Убедимся, что действия происходят на стороне сервера
  if (!world.isRemote)
  {
    // Проверяем, является ли отправитель игроком
    if (sender instanceof EntityPlayer)
			{
        // Преобразовываем `ICommandSender` в `EntityPlayer`
				EntityPlayer player = (EntityPlayer) sender;

        // Получаем место смерти игрока, по его нику.
				BlockPos position = EventsHandler.DeathPositions.get(player.getName());

        // Проверяем, умирал ли игрок.
        // Если игрок умирал, то выводим сообщение, что он еще не умирал
				if (position == null)
				{
					sender.sendMessage(new TextComponentString("You didn't have time to die"));
					return;
				}

        // Если игрок умирал, то телепортируем его по координатам
				player.setPositionAndUpdate(position.getX(), position.getY(), position.getZ());
			}
  }
}
```

Данная реализация не подразумевает проверку мира. Т.е. если игрок умер в аду, а пропишет команду в обычном world, то его не телепортирует в ад.

## Регистрация команды

Перейдем в наш главный класс и добавим в него новый EventHandler.

```Java
@EventHandler
public void start(FMLServerStartingEvent event)
{
  event.registerServerCommand(new ReturnDeath());
}
```
