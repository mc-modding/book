description: Редкость предмета

# Редкость

## Добавление редкости к предмету

В игре существует четыре типа редкости:

1. `common` - белый цвет названия предмета
2. `uncommon` - жёлтый цвет
3. `rare` - аквамариновый цвет(золотое яблоко)
4. `epic` - ярко-розовый цвет(золотое магическое яблоко)

!!! info "Примечание"
    Сама редкость, кроме цвета названия, ни на что не влияет.

![Золотое яблоко](images/rarity/example_apple.png)

![Золотое магическое яблоко](images/rarity/example_apple_magic.png)

Чтобы добавить редкость к своему предмету, необходимо переопределить метод `Item#getRarity(ItemStack)`. Зададим нашему
кольцу тип редкости `rare`.

```java
public class RingItem extends Item {
    /**
     * Обрабатывает редкость для предмета.
     *
     * @param stack Стэк содержащий предмет класса RingItem.
     * @return Возвращает редкость.
     */
    @Override
    public EnumRarity getRarity(ItemStack stack) {
        return EnumRarity.rare;
    }
}
```

![Кольцо с редкостью](images/rarity/ring_rare.png)

## Собственная редкость

Поскольку в игре имеется всего четыре типа редкости, то давайте добавим свой тип редкости, скажем легендарный.

Создадим переменную в `ModItems`:

```java
public class ModItems {
    public static final EnumRarity LEGENDARY_RARITY = EnumHelper.addRarity("mcmodding:legendary", EnumChatFormatting.RED, "Legendary");
}
```

Ознакомимся с параметрами метода `EnumHelper#addRarity(String, EnumChatFormatting, String)`

1. Название редкости, в нашем случае будет `mcmodding:legendary`. Рекомендуется добавлять `ModId` перед названием, чтобы случайно не заменить редкость из других модов!
2. Цвет редкости.
3. Отображаемое имя(не используется самой игрой)

Вернём нашу редкость в методе `Item#getRarity(ItemStack)`:

```java
public class RingItem extends Item {
    @Override
    public EnumRarity getRarity(ItemStack stack) {
        return ModItems.LEGENDARY_RARITY;
    }
}
```

![Кольцо с легендарной редкостью](images/rarity/ring_legendary.png)