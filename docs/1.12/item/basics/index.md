description: Создание собственного предмета.

# Создание предмета

## Основа

Создадим класс для нашего предмета.

```java
public class ItemKey extends Item {
    public ItemKey() {
        this.setRegistryName("key");
        this.setUnlocalizedName("key");
    }
}
```

* `setRegistryName(name)` - задаёт регистрируемое имя для нашего предмета, т.е. данное имя будет зарегистрировано в игре и его нельзя будет уже использовать более. В игре будет отображаться как `modid:*item_name*`. Чтобы это увидеть нажмите сочетание клавиш `F3+H`
* `setUnlocalizedName(name)` - задаёт локализованное имя для нашего предмета, т.е. чтобы нам сделать перевод имени для предмета мы задаём имя, которое будет в конечном итоге выглядеть вот так `item.*item_name*.name`.

## Регистрация

Создадим класс ItemsRegistry.

```java
/*
 * Указывает ModId для других ObjectHolder в классе
 * Если не добавлять аннотацию над классом, то каждый раз придётся прописывать ModId вручную.
 * Подробнее см. https://mcforge.readthedocs.io/en/latest/concepts/registries/#injecting-registry-values-into-fields
 */
@ObjectHolder("tut")
@Mod.EventBusSubscriber// Автоматическая регистрация статичных обработчиков событий
public class ItemsRegistry {
    /*
     * Получение предмета по ключу. Вы также можете использовать данную аннотацию для получения ванильных предметов
     * Если вы не добавляли аннотация над классом, то в таком случаи вам нужно прописать вместо `key` -> `tut:key`
     */
    @ObjectHolder("key")
    public static final Item KEY = null;

    /*
     * Начиная с 1.12 регистрацию предметов/блоков/моделей и т.п. следует проводить в специальном событии.
     * Событие Register<IForgeRegistryEntry> поддерживает регистрацию: Block, Item, Potion, Biome, SoundEvent, 
     * PotionType, Enchantment, IRecipe,  VillagerProfession, EntityEntry.
     * Обратите внимание! Метод является статичным, так как мы используем EventBusSubscriber
     */
    @SubscribeEvent
    public static void onRegistryItem(RegistryEvent.Register<Item> e) {
        // Также вместо `register` можно использовать `registerAll`, чтобы прописать все предметы разом
        e.getRegistry().register(new ItemKey());
    }

    /*
     * Начиная с 1.11 регистрацию моделей для предметов/блоков следует проводить в специальном событии.
     * Обратите внимание! Метод является статичным, так как мы используем EventBusSubscriber
     */
    @SubscribeEvent
    @SideOnly(Side.CLIENT)
    public static void onRegistryModel(ModelRegistryEvent e) {
        // См. следующую часть данной главы
    }
}
```

Всё! Вот так быстро и просто мы создали основной класс для регистрации предметов. Чтобы использовать наш предмет,
где-то в моде, достаточно написать `ItemsRegistry.KEY`. Больше никаких манипуляций с классом не требуется,
его не нужно прописывать в стадии загрузки игры. Хотелось бы ещё отметить то, что блоки всегда будут регистрироваться раньше,
чем предметы!

Теперь можете запустить Minecraft и посмотреть свой предмет в живую. Для получения предмета пропишите `/give @p tut:key`.
Вместо `tut` у вас должен быть `modId` мода! Вместо `key` у вас должно быть регистрируемое имя вашего предмета.

[![Предмет от первого лица](images/face_first.png)](images/face_first.png)

[![Предмет от третьего лица](images/face_three.png)](images/face_three.png)

## Модель

После последних обновлений Forge для 1.12.2, произошли некоторые изменения в регистрации моделей для блоков и предметов.
Для удобства напишем метод `registryModel` в нашем классе `ItemsRegistry`.

```java
@SideOnly(Side.CLIENT)
private static void registryModel(Item item) {
    final ResourceLocation regName = item.getRegistryName();// Не забываем, что getRegistryName может вернуть Null!
    final ModelResourceLocation mrl = new ModelResourceLocation(regName, "inventory");
    ModelBakery.registerItemVariants(item, mrl);// Регистрация вариантов предмета. Это нужно если мы хотим использовать подтипы предметов/блоков(см. статью подтипы)
    ModelLoader.setCustomModelResourceLocation(item, 0, mrl);// Устанавливаем вариант модели для нашего предмета. Без регистрации варианта модели, сама модель не будет установлена для предмета/блока(см. статью подтипы)
}
```

Теперь пропишем в наш ранее созданный метод-обработчик `registryModel(KEY)`. Всё! Наша модель для предмета `KEY` зарегистрирована! 
Далее перейдём к самой модели! Мы должны создать модель предмета, вы можете создать как плоскую модель(примером может послужить яблоко), так и объёмную модель. 

Создадим файл `key.json` и перенесём его в папку по данному пути `src/main/resources/assets/tut/models/item`.

Пропишем такой код для плоской модели:
```json
{
  "parent": "item/generated",
  "textures": {
    "layer0": "tut:items/key"
  }
}
```

`tut` - modId мода.
`key` - регистрируемое имя нашего предмета.

Если ваша текстура к модели берётся из самого Minecraft, то `tut:`(modId) прописывать не надо! Текстуру необходимо добавить по пути:
```md
src/main/resources/assets/tut/textures/items
```

Запускаем игру и видим, что у нас получилось(на скриншотах объёмная модель):
[![Предмет с моделью от первого лица](images/model_face_first.png)](images/model_face_first.png)

[![Предмет с моделью от третьего лица](images/model_face_three.png)](images/model_face_three.png)