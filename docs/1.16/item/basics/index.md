# Создание предмета

## Создание класса предмета

Создадим класс для предмета

```java
public class IronRodItem extends Item {
    public IronRodItem(Properties properties) {
        super(properties)
    }
}
```

## Подготовка класса предметов

Создадим класс ModItems в папке item.

```java
public class ModItems {
    public static DeferredRegister<Item> ITEMS =
        DeferredRegister.create(ForgeRegistries.ITEMS, mod_id);
    
    //Метод нужен для регистрации класса в главном классе мода
    public static void register(IEventBus eventBus) {
        ITEMS.register(eventBus)
    }
}
```

* `mod_id` - идентификатор вашего мода

Также добавим в главный класс в главный метод такой код:

```java
ModItems.register(eventBus);
```

* `register(eventBus)` - регистрирует предметы в главном классе

## Регистрация

Перед `public static void register(IEventBus eventBus) { ITEMS.register(eventBus) }` пишем: 

```java
//Регистрация предмета
public static final RegistryObject<Item> IRON_ROD = ITEMS.register("iron_rod", () -> new IronRodItem(new Item.Properties().tab(Tab).maxStackSize(int).setNoRepair().rarity(Rarity.rariry).maxDamage(int)));
```

* `iron_rod` - идентификатор вашего предмета
* `.maxStackSize(int) - устанавливает максимальное количество предметов в 1 стаке (необязательно)
* `.maxDamage` - задаёт прочность предмета (необязательно)
* `.setNoRepair()` - теперь ваш предмет нельзя будет починить (необязательно)
* `.rarity(Rarity.rarity)` - редкость предмета (COMMON - обычный, UNCOMMON - необычный) (необязательно)
* `.tab(Tab)` - Устанавливает вкладку в творческом режиме (необязательно)
* `() -> new IronRodItem` - класс предмета (можно класс `IronRodItem` заменить на класс `Item` (стандартный класс предмета))

Теперь можно запустить Minecraft и прописать команду `/give @s tut:iron_rod`
Не забываем заменить `tut` и `iron_rod`

## Текстура и модель

Перейдём по пути: `src/main/resources/assets/mod_id/models/item`, здесь создадим файл `item_id.json`, а в него добавим такой код:

```json
{
    "parent": "item/generated",
    "textures": {
        "layer0": "tutorial:item/iron_rod"
    }
}
```
`tut` - modId мода, `iron_rod` - регистрируемое имя предмета

Теперь надо добавить текстуру с названием item_id в формате `.png` по пути `src/resources/assets/mod_id/textures/item`

## Объёмная модель

Создаём 3д модель в удобном вам редакторе (в формате .json и лучше в программе Blockbench) и добавляем модель по пути `src/main/resources/assets/mod_id/models/item`
(с названием как у идентификатора вашего предмета) и не забываем про текстуру (см. предыдущий раздел Текстура и модель)
Поздравляем! Предмет готов
