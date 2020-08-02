description: Статья о создании собственных агрокультур.

# Агрокультуры
У нас уже есть кокос, но нету пальмы. Давайте это исправим(у нас будет маленько карликавая пальма).

## Блок агрокультуры

Давайте создадим класс под названием `PalmeBlock`, который будет унаследован от `CropsBlock`, где предопределим getSeedsItem, getShape, getDrops и getMaxAge.
```java
public class PalmeBlock extends CropsBlock implements INonItem
{
    public PalmeBlock()
    {
        super(Block.Properties.create(Material.PLANTS).doesNotBlockMovement().tickRandomly().hardnessAndResistance(0, 0).sound(SoundType.CROP));
    }

    @Nonnull
    @Override
    protected IItemProvider getSeedsItem()
    {
        return TutItems.COCOUNT.get();
    }

    @Override
    public int getMaxAge()
    {
        return 4;
    }

    @Nonnull
    @Override
    public VoxelShape getShape(BlockState state, @Nonnull IBlockReader worldIn, @Nonnull BlockPos pos, @Nonnull ISelectionContext context)
    {
        switch(state.get(this.getAgeProperty()))
        {
            case 0:
                return Block.makeCuboidShape(0.0D, 0.0D, 0.0D, 16.0D, 2.0D, 16.0D);
            case 1:
                return Block.makeCuboidShape(0.0D, 0.0D, 0.0D, 16.0D, 4.0D, 16.0D);
            case 2:
                return Block.makeCuboidShape(0.0D, 0.0D, 0.0D, 16.0D, 8.0D, 16.0D);
            default:
                return Block.makeCuboidShape(0.0D, 0.0D, 0.0D, 16.0D, 12.0D, 16.0D);
        }
    }

    @Nonnull
    @Override
    public List<ItemStack> getDrops(@Nonnull BlockState state, LootContext.Builder builder)
    {
        return isMaxAge(state) ? ImmutableList.of(new ItemStack(TutItems.COCOUNT.get(), 1 + builder.getWorld().rand.nextInt(4))) :
                ImmutableList.of(new ItemStack(TutItems.COCOUNT.get(), 1), new ItemStack(Items.STICK, state.get(this.getAgeProperty())));
    }
}
```

Разберем:
 *  Предмета не регистрируется.
 * `getSeedsItem` Возвращает семя, из которого вырастает наша пальма.
 * `getMaxAge` Возвращает максимальный возраст растения.
 * `getShape` Возврщает коллизию растения в зависимости от стадии роста.
 * `getDrops` Возвращает дроп. Если выросло, то выпадает от 1 до 5 кокосов, если нет, то 1 кокос и столько палок, сколько стадий роста прошло.

Теперь стандартная регистрация блока. Но есть проблема. Мы все еще не можем посадить кокос. Для того чтоб это исправить нам надо сменить родителя кокоса на BlockNamedItem и передать по параметру наш блок пальмы:
```java
public class CoconutItem extends BlockNamedItem
{
    public CoconutItem()
    {
        super(TutBlocks.PALME.get(), new Properties()
                .group(TutMod.TUT_GROUP)
                .food(
                        new Food.Builder()
                                .hunger(5)
                                .saturation(5).
                                setAlwaysEdible()
                                .fastToEat()
                 .effect(() -> new EffectInstance(Effects.GLOWING, 10, 100), 10)
                 .build()));
    }
}
```
Все теперь сажается и даже ростет! Но ростим мы квадратики. Давайте ростить пальму! 

## Моделька для нашей агрокультуры, используя форджевский формат модели

Теперь нужно создать файл блокстейта для нашей пальмы. Создадим json файл `palme` в папке с блок стейтами. Наследоваться будем от `cross` чтоб плучить красивую модельку крестиком.

```json
{
  "forge_marker": 1,
  "defaults": 
  {
    "model": "cross"
  },
  "variants": {
    "age": { 
      "0": { "textures": { "cross": "tut:blocks/palme/stage_0" }},
      "1": { "textures": { "cross": "tut:blocks/palme/stage_1" }},
      "2": { "textures": { "cross": "tut:blocks/palme/stage_2" }},
      "3": { "textures": { "cross": "tut:blocks/palme/stage_3" }},
      "4": { "textures": { "cross": "tut:blocks/palme/stage_4" }}
    }
  }
}
```

Рассмотрим его содержимое подробнее.

`forge_marker` определяет версию блокстейта, всегда равен 1.

Блок `defaults` содержит указание на используемую модель. 
Блок `variants` используется для определения текстур, которые должен использовать блок в разный ситуациях. В нашем случае это изменение "age".

Теперь нужно добавить текстуры. В соответствии с блокстейтом их должно быть 5,  разместим их по пути "src/main/resources/assets/tut/textures/blocks/palme/". 
Красота! Результат:
