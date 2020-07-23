description: Создание своего предмета, который может использоваться в печке.

# Предмет с временем горения

Автор статьи — [Doc](https://forum.mcmodding.ru/members/doc.7271/).

Рабочий тестовый мод с материалами данной статьи можно скачать [здесь](images/customfuel.rar).

Данный мини-ресурс дает возможность добавить свой предмет как вид топлива для печки или механизма, который использует `TileEntityFurnace#getItemBurnTime`.
Почти вся основная информация расписана в самом коде.
Как минимум нужно знать как зарегистрировать эвент/предмет/блок!

Начнем.

Для добавления времени топлива к предмету есть 3 разных варианта.
Разберем все 3. Но какой лучше - скорее всего 1-ый.

## Вариант 1
Переопределение метода `getItemBurnTime` у предмета.
```java
@Override
public int getItemBurnTime(ItemStack itemStack) { // Переопределение времени горения.
    return 200; //200 - это кол-во тиков за 1 предмет. 400 - это 2 предмета, 600 - это 3 и так далее!
}
```

## Вариант 2
Изменение через эвент получения времени горения.
```java
@SubscribeEvent
public static void fuel(FurnaceFuelBurnTimeEvent e) { // Эвент получения времени горения.
    if (e.getItemStack().getItem() == TMRegistry.itemWithFuel) // Проверка на наш предмет.
        e.setBurnTime(200); // Установка времени горения. Отменять эвент не нужно, т.к. он сам это уже делает.
}
```

## Вариант 3
Изменение через унаследования `IFuelHandler`.
В 1.12.2 данный метод считается Deprecated.
Для данного метода нужно создать класс, который будет наследован от `IFuelHandler`, так же его нужно регистрировать.
Класс:
```java
public class FuelHandler implements IFuelHandler { // Унаследование от обработчика времени топлива.

    @Override
    public int getBurnTime(ItemStack fuel) { // Сюда передается сам предмет, который проверяется на горение.
        if (fuel.getItem() == TMRegistry.itemWithFuel) // Проверка на наш предмет.
            return 200; // Установка времени горения.
        return 0;
    }
}
```

И сама регистарция.
Она должна быть в инициализации мода. (`FMLInitializationEvent`)
```java 
GameRegistry.registerFuelHandler(new FuelHandler()); // Регистрация самого обработчика времени топлива.
```

Так же что бы удалить предмет как топливо можно использовать вариант 2.
```java
@SubscribeEvent
public static void fuel(FurnaceFuelBurnTimeEvent e) { // Эвент получения времени горения.
    if (e.getItemStack().getItem() == Items.COAL) // Проверка на удаляемый предмет.
        e.setBurnTime(0); // Установка времени горения.
}
```

## Блок
Для добавление блоку время горения нужно заменить:
`if (fuel.getItem() == TMRegistry.itemWithFuel)`
На
`if (fuel.getItem() == Item.getItemFromBlock(BLOCK))`
В место BLOCK указать Ваш блок.
Если делать через вариант 1, то переопределять метод нужно у ItemBlock'а блока.

## Итог
Для проверки можно просто попробовать "запустить" печку или же использовать JEI:

[![Демонстрация предмета с временем горения - 1](images/burning_item_demonstration_1.png){: .w6 }](images/burning_item_demonstration_1.png)

[![Демонстрация предмета с временем горения - 2](images/burning_item_demonstration_2.png){: .w6 }](images/burning_item_demonstration_2.png)