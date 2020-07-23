description: Создание собственного блока.

# Создание блока

## Основа

Создадим класс для нашего блока.

```java
public class IdealBlock extends Block
{
    public IdealBlock()
    {
        super(Properties.create(Material.ROCK).harvestTool(ToolType.PICKAXE));
    }

    @Override
    public List<ItemStack> getDrops(BlockState state, LootContext.Builder builder)
    {
        return ImmutableList.of(new ItemStack(Items.CAKE, 8), new ItemStack(Items.TORCH, 1));
    }
}
```

* `Material.ROCK` - задаёт материал блоку, т.е. материал будет влиять на ломание блока, звук хождения по нему, а так же на предметы которые могут ломать данный материал.
* `ToolType.PICKAXE` - задает тип эффективного инструмента.
* `getDrops` - возвращает список предметов, которые должны выпасть с блока. 8 тортиков и 1 факел.

Также можно вынести Properties в конструктор.

## Регистрация

Создадим класс TutBlocks, пустой интерфейс INonItem.

```java
@Mod.EventBusSubscriber(modid = TestMod.MOD_ID, bus = Mod.EventBusSubscriber.Bus.MOD)
public class TutBlocks
{
    private static final DeferredRegister<Block> BLOCKS = new DeferredRegister<>(ForgeRegistries.BLOCKS, TestMod.MOD_ID);

    public static final RegistryObject<Block> IDEAL = BLOCKS.register("ideal",  IdealBlock::new);

    public static void register()
    {
        BLOCKS.register(FMLJavaModLoadingContext.get().getModEventBus());
    }

    @SubscribeEvent
    public static void onRegisterItems(final RegistryEvent.Register<Item> event)
    {
        final IForgeRegistry<Item> registry = event.getRegistry();
        TutBlocks.BLOCKS.getEntries().stream()
                .map(RegistryObject::get)
                .filter(block -> !(block instanceof INonItem))
                .forEach(block -> {
                    final Item.Properties prop = new Item.Properties();
                    final BlockItem blockItem = new BlockItem(block, prop);
                    blockItem.setRegistryName(block.getRegistryName());
                    registry.register(blockItem);
                });
    }
}
```

* `register(block)` - регестрирует блоки.
* `IDEAL` - обьект регистрации нашего блока. Чтоб получить сам блок нужно вызвать метод get().
* `onRegisterItems` - регестрирует предметы для блоков которые не наследуют INonItem.
* `INonItem` - пустой интерфейс для отмены регистрации предмета.

Нам нужно добавить в конструктор основоного класса TutBlocks.register() для регистрации блоков.
Теперь можете запустить Minecraft нажав на кнопку `run` и посмотреть свой блок в живую. Чтобы получить блок пропишите `/give @p tut:ideal`.
Вместо `tut` у Вас должен быть `modid` вашего мода! Вместо `ideal` у Вас должно быть регистрируемое имя вашего блока.

[![Блок от первого лица](images/face_first.png)](images/face_first.png)

[![Блок от третьего лица](images/face_three.png)](images/face_three.png)

## Модель

Создадим файл `ideal.json`. По пути:
```md
└── src    
    └── main
        └── resources
            └── assets
                └── tut
                    └── blockstates
```
С содержанием:
```json
{
    "variants": {
        "": { "model": "tut:block/ideal" }
    }
}
```
В этом файле будет хранится информация о состояниях блоков. (Подробнее про состояние блоков, вы сможете прочитать в следующей статье)
Теперь вы должны создать модель блока, вы можете создать как наследника стандартного блока, примером может послужить камень, так и свою собственную. Вот пример стандартной модели:

```json
{
    "parent": "block/cube_all",
    "textures": {
        "all": "tut:blocks/ideal"
    }
}
```
Если ваша текстура к модели берётся из самого Minecraft, то `tut:`(modid) прописывать не надо! В примере с объёмной моделью я решил использовать текстуру камня из Minecraft.
Название файла должно быть таким же как и в `blockstates` -> `ideal`, в переменной `model`!

Пример сложной модели(Позаимствован из Туманного мира с разрешением Liahim):
```json
{
    "textures": {
        "particle": "tut:blocks/campfire_pot",
        "pot": "tut:blocks/campfire_pot"
    },
    "elements": [
        {
            "name": "pot D",
            "from": [  4.5, 6.0,  4.5 ],
            "to":   [ 11.5, 8.0, 11.5 ],
            "faces": {
                "north": { "texture": "#pot", "uv": [ 5.0, 14.0, 12.0, 16.0 ] },
                "east":  { "texture": "#pot", "uv": [ 5.0, 14.0, 12.0, 16.0 ] },
                "south": { "texture": "#pot", "uv": [ 5.0, 14.0, 12.0, 16.0 ] },
                "west":  { "texture": "#pot", "uv": [ 5.0, 14.0, 12.0, 16.0 ] },
                "up":    { "texture": "#pot", "uv": [ 5.0,  7.0, 12.0, 14.0 ] },
                "down":  { "texture": "#pot", "uv": [ 5.0,  7.0, 12.0, 14.0 ] }
            }
        },
        {
            "name": "pot N",
            "from": [  4.5,  7.0, 3.5 ],
            "to":   [ 11.5, 13.0, 4.5 ],
            "faces": {
                "north": { "texture": "#pot", "uv": [ 5.0,  0.0, 12.0,  6.0 ] },
                "east":  { "texture": "#pot", "uv": [ 4.0,  0.0,  5.0,  6.0 ] },
                "south": { "texture": "#pot", "uv": [ 5.0,  9.0, 12.0, 15.0 ] },
                "west":  { "texture": "#pot", "uv": [ 4.0,  0.0,  5.0,  6.0 ] },
                "up":    { "texture": "#pot", "uv": [ 5.0,  6.0, 12.0,  7.0 ] },
                "down":  { "texture": "#pot", "uv": [ 5.0, 15.0, 12.0, 16.0 ] }
            }
        },
        {
            "name": "pot E",
            "from": [ 11.5,  7.0,  4.5 ],
            "to":   [ 12.5, 13.0, 11.5 ],
            "faces": {
                "north": { "texture": "#pot", "uv": [  4.0,  0.0,  5.0,  6.0 ] },
                "east":  { "texture": "#pot", "uv": [  5.0,  0.0, 12.0,  6.0 ] },
                "south": { "texture": "#pot", "uv": [  4.0,  0.0,  5.0,  6.0 ] },
                "west":  { "texture": "#pot", "uv": [  5.0,  9.0, 12.0, 15.0 ] },
                "up":    { "texture": "#pot", "uv": [ 12.0,  7.0, 13.0, 14.0 ] },
                "down":  { "texture": "#pot", "uv": [  5.0, 15.0, 12.0, 16.0 ] }
            }
        },
        {
            "name": "pot S",
            "from": [  4.5,  7.0, 11.5 ],
            "to":   [ 11.5, 13.0, 12.5 ],
            "faces": {
                "north": { "texture": "#pot", "uv": [ 5.0,  9.0, 12.0, 15.0 ] },
                "east":  { "texture": "#pot", "uv": [ 4.0,  0.0,  5.0,  6.0 ] },
                "south": { "texture": "#pot", "uv": [ 5.0,  0.0, 12.0,  6.0 ] },
                "west":  { "texture": "#pot", "uv": [ 4.0,  0.0,  5.0,  6.0 ] },
                "up":    { "texture": "#pot", "uv": [ 5.0, 14.0, 12.0, 15.0 ] },
                "down":  { "texture": "#pot", "uv": [ 5.0, 15.0, 12.0, 16.0 ] }
            }
        },
        {
            "name": "pot W",
            "from": [ 3.5,  7.0,  4.5 ],
            "to":   [ 4.5, 13.0, 11.5 ],
            "faces": {
                "north": { "texture": "#pot", "uv": [  4.0,  0.0,  5.0,  6.0 ] },
                "east":  { "texture": "#pot", "uv": [  5.0,  0.0, 12.0,  6.0 ] },
                "south": { "texture": "#pot", "uv": [  4.0,  0.0,  5.0,  6.0 ] },
                "west":  { "texture": "#pot", "uv": [  5.0,  0.0, 12.0,  6.0 ] },
                "up":    { "texture": "#pot", "uv": [  4.0,  7.0,  5.0, 14.0 ] },
                "down":  { "texture": "#pot", "uv": [  5.0, 15.0, 12.0, 16.0 ] }
            }
        },
        {
            "name": "Handle E",
            "from": [ 12.5, 12.0, 6.5 ],
            "to":   [ 13.5, 13.0, 9.5 ],
            "faces": {
                "north": { "texture": "#pot", "uv": [  4.0,  0.0,  5.0,  1.0 ] },
                "east":  { "texture": "#pot", "uv": [  7.0,  0.0, 10.0,  1.0 ] },
                "south": { "texture": "#pot", "uv": [  4.0,  0.0,  5.0,  1.0 ] },
                "up":    { "texture": "#pot", "uv": [ 13.0,  9.0, 14.0, 12.0 ] },
                "down":  { "texture": "#pot", "uv": [  7.0, 15.0, 10.0, 16.0 ] }
            }
        },
        {
            "name": "Handle W",
            "from": [ 2.5, 12.0, 6.5 ],
            "to":   [ 3.5, 13.0, 9.5 ],
            "faces": {
                "north": { "texture": "#pot", "uv": [ 4.0,  0.0,  5.0,  1.0 ] },
                "west":  { "texture": "#pot", "uv": [ 7.0,  0.0, 10.0,  1.0 ] },
                "south": { "texture": "#pot", "uv": [ 4.0,  0.0,  5.0,  1.0 ] },
                "up":    { "texture": "#pot", "uv": [ 3.0,  9.0,  4.0, 12.0 ] },
                "down":  { "texture": "#pot", "uv": [ 7.0, 15.0, 10.0, 16.0 ] }
            }
        }
    ]
}
```

Теперь Вам надо создать `ideal.json`. По пути:
```md
└── src    
    └── main
        └── resources
            └── assets
                └── tut
                    └── models
                        └── item
```
```json
{
    "parent": "tut:block/ideal"
}
```
С простой моделью:
[![Блок с простой моделью](images/model_on_ground.png)](images/model_on_ground.png)
Со сложной моделью:
[![Блок с сложной моделью](images/model_face_three.png)](images/model_face_three.png)

