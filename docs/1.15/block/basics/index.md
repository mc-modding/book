description: Создание собственного блока.

# Создание блока

## Основа

Создадим класс для нашего предмета.

```java
public class BlockBestStone extends Block
{
    public BlockBestStone(String name)
    {
        super(Material.ROCK);
        this.setRegistryName(name);
        this.setUnlocalizedName(name);
    }

    @Override
    public boolean isOpaqueCube(IBlockState state)
    {
        return false;
    }

    @Override
    public boolean isFullCube(IBlockState state)
    {
        return false;
    }
}
```

* `Material.ROCK` - задаёт материал блоку, т.е. материал будет влиять на ломание блока, звук хождения по нему, а так же на предметы которые могут ломать данный материал.
* `setRegistryName(name)` - задаёт регистрируемое имя для нашего предмета, т.е. данное имя будет зарегистрировано в игре и его нельзя будет уже использовать более. В игре будет отображаться как `modid:*block_name*`. Чтобы это увидеть нажмите сочетание клавиш `F3+H`
* `setUnlocalizedName(name)` - задаёт локализационное имя для нашего предмета, т.е. чтобы нам сделать перевод имени для предмета мы задаём имя которое будет в конечном итоге выглядеть вот так `tile.*block_name*.name`.
* `isOpaqueCube` - этот метод задаёт логическое значение о том, будет ли блок непрозрачным, зададим false чтобы наша модель не создавала эффект X-Ray. Если вы не делаете модель для блока, то можете не переопределять этот метод.
* `isFullCube` - этот метод задаёт логическое значение о том, будет ли блок полным. Если указано true, то блок будет создавать тень, но это нужно лишь когда ваш блок не имеет модели!


Вы так же можете вынести `Material` в параметр конструктора, чтобы можно было задавать разные материалы для других блоков.

## Регистрация

Создадим класс BlocksRegister.

```java
public class BlocksRegister
{
    public static Block BEST_STONE = new BlockBestStone("best_stone");

    public static void register()
    {
        setRegister(BEST_STONE);
    }

    @SideOnly(Side.CLIENT)
    public static void registerRender()
    {
        setRender(BEST_STONE);
    }

    private static void setRegister(Block block)
    {
        ForgeRegistries.BLOCKS.register(block);
        ForgeRegistries.ITEMS.register(new ItemBlock(block).setRegistryName(block.getRegistryName()));
    }

    @SideOnly(Side.CLIENT)
    private static void setRender(Block block)
    {

    }
}
```

* `setRegister(block)` - данный метод будет регистрировать наш блок
* `setRender(block)` - данный метод будет регистрировать модель для нашего блока

Возможно вы заметили, что в методе `setRegister` появился ещё один регистратор в виде предмета. Начиная с 1.9 версии Minecraft, блоки регистрируются в два этапа. Первый этап это сам блок, который ставится и блок в виде предмета.

Нам нужно добавить в CommonProxy, в метод preInit такую строку кода `BlocksRegister.register();`.

Теперь можете запустить Minecraft нажав на кнопку `run` и посмотреть свой блок в живую. Чтобы получить блок пропишите `/give @p tut:best_stone`.
Вместо `tut` у Вас должен быть `modid` вашего мода! Вместо `best_stone` у Вас должно быть регистрируемое имя вашего блока.

[![Блок от первого лица](images/face_first.png)](images/face_first.png)

[![Блок от третьего лица](images/face_three.png)](images/face_three.png)

## Модель

Для начала добавим такой код в BlocksRegister, в метод setRender
```java
Minecraft.getMinecraft().getRenderItem().getItemModelMesher().register(Item.getItemFromBlock(block), 0, new ModelResourceLocation(block.getRegistryName(), "inventory"));
```

Создадим файл `best_stone.json`. По пути:
```md
└── src    
    └── main
        └── resources
            └── assets
                └── tut
                    └── blockstates
```

```json
{
    "variants": {
        "normal": { "model": "tut:best_stone" }
    }
}
```

Теперь Вы должны создать тип рендера блока, Вы можете создать как стандартный тип рендера блока, примером может послужить камень, так и тип рендера в виде  модели. Вот пример стандартного типа рендера:

```json
{
    "parent": "block/cube_all",
    "textures": {
        "all": "tut:blocks/best_stone"
    }
}
```

Название файла должно быть таким же как и в `blockstates` -> `best_stone`, в переменной `model`!


Теперь Вам надо создать `best_stone.json`. По пути:
```md
└── src    
    └── main
        └── resources
            └── assets
                └── tut
                    └── models
                        └── item
```
Пример:
```json
{
    "parent": "tut:block/best_stone"
}
```

[Модель](https://yadi.sk/d/n9ehtKYk3LT9qv)

В этом файле будет хранится информация о состояниях блоков. (Подробнее про состояние блоков, вы сможете прочитать в следующей статье)

Если ваша текстура к модели берётся из самого Minecraft, то `tut:`(modid) прописывать не надо! В примере с объёмной моделью я решил использовать текстуру камня из Minecraft.

`tut` - modid нашего мода.
`best_stone` - регистрируемое имя нашего блока.

Когда ваша модель готово, добавьте её по пути:
```md
└── src    
    └── main
        └── resources
            └── assets
                └── tut
                    └── models
                        └── block
```

Добавим в ClientProxy, в метод init такой код  `BlocksRegister.registerRender();`.

И вот, что в конечном итоге у нас может получится.

[![Блок с моделью от первого лица](images/model_face_first.png)](images/model_face_first.png)

[![Блок с моделью от третьего лица](images/model_face_three.png)](images/model_face_three.png)

[![Блок с моделью на земле](images/model_on_ground.png)](images/model_on_ground.png)
