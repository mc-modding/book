description: Добавление собственных состояний блоков.

# Состояние блока

Что такое `Blockstates` или же по простому `состояние блоков`? Данный термин появился в 1.8, состояние блоков позволяет задать определённый параметр блоку, при достижении которого, блок будет менять свою модель. Примером могут послужить: пшеница, датчик дневного света, калитка, забор и т.д. У каждого из этих блоков есть свои состояния, которые применяются в тех или иных ситуациях, и о которых пойдёт речь в данной статье.

В игре существует только 3 типа состояний блоков:
* `BooleanProperty` - логический тип. Хранит в себе логические значения.
* `PropertyEnum` - перечисляемый тип. Хранит в себе перечисляемые значения.
* `PropertyInteger` - целочисленный тип. Хранит в себе числа от `0` до `2147483647`. (знак минус применять не рекомендуется, так что весь счёт начинается от 0!)

## BooleanProperty

Перейдём в ранее созданный класс `IdealBlock` и создадим переменную `BooleanProperty` типа.
```java
public static final BooleanProperty UPPER = BooleanProperty.create("upper");
```

Добавим в конструктор стандартное значение для данной переменной.
```java
this.setDefaultState(this.stateContainer.getBaseState().with(UPPER, Boolean.valueOf(false)));
```

Если хотим больше одного типа прописать, то делаем это так:
```java
this.setDefaultState(this.stateContainer.getBaseState().with(UPPER, Boolean.valueOf(false)).with(OTHER_STATE, Base_Value));
```

Давайте сделаем простой пример использования переменной `BooleanProperty`. Добавим в класс нашего блока метод `getActualState`, `getStateFromMeta`, `getMetaFromState`.
```java
@Override
public IBlockState getActualState(IBlockState state, IBlockAccess worldIn, BlockPos pos)
{
    Block block = worldIn.getBlockState(pos.up()).getBlock();
    return state.withProperty(UPPER, Boolean.valueOf(block != Blocks.AIR));
}

@Override
public IBlockState getStateFromMeta(int meta)
{
    return this.getDefaultState();
}

@Override
public int getMetaFromState(IBlockState state)
{
    return 0;
}
```

Зарегистрируем состояние блоков.
```java
@Override
protected BlockStateContainer createBlockState()
{
    return new BlockStateContainer(this, new IProperty[] {UPPER});
}
```

Перейдём в папку `blockstates` и откроем файл с названием нашего блока
```json
{
    "variants": {
        "upper=false": { "model": "tut:best_stone" },
        "upper=true": { "model": "tut:best_stone_up" }
    }
}
```

Вы могли заметить, что вместо `normal` стоит наша переменная с двумя значениями `true` и `false`. А так же указаны модели для состояния `upper=false` и `upper=true`. Зайдём в игру и поставим на наши камни любой блок, откроем меню отладки на кнопку F3 и наведём на наш блок камней и увидим, что значение `upper` стоит на `true`.

## PropertyEnum

TODO

## PropertyInteger

TODO