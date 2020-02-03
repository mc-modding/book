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
* `setUnlocalizedName(name)` - задаёт локализованное имя для нашего предмета, т.е. чтобы нам сделать перевод имени для предмета мы задаём имя которое будет в конечном итоге выглядеть вот так `item.*item_name*.name`.

## Регистрация

Создадим класс ItemsRegistry.

```java
/*
 * Указывает ModId для других ObjectHolder в классе
 * Если не добавлять аннотацию над классом, то каждый раз придётся прописывать ModId вручную.
 * Подробнее см. https://mcforge.readthedocs.io/en/latest/concepts/registries/#injecting-registry-values-into-fields
 */
@ObjectHolder("tut")
@Mod.EventBusSubscriber// Автоматическая регистрация статических обработчиков событий
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

Теперь можете запустить Minecraft и посмотреть свой предмет в живую. Чтобы получить предмет пропишите `/give @p tut:key`.
Вместо `tut` у вас должен быть `modid` вашего мода! Вместо `key` у вас должно быть регистрируемое имя вашего предмета.

[![Предмет от первого лица](images/face_first.png)](images/face_first.png)

[![Предмет от третьего лица](images/face_three.png)](images/face_three.png)

## Модель

!!! Внимание! 
    Данная часть главы находится на переработке!

Для начала добавим такой код в ItemsRegistry, в метод setRender
```java
Minecraft.getMinecraft().getRenderItem().getItemModelMesher().register(item, 0, new ModelResourceLocation(item.getRegistryName(), "inventory"));
```

Теперь Вы должны создать модель предмета, Вы можете создать как плоскую модель, примером может послужить яблоко или объёмную модель. Вот пример плоской модели:

```json
{
  "parent": "item/generated",
  "textures": {
    "layer0": "tut:items/key"
  }
}
```

[Объёмная модель](https://yadi.sk/d/JNFq9Y4h3KcrBv)

Если ваша текстура к модели берётся из самого Minecraft, то `tut:`(modid) прописывать не надо! В примере с объёмной моделью я решил использовать текстуру золотого блока из Minecraft. Текстуру необходимо добавить по пути:
```md
└── src    
    └── main
        └── resources
            └── assets
                └── tut
                    └── textures
                        └── items
```

`tut` - modid нашего мода.
`key` - регистрируемое имя нашего предмета.

Когда ваша модель готова, добавьте её по пути:
```md
└── src    
    └── main
        └── resources
            └── assets
                └── tut
                    └── models
                        └── item
```

Добавим в ClientProxy, в метод init такой код  `ItemsRegistry.registerRender();`.

И вот, что в конечном итоге у нас может получится.

[![Предмет с моделью от первого лица](images/model_face_first.png)](images/model_face_first.png)

[![Предмет с моделью от третьего лица](images/model_face_three.png)](images/model_face_three.png)